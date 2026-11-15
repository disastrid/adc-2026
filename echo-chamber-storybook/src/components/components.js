// Same components as the Figma file (Components page), as plain HTML.
// Every colour, size and gap is a CSS variable from the Figma export.

const paths = {
  play: '<path d="M8 5L19 12L8 19Z"/>',
  pause: '<path d="M9 6V18M15 6V18"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  record: '<circle cx="12" cy="12" r="6"/>',
  loop: '<path d="M4 11V9C4 7.3 5.3 6 7 6H19M16 3L19 6L16 9M20 13V15C20 16.7 18.7 18 17 18H5M8 21L5 18L8 15"/>',
  power: '<path d="M12 3V11M7 6.5C4 8.6 3.3 12.7 5.4 15.7C7.5 18.7 11.6 19.4 14.6 17.3C17.6 15.2 18.3 11.1 16.2 8.1C15.8 7.5 15.4 7 14.9 6.6"/>',
  plus: '<path d="M12 5V19M5 12H19"/>',
  minus: '<path d="M5 12H19"/>',
  close: '<path d="M6 6L18 18M18 6L6 18"/>',
  'chevron-down': '<path d="M6 9L12 15L18 9"/>',
  volume: '<path d="M4 9V15H8L13 19V5L8 9H4ZM16.5 8.5C18.5 10.5 18.5 13.5 16.5 15.5"/>',
  sliders: '<path d="M4 7H13M17 7H20M15 4.5V9.5M4 17H7M11 17H20M9 14.5V19.5"/>',
};
export const iconNames = Object.keys(paths);

