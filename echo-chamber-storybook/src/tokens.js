// Figma variables JSON → CSS custom properties.
//
// Deliberately forgiving about the export shape, so it works with whatever the
// Variables-to-JSON export produces:
//   - tokens are any object with `$value` (or `value`)
//   - collection and mode names can appear anywhere in the path, or in the file name
//   - aliases look like "{orange.hue}" or "{Primitives.orange.hue}"
//   - colours can be hex strings, {r,g,b,a} (0–1) or {components:[...], alpha, hex}
//
// tokens.config.json says which names are modes (product / theme) and which
// names are just collection wrappers to drop from the variable name.

const slug = (s) => String(s).trim().replace(/\s+/g, '-').replace(/\//g, '-').toLowerCase();

const isColourObject = (v) => v && typeof v === 'object' && ('hex' in v || 'components' in v || 'r' in v);
// A token is an object with $value, or with a `value` that is a plain value
// (not a group that happens to be called "value", like knob/font-size/value).
const isToken = (o) =>
  o && typeof o === 'object' &&
  ('$value' in o || ('value' in o && (typeof o.value !== 'object' || isColourObject(o.value))));

// Figma weight names → CSS numbers.
const WEIGHTS = { thin: 100, extralight: 200, light: 300, regular: 400, normal: 400, medium: 500,
  semibold: 600, bold: 700, extrabold: 800, black: 900 };

function hexFromColor(c) {
  if (typeof c === 'string') return c;
  if (c.hex) return c.hex;
  const [r, g, b] = c.components ?? [c.r, c.g, c.b];
  const a = c.alpha ?? c.a ?? 1;
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return '#' + to(r) + to(g) + to(b) + (a < 1 ? to(a) : '');
}

export function buildCss(files, config) {
  // Mode and collection names match case-insensitively ("Ember" = "ember").
  const modeOf = {}, modeName = {};
  for (const [axis, names] of Object.entries(config.modes))
    for (const n of names) { modeOf[slug(n)] = axis; modeName[slug(n)] = n; }
  const ignore = new Set(config.ignore.map(slug));
  const ignoreRe = config.ignorePattern ? new RegExp(config.ignorePattern, 'i') : null;
  const skip = (s) => ignore.has(slug(s)) || (ignoreRe && ignoreRe.test(s));

  // Split a path into { name, axis, mode }.
  const parse = (segments) => {
    let axis = null, mode = null;
    const kept = [];
    segments.forEach((s, i) => {
      // Modes sit near the top too (collection › mode › token), so a token
      // that is itself called "light" (a font weight) isn't read as a mode.
      if (i < 2 && !axis && modeOf[slug(s)]) { axis = modeOf[slug(s)]; mode = modeName[slug(s)]; return; }
      // Collection and single-mode names only appear at the top of a path,
      // so "type" or "value" deeper down (button/type/…) are kept.
      if (i < 2 && skip(s)) return;
      kept.push(slug(s));
    });
    return { name: kept.join('-'), axis, mode };
  };

  const blocks = {}; // key "" for :root, or "product:Tide" etc.
  const source = {}; // token name → top-level collection it came from
  const add = (axis, mode, name, value, from) => {
    const key = axis ? `${axis}:${mode}` : '';
    (blocks[key] ??= {})[name] = value;
    if (!axis) source[name] = from;
  };

  const formatValue = (name, token) => {
    const raw = token.$value ?? token.value;
    const type = token.$type ?? token.type;
    if (typeof raw === 'string' && /^\{.+\}$/.test(raw)) {
      return `var(--${parse(raw.slice(1, -1).split('.')).name})`;
    }
    if (type === 'color' || (raw && typeof raw === 'object')) return hexFromColor(raw);
    if (/weight/.test(name)) {
      const w = WEIGHTS[slug(raw).replace(/[-\s]/g, '')];
      if (w) return String(w);
      if (typeof raw === 'number') return String(raw);
    }
    if (typeof raw === 'number') return name.endsWith('ratio') ? String(raw) : `${raw}px`;
    if (typeof raw === 'string' && (/family/.test(name) || (/^font-/.test(name) && /[a-z] [a-z]/i.test(raw)))) return `"${raw}"`;
    return String(raw);
  };

  for (const [fileName, json] of Object.entries(files)) {
    // The file name only counts if it names a mode (e.g. "Product.Tide.tokens.json").
    const fileMode = fileName.replace(/\.json$/, '').split(/[./\\]/).filter((s) => modeOf[slug(s)]);
    const walk = (node, path) => {
      if (isToken(node)) {
        const { name, axis, mode } = parse([...fileMode, ...path]);
        if (name) add(axis, mode, name, formatValue(name, node), path[0]);
        return;
      }
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) if (!k.startsWith('$')) walk(v, [...path, k]);
      }
    };
    walk(json, []);
  }

  // Some exports flatten aliases: a component token that points at
  // color/primary arrives as plain #ff7a3d (the default mode's value), so it
  // never changes with the product or theme. Reconnect it: find the moded
  // token that had that exact value in the default mode and point to it.
  // Ties go to the earlier axis in config.modes, then to names matching
  // config.relink.prefer, then to the first one exported. When two tokens
  // share a value and the guess is wrong, config.relink.pins names the
  // right one (token → target, both as CSS names without the --).
  if (config.relink) {
    const from = new RegExp(config.relink.collections, 'i');
    const prefer = (config.relink.prefer ?? []).map((p) => new RegExp(p, 'i'));
    const candidates = []; // [{ name, value, rank }]
    Object.entries(config.modes).forEach(([axis, names], axisIndex) => {
      for (const [name, value] of Object.entries(blocks[`${axis}:${names[0]}`] ?? {})) {
        const preferIndex = prefer.findIndex((re) => re.test(name));
        candidates.push({ name, value: String(value).toLowerCase(), rank: [axisIndex, preferIndex < 0 ? prefer.length : preferIndex] });
      }
    });
    const byRank = (a, b) => a.rank[0] - b.rank[0] || a.rank[1] - b.rank[1];
    for (const [name, value] of Object.entries(blocks[''] ?? {})) {
      if (!from.test(source[name] ?? '') || !/^#[0-9a-f]{3,8}$/i.test(value)) continue;
      // A pinned link (written down from Figma) wins over guessing.
      const pinned = config.relink.pins?.[name];
      if (pinned) { blocks[''][name] = `var(--${pinned})`; continue; }
      const match = candidates.filter((c) => c.value === value.toLowerCase()).sort(byRank)[0];
      if (match) blocks[''][name] = `var(--${match.name})`;
    }
  }

  // The first mode of each axis is the default, so it also goes on :root.
  const decl = (obj) => Object.entries(obj).map(([k, v]) => `  --${k}: ${v};`).join('\n');
  let css = `:root {\n${decl(blocks[''] ?? {})}\n}\n`;
  for (const [axis, names] of Object.entries(config.modes)) {
    names.forEach((m, i) => {
      const b = blocks[`${axis}:${m}`];
      if (!b) return;
      const sel = i === 0 ? `:root, [data-${axis}="${slug(m)}"]` : `[data-${axis}="${slug(m)}"]`;
      css += `${sel} {\n${decl(b)}\n}\n`;
    });
  }
  return css;
}