export const Icon = (name, size = 20) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] ?? ''}</svg>`;

// style: primary | secondary | tertiary · size: large | medium · slim: less vertical padding
export const Button = ({ label = 'Button', style = 'primary', size = 'large', slim = false, icon = null, disabled = false }) =>
  `<button class="btn btn--${style} btn--${size}${slim ? ' btn--slim' : ''}" ${disabled ? 'disabled' : ''}>${icon ? Icon(icon, 16) : ''}<span>${label}</span></button>`;

export const IconButton = ({ icon = 'play', style = 'filled', active = false, disabled = false, label = icon }) =>
  `<button class="icon-btn icon-btn--${style} ${active ? 'is-active' : ''}" aria-label="${label}" aria-pressed="${active}" ${disabled ? 'disabled' : ''}>${Icon(icon, 20)}</button>`;

export const Toggle = ({ label = 'Sync', on = true, disabled = false }) =>
  `<label class="toggle"><input type="checkbox" role="switch" ${on ? 'checked' : ''} ${disabled ? 'disabled' : ''}/><span class="toggle__track"><span class="toggle__thumb"></span></span>${label ? `<span class="toggle__label">${label}</span>` : ''}</label>`;

// Knob ----------------------------------------------------------------
// value is 0–1. The readout is either a list of steps (e.g. note lengths)
// or a number between min and max with a unit.
// Drag up/down to turn (Shift = fine), arrow keys work, double-click resets.

const knobGeometry = (d, value) => {
  const t = d * 0.08, c = d / 2, b = d * 0.66;
  const a = (135 + 270 * value) * (Math.PI / 180);
  const p = (k) => [c + Math.cos(a) * b * k, c + Math.sin(a) * b * k];
  return { t, c, b, r: d / 2 - t / 2, arc: 270 * value, p1: p(0.12), p2: p(0.42) };
};

const formatKnob = (value, { steps, min = 0, max = 100, unit = '%' }) => {
  if (steps) return steps[Math.round(value * (steps.length - 1))];
  // Frequencies turn on a log scale, like real filter knobs.
  const v = unit === 'Hz' ? min * (max / min) ** value : min + (max - min) * value;
  if (unit === 'Hz' && v >= 1000) return `${(v / 1000).toFixed(1)} kHz`;
  return `${Math.round(v)}${unit === '%' ? '%' : ` ${unit}`}`;
};

// colour: primary | secondary | tertiary
export const Knob = ({ label = 'Mix', value = 0.65, size = 'large', colour = 'primary', disabled = false, steps, min, max, unit }) => {
  const d = size === 'large' ? 64 : 40;
  const g = knobGeometry(d, value);
  const fmt = { steps, min, max, unit };
  const ring = (cls, len) =>
    `<circle class="${cls}" cx="${g.c}" cy="${g.c}" r="${g.r}" pathLength="360" stroke-width="${g.t}" stroke-dasharray="${len} 360" transform="rotate(135 ${g.c} ${g.c})"/>`;
  const display = formatKnob(value, fmt);
  return `<div class="knob knob--${colour} knob--${size}${disabled ? ' is-disabled' : ''}" role="slider" tabindex="${disabled ? -1 : 0}" ${disabled ? 'aria-disabled="true"' : ''} aria-label="${label}"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(value * 100)}" aria-valuetext="${display}"
      data-size="${d}" data-value="${value}" data-default="${value}" data-format='${JSON.stringify(fmt)}'>
    <svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}">
      ${ring('knob__track', 270)}${ring('knob__value', g.arc)}
      <circle class="knob__body" cx="${g.c}" cy="${g.c}" r="${g.b / 2 - 0.5}"/>
      <line class="knob__pointer" x1="${g.p1[0]}" y1="${g.p1[1]}" x2="${g.p2[0]}" y2="${g.p2[1]}"/>
    </svg>
    <span class="knob__value-text">${display}</span>
    <span class="knob__label">${label}</span>
  </div>`;
};

function setKnob(el, value) {
  value = Math.min(1, Math.max(0, value));
  const fmt = JSON.parse(el.dataset.format);
  if (fmt.steps) value = Math.round(value * (fmt.steps.length - 1)) / (fmt.steps.length - 1);
  const g = knobGeometry(+el.dataset.size, value);
  el.dataset.value = value;
  el.querySelector('.knob__value').setAttribute('stroke-dasharray', `${g.arc} 360`);
  const line = el.querySelector('.knob__pointer');
  line.setAttribute('x1', g.p1[0]); line.setAttribute('y1', g.p1[1]);
  line.setAttribute('x2', g.p2[0]); line.setAttribute('y2', g.p2[1]);
  const text = formatKnob(value, fmt);
  el.querySelector('.knob__value-text').textContent = text;
  el.setAttribute('aria-valuenow', Math.round(value * 100));
  el.setAttribute('aria-valuetext', text);
  el.dispatchEvent(new CustomEvent('knobchange', { bubbles: true, detail: { value } }));
}

// One set of listeners for every knob on the page, added once.
if (typeof document !== 'undefined' && !window.__knobBehaviour) {
  window.__knobBehaviour = true;
  // For stepped knobs (e.g. note lengths) a drag keeps the exact position so it
  // doesn't stick between steps; the snap only happens in what's drawn.
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.knob');
    if (!el || el.classList.contains('is-disabled')) return;
    e.preventDefault();
    el.focus({ focusVisible: false });
    el.classList.add('is-active');
    const startY = e.clientY;
    let raw = +el.dataset.value;
    let lastY = startY;
    const move = (ev) => {
      raw = Math.min(1, Math.max(0, raw + (lastY - ev.clientY) / (ev.shiftKey ? 600 : 150)));
      lastY = ev.clientY;
      setKnob(el, raw);
    };
    const up = () => {
      el.classList.remove('is-active');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
  document.addEventListener('dblclick', (e) => {
    const el = e.target.closest('.knob');
    if (el && !el.classList.contains('is-disabled')) setKnob(el, +el.dataset.default);
  });
  document.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('.knob');
    if (!el || el.classList.contains('is-disabled')) return;
    const fmt = JSON.parse(el.dataset.format);
    const step = fmt.steps ? 1 / (fmt.steps.length - 1) : e.shiftKey ? 0.1 : 0.01;
    const keys = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step };
    if (e.key in keys) setKnob(el, +el.dataset.value + keys[e.key]);
    else if (e.key === 'Home') setKnob(el, 0);
    else if (e.key === 'End') setKnob(el, 1);
    else return;
    e.preventDefault();
  });
}

// Slider ----------------------------------------------------------------
// type: primary | secondary | tertiary. value is 0–1.
// Click or drag along the track; arrow keys work; Active state while dragging.
export const Slider = ({ label = 'Slider', value = 0, type = 'primary', disabled = false }) =>
  `<div class="slider slider--${type}${disabled ? ' is-disabled' : ''}" role="slider" tabindex="${disabled ? -1 : 0}"
      aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(value * 100)}"
      ${disabled ? 'aria-disabled="true"' : ''} data-value="${value}" style="--value:${value}">
    <span class="slider__thumb"></span>
  </div>`;

function setSlider(el, value) {
  value = Math.min(1, Math.max(0, value));
  el.dataset.value = value;
  el.style.setProperty('--value', value);
  el.setAttribute('aria-valuenow', Math.round(value * 100));
  el.dispatchEvent(new CustomEvent('sliderchange', { bubbles: true, detail: { value } }));
}

if (typeof document !== 'undefined' && !window.__sliderBehaviour) {
  window.__sliderBehaviour = true;
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.slider');
    if (!el || el.classList.contains('is-disabled')) return;
    e.preventDefault();
    el.focus({ focusVisible: false });
    el.classList.add('is-active');
    const thumb = el.querySelector('.slider__thumb').offsetWidth;
    const at = (x) => {
      const r = el.getBoundingClientRect();
      setSlider(el, (x - r.left - thumb / 2) / (r.width - thumb));
    };
    at(e.clientX);
    const move = (ev) => at(ev.clientX);
    const up = () => {
      el.classList.remove('is-active');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
  document.addEventListener('keydown', (e) => {
    const el = e.target.closest?.('.slider');
    if (!el || el.classList.contains('is-disabled')) return;
    const step = e.shiftKey ? 0.1 : 0.01;
    const keys = { ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step };
    if (e.key in keys) setSlider(el, +el.dataset.value + keys[e.key]);
    else if (e.key === 'Home') setSlider(el, 0);
    else if (e.key === 'End') setSlider(el, 1);
    else return;
    e.preventDefault();
  });
}
// Soar Machine -----------------------------------------------------------
// A small plugin panel built only from the components above
// (Figma: soar-machine). Every value comes from soar-machine/* or Tier 2 tokens.
export const SoarMachine = ({ title = 'SOAR MACHINE' } = {}) => `<section class="soar">
  <h1 class="soar__title">${title}</h1>
  <div class="soar__toggles">
    ${Toggle({ label: 'Lift', on: true })}${Toggle({ label: 'Space', on: true })}${Toggle({ label: 'Airiness', on: true })}
  </div>
  <div class="soar__controls">
    ${Knob({ label: 'Mix', value: 0.65, size: 'large', colour: 'primary' })}
    <div class="soar__sliders">
      <div class="soar__slider-group"><span class="soar__label">INTENSITY</span>${Slider({ label: 'Intensity', type: 'primary', value: 0 })}</div>
      <div class="soar__slider-group"><span class="soar__label">DREAMINESS</span>${Slider({ label: 'Dreaminess', type: 'primary', value: 0 })}</div>
    </div>
  </div>
  <div class="soar__actions">
    <span data-soar="fly">${Button({ label: 'Flap wings', style: 'primary', size: 'large' })}</span><span data-soar="land">${Button({ label: 'Land', style: 'tertiary', size: 'large' })}</span>
  </div>
</section>`;

// Land disables every control in the panel (and Land itself) until
// Flap wings is pressed again. Uses each component's own Disabled state.
function setLanded(panel, landed) {
  panel.classList.toggle('is-landed', landed);
  panel.querySelectorAll('.toggle input').forEach((i) => { i.disabled = landed; });
  panel.querySelectorAll('.slider, .knob').forEach((el) => {
    el.classList.toggle('is-disabled', landed);
    el.setAttribute('tabindex', landed ? '-1' : '0');
    if (landed) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled');
  });
  panel.querySelector('[data-soar="land"] button').disabled = landed;
}
if (typeof document !== 'undefined' && !window.__soarBehaviour) {
  window.__soarBehaviour = true;
  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-soar]');
    const panel = action?.closest('.soar');
    if (!panel || action.querySelector('button')?.disabled) return;
    setLanded(panel, action.dataset.soar === 'land');
  });
}
