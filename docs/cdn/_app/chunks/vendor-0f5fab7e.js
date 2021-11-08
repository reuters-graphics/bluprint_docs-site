var me = Object.defineProperty;
var ue = Object.getOwnPropertySymbols;
var ge = Object.prototype.hasOwnProperty,
  ve = Object.prototype.propertyIsEnumerable;
var de = (e, t, r) =>
    t in e
      ? me(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (e[t] = r),
  pe = (e, t) => {
    for (var r in t || (t = {})) ge.call(t, r) && de(e, r, t[r]);
    if (ue) for (var r of ue(t)) ve.call(t, r) && de(e, r, t[r]);
    return e;
  };
function noop() {}
function assign(e, t) {
  for (const r in t) e[r] = t[r];
  return e;
}
function run(e) {
  return e();
}
function blank_object() {
  return Object.create(null);
}
function run_all(e) {
  e.forEach(run);
}
function is_function(e) {
  return typeof e == 'function';
}
function safe_not_equal(e, t) {
  return e != e
    ? t == t
    : e !== t || (e && typeof e == 'object') || typeof e == 'function';
}
let src_url_equal_anchor;
function src_url_equal(e, t) {
  return (
    src_url_equal_anchor ||
      (src_url_equal_anchor = document.createElement('a')),
    (src_url_equal_anchor.href = t),
    e === src_url_equal_anchor.href
  );
}
function is_empty(e) {
  return Object.keys(e).length === 0;
}
function subscribe(e, ...t) {
  if (e == null) return noop;
  const r = e.subscribe(...t);
  return r.unsubscribe ? () => r.unsubscribe() : r;
}
function component_subscribe(e, t, r) {
  e.$$.on_destroy.push(subscribe(t, r));
}
function create_slot(e, t, r, i) {
  if (e) {
    const s = get_slot_context(e, t, r, i);
    return e[0](s);
  }
}
function get_slot_context(e, t, r, i) {
  return e[1] && i ? assign(r.ctx.slice(), e[1](i(t))) : r.ctx;
}
function get_slot_changes(e, t, r, i) {
  if (e[2] && i) {
    const s = e[2](i(r));
    if (t.dirty === void 0) return s;
    if (typeof s == 'object') {
      const n = [],
        l = Math.max(t.dirty.length, s.length);
      for (let u = 0; u < l; u += 1) n[u] = t.dirty[u] | s[u];
      return n;
    }
    return t.dirty | s;
  }
  return t.dirty;
}
function update_slot_base(e, t, r, i, s, n) {
  if (s) {
    const l = get_slot_context(t, r, i, n);
    e.p(l, s);
  }
}
function get_all_dirty_from_scope(e) {
  if (e.ctx.length > 32) {
    const t = [],
      r = e.ctx.length / 32;
    for (let i = 0; i < r; i++) t[i] = -1;
    return t;
  }
  return -1;
}
function null_to_empty(e) {
  return e == null ? '' : e;
}
let is_hydrating = !1;
function start_hydrating() {
  is_hydrating = !0;
}
function end_hydrating() {
  is_hydrating = !1;
}
function upper_bound(e, t, r, i) {
  for (; e < t; ) {
    const s = e + ((t - e) >> 1);
    r(s) <= i ? (e = s + 1) : (t = s);
  }
  return e;
}
function init_hydrate(e) {
  if (e.hydrate_init) return;
  e.hydrate_init = !0;
  let t = e.childNodes;
  if (e.nodeName === 'HEAD') {
    const d = [];
    for (let v = 0; v < t.length; v++) {
      const E = t[v];
      E.claim_order !== void 0 && d.push(E);
    }
    t = d;
  }
  const r = new Int32Array(t.length + 1),
    i = new Int32Array(t.length);
  r[0] = -1;
  let s = 0;
  for (let d = 0; d < t.length; d++) {
    const v = t[d].claim_order,
      E =
        (s > 0 && t[r[s]].claim_order <= v
          ? s + 1
          : upper_bound(1, s, (m) => t[r[m]].claim_order, v)) - 1;
    i[d] = r[E] + 1;
    const _ = E + 1;
    (r[_] = d), (s = Math.max(_, s));
  }
  const n = [],
    l = [];
  let u = t.length - 1;
  for (let d = r[s] + 1; d != 0; d = i[d - 1]) {
    for (n.push(t[d - 1]); u >= d; u--) l.push(t[u]);
    u--;
  }
  for (; u >= 0; u--) l.push(t[u]);
  n.reverse(), l.sort((d, v) => d.claim_order - v.claim_order);
  for (let d = 0, v = 0; d < l.length; d++) {
    for (; v < n.length && l[d].claim_order >= n[v].claim_order; ) v++;
    const E = v < n.length ? n[v] : null;
    e.insertBefore(l[d], E);
  }
}
function append_hydration(e, t) {
  if (is_hydrating) {
    for (
      init_hydrate(e),
        (e.actual_end_child === void 0 ||
          (e.actual_end_child !== null &&
            e.actual_end_child.parentElement !== e)) &&
          (e.actual_end_child = e.firstChild);
      e.actual_end_child !== null && e.actual_end_child.claim_order === void 0;

    )
      e.actual_end_child = e.actual_end_child.nextSibling;
    t !== e.actual_end_child
      ? (t.claim_order !== void 0 || t.parentNode !== e) &&
        e.insertBefore(t, e.actual_end_child)
      : (e.actual_end_child = t.nextSibling);
  } else (t.parentNode !== e || t.nextSibling !== null) && e.appendChild(t);
}
function insert(e, t, r) {
  e.insertBefore(t, r || null);
}
function insert_hydration(e, t, r) {
  is_hydrating && !r
    ? append_hydration(e, t)
    : (t.parentNode !== e || t.nextSibling != r) &&
      e.insertBefore(t, r || null);
}
function detach(e) {
  e.parentNode.removeChild(e);
}
function destroy_each(e, t) {
  for (let r = 0; r < e.length; r += 1) e[r] && e[r].d(t);
}
function element(e) {
  return document.createElement(e);
}
function svg_element(e) {
  return document.createElementNS('http://www.w3.org/2000/svg', e);
}
function text(e) {
  return document.createTextNode(e);
}
function space() {
  return text(' ');
}
function empty() {
  return text('');
}
function listen(e, t, r, i) {
  return e.addEventListener(t, r, i), () => e.removeEventListener(t, r, i);
}
function attr(e, t, r) {
  r == null
    ? e.removeAttribute(t)
    : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
function children(e) {
  return Array.from(e.childNodes);
}
function init_claim_info(e) {
  e.claim_info === void 0 &&
    (e.claim_info = { last_index: 0, total_claimed: 0 });
}
function claim_node(e, t, r, i, s = !1) {
  init_claim_info(e);
  const n = (() => {
    for (let l = e.claim_info.last_index; l < e.length; l++) {
      const u = e[l];
      if (t(u)) {
        const d = r(u);
        return (
          d === void 0 ? e.splice(l, 1) : (e[l] = d),
          s || (e.claim_info.last_index = l),
          u
        );
      }
    }
    for (let l = e.claim_info.last_index - 1; l >= 0; l--) {
      const u = e[l];
      if (t(u)) {
        const d = r(u);
        return (
          d === void 0 ? e.splice(l, 1) : (e[l] = d),
          s
            ? d === void 0 && e.claim_info.last_index--
            : (e.claim_info.last_index = l),
          u
        );
      }
    }
    return i();
  })();
  return (
    (n.claim_order = e.claim_info.total_claimed),
    (e.claim_info.total_claimed += 1),
    n
  );
}
function claim_element_base(e, t, r, i) {
  return claim_node(
    e,
    (s) => s.nodeName === t,
    (s) => {
      const n = [];
      for (let l = 0; l < s.attributes.length; l++) {
        const u = s.attributes[l];
        r[u.name] || n.push(u.name);
      }
      n.forEach((l) => s.removeAttribute(l));
    },
    () => i(t)
  );
}
function claim_element(e, t, r) {
  return claim_element_base(e, t, r, element);
}
function claim_svg_element(e, t, r) {
  return claim_element_base(e, t, r, svg_element);
}
function claim_text(e, t) {
  return claim_node(
    e,
    (r) => r.nodeType === 3,
    (r) => {
      const i = '' + t;
      if (r.data.startsWith(i)) {
        if (r.data.length !== i.length) return r.splitText(i.length);
      } else r.data = i;
    },
    () => text(t),
    !0
  );
}
function claim_space(e) {
  return claim_text(e, ' ');
}
function find_comment(e, t, r) {
  for (let i = r; i < e.length; i += 1) {
    const s = e[i];
    if (s.nodeType === 8 && s.textContent.trim() === t) return i;
  }
  return e.length;
}
function claim_html_tag(e) {
  const t = find_comment(e, 'HTML_TAG_START', 0),
    r = find_comment(e, 'HTML_TAG_END', t);
  if (t === r) return new HtmlTagHydration();
  init_claim_info(e);
  const i = e.splice(t, r + 1);
  detach(i[0]), detach(i[i.length - 1]);
  const s = i.slice(1, i.length - 1);
  for (const n of s)
    (n.claim_order = e.claim_info.total_claimed),
      (e.claim_info.total_claimed += 1);
  return new HtmlTagHydration(s);
}
function set_data(e, t) {
  (t = '' + t), e.wholeText !== t && (e.data = t);
}
function toggle_class(e, t, r) {
  e.classList[r ? 'add' : 'remove'](t);
}
function query_selector_all(e, t = document.body) {
  return Array.from(t.querySelectorAll(e));
}
class HtmlTag {
  constructor() {
    this.e = this.n = null;
  }
  c(t) {
    this.h(t);
  }
  m(t, r, i = null) {
    this.e || ((this.e = element(r.nodeName)), (this.t = r), this.c(t)),
      this.i(i);
  }
  h(t) {
    (this.e.innerHTML = t), (this.n = Array.from(this.e.childNodes));
  }
  i(t) {
    for (let r = 0; r < this.n.length; r += 1) insert(this.t, this.n[r], t);
  }
  p(t) {
    this.d(), this.h(t), this.i(this.a);
  }
  d() {
    this.n.forEach(detach);
  }
}
class HtmlTagHydration extends HtmlTag {
  constructor(t) {
    super();
    (this.e = this.n = null), (this.l = t);
  }
  c(t) {
    this.l ? (this.n = this.l) : super.c(t);
  }
  i(t) {
    for (let r = 0; r < this.n.length; r += 1)
      insert_hydration(this.t, this.n[r], t);
  }
}
let current_component;
function set_current_component(e) {
  current_component = e;
}
function get_current_component() {
  if (!current_component)
    throw new Error('Function called outside component initialization');
  return current_component;
}
function onMount(e) {
  get_current_component().$$.on_mount.push(e);
}
function afterUpdate(e) {
  get_current_component().$$.after_update.push(e);
}
function setContext(e, t) {
  get_current_component().$$.context.set(e, t);
}
function getContext(e) {
  return get_current_component().$$.context.get(e);
}
const dirty_components = [],
  binding_callbacks = [],
  render_callbacks = [],
  flush_callbacks = [],
  resolved_promise = Promise.resolve();
let update_scheduled = !1;
function schedule_update() {
  update_scheduled || ((update_scheduled = !0), resolved_promise.then(flush));
}
function add_render_callback(e) {
  render_callbacks.push(e);
}
let flushing = !1;
const seen_callbacks = new Set();
function flush() {
  if (!flushing) {
    flushing = !0;
    do {
      for (let e = 0; e < dirty_components.length; e += 1) {
        const t = dirty_components[e];
        set_current_component(t), update(t.$$);
      }
      for (
        set_current_component(null), dirty_components.length = 0;
        binding_callbacks.length;

      )
        binding_callbacks.pop()();
      for (let e = 0; e < render_callbacks.length; e += 1) {
        const t = render_callbacks[e];
        seen_callbacks.has(t) || (seen_callbacks.add(t), t());
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    for (; flush_callbacks.length; ) flush_callbacks.pop()();
    (update_scheduled = !1), (flushing = !1), seen_callbacks.clear();
  }
}
function update(e) {
  if (e.fragment !== null) {
    e.update(), run_all(e.before_update);
    const t = e.dirty;
    (e.dirty = [-1]),
      e.fragment && e.fragment.p(e.ctx, t),
      e.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
let outros;
function group_outros() {
  outros = { r: 0, c: [], p: outros };
}
function check_outros() {
  outros.r || run_all(outros.c), (outros = outros.p);
}
function transition_in(e, t) {
  e && e.i && (outroing.delete(e), e.i(t));
}
function transition_out(e, t, r, i) {
  if (e && e.o) {
    if (outroing.has(e)) return;
    outroing.add(e),
      outros.c.push(() => {
        outroing.delete(e), i && (r && e.d(1), i());
      }),
      e.o(t);
  }
}
function get_spread_update(e, t) {
  const r = {},
    i = {},
    s = { $$scope: 1 };
  let n = e.length;
  for (; n--; ) {
    const l = e[n],
      u = t[n];
    if (u) {
      for (const d in l) d in u || (i[d] = 1);
      for (const d in u) s[d] || ((r[d] = u[d]), (s[d] = 1));
      e[n] = u;
    } else for (const d in l) s[d] = 1;
  }
  for (const l in i) l in r || (r[l] = void 0);
  return r;
}
function get_spread_object(e) {
  return typeof e == 'object' && e !== null ? e : {};
}
function create_component(e) {
  e && e.c();
}
function claim_component(e, t) {
  e && e.l(t);
}
function mount_component(e, t, r, i) {
  const { fragment: s, on_mount: n, on_destroy: l, after_update: u } = e.$$;
  s && s.m(t, r),
    i ||
      add_render_callback(() => {
        const d = n.map(run).filter(is_function);
        l ? l.push(...d) : run_all(d), (e.$$.on_mount = []);
      }),
    u.forEach(add_render_callback);
}
function destroy_component(e, t) {
  const r = e.$$;
  r.fragment !== null &&
    (run_all(r.on_destroy),
    r.fragment && r.fragment.d(t),
    (r.on_destroy = r.fragment = null),
    (r.ctx = []));
}
function make_dirty(e, t) {
  e.$$.dirty[0] === -1 &&
    (dirty_components.push(e), schedule_update(), e.$$.dirty.fill(0)),
    (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
}
function init(e, t, r, i, s, n, l, u = [-1]) {
  const d = current_component;
  set_current_component(e);
  const v = (e.$$ = {
    fragment: null,
    ctx: null,
    props: n,
    update: noop,
    not_equal: s,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (d ? d.$$.context : [])),
    callbacks: blank_object(),
    dirty: u,
    skip_bound: !1,
    root: t.target || d.$$.root,
  });
  l && l(v.root);
  let E = !1;
  if (
    ((v.ctx = r
      ? r(e, t.props || {}, (_, m, ...y) => {
          const c = y.length ? y[0] : m;
          return (
            v.ctx &&
              s(v.ctx[_], (v.ctx[_] = c)) &&
              (!v.skip_bound && v.bound[_] && v.bound[_](c),
              E && make_dirty(e, _)),
            m
          );
        })
      : []),
    v.update(),
    (E = !0),
    run_all(v.before_update),
    (v.fragment = i ? i(v.ctx) : !1),
    t.target)
  ) {
    if (t.hydrate) {
      start_hydrating();
      const _ = children(t.target);
      v.fragment && v.fragment.l(_), _.forEach(detach);
    } else v.fragment && v.fragment.c();
    t.intro && transition_in(e.$$.fragment),
      mount_component(e, t.target, t.anchor, t.customElement),
      end_hydrating(),
      flush();
  }
  set_current_component(d);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1), (this.$destroy = noop);
  }
  $on(t, r) {
    const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return (
      i.push(r),
      () => {
        const s = i.indexOf(r);
        s !== -1 && i.splice(s, 1);
      }
    );
  }
  $set(t) {
    this.$$set &&
      !is_empty(t) &&
      ((this.$$.skip_bound = !0), this.$$set(t), (this.$$.skip_bound = !1));
  }
}
const subscriber_queue = [];
function writable(e, t = noop) {
  let r;
  const i = new Set();
  function s(u) {
    if (safe_not_equal(e, u) && ((e = u), r)) {
      const d = !subscriber_queue.length;
      for (const v of i) v[1](), subscriber_queue.push(v, e);
      if (d) {
        for (let v = 0; v < subscriber_queue.length; v += 2)
          subscriber_queue[v][0](subscriber_queue[v + 1]);
        subscriber_queue.length = 0;
      }
    }
  }
  function n(u) {
    s(u(e));
  }
  function l(u, d = noop) {
    const v = [u, d];
    return (
      i.add(v),
      i.size === 1 && (r = t(s) || noop),
      u(e),
      () => {
        i.delete(v), i.size === 0 && (r(), (r = null));
      }
    );
  }
  return { set: s, update: n, subscribe: l };
}
let base = '',
  assets = '';
function set_paths(e) {
  (base = e.base), (assets = e.assets || base);
}
const escapeTest = /[&<>"']/,
  escapeReplace = /[&<>"']/g,
  escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/,
  escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g,
  escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  },
  getEscapeReplacement = (e) => escapeReplacements[e];
function escape$3(e, t) {
  if (t) {
    if (escapeTest.test(e))
      return e.replace(escapeReplace, getEscapeReplacement);
  } else if (escapeTestNoEncode.test(e))
    return e.replace(escapeReplaceNoEncode, getEscapeReplacement);
  return e;
}
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
function unescape$1(e) {
  return e.replace(
    unescapeTest,
    (t, r) => (
      (r = r.toLowerCase()),
      r === 'colon'
        ? ':'
        : r.charAt(0) === '#'
        ? r.charAt(1) === 'x'
          ? String.fromCharCode(parseInt(r.substring(2), 16))
          : String.fromCharCode(+r.substring(1))
        : ''
    )
  );
}
const caret = /(^|[^\[])\^/g;
function edit$1(e, t) {
  (e = e.source || e), (t = t || '');
  const r = {
    replace: (i, s) => (
      (s = s.source || s),
      (s = s.replace(caret, '$1')),
      (e = e.replace(i, s)),
      r
    ),
    getRegex: () => new RegExp(e, t),
  };
  return r;
}
const nonWordAndColonTest = /[^\w:]/g,
  originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
function cleanUrl$1(e, t, r) {
  if (e) {
    let i;
    try {
      i = decodeURIComponent(unescape$1(r))
        .replace(nonWordAndColonTest, '')
        .toLowerCase();
    } catch (s) {
      return null;
    }
    if (
      i.indexOf('javascript:') === 0 ||
      i.indexOf('vbscript:') === 0 ||
      i.indexOf('data:') === 0
    )
      return null;
  }
  t && !originIndependentUrl.test(r) && (r = resolveUrl(t, r));
  try {
    r = encodeURI(r).replace(/%25/g, '%');
  } catch (i) {
    return null;
  }
  return r;
}
const baseUrls = {},
  justDomain = /^[^:]+:\/*[^/]*$/,
  protocol = /^([^:]+:)[\s\S]*$/,
  domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
function resolveUrl(e, t) {
  baseUrls[' ' + e] ||
    (justDomain.test(e)
      ? (baseUrls[' ' + e] = e + '/')
      : (baseUrls[' ' + e] = rtrim$1(e, '/', !0))),
    (e = baseUrls[' ' + e]);
  const r = e.indexOf(':') === -1;
  return t.substring(0, 2) === '//'
    ? r
      ? t
      : e.replace(protocol, '$1') + t
    : t.charAt(0) === '/'
    ? r
      ? t
      : e.replace(domain, '$1') + t
    : e + t;
}
const noopTest$1 = { exec: function () {} };
function merge$2(e) {
  let t = 1,
    r,
    i;
  for (; t < arguments.length; t++) {
    r = arguments[t];
    for (i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
  }
  return e;
}
function splitCells$1(e, t) {
  const r = e.replace(/\|/g, (n, l, u) => {
      let d = !1,
        v = l;
      for (; --v >= 0 && u[v] === '\\'; ) d = !d;
      return d ? '|' : ' |';
    }),
    i = r.split(/ \|/);
  let s = 0;
  if (
    (i[0].trim() || i.shift(), i[i.length - 1].trim() || i.pop(), i.length > t)
  )
    i.splice(t);
  else for (; i.length < t; ) i.push('');
  for (; s < i.length; s++) i[s] = i[s].trim().replace(/\\\|/g, '|');
  return i;
}
function rtrim$1(e, t, r) {
  const i = e.length;
  if (i === 0) return '';
  let s = 0;
  for (; s < i; ) {
    const n = e.charAt(i - s - 1);
    if (n === t && !r) s++;
    else if (n !== t && r) s++;
    else break;
  }
  return e.substr(0, i - s);
}
function findClosingBracket$1(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  const r = e.length;
  let i = 0,
    s = 0;
  for (; s < r; s++)
    if (e[s] === '\\') s++;
    else if (e[s] === t[0]) i++;
    else if (e[s] === t[1] && (i--, i < 0)) return s;
  return -1;
}
function checkSanitizeDeprecation$1(e) {
  e &&
    e.sanitize &&
    !e.silent &&
    console.warn(
      'marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options'
    );
}
function repeatString$1(e, t) {
  if (t < 1) return '';
  let r = '';
  for (; t > 1; ) t & 1 && (r += e), (t >>= 1), (e += e);
  return r + e;
}
var helpers = {
  escape: escape$3,
  unescape: unescape$1,
  edit: edit$1,
  cleanUrl: cleanUrl$1,
  resolveUrl,
  noopTest: noopTest$1,
  merge: merge$2,
  splitCells: splitCells$1,
  rtrim: rtrim$1,
  findClosingBracket: findClosingBracket$1,
  checkSanitizeDeprecation: checkSanitizeDeprecation$1,
  repeatString: repeatString$1,
};
const { noopTest, edit, merge: merge$1 } = helpers,
  block$1 = {
    newline: /^(?: *(?:\n|$))+/,
    code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    fences:
      /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
    html: '^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: noopTest,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    _paragraph:
      /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
    text: /^[^\n]+/,
  };
block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
block$1.def = edit(block$1.def)
  .replace('label', block$1._label)
  .replace('title', block$1._title)
  .getRegex();
block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
block$1.listItemStart = edit(/^( *)(bull) */)
  .replace('bull', block$1.bullet)
  .getRegex();
block$1.list = edit(block$1.list)
  .replace(/bull/g, block$1.bullet)
  .replace(
    'hr',
    '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))'
  )
  .replace('def', '\\n+(?=' + block$1.def.source + ')')
  .getRegex();
block$1._tag =
  'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul';
block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
block$1.html = edit(block$1.html, 'i')
  .replace('comment', block$1._comment)
  .replace('tag', block$1._tag)
  .replace(
    'attribute',
    / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
  )
  .getRegex();
block$1.paragraph = edit(block$1._paragraph)
  .replace('hr', block$1.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('|lheading', '')
  .replace('blockquote', ' {0,3}>')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
  .replace(
    'html',
    '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)'
  )
  .replace('tag', block$1._tag)
  .getRegex();
block$1.blockquote = edit(block$1.blockquote)
  .replace('paragraph', block$1.paragraph)
  .getRegex();
block$1.normal = merge$1({}, block$1);
block$1.gfm = merge$1({}, block$1.normal, {
  table:
    '^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
});
block$1.gfm.table = edit(block$1.gfm.table)
  .replace('hr', block$1.hr)
  .replace('heading', ' {0,3}#{1,6} ')
  .replace('blockquote', ' {0,3}>')
  .replace('code', ' {4}[^\\n]')
  .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
  .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
  .replace(
    'html',
    '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)'
  )
  .replace('tag', block$1._tag)
  .getRegex();
block$1.pedantic = merge$1({}, block$1.normal, {
  html: edit(
    `^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`
  )
    .replace('comment', block$1._comment)
    .replace(
      /tag/g,
      '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b'
    )
    .getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  paragraph: edit(block$1.normal._paragraph)
    .replace('hr', block$1.hr)
    .replace(
      'heading',
      ` *#{1,6} *[^
]`
    )
    .replace('lheading', block$1.lheading)
    .replace('blockquote', ' {0,3}>')
    .replace('|fences', '')
    .replace('|list', '')
    .replace('|html', '')
    .getRegex(),
});
const inline$1 = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
  url: noopTest,
  tag: '^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  reflinkSearch: 'reflink|nolink(?!\\()',
  emStrong: {
    lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
    rDelimAst:
      /\_\_[^_*]*?\*[^_*]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
    rDelimUnd:
      /\*\*[^_*]*?\_[^_*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
  },
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noopTest,
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
  punctuation: /^([\spunctuation])/,
};
inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
inline$1.punctuation = edit(inline$1.punctuation)
  .replace(/punctuation/g, inline$1._punctuation)
  .getRegex();
inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
inline$1.escapedEmSt = /\\\*|\\_/g;
inline$1._comment = edit(block$1._comment)
  .replace('(?:-->|$)', '-->')
  .getRegex();
inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim)
  .replace(/punct/g, inline$1._punctuation)
  .getRegex();
inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, 'g')
  .replace(/punct/g, inline$1._punctuation)
  .getRegex();
inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, 'g')
  .replace(/punct/g, inline$1._punctuation)
  .getRegex();
inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
inline$1._email =
  /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
inline$1.autolink = edit(inline$1.autolink)
  .replace('scheme', inline$1._scheme)
  .replace('email', inline$1._email)
  .getRegex();
inline$1._attribute =
  /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
inline$1.tag = edit(inline$1.tag)
  .replace('comment', inline$1._comment)
  .replace('attribute', inline$1._attribute)
  .getRegex();
inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
inline$1.link = edit(inline$1.link)
  .replace('label', inline$1._label)
  .replace('href', inline$1._href)
  .replace('title', inline$1._title)
  .getRegex();
inline$1.reflink = edit(inline$1.reflink)
  .replace('label', inline$1._label)
  .getRegex();
inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g')
  .replace('reflink', inline$1.reflink)
  .replace('nolink', inline$1.nolink)
  .getRegex();
inline$1.normal = merge$1({}, inline$1);
inline$1.pedantic = merge$1({}, inline$1.normal, {
  strong: {
    start: /^__|\*\*/,
    middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    endAst: /\*\*(?!\*)/g,
    endUnd: /__(?!_)/g,
  },
  em: {
    start: /^_|\*/,
    middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
    endAst: /\*(?!\*)/g,
    endUnd: /_(?!_)/g,
  },
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline$1._label)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline$1._label)
    .getRegex(),
});
inline$1.gfm = merge$1({}, inline$1.normal, {
  escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
  _extended_email:
    /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal:
    /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
});
inline$1.gfm.url = edit(inline$1.gfm.url, 'i')
  .replace('email', inline$1.gfm._extended_email)
  .getRegex();
inline$1.breaks = merge$1({}, inline$1.gfm, {
  br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
  text: edit(inline$1.gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex(),
});
var index_svelte_svelte_type_style_lang$5 = '',
  commonjsGlobal =
    typeof globalThis != 'undefined'
      ? globalThis
      : typeof window != 'undefined'
      ? window
      : typeof global != 'undefined'
      ? global
      : typeof self != 'undefined'
      ? self
      : {},
  pym_v1 = { exports: {} };
/*! pym.js - v1.3.2 - 2018-02-13 */ (function (e) {
  (function (t) {
    e.exports ? (e.exports = t()) : (window.pym = t.call(this));
  })(function () {
    var t = 'xPYMx',
      r = {},
      i = function (m) {
        var y = document.createEvent('Event');
        y.initEvent('pym:' + m, !0, !0), document.dispatchEvent(y);
      },
      s = function (m) {
        var y = new RegExp(
            '[\\?&]' +
              m.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]') +
              '=([^&#]*)'
          ),
          c = y.exec(location.search);
        return c === null ? '' : decodeURIComponent(c[1].replace(/\+/g, ' '));
      },
      n = function (m, y) {
        if (
          !(
            y.xdomain !== '*' && !m.origin.match(new RegExp(y.xdomain + '$'))
          ) &&
          typeof m.data == 'string'
        )
          return !0;
      },
      l = function (m) {
        var y = /^(?:(?:https?|mailto|ftp):|[^&:/?#]*(?:[/?#]|$))/gi;
        if (!!m.match(y)) return !0;
      },
      u = function (m, y, c) {
        var g = ['pym', m, y, c];
        return g.join(t);
      },
      d = function (m) {
        var y = ['pym', m, '(\\S+)', '(.*)'];
        return new RegExp('^' + y.join(t) + '$');
      },
      v =
        Date.now ||
        function () {
          return new Date().getTime();
        },
      E = function (m, y, c) {
        var g,
          p,
          a,
          o = null,
          h = 0;
        c || (c = {});
        var f = function () {
          (h = c.leading === !1 ? 0 : v()),
            (o = null),
            (a = m.apply(g, p)),
            o || (g = p = null);
        };
        return function () {
          var b = v();
          !h && c.leading === !1 && (h = b);
          var P = y - (b - h);
          return (
            (g = this),
            (p = arguments),
            P <= 0 || P > y
              ? (o && (clearTimeout(o), (o = null)),
                (h = b),
                (a = m.apply(g, p)),
                o || (g = p = null))
              : !o && c.trailing !== !1 && (o = setTimeout(f, P)),
            a
          );
        };
      },
      _ = function () {
        for (var m = r.autoInitInstances.length, y = m - 1; y >= 0; y--) {
          var c = r.autoInitInstances[y];
          (c.el.getElementsByTagName('iframe').length &&
            c.el.getElementsByTagName('iframe')[0].contentWindow) ||
            r.autoInitInstances.splice(y, 1);
        }
      };
    return (
      (r.autoInitInstances = []),
      (r.autoInit = function (m) {
        var y = document.querySelectorAll(
            '[data-pym-src]:not([data-pym-auto-initialized])'
          ),
          c = y.length;
        _();
        for (var g = 0; g < c; ++g) {
          var p = y[g];
          p.setAttribute('data-pym-auto-initialized', ''),
            p.id === '' &&
              (p.id =
                'pym-' + g + '-' + Math.random().toString(36).substr(2, 5));
          var a = p.getAttribute('data-pym-src'),
            o = {
              xdomain: 'string',
              title: 'string',
              name: 'string',
              id: 'string',
              sandbox: 'string',
              allowfullscreen: 'boolean',
              parenturlparam: 'string',
              parenturlvalue: 'string',
              optionalparams: 'boolean',
              trackscroll: 'boolean',
              scrollwait: 'number',
            },
            h = {};
          for (var f in o)
            if (p.getAttribute('data-pym-' + f) !== null)
              switch (o[f]) {
                case 'boolean':
                  h[f] = p.getAttribute('data-pym-' + f) !== 'false';
                  break;
                case 'string':
                  h[f] = p.getAttribute('data-pym-' + f);
                  break;
                case 'number':
                  var b = Number(p.getAttribute('data-pym-' + f));
                  isNaN(b) || (h[f] = b);
                  break;
                default:
                  console.err('unrecognized attribute type');
              }
          var P = new r.Parent(p.id, a, h);
          r.autoInitInstances.push(P);
        }
        return m || i('pym-initialized'), r.autoInitInstances;
      }),
      (r.Parent = function (m, y, c) {
        (this.id = m),
          (this.url = y),
          (this.el = document.getElementById(m)),
          (this.iframe = null),
          (this.settings = {
            xdomain: '*',
            optionalparams: !0,
            parenturlparam: 'parentUrl',
            parenturlvalue: window.location.href,
            trackscroll: !1,
            scrollwait: 100,
          }),
          (this.messageRegex = d(this.id)),
          (this.messageHandlers = {}),
          (c = c || {}),
          (this._constructIframe = function () {
            var p = this.el.offsetWidth.toString();
            this.iframe = document.createElement('iframe');
            var a = '',
              o = this.url.indexOf('#');
            for (
              o > -1 &&
                ((a = this.url.substring(o, this.url.length)),
                (this.url = this.url.substring(0, o))),
                this.url.indexOf('?') < 0
                  ? (this.url += '?')
                  : (this.url += '&'),
                this.iframe.src =
                  this.url + 'initialWidth=' + p + '&childId=' + this.id,
                this.settings.optionalparams &&
                  ((this.iframe.src +=
                    '&parentTitle=' + encodeURIComponent(document.title)),
                  (this.iframe.src +=
                    '&' +
                    this.settings.parenturlparam +
                    '=' +
                    encodeURIComponent(this.settings.parenturlvalue))),
                this.iframe.src += a,
                this.iframe.setAttribute('width', '100%'),
                this.iframe.setAttribute('scrolling', 'no'),
                this.iframe.setAttribute('marginheight', '0'),
                this.iframe.setAttribute('frameborder', '0'),
                this.settings.title &&
                  this.iframe.setAttribute('title', this.settings.title),
                this.settings.allowfullscreen !== void 0 &&
                  this.settings.allowfullscreen !== !1 &&
                  this.iframe.setAttribute('allowfullscreen', ''),
                this.settings.sandbox !== void 0 &&
                  typeof this.settings.sandbox == 'string' &&
                  this.iframe.setAttribute('sandbox', this.settings.sandbox),
                this.settings.id &&
                  (document.getElementById(this.settings.id) ||
                    this.iframe.setAttribute('id', this.settings.id)),
                this.settings.name &&
                  this.iframe.setAttribute('name', this.settings.name);
              this.el.firstChild;

            )
              this.el.removeChild(this.el.firstChild);
            this.el.appendChild(this.iframe),
              window.addEventListener('resize', this._onResize),
              this.settings.trackscroll &&
                window.addEventListener('scroll', this._throttleOnScroll);
          }),
          (this._onResize = function () {
            this.sendWidth(),
              this.settings.trackscroll && this.sendViewportAndIFramePosition();
          }.bind(this)),
          (this._onScroll = function () {
            this.sendViewportAndIFramePosition();
          }.bind(this)),
          (this._fire = function (p, a) {
            if (p in this.messageHandlers)
              for (var o = 0; o < this.messageHandlers[p].length; o++)
                this.messageHandlers[p][o].call(this, a);
          }),
          (this.remove = function () {
            window.removeEventListener('message', this._processMessage),
              window.removeEventListener('resize', this._onResize),
              this.el.removeChild(this.iframe),
              _();
          }),
          (this._processMessage = function (p) {
            if (!!n(p, this.settings) && typeof p.data == 'string') {
              var a = p.data.match(this.messageRegex);
              if (!a || a.length !== 3) return !1;
              var o = a[1],
                h = a[2];
              this._fire(o, h);
            }
          }.bind(this)),
          (this._onHeightMessage = function (p) {
            var a = parseInt(p);
            this.iframe.setAttribute('height', a + 'px');
          }),
          (this._onNavigateToMessage = function (p) {
            !l(p) || (document.location.href = p);
          }),
          (this._onScrollToChildPosMessage = function (p) {
            var a =
                document.getElementById(this.id).getBoundingClientRect().top +
                window.pageYOffset,
              o = a + parseInt(p);
            window.scrollTo(0, o);
          }),
          (this.onMessage = function (p, a) {
            p in this.messageHandlers || (this.messageHandlers[p] = []),
              this.messageHandlers[p].push(a);
          }),
          (this.sendMessage = function (p, a) {
            this.el.getElementsByTagName('iframe').length &&
              (this.el.getElementsByTagName('iframe')[0].contentWindow
                ? this.el
                    .getElementsByTagName('iframe')[0]
                    .contentWindow.postMessage(u(this.id, p, a), '*')
                : this.remove());
          }),
          (this.sendWidth = function () {
            var p = this.el.offsetWidth.toString();
            this.sendMessage('width', p);
          }),
          (this.sendViewportAndIFramePosition = function () {
            var p = this.iframe.getBoundingClientRect(),
              a = window.innerWidth || document.documentElement.clientWidth,
              o = window.innerHeight || document.documentElement.clientHeight,
              h = a + ' ' + o;
            (h += ' ' + p.top + ' ' + p.left),
              (h += ' ' + p.bottom + ' ' + p.right),
              this.sendMessage('viewport-iframe-position', h);
          });
        for (var g in c) this.settings[g] = c[g];
        return (
          (this._throttleOnScroll = E(
            this._onScroll.bind(this),
            this.settings.scrollwait
          )),
          this.onMessage('height', this._onHeightMessage),
          this.onMessage('navigateTo', this._onNavigateToMessage),
          this.onMessage('scrollToChildPos', this._onScrollToChildPosMessage),
          this.onMessage(
            'parentPositionInfo',
            this.sendViewportAndIFramePosition
          ),
          window.addEventListener('message', this._processMessage, !1),
          this._constructIframe(),
          this
        );
      }),
      (r.Child = function (m) {
        (this.parentWidth = null),
          (this.id = null),
          (this.parentTitle = null),
          (this.parentUrl = null),
          (this.settings = {
            renderCallback: null,
            xdomain: '*',
            polling: 0,
            parenturlparam: 'parentUrl',
          }),
          (this.timerId = null),
          (this.messageRegex = null),
          (this.messageHandlers = {}),
          (m = m || {}),
          (this.onMessage = function (p, a) {
            p in this.messageHandlers || (this.messageHandlers[p] = []),
              this.messageHandlers[p].push(a);
          }),
          (this._fire = function (p, a) {
            if (p in this.messageHandlers)
              for (var o = 0; o < this.messageHandlers[p].length; o++)
                this.messageHandlers[p][o].call(this, a);
          }),
          (this._processMessage = function (p) {
            if (!!n(p, this.settings) && typeof p.data == 'string') {
              var a = p.data.match(this.messageRegex);
              if (!(!a || a.length !== 3)) {
                var o = a[1],
                  h = a[2];
                this._fire(o, h);
              }
            }
          }.bind(this)),
          (this._onWidthMessage = function (p) {
            var a = parseInt(p);
            a !== this.parentWidth &&
              ((this.parentWidth = a),
              this.settings.renderCallback && this.settings.renderCallback(a),
              this.sendHeight());
          }),
          (this.sendMessage = function (p, a) {
            window.parent.postMessage(u(this.id, p, a), '*');
          }),
          (this.sendHeight = function () {
            var p = document
              .getElementsByTagName('body')[0]
              .offsetHeight.toString();
            return this.sendMessage('height', p), p;
          }.bind(this)),
          (this.getParentPositionInfo = function () {
            this.sendMessage('parentPositionInfo');
          }),
          (this.scrollParentTo = function (p) {
            this.sendMessage('navigateTo', '#' + p);
          }),
          (this.navigateParentTo = function (p) {
            this.sendMessage('navigateTo', p);
          }),
          (this.scrollParentToChildEl = function (p) {
            var a =
              document.getElementById(p).getBoundingClientRect().top +
              window.pageYOffset;
            this.scrollParentToChildPos(a);
          }),
          (this.scrollParentToChildPos = function (p) {
            this.sendMessage('scrollToChildPos', p.toString());
          });
        var y = function (p) {
          var a = document.getElementsByTagName('html')[0],
            o,
            h = a.className;
          try {
            window.self !== window.top
              ? (o = 'embedded')
              : (o = 'not-embedded');
          } catch (f) {
            o = 'embedded';
          }
          h.indexOf(o) < 0 &&
            ((a.className = h ? h + ' ' + o : o),
            p && p(o),
            i('marked-embedded'));
        };
        this.remove = function () {
          window.removeEventListener('message', this._processMessage),
            this.timerId && clearInterval(this.timerId);
        };
        for (var c in m) this.settings[c] = m[c];
        (this.id = s('childId') || m.id),
          (this.messageRegex = new RegExp(
            '^pym' + t + this.id + t + '(\\S+)' + t + '(.*)$'
          ));
        var g = parseInt(s('initialWidth'));
        return (
          (this.parentUrl = s(this.settings.parenturlparam)),
          (this.parentTitle = s('parentTitle')),
          this.onMessage('width', this._onWidthMessage),
          window.addEventListener('message', this._processMessage, !1),
          this.settings.renderCallback && this.settings.renderCallback(g),
          this.sendHeight(),
          this.settings.polling &&
            (this.timerId = window.setInterval(
              this.sendHeight,
              this.settings.polling
            )),
          y(m.onMarkedEmbeddedStatus),
          this
        );
      }),
      typeof document != 'undefined' && r.autoInit(!0),
      r
    );
  });
})(pym_v1);
var queryString = {},
  strictUriEncode = (e) =>
    encodeURIComponent(e).replace(
      /[!'()*]/g,
      (t) => `%${t.charCodeAt(0).toString(16).toUpperCase()}`
    ),
  token = '%[a-f0-9]{2}',
  singleMatcher = new RegExp(token, 'gi'),
  multiMatcher = new RegExp('(' + token + ')+', 'gi');
function decodeComponents(e, t) {
  try {
    return decodeURIComponent(e.join(''));
  } catch (s) {}
  if (e.length === 1) return e;
  t = t || 1;
  var r = e.slice(0, t),
    i = e.slice(t);
  return Array.prototype.concat.call(
    [],
    decodeComponents(r),
    decodeComponents(i)
  );
}
function decode(e) {
  try {
    return decodeURIComponent(e);
  } catch (i) {
    for (var t = e.match(singleMatcher), r = 1; r < t.length; r++)
      (e = decodeComponents(t, r).join('')), (t = e.match(singleMatcher));
    return e;
  }
}
function customDecodeURIComponent(e) {
  for (
    var t = { '%FE%FF': '\uFFFD\uFFFD', '%FF%FE': '\uFFFD\uFFFD' },
      r = multiMatcher.exec(e);
    r;

  ) {
    try {
      t[r[0]] = decodeURIComponent(r[0]);
    } catch (u) {
      var i = decode(r[0]);
      i !== r[0] && (t[r[0]] = i);
    }
    r = multiMatcher.exec(e);
  }
  t['%C2'] = '\uFFFD';
  for (var s = Object.keys(t), n = 0; n < s.length; n++) {
    var l = s[n];
    e = e.replace(new RegExp(l, 'g'), t[l]);
  }
  return e;
}
var decodeUriComponent = function (e) {
    if (typeof e != 'string')
      throw new TypeError(
        'Expected `encodedURI` to be of type `string`, got `' + typeof e + '`'
      );
    try {
      return (e = e.replace(/\+/g, ' ')), decodeURIComponent(e);
    } catch (t) {
      return customDecodeURIComponent(e);
    }
  },
  splitOnFirst = (e, t) => {
    if (!(typeof e == 'string' && typeof t == 'string'))
      throw new TypeError('Expected the arguments to be of type `string`');
    if (t === '') return [e];
    const r = e.indexOf(t);
    return r === -1 ? [e] : [e.slice(0, r), e.slice(r + t.length)];
  },
  filterObj = function (e, t) {
    for (
      var r = {}, i = Object.keys(e), s = Array.isArray(t), n = 0;
      n < i.length;
      n++
    ) {
      var l = i[n],
        u = e[l];
      (s ? t.indexOf(l) !== -1 : t(l, u, e)) && (r[l] = u);
    }
    return r;
  };
(function (e) {
  const t = strictUriEncode,
    r = decodeUriComponent,
    i = splitOnFirst,
    s = filterObj,
    n = (a) => a == null;
  function l(a) {
    switch (a.arrayFormat) {
      case 'index':
        return (o) => (h, f) => {
          const b = h.length;
          return f === void 0 ||
            (a.skipNull && f === null) ||
            (a.skipEmptyString && f === '')
            ? h
            : f === null
            ? [...h, [v(o, a), '[', b, ']'].join('')]
            : [...h, [v(o, a), '[', v(b, a), ']=', v(f, a)].join('')];
        };
      case 'bracket':
        return (o) => (h, f) =>
          f === void 0 ||
          (a.skipNull && f === null) ||
          (a.skipEmptyString && f === '')
            ? h
            : f === null
            ? [...h, [v(o, a), '[]'].join('')]
            : [...h, [v(o, a), '[]=', v(f, a)].join('')];
      case 'comma':
      case 'separator':
        return (o) => (h, f) =>
          f == null || f.length === 0
            ? h
            : h.length === 0
            ? [[v(o, a), '=', v(f, a)].join('')]
            : [[h, v(f, a)].join(a.arrayFormatSeparator)];
      default:
        return (o) => (h, f) =>
          f === void 0 ||
          (a.skipNull && f === null) ||
          (a.skipEmptyString && f === '')
            ? h
            : f === null
            ? [...h, v(o, a)]
            : [...h, [v(o, a), '=', v(f, a)].join('')];
    }
  }
  function u(a) {
    let o;
    switch (a.arrayFormat) {
      case 'index':
        return (h, f, b) => {
          if (
            ((o = /\[(\d*)\]$/.exec(h)), (h = h.replace(/\[\d*\]$/, '')), !o)
          ) {
            b[h] = f;
            return;
          }
          b[h] === void 0 && (b[h] = {}), (b[h][o[1]] = f);
        };
      case 'bracket':
        return (h, f, b) => {
          if (((o = /(\[\])$/.exec(h)), (h = h.replace(/\[\]$/, '')), !o)) {
            b[h] = f;
            return;
          }
          if (b[h] === void 0) {
            b[h] = [f];
            return;
          }
          b[h] = [].concat(b[h], f);
        };
      case 'comma':
      case 'separator':
        return (h, f, b) => {
          const P = typeof f == 'string' && f.includes(a.arrayFormatSeparator),
            S =
              typeof f == 'string' &&
              !P &&
              E(f, a).includes(a.arrayFormatSeparator);
          f = S ? E(f, a) : f;
          const w =
            P || S
              ? f.split(a.arrayFormatSeparator).map((M) => E(M, a))
              : f === null
              ? f
              : E(f, a);
          b[h] = w;
        };
      default:
        return (h, f, b) => {
          if (b[h] === void 0) {
            b[h] = f;
            return;
          }
          b[h] = [].concat(b[h], f);
        };
    }
  }
  function d(a) {
    if (typeof a != 'string' || a.length !== 1)
      throw new TypeError(
        'arrayFormatSeparator must be single character string'
      );
  }
  function v(a, o) {
    return o.encode ? (o.strict ? t(a) : encodeURIComponent(a)) : a;
  }
  function E(a, o) {
    return o.decode ? r(a) : a;
  }
  function _(a) {
    return Array.isArray(a)
      ? a.sort()
      : typeof a == 'object'
      ? _(Object.keys(a))
          .sort((o, h) => Number(o) - Number(h))
          .map((o) => a[o])
      : a;
  }
  function m(a) {
    const o = a.indexOf('#');
    return o !== -1 && (a = a.slice(0, o)), a;
  }
  function y(a) {
    let o = '';
    const h = a.indexOf('#');
    return h !== -1 && (o = a.slice(h)), o;
  }
  function c(a) {
    a = m(a);
    const o = a.indexOf('?');
    return o === -1 ? '' : a.slice(o + 1);
  }
  function g(a, o) {
    return (
      o.parseNumbers &&
      !Number.isNaN(Number(a)) &&
      typeof a == 'string' &&
      a.trim() !== ''
        ? (a = Number(a))
        : o.parseBooleans &&
          a !== null &&
          (a.toLowerCase() === 'true' || a.toLowerCase() === 'false') &&
          (a = a.toLowerCase() === 'true'),
      a
    );
  }
  function p(a, o) {
    (o = Object.assign(
      {
        decode: !0,
        sort: !0,
        arrayFormat: 'none',
        arrayFormatSeparator: ',',
        parseNumbers: !1,
        parseBooleans: !1,
      },
      o
    )),
      d(o.arrayFormatSeparator);
    const h = u(o),
      f = Object.create(null);
    if (typeof a != 'string' || ((a = a.trim().replace(/^[?#&]/, '')), !a))
      return f;
    for (const b of a.split('&')) {
      if (b === '') continue;
      let [P, S] = i(o.decode ? b.replace(/\+/g, ' ') : b, '=');
      (S =
        S === void 0
          ? null
          : ['comma', 'separator'].includes(o.arrayFormat)
          ? S
          : E(S, o)),
        h(E(P, o), S, f);
    }
    for (const b of Object.keys(f)) {
      const P = f[b];
      if (typeof P == 'object' && P !== null)
        for (const S of Object.keys(P)) P[S] = g(P[S], o);
      else f[b] = g(P, o);
    }
    return o.sort === !1
      ? f
      : (o.sort === !0
          ? Object.keys(f).sort()
          : Object.keys(f).sort(o.sort)
        ).reduce((b, P) => {
          const S = f[P];
          return (
            Boolean(S) && typeof S == 'object' && !Array.isArray(S)
              ? (b[P] = _(S))
              : (b[P] = S),
            b
          );
        }, Object.create(null));
  }
  (e.extract = c),
    (e.parse = p),
    (e.stringify = (a, o) => {
      if (!a) return '';
      (o = Object.assign(
        {
          encode: !0,
          strict: !0,
          arrayFormat: 'none',
          arrayFormatSeparator: ',',
        },
        o
      )),
        d(o.arrayFormatSeparator);
      const h = (S) =>
          (o.skipNull && n(a[S])) || (o.skipEmptyString && a[S] === ''),
        f = l(o),
        b = {};
      for (const S of Object.keys(a)) h(S) || (b[S] = a[S]);
      const P = Object.keys(b);
      return (
        o.sort !== !1 && P.sort(o.sort),
        P.map((S) => {
          const w = a[S];
          return w === void 0
            ? ''
            : w === null
            ? v(S, o)
            : Array.isArray(w)
            ? w.reduce(f(S), []).join('&')
            : v(S, o) + '=' + v(w, o);
        })
          .filter((S) => S.length > 0)
          .join('&')
      );
    }),
    (e.parseUrl = (a, o) => {
      o = Object.assign({ decode: !0 }, o);
      const [h, f] = i(a, '#');
      return Object.assign(
        { url: h.split('?')[0] || '', query: p(c(a), o) },
        o && o.parseFragmentIdentifier && f
          ? { fragmentIdentifier: E(f, o) }
          : {}
      );
    }),
    (e.stringifyUrl = (a, o) => {
      o = Object.assign({ encode: !0, strict: !0 }, o);
      const h = m(a.url).split('?')[0] || '',
        f = e.extract(a.url),
        b = e.parse(f, { sort: !1 }),
        P = Object.assign(b, a.query);
      let S = e.stringify(P, o);
      S && (S = `?${S}`);
      let w = y(a.url);
      return (
        a.fragmentIdentifier && (w = `#${v(a.fragmentIdentifier, o)}`),
        `${h}${S}${w}`
      );
    }),
    (e.pick = (a, o, h) => {
      h = Object.assign({ parseFragmentIdentifier: !0 }, h);
      const { url: f, query: b, fragmentIdentifier: P } = e.parseUrl(a, h);
      return e.stringifyUrl(
        { url: f, query: s(b, o), fragmentIdentifier: P },
        h
      );
    }),
    (e.exclude = (a, o, h) => {
      const f = Array.isArray(o) ? (b) => !o.includes(b) : (b, P) => !o(b, P);
      return e.pick(a, f, h);
    });
})(queryString);
const defaultUrlRegExp = /^(\w+:\/\/[^/?]+)?(.*?)(\?.+)?$/,
  protocolRelativeUrlRegExp = /^(\/\/[^/?]+)(.*?)(\?.+)?$/,
  normalizeParts = (e) =>
    e
      .filter((t) => typeof t == 'string' || typeof t == 'number')
      .map((t) => `${t}`)
      .filter((t) => t),
  parseParts = (e, t) => {
    const { protocolRelative: r } = t,
      i = e.join('/'),
      s = r ? protocolRelativeUrlRegExp : defaultUrlRegExp,
      [, n = '', l = '', u = ''] = i.match(s) || [];
    return {
      prefix: n,
      pathname: {
        parts: l.split('/').filter((d) => d !== ''),
        hasLeading: u ? /^\/\/+/.test(l) : /^\/+/.test(l),
        hasTrailing: u ? /\/\/+$/.test(l) : /\/+$/.test(l),
      },
      suffix: u,
    };
  },
  buildUrl = (e, t) => {
    const { prefix: r, pathname: i, suffix: s } = e,
      { parts: n, hasLeading: l, hasTrailing: u } = i,
      { leadingSlash: d, trailingSlash: v } = t,
      E = d === !0 || (d === 'keep' && l),
      _ = v === !0 || (v === 'keep' && u);
    let m = r;
    n.length > 0 && ((m || E) && (m += '/'), (m += n.join('/'))),
      _ && (m += '/'),
      !m && E && (m += '/');
    const y = pe(pe({}, queryString.parse(s, t.queryOptions)), t.query),
      c = queryString.stringify(y, t.queryOptions);
    return c && (m += `?${c}`), m;
  },
  urlJoin = (...e) => {
    const t = e[e.length - 1];
    let r;
    t && typeof t == 'object' && ((r = t), (e = e.slice(0, -1))),
      (r = pe(
        { leadingSlash: !0, trailingSlash: !1, protocolRelative: !1 },
        r
      )),
      (e = normalizeParts(e));
    const i = parseParts(e, r);
    return buildUrl(i, r);
  };
var index_svelte_svelte_type_style_lang$4 = '';
const getPath = (e = '') => urlJoin(assets, e);
var classnames = { exports: {} };
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/ (function (e) {
  (function () {
    var t = {}.hasOwnProperty;
    function r() {
      for (var i = [], s = 0; s < arguments.length; s++) {
        var n = arguments[s];
        if (!!n) {
          var l = typeof n;
          if (l === 'string' || l === 'number') i.push(n);
          else if (Array.isArray(n)) {
            if (n.length) {
              var u = r.apply(null, n);
              u && i.push(u);
            }
          } else if (l === 'object')
            if (n.toString === Object.prototype.toString)
              for (var d in n) t.call(n, d) && n[d] && i.push(d);
            else i.push(n.toString());
        }
      }
      return i.join(' ');
    }
    e.exports ? ((r.default = r), (e.exports = r)) : (window.classNames = r);
  })();
})(classnames);
var index_svelte_svelte_type_style_lang$3 = '';
function create_else_block$1(e) {
  let t, r;
  return {
    c() {
      (t = element('img')), this.h();
    },
    l(i) {
      (t = claim_element(i, 'IMG', { class: !0, src: !0, alt: !0 })), this.h();
    },
    h() {
      attr(t, 'class', 'logo reuters-graphics'),
        src_url_equal(
          t.src,
          (r =
            'https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-dark.svg')
        ) || attr(t, 'src', r),
        attr(t, 'alt', 'Reuters graphics logo');
    },
    m(i, s) {
      insert_hydration(i, t, s);
    },
    d(i) {
      i && detach(t);
    },
  };
}
function create_if_block_2(e) {
  let t, r;
  return {
    c() {
      (t = element('img')), this.h();
    },
    l(i) {
      (t = claim_element(i, 'IMG', { class: !0, src: !0, alt: !0 })), this.h();
    },
    h() {
      attr(t, 'class', 'logo reuters-graphics'),
        src_url_equal(
          t.src,
          (r =
            'https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-color-light.svg')
        ) || attr(t, 'src', r),
        attr(t, 'alt', 'Reuters graphics logo');
    },
    m(i, s) {
      insert_hydration(i, t, s);
    },
    d(i) {
      i && detach(t);
    },
  };
}
function create_if_block_1$1(e) {
  let t, r;
  return {
    c() {
      (t = element('img')), this.h();
    },
    l(i) {
      (t = claim_element(i, 'IMG', { class: !0, src: !0, alt: !0 })), this.h();
    },
    h() {
      attr(t, 'class', 'logo reuters-graphics'),
        src_url_equal(
          t.src,
          (r =
            'https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-dark.svg')
        ) || attr(t, 'src', r),
        attr(t, 'alt', 'Reuters graphics logo');
    },
    m(i, s) {
      insert_hydration(i, t, s);
    },
    d(i) {
      i && detach(t);
    },
  };
}
function create_if_block$1(e) {
  let t, r;
  return {
    c() {
      (t = element('img')), this.h();
    },
    l(i) {
      (t = claim_element(i, 'IMG', { class: !0, src: !0, alt: !0 })), this.h();
    },
    h() {
      attr(t, 'class', 'logo reuters-graphics'),
        src_url_equal(
          t.src,
          (r =
            'https://graphics.thomsonreuters.com/style-assets/images/logos/reuters-graphics-logo/svg/graphics-logo-light.svg')
        ) || attr(t, 'src', r),
        attr(t, 'alt', 'Reuters graphics logo');
    },
    m(i, s) {
      insert_hydration(i, t, s);
    },
    d(i) {
      i && detach(t);
    },
  };
}
function create_fragment$2(e) {
  let t, r, i, s, n, l, u;
  function d(y, c) {
    return y[2] && y[3]
      ? create_if_block$1
      : y[2]
      ? create_if_block_1$1
      : y[3]
      ? create_if_block_2
      : create_else_block$1;
  }
  let v = d(e),
    E = v(e);
  const _ = e[5].default,
    m = create_slot(_, e, e[4], null);
  return {
    c() {
      (t = element('nav')),
        (r = element('div')),
        (i = element('a')),
        (s = element('figure')),
        E.c(),
        (n = space()),
        m && m.c(),
        this.h();
    },
    l(y) {
      t = claim_element(y, 'NAV', { class: !0, style: !0 });
      var c = children(t);
      r = claim_element(c, 'DIV', { class: !0 });
      var g = children(r);
      i = claim_element(g, 'A', { href: !0 });
      var p = children(i);
      s = claim_element(p, 'FIGURE', { class: !0 });
      var a = children(s);
      E.l(a),
        a.forEach(detach),
        p.forEach(detach),
        g.forEach(detach),
        (n = claim_space(c)),
        m && m.l(c),
        c.forEach(detach),
        this.h();
    },
    h() {
      attr(s, 'class', 'navbar-brand'),
        attr(i, 'href', e[0]),
        attr(r, 'class', 'logo-container'),
        attr(t, 'class', 'nav'),
        attr(t, 'style', (l = `background: ${e[1]};`));
    },
    m(y, c) {
      insert_hydration(y, t, c),
        append_hydration(t, r),
        append_hydration(r, i),
        append_hydration(i, s),
        E.m(s, null),
        append_hydration(t, n),
        m && m.m(t, null),
        (u = !0);
    },
    p(y, [c]) {
      v !== (v = d(y)) && (E.d(1), (E = v(y)), E && (E.c(), E.m(s, null))),
        (!u || c & 1) && attr(i, 'href', y[0]),
        m &&
          m.p &&
          (!u || c & 16) &&
          update_slot_base(
            m,
            _,
            y,
            y[4],
            u
              ? get_slot_changes(_, y[4], c, null)
              : get_all_dirty_from_scope(y[4]),
            null
          ),
        (!u || (c & 2 && l !== (l = `background: ${y[1]};`))) &&
          attr(t, 'style', l);
    },
    i(y) {
      u || (transition_in(m, y), (u = !0));
    },
    o(y) {
      transition_out(m, y), (u = !1);
    },
    d(y) {
      y && detach(t), E.d(), m && m.d(y);
    },
  };
}
function instance$2(e, t, r) {
  let { $$slots: i = {}, $$scope: s } = t,
    { link: n = 'https://graphics.reuters.com' } = t,
    { backgroundColour: l = '#333333' } = t,
    { monocolourLogo: u = !1 } = t,
    { lightLogo: d = !0 } = t;
  return (
    (e.$$set = (v) => {
      'link' in v && r(0, (n = v.link)),
        'backgroundColour' in v && r(1, (l = v.backgroundColour)),
        'monocolourLogo' in v && r(2, (u = v.monocolourLogo)),
        'lightLogo' in v && r(3, (d = v.lightLogo)),
        '$$scope' in v && r(4, (s = v.$$scope));
    }),
    [n, l, u, d, s, i]
  );
}
class Nav extends SvelteComponent {
  constructor(t) {
    super();
    init(this, t, instance$2, create_fragment$2, safe_not_equal, {
      link: 0,
      backgroundColour: 1,
      monocolourLogo: 2,
      lightLogo: 3,
    });
  }
}
var Link_svelte_svelte_type_style_lang = '',
  Referrals_svelte_svelte_type_style_lang = '';
const name = 'my-project',
  version = '0.0.1',
  type = 'module',
  scripts = {
    start: 'svelte-kit dev --open',
    build: 'svelte-kit build',
    postinstall: 'husky install',
  },
  repository = 'https://github.com/reuters-graphics/style.git',
  devDependencies = {
    '@babel/core': '^7.15.5',
    '@babel/eslint-parser': '^7.15.4',
    '@babel/eslint-plugin': '^7.14.5',
    '@babel/preset-env': '^7.15.6',
    '@reuters-graphics/eslint-config': '^0.0.2',
    '@reuters-graphics/graphics-bin': '^0.0.19',
    '@reuters-graphics/graphics-kit-publisher': '^0.1.5',
    '@reuters-graphics/style-ai-templates': '>=0.0.8',
    '@rollup/plugin-dsv': '^2.0.1',
    '@sveltejs/adapter-static': '1.0.0-next.21',
    '@sveltejs/kit': '1.0.0-next.191',
    autoprefixer: '^10.2.5',
    eslint: '^7.24.0',
    'eslint-plugin-svelte3': '^3.2.1',
    glob: '^7.1.6',
    husky: '>=6',
    'lint-staged': '>=10',
    mdsvex: '^0.9.8',
    'npm-run-all': '^4.1.5',
    prettier: '^2.3.2',
    'prettier-plugin-svelte': '^2.4.0',
    'rehype-autolink-headings': '^6.1.0',
    'rehype-slug': '^5.0.0',
    'remark-abbr': '^1.4.1',
    'remark-containers': '^1.2.0',
    'remark-github': '^11.2.1',
    sass: '^1.43.2',
    svelte: '^3.44.0',
    'svelte-preprocess': '^4.9.8',
  },
  engines = { node: '>= 14.16.0' },
  dependencies = {
    '@fortawesome/free-brands-svg-icons': '^5.15.3',
    '@fortawesome/free-regular-svg-icons': '^5.15.3',
    '@fortawesome/free-solid-svg-icons': '^5.15.4',
    '@reuters-graphics/graphics-svelte-components': '^0.1.40',
    '@reuters-graphics/style-theme-eisbaer': '^0.3.6',
    classnames: '^2.3.1',
    d3: '^7.1.1',
    'd3-appendselect': '^2.0.0',
    'd3-array': '^3.1.1',
    'd3-axis': '^3.0.0',
    'd3-scale': '^4.0.2',
    'd3-selection': '^3.0.0',
    journalize: '^2.5.1',
    lodash: '^4.17.21',
    'lodash-es': '^4.17.21',
    'lottie-web': '^5.7.14',
    marked: '^3.0.3',
    'prism-themes': '^1.9.0',
    'prop-types': '^15.7.2',
    'proper-url-join': '^2.1.1',
    'pym.js': '^1.3.2',
    slugify: '^1.6.2',
    'svelte-fa': '^2.3.3',
    'svelte-markdown': '^0.1.5',
    'ua-parser-js': '^0.7.27',
  },
  homepage = '';
var pkg = {
  name,
  version,
  type,
  private: !0,
  scripts,
  repository,
  'lint-staged': {
    '*.js': 'eslint --cache --fix',
    '*.{js,css,md,svelte}': 'prettier --write',
  },
  devDependencies,
  engines,
  dependencies,
  homepage,
};
const getStores = () => {
    const e = getContext('__svelte__');
    return {
      page: { subscribe: e.page.subscribe },
      navigating: { subscribe: e.navigating.subscribe },
      get preloading() {
        return (
          console.error(
            'stores.preloading is deprecated; use stores.navigating instead'
          ),
          { subscribe: e.navigating.subscribe }
        );
      },
      session: e.session,
    };
  },
  page = {
    subscribe(e) {
      return getStores().page.subscribe(e);
    },
  };
var freeGlobal =
    typeof global == 'object' && global && global.Object === Object && global,
  freeGlobal$1 = freeGlobal,
  freeSelf = typeof self == 'object' && self && self.Object === Object && self,
  root = freeGlobal$1 || freeSelf || Function('return this')(),
  root$1 = root,
  Symbol$1 = root$1.Symbol,
  Symbol$2 = Symbol$1,
  objectProto$c = Object.prototype,
  hasOwnProperty$9 = objectProto$c.hasOwnProperty,
  nativeObjectToString$1 = objectProto$c.toString,
  symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : void 0;
function getRawTag(e) {
  var t = hasOwnProperty$9.call(e, symToStringTag$1),
    r = e[symToStringTag$1];
  try {
    e[symToStringTag$1] = void 0;
    var i = !0;
  } catch (n) {}
  var s = nativeObjectToString$1.call(e);
  return i && (t ? (e[symToStringTag$1] = r) : delete e[symToStringTag$1]), s;
}
var objectProto$b = Object.prototype,
  nativeObjectToString = objectProto$b.toString;
function objectToString(e) {
  return nativeObjectToString.call(e);
}
var nullTag = '[object Null]',
  undefinedTag = '[object Undefined]',
  symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag(e) {
  return e == null
    ? e === void 0
      ? undefinedTag
      : nullTag
    : symToStringTag && symToStringTag in Object(e)
    ? getRawTag(e)
    : objectToString(e);
}
function isObjectLike(e) {
  return e != null && typeof e == 'object';
}
var symbolTag$1 = '[object Symbol]';
function isSymbol(e) {
  return (
    typeof e == 'symbol' || (isObjectLike(e) && baseGetTag(e) == symbolTag$1)
  );
}
function arrayMap(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length, s = Array(i); ++r < i; )
    s[r] = t(e[r], r, e);
  return s;
}
var isArray = Array.isArray,
  isArray$1 = isArray,
  INFINITY$1 = 1 / 0,
  symbolProto$1 = Symbol$2 ? Symbol$2.prototype : void 0,
  symbolToString = symbolProto$1 ? symbolProto$1.toString : void 0;
function baseToString(e) {
  if (typeof e == 'string') return e;
  if (isArray$1(e)) return arrayMap(e, baseToString) + '';
  if (isSymbol(e)) return symbolToString ? symbolToString.call(e) : '';
  var t = e + '';
  return t == '0' && 1 / e == -INFINITY$1 ? '-0' : t;
}
function isObject(e) {
  var t = typeof e;
  return e != null && (t == 'object' || t == 'function');
}
function identity(e) {
  return e;
}
var asyncTag = '[object AsyncFunction]',
  funcTag$1 = '[object Function]',
  genTag = '[object GeneratorFunction]',
  proxyTag = '[object Proxy]';
function isFunction(e) {
  if (!isObject(e)) return !1;
  var t = baseGetTag(e);
  return t == funcTag$1 || t == genTag || t == asyncTag || t == proxyTag;
}
var coreJsData = root$1['__core-js_shared__'],
  coreJsData$1 = coreJsData,
  maskSrcKey = (function () {
    var e = /[^.]+$/.exec(
      (coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO) || ''
    );
    return e ? 'Symbol(src)_1.' + e : '';
  })();
function isMasked(e) {
  return !!maskSrcKey && maskSrcKey in e;
}
var funcProto$1 = Function.prototype,
  funcToString$1 = funcProto$1.toString;
function toSource(e) {
  if (e != null) {
    try {
      return funcToString$1.call(e);
    } catch (t) {}
    try {
      return e + '';
    } catch (t) {}
  }
  return '';
}
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g,
  reIsHostCtor = /^\[object .+?Constructor\]$/,
  funcProto = Function.prototype,
  objectProto$a = Object.prototype,
  funcToString = funcProto.toString,
  hasOwnProperty$8 = objectProto$a.hasOwnProperty,
  reIsNative = RegExp(
    '^' +
      funcToString
        .call(hasOwnProperty$8)
        .replace(reRegExpChar, '\\$&')
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          '$1.*?'
        ) +
      '$'
  );
function baseIsNative(e) {
  if (!isObject(e) || isMasked(e)) return !1;
  var t = isFunction(e) ? reIsNative : reIsHostCtor;
  return t.test(toSource(e));
}
function getValue(e, t) {
  return e == null ? void 0 : e[t];
}
function getNative(e, t) {
  var r = getValue(e, t);
  return baseIsNative(r) ? r : void 0;
}
var WeakMap = getNative(root$1, 'WeakMap'),
  WeakMap$1 = WeakMap,
  defineProperty = (function () {
    try {
      var e = getNative(Object, 'defineProperty');
      return e({}, '', {}), e;
    } catch (t) {}
  })(),
  defineProperty$1 = defineProperty,
  MAX_SAFE_INTEGER$1 = 9007199254740991,
  reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(e, t) {
  var r = typeof e;
  return (
    (t = t == null ? MAX_SAFE_INTEGER$1 : t),
    !!t &&
      (r == 'number' || (r != 'symbol' && reIsUint.test(e))) &&
      e > -1 &&
      e % 1 == 0 &&
      e < t
  );
}
function baseAssignValue(e, t, r) {
  t == '__proto__' && defineProperty$1
    ? defineProperty$1(e, t, {
        configurable: !0,
        enumerable: !0,
        value: r,
        writable: !0,
      })
    : (e[t] = r);
}
function eq(e, t) {
  return e === t || (e !== e && t !== t);
}
var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(e) {
  return typeof e == 'number' && e > -1 && e % 1 == 0 && e <= MAX_SAFE_INTEGER;
}
function isArrayLike(e) {
  return e != null && isLength(e.length) && !isFunction(e);
}
var objectProto$9 = Object.prototype;
function isPrototype(e) {
  var t = e && e.constructor,
    r = (typeof t == 'function' && t.prototype) || objectProto$9;
  return e === r;
}
function baseTimes(e, t) {
  for (var r = -1, i = Array(e); ++r < e; ) i[r] = t(r);
  return i;
}
var argsTag$2 = '[object Arguments]';
function baseIsArguments(e) {
  return isObjectLike(e) && baseGetTag(e) == argsTag$2;
}
var objectProto$8 = Object.prototype,
  hasOwnProperty$7 = objectProto$8.hasOwnProperty,
  propertyIsEnumerable$1 = objectProto$8.propertyIsEnumerable,
  isArguments = baseIsArguments(
    (function () {
      return arguments;
    })()
  )
    ? baseIsArguments
    : function (e) {
        return (
          isObjectLike(e) &&
          hasOwnProperty$7.call(e, 'callee') &&
          !propertyIsEnumerable$1.call(e, 'callee')
        );
      },
  isArguments$1 = isArguments;
function stubFalse() {
  return !1;
}
var freeExports$1 =
    typeof exports == 'object' && exports && !exports.nodeType && exports,
  freeModule$1 =
    freeExports$1 &&
    typeof module == 'object' &&
    module &&
    !module.nodeType &&
    module,
  moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1,
  Buffer = moduleExports$1 ? root$1.Buffer : void 0,
  nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0,
  isBuffer = nativeIsBuffer || stubFalse,
  isBuffer$1 = isBuffer,
  argsTag$1 = '[object Arguments]',
  arrayTag$1 = '[object Array]',
  boolTag$1 = '[object Boolean]',
  dateTag$1 = '[object Date]',
  errorTag$1 = '[object Error]',
  funcTag = '[object Function]',
  mapTag$2 = '[object Map]',
  numberTag$1 = '[object Number]',
  objectTag$2 = '[object Object]',
  regexpTag$1 = '[object RegExp]',
  setTag$2 = '[object Set]',
  stringTag$1 = '[object String]',
  weakMapTag$1 = '[object WeakMap]',
  arrayBufferTag$1 = '[object ArrayBuffer]',
  dataViewTag$2 = '[object DataView]',
  float32Tag = '[object Float32Array]',
  float64Tag = '[object Float64Array]',
  int8Tag = '[object Int8Array]',
  int16Tag = '[object Int16Array]',
  int32Tag = '[object Int32Array]',
  uint8Tag = '[object Uint8Array]',
  uint8ClampedTag = '[object Uint8ClampedArray]',
  uint16Tag = '[object Uint16Array]',
  uint32Tag = '[object Uint32Array]',
  typedArrayTags = {};
typedArrayTags[float32Tag] =
  typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] =
  typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] =
  typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] =
  typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] =
    !0;
typedArrayTags[argsTag$1] =
  typedArrayTags[arrayTag$1] =
  typedArrayTags[arrayBufferTag$1] =
  typedArrayTags[boolTag$1] =
  typedArrayTags[dataViewTag$2] =
  typedArrayTags[dateTag$1] =
  typedArrayTags[errorTag$1] =
  typedArrayTags[funcTag] =
  typedArrayTags[mapTag$2] =
  typedArrayTags[numberTag$1] =
  typedArrayTags[objectTag$2] =
  typedArrayTags[regexpTag$1] =
  typedArrayTags[setTag$2] =
  typedArrayTags[stringTag$1] =
  typedArrayTags[weakMapTag$1] =
    !1;
function baseIsTypedArray(e) {
  return (
    isObjectLike(e) && isLength(e.length) && !!typedArrayTags[baseGetTag(e)]
  );
}
function baseUnary(e) {
  return function (t) {
    return e(t);
  };
}
var freeExports =
    typeof exports == 'object' && exports && !exports.nodeType && exports,
  freeModule =
    freeExports &&
    typeof module == 'object' &&
    module &&
    !module.nodeType &&
    module,
  moduleExports = freeModule && freeModule.exports === freeExports,
  freeProcess = moduleExports && freeGlobal$1.process,
  nodeUtil = (function () {
    try {
      var e =
        freeModule && freeModule.require && freeModule.require('util').types;
      return (
        e || (freeProcess && freeProcess.binding && freeProcess.binding('util'))
      );
    } catch (t) {}
  })(),
  nodeUtil$1 = nodeUtil,
  nodeIsTypedArray = nodeUtil$1 && nodeUtil$1.isTypedArray,
  isTypedArray = nodeIsTypedArray
    ? baseUnary(nodeIsTypedArray)
    : baseIsTypedArray,
  isTypedArray$1 = isTypedArray,
  objectProto$7 = Object.prototype,
  hasOwnProperty$6 = objectProto$7.hasOwnProperty;
function arrayLikeKeys(e, t) {
  var r = isArray$1(e),
    i = !r && isArguments$1(e),
    s = !r && !i && isBuffer$1(e),
    n = !r && !i && !s && isTypedArray$1(e),
    l = r || i || s || n,
    u = l ? baseTimes(e.length, String) : [],
    d = u.length;
  for (var v in e)
    (t || hasOwnProperty$6.call(e, v)) &&
      !(
        l &&
        (v == 'length' ||
          (s && (v == 'offset' || v == 'parent')) ||
          (n && (v == 'buffer' || v == 'byteLength' || v == 'byteOffset')) ||
          isIndex(v, d))
      ) &&
      u.push(v);
  return u;
}
function overArg(e, t) {
  return function (r) {
    return e(t(r));
  };
}
var nativeKeys = overArg(Object.keys, Object),
  nativeKeys$1 = nativeKeys,
  objectProto$6 = Object.prototype,
  hasOwnProperty$5 = objectProto$6.hasOwnProperty;
function baseKeys(e) {
  if (!isPrototype(e)) return nativeKeys$1(e);
  var t = [];
  for (var r in Object(e))
    hasOwnProperty$5.call(e, r) && r != 'constructor' && t.push(r);
  return t;
}
function keys(e) {
  return isArrayLike(e) ? arrayLikeKeys(e) : baseKeys(e);
}
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
  reIsPlainProp = /^\w*$/;
function isKey(e, t) {
  if (isArray$1(e)) return !1;
  var r = typeof e;
  return r == 'number' ||
    r == 'symbol' ||
    r == 'boolean' ||
    e == null ||
    isSymbol(e)
    ? !0
    : reIsPlainProp.test(e) ||
        !reIsDeepProp.test(e) ||
        (t != null && e in Object(t));
}
var nativeCreate = getNative(Object, 'create'),
  nativeCreate$1 = nativeCreate;
function hashClear() {
  (this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {}), (this.size = 0);
}
function hashDelete(e) {
  var t = this.has(e) && delete this.__data__[e];
  return (this.size -= t ? 1 : 0), t;
}
var HASH_UNDEFINED$2 = '__lodash_hash_undefined__',
  objectProto$5 = Object.prototype,
  hasOwnProperty$4 = objectProto$5.hasOwnProperty;
function hashGet(e) {
  var t = this.__data__;
  if (nativeCreate$1) {
    var r = t[e];
    return r === HASH_UNDEFINED$2 ? void 0 : r;
  }
  return hasOwnProperty$4.call(t, e) ? t[e] : void 0;
}
var objectProto$4 = Object.prototype,
  hasOwnProperty$3 = objectProto$4.hasOwnProperty;
function hashHas(e) {
  var t = this.__data__;
  return nativeCreate$1 ? t[e] !== void 0 : hasOwnProperty$3.call(t, e);
}
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
function hashSet(e, t) {
  var r = this.__data__;
  return (
    (this.size += this.has(e) ? 0 : 1),
    (r[e] = nativeCreate$1 && t === void 0 ? HASH_UNDEFINED$1 : t),
    this
  );
}
function Hash(e) {
  var t = -1,
    r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
Hash.prototype.clear = hashClear;
Hash.prototype.delete = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
function listCacheClear() {
  (this.__data__ = []), (this.size = 0);
}
function assocIndexOf(e, t) {
  for (var r = e.length; r--; ) if (eq(e[r][0], t)) return r;
  return -1;
}
var arrayProto = Array.prototype,
  splice = arrayProto.splice;
function listCacheDelete(e) {
  var t = this.__data__,
    r = assocIndexOf(t, e);
  if (r < 0) return !1;
  var i = t.length - 1;
  return r == i ? t.pop() : splice.call(t, r, 1), --this.size, !0;
}
function listCacheGet(e) {
  var t = this.__data__,
    r = assocIndexOf(t, e);
  return r < 0 ? void 0 : t[r][1];
}
function listCacheHas(e) {
  return assocIndexOf(this.__data__, e) > -1;
}
function listCacheSet(e, t) {
  var r = this.__data__,
    i = assocIndexOf(r, e);
  return i < 0 ? (++this.size, r.push([e, t])) : (r[i][1] = t), this;
}
function ListCache(e) {
  var t = -1,
    r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype.delete = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
var Map$1 = getNative(root$1, 'Map'),
  Map$2 = Map$1;
function mapCacheClear() {
  (this.size = 0),
    (this.__data__ = {
      hash: new Hash(),
      map: new (Map$2 || ListCache)(),
      string: new Hash(),
    });
}
function isKeyable(e) {
  var t = typeof e;
  return t == 'string' || t == 'number' || t == 'symbol' || t == 'boolean'
    ? e !== '__proto__'
    : e === null;
}
function getMapData(e, t) {
  var r = e.__data__;
  return isKeyable(t) ? r[typeof t == 'string' ? 'string' : 'hash'] : r.map;
}
function mapCacheDelete(e) {
  var t = getMapData(this, e).delete(e);
  return (this.size -= t ? 1 : 0), t;
}
function mapCacheGet(e) {
  return getMapData(this, e).get(e);
}
function mapCacheHas(e) {
  return getMapData(this, e).has(e);
}
function mapCacheSet(e, t) {
  var r = getMapData(this, e),
    i = r.size;
  return r.set(e, t), (this.size += r.size == i ? 0 : 1), this;
}
function MapCache(e) {
  var t = -1,
    r = e == null ? 0 : e.length;
  for (this.clear(); ++t < r; ) {
    var i = e[t];
    this.set(i[0], i[1]);
  }
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype.delete = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
var FUNC_ERROR_TEXT = 'Expected a function';
function memoize(e, t) {
  if (typeof e != 'function' || (t != null && typeof t != 'function'))
    throw new TypeError(FUNC_ERROR_TEXT);
  var r = function () {
    var i = arguments,
      s = t ? t.apply(this, i) : i[0],
      n = r.cache;
    if (n.has(s)) return n.get(s);
    var l = e.apply(this, i);
    return (r.cache = n.set(s, l) || n), l;
  };
  return (r.cache = new (memoize.Cache || MapCache)()), r;
}
memoize.Cache = MapCache;
var MAX_MEMOIZE_SIZE = 500;
function memoizeCapped(e) {
  var t = memoize(e, function (i) {
      return r.size === MAX_MEMOIZE_SIZE && r.clear(), i;
    }),
    r = t.cache;
  return t;
}
var rePropName =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  reEscapeChar = /\\(\\)?/g,
  stringToPath = memoizeCapped(function (e) {
    var t = [];
    return (
      e.charCodeAt(0) === 46 && t.push(''),
      e.replace(rePropName, function (r, i, s, n) {
        t.push(s ? n.replace(reEscapeChar, '$1') : i || r);
      }),
      t
    );
  }),
  stringToPath$1 = stringToPath;
function toString(e) {
  return e == null ? '' : baseToString(e);
}
function castPath(e, t) {
  return isArray$1(e) ? e : isKey(e, t) ? [e] : stringToPath$1(toString(e));
}
var INFINITY = 1 / 0;
function toKey(e) {
  if (typeof e == 'string' || isSymbol(e)) return e;
  var t = e + '';
  return t == '0' && 1 / e == -INFINITY ? '-0' : t;
}
function baseGet(e, t) {
  t = castPath(t, e);
  for (var r = 0, i = t.length; e != null && r < i; ) e = e[toKey(t[r++])];
  return r && r == i ? e : void 0;
}
function get(e, t, r) {
  var i = e == null ? void 0 : baseGet(e, t);
  return i === void 0 ? r : i;
}
function arrayPush(e, t) {
  for (var r = -1, i = t.length, s = e.length; ++r < i; ) e[s + r] = t[r];
  return e;
}
function stackClear() {
  (this.__data__ = new ListCache()), (this.size = 0);
}
function stackDelete(e) {
  var t = this.__data__,
    r = t.delete(e);
  return (this.size = t.size), r;
}
function stackGet(e) {
  return this.__data__.get(e);
}
function stackHas(e) {
  return this.__data__.has(e);
}
var LARGE_ARRAY_SIZE = 200;
function stackSet(e, t) {
  var r = this.__data__;
  if (r instanceof ListCache) {
    var i = r.__data__;
    if (!Map$2 || i.length < LARGE_ARRAY_SIZE - 1)
      return i.push([e, t]), (this.size = ++r.size), this;
    r = this.__data__ = new MapCache(i);
  }
  return r.set(e, t), (this.size = r.size), this;
}
function Stack(e) {
  var t = (this.__data__ = new ListCache(e));
  this.size = t.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype.delete = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
function arrayFilter(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length, s = 0, n = []; ++r < i; ) {
    var l = e[r];
    t(l, r, e) && (n[s++] = l);
  }
  return n;
}
function stubArray() {
  return [];
}
var objectProto$3 = Object.prototype,
  propertyIsEnumerable = objectProto$3.propertyIsEnumerable,
  nativeGetSymbols = Object.getOwnPropertySymbols,
  getSymbols = nativeGetSymbols
    ? function (e) {
        return e == null
          ? []
          : ((e = Object(e)),
            arrayFilter(nativeGetSymbols(e), function (t) {
              return propertyIsEnumerable.call(e, t);
            }));
      }
    : stubArray,
  getSymbols$1 = getSymbols;
function baseGetAllKeys(e, t, r) {
  var i = t(e);
  return isArray$1(e) ? i : arrayPush(i, r(e));
}
function getAllKeys(e) {
  return baseGetAllKeys(e, keys, getSymbols$1);
}
var DataView = getNative(root$1, 'DataView'),
  DataView$1 = DataView,
  Promise$1 = getNative(root$1, 'Promise'),
  Promise$2 = Promise$1,
  Set$1 = getNative(root$1, 'Set'),
  Set$2 = Set$1,
  mapTag$1 = '[object Map]',
  objectTag$1 = '[object Object]',
  promiseTag = '[object Promise]',
  setTag$1 = '[object Set]',
  weakMapTag = '[object WeakMap]',
  dataViewTag$1 = '[object DataView]',
  dataViewCtorString = toSource(DataView$1),
  mapCtorString = toSource(Map$2),
  promiseCtorString = toSource(Promise$2),
  setCtorString = toSource(Set$2),
  weakMapCtorString = toSource(WeakMap$1),
  getTag = baseGetTag;
((DataView$1 && getTag(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1) ||
  (Map$2 && getTag(new Map$2()) != mapTag$1) ||
  (Promise$2 && getTag(Promise$2.resolve()) != promiseTag) ||
  (Set$2 && getTag(new Set$2()) != setTag$1) ||
  (WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag)) &&
  (getTag = function (e) {
    var t = baseGetTag(e),
      r = t == objectTag$1 ? e.constructor : void 0,
      i = r ? toSource(r) : '';
    if (i)
      switch (i) {
        case dataViewCtorString:
          return dataViewTag$1;
        case mapCtorString:
          return mapTag$1;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag$1;
        case weakMapCtorString:
          return weakMapTag;
      }
    return t;
  });
var getTag$1 = getTag,
  Uint8Array$1 = root$1.Uint8Array,
  Uint8Array$2 = Uint8Array$1,
  HASH_UNDEFINED = '__lodash_hash_undefined__';
function setCacheAdd(e) {
  return this.__data__.set(e, HASH_UNDEFINED), this;
}
function setCacheHas(e) {
  return this.__data__.has(e);
}
function SetCache(e) {
  var t = -1,
    r = e == null ? 0 : e.length;
  for (this.__data__ = new MapCache(); ++t < r; ) this.add(e[t]);
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
function arraySome(e, t) {
  for (var r = -1, i = e == null ? 0 : e.length; ++r < i; )
    if (t(e[r], r, e)) return !0;
  return !1;
}
function cacheHas(e, t) {
  return e.has(t);
}
var COMPARE_PARTIAL_FLAG$5 = 1,
  COMPARE_UNORDERED_FLAG$3 = 2;
function equalArrays(e, t, r, i, s, n) {
  var l = r & COMPARE_PARTIAL_FLAG$5,
    u = e.length,
    d = t.length;
  if (u != d && !(l && d > u)) return !1;
  var v = n.get(e),
    E = n.get(t);
  if (v && E) return v == t && E == e;
  var _ = -1,
    m = !0,
    y = r & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
  for (n.set(e, t), n.set(t, e); ++_ < u; ) {
    var c = e[_],
      g = t[_];
    if (i) var p = l ? i(g, c, _, t, e, n) : i(c, g, _, e, t, n);
    if (p !== void 0) {
      if (p) continue;
      m = !1;
      break;
    }
    if (y) {
      if (
        !arraySome(t, function (a, o) {
          if (!cacheHas(y, o) && (c === a || s(c, a, r, i, n)))
            return y.push(o);
        })
      ) {
        m = !1;
        break;
      }
    } else if (!(c === g || s(c, g, r, i, n))) {
      m = !1;
      break;
    }
  }
  return n.delete(e), n.delete(t), m;
}
function mapToArray(e) {
  var t = -1,
    r = Array(e.size);
  return (
    e.forEach(function (i, s) {
      r[++t] = [s, i];
    }),
    r
  );
}
function setToArray(e) {
  var t = -1,
    r = Array(e.size);
  return (
    e.forEach(function (i) {
      r[++t] = i;
    }),
    r
  );
}
var COMPARE_PARTIAL_FLAG$4 = 1,
  COMPARE_UNORDERED_FLAG$2 = 2,
  boolTag = '[object Boolean]',
  dateTag = '[object Date]',
  errorTag = '[object Error]',
  mapTag = '[object Map]',
  numberTag = '[object Number]',
  regexpTag = '[object RegExp]',
  setTag = '[object Set]',
  stringTag = '[object String]',
  symbolTag = '[object Symbol]',
  arrayBufferTag = '[object ArrayBuffer]',
  dataViewTag = '[object DataView]',
  symbolProto = Symbol$2 ? Symbol$2.prototype : void 0,
  symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function equalByTag(e, t, r, i, s, n, l) {
  switch (r) {
    case dataViewTag:
      if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
        return !1;
      (e = e.buffer), (t = t.buffer);
    case arrayBufferTag:
      return !(
        e.byteLength != t.byteLength ||
        !n(new Uint8Array$2(e), new Uint8Array$2(t))
      );
    case boolTag:
    case dateTag:
    case numberTag:
      return eq(+e, +t);
    case errorTag:
      return e.name == t.name && e.message == t.message;
    case regexpTag:
    case stringTag:
      return e == t + '';
    case mapTag:
      var u = mapToArray;
    case setTag:
      var d = i & COMPARE_PARTIAL_FLAG$4;
      if ((u || (u = setToArray), e.size != t.size && !d)) return !1;
      var v = l.get(e);
      if (v) return v == t;
      (i |= COMPARE_UNORDERED_FLAG$2), l.set(e, t);
      var E = equalArrays(u(e), u(t), i, s, n, l);
      return l.delete(e), E;
    case symbolTag:
      if (symbolValueOf) return symbolValueOf.call(e) == symbolValueOf.call(t);
  }
  return !1;
}
var COMPARE_PARTIAL_FLAG$3 = 1,
  objectProto$2 = Object.prototype,
  hasOwnProperty$2 = objectProto$2.hasOwnProperty;
function equalObjects(e, t, r, i, s, n) {
  var l = r & COMPARE_PARTIAL_FLAG$3,
    u = getAllKeys(e),
    d = u.length,
    v = getAllKeys(t),
    E = v.length;
  if (d != E && !l) return !1;
  for (var _ = d; _--; ) {
    var m = u[_];
    if (!(l ? m in t : hasOwnProperty$2.call(t, m))) return !1;
  }
  var y = n.get(e),
    c = n.get(t);
  if (y && c) return y == t && c == e;
  var g = !0;
  n.set(e, t), n.set(t, e);
  for (var p = l; ++_ < d; ) {
    m = u[_];
    var a = e[m],
      o = t[m];
    if (i) var h = l ? i(o, a, m, t, e, n) : i(a, o, m, e, t, n);
    if (!(h === void 0 ? a === o || s(a, o, r, i, n) : h)) {
      g = !1;
      break;
    }
    p || (p = m == 'constructor');
  }
  if (g && !p) {
    var f = e.constructor,
      b = t.constructor;
    f != b &&
      'constructor' in e &&
      'constructor' in t &&
      !(
        typeof f == 'function' &&
        f instanceof f &&
        typeof b == 'function' &&
        b instanceof b
      ) &&
      (g = !1);
  }
  return n.delete(e), n.delete(t), g;
}
var COMPARE_PARTIAL_FLAG$2 = 1,
  argsTag = '[object Arguments]',
  arrayTag = '[object Array]',
  objectTag = '[object Object]',
  objectProto$1 = Object.prototype,
  hasOwnProperty$1 = objectProto$1.hasOwnProperty;
function baseIsEqualDeep(e, t, r, i, s, n) {
  var l = isArray$1(e),
    u = isArray$1(t),
    d = l ? arrayTag : getTag$1(e),
    v = u ? arrayTag : getTag$1(t);
  (d = d == argsTag ? objectTag : d), (v = v == argsTag ? objectTag : v);
  var E = d == objectTag,
    _ = v == objectTag,
    m = d == v;
  if (m && isBuffer$1(e)) {
    if (!isBuffer$1(t)) return !1;
    (l = !0), (E = !1);
  }
  if (m && !E)
    return (
      n || (n = new Stack()),
      l || isTypedArray$1(e)
        ? equalArrays(e, t, r, i, s, n)
        : equalByTag(e, t, d, r, i, s, n)
    );
  if (!(r & COMPARE_PARTIAL_FLAG$2)) {
    var y = E && hasOwnProperty$1.call(e, '__wrapped__'),
      c = _ && hasOwnProperty$1.call(t, '__wrapped__');
    if (y || c) {
      var g = y ? e.value() : e,
        p = c ? t.value() : t;
      return n || (n = new Stack()), s(g, p, r, i, n);
    }
  }
  return m ? (n || (n = new Stack()), equalObjects(e, t, r, i, s, n)) : !1;
}
function baseIsEqual(e, t, r, i, s) {
  return e === t
    ? !0
    : e == null || t == null || (!isObjectLike(e) && !isObjectLike(t))
    ? e !== e && t !== t
    : baseIsEqualDeep(e, t, r, i, baseIsEqual, s);
}
var COMPARE_PARTIAL_FLAG$1 = 1,
  COMPARE_UNORDERED_FLAG$1 = 2;
function baseIsMatch(e, t, r, i) {
  var s = r.length,
    n = s,
    l = !i;
  if (e == null) return !n;
  for (e = Object(e); s--; ) {
    var u = r[s];
    if (l && u[2] ? u[1] !== e[u[0]] : !(u[0] in e)) return !1;
  }
  for (; ++s < n; ) {
    u = r[s];
    var d = u[0],
      v = e[d],
      E = u[1];
    if (l && u[2]) {
      if (v === void 0 && !(d in e)) return !1;
    } else {
      var _ = new Stack();
      if (i) var m = i(v, E, d, e, t, _);
      if (
        !(m === void 0
          ? baseIsEqual(
              E,
              v,
              COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1,
              i,
              _
            )
          : m)
      )
        return !1;
    }
  }
  return !0;
}
function isStrictComparable(e) {
  return e === e && !isObject(e);
}
function getMatchData(e) {
  for (var t = keys(e), r = t.length; r--; ) {
    var i = t[r],
      s = e[i];
    t[r] = [i, s, isStrictComparable(s)];
  }
  return t;
}
function matchesStrictComparable(e, t) {
  return function (r) {
    return r == null ? !1 : r[e] === t && (t !== void 0 || e in Object(r));
  };
}
function baseMatches(e) {
  var t = getMatchData(e);
  return t.length == 1 && t[0][2]
    ? matchesStrictComparable(t[0][0], t[0][1])
    : function (r) {
        return r === e || baseIsMatch(r, e, t);
      };
}
function baseHasIn(e, t) {
  return e != null && t in Object(e);
}
function hasPath(e, t, r) {
  t = castPath(t, e);
  for (var i = -1, s = t.length, n = !1; ++i < s; ) {
    var l = toKey(t[i]);
    if (!(n = e != null && r(e, l))) break;
    e = e[l];
  }
  return n || ++i != s
    ? n
    : ((s = e == null ? 0 : e.length),
      !!s &&
        isLength(s) &&
        isIndex(l, s) &&
        (isArray$1(e) || isArguments$1(e)));
}
function hasIn(e, t) {
  return e != null && hasPath(e, t, baseHasIn);
}
var COMPARE_PARTIAL_FLAG = 1,
  COMPARE_UNORDERED_FLAG = 2;
function baseMatchesProperty(e, t) {
  return isKey(e) && isStrictComparable(t)
    ? matchesStrictComparable(toKey(e), t)
    : function (r) {
        var i = get(r, e);
        return i === void 0 && i === t
          ? hasIn(r, e)
          : baseIsEqual(t, i, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
}
function baseProperty(e) {
  return function (t) {
    return t == null ? void 0 : t[e];
  };
}
function basePropertyDeep(e) {
  return function (t) {
    return baseGet(t, e);
  };
}
function property(e) {
  return isKey(e) ? baseProperty(toKey(e)) : basePropertyDeep(e);
}
function baseIteratee(e) {
  return typeof e == 'function'
    ? e
    : e == null
    ? identity
    : typeof e == 'object'
    ? isArray$1(e)
      ? baseMatchesProperty(e[0], e[1])
      : baseMatches(e)
    : property(e);
}
function arrayAggregator(e, t, r, i) {
  for (var s = -1, n = e == null ? 0 : e.length; ++s < n; ) {
    var l = e[s];
    t(i, l, r(l), e);
  }
  return i;
}
function createBaseFor(e) {
  return function (t, r, i) {
    for (var s = -1, n = Object(t), l = i(t), u = l.length; u--; ) {
      var d = l[e ? u : ++s];
      if (r(n[d], d, n) === !1) break;
    }
    return t;
  };
}
var baseFor = createBaseFor(),
  baseFor$1 = baseFor;
function baseForOwn(e, t) {
  return e && baseFor$1(e, t, keys);
}
function createBaseEach(e, t) {
  return function (r, i) {
    if (r == null) return r;
    if (!isArrayLike(r)) return e(r, i);
    for (
      var s = r.length, n = t ? s : -1, l = Object(r);
      (t ? n-- : ++n < s) && i(l[n], n, l) !== !1;

    );
    return r;
  };
}
var baseEach = createBaseEach(baseForOwn),
  baseEach$1 = baseEach;
function baseAggregator(e, t, r, i) {
  return (
    baseEach$1(e, function (s, n, l) {
      t(i, s, r(s), l);
    }),
    i
  );
}
function createAggregator(e, t) {
  return function (r, i) {
    var s = isArray$1(r) ? arrayAggregator : baseAggregator,
      n = t ? t() : {};
    return s(r, e, baseIteratee(i), n);
  };
}
var objectProto = Object.prototype,
  hasOwnProperty = objectProto.hasOwnProperty,
  groupBy = createAggregator(function (e, t, r) {
    hasOwnProperty.call(e, r) ? e[r].push(t) : baseAssignValue(e, r, [t]);
  }),
  groupBy$1 = groupBy;
const attachScript = function (e, t, r, i, s, n, l) {
  (e.GoogleAnalyticsObject = s),
    (e[s] =
      e[s] ||
      function () {
        (e[s].q = e[s].q || []).push(arguments);
      }),
    (e[s].l = 1 * new Date()),
    (n = t.createElement(r)),
    (l = t.getElementsByTagName(r)[0]),
    (n.async = 1),
    (n.src = i),
    l.parentNode.insertBefore(n, l);
};
var analytics = (e, t) => {
  attachScript(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga'
  ),
    window.ga('create', 'UA-41619329-3', { cookieDomain: 'auto' }),
    window.ga('require', 'linkid', 'linkid.js'),
    window.ga('send', 'pageview', { page: e, title: t }),
    inIframe() || riveted.init({ reportInterval: 30 });
};
function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return !0;
  }
}
var riveted = (function () {
    var e = !1,
      t = !1,
      r = !1,
      i = 0,
      s = new Date(),
      n = null,
      l = null,
      u,
      d,
      v,
      E,
      _,
      m,
      y,
      c;
    function g(C) {
      typeof ga == 'function' && (m = !0),
        typeof _gaq != 'undefined' &&
          typeof _gaq.push == 'function' &&
          (y = !0),
        typeof dataLayer != 'undefined' &&
          typeof dataLayer.push == 'function' &&
          (c = !0),
        (C = C || {}),
        (v = parseInt(C.reportInterval, 10) || 5),
        (E = parseInt(C.idleTimeout, 10) || 30),
        typeof C.eventHandler == 'function' && (u = C.eventHandler),
        typeof C.userTimingHandler == 'function' && (d = C.userTimingHandler),
        'nonInteraction' in C &&
        (C.nonInteraction === !1 || C.nonInteraction === 'false')
          ? (_ = !1)
          : (_ = !0),
        a(document, 'keydown', I),
        a(document, 'click', I),
        a(window, 'mousemove', p(I, 500)),
        a(window, 'scroll', p(I, 500)),
        a(document, 'visibilitychange', h),
        a(document, 'webkitvisibilitychange', h),
        u(0);
    }
    function p(C, R) {
      var V,
        O,
        D,
        x = null,
        T = 0,
        A = function () {
          (T = new Date()), (x = null), (D = C.apply(V, O));
        };
      return function () {
        var k = new Date();
        T || (T = k);
        var F = R - (k - T);
        return (
          (V = this),
          (O = arguments),
          F <= 0
            ? (clearTimeout(x), (x = null), (T = k), (D = C.apply(V, O)))
            : x || (x = setTimeout(A, F)),
          D
        );
      };
    }
    function a(C, R, V) {
      C.addEventListener
        ? C.addEventListener(R, V, !1)
        : C.attachEvent
        ? C.attachEvent('on' + R, V)
        : (C['on' + R] = V);
    }
    (d = function (C) {
      c
        ? dataLayer.push({
            event: 'RivetedTiming',
            eventCategory: 'Riveted',
            timingVar: 'First Interaction',
            timingValue: C,
          })
        : (m && ga('send', 'timing', 'Riveted', 'First Interaction', C),
          y &&
            _gaq.push([
              '_trackTiming',
              'Riveted',
              'First Interaction',
              C,
              null,
              100,
            ]));
    }),
      (u = function (C) {
        c
          ? dataLayer.push({
              event: 'Riveted',
              eventCategory: 'Riveted',
              eventAction: 'Time Spent',
              eventLabel: C,
              eventValue: v,
              eventNonInteraction: _,
            })
          : (m &&
              ga('send', 'event', 'Riveted', 'Time Spent', C.toString(), v, {
                nonInteraction: _,
              }),
            y &&
              _gaq.push([
                '_trackEvent',
                'Riveted',
                'Time Spent',
                C.toString(),
                v,
                _,
              ]));
      });
    function o() {
      clearTimeout(l), b();
    }
    function h() {
      (document.hidden || document.webkitHidden) && o();
    }
    function f() {
      (i += 1), i > 0 && i % v == 0 && u(i);
    }
    function b() {
      (t = !0), clearTimeout(n);
    }
    function P() {
      o(), (r = !0);
    }
    function S() {
      r = !1;
    }
    function w() {
      (t = !1), clearTimeout(n), (n = setInterval(f, 1e3));
    }
    function M() {
      var C = new Date(),
        R = C - s;
      (e = !0), d(R), (n = setInterval(f, 1e3));
    }
    function I() {
      r ||
        (e || M(),
        t && w(),
        clearTimeout(l),
        (l = setTimeout(o, E * 1e3 + 100)));
    }
    return { init: g, trigger: I, setIdle: o, on: S, off: P };
  })(),
  publisherTags = () => {
    const e = window.googletag || {};
    (e.cmd = e.cmd || []),
      (function () {
        const t = document.createElement('script');
        (t.async = !0), (t.type = 'text/javascript');
        const r = document.location.protocol === 'https:';
        t.src =
          (r ? 'https:' : 'http:') +
          '//www.googletagservices.com/tag/js/gpt.js';
        const i = document.getElementsByTagName('script')[0];
        i.parentNode.insertBefore(t, i);
      })(),
      e.cmd.push(function () {
        e
          .defineSlot(
            '/4735792/reuters_investigates',
            [[300, 250]],
            'div-gpt-ad-1441822201033-0'
          )
          .addService(e.pubads()),
          e.pubads().enableSingleRequest(),
          e.enableServices();
      });
  };
function create_fragment$1(e) {
  let t,
    r,
    i,
    s,
    n,
    l,
    u,
    d,
    v,
    E,
    _,
    m,
    y,
    c,
    g,
    p,
    a,
    o,
    h,
    f,
    b,
    P,
    S,
    w,
    M,
    I,
    C,
    R,
    V,
    O =
      '<script type="application/ld+json" \u2702prettier:content\u2702="JyArIEpTT04uc3RyaW5naWZ5KG9yZ0xkSnNvbikgKyAn" \u2702prettier:content\u2702="e30=">{}</script>',
    D,
    x,
    T =
      '<script type="application/ld+json" \u2702prettier:content\u2702="JyArIEpTT04uc3RyaW5naWZ5KGFydGljbGVMZEpzb24pICsgJw==" \u2702prettier:content\u2702="e30=">{}</script>',
    A;
  return (
    (document.title = r = e[0]),
    {
      c() {
        (t = element('html')),
          (i = element('meta')),
          (s = element('link')),
          (n = element('link')),
          (l = element('link')),
          (u = element('link')),
          (d = element('link')),
          (v = element('meta')),
          (E = element('meta')),
          (_ = element('meta')),
          (m = element('meta')),
          (y = element('meta')),
          (g = element('meta')),
          (p = element('meta')),
          (a = element('meta')),
          (o = element('meta')),
          (h = element('meta')),
          (b = element('meta')),
          (P = element('meta')),
          (S = element('meta')),
          (M = element('meta')),
          (I = element('meta')),
          (C = element('meta')),
          (R = element('meta')),
          (V = new HtmlTagHydration()),
          (D = empty()),
          (x = new HtmlTagHydration()),
          (A = empty()),
          this.h();
      },
      l(k) {
        const F = query_selector_all(
          '[data-svelte="svelte-157iplb"]',
          document.head
        );
        (t = claim_element(F, 'HTML', { lang: !0 })),
          children(t).forEach(detach),
          (i = claim_element(F, 'META', { name: !0, content: !0 })),
          (s = claim_element(F, 'LINK', { rel: !0, href: !0 })),
          (n = claim_element(F, 'LINK', { rel: !0, type: !0, href: !0 })),
          (l = claim_element(F, 'LINK', {
            rel: !0,
            type: !0,
            href: !0,
            sizes: !0,
          })),
          (u = claim_element(F, 'LINK', {
            rel: !0,
            type: !0,
            href: !0,
            sizes: !0,
          })),
          (d = claim_element(F, 'LINK', {
            rel: !0,
            type: !0,
            href: !0,
            sizes: !0,
          })),
          (v = claim_element(F, 'META', { property: !0, content: !0 })),
          (E = claim_element(F, 'META', { property: !0, content: !0 })),
          (_ = claim_element(F, 'META', {
            property: !0,
            content: !0,
            itemprop: !0,
          })),
          (m = claim_element(F, 'META', {
            property: !0,
            content: !0,
            itemprop: !0,
          })),
          (y = claim_element(F, 'META', {
            property: !0,
            content: !0,
            itemprop: !0,
          })),
          (g = claim_element(F, 'META', { property: !0, content: !0 })),
          (p = claim_element(F, 'META', { name: !0, content: !0 })),
          (a = claim_element(F, 'META', { name: !0, content: !0 })),
          (o = claim_element(F, 'META', { name: !0, content: !0 })),
          (h = claim_element(F, 'META', { name: !0, content: !0 })),
          (b = claim_element(F, 'META', { name: !0, content: !0 })),
          (P = claim_element(F, 'META', { name: !0, content: !0 })),
          (S = claim_element(F, 'META', { name: !0, content: !0 })),
          (M = claim_element(F, 'META', { property: !0, content: !0 })),
          (I = claim_element(F, 'META', { property: !0, content: !0 })),
          (C = claim_element(F, 'META', { property: !0, content: !0 })),
          (R = claim_element(F, 'META', { property: !0, content: !0 })),
          (V = claim_html_tag(F)),
          (D = empty()),
          (x = claim_html_tag(F)),
          (A = empty()),
          F.forEach(detach),
          this.h();
      },
      h() {
        attr(t, 'lang', e[5]),
          attr(i, 'name', 'description'),
          attr(i, 'content', e[1]),
          attr(s, 'rel', 'canonical'),
          attr(s, 'href', e[7]),
          attr(n, 'rel', 'shortcut icon'),
          attr(n, 'type', 'image/x-icon'),
          attr(
            n,
            'href',
            'https://s3.reutersmedia.net/resources_v2/images/favicon/favicon.ico'
          ),
          attr(l, 'rel', 'icon'),
          attr(l, 'type', 'image/png'),
          attr(
            l,
            'href',
            'https://s3.reutersmedia.net/resources_v2/images/favicon/favicon-16x16.png'
          ),
          attr(l, 'sizes', '16x16'),
          attr(u, 'rel', 'icon'),
          attr(u, 'type', 'image/png'),
          attr(
            u,
            'href',
            'https://s1.reutersmedia.net/resources_v2/images/favicon/favicon-32x32.png'
          ),
          attr(u, 'sizes', '32x32'),
          attr(d, 'rel', 'icon'),
          attr(d, 'type', 'image/png'),
          attr(
            d,
            'href',
            'https://s3.reutersmedia.net/resources_v2/images/favicon/favicon-96x96.png'
          ),
          attr(d, 'sizes', '96x96'),
          attr(v, 'property', 'og:url'),
          attr(v, 'content', e[7]),
          attr(E, 'property', 'og:type'),
          attr(E, 'content', 'article'),
          attr(_, 'property', 'og:title'),
          attr(_, 'content', e[2]),
          attr(_, 'itemprop', 'name'),
          attr(m, 'property', 'og:description'),
          attr(m, 'content', e[3]),
          attr(m, 'itemprop', 'description'),
          attr(y, 'property', 'og:image'),
          attr(y, 'content', (c = getPath(e[4]))),
          attr(y, 'itemprop', 'image'),
          attr(g, 'property', 'og:site_name'),
          attr(g, 'content', 'Reuters'),
          attr(p, 'name', 'twitter:card'),
          attr(p, 'content', 'summary_large_image'),
          attr(a, 'name', 'twitter:site'),
          attr(a, 'content', '@ReutersGraphics'),
          attr(o, 'name', 'twitter:creator'),
          attr(o, 'content', '@ReutersGraphics'),
          attr(h, 'name', 'twitter:domain'),
          attr(h, 'content', (f = `https://${e[6]}`)),
          attr(b, 'name', 'twitter:title'),
          attr(b, 'content', e[2]),
          attr(P, 'name', 'twitter:description'),
          attr(P, 'content', e[3]),
          attr(S, 'name', 'twitter:image:src'),
          attr(S, 'content', (w = getPath(e[4]))),
          attr(M, 'property', 'fb:app_id'),
          attr(M, 'content', '319194411438328'),
          attr(I, 'property', 'fb:admins'),
          attr(I, 'content', '616167736'),
          attr(C, 'property', 'fb:admins'),
          attr(C, 'content', '625796953'),
          attr(R, 'property', 'fb:admins'),
          attr(R, 'content', '571759798'),
          (V.a = D),
          (x.a = A);
      },
      m(k, F) {
        append_hydration(document.head, t),
          append_hydration(document.head, i),
          append_hydration(document.head, s),
          append_hydration(document.head, n),
          append_hydration(document.head, l),
          append_hydration(document.head, u),
          append_hydration(document.head, d),
          append_hydration(document.head, v),
          append_hydration(document.head, E),
          append_hydration(document.head, _),
          append_hydration(document.head, m),
          append_hydration(document.head, y),
          append_hydration(document.head, g),
          append_hydration(document.head, p),
          append_hydration(document.head, a),
          append_hydration(document.head, o),
          append_hydration(document.head, h),
          append_hydration(document.head, b),
          append_hydration(document.head, P),
          append_hydration(document.head, S),
          append_hydration(document.head, M),
          append_hydration(document.head, I),
          append_hydration(document.head, C),
          append_hydration(document.head, R),
          V.m(O, document.head),
          append_hydration(document.head, D),
          x.m(T, document.head),
          append_hydration(document.head, A);
      },
      p(k, [F]) {
        F & 32 && attr(t, 'lang', k[5]),
          F & 1 && r !== (r = k[0]) && (document.title = r),
          F & 2 && attr(i, 'content', k[1]),
          F & 4 && attr(_, 'content', k[2]),
          F & 8 && attr(m, 'content', k[3]),
          F & 16 && c !== (c = getPath(k[4])) && attr(y, 'content', c),
          F & 64 && f !== (f = `https://${k[6]}`) && attr(h, 'content', f),
          F & 4 && attr(b, 'content', k[2]),
          F & 8 && attr(P, 'content', k[3]),
          F & 16 && w !== (w = getPath(k[4])) && attr(S, 'content', w);
      },
      i: noop,
      o: noop,
      d(k) {
        detach(t),
          detach(i),
          detach(s),
          detach(n),
          detach(l),
          detach(u),
          detach(d),
          detach(v),
          detach(E),
          detach(_),
          detach(m),
          detach(y),
          detach(g),
          detach(p),
          detach(a),
          detach(o),
          detach(h),
          detach(b),
          detach(P),
          detach(S),
          detach(M),
          detach(I),
          detach(C),
          detach(R),
          detach(D),
          k && V.d(),
          detach(A),
          k && x.d();
      },
    }
  );
}
function instance$1(e, t, r) {
  let i;
  component_subscribe(e, page, (m) => r(8, (i = m)));
  let { seoTitle: s } = t,
    { seoDescription: n } = t,
    { shareTitle: l } = t,
    { shareDescription: u } = t,
    { shareImgPath: d } = t,
    { lang: v = 'en' } = t,
    { hostname: E = 'graphics.reuters.com' } = t;
  const _ = get(pkg, 'homepage')
    ? urlJoin(pkg.homepage, i.path, { trailingSlash: !0 })
    : get(pkg, 'reuters.preview')
    ? urlJoin(pkg.reuters.preview, i.path, { trailingSlash: !0 })
    : i.host
    ? urlJoin('https://' + i.host, i.path, { trailingSlash: !0 })
    : `https://${E}`;
  return (
    window.location.host === 'graphics.reuters.com' &&
      (analytics(_, s), publisherTags()),
    getPath(d),
    getPath(d),
    new Date().getFullYear(),
    get(pkg, 'reuters.graphic.published'),
    get(pkg, 'reuters.graphic.published'),
    get(pkg, 'reuters.graphic.updated'),
    get(pkg, 'reuters.graphic.authors', []).map(({ name: m, url: y }) => ({
      '@type': 'Person',
      name: m,
      url: y,
    })),
    (e.$$set = (m) => {
      'seoTitle' in m && r(0, (s = m.seoTitle)),
        'seoDescription' in m && r(1, (n = m.seoDescription)),
        'shareTitle' in m && r(2, (l = m.shareTitle)),
        'shareDescription' in m && r(3, (u = m.shareDescription)),
        'shareImgPath' in m && r(4, (d = m.shareImgPath)),
        'lang' in m && r(5, (v = m.lang)),
        'hostname' in m && r(6, (E = m.hostname));
    }),
    [s, n, l, u, d, v, E, _]
  );
}
class SEO extends SvelteComponent {
  constructor(t) {
    super();
    init(this, t, instance$1, create_fragment$1, safe_not_equal, {
      seoTitle: 0,
      seoDescription: 1,
      shareTitle: 2,
      shareDescription: 3,
      shareImgPath: 4,
      lang: 5,
      hostname: 6,
    });
  }
}
var uaParser = { exports: {} };
/*!@license
 * UAParser.js v0.7.28
 * Lightweight JavaScript-based User-Agent string parser
 * https://github.com/faisalman/ua-parser-js
 *
 * Copyright © 2012-2021 Faisal Salman <f@faisalman.com>
 * Licensed under MIT License
 */ (function (e, t) {
  (function (r, i) {
    var s = '0.7.28',
      n = '',
      l = '?',
      u = 'function',
      d = 'undefined',
      v = 'object',
      E = 'string',
      _ = 'major',
      m = 'model',
      y = 'name',
      c = 'type',
      g = 'vendor',
      p = 'version',
      a = 'architecture',
      o = 'console',
      h = 'mobile',
      f = 'tablet',
      b = 'smarttv',
      P = 'wearable',
      S = 'embedded',
      w = 255,
      M = {
        extend: function (x, T) {
          var A = {};
          for (var k in x)
            T[k] && T[k].length % 2 == 0
              ? (A[k] = T[k].concat(x[k]))
              : (A[k] = x[k]);
          return A;
        },
        has: function (x, T) {
          return typeof x === E
            ? T.toLowerCase().indexOf(x.toLowerCase()) !== -1
            : !1;
        },
        lowerize: function (x) {
          return x.toLowerCase();
        },
        major: function (x) {
          return typeof x === E ? x.replace(/[^\d\.]/g, '').split('.')[0] : i;
        },
        trim: function (x, T) {
          return (
            (x = x.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')),
            typeof T === d ? x : x.substring(0, w)
          );
        },
      },
      I = {
        rgx: function (x, T) {
          for (var A = 0, k, F, L, G, z, N; A < T.length && !z; ) {
            var H = T[A],
              j = T[A + 1];
            for (k = F = 0; k < H.length && !z; )
              if (((z = H[k++].exec(x)), z))
                for (L = 0; L < j.length; L++)
                  (N = z[++F]),
                    (G = j[L]),
                    typeof G === v && G.length > 0
                      ? G.length == 2
                        ? typeof G[1] == u
                          ? (this[G[0]] = G[1].call(this, N))
                          : (this[G[0]] = G[1])
                        : G.length == 3
                        ? typeof G[1] === u && !(G[1].exec && G[1].test)
                          ? (this[G[0]] = N ? G[1].call(this, N, G[2]) : i)
                          : (this[G[0]] = N ? N.replace(G[1], G[2]) : i)
                        : G.length == 4 &&
                          (this[G[0]] = N
                            ? G[3].call(this, N.replace(G[1], G[2]))
                            : i)
                      : (this[G] = N || i);
            A += 2;
          }
        },
        str: function (x, T) {
          for (var A in T)
            if (typeof T[A] === v && T[A].length > 0) {
              for (var k = 0; k < T[A].length; k++)
                if (M.has(T[A][k], x)) return A === l ? i : A;
            } else if (M.has(T[A], x)) return A === l ? i : A;
          return x;
        },
      },
      C = {
        browser: {
          oldSafari: {
            version: {
              '1.0': '/8',
              1.2: '/1',
              1.3: '/3',
              '2.0': '/412',
              '2.0.2': '/416',
              '2.0.3': '/417',
              '2.0.4': '/419',
              '?': '/',
            },
          },
          oldEdge: {
            version: {
              0.1: '12.',
              21: '13.',
              31: '14.',
              39: '15.',
              41: '16.',
              42: '17.',
              44: '18.',
            },
          },
        },
        os: {
          windows: {
            version: {
              ME: '4.90',
              'NT 3.11': 'NT3.51',
              'NT 4.0': 'NT4.0',
              2000: 'NT 5.0',
              XP: ['NT 5.1', 'NT 5.2'],
              Vista: 'NT 6.0',
              7: 'NT 6.1',
              8: 'NT 6.2',
              8.1: 'NT 6.3',
              10: ['NT 6.4', 'NT 10.0'],
              RT: 'ARM',
            },
          },
        },
      },
      R = {
        browser: [
          [/\b(?:crmo|crios)\/([\w\.]+)/i],
          [p, [y, 'Chrome']],
          [/edg(?:e|ios|a)?\/([\w\.]+)/i],
          [p, [y, 'Edge']],
          [
            /(opera\smini)\/([\w\.-]+)/i,
            /(opera\s[mobiletab]{3,6})\b.+version\/([\w\.-]+)/i,
            /(opera)(?:.+version\/|[\/\s]+)([\w\.]+)/i,
          ],
          [y, p],
          [/opios[\/\s]+([\w\.]+)/i],
          [p, [y, 'Opera Mini']],
          [/\sopr\/([\w\.]+)/i],
          [p, [y, 'Opera']],
          [
            /(kindle)\/([\w\.]+)/i,
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
            /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
            /(ba?idubrowser)[\/\s]?([\w\.]+)/i,
            /(?:ms|\()(ie)\s([\w\.]+)/i,
            /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
            /(rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([\w\.]+)/i,
            /(weibo)__([\d\.]+)/i,
          ],
          [y, p],
          [/(?:[\s\/]uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
          [p, [y, 'UCBrowser']],
          [/(?:windowswechat)?\sqbcore\/([\w\.]+)\b.*(?:windowswechat)?/i],
          [p, [y, 'WeChat(Win) Desktop']],
          [/micromessenger\/([\w\.]+)/i],
          [p, [y, 'WeChat']],
          [/konqueror\/([\w\.]+)/i],
          [p, [y, 'Konqueror']],
          [/trident.+rv[:\s]([\w\.]{1,9})\b.+like\sgecko/i],
          [p, [y, 'IE']],
          [/yabrowser\/([\w\.]+)/i],
          [p, [y, 'Yandex']],
          [/(avast|avg)\/([\w\.]+)/i],
          [[y, /(.+)/, '$1 Secure Browser'], p],
          [/focus\/([\w\.]+)/i],
          [p, [y, 'Firefox Focus']],
          [/opt\/([\w\.]+)/i],
          [p, [y, 'Opera Touch']],
          [/coc_coc_browser\/([\w\.]+)/i],
          [p, [y, 'Coc Coc']],
          [/dolfin\/([\w\.]+)/i],
          [p, [y, 'Dolphin']],
          [/coast\/([\w\.]+)/i],
          [p, [y, 'Opera Coast']],
          [/xiaomi\/miuibrowser\/([\w\.]+)/i],
          [p, [y, 'MIUI Browser']],
          [/fxios\/([\w\.-]+)/i],
          [p, [y, 'Firefox']],
          [/(qihu|qhbrowser|qihoobrowser|360browser)/i],
          [[y, '360 Browser']],
          [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
          [[y, /(.+)/, '$1 Browser'], p],
          [/(comodo_dragon)\/([\w\.]+)/i],
          [[y, /_/g, ' '], p],
          [
            /\s(electron)\/([\w\.]+)\ssafari/i,
            /(tesla)(?:\sqtcarbrowser|\/(20[12]\d\.[\w\.-]+))/i,
            /m?(qqbrowser|baiduboxapp|2345Explorer)[\/\s]?([\w\.]+)/i,
          ],
          [y, p],
          [/(MetaSr)[\/\s]?([\w\.]+)/i, /(LBBROWSER)/i],
          [y],
          [/;fbav\/([\w\.]+);/i],
          [p, [y, 'Facebook']],
          [/FBAN\/FBIOS|FB_IAB\/FB4A/i],
          [[y, 'Facebook']],
          [
            /safari\s(line)\/([\w\.]+)/i,
            /\b(line)\/([\w\.]+)\/iab/i,
            /(chromium|instagram)[\/\s]([\w\.-]+)/i,
          ],
          [y, p],
          [/\bgsa\/([\w\.]+)\s.*safari\//i],
          [p, [y, 'GSA']],
          [/headlesschrome(?:\/([\w\.]+)|\s)/i],
          [p, [y, 'Chrome Headless']],
          [/\swv\).+(chrome)\/([\w\.]+)/i],
          [[y, 'Chrome WebView'], p],
          [/droid.+\sversion\/([\w\.]+)\b.+(?:mobile\ssafari|safari)/i],
          [p, [y, 'Android Browser']],
          [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
          [y, p],
          [/version\/([\w\.]+)\s.*mobile\/\w+\s(safari)/i],
          [p, [y, 'Mobile Safari']],
          [/version\/([\w\.]+)\s.*(mobile\s?safari|safari)/i],
          [p, y],
          [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
          [y, [p, I.str, C.browser.oldSafari.version]],
          [/(webkit|khtml)\/([\w\.]+)/i],
          [y, p],
          [/(navigator|netscape)\/([\w\.-]+)/i],
          [[y, 'Netscape'], p],
          [/ile\svr;\srv:([\w\.]+)\).+firefox/i],
          [p, [y, 'Firefox Reality']],
          [
            /ekiohf.+(flow)\/([\w\.]+)/i,
            /(swiftfox)/i,
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,
            /(firefox)\/([\w\.]+)\s[\w\s\-]+\/[\w\.]+$/i,
            /(mozilla)\/([\w\.]+)\s.+rv\:.+gecko\/\d+/i,
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
            /(links)\s\(([\w\.]+)/i,
            /(gobrowser)\/?([\w\.]*)/i,
            /(ice\s?browser)\/v?([\w\._]+)/i,
            /(mosaic)[\/\s]([\w\.]+)/i,
          ],
          [y, p],
        ],
        cpu: [
          [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
          [[a, 'amd64']],
          [/(ia32(?=;))/i],
          [[a, M.lowerize]],
          [/((?:i[346]|x)86)[;\)]/i],
          [[a, 'ia32']],
          [/\b(aarch64|armv?8e?l?)\b/i],
          [[a, 'arm64']],
          [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
          [[a, 'armhf']],
          [/windows\s(ce|mobile);\sppc;/i],
          [[a, 'arm']],
          [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
          [[a, /ower/, '', M.lowerize]],
          [/(sun4\w)[;\)]/i],
          [[a, 'sparc']],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?:64|(?=v(?:[1-7]|[5-7]1)l?|;|eabi))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
          ],
          [[a, M.lowerize]],
        ],
        device: [
          [
            /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus\s10)/i,
          ],
          [m, [g, 'Samsung'], [c, f]],
          [
            /\b((?:s[cgp]h|gt|sm)-\w+|galaxy\snexus)/i,
            /\ssamsung[\s-]([\w-]+)/i,
            /sec-(sgh\w+)/i,
          ],
          [m, [g, 'Samsung'], [c, h]],
          [/\((ip(?:hone|od)[\s\w]*);/i],
          [m, [g, 'Apple'], [c, h]],
          [
            /\((ipad);[\w\s\),;-]+apple/i,
            /applecoremedia\/[\w\.]+\s\((ipad)/i,
            /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
          ],
          [m, [g, 'Apple'], [c, f]],
          [/\b((?:agr|ags[23]|bah2?|sht?)-a?[lw]\d{2})/i],
          [m, [g, 'Huawei'], [c, f]],
          [
            /d\/huawei([\w\s-]+)[;\)]/i,
            /\b(nexus\s6p|vog-[at]?l\d\d|ane-[at]?l[x\d]\d|eml-a?l\d\da?|lya-[at]?l\d[\dc]|clt-a?l\d\di?|ele-l\d\d)/i,
            /\b(\w{2,4}-[atu][ln][01259][019])[;\)\s]/i,
          ],
          [m, [g, 'Huawei'], [c, h]],
          [
            /\b(poco[\s\w]+)(?:\sbuild|\))/i,
            /\b;\s(\w+)\sbuild\/hm\1/i,
            /\b(hm[\s\-_]?note?[\s_]?(?:\d\w)?)\sbuild/i,
            /\b(redmi[\s\-_]?(?:note|k)?[\w\s_]+)(?:\sbuild|\))/i,
            /\b(mi[\s\-_]?(?:a\d|one|one[\s_]plus|note lte)?[\s_]?(?:\d?\w?)[\s_]?(?:plus)?)\sbuild/i,
          ],
          [
            [m, /_/g, ' '],
            [g, 'Xiaomi'],
            [c, h],
          ],
          [/\b(mi[\s\-_]?(?:pad)(?:[\w\s_]+))(?:\sbuild|\))/i],
          [
            [m, /_/g, ' '],
            [g, 'Xiaomi'],
            [c, f],
          ],
          [
            /;\s(\w+)\sbuild.+\soppo/i,
            /\s(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007)\b/i,
          ],
          [m, [g, 'OPPO'], [c, h]],
          [
            /\svivo\s(\w+)(?:\sbuild|\))/i,
            /\s(v[12]\d{3}\w?[at])(?:\sbuild|;)/i,
          ],
          [m, [g, 'Vivo'], [c, h]],
          [/\s(rmx[12]\d{3})(?:\sbuild|;)/i],
          [m, [g, 'Realme'], [c, h]],
          [
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)\b[\w\s]+build\//i,
            /\smot(?:orola)?[\s-](\w*)/i,
            /((?:moto[\s\w\(\)]+|xt\d{3,4}|nexus\s6)(?=\sbuild|\)))/i,
          ],
          [m, [g, 'Motorola'], [c, h]],
          [/\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
          [m, [g, 'Motorola'], [c, f]],
          [
            /((?=lg)?[vl]k\-?\d{3})\sbuild|\s3\.[\s\w;-]{10}lg?-([06cv9]{3,4})/i,
          ],
          [m, [g, 'LG'], [c, f]],
          [
            /(lm-?f100[nv]?|nexus\s[45])/i,
            /lg[e;\s\/-]+((?!browser|netcast)\w+)/i,
            /\blg(\-?[\d\w]+)\sbuild/i,
          ],
          [m, [g, 'LG'], [c, h]],
          [
            /(ideatab[\w\-\s]+)/i,
            /lenovo\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+)|yt[\d\w-]{6}|tb[\d\w-]{6})/i,
          ],
          [m, [g, 'Lenovo'], [c, f]],
          [/(?:maemo|nokia).*(n900|lumia\s\d+)/i, /nokia[\s_-]?([\w\.-]*)/i],
          [
            [m, /_/g, ' '],
            [g, 'Nokia'],
            [c, h],
          ],
          [/droid.+;\s(pixel\sc)[\s)]/i],
          [m, [g, 'Google'], [c, f]],
          [/droid.+;\s(pixel[\s\daxl]{0,6})(?:\sbuild|\))/i],
          [m, [g, 'Google'], [c, h]],
          [
            /droid.+\s([c-g]\d{4}|so[-l]\w+|xq-a\w[4-7][12])(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
          ],
          [m, [g, 'Sony'], [c, h]],
          [/sony\stablet\s[ps]\sbuild\//i, /(?:sony)?sgp\w+(?:\sbuild\/|\))/i],
          [
            [m, 'Xperia Tablet'],
            [g, 'Sony'],
            [c, f],
          ],
          [
            /\s(kb2005|in20[12]5|be20[12][59])\b/i,
            /\ba000(1)\sbuild/i,
            /\boneplus\s(a\d{4})[\s)]/i,
          ],
          [m, [g, 'OnePlus'], [c, h]],
          [
            /(alexa)webm/i,
            /(kf[a-z]{2}wi)(\sbuild\/|\))/i,
            /(kf[a-z]+)(\sbuild\/|\)).+silk\//i,
          ],
          [m, [g, 'Amazon'], [c, f]],
          [/(sd|kf)[0349hijorstuw]+(\sbuild\/|\)).+silk\//i],
          [
            [m, 'Fire Phone'],
            [g, 'Amazon'],
            [c, h],
          ],
          [/\((playbook);[\w\s\),;-]+(rim)/i],
          [m, g, [c, f]],
          [/((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10;\s(\w+)/i],
          [m, [g, 'BlackBerry'], [c, h]],
          [
            /(?:\b|asus_)(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus\s7|padfone|p00[cj])/i,
          ],
          [m, [g, 'ASUS'], [c, f]],
          [/\s(z[es]6[027][01][km][ls]|zenfone\s\d\w?)\b/i],
          [m, [g, 'ASUS'], [c, h]],
          [/(nexus\s9)/i],
          [m, [g, 'HTC'], [c, f]],
          [
            /(htc)[;_\s-]{1,2}([\w\s]+(?=\)|\sbuild)|\w+)/i,
            /(zte)-(\w*)/i,
            /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
          ],
          [g, [m, /_/g, ' '], [c, h]],
          [/droid[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],
          [m, [g, 'Acer'], [c, f]],
          [/droid.+;\s(m[1-5]\snote)\sbuild/i, /\bmz-([\w-]{2,})/i],
          [m, [g, 'Meizu'], [c, h]],
          [
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
            /(hp)\s([\w\s]+\w)/i,
            /(asus)-?(\w+)/i,
            /(microsoft);\s(lumia[\s\w]+)/i,
            /(lenovo)[_\s-]?([\w-]+)/i,
            /linux;.+(jolla);/i,
            /droid.+;\s(oppo)\s?([\w\s]+)\sbuild/i,
          ],
          [g, m, [c, h]],
          [
            /(archos)\s(gamepad2?)/i,
            /(hp).+(touchpad(?!.+tablet)|tablet)/i,
            /(kindle)\/([\w\.]+)/i,
            /\s(nook)[\w\s]+build\/(\w+)/i,
            /(dell)\s(strea[kpr\s\d]*[\dko])/i,
            /[;\/]\s?(le[\s\-]+pan)[\s\-]+(\w{1,9})\sbuild/i,
            /[;\/]\s?(trinity)[\-\s]*(t\d{3})\sbuild/i,
            /\b(gigaset)[\s\-]+(q\w{1,9})\sbuild/i,
            /\b(vodafone)\s([\w\s]+)(?:\)|\sbuild)/i,
          ],
          [g, m, [c, f]],
          [/\s(surface\sduo)\s/i],
          [m, [g, 'Microsoft'], [c, f]],
          [/droid\s[\d\.]+;\s(fp\du?)\sbuild/i],
          [m, [g, 'Fairphone'], [c, h]],
          [/\s(u304aa)\sbuild/i],
          [m, [g, 'AT&T'], [c, h]],
          [/sie-(\w*)/i],
          [m, [g, 'Siemens'], [c, h]],
          [/[;\/]\s?(rct\w+)\sbuild/i],
          [m, [g, 'RCA'], [c, f]],
          [/[;\/\s](venue[\d\s]{2,7})\sbuild/i],
          [m, [g, 'Dell'], [c, f]],
          [/[;\/]\s?(q(?:mv|ta)\w+)\sbuild/i],
          [m, [g, 'Verizon'], [c, f]],
          [/[;\/]\s(?:barnes[&\s]+noble\s|bn[rt])([\w\s\+]*)\sbuild/i],
          [m, [g, 'Barnes & Noble'], [c, f]],
          [/[;\/]\s(tm\d{3}\w+)\sbuild/i],
          [m, [g, 'NuVision'], [c, f]],
          [/;\s(k88)\sbuild/i],
          [m, [g, 'ZTE'], [c, f]],
          [/;\s(nx\d{3}j)\sbuild/i],
          [m, [g, 'ZTE'], [c, h]],
          [/[;\/]\s?(gen\d{3})\sbuild.*49h/i],
          [m, [g, 'Swiss'], [c, h]],
          [/[;\/]\s?(zur\d{3})\sbuild/i],
          [m, [g, 'Swiss'], [c, f]],
          [/[;\/]\s?((zeki)?tb.*\b)\sbuild/i],
          [m, [g, 'Zeki'], [c, f]],
          [
            /[;\/]\s([yr]\d{2})\sbuild/i,
            /[;\/]\s(dragon[\-\s]+touch\s|dt)(\w{5})\sbuild/i,
          ],
          [[g, 'Dragon Touch'], m, [c, f]],
          [/[;\/]\s?(ns-?\w{0,9})\sbuild/i],
          [m, [g, 'Insignia'], [c, f]],
          [/[;\/]\s?((nxa|Next)-?\w{0,9})\sbuild/i],
          [m, [g, 'NextBook'], [c, f]],
          [/[;\/]\s?(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05]))\sbuild/i],
          [[g, 'Voice'], m, [c, h]],
          [/[;\/]\s?(lvtel\-)?(v1[12])\sbuild/i],
          [[g, 'LvTel'], m, [c, h]],
          [/;\s(ph-1)\s/i],
          [m, [g, 'Essential'], [c, h]],
          [/[;\/]\s?(v(100md|700na|7011|917g).*\b)\sbuild/i],
          [m, [g, 'Envizen'], [c, f]],
          [/[;\/]\s?(trio[\s\w\-\.]+)\sbuild/i],
          [m, [g, 'MachSpeed'], [c, f]],
          [/[;\/]\s?tu_(1491)\sbuild/i],
          [m, [g, 'Rotor'], [c, f]],
          [/(shield[\w\s]+)\sbuild/i],
          [m, [g, 'Nvidia'], [c, f]],
          [/(sprint)\s(\w+)/i],
          [g, m, [c, h]],
          [/(kin\.[onetw]{3})/i],
          [
            [m, /\./g, ' '],
            [g, 'Microsoft'],
            [c, h],
          ],
          [/droid\s[\d\.]+;\s(cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
          [m, [g, 'Zebra'], [c, f]],
          [/droid\s[\d\.]+;\s(ec30|ps20|tc[2-8]\d[kx])\)/i],
          [m, [g, 'Zebra'], [c, h]],
          [/\s(ouya)\s/i, /(nintendo)\s([wids3utch]+)/i],
          [g, m, [c, o]],
          [/droid.+;\s(shield)\sbuild/i],
          [m, [g, 'Nvidia'], [c, o]],
          [/(playstation\s[345portablevi]+)/i],
          [m, [g, 'Sony'], [c, o]],
          [/[\s\(;](xbox(?:\sone)?(?!;\sxbox))[\s\);]/i],
          [m, [g, 'Microsoft'], [c, o]],
          [/smart-tv.+(samsung)/i],
          [g, [c, b]],
          [/hbbtv.+maple;(\d+)/i],
          [
            [m, /^/, 'SmartTV'],
            [g, 'Samsung'],
            [c, b],
          ],
          [/(?:linux;\snetcast.+smarttv|lg\snetcast\.tv-201\d)/i],
          [
            [g, 'LG'],
            [c, b],
          ],
          [/(apple)\s?tv/i],
          [g, [m, 'Apple TV'], [c, b]],
          [/crkey/i],
          [
            [m, 'Chromecast'],
            [g, 'Google'],
            [c, b],
          ],
          [/droid.+aft([\w])(\sbuild\/|\))/i],
          [m, [g, 'Amazon'], [c, b]],
          [/\(dtv[\);].+(aquos)/i],
          [m, [g, 'Sharp'], [c, b]],
          [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
          [
            [g, M.trim],
            [m, M.trim],
            [c, b],
          ],
          [/[\s\/\(](android\s|smart[-\s]?|opera\s)tv[;\)\s]/i],
          [[c, b]],
          [/((pebble))app\/[\d\.]+\s/i],
          [g, m, [c, P]],
          [/droid.+;\s(glass)\s\d/i],
          [m, [g, 'Google'], [c, P]],
          [/droid\s[\d\.]+;\s(wt63?0{2,3})\)/i],
          [m, [g, 'Zebra'], [c, P]],
          [/(tesla)(?:\sqtcarbrowser|\/20[12]\d\.[\w\.-]+)/i],
          [g, [c, S]],
          [/droid .+?; ([^;]+?)(?: build|\) applewebkit).+? mobile safari/i],
          [m, [c, h]],
          [
            /droid .+?;\s([^;]+?)(?: build|\) applewebkit).+?(?! mobile) safari/i,
          ],
          [m, [c, f]],
          [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
          [[c, M.lowerize]],
          [/(android[\w\.\s\-]{0,9});.+build/i],
          [m, [g, 'Generic']],
          [/(phone)/i],
          [[c, h]],
        ],
        engine: [
          [/windows.+\sedge\/([\w\.]+)/i],
          [p, [y, 'EdgeHTML']],
          [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
          [p, [y, 'Blink']],
          [
            /(presto)\/([\w\.]+)/i,
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
            /ekioh(flow)\/([\w\.]+)/i,
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,
            /(icab)[\/\s]([23]\.[\d\.]+)/i,
          ],
          [y, p],
          [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
          [p, y],
        ],
        os: [
          [/microsoft\s(windows)\s(vista|xp)/i],
          [y, p],
          [
            /(windows)\snt\s6\.2;\s(arm)/i,
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)(?!.+xbox)/i,
          ],
          [y, [p, I.str, C.os.windows.version]],
          [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
          [
            [y, 'Windows'],
            [p, I.str, C.os.windows.version],
          ],
          [
            /ip[honead]{2,4}\b(?:.*os\s([\w]+)\slike\smac|;\sopera)/i,
            /cfnetwork\/.+darwin/i,
          ],
          [
            [p, /_/g, '.'],
            [y, 'iOS'],
          ],
          [
            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)(?!.+haiku)/i,
          ],
          [
            [y, 'Mac OS'],
            [p, /_/g, '.'],
          ],
          [
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
            /(blackberry)\w*\/([\w\.]*)/i,
            /(tizen|kaios)[\/\s]([\w\.]+)/i,
            /\((series40);/i,
          ],
          [y, p],
          [/\(bb(10);/i],
          [p, [y, 'BlackBerry']],
          [/(?:symbian\s?os|symbos|s60(?=;)|series60)[\/\s-]?([\w\.]*)/i],
          [p, [y, 'Symbian']],
          [/mozilla.+\(mobile;.+gecko.+firefox/i],
          [[y, 'Firefox OS']],
          [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
          [p, [y, 'webOS']],
          [/crkey\/([\d\.]+)/i],
          [p, [y, 'Chromecast']],
          [/(cros)\s[\w]+\s([\w\.]+\w)/i],
          [[y, 'Chromium OS'], p],
          [
            /(nintendo|playstation)\s([wids345portablevuch]+)/i,
            /(xbox);\s+xbox\s([^\);]+)/i,
            /(mint)[\/\s\(\)]?(\w*)/i,
            /(mageia|vectorlinux)[;\s]/i,
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?=\slinux)|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus|raspbian)(?:\sgnu\/linux)?(?:\slinux)?[\/\s-]?(?!chrom|package)([\w\.-]*)/i,
            /(hurd|linux)\s?([\w\.]*)/i,
            /(gnu)\s?([\w\.]*)/i,
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
            /(haiku)\s(\w+)/i,
          ],
          [y, p],
          [/(sunos)\s?([\w\.\d]*)/i],
          [[y, 'Solaris'], p],
          [
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i,
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
            /(unix)\s?([\w\.]*)/i,
          ],
          [y, p],
        ],
      },
      V = function (x, T) {
        if ((typeof x == 'object' && ((T = x), (x = i)), !(this instanceof V)))
          return new V(x, T).getResult();
        var A =
            x ||
            (typeof r != 'undefined' && r.navigator && r.navigator.userAgent
              ? r.navigator.userAgent
              : n),
          k = T ? M.extend(R, T) : R;
        return (
          (this.getBrowser = function () {
            var F = { name: i, version: i };
            return (
              I.rgx.call(F, A, k.browser), (F.major = M.major(F.version)), F
            );
          }),
          (this.getCPU = function () {
            var F = { architecture: i };
            return I.rgx.call(F, A, k.cpu), F;
          }),
          (this.getDevice = function () {
            var F = { vendor: i, model: i, type: i };
            return I.rgx.call(F, A, k.device), F;
          }),
          (this.getEngine = function () {
            var F = { name: i, version: i };
            return I.rgx.call(F, A, k.engine), F;
          }),
          (this.getOS = function () {
            var F = { name: i, version: i };
            return I.rgx.call(F, A, k.os), F;
          }),
          (this.getResult = function () {
            return {
              ua: this.getUA(),
              browser: this.getBrowser(),
              engine: this.getEngine(),
              os: this.getOS(),
              device: this.getDevice(),
              cpu: this.getCPU(),
            };
          }),
          (this.getUA = function () {
            return A;
          }),
          (this.setUA = function (F) {
            return (
              (A = typeof F === E && F.length > w ? M.trim(F, w) : F), this
            );
          }),
          this.setUA(A),
          this
        );
      };
    (V.VERSION = s),
      (V.BROWSER = { NAME: y, MAJOR: _, VERSION: p }),
      (V.CPU = { ARCHITECTURE: a }),
      (V.DEVICE = {
        MODEL: m,
        VENDOR: g,
        TYPE: c,
        CONSOLE: o,
        MOBILE: h,
        SMARTTV: b,
        TABLET: f,
        WEARABLE: P,
        EMBEDDED: S,
      }),
      (V.ENGINE = { NAME: y, VERSION: p }),
      (V.OS = { NAME: y, VERSION: p }),
      e.exports && (t = e.exports = V),
      (t.UAParser = V);
    var O = typeof r != 'undefined' && (r.jQuery || r.Zepto);
    if (O && !O.ua) {
      var D = new V();
      (O.ua = D.getResult()),
        (O.ua.get = function () {
          return D.getUA();
        }),
        (O.ua.set = function (x) {
          D.setUA(x);
          var T = D.getResult();
          for (var A in T) O.ua[A] = T[A];
        });
    }
  })(typeof window == 'object' ? window : commonjsGlobal);
})(uaParser, uaParser.exports);
var index_svelte_svelte_type_style_lang$2 = '',
  Scroller_svelte_svelte_type_style_lang = '';
const handlers = [];
if (typeof window != 'undefined') {
  const e = () => handlers.forEach((t) => t());
  window.addEventListener('scroll', e), window.addEventListener('resize', e);
}
if (typeof IntersectionObserver != 'undefined') {
  const e = new Map();
  new IntersectionObserver(
    (t, r) => {
      t.forEach((i) => {
        const s = e.get(i.target),
          n = handlers.indexOf(s);
        i.isIntersecting
          ? n === -1 && handlers.push(s)
          : (s(), n !== -1 && handlers.splice(n, 1));
      });
    },
    { rootMargin: '400px 0px' }
  );
}
var Background_svelte_svelte_type_style_lang = '',
  Foreground_svelte_svelte_type_style_lang$1 = '',
  Foreground_svelte_svelte_type_style_lang = '',
  index_svelte_svelte_type_style_lang$1 = '',
  lottie = { exports: {} };
(function (module) {
  typeof navigator != 'undefined' &&
    (function (e, t) {
      module.exports
        ? (module.exports = t(e))
        : ((e.lottie = t(e)), (e.bodymovin = e.lottie));
    })(window || {}, function (window) {
      var svgNS = 'http://www.w3.org/2000/svg',
        locationHref = '',
        initialDefaultFrame = -999999,
        subframeEnabled = !0,
        idPrefix = '',
        expressionsPlugin,
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
        bmPow = Math.pow,
        bmSqrt = Math.sqrt,
        bmFloor = Math.floor,
        bmMax = Math.max,
        bmMin = Math.min,
        BMMath = {};
      (function () {
        var e = [
            'abs',
            'acos',
            'acosh',
            'asin',
            'asinh',
            'atan',
            'atanh',
            'atan2',
            'ceil',
            'cbrt',
            'expm1',
            'clz32',
            'cos',
            'cosh',
            'exp',
            'floor',
            'fround',
            'hypot',
            'imul',
            'log',
            'log1p',
            'log2',
            'log10',
            'max',
            'min',
            'pow',
            'random',
            'round',
            'sign',
            'sin',
            'sinh',
            'sqrt',
            'tan',
            'tanh',
            'trunc',
            'E',
            'LN10',
            'LN2',
            'LOG10E',
            'LOG2E',
            'PI',
            'SQRT1_2',
            'SQRT2',
          ],
          t,
          r = e.length;
        for (t = 0; t < r; t += 1) BMMath[e[t]] = Math[e[t]];
      })();
      function ProjectInterface() {
        return {};
      }
      (BMMath.random = Math.random),
        (BMMath.abs = function (e) {
          var t = typeof e;
          if (t === 'object' && e.length) {
            var r = createSizedArray(e.length),
              i,
              s = e.length;
            for (i = 0; i < s; i += 1) r[i] = Math.abs(e[i]);
            return r;
          }
          return Math.abs(e);
        });
      var defaultCurveSegments = 150,
        degToRads = Math.PI / 180,
        roundCorner = 0.5519;
      function styleDiv(e) {
        (e.style.position = 'absolute'),
          (e.style.top = 0),
          (e.style.left = 0),
          (e.style.display = 'block'),
          (e.style.transformOrigin = '0 0'),
          (e.style.webkitTransformOrigin = '0 0'),
          (e.style.backfaceVisibility = 'visible'),
          (e.style.webkitBackfaceVisibility = 'visible'),
          (e.style.transformStyle = 'preserve-3d'),
          (e.style.webkitTransformStyle = 'preserve-3d'),
          (e.style.mozTransformStyle = 'preserve-3d');
      }
      function BMEnterFrameEvent(e, t, r, i) {
        (this.type = e),
          (this.currentTime = t),
          (this.totalTime = r),
          (this.direction = i < 0 ? -1 : 1);
      }
      function BMCompleteEvent(e, t) {
        (this.type = e), (this.direction = t < 0 ? -1 : 1);
      }
      function BMCompleteLoopEvent(e, t, r, i) {
        (this.type = e),
          (this.currentLoop = r),
          (this.totalLoops = t),
          (this.direction = i < 0 ? -1 : 1);
      }
      function BMSegmentStartEvent(e, t, r) {
        (this.type = e), (this.firstFrame = t), (this.totalFrames = r);
      }
      function BMDestroyEvent(e, t) {
        (this.type = e), (this.target = t);
      }
      function BMRenderFrameErrorEvent(e, t) {
        (this.type = 'renderFrameError'),
          (this.nativeError = e),
          (this.currentTime = t);
      }
      function BMConfigErrorEvent(e) {
        (this.type = 'configError'), (this.nativeError = e);
      }
      var createElementID = (function () {
        var e = 0;
        return function () {
          return (e += 1), idPrefix + '__lottie_element_' + e;
        };
      })();
      function HSVtoRGB(e, t, r) {
        var i, s, n, l, u, d, v, E;
        switch (
          ((l = Math.floor(e * 6)),
          (u = e * 6 - l),
          (d = r * (1 - t)),
          (v = r * (1 - u * t)),
          (E = r * (1 - (1 - u) * t)),
          l % 6)
        ) {
          case 0:
            (i = r), (s = E), (n = d);
            break;
          case 1:
            (i = v), (s = r), (n = d);
            break;
          case 2:
            (i = d), (s = r), (n = E);
            break;
          case 3:
            (i = d), (s = v), (n = r);
            break;
          case 4:
            (i = E), (s = d), (n = r);
            break;
          case 5:
            (i = r), (s = d), (n = v);
            break;
        }
        return [i, s, n];
      }
      function RGBtoHSV(e, t, r) {
        var i = Math.max(e, t, r),
          s = Math.min(e, t, r),
          n = i - s,
          l,
          u = i === 0 ? 0 : n / i,
          d = i / 255;
        switch (i) {
          case s:
            l = 0;
            break;
          case e:
            (l = t - r + n * (t < r ? 6 : 0)), (l /= 6 * n);
            break;
          case t:
            (l = r - e + n * 2), (l /= 6 * n);
            break;
          case r:
            (l = e - t + n * 4), (l /= 6 * n);
            break;
        }
        return [l, u, d];
      }
      function addSaturationToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[1] += t),
          r[1] > 1 ? (r[1] = 1) : r[1] <= 0 && (r[1] = 0),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      function addBrightnessToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[2] += t),
          r[2] > 1 ? (r[2] = 1) : r[2] < 0 && (r[2] = 0),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      function addHueToRGB(e, t) {
        var r = RGBtoHSV(e[0] * 255, e[1] * 255, e[2] * 255);
        return (
          (r[0] += t / 360),
          r[0] > 1 ? (r[0] -= 1) : r[0] < 0 && (r[0] += 1),
          HSVtoRGB(r[0], r[1], r[2])
        );
      }
      var rgbToHex = (function () {
        var e = [],
          t,
          r;
        for (t = 0; t < 256; t += 1)
          (r = t.toString(16)), (e[t] = r.length === 1 ? '0' + r : r);
        return function (i, s, n) {
          return (
            i < 0 && (i = 0),
            s < 0 && (s = 0),
            n < 0 && (n = 0),
            '#' + e[i] + e[s] + e[n]
          );
        };
      })();
      function BaseEvent() {}
      BaseEvent.prototype = {
        triggerEvent: function (e, t) {
          if (this._cbs[e])
            for (var r = this._cbs[e], i = 0; i < r.length; i += 1) r[i](t);
        },
        addEventListener: function (e, t) {
          return (
            this._cbs[e] || (this._cbs[e] = []),
            this._cbs[e].push(t),
            function () {
              this.removeEventListener(e, t);
            }.bind(this)
          );
        },
        removeEventListener: function (e, t) {
          if (!t) this._cbs[e] = null;
          else if (this._cbs[e]) {
            for (var r = 0, i = this._cbs[e].length; r < i; )
              this._cbs[e][r] === t &&
                (this._cbs[e].splice(r, 1), (r -= 1), (i -= 1)),
                (r += 1);
            this._cbs[e].length || (this._cbs[e] = null);
          }
        },
      };
      var createTypedArray = (function () {
        function e(r, i) {
          var s = 0,
            n = [],
            l;
          switch (r) {
            case 'int16':
            case 'uint8c':
              l = 1;
              break;
            default:
              l = 1.1;
              break;
          }
          for (s = 0; s < i; s += 1) n.push(l);
          return n;
        }
        function t(r, i) {
          return r === 'float32'
            ? new Float32Array(i)
            : r === 'int16'
            ? new Int16Array(i)
            : r === 'uint8c'
            ? new Uint8ClampedArray(i)
            : e(r, i);
        }
        return typeof Uint8ClampedArray == 'function' &&
          typeof Float32Array == 'function'
          ? t
          : e;
      })();
      function createSizedArray(e) {
        return Array.apply(null, { length: e });
      }
      function createNS(e) {
        return document.createElementNS(svgNS, e);
      }
      function createTag(e) {
        return document.createElement(e);
      }
      function DynamicPropertyContainer() {}
      DynamicPropertyContainer.prototype = {
        addDynamicProperty: function (e) {
          this.dynamicProperties.indexOf(e) === -1 &&
            (this.dynamicProperties.push(e),
            this.container.addDynamicProperty(this),
            (this._isAnimated = !0));
        },
        iterateDynamicProperties: function () {
          this._mdf = !1;
          var e,
            t = this.dynamicProperties.length;
          for (e = 0; e < t; e += 1)
            this.dynamicProperties[e].getValue(),
              this.dynamicProperties[e]._mdf && (this._mdf = !0);
        },
        initDynamicPropertyContainer: function (e) {
          (this.container = e),
            (this.dynamicProperties = []),
            (this._mdf = !1),
            (this._isAnimated = !1);
        },
      };
      var getBlendMode = (function () {
          var e = {
            0: 'source-over',
            1: 'multiply',
            2: 'screen',
            3: 'overlay',
            4: 'darken',
            5: 'lighten',
            6: 'color-dodge',
            7: 'color-burn',
            8: 'hard-light',
            9: 'soft-light',
            10: 'difference',
            11: 'exclusion',
            12: 'hue',
            13: 'saturation',
            14: 'color',
            15: 'luminosity',
          };
          return function (t) {
            return e[t] || '';
          };
        })(),
        lineCapEnum = { 1: 'butt', 2: 'round', 3: 'square' },
        lineJoinEnum = { 1: 'miter', 2: 'round', 3: 'bevel' };
      /*!
 Transformation Matrix v2.0
 (c) Epistemex 2014-2015
 www.epistemex.com
 By Ken Fyrstenberg
 Contributions by leeoniya.
 License: MIT, header required.
 */ var Matrix = (function () {
        var e = Math.cos,
          t = Math.sin,
          r = Math.tan,
          i = Math.round;
        function s() {
          return (
            (this.props[0] = 1),
            (this.props[1] = 0),
            (this.props[2] = 0),
            (this.props[3] = 0),
            (this.props[4] = 0),
            (this.props[5] = 1),
            (this.props[6] = 0),
            (this.props[7] = 0),
            (this.props[8] = 0),
            (this.props[9] = 0),
            (this.props[10] = 1),
            (this.props[11] = 0),
            (this.props[12] = 0),
            (this.props[13] = 0),
            (this.props[14] = 0),
            (this.props[15] = 1),
            this
          );
        }
        function n(T) {
          if (T === 0) return this;
          var A = e(T),
            k = t(T);
          return this._t(A, -k, 0, 0, k, A, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function l(T) {
          if (T === 0) return this;
          var A = e(T),
            k = t(T);
          return this._t(1, 0, 0, 0, 0, A, -k, 0, 0, k, A, 0, 0, 0, 0, 1);
        }
        function u(T) {
          if (T === 0) return this;
          var A = e(T),
            k = t(T);
          return this._t(A, 0, k, 0, 0, 1, 0, 0, -k, 0, A, 0, 0, 0, 0, 1);
        }
        function d(T) {
          if (T === 0) return this;
          var A = e(T),
            k = t(T);
          return this._t(A, -k, 0, 0, k, A, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function v(T, A) {
          return this._t(1, A, T, 1, 0, 0);
        }
        function E(T, A) {
          return this.shear(r(T), r(A));
        }
        function _(T, A) {
          var k = e(A),
            F = t(A);
          return this._t(k, F, 0, 0, -F, k, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(1, 0, 0, 0, r(T), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
            ._t(k, -F, 0, 0, F, k, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        }
        function m(T, A, k) {
          return (
            !k && k !== 0 && (k = 1),
            T === 1 && A === 1 && k === 1
              ? this
              : this._t(T, 0, 0, 0, 0, A, 0, 0, 0, 0, k, 0, 0, 0, 0, 1)
          );
        }
        function y(T, A, k, F, L, G, z, N, H, j, W, K, Z, U, q, X) {
          return (
            (this.props[0] = T),
            (this.props[1] = A),
            (this.props[2] = k),
            (this.props[3] = F),
            (this.props[4] = L),
            (this.props[5] = G),
            (this.props[6] = z),
            (this.props[7] = N),
            (this.props[8] = H),
            (this.props[9] = j),
            (this.props[10] = W),
            (this.props[11] = K),
            (this.props[12] = Z),
            (this.props[13] = U),
            (this.props[14] = q),
            (this.props[15] = X),
            this
          );
        }
        function c(T, A, k) {
          return (
            (k = k || 0),
            T !== 0 || A !== 0 || k !== 0
              ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, T, A, k, 1)
              : this
          );
        }
        function g(T, A, k, F, L, G, z, N, H, j, W, K, Z, U, q, X) {
          var B = this.props;
          if (
            T === 1 &&
            A === 0 &&
            k === 0 &&
            F === 0 &&
            L === 0 &&
            G === 1 &&
            z === 0 &&
            N === 0 &&
            H === 0 &&
            j === 0 &&
            W === 1 &&
            K === 0
          )
            return (
              (B[12] = B[12] * T + B[15] * Z),
              (B[13] = B[13] * G + B[15] * U),
              (B[14] = B[14] * W + B[15] * q),
              (B[15] *= X),
              (this._identityCalculated = !1),
              this
            );
          var $ = B[0],
            te = B[1],
            ne = B[2],
            re = B[3],
            ee = B[4],
            ie = B[5],
            se = B[6],
            Y = B[7],
            ae = B[8],
            oe = B[9],
            J = B[10],
            le = B[11],
            Q = B[12],
            he = B[13],
            fe = B[14],
            ce = B[15];
          return (
            (B[0] = $ * T + te * L + ne * H + re * Z),
            (B[1] = $ * A + te * G + ne * j + re * U),
            (B[2] = $ * k + te * z + ne * W + re * q),
            (B[3] = $ * F + te * N + ne * K + re * X),
            (B[4] = ee * T + ie * L + se * H + Y * Z),
            (B[5] = ee * A + ie * G + se * j + Y * U),
            (B[6] = ee * k + ie * z + se * W + Y * q),
            (B[7] = ee * F + ie * N + se * K + Y * X),
            (B[8] = ae * T + oe * L + J * H + le * Z),
            (B[9] = ae * A + oe * G + J * j + le * U),
            (B[10] = ae * k + oe * z + J * W + le * q),
            (B[11] = ae * F + oe * N + J * K + le * X),
            (B[12] = Q * T + he * L + fe * H + ce * Z),
            (B[13] = Q * A + he * G + fe * j + ce * U),
            (B[14] = Q * k + he * z + fe * W + ce * q),
            (B[15] = Q * F + he * N + fe * K + ce * X),
            (this._identityCalculated = !1),
            this
          );
        }
        function p() {
          return (
            this._identityCalculated ||
              ((this._identity = !(
                this.props[0] !== 1 ||
                this.props[1] !== 0 ||
                this.props[2] !== 0 ||
                this.props[3] !== 0 ||
                this.props[4] !== 0 ||
                this.props[5] !== 1 ||
                this.props[6] !== 0 ||
                this.props[7] !== 0 ||
                this.props[8] !== 0 ||
                this.props[9] !== 0 ||
                this.props[10] !== 1 ||
                this.props[11] !== 0 ||
                this.props[12] !== 0 ||
                this.props[13] !== 0 ||
                this.props[14] !== 0 ||
                this.props[15] !== 1
              )),
              (this._identityCalculated = !0)),
            this._identity
          );
        }
        function a(T) {
          for (var A = 0; A < 16; ) {
            if (T.props[A] !== this.props[A]) return !1;
            A += 1;
          }
          return !0;
        }
        function o(T) {
          var A;
          for (A = 0; A < 16; A += 1) T.props[A] = this.props[A];
          return T;
        }
        function h(T) {
          var A;
          for (A = 0; A < 16; A += 1) this.props[A] = T[A];
        }
        function f(T, A, k) {
          return {
            x:
              T * this.props[0] +
              A * this.props[4] +
              k * this.props[8] +
              this.props[12],
            y:
              T * this.props[1] +
              A * this.props[5] +
              k * this.props[9] +
              this.props[13],
            z:
              T * this.props[2] +
              A * this.props[6] +
              k * this.props[10] +
              this.props[14],
          };
        }
        function b(T, A, k) {
          return (
            T * this.props[0] +
            A * this.props[4] +
            k * this.props[8] +
            this.props[12]
          );
        }
        function P(T, A, k) {
          return (
            T * this.props[1] +
            A * this.props[5] +
            k * this.props[9] +
            this.props[13]
          );
        }
        function S(T, A, k) {
          return (
            T * this.props[2] +
            A * this.props[6] +
            k * this.props[10] +
            this.props[14]
          );
        }
        function w() {
          var T = this.props[0] * this.props[5] - this.props[1] * this.props[4],
            A = this.props[5] / T,
            k = -this.props[1] / T,
            F = -this.props[4] / T,
            L = this.props[0] / T,
            G =
              (this.props[4] * this.props[13] -
                this.props[5] * this.props[12]) /
              T,
            z =
              -(
                this.props[0] * this.props[13] -
                this.props[1] * this.props[12]
              ) / T,
            N = new Matrix();
          return (
            (N.props[0] = A),
            (N.props[1] = k),
            (N.props[4] = F),
            (N.props[5] = L),
            (N.props[12] = G),
            (N.props[13] = z),
            N
          );
        }
        function M(T) {
          var A = this.getInverseMatrix();
          return A.applyToPointArray(T[0], T[1], T[2] || 0);
        }
        function I(T) {
          var A,
            k = T.length,
            F = [];
          for (A = 0; A < k; A += 1) F[A] = M(T[A]);
          return F;
        }
        function C(T, A, k) {
          var F = createTypedArray('float32', 6);
          if (this.isIdentity())
            (F[0] = T[0]),
              (F[1] = T[1]),
              (F[2] = A[0]),
              (F[3] = A[1]),
              (F[4] = k[0]),
              (F[5] = k[1]);
          else {
            var L = this.props[0],
              G = this.props[1],
              z = this.props[4],
              N = this.props[5],
              H = this.props[12],
              j = this.props[13];
            (F[0] = T[0] * L + T[1] * z + H),
              (F[1] = T[0] * G + T[1] * N + j),
              (F[2] = A[0] * L + A[1] * z + H),
              (F[3] = A[0] * G + A[1] * N + j),
              (F[4] = k[0] * L + k[1] * z + H),
              (F[5] = k[0] * G + k[1] * N + j);
          }
          return F;
        }
        function R(T, A, k) {
          var F;
          return (
            this.isIdentity()
              ? (F = [T, A, k])
              : (F = [
                  T * this.props[0] +
                    A * this.props[4] +
                    k * this.props[8] +
                    this.props[12],
                  T * this.props[1] +
                    A * this.props[5] +
                    k * this.props[9] +
                    this.props[13],
                  T * this.props[2] +
                    A * this.props[6] +
                    k * this.props[10] +
                    this.props[14],
                ]),
            F
          );
        }
        function V(T, A) {
          if (this.isIdentity()) return T + ',' + A;
          var k = this.props;
          return (
            Math.round((T * k[0] + A * k[4] + k[12]) * 100) / 100 +
            ',' +
            Math.round((T * k[1] + A * k[5] + k[13]) * 100) / 100
          );
        }
        function O() {
          for (var T = 0, A = this.props, k = 'matrix3d(', F = 1e4; T < 16; )
            (k += i(A[T] * F) / F), (k += T === 15 ? ')' : ','), (T += 1);
          return k;
        }
        function D(T) {
          var A = 1e4;
          return (T < 1e-6 && T > 0) || (T > -1e-6 && T < 0) ? i(T * A) / A : T;
        }
        function x() {
          var T = this.props,
            A = D(T[0]),
            k = D(T[1]),
            F = D(T[4]),
            L = D(T[5]),
            G = D(T[12]),
            z = D(T[13]);
          return (
            'matrix(' +
            A +
            ',' +
            k +
            ',' +
            F +
            ',' +
            L +
            ',' +
            G +
            ',' +
            z +
            ')'
          );
        }
        return function () {
          (this.reset = s),
            (this.rotate = n),
            (this.rotateX = l),
            (this.rotateY = u),
            (this.rotateZ = d),
            (this.skew = E),
            (this.skewFromAxis = _),
            (this.shear = v),
            (this.scale = m),
            (this.setTransform = y),
            (this.translate = c),
            (this.transform = g),
            (this.applyToPoint = f),
            (this.applyToX = b),
            (this.applyToY = P),
            (this.applyToZ = S),
            (this.applyToPointArray = R),
            (this.applyToTriplePoints = C),
            (this.applyToPointStringified = V),
            (this.toCSS = O),
            (this.to2dCSS = x),
            (this.clone = o),
            (this.cloneFromProps = h),
            (this.equals = a),
            (this.inversePoints = I),
            (this.inversePoint = M),
            (this.getInverseMatrix = w),
            (this._t = this.transform),
            (this.isIdentity = p),
            (this._identity = !0),
            (this._identityCalculated = !1),
            (this.props = createTypedArray('float32', 16)),
            this.reset();
        };
      })();
      (function (e, t) {
        var r = this,
          i = 256,
          s = 6,
          n = 52,
          l = 'random',
          u = t.pow(i, s),
          d = t.pow(2, n),
          v = d * 2,
          E = i - 1,
          _;
        function m(h, f, b) {
          var P = [];
          f = f === !0 ? { entropy: !0 } : f || {};
          var S = p(g(f.entropy ? [h, o(e)] : h === null ? a() : h, 3), P),
            w = new y(P),
            M = function () {
              for (var I = w.g(s), C = u, R = 0; I < d; )
                (I = (I + R) * i), (C *= i), (R = w.g(1));
              for (; I >= v; ) (I /= 2), (C /= 2), (R >>>= 1);
              return (I + R) / C;
            };
          return (
            (M.int32 = function () {
              return w.g(4) | 0;
            }),
            (M.quick = function () {
              return w.g(4) / 4294967296;
            }),
            (M.double = M),
            p(o(w.S), e),
            (
              f.pass ||
              b ||
              function (I, C, R, V) {
                return (
                  V &&
                    (V.S && c(V, w),
                    (I.state = function () {
                      return c(w, {});
                    })),
                  R ? ((t[l] = I), C) : I
                );
              }
            )(M, S, 'global' in f ? f.global : this == t, f.state)
          );
        }
        t['seed' + l] = m;
        function y(h) {
          var f,
            b = h.length,
            P = this,
            S = 0,
            w = (P.i = P.j = 0),
            M = (P.S = []);
          for (b || (h = [b++]); S < i; ) M[S] = S++;
          for (S = 0; S < i; S++)
            (M[S] = M[(w = E & (w + h[S % b] + (f = M[S])))]), (M[w] = f);
          P.g = function (I) {
            for (var C, R = 0, V = P.i, O = P.j, D = P.S; I--; )
              (C = D[(V = E & (V + 1))]),
                (R =
                  R * i + D[E & ((D[V] = D[(O = E & (O + C))]) + (D[O] = C))]);
            return (P.i = V), (P.j = O), R;
          };
        }
        function c(h, f) {
          return (f.i = h.i), (f.j = h.j), (f.S = h.S.slice()), f;
        }
        function g(h, f) {
          var b = [],
            P = typeof h,
            S;
          if (f && P == 'object')
            for (S in h)
              try {
                b.push(g(h[S], f - 1));
              } catch (w) {}
          return b.length ? b : P == 'string' ? h : h + '\0';
        }
        function p(h, f) {
          for (var b = h + '', P, S = 0; S < b.length; )
            f[E & S] = E & ((P ^= f[E & S] * 19) + b.charCodeAt(S++));
          return o(f);
        }
        function a() {
          try {
            var h = new Uint8Array(i);
            return (r.crypto || r.msCrypto).getRandomValues(h), o(h);
          } catch (P) {
            var f = r.navigator,
              b = f && f.plugins;
            return [+new Date(), r, b, r.screen, o(e)];
          }
        }
        function o(h) {
          return String.fromCharCode.apply(0, h);
        }
        p(t.random(), e);
      })([], BMMath);
      var BezierFactory = (function () {
        var e = {};
        e.getBezierEasing = r;
        var t = {};
        function r(o, h, f, b, P) {
          var S =
            P || ('bez_' + o + '_' + h + '_' + f + '_' + b).replace(/\./g, 'p');
          if (t[S]) return t[S];
          var w = new a([o, h, f, b]);
          return (t[S] = w), w;
        }
        var i = 4,
          s = 0.001,
          n = 1e-7,
          l = 10,
          u = 11,
          d = 1 / (u - 1),
          v = typeof Float32Array == 'function';
        function E(o, h) {
          return 1 - 3 * h + 3 * o;
        }
        function _(o, h) {
          return 3 * h - 6 * o;
        }
        function m(o) {
          return 3 * o;
        }
        function y(o, h, f) {
          return ((E(h, f) * o + _(h, f)) * o + m(h)) * o;
        }
        function c(o, h, f) {
          return 3 * E(h, f) * o * o + 2 * _(h, f) * o + m(h);
        }
        function g(o, h, f, b, P) {
          var S,
            w,
            M = 0;
          do
            (w = h + (f - h) / 2),
              (S = y(w, b, P) - o),
              S > 0 ? (f = w) : (h = w);
          while (Math.abs(S) > n && ++M < l);
          return w;
        }
        function p(o, h, f, b) {
          for (var P = 0; P < i; ++P) {
            var S = c(h, f, b);
            if (S === 0) return h;
            var w = y(h, f, b) - o;
            h -= w / S;
          }
          return h;
        }
        function a(o) {
          (this._p = o),
            (this._mSampleValues = v ? new Float32Array(u) : new Array(u)),
            (this._precomputed = !1),
            (this.get = this.get.bind(this));
        }
        return (
          (a.prototype = {
            get: function (o) {
              var h = this._p[0],
                f = this._p[1],
                b = this._p[2],
                P = this._p[3];
              return (
                this._precomputed || this._precompute(),
                h === f && b === P
                  ? o
                  : o === 0
                  ? 0
                  : o === 1
                  ? 1
                  : y(this._getTForX(o), f, P)
              );
            },
            _precompute: function () {
              var o = this._p[0],
                h = this._p[1],
                f = this._p[2],
                b = this._p[3];
              (this._precomputed = !0),
                (o !== h || f !== b) && this._calcSampleValues();
            },
            _calcSampleValues: function () {
              for (var o = this._p[0], h = this._p[2], f = 0; f < u; ++f)
                this._mSampleValues[f] = y(f * d, o, h);
            },
            _getTForX: function (o) {
              for (
                var h = this._p[0],
                  f = this._p[2],
                  b = this._mSampleValues,
                  P = 0,
                  S = 1,
                  w = u - 1;
                S !== w && b[S] <= o;
                ++S
              )
                P += d;
              --S;
              var M = (o - b[S]) / (b[S + 1] - b[S]),
                I = P + M * d,
                C = c(I, h, f);
              return C >= s
                ? p(o, I, h, f)
                : C === 0
                ? I
                : g(o, P, P + d, h, f);
            },
          }),
          e
        );
      })();
      (function () {
        for (
          var e = 0, t = ['ms', 'moz', 'webkit', 'o'], r = 0;
          r < t.length && !window.requestAnimationFrame;
          ++r
        )
          (window.requestAnimationFrame =
            window[t[r] + 'RequestAnimationFrame']),
            (window.cancelAnimationFrame =
              window[t[r] + 'CancelAnimationFrame'] ||
              window[t[r] + 'CancelRequestAnimationFrame']);
        window.requestAnimationFrame ||
          (window.requestAnimationFrame = function (i) {
            var s = new Date().getTime(),
              n = Math.max(0, 16 - (s - e)),
              l = setTimeout(function () {
                i(s + n);
              }, n);
            return (e = s + n), l;
          }),
          window.cancelAnimationFrame ||
            (window.cancelAnimationFrame = function (i) {
              clearTimeout(i);
            });
      })();
      function extendPrototype(e, t) {
        var r,
          i = e.length,
          s;
        for (r = 0; r < i; r += 1) {
          s = e[r].prototype;
          for (var n in s)
            Object.prototype.hasOwnProperty.call(s, n) &&
              (t.prototype[n] = s[n]);
        }
      }
      function getDescriptor(e, t) {
        return Object.getOwnPropertyDescriptor(e, t);
      }
      function createProxyFunction(e) {
        function t() {}
        return (t.prototype = e), t;
      }
      function bezFunction() {
        var e = Math;
        function t(m, y, c, g, p, a) {
          var o = m * g + y * p + c * a - p * g - a * m - c * y;
          return o > -0.001 && o < 0.001;
        }
        function r(m, y, c, g, p, a, o, h, f) {
          if (c === 0 && a === 0 && f === 0) return t(m, y, g, p, o, h);
          var b = e.sqrt(e.pow(g - m, 2) + e.pow(p - y, 2) + e.pow(a - c, 2)),
            P = e.sqrt(e.pow(o - m, 2) + e.pow(h - y, 2) + e.pow(f - c, 2)),
            S = e.sqrt(e.pow(o - g, 2) + e.pow(h - p, 2) + e.pow(f - a, 2)),
            w;
          return (
            b > P
              ? b > S
                ? (w = b - P - S)
                : (w = S - P - b)
              : S > P
              ? (w = S - P - b)
              : (w = P - b - S),
            w > -1e-4 && w < 1e-4
          );
        }
        var i = (function () {
          return function (m, y, c, g) {
            var p = defaultCurveSegments,
              a,
              o,
              h,
              f,
              b,
              P = 0,
              S,
              w = [],
              M = [],
              I = bezierLengthPool.newElement();
            for (h = c.length, a = 0; a < p; a += 1) {
              for (b = a / (p - 1), S = 0, o = 0; o < h; o += 1)
                (f =
                  bmPow(1 - b, 3) * m[o] +
                  3 * bmPow(1 - b, 2) * b * c[o] +
                  3 * (1 - b) * bmPow(b, 2) * g[o] +
                  bmPow(b, 3) * y[o]),
                  (w[o] = f),
                  M[o] !== null && (S += bmPow(w[o] - M[o], 2)),
                  (M[o] = w[o]);
              S && ((S = bmSqrt(S)), (P += S)),
                (I.percents[a] = b),
                (I.lengths[a] = P);
            }
            return (I.addedLength = P), I;
          };
        })();
        function s(m) {
          var y = segmentsLengthPool.newElement(),
            c = m.c,
            g = m.v,
            p = m.o,
            a = m.i,
            o,
            h = m._length,
            f = y.lengths,
            b = 0;
          for (o = 0; o < h - 1; o += 1)
            (f[o] = i(g[o], g[o + 1], p[o], a[o + 1])), (b += f[o].addedLength);
          return (
            c &&
              h &&
              ((f[o] = i(g[o], g[0], p[o], a[0])), (b += f[o].addedLength)),
            (y.totalLength = b),
            y
          );
        }
        function n(m) {
          (this.segmentLength = 0), (this.points = new Array(m));
        }
        function l(m, y) {
          (this.partialLength = m), (this.point = y);
        }
        var u = (function () {
          var m = {};
          return function (y, c, g, p) {
            var a = (
              y[0] +
              '_' +
              y[1] +
              '_' +
              c[0] +
              '_' +
              c[1] +
              '_' +
              g[0] +
              '_' +
              g[1] +
              '_' +
              p[0] +
              '_' +
              p[1]
            ).replace(/\./g, 'p');
            if (!m[a]) {
              var o = defaultCurveSegments,
                h,
                f,
                b,
                P,
                S,
                w = 0,
                M,
                I,
                C = null;
              y.length === 2 &&
                (y[0] !== c[0] || y[1] !== c[1]) &&
                t(y[0], y[1], c[0], c[1], y[0] + g[0], y[1] + g[1]) &&
                t(y[0], y[1], c[0], c[1], c[0] + p[0], c[1] + p[1]) &&
                (o = 2);
              var R = new n(o);
              for (b = g.length, h = 0; h < o; h += 1) {
                for (
                  I = createSizedArray(b), S = h / (o - 1), M = 0, f = 0;
                  f < b;
                  f += 1
                )
                  (P =
                    bmPow(1 - S, 3) * y[f] +
                    3 * bmPow(1 - S, 2) * S * (y[f] + g[f]) +
                    3 * (1 - S) * bmPow(S, 2) * (c[f] + p[f]) +
                    bmPow(S, 3) * c[f]),
                    (I[f] = P),
                    C !== null && (M += bmPow(I[f] - C[f], 2));
                (M = bmSqrt(M)), (w += M), (R.points[h] = new l(M, I)), (C = I);
              }
              (R.segmentLength = w), (m[a] = R);
            }
            return m[a];
          };
        })();
        function d(m, y) {
          var c = y.percents,
            g = y.lengths,
            p = c.length,
            a = bmFloor((p - 1) * m),
            o = m * y.addedLength,
            h = 0;
          if (a === p - 1 || a === 0 || o === g[a]) return c[a];
          for (var f = g[a] > o ? -1 : 1, b = !0; b; )
            if (
              (g[a] <= o && g[a + 1] > o
                ? ((h = (o - g[a]) / (g[a + 1] - g[a])), (b = !1))
                : (a += f),
              a < 0 || a >= p - 1)
            ) {
              if (a === p - 1) return c[a];
              b = !1;
            }
          return c[a] + (c[a + 1] - c[a]) * h;
        }
        function v(m, y, c, g, p, a) {
          var o = d(p, a),
            h = 1 - o,
            f =
              e.round(
                (h * h * h * m[0] +
                  (o * h * h + h * o * h + h * h * o) * c[0] +
                  (o * o * h + h * o * o + o * h * o) * g[0] +
                  o * o * o * y[0]) *
                  1e3
              ) / 1e3,
            b =
              e.round(
                (h * h * h * m[1] +
                  (o * h * h + h * o * h + h * h * o) * c[1] +
                  (o * o * h + h * o * o + o * h * o) * g[1] +
                  o * o * o * y[1]) *
                  1e3
              ) / 1e3;
          return [f, b];
        }
        var E = createTypedArray('float32', 8);
        function _(m, y, c, g, p, a, o) {
          p < 0 ? (p = 0) : p > 1 && (p = 1);
          var h = d(p, o);
          a = a > 1 ? 1 : a;
          var f = d(a, o),
            b,
            P = m.length,
            S = 1 - h,
            w = 1 - f,
            M = S * S * S,
            I = h * S * S * 3,
            C = h * h * S * 3,
            R = h * h * h,
            V = S * S * w,
            O = h * S * w + S * h * w + S * S * f,
            D = h * h * w + S * h * f + h * S * f,
            x = h * h * f,
            T = S * w * w,
            A = h * w * w + S * f * w + S * w * f,
            k = h * f * w + S * f * f + h * w * f,
            F = h * f * f,
            L = w * w * w,
            G = f * w * w + w * f * w + w * w * f,
            z = f * f * w + w * f * f + f * w * f,
            N = f * f * f;
          for (b = 0; b < P; b += 1)
            (E[b * 4] =
              e.round((M * m[b] + I * c[b] + C * g[b] + R * y[b]) * 1e3) / 1e3),
              (E[b * 4 + 1] =
                e.round((V * m[b] + O * c[b] + D * g[b] + x * y[b]) * 1e3) /
                1e3),
              (E[b * 4 + 2] =
                e.round((T * m[b] + A * c[b] + k * g[b] + F * y[b]) * 1e3) /
                1e3),
              (E[b * 4 + 3] =
                e.round((L * m[b] + G * c[b] + z * g[b] + N * y[b]) * 1e3) /
                1e3);
          return E;
        }
        return {
          getSegmentsLength: s,
          getNewSegment: _,
          getPointInSegment: v,
          buildBezierData: u,
          pointOnLine2D: t,
          pointOnLine3D: r,
        };
      }
      var bez = bezFunction();
      function dataFunctionManager() {
        function e(y, c, g) {
          var p,
            a,
            o = y.length,
            h,
            f,
            b,
            P;
          for (a = 0; a < o; a += 1)
            if (((p = y[a]), 'ks' in p && !p.completed)) {
              if (
                ((p.completed = !0), p.tt && (y[a - 1].td = p.tt), p.hasMask)
              ) {
                var S = p.masksProperties;
                for (f = S.length, h = 0; h < f; h += 1)
                  if (S[h].pt.k.i) i(S[h].pt.k);
                  else
                    for (P = S[h].pt.k.length, b = 0; b < P; b += 1)
                      S[h].pt.k[b].s && i(S[h].pt.k[b].s[0]),
                        S[h].pt.k[b].e && i(S[h].pt.k[b].e[0]);
              }
              p.ty === 0
                ? ((p.layers = t(p.refId, c)), e(p.layers, c))
                : p.ty === 4
                ? r(p.shapes)
                : p.ty === 5 && _(p);
            }
        }
        function t(y, c) {
          for (var g = 0, p = c.length; g < p; ) {
            if (c[g].id === y)
              return c[g].layers.__used
                ? JSON.parse(JSON.stringify(c[g].layers))
                : ((c[g].layers.__used = !0), c[g].layers);
            g += 1;
          }
          return null;
        }
        function r(y) {
          var c,
            g = y.length,
            p,
            a;
          for (c = g - 1; c >= 0; c -= 1)
            if (y[c].ty === 'sh')
              if (y[c].ks.k.i) i(y[c].ks.k);
              else
                for (a = y[c].ks.k.length, p = 0; p < a; p += 1)
                  y[c].ks.k[p].s && i(y[c].ks.k[p].s[0]),
                    y[c].ks.k[p].e && i(y[c].ks.k[p].e[0]);
            else y[c].ty === 'gr' && r(y[c].it);
        }
        function i(y) {
          var c,
            g = y.i.length;
          for (c = 0; c < g; c += 1)
            (y.i[c][0] += y.v[c][0]),
              (y.i[c][1] += y.v[c][1]),
              (y.o[c][0] += y.v[c][0]),
              (y.o[c][1] += y.v[c][1]);
        }
        function s(y, c) {
          var g = c ? c.split('.') : [100, 100, 100];
          return y[0] > g[0]
            ? !0
            : g[0] > y[0]
            ? !1
            : y[1] > g[1]
            ? !0
            : g[1] > y[1]
            ? !1
            : y[2] > g[2]
            ? !0
            : g[2] > y[2]
            ? !1
            : null;
        }
        var n = (function () {
            var y = [4, 4, 14];
            function c(p) {
              var a = p.t.d;
              p.t.d = { k: [{ s: a, t: 0 }] };
            }
            function g(p) {
              var a,
                o = p.length;
              for (a = 0; a < o; a += 1) p[a].ty === 5 && c(p[a]);
            }
            return function (p) {
              if (s(y, p.v) && (g(p.layers), p.assets)) {
                var a,
                  o = p.assets.length;
                for (a = 0; a < o; a += 1)
                  p.assets[a].layers && g(p.assets[a].layers);
              }
            };
          })(),
          l = (function () {
            var y = [4, 7, 99];
            return function (c) {
              if (c.chars && !s(y, c.v)) {
                var g,
                  p = c.chars.length,
                  a,
                  o,
                  h,
                  f;
                for (g = 0; g < p; g += 1)
                  if (c.chars[g].data && c.chars[g].data.shapes)
                    for (
                      f = c.chars[g].data.shapes[0].it, o = f.length, a = 0;
                      a < o;
                      a += 1
                    )
                      (h = f[a].ks.k),
                        h.__converted || (i(f[a].ks.k), (h.__converted = !0));
              }
            };
          })(),
          u = (function () {
            var y = [5, 7, 15];
            function c(p) {
              var a = p.t.p;
              typeof a.a == 'number' && (a.a = { a: 0, k: a.a }),
                typeof a.p == 'number' && (a.p = { a: 0, k: a.p }),
                typeof a.r == 'number' && (a.r = { a: 0, k: a.r });
            }
            function g(p) {
              var a,
                o = p.length;
              for (a = 0; a < o; a += 1) p[a].ty === 5 && c(p[a]);
            }
            return function (p) {
              if (s(y, p.v) && (g(p.layers), p.assets)) {
                var a,
                  o = p.assets.length;
                for (a = 0; a < o; a += 1)
                  p.assets[a].layers && g(p.assets[a].layers);
              }
            };
          })(),
          d = (function () {
            var y = [4, 1, 9];
            function c(p) {
              var a,
                o = p.length,
                h,
                f;
              for (a = 0; a < o; a += 1)
                if (p[a].ty === 'gr') c(p[a].it);
                else if (p[a].ty === 'fl' || p[a].ty === 'st')
                  if (p[a].c.k && p[a].c.k[0].i)
                    for (f = p[a].c.k.length, h = 0; h < f; h += 1)
                      p[a].c.k[h].s &&
                        ((p[a].c.k[h].s[0] /= 255),
                        (p[a].c.k[h].s[1] /= 255),
                        (p[a].c.k[h].s[2] /= 255),
                        (p[a].c.k[h].s[3] /= 255)),
                        p[a].c.k[h].e &&
                          ((p[a].c.k[h].e[0] /= 255),
                          (p[a].c.k[h].e[1] /= 255),
                          (p[a].c.k[h].e[2] /= 255),
                          (p[a].c.k[h].e[3] /= 255));
                  else
                    (p[a].c.k[0] /= 255),
                      (p[a].c.k[1] /= 255),
                      (p[a].c.k[2] /= 255),
                      (p[a].c.k[3] /= 255);
            }
            function g(p) {
              var a,
                o = p.length;
              for (a = 0; a < o; a += 1) p[a].ty === 4 && c(p[a].shapes);
            }
            return function (p) {
              if (s(y, p.v) && (g(p.layers), p.assets)) {
                var a,
                  o = p.assets.length;
                for (a = 0; a < o; a += 1)
                  p.assets[a].layers && g(p.assets[a].layers);
              }
            };
          })(),
          v = (function () {
            var y = [4, 4, 18];
            function c(p) {
              var a,
                o = p.length,
                h,
                f;
              for (a = o - 1; a >= 0; a -= 1)
                if (p[a].ty === 'sh')
                  if (p[a].ks.k.i) p[a].ks.k.c = p[a].closed;
                  else
                    for (f = p[a].ks.k.length, h = 0; h < f; h += 1)
                      p[a].ks.k[h].s && (p[a].ks.k[h].s[0].c = p[a].closed),
                        p[a].ks.k[h].e && (p[a].ks.k[h].e[0].c = p[a].closed);
                else p[a].ty === 'gr' && c(p[a].it);
            }
            function g(p) {
              var a,
                o,
                h = p.length,
                f,
                b,
                P,
                S;
              for (o = 0; o < h; o += 1) {
                if (((a = p[o]), a.hasMask)) {
                  var w = a.masksProperties;
                  for (b = w.length, f = 0; f < b; f += 1)
                    if (w[f].pt.k.i) w[f].pt.k.c = w[f].cl;
                    else
                      for (S = w[f].pt.k.length, P = 0; P < S; P += 1)
                        w[f].pt.k[P].s && (w[f].pt.k[P].s[0].c = w[f].cl),
                          w[f].pt.k[P].e && (w[f].pt.k[P].e[0].c = w[f].cl);
                }
                a.ty === 4 && c(a.shapes);
              }
            }
            return function (p) {
              if (s(y, p.v) && (g(p.layers), p.assets)) {
                var a,
                  o = p.assets.length;
                for (a = 0; a < o; a += 1)
                  p.assets[a].layers && g(p.assets[a].layers);
              }
            };
          })();
        function E(y, c) {
          y.__complete ||
            (d(y),
            n(y),
            l(y),
            u(y),
            v(y),
            e(y.layers, y.assets),
            (y.__complete = !0));
        }
        function _(y) {
          y.t.a.length === 0 && !('m' in y.t.p) && (y.singleShape = !0);
        }
        var m = {};
        return (
          (m.completeData = E),
          (m.checkColors = d),
          (m.checkChars = l),
          (m.checkPathProperties = u),
          (m.checkShapes = v),
          (m.completeLayers = e),
          m
        );
      }
      var dataManager = dataFunctionManager();
      function getFontProperties(e) {
        for (
          var t = e.fStyle ? e.fStyle.split(' ') : [],
            r = 'normal',
            i = 'normal',
            s = t.length,
            n,
            l = 0;
          l < s;
          l += 1
        )
          switch (((n = t[l].toLowerCase()), n)) {
            case 'italic':
              i = 'italic';
              break;
            case 'bold':
              r = '700';
              break;
            case 'black':
              r = '900';
              break;
            case 'medium':
              r = '500';
              break;
            case 'regular':
            case 'normal':
              r = '400';
              break;
            case 'light':
            case 'thin':
              r = '200';
              break;
          }
        return { style: i, weight: e.fWeight || r };
      }
      var FontManager = (function () {
          var e = 5e3,
            t = { w: 0, size: 0, shapes: [] },
            r = [];
          r = r.concat([
            2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368,
            2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379,
            2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
          ]);
          var i = ['d83cdffb', 'd83cdffc', 'd83cdffd', 'd83cdffe', 'd83cdfff'],
            s = [65039, 8205];
          function n(f) {
            var b = f.split(','),
              P,
              S = b.length,
              w = [];
            for (P = 0; P < S; P += 1)
              b[P] !== 'sans-serif' && b[P] !== 'monospace' && w.push(b[P]);
            return w.join(',');
          }
          function l(f, b) {
            var P = createTag('span');
            P.setAttribute('aria-hidden', !0), (P.style.fontFamily = b);
            var S = createTag('span');
            (S.innerText = 'giItT1WQy@!-/#'),
              (P.style.position = 'absolute'),
              (P.style.left = '-10000px'),
              (P.style.top = '-10000px'),
              (P.style.fontSize = '300px'),
              (P.style.fontVariant = 'normal'),
              (P.style.fontStyle = 'normal'),
              (P.style.fontWeight = 'normal'),
              (P.style.letterSpacing = '0'),
              P.appendChild(S),
              document.body.appendChild(P);
            var w = S.offsetWidth;
            return (
              (S.style.fontFamily = n(f) + ', ' + b), { node: S, w, parent: P }
            );
          }
          function u() {
            var f,
              b = this.fonts.length,
              P,
              S,
              w = b;
            for (f = 0; f < b; f += 1)
              this.fonts[f].loaded
                ? (w -= 1)
                : this.fonts[f].fOrigin === 'n' || this.fonts[f].origin === 0
                ? (this.fonts[f].loaded = !0)
                : ((P = this.fonts[f].monoCase.node),
                  (S = this.fonts[f].monoCase.w),
                  P.offsetWidth !== S
                    ? ((w -= 1), (this.fonts[f].loaded = !0))
                    : ((P = this.fonts[f].sansCase.node),
                      (S = this.fonts[f].sansCase.w),
                      P.offsetWidth !== S &&
                        ((w -= 1), (this.fonts[f].loaded = !0))),
                  this.fonts[f].loaded &&
                    (this.fonts[f].sansCase.parent.parentNode.removeChild(
                      this.fonts[f].sansCase.parent
                    ),
                    this.fonts[f].monoCase.parent.parentNode.removeChild(
                      this.fonts[f].monoCase.parent
                    )));
            w !== 0 && Date.now() - this.initTime < e
              ? setTimeout(this.checkLoadedFontsBinded, 20)
              : setTimeout(this.setIsLoadedBinded, 10);
          }
          function d(f, b) {
            var P = createNS('text');
            P.style.fontSize = '100px';
            var S = getFontProperties(b);
            P.setAttribute('font-family', b.fFamily),
              P.setAttribute('font-style', S.style),
              P.setAttribute('font-weight', S.weight),
              (P.textContent = '1'),
              b.fClass
                ? ((P.style.fontFamily = 'inherit'),
                  P.setAttribute('class', b.fClass))
                : (P.style.fontFamily = b.fFamily),
              f.appendChild(P);
            var w = createTag('canvas').getContext('2d');
            return (
              (w.font = b.fWeight + ' ' + b.fStyle + ' 100px ' + b.fFamily), P
            );
          }
          function v(f, b) {
            if (!f) {
              this.isLoaded = !0;
              return;
            }
            if (this.chars) {
              (this.isLoaded = !0), (this.fonts = f.list);
              return;
            }
            var P = f.list,
              S,
              w = P.length,
              M = w;
            for (S = 0; S < w; S += 1) {
              var I = !0,
                C,
                R;
              if (
                ((P[S].loaded = !1),
                (P[S].monoCase = l(P[S].fFamily, 'monospace')),
                (P[S].sansCase = l(P[S].fFamily, 'sans-serif')),
                !P[S].fPath)
              )
                (P[S].loaded = !0), (M -= 1);
              else if (P[S].fOrigin === 'p' || P[S].origin === 3) {
                if (
                  ((C = document.querySelectorAll(
                    'style[f-forigin="p"][f-family="' +
                      P[S].fFamily +
                      '"], style[f-origin="3"][f-family="' +
                      P[S].fFamily +
                      '"]'
                  )),
                  C.length > 0 && (I = !1),
                  I)
                ) {
                  var V = createTag('style');
                  V.setAttribute('f-forigin', P[S].fOrigin),
                    V.setAttribute('f-origin', P[S].origin),
                    V.setAttribute('f-family', P[S].fFamily),
                    (V.type = 'text/css'),
                    (V.innerText =
                      '@font-face {font-family: ' +
                      P[S].fFamily +
                      "; font-style: normal; src: url('" +
                      P[S].fPath +
                      "');}"),
                    b.appendChild(V);
                }
              } else if (P[S].fOrigin === 'g' || P[S].origin === 1) {
                for (
                  C = document.querySelectorAll(
                    'link[f-forigin="g"], link[f-origin="1"]'
                  ),
                    R = 0;
                  R < C.length;
                  R += 1
                )
                  C[R].href.indexOf(P[S].fPath) !== -1 && (I = !1);
                if (I) {
                  var O = createTag('link');
                  O.setAttribute('f-forigin', P[S].fOrigin),
                    O.setAttribute('f-origin', P[S].origin),
                    (O.type = 'text/css'),
                    (O.rel = 'stylesheet'),
                    (O.href = P[S].fPath),
                    document.body.appendChild(O);
                }
              } else if (P[S].fOrigin === 't' || P[S].origin === 2) {
                for (
                  C = document.querySelectorAll(
                    'script[f-forigin="t"], script[f-origin="2"]'
                  ),
                    R = 0;
                  R < C.length;
                  R += 1
                )
                  P[S].fPath === C[R].src && (I = !1);
                if (I) {
                  var D = createTag('link');
                  D.setAttribute('f-forigin', P[S].fOrigin),
                    D.setAttribute('f-origin', P[S].origin),
                    D.setAttribute('rel', 'stylesheet'),
                    D.setAttribute('href', P[S].fPath),
                    b.appendChild(D);
                }
              }
              (P[S].helper = d(b, P[S])),
                (P[S].cache = {}),
                this.fonts.push(P[S]);
            }
            M === 0
              ? (this.isLoaded = !0)
              : setTimeout(this.checkLoadedFonts.bind(this), 100);
          }
          function E(f) {
            if (!!f) {
              this.chars || (this.chars = []);
              var b,
                P = f.length,
                S,
                w = this.chars.length,
                M;
              for (b = 0; b < P; b += 1) {
                for (S = 0, M = !1; S < w; )
                  this.chars[S].style === f[b].style &&
                    this.chars[S].fFamily === f[b].fFamily &&
                    this.chars[S].ch === f[b].ch &&
                    (M = !0),
                    (S += 1);
                M || (this.chars.push(f[b]), (w += 1));
              }
            }
          }
          function _(f, b, P) {
            for (var S = 0, w = this.chars.length; S < w; ) {
              if (
                this.chars[S].ch === f &&
                this.chars[S].style === b &&
                this.chars[S].fFamily === P
              )
                return this.chars[S];
              S += 1;
            }
            return (
              ((typeof f == 'string' && f.charCodeAt(0) !== 13) || !f) &&
                console &&
                console.warn &&
                !this._warned &&
                ((this._warned = !0),
                console.warn(
                  'Missing character from exported characters list: ',
                  f,
                  b,
                  P
                )),
              t
            );
          }
          function m(f, b, P) {
            var S = this.getFontByName(b),
              w = f.charCodeAt(0);
            if (!S.cache[w + 1]) {
              var M = S.helper;
              if (f === ' ') {
                M.textContent = '|' + f + '|';
                var I = M.getComputedTextLength();
                M.textContent = '||';
                var C = M.getComputedTextLength();
                S.cache[w + 1] = (I - C) / 100;
              } else
                (M.textContent = f),
                  (S.cache[w + 1] = M.getComputedTextLength() / 100);
            }
            return S.cache[w + 1] * P;
          }
          function y(f) {
            for (var b = 0, P = this.fonts.length; b < P; ) {
              if (this.fonts[b].fName === f) return this.fonts[b];
              b += 1;
            }
            return this.fonts[0];
          }
          function c(f, b) {
            var P = f.toString(16) + b.toString(16);
            return i.indexOf(P) !== -1;
          }
          function g(f, b) {
            return b ? f === s[0] && b === s[1] : f === s[1];
          }
          function p(f) {
            return r.indexOf(f) !== -1;
          }
          function a() {
            this.isLoaded = !0;
          }
          var o = function () {
            (this.fonts = []),
              (this.chars = null),
              (this.typekitLoaded = 0),
              (this.isLoaded = !1),
              (this._warned = !1),
              (this.initTime = Date.now()),
              (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
              (this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this));
          };
          (o.isModifier = c),
            (o.isZeroWidthJoiner = g),
            (o.isCombinedCharacter = p);
          var h = {
            addChars: E,
            addFonts: v,
            getCharData: _,
            getFontByName: y,
            measureText: m,
            checkLoadedFonts: u,
            setIsLoaded: a,
          };
          return (o.prototype = h), o;
        })(),
        PropertyFactory = (function () {
          var e = initialDefaultFrame,
            t = Math.abs;
          function r(p, a) {
            var o = this.offsetTime,
              h;
            this.propType === 'multidimensional' &&
              (h = createTypedArray('float32', this.pv.length));
            for (
              var f = a.lastIndex,
                b = f,
                P = this.keyframes.length - 1,
                S = !0,
                w,
                M;
              S;

            ) {
              if (
                ((w = this.keyframes[b]),
                (M = this.keyframes[b + 1]),
                b === P - 1 && p >= M.t - o)
              ) {
                w.h && (w = M), (f = 0);
                break;
              }
              if (M.t - o > p) {
                f = b;
                break;
              }
              b < P - 1 ? (b += 1) : ((f = 0), (S = !1));
            }
            var I,
              C,
              R,
              V,
              O,
              D,
              x = M.t - o,
              T = w.t - o,
              A;
            if (w.to) {
              w.bezierData ||
                (w.bezierData = bez.buildBezierData(
                  w.s,
                  M.s || w.e,
                  w.to,
                  w.ti
                ));
              var k = w.bezierData;
              if (p >= x || p < T) {
                var F = p >= x ? k.points.length - 1 : 0;
                for (C = k.points[F].point.length, I = 0; I < C; I += 1)
                  h[I] = k.points[F].point[I];
              } else {
                w.__fnct
                  ? (D = w.__fnct)
                  : ((D = BezierFactory.getBezierEasing(
                      w.o.x,
                      w.o.y,
                      w.i.x,
                      w.i.y,
                      w.n
                    ).get),
                    (w.__fnct = D)),
                  (R = D((p - T) / (x - T)));
                var L = k.segmentLength * R,
                  G,
                  z =
                    a.lastFrame < p && a._lastKeyframeIndex === b
                      ? a._lastAddedLength
                      : 0;
                for (
                  O =
                    a.lastFrame < p && a._lastKeyframeIndex === b
                      ? a._lastPoint
                      : 0,
                    S = !0,
                    V = k.points.length;
                  S;

                ) {
                  if (
                    ((z += k.points[O].partialLength),
                    L === 0 || R === 0 || O === k.points.length - 1)
                  ) {
                    for (C = k.points[O].point.length, I = 0; I < C; I += 1)
                      h[I] = k.points[O].point[I];
                    break;
                  } else if (L >= z && L < z + k.points[O + 1].partialLength) {
                    for (
                      G = (L - z) / k.points[O + 1].partialLength,
                        C = k.points[O].point.length,
                        I = 0;
                      I < C;
                      I += 1
                    )
                      h[I] =
                        k.points[O].point[I] +
                        (k.points[O + 1].point[I] - k.points[O].point[I]) * G;
                    break;
                  }
                  O < V - 1 ? (O += 1) : (S = !1);
                }
                (a._lastPoint = O),
                  (a._lastAddedLength = z - k.points[O].partialLength),
                  (a._lastKeyframeIndex = b);
              }
            } else {
              var N, H, j, W, K;
              if (((P = w.s.length), (A = M.s || w.e), this.sh && w.h !== 1))
                if (p >= x) (h[0] = A[0]), (h[1] = A[1]), (h[2] = A[2]);
                else if (p <= T)
                  (h[0] = w.s[0]), (h[1] = w.s[1]), (h[2] = w.s[2]);
                else {
                  var Z = n(w.s),
                    U = n(A),
                    q = (p - T) / (x - T);
                  s(h, i(Z, U, q));
                }
              else
                for (b = 0; b < P; b += 1)
                  w.h !== 1 &&
                    (p >= x
                      ? (R = 1)
                      : p < T
                      ? (R = 0)
                      : (w.o.x.constructor === Array
                          ? (w.__fnct || (w.__fnct = []),
                            w.__fnct[b]
                              ? (D = w.__fnct[b])
                              : ((N =
                                  typeof w.o.x[b] == 'undefined'
                                    ? w.o.x[0]
                                    : w.o.x[b]),
                                (H =
                                  typeof w.o.y[b] == 'undefined'
                                    ? w.o.y[0]
                                    : w.o.y[b]),
                                (j =
                                  typeof w.i.x[b] == 'undefined'
                                    ? w.i.x[0]
                                    : w.i.x[b]),
                                (W =
                                  typeof w.i.y[b] == 'undefined'
                                    ? w.i.y[0]
                                    : w.i.y[b]),
                                (D = BezierFactory.getBezierEasing(
                                  N,
                                  H,
                                  j,
                                  W
                                ).get),
                                (w.__fnct[b] = D)))
                          : w.__fnct
                          ? (D = w.__fnct)
                          : ((N = w.o.x),
                            (H = w.o.y),
                            (j = w.i.x),
                            (W = w.i.y),
                            (D = BezierFactory.getBezierEasing(N, H, j, W).get),
                            (w.__fnct = D)),
                        (R = D((p - T) / (x - T))))),
                    (A = M.s || w.e),
                    (K = w.h === 1 ? w.s[b] : w.s[b] + (A[b] - w.s[b]) * R),
                    this.propType === 'multidimensional' ? (h[b] = K) : (h = K);
            }
            return (a.lastIndex = f), h;
          }
          function i(p, a, o) {
            var h = [],
              f = p[0],
              b = p[1],
              P = p[2],
              S = p[3],
              w = a[0],
              M = a[1],
              I = a[2],
              C = a[3],
              R,
              V,
              O,
              D,
              x;
            return (
              (V = f * w + b * M + P * I + S * C),
              V < 0 && ((V = -V), (w = -w), (M = -M), (I = -I), (C = -C)),
              1 - V > 1e-6
                ? ((R = Math.acos(V)),
                  (O = Math.sin(R)),
                  (D = Math.sin((1 - o) * R) / O),
                  (x = Math.sin(o * R) / O))
                : ((D = 1 - o), (x = o)),
              (h[0] = D * f + x * w),
              (h[1] = D * b + x * M),
              (h[2] = D * P + x * I),
              (h[3] = D * S + x * C),
              h
            );
          }
          function s(p, a) {
            var o = a[0],
              h = a[1],
              f = a[2],
              b = a[3],
              P = Math.atan2(2 * h * b - 2 * o * f, 1 - 2 * h * h - 2 * f * f),
              S = Math.asin(2 * o * h + 2 * f * b),
              w = Math.atan2(2 * o * b - 2 * h * f, 1 - 2 * o * o - 2 * f * f);
            (p[0] = P / degToRads),
              (p[1] = S / degToRads),
              (p[2] = w / degToRads);
          }
          function n(p) {
            var a = p[0] * degToRads,
              o = p[1] * degToRads,
              h = p[2] * degToRads,
              f = Math.cos(a / 2),
              b = Math.cos(o / 2),
              P = Math.cos(h / 2),
              S = Math.sin(a / 2),
              w = Math.sin(o / 2),
              M = Math.sin(h / 2),
              I = f * b * P - S * w * M,
              C = S * w * P + f * b * M,
              R = S * b * P + f * w * M,
              V = f * w * P - S * b * M;
            return [C, R, V, I];
          }
          function l() {
            var p = this.comp.renderedFrame - this.offsetTime,
              a = this.keyframes[0].t - this.offsetTime,
              o = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
            if (
              !(
                p === this._caching.lastFrame ||
                (this._caching.lastFrame !== e &&
                  ((this._caching.lastFrame >= o && p >= o) ||
                    (this._caching.lastFrame < a && p < a)))
              )
            ) {
              this._caching.lastFrame >= p &&
                ((this._caching._lastKeyframeIndex = -1),
                (this._caching.lastIndex = 0));
              var h = this.interpolateValue(p, this._caching);
              this.pv = h;
            }
            return (this._caching.lastFrame = p), this.pv;
          }
          function u(p) {
            var a;
            if (this.propType === 'unidimensional')
              (a = p * this.mult),
                t(this.v - a) > 1e-5 && ((this.v = a), (this._mdf = !0));
            else
              for (var o = 0, h = this.v.length; o < h; )
                (a = p[o] * this.mult),
                  t(this.v[o] - a) > 1e-5 &&
                    ((this.v[o] = a), (this._mdf = !0)),
                  (o += 1);
          }
          function d() {
            if (
              !(
                this.elem.globalData.frameId === this.frameId ||
                !this.effectsSequence.length
              )
            ) {
              if (this.lock) {
                this.setVValue(this.pv);
                return;
              }
              (this.lock = !0), (this._mdf = this._isFirstFrame);
              var p,
                a = this.effectsSequence.length,
                o = this.kf ? this.pv : this.data.k;
              for (p = 0; p < a; p += 1) o = this.effectsSequence[p](o);
              this.setVValue(o),
                (this._isFirstFrame = !1),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId);
            }
          }
          function v(p) {
            this.effectsSequence.push(p),
              this.container.addDynamicProperty(this);
          }
          function E(p, a, o, h) {
            (this.propType = 'unidimensional'),
              (this.mult = o || 1),
              (this.data = a),
              (this.v = o ? a.k * o : a.k),
              (this.pv = a.k),
              (this._mdf = !1),
              (this.elem = p),
              (this.container = h),
              (this.comp = p.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.vel = 0),
              (this.effectsSequence = []),
              (this._isFirstFrame = !0),
              (this.getValue = d),
              (this.setVValue = u),
              (this.addEffect = v);
          }
          function _(p, a, o, h) {
            (this.propType = 'multidimensional'),
              (this.mult = o || 1),
              (this.data = a),
              (this._mdf = !1),
              (this.elem = p),
              (this.container = h),
              (this.comp = p.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.frameId = -1);
            var f,
              b = a.k.length;
            for (
              this.v = createTypedArray('float32', b),
                this.pv = createTypedArray('float32', b),
                this.vel = createTypedArray('float32', b),
                f = 0;
              f < b;
              f += 1
            )
              (this.v[f] = a.k[f] * this.mult), (this.pv[f] = a.k[f]);
            (this._isFirstFrame = !0),
              (this.effectsSequence = []),
              (this.getValue = d),
              (this.setVValue = u),
              (this.addEffect = v);
          }
          function m(p, a, o, h) {
            (this.propType = 'unidimensional'),
              (this.keyframes = a.k),
              (this.offsetTime = p.data.st),
              (this.frameId = -1),
              (this._caching = {
                lastFrame: e,
                lastIndex: 0,
                value: 0,
                _lastKeyframeIndex: -1,
              }),
              (this.k = !0),
              (this.kf = !0),
              (this.data = a),
              (this.mult = o || 1),
              (this.elem = p),
              (this.container = h),
              (this.comp = p.comp),
              (this.v = e),
              (this.pv = e),
              (this._isFirstFrame = !0),
              (this.getValue = d),
              (this.setVValue = u),
              (this.interpolateValue = r),
              (this.effectsSequence = [l.bind(this)]),
              (this.addEffect = v);
          }
          function y(p, a, o, h) {
            this.propType = 'multidimensional';
            var f,
              b = a.k.length,
              P,
              S,
              w,
              M;
            for (f = 0; f < b - 1; f += 1)
              a.k[f].to &&
                a.k[f].s &&
                a.k[f + 1] &&
                a.k[f + 1].s &&
                ((P = a.k[f].s),
                (S = a.k[f + 1].s),
                (w = a.k[f].to),
                (M = a.k[f].ti),
                ((P.length === 2 &&
                  !(P[0] === S[0] && P[1] === S[1]) &&
                  bez.pointOnLine2D(
                    P[0],
                    P[1],
                    S[0],
                    S[1],
                    P[0] + w[0],
                    P[1] + w[1]
                  ) &&
                  bez.pointOnLine2D(
                    P[0],
                    P[1],
                    S[0],
                    S[1],
                    S[0] + M[0],
                    S[1] + M[1]
                  )) ||
                  (P.length === 3 &&
                    !(P[0] === S[0] && P[1] === S[1] && P[2] === S[2]) &&
                    bez.pointOnLine3D(
                      P[0],
                      P[1],
                      P[2],
                      S[0],
                      S[1],
                      S[2],
                      P[0] + w[0],
                      P[1] + w[1],
                      P[2] + w[2]
                    ) &&
                    bez.pointOnLine3D(
                      P[0],
                      P[1],
                      P[2],
                      S[0],
                      S[1],
                      S[2],
                      S[0] + M[0],
                      S[1] + M[1],
                      S[2] + M[2]
                    ))) &&
                  ((a.k[f].to = null), (a.k[f].ti = null)),
                P[0] === S[0] &&
                  P[1] === S[1] &&
                  w[0] === 0 &&
                  w[1] === 0 &&
                  M[0] === 0 &&
                  M[1] === 0 &&
                  (P.length === 2 ||
                    (P[2] === S[2] && w[2] === 0 && M[2] === 0)) &&
                  ((a.k[f].to = null), (a.k[f].ti = null)));
            (this.effectsSequence = [l.bind(this)]),
              (this.data = a),
              (this.keyframes = a.k),
              (this.offsetTime = p.data.st),
              (this.k = !0),
              (this.kf = !0),
              (this._isFirstFrame = !0),
              (this.mult = o || 1),
              (this.elem = p),
              (this.container = h),
              (this.comp = p.comp),
              (this.getValue = d),
              (this.setVValue = u),
              (this.interpolateValue = r),
              (this.frameId = -1);
            var I = a.k[0].s.length;
            for (
              this.v = createTypedArray('float32', I),
                this.pv = createTypedArray('float32', I),
                f = 0;
              f < I;
              f += 1
            )
              (this.v[f] = e), (this.pv[f] = e);
            (this._caching = {
              lastFrame: e,
              lastIndex: 0,
              value: createTypedArray('float32', I),
            }),
              (this.addEffect = v);
          }
          function c(p, a, o, h, f) {
            var b;
            if (!a.k.length) b = new E(p, a, h, f);
            else if (typeof a.k[0] == 'number') b = new _(p, a, h, f);
            else
              switch (o) {
                case 0:
                  b = new m(p, a, h, f);
                  break;
                case 1:
                  b = new y(p, a, h, f);
                  break;
              }
            return b.effectsSequence.length && f.addDynamicProperty(b), b;
          }
          var g = { getProp: c };
          return g;
        })(),
        TransformPropertyFactory = (function () {
          var e = [0, 0];
          function t(d) {
            var v = this._mdf;
            this.iterateDynamicProperties(),
              (this._mdf = this._mdf || v),
              this.a && d.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
              this.s && d.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
              this.sk && d.skewFromAxis(-this.sk.v, this.sa.v),
              this.r
                ? d.rotate(-this.r.v)
                : d
                    .rotateZ(-this.rz.v)
                    .rotateY(this.ry.v)
                    .rotateX(this.rx.v)
                    .rotateZ(-this.or.v[2])
                    .rotateY(this.or.v[1])
                    .rotateX(this.or.v[0]),
              this.data.p.s
                ? this.data.p.z
                  ? d.translate(this.px.v, this.py.v, -this.pz.v)
                  : d.translate(this.px.v, this.py.v, 0)
                : d.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
          }
          function r(d) {
            if (this.elem.globalData.frameId !== this.frameId) {
              if (
                (this._isDirty &&
                  (this.precalculateMatrix(), (this._isDirty = !1)),
                this.iterateDynamicProperties(),
                this._mdf || d)
              ) {
                var v;
                if (
                  (this.v.cloneFromProps(this.pre.props),
                  this.appliedTransformations < 1 &&
                    this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                  this.appliedTransformations < 2 &&
                    this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                  this.sk &&
                    this.appliedTransformations < 3 &&
                    this.v.skewFromAxis(-this.sk.v, this.sa.v),
                  this.r && this.appliedTransformations < 4
                    ? this.v.rotate(-this.r.v)
                    : !this.r &&
                      this.appliedTransformations < 4 &&
                      this.v
                        .rotateZ(-this.rz.v)
                        .rotateY(this.ry.v)
                        .rotateX(this.rx.v)
                        .rotateZ(-this.or.v[2])
                        .rotateY(this.or.v[1])
                        .rotateX(this.or.v[0]),
                  this.autoOriented)
                ) {
                  var E, _;
                  if (
                    ((v = this.elem.globalData.frameRate),
                    this.p && this.p.keyframes && this.p.getValueAtTime)
                  )
                    this.p._caching.lastFrame + this.p.offsetTime <=
                    this.p.keyframes[0].t
                      ? ((E = this.p.getValueAtTime(
                          (this.p.keyframes[0].t + 0.01) / v,
                          0
                        )),
                        (_ = this.p.getValueAtTime(
                          this.p.keyframes[0].t / v,
                          0
                        )))
                      : this.p._caching.lastFrame + this.p.offsetTime >=
                        this.p.keyframes[this.p.keyframes.length - 1].t
                      ? ((E = this.p.getValueAtTime(
                          this.p.keyframes[this.p.keyframes.length - 1].t / v,
                          0
                        )),
                        (_ = this.p.getValueAtTime(
                          (this.p.keyframes[this.p.keyframes.length - 1].t -
                            0.05) /
                            v,
                          0
                        )))
                      : ((E = this.p.pv),
                        (_ = this.p.getValueAtTime(
                          (this.p._caching.lastFrame +
                            this.p.offsetTime -
                            0.01) /
                            v,
                          this.p.offsetTime
                        )));
                  else if (
                    this.px &&
                    this.px.keyframes &&
                    this.py.keyframes &&
                    this.px.getValueAtTime &&
                    this.py.getValueAtTime
                  ) {
                    (E = []), (_ = []);
                    var m = this.px,
                      y = this.py;
                    m._caching.lastFrame + m.offsetTime <= m.keyframes[0].t
                      ? ((E[0] = m.getValueAtTime(
                          (m.keyframes[0].t + 0.01) / v,
                          0
                        )),
                        (E[1] = y.getValueAtTime(
                          (y.keyframes[0].t + 0.01) / v,
                          0
                        )),
                        (_[0] = m.getValueAtTime(m.keyframes[0].t / v, 0)),
                        (_[1] = y.getValueAtTime(y.keyframes[0].t / v, 0)))
                      : m._caching.lastFrame + m.offsetTime >=
                        m.keyframes[m.keyframes.length - 1].t
                      ? ((E[0] = m.getValueAtTime(
                          m.keyframes[m.keyframes.length - 1].t / v,
                          0
                        )),
                        (E[1] = y.getValueAtTime(
                          y.keyframes[y.keyframes.length - 1].t / v,
                          0
                        )),
                        (_[0] = m.getValueAtTime(
                          (m.keyframes[m.keyframes.length - 1].t - 0.01) / v,
                          0
                        )),
                        (_[1] = y.getValueAtTime(
                          (y.keyframes[y.keyframes.length - 1].t - 0.01) / v,
                          0
                        )))
                      : ((E = [m.pv, y.pv]),
                        (_[0] = m.getValueAtTime(
                          (m._caching.lastFrame + m.offsetTime - 0.01) / v,
                          m.offsetTime
                        )),
                        (_[1] = y.getValueAtTime(
                          (y._caching.lastFrame + y.offsetTime - 0.01) / v,
                          y.offsetTime
                        )));
                  } else (_ = e), (E = _);
                  this.v.rotate(-Math.atan2(E[1] - _[1], E[0] - _[0]));
                }
                this.data.p && this.data.p.s
                  ? this.data.p.z
                    ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                    : this.v.translate(this.px.v, this.py.v, 0)
                  : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
              }
              this.frameId = this.elem.globalData.frameId;
            }
          }
          function i() {
            if (!this.a.k)
              this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                (this.appliedTransformations = 1);
            else return;
            if (!this.s.effectsSequence.length)
              this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                (this.appliedTransformations = 2);
            else return;
            if (this.sk)
              if (
                !this.sk.effectsSequence.length &&
                !this.sa.effectsSequence.length
              )
                this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                  (this.appliedTransformations = 3);
              else return;
            this.r
              ? this.r.effectsSequence.length ||
                (this.pre.rotate(-this.r.v), (this.appliedTransformations = 4))
              : !this.rz.effectsSequence.length &&
                !this.ry.effectsSequence.length &&
                !this.rx.effectsSequence.length &&
                !this.or.effectsSequence.length &&
                (this.pre
                  .rotateZ(-this.rz.v)
                  .rotateY(this.ry.v)
                  .rotateX(this.rx.v)
                  .rotateZ(-this.or.v[2])
                  .rotateY(this.or.v[1])
                  .rotateX(this.or.v[0]),
                (this.appliedTransformations = 4));
          }
          function s() {}
          function n(d) {
            this._addDynamicProperty(d),
              this.elem.addDynamicProperty(d),
              (this._isDirty = !0);
          }
          function l(d, v, E) {
            if (
              ((this.elem = d),
              (this.frameId = -1),
              (this.propType = 'transform'),
              (this.data = v),
              (this.v = new Matrix()),
              (this.pre = new Matrix()),
              (this.appliedTransformations = 0),
              this.initDynamicPropertyContainer(E || d),
              v.p && v.p.s
                ? ((this.px = PropertyFactory.getProp(d, v.p.x, 0, 0, this)),
                  (this.py = PropertyFactory.getProp(d, v.p.y, 0, 0, this)),
                  v.p.z &&
                    (this.pz = PropertyFactory.getProp(d, v.p.z, 0, 0, this)))
                : (this.p = PropertyFactory.getProp(
                    d,
                    v.p || { k: [0, 0, 0] },
                    1,
                    0,
                    this
                  )),
              v.rx)
            ) {
              if (
                ((this.rx = PropertyFactory.getProp(
                  d,
                  v.rx,
                  0,
                  degToRads,
                  this
                )),
                (this.ry = PropertyFactory.getProp(
                  d,
                  v.ry,
                  0,
                  degToRads,
                  this
                )),
                (this.rz = PropertyFactory.getProp(
                  d,
                  v.rz,
                  0,
                  degToRads,
                  this
                )),
                v.or.k[0].ti)
              ) {
                var _,
                  m = v.or.k.length;
                for (_ = 0; _ < m; _ += 1)
                  (v.or.k[_].to = null), (v.or.k[_].ti = null);
              }
              (this.or = PropertyFactory.getProp(d, v.or, 1, degToRads, this)),
                (this.or.sh = !0);
            } else
              this.r = PropertyFactory.getProp(
                d,
                v.r || { k: 0 },
                0,
                degToRads,
                this
              );
            v.sk &&
              ((this.sk = PropertyFactory.getProp(d, v.sk, 0, degToRads, this)),
              (this.sa = PropertyFactory.getProp(d, v.sa, 0, degToRads, this))),
              (this.a = PropertyFactory.getProp(
                d,
                v.a || { k: [0, 0, 0] },
                1,
                0,
                this
              )),
              (this.s = PropertyFactory.getProp(
                d,
                v.s || { k: [100, 100, 100] },
                1,
                0.01,
                this
              )),
              v.o
                ? (this.o = PropertyFactory.getProp(d, v.o, 0, 0.01, d))
                : (this.o = { _mdf: !1, v: 1 }),
              (this._isDirty = !0),
              this.dynamicProperties.length || this.getValue(!0);
          }
          (l.prototype = {
            applyToMatrix: t,
            getValue: r,
            precalculateMatrix: i,
            autoOrient: s,
          }),
            extendPrototype([DynamicPropertyContainer], l),
            (l.prototype.addDynamicProperty = n),
            (l.prototype._addDynamicProperty =
              DynamicPropertyContainer.prototype.addDynamicProperty);
          function u(d, v, E) {
            return new l(d, v, E);
          }
          return { getTransformProperty: u };
        })();
      function ShapePath() {
        (this.c = !1),
          (this._length = 0),
          (this._maxLength = 8),
          (this.v = createSizedArray(this._maxLength)),
          (this.o = createSizedArray(this._maxLength)),
          (this.i = createSizedArray(this._maxLength));
      }
      (ShapePath.prototype.setPathData = function (e, t) {
        (this.c = e), this.setLength(t);
        for (var r = 0; r < t; )
          (this.v[r] = pointPool.newElement()),
            (this.o[r] = pointPool.newElement()),
            (this.i[r] = pointPool.newElement()),
            (r += 1);
      }),
        (ShapePath.prototype.setLength = function (e) {
          for (; this._maxLength < e; ) this.doubleArrayLength();
          this._length = e;
        }),
        (ShapePath.prototype.doubleArrayLength = function () {
          (this.v = this.v.concat(createSizedArray(this._maxLength))),
            (this.i = this.i.concat(createSizedArray(this._maxLength))),
            (this.o = this.o.concat(createSizedArray(this._maxLength))),
            (this._maxLength *= 2);
        }),
        (ShapePath.prototype.setXYAt = function (e, t, r, i, s) {
          var n;
          switch (
            ((this._length = Math.max(this._length, i + 1)),
            this._length >= this._maxLength && this.doubleArrayLength(),
            r)
          ) {
            case 'v':
              n = this.v;
              break;
            case 'i':
              n = this.i;
              break;
            case 'o':
              n = this.o;
              break;
            default:
              n = [];
              break;
          }
          (!n[i] || (n[i] && !s)) && (n[i] = pointPool.newElement()),
            (n[i][0] = e),
            (n[i][1] = t);
        }),
        (ShapePath.prototype.setTripleAt = function (e, t, r, i, s, n, l, u) {
          this.setXYAt(e, t, 'v', l, u),
            this.setXYAt(r, i, 'o', l, u),
            this.setXYAt(s, n, 'i', l, u);
        }),
        (ShapePath.prototype.reverse = function () {
          var e = new ShapePath();
          e.setPathData(this.c, this._length);
          var t = this.v,
            r = this.o,
            i = this.i,
            s = 0;
          this.c &&
            (e.setTripleAt(
              t[0][0],
              t[0][1],
              i[0][0],
              i[0][1],
              r[0][0],
              r[0][1],
              0,
              !1
            ),
            (s = 1));
          var n = this._length - 1,
            l = this._length,
            u;
          for (u = s; u < l; u += 1)
            e.setTripleAt(
              t[n][0],
              t[n][1],
              i[n][0],
              i[n][1],
              r[n][0],
              r[n][1],
              u,
              !1
            ),
              (n -= 1);
          return e;
        });
      var ShapePropertyFactory = (function () {
          var e = -999999;
          function t(a, o, h) {
            var f = h.lastIndex,
              b,
              P,
              S,
              w,
              M,
              I,
              C,
              R,
              V,
              O = this.keyframes;
            if (a < O[0].t - this.offsetTime)
              (b = O[0].s[0]), (S = !0), (f = 0);
            else if (a >= O[O.length - 1].t - this.offsetTime)
              (b = O[O.length - 1].s
                ? O[O.length - 1].s[0]
                : O[O.length - 2].e[0]),
                (S = !0);
            else {
              for (
                var D = f, x = O.length - 1, T = !0, A, k;
                T && ((A = O[D]), (k = O[D + 1]), !(k.t - this.offsetTime > a));

              )
                D < x - 1 ? (D += 1) : (T = !1);
              if (((S = A.h === 1), (f = D), !S)) {
                if (a >= k.t - this.offsetTime) R = 1;
                else if (a < A.t - this.offsetTime) R = 0;
                else {
                  var F;
                  A.__fnct
                    ? (F = A.__fnct)
                    : ((F = BezierFactory.getBezierEasing(
                        A.o.x,
                        A.o.y,
                        A.i.x,
                        A.i.y
                      ).get),
                      (A.__fnct = F)),
                    (R = F(
                      (a - (A.t - this.offsetTime)) /
                        (k.t - this.offsetTime - (A.t - this.offsetTime))
                    ));
                }
                P = k.s ? k.s[0] : A.e[0];
              }
              b = A.s[0];
            }
            for (
              I = o._length, C = b.i[0].length, h.lastIndex = f, w = 0;
              w < I;
              w += 1
            )
              for (M = 0; M < C; M += 1)
                (V = S ? b.i[w][M] : b.i[w][M] + (P.i[w][M] - b.i[w][M]) * R),
                  (o.i[w][M] = V),
                  (V = S ? b.o[w][M] : b.o[w][M] + (P.o[w][M] - b.o[w][M]) * R),
                  (o.o[w][M] = V),
                  (V = S ? b.v[w][M] : b.v[w][M] + (P.v[w][M] - b.v[w][M]) * R),
                  (o.v[w][M] = V);
          }
          function r() {
            var a = this.comp.renderedFrame - this.offsetTime,
              o = this.keyframes[0].t - this.offsetTime,
              h = this.keyframes[this.keyframes.length - 1].t - this.offsetTime,
              f = this._caching.lastFrame;
            return (
              (f !== e && ((f < o && a < o) || (f > h && a > h))) ||
                ((this._caching.lastIndex =
                  f < a ? this._caching.lastIndex : 0),
                this.interpolateShape(a, this.pv, this._caching)),
              (this._caching.lastFrame = a),
              this.pv
            );
          }
          function i() {
            this.paths = this.localShapeCollection;
          }
          function s(a, o) {
            if (a._length !== o._length || a.c !== o.c) return !1;
            var h,
              f = a._length;
            for (h = 0; h < f; h += 1)
              if (
                a.v[h][0] !== o.v[h][0] ||
                a.v[h][1] !== o.v[h][1] ||
                a.o[h][0] !== o.o[h][0] ||
                a.o[h][1] !== o.o[h][1] ||
                a.i[h][0] !== o.i[h][0] ||
                a.i[h][1] !== o.i[h][1]
              )
                return !1;
            return !0;
          }
          function n(a) {
            s(this.v, a) ||
              ((this.v = shapePool.clone(a)),
              this.localShapeCollection.releaseShapes(),
              this.localShapeCollection.addShape(this.v),
              (this._mdf = !0),
              (this.paths = this.localShapeCollection));
          }
          function l() {
            if (this.elem.globalData.frameId !== this.frameId) {
              if (!this.effectsSequence.length) {
                this._mdf = !1;
                return;
              }
              if (this.lock) {
                this.setVValue(this.pv);
                return;
              }
              (this.lock = !0), (this._mdf = !1);
              var a;
              this.kf
                ? (a = this.pv)
                : this.data.ks
                ? (a = this.data.ks.k)
                : (a = this.data.pt.k);
              var o,
                h = this.effectsSequence.length;
              for (o = 0; o < h; o += 1) a = this.effectsSequence[o](a);
              this.setVValue(a),
                (this.lock = !1),
                (this.frameId = this.elem.globalData.frameId);
            }
          }
          function u(a, o, h) {
            (this.propType = 'shape'),
              (this.comp = a.comp),
              (this.container = a),
              (this.elem = a),
              (this.data = o),
              (this.k = !1),
              (this.kf = !1),
              (this._mdf = !1);
            var f = h === 3 ? o.pt.k : o.ks.k;
            (this.v = shapePool.clone(f)),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.reset = i),
              (this.effectsSequence = []);
          }
          function d(a) {
            this.effectsSequence.push(a),
              this.container.addDynamicProperty(this);
          }
          (u.prototype.interpolateShape = t),
            (u.prototype.getValue = l),
            (u.prototype.setVValue = n),
            (u.prototype.addEffect = d);
          function v(a, o, h) {
            (this.propType = 'shape'),
              (this.comp = a.comp),
              (this.elem = a),
              (this.container = a),
              (this.offsetTime = a.data.st),
              (this.keyframes = h === 3 ? o.pt.k : o.ks.k),
              (this.k = !0),
              (this.kf = !0);
            var f = this.keyframes[0].s[0].i.length;
            (this.v = shapePool.newElement()),
              this.v.setPathData(this.keyframes[0].s[0].c, f),
              (this.pv = shapePool.clone(this.v)),
              (this.localShapeCollection =
                shapeCollectionPool.newShapeCollection()),
              (this.paths = this.localShapeCollection),
              this.paths.addShape(this.v),
              (this.lastFrame = e),
              (this.reset = i),
              (this._caching = { lastFrame: e, lastIndex: 0 }),
              (this.effectsSequence = [r.bind(this)]);
          }
          (v.prototype.getValue = l),
            (v.prototype.interpolateShape = t),
            (v.prototype.setVValue = n),
            (v.prototype.addEffect = d);
          var E = (function () {
              var a = roundCorner;
              function o(h, f) {
                (this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 4),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.localShapeCollection.addShape(this.v),
                  (this.d = f.d),
                  (this.elem = h),
                  (this.comp = h.comp),
                  (this.frameId = -1),
                  this.initDynamicPropertyContainer(h),
                  (this.p = PropertyFactory.getProp(h, f.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(h, f.s, 1, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertEllToPath());
              }
              return (
                (o.prototype = {
                  reset: i,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertEllToPath());
                  },
                  convertEllToPath: function () {
                    var h = this.p.v[0],
                      f = this.p.v[1],
                      b = this.s.v[0] / 2,
                      P = this.s.v[1] / 2,
                      S = this.d !== 3,
                      w = this.v;
                    (w.v[0][0] = h),
                      (w.v[0][1] = f - P),
                      (w.v[1][0] = S ? h + b : h - b),
                      (w.v[1][1] = f),
                      (w.v[2][0] = h),
                      (w.v[2][1] = f + P),
                      (w.v[3][0] = S ? h - b : h + b),
                      (w.v[3][1] = f),
                      (w.i[0][0] = S ? h - b * a : h + b * a),
                      (w.i[0][1] = f - P),
                      (w.i[1][0] = S ? h + b : h - b),
                      (w.i[1][1] = f - P * a),
                      (w.i[2][0] = S ? h + b * a : h - b * a),
                      (w.i[2][1] = f + P),
                      (w.i[3][0] = S ? h - b : h + b),
                      (w.i[3][1] = f + P * a),
                      (w.o[0][0] = S ? h + b * a : h - b * a),
                      (w.o[0][1] = f - P),
                      (w.o[1][0] = S ? h + b : h - b),
                      (w.o[1][1] = f + P * a),
                      (w.o[2][0] = S ? h - b * a : h + b * a),
                      (w.o[2][1] = f + P),
                      (w.o[3][0] = S ? h - b : h + b),
                      (w.o[3][1] = f - P * a);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], o),
                o
              );
            })(),
            _ = (function () {
              function a(o, h) {
                (this.v = shapePool.newElement()),
                  this.v.setPathData(!0, 0),
                  (this.elem = o),
                  (this.comp = o.comp),
                  (this.data = h),
                  (this.frameId = -1),
                  (this.d = h.d),
                  this.initDynamicPropertyContainer(o),
                  h.sy === 1
                    ? ((this.ir = PropertyFactory.getProp(o, h.ir, 0, 0, this)),
                      (this.is = PropertyFactory.getProp(
                        o,
                        h.is,
                        0,
                        0.01,
                        this
                      )),
                      (this.convertToPath = this.convertStarToPath))
                    : (this.convertToPath = this.convertPolygonToPath),
                  (this.pt = PropertyFactory.getProp(o, h.pt, 0, 0, this)),
                  (this.p = PropertyFactory.getProp(o, h.p, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(
                    o,
                    h.r,
                    0,
                    degToRads,
                    this
                  )),
                  (this.or = PropertyFactory.getProp(o, h.or, 0, 0, this)),
                  (this.os = PropertyFactory.getProp(o, h.os, 0, 0.01, this)),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertToPath());
              }
              return (
                (a.prototype = {
                  reset: i,
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertToPath());
                  },
                  convertStarToPath: function () {
                    var o = Math.floor(this.pt.v) * 2,
                      h = (Math.PI * 2) / o,
                      f = !0,
                      b = this.or.v,
                      P = this.ir.v,
                      S = this.os.v,
                      w = this.is.v,
                      M = (2 * Math.PI * b) / (o * 2),
                      I = (2 * Math.PI * P) / (o * 2),
                      C,
                      R,
                      V,
                      O,
                      D = -Math.PI / 2;
                    D += this.r.v;
                    var x = this.data.d === 3 ? -1 : 1;
                    for (this.v._length = 0, C = 0; C < o; C += 1) {
                      (R = f ? b : P), (V = f ? S : w), (O = f ? M : I);
                      var T = R * Math.cos(D),
                        A = R * Math.sin(D),
                        k =
                          T === 0 && A === 0 ? 0 : A / Math.sqrt(T * T + A * A),
                        F =
                          T === 0 && A === 0
                            ? 0
                            : -T / Math.sqrt(T * T + A * A);
                      (T += +this.p.v[0]),
                        (A += +this.p.v[1]),
                        this.v.setTripleAt(
                          T,
                          A,
                          T - k * O * V * x,
                          A - F * O * V * x,
                          T + k * O * V * x,
                          A + F * O * V * x,
                          C,
                          !0
                        ),
                        (f = !f),
                        (D += h * x);
                    }
                  },
                  convertPolygonToPath: function () {
                    var o = Math.floor(this.pt.v),
                      h = (Math.PI * 2) / o,
                      f = this.or.v,
                      b = this.os.v,
                      P = (2 * Math.PI * f) / (o * 4),
                      S,
                      w = -Math.PI * 0.5,
                      M = this.data.d === 3 ? -1 : 1;
                    for (
                      w += this.r.v, this.v._length = 0, S = 0;
                      S < o;
                      S += 1
                    ) {
                      var I = f * Math.cos(w),
                        C = f * Math.sin(w),
                        R =
                          I === 0 && C === 0 ? 0 : C / Math.sqrt(I * I + C * C),
                        V =
                          I === 0 && C === 0
                            ? 0
                            : -I / Math.sqrt(I * I + C * C);
                      (I += +this.p.v[0]),
                        (C += +this.p.v[1]),
                        this.v.setTripleAt(
                          I,
                          C,
                          I - R * P * b * M,
                          C - V * P * b * M,
                          I + R * P * b * M,
                          C + V * P * b * M,
                          S,
                          !0
                        ),
                        (w += h * M);
                    }
                    (this.paths.length = 0), (this.paths[0] = this.v);
                  },
                }),
                extendPrototype([DynamicPropertyContainer], a),
                a
              );
            })(),
            m = (function () {
              function a(o, h) {
                (this.v = shapePool.newElement()),
                  (this.v.c = !0),
                  (this.localShapeCollection =
                    shapeCollectionPool.newShapeCollection()),
                  this.localShapeCollection.addShape(this.v),
                  (this.paths = this.localShapeCollection),
                  (this.elem = o),
                  (this.comp = o.comp),
                  (this.frameId = -1),
                  (this.d = h.d),
                  this.initDynamicPropertyContainer(o),
                  (this.p = PropertyFactory.getProp(o, h.p, 1, 0, this)),
                  (this.s = PropertyFactory.getProp(o, h.s, 1, 0, this)),
                  (this.r = PropertyFactory.getProp(o, h.r, 0, 0, this)),
                  this.dynamicProperties.length
                    ? (this.k = !0)
                    : ((this.k = !1), this.convertRectToPath());
              }
              return (
                (a.prototype = {
                  convertRectToPath: function () {
                    var o = this.p.v[0],
                      h = this.p.v[1],
                      f = this.s.v[0] / 2,
                      b = this.s.v[1] / 2,
                      P = bmMin(f, b, this.r.v),
                      S = P * (1 - roundCorner);
                    (this.v._length = 0),
                      this.d === 2 || this.d === 1
                        ? (this.v.setTripleAt(
                            o + f,
                            h - b + P,
                            o + f,
                            h - b + P,
                            o + f,
                            h - b + S,
                            0,
                            !0
                          ),
                          this.v.setTripleAt(
                            o + f,
                            h + b - P,
                            o + f,
                            h + b - S,
                            o + f,
                            h + b - P,
                            1,
                            !0
                          ),
                          P !== 0
                            ? (this.v.setTripleAt(
                                o + f - P,
                                h + b,
                                o + f - P,
                                h + b,
                                o + f - S,
                                h + b,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f + P,
                                h + b,
                                o - f + S,
                                h + b,
                                o - f + P,
                                h + b,
                                3,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h + b - P,
                                o - f,
                                h + b - P,
                                o - f,
                                h + b - S,
                                4,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h - b + P,
                                o - f,
                                h - b + S,
                                o - f,
                                h - b + P,
                                5,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f + P,
                                h - b,
                                o - f + P,
                                h - b,
                                o - f + S,
                                h - b,
                                6,
                                !0
                              ),
                              this.v.setTripleAt(
                                o + f - P,
                                h - b,
                                o + f - S,
                                h - b,
                                o + f - P,
                                h - b,
                                7,
                                !0
                              ))
                            : (this.v.setTripleAt(
                                o - f,
                                h + b,
                                o - f + S,
                                h + b,
                                o - f,
                                h + b,
                                2
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h - b,
                                o - f,
                                h - b + S,
                                o - f,
                                h - b,
                                3
                              )))
                        : (this.v.setTripleAt(
                            o + f,
                            h - b + P,
                            o + f,
                            h - b + S,
                            o + f,
                            h - b + P,
                            0,
                            !0
                          ),
                          P !== 0
                            ? (this.v.setTripleAt(
                                o + f - P,
                                h - b,
                                o + f - P,
                                h - b,
                                o + f - S,
                                h - b,
                                1,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f + P,
                                h - b,
                                o - f + S,
                                h - b,
                                o - f + P,
                                h - b,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h - b + P,
                                o - f,
                                h - b + P,
                                o - f,
                                h - b + S,
                                3,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h + b - P,
                                o - f,
                                h + b - S,
                                o - f,
                                h + b - P,
                                4,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f + P,
                                h + b,
                                o - f + P,
                                h + b,
                                o - f + S,
                                h + b,
                                5,
                                !0
                              ),
                              this.v.setTripleAt(
                                o + f - P,
                                h + b,
                                o + f - S,
                                h + b,
                                o + f - P,
                                h + b,
                                6,
                                !0
                              ),
                              this.v.setTripleAt(
                                o + f,
                                h + b - P,
                                o + f,
                                h + b - P,
                                o + f,
                                h + b - S,
                                7,
                                !0
                              ))
                            : (this.v.setTripleAt(
                                o - f,
                                h - b,
                                o - f + S,
                                h - b,
                                o - f,
                                h - b,
                                1,
                                !0
                              ),
                              this.v.setTripleAt(
                                o - f,
                                h + b,
                                o - f,
                                h + b - S,
                                o - f,
                                h + b,
                                2,
                                !0
                              ),
                              this.v.setTripleAt(
                                o + f,
                                h + b,
                                o + f - S,
                                h + b,
                                o + f,
                                h + b,
                                3,
                                !0
                              )));
                  },
                  getValue: function () {
                    this.elem.globalData.frameId !== this.frameId &&
                      ((this.frameId = this.elem.globalData.frameId),
                      this.iterateDynamicProperties(),
                      this._mdf && this.convertRectToPath());
                  },
                  reset: i,
                }),
                extendPrototype([DynamicPropertyContainer], a),
                a
              );
            })();
          function y(a, o, h) {
            var f;
            if (h === 3 || h === 4) {
              var b = h === 3 ? o.pt : o.ks,
                P = b.k;
              P.length ? (f = new v(a, o, h)) : (f = new u(a, o, h));
            } else
              h === 5
                ? (f = new m(a, o))
                : h === 6
                ? (f = new E(a, o))
                : h === 7 && (f = new _(a, o));
            return f.k && a.addDynamicProperty(f), f;
          }
          function c() {
            return u;
          }
          function g() {
            return v;
          }
          var p = {};
          return (
            (p.getShapeProp = y),
            (p.getConstructorFunction = c),
            (p.getKeyframedConstructorFunction = g),
            p
          );
        })(),
        ShapeModifiers = (function () {
          var e = {},
            t = {};
          (e.registerModifier = r), (e.getModifier = i);
          function r(s, n) {
            t[s] || (t[s] = n);
          }
          function i(s, n, l) {
            return new t[s](n, l);
          }
          return e;
        })();
      function ShapeModifier() {}
      (ShapeModifier.prototype.initModifierProperties = function () {}),
        (ShapeModifier.prototype.addShapeToModifier = function () {}),
        (ShapeModifier.prototype.addShape = function (e) {
          if (!this.closed) {
            e.sh.container.addDynamicProperty(e.sh);
            var t = {
              shape: e.sh,
              data: e,
              localShapeCollection: shapeCollectionPool.newShapeCollection(),
            };
            this.shapes.push(t),
              this.addShapeToModifier(t),
              this._isAnimated && e.setAsAnimated();
          }
        }),
        (ShapeModifier.prototype.init = function (e, t) {
          (this.shapes = []),
            (this.elem = e),
            this.initDynamicPropertyContainer(e),
            this.initModifierProperties(e, t),
            (this.frameId = initialDefaultFrame),
            (this.closed = !1),
            (this.k = !1),
            this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
        }),
        (ShapeModifier.prototype.processKeys = function () {
          this.elem.globalData.frameId !== this.frameId &&
            ((this.frameId = this.elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        extendPrototype([DynamicPropertyContainer], ShapeModifier);
      function TrimModifier() {}
      extendPrototype([ShapeModifier], TrimModifier),
        (TrimModifier.prototype.initModifierProperties = function (e, t) {
          (this.s = PropertyFactory.getProp(e, t.s, 0, 0.01, this)),
            (this.e = PropertyFactory.getProp(e, t.e, 0, 0.01, this)),
            (this.o = PropertyFactory.getProp(e, t.o, 0, 0, this)),
            (this.sValue = 0),
            (this.eValue = 0),
            (this.getValue = this.processKeys),
            (this.m = t.m),
            (this._isAnimated =
              !!this.s.effectsSequence.length ||
              !!this.e.effectsSequence.length ||
              !!this.o.effectsSequence.length);
        }),
        (TrimModifier.prototype.addShapeToModifier = function (e) {
          e.pathsData = [];
        }),
        (TrimModifier.prototype.calculateShapeEdges = function (e, t, r, i, s) {
          var n = [];
          t <= 1
            ? n.push({ s: e, e: t })
            : e >= 1
            ? n.push({ s: e - 1, e: t - 1 })
            : (n.push({ s: e, e: 1 }), n.push({ s: 0, e: t - 1 }));
          var l = [],
            u,
            d = n.length,
            v;
          for (u = 0; u < d; u += 1)
            if (((v = n[u]), !(v.e * s < i || v.s * s > i + r))) {
              var E, _;
              v.s * s <= i ? (E = 0) : (E = (v.s * s - i) / r),
                v.e * s >= i + r ? (_ = 1) : (_ = (v.e * s - i) / r),
                l.push([E, _]);
            }
          return l.length || l.push([0, 0]), l;
        }),
        (TrimModifier.prototype.releasePathsData = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) segmentsLengthPool.release(e[t]);
          return (e.length = 0), e;
        }),
        (TrimModifier.prototype.processShapes = function (e) {
          var t, r;
          if (this._mdf || e) {
            var i = (this.o.v % 360) / 360;
            if (
              (i < 0 && (i += 1),
              this.s.v > 1
                ? (t = 1 + i)
                : this.s.v < 0
                ? (t = 0 + i)
                : (t = this.s.v + i),
              this.e.v > 1
                ? (r = 1 + i)
                : this.e.v < 0
                ? (r = 0 + i)
                : (r = this.e.v + i),
              t > r)
            ) {
              var s = t;
              (t = r), (r = s);
            }
            (t = Math.round(t * 1e4) * 1e-4),
              (r = Math.round(r * 1e4) * 1e-4),
              (this.sValue = t),
              (this.eValue = r);
          } else (t = this.sValue), (r = this.eValue);
          var n,
            l,
            u = this.shapes.length,
            d,
            v,
            E,
            _,
            m,
            y = 0;
          if (r === t)
            for (l = 0; l < u; l += 1)
              this.shapes[l].localShapeCollection.releaseShapes(),
                (this.shapes[l].shape._mdf = !0),
                (this.shapes[l].shape.paths =
                  this.shapes[l].localShapeCollection),
                this._mdf && (this.shapes[l].pathsData.length = 0);
          else if ((r === 1 && t === 0) || (r === 0 && t === 1)) {
            if (this._mdf)
              for (l = 0; l < u; l += 1)
                (this.shapes[l].pathsData.length = 0),
                  (this.shapes[l].shape._mdf = !0);
          } else {
            var c = [],
              g,
              p;
            for (l = 0; l < u; l += 1)
              if (
                ((g = this.shapes[l]),
                !g.shape._mdf && !this._mdf && !e && this.m !== 2)
              )
                g.shape.paths = g.localShapeCollection;
              else {
                if (
                  ((n = g.shape.paths),
                  (v = n._length),
                  (m = 0),
                  !g.shape._mdf && g.pathsData.length)
                )
                  m = g.totalShapeLength;
                else {
                  for (
                    E = this.releasePathsData(g.pathsData), d = 0;
                    d < v;
                    d += 1
                  )
                    (_ = bez.getSegmentsLength(n.shapes[d])),
                      E.push(_),
                      (m += _.totalLength);
                  (g.totalShapeLength = m), (g.pathsData = E);
                }
                (y += m), (g.shape._mdf = !0);
              }
            var a = t,
              o = r,
              h = 0,
              f;
            for (l = u - 1; l >= 0; l -= 1)
              if (((g = this.shapes[l]), g.shape._mdf)) {
                for (
                  p = g.localShapeCollection,
                    p.releaseShapes(),
                    this.m === 2 && u > 1
                      ? ((f = this.calculateShapeEdges(
                          t,
                          r,
                          g.totalShapeLength,
                          h,
                          y
                        )),
                        (h += g.totalShapeLength))
                      : (f = [[a, o]]),
                    v = f.length,
                    d = 0;
                  d < v;
                  d += 1
                ) {
                  (a = f[d][0]),
                    (o = f[d][1]),
                    (c.length = 0),
                    o <= 1
                      ? c.push({
                          s: g.totalShapeLength * a,
                          e: g.totalShapeLength * o,
                        })
                      : a >= 1
                      ? c.push({
                          s: g.totalShapeLength * (a - 1),
                          e: g.totalShapeLength * (o - 1),
                        })
                      : (c.push({
                          s: g.totalShapeLength * a,
                          e: g.totalShapeLength,
                        }),
                        c.push({ s: 0, e: g.totalShapeLength * (o - 1) }));
                  var b = this.addShapes(g, c[0]);
                  if (c[0].s !== c[0].e) {
                    if (c.length > 1) {
                      var P = g.shape.paths.shapes[g.shape.paths._length - 1];
                      if (P.c) {
                        var S = b.pop();
                        this.addPaths(b, p), (b = this.addShapes(g, c[1], S));
                      } else this.addPaths(b, p), (b = this.addShapes(g, c[1]));
                    }
                    this.addPaths(b, p);
                  }
                }
                g.shape.paths = p;
              }
          }
        }),
        (TrimModifier.prototype.addPaths = function (e, t) {
          var r,
            i = e.length;
          for (r = 0; r < i; r += 1) t.addShape(e[r]);
        }),
        (TrimModifier.prototype.addSegment = function (e, t, r, i, s, n, l) {
          s.setXYAt(t[0], t[1], 'o', n),
            s.setXYAt(r[0], r[1], 'i', n + 1),
            l && s.setXYAt(e[0], e[1], 'v', n),
            s.setXYAt(i[0], i[1], 'v', n + 1);
        }),
        (TrimModifier.prototype.addSegmentFromArray = function (e, t, r, i) {
          t.setXYAt(e[1], e[5], 'o', r),
            t.setXYAt(e[2], e[6], 'i', r + 1),
            i && t.setXYAt(e[0], e[4], 'v', r),
            t.setXYAt(e[3], e[7], 'v', r + 1);
        }),
        (TrimModifier.prototype.addShapes = function (e, t, r) {
          var i = e.pathsData,
            s = e.shape.paths.shapes,
            n,
            l = e.shape.paths._length,
            u,
            d,
            v = 0,
            E,
            _,
            m,
            y,
            c = [],
            g,
            p = !0;
          for (
            r
              ? ((_ = r._length), (g = r._length))
              : ((r = shapePool.newElement()), (_ = 0), (g = 0)),
              c.push(r),
              n = 0;
            n < l;
            n += 1
          ) {
            for (
              m = i[n].lengths,
                r.c = s[n].c,
                d = s[n].c ? m.length : m.length + 1,
                u = 1;
              u < d;
              u += 1
            )
              if (((E = m[u - 1]), v + E.addedLength < t.s))
                (v += E.addedLength), (r.c = !1);
              else if (v > t.e) {
                r.c = !1;
                break;
              } else
                t.s <= v && t.e >= v + E.addedLength
                  ? (this.addSegment(
                      s[n].v[u - 1],
                      s[n].o[u - 1],
                      s[n].i[u],
                      s[n].v[u],
                      r,
                      _,
                      p
                    ),
                    (p = !1))
                  : ((y = bez.getNewSegment(
                      s[n].v[u - 1],
                      s[n].v[u],
                      s[n].o[u - 1],
                      s[n].i[u],
                      (t.s - v) / E.addedLength,
                      (t.e - v) / E.addedLength,
                      m[u - 1]
                    )),
                    this.addSegmentFromArray(y, r, _, p),
                    (p = !1),
                    (r.c = !1)),
                  (v += E.addedLength),
                  (_ += 1);
            if (s[n].c && m.length) {
              if (((E = m[u - 1]), v <= t.e)) {
                var a = m[u - 1].addedLength;
                t.s <= v && t.e >= v + a
                  ? (this.addSegment(
                      s[n].v[u - 1],
                      s[n].o[u - 1],
                      s[n].i[0],
                      s[n].v[0],
                      r,
                      _,
                      p
                    ),
                    (p = !1))
                  : ((y = bez.getNewSegment(
                      s[n].v[u - 1],
                      s[n].v[0],
                      s[n].o[u - 1],
                      s[n].i[0],
                      (t.s - v) / a,
                      (t.e - v) / a,
                      m[u - 1]
                    )),
                    this.addSegmentFromArray(y, r, _, p),
                    (p = !1),
                    (r.c = !1));
              } else r.c = !1;
              (v += E.addedLength), (_ += 1);
            }
            if (
              (r._length &&
                (r.setXYAt(r.v[g][0], r.v[g][1], 'i', g),
                r.setXYAt(
                  r.v[r._length - 1][0],
                  r.v[r._length - 1][1],
                  'o',
                  r._length - 1
                )),
              v > t.e)
            )
              break;
            n < l - 1 &&
              ((r = shapePool.newElement()), (p = !0), c.push(r), (_ = 0));
          }
          return c;
        }),
        ShapeModifiers.registerModifier('tm', TrimModifier);
      function RoundCornersModifier() {}
      extendPrototype([ShapeModifier], RoundCornersModifier),
        (RoundCornersModifier.prototype.initModifierProperties = function (
          e,
          t
        ) {
          (this.getValue = this.processKeys),
            (this.rd = PropertyFactory.getProp(e, t.r, 0, null, this)),
            (this._isAnimated = !!this.rd.effectsSequence.length);
        }),
        (RoundCornersModifier.prototype.processPath = function (e, t) {
          var r = shapePool.newElement();
          r.c = e.c;
          var i,
            s = e._length,
            n,
            l,
            u,
            d,
            v,
            E,
            _ = 0,
            m,
            y,
            c,
            g,
            p,
            a;
          for (i = 0; i < s; i += 1)
            (n = e.v[i]),
              (u = e.o[i]),
              (l = e.i[i]),
              n[0] === u[0] && n[1] === u[1] && n[0] === l[0] && n[1] === l[1]
                ? (i === 0 || i === s - 1) && !e.c
                  ? (r.setTripleAt(n[0], n[1], u[0], u[1], l[0], l[1], _),
                    (_ += 1))
                  : (i === 0 ? (d = e.v[s - 1]) : (d = e.v[i - 1]),
                    (v = Math.sqrt(
                      Math.pow(n[0] - d[0], 2) + Math.pow(n[1] - d[1], 2)
                    )),
                    (E = v ? Math.min(v / 2, t) / v : 0),
                    (p = n[0] + (d[0] - n[0]) * E),
                    (m = p),
                    (a = n[1] - (n[1] - d[1]) * E),
                    (y = a),
                    (c = m - (m - n[0]) * roundCorner),
                    (g = y - (y - n[1]) * roundCorner),
                    r.setTripleAt(m, y, c, g, p, a, _),
                    (_ += 1),
                    i === s - 1 ? (d = e.v[0]) : (d = e.v[i + 1]),
                    (v = Math.sqrt(
                      Math.pow(n[0] - d[0], 2) + Math.pow(n[1] - d[1], 2)
                    )),
                    (E = v ? Math.min(v / 2, t) / v : 0),
                    (c = n[0] + (d[0] - n[0]) * E),
                    (m = c),
                    (g = n[1] + (d[1] - n[1]) * E),
                    (y = g),
                    (p = m - (m - n[0]) * roundCorner),
                    (a = y - (y - n[1]) * roundCorner),
                    r.setTripleAt(m, y, c, g, p, a, _),
                    (_ += 1))
                : (r.setTripleAt(
                    e.v[i][0],
                    e.v[i][1],
                    e.o[i][0],
                    e.o[i][1],
                    e.i[i][0],
                    e.i[i][1],
                    _
                  ),
                  (_ += 1));
          return r;
        }),
        (RoundCornersModifier.prototype.processShapes = function (e) {
          var t,
            r,
            i = this.shapes.length,
            s,
            n,
            l = this.rd.v;
          if (l !== 0) {
            var u, d;
            for (r = 0; r < i; r += 1) {
              if (
                ((u = this.shapes[r]),
                (d = u.localShapeCollection),
                !(!u.shape._mdf && !this._mdf && !e))
              )
                for (
                  d.releaseShapes(),
                    u.shape._mdf = !0,
                    t = u.shape.paths.shapes,
                    n = u.shape.paths._length,
                    s = 0;
                  s < n;
                  s += 1
                )
                  d.addShape(this.processPath(t[s], l));
              u.shape.paths = u.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }),
        ShapeModifiers.registerModifier('rd', RoundCornersModifier);
      function PuckerAndBloatModifier() {}
      extendPrototype([ShapeModifier], PuckerAndBloatModifier),
        (PuckerAndBloatModifier.prototype.initModifierProperties = function (
          e,
          t
        ) {
          (this.getValue = this.processKeys),
            (this.amount = PropertyFactory.getProp(e, t.a, 0, null, this)),
            (this._isAnimated = !!this.amount.effectsSequence.length);
        }),
        (PuckerAndBloatModifier.prototype.processPath = function (e, t) {
          var r = t / 100,
            i = [0, 0],
            s = e._length,
            n = 0;
          for (n = 0; n < s; n += 1) (i[0] += e.v[n][0]), (i[1] += e.v[n][1]);
          (i[0] /= s), (i[1] /= s);
          var l = shapePool.newElement();
          l.c = e.c;
          var u, d, v, E, _, m;
          for (n = 0; n < s; n += 1)
            (u = e.v[n][0] + (i[0] - e.v[n][0]) * r),
              (d = e.v[n][1] + (i[1] - e.v[n][1]) * r),
              (v = e.o[n][0] + (i[0] - e.o[n][0]) * -r),
              (E = e.o[n][1] + (i[1] - e.o[n][1]) * -r),
              (_ = e.i[n][0] + (i[0] - e.i[n][0]) * -r),
              (m = e.i[n][1] + (i[1] - e.i[n][1]) * -r),
              l.setTripleAt(u, d, v, E, _, m, n);
          return l;
        }),
        (PuckerAndBloatModifier.prototype.processShapes = function (e) {
          var t,
            r,
            i = this.shapes.length,
            s,
            n,
            l = this.amount.v;
          if (l !== 0) {
            var u, d;
            for (r = 0; r < i; r += 1) {
              if (
                ((u = this.shapes[r]),
                (d = u.localShapeCollection),
                !(!u.shape._mdf && !this._mdf && !e))
              )
                for (
                  d.releaseShapes(),
                    u.shape._mdf = !0,
                    t = u.shape.paths.shapes,
                    n = u.shape.paths._length,
                    s = 0;
                  s < n;
                  s += 1
                )
                  d.addShape(this.processPath(t[s], l));
              u.shape.paths = u.localShapeCollection;
            }
          }
          this.dynamicProperties.length || (this._mdf = !1);
        }),
        ShapeModifiers.registerModifier('pb', PuckerAndBloatModifier);
      function RepeaterModifier() {}
      extendPrototype([ShapeModifier], RepeaterModifier),
        (RepeaterModifier.prototype.initModifierProperties = function (e, t) {
          (this.getValue = this.processKeys),
            (this.c = PropertyFactory.getProp(e, t.c, 0, null, this)),
            (this.o = PropertyFactory.getProp(e, t.o, 0, null, this)),
            (this.tr = TransformPropertyFactory.getTransformProperty(
              e,
              t.tr,
              this
            )),
            (this.so = PropertyFactory.getProp(e, t.tr.so, 0, 0.01, this)),
            (this.eo = PropertyFactory.getProp(e, t.tr.eo, 0, 0.01, this)),
            (this.data = t),
            this.dynamicProperties.length || this.getValue(!0),
            (this._isAnimated = !!this.dynamicProperties.length),
            (this.pMatrix = new Matrix()),
            (this.rMatrix = new Matrix()),
            (this.sMatrix = new Matrix()),
            (this.tMatrix = new Matrix()),
            (this.matrix = new Matrix());
        }),
        (RepeaterModifier.prototype.applyTransforms = function (
          e,
          t,
          r,
          i,
          s,
          n
        ) {
          var l = n ? -1 : 1,
            u = i.s.v[0] + (1 - i.s.v[0]) * (1 - s),
            d = i.s.v[1] + (1 - i.s.v[1]) * (1 - s);
          e.translate(i.p.v[0] * l * s, i.p.v[1] * l * s, i.p.v[2]),
            t.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
            t.rotate(-i.r.v * l * s),
            t.translate(i.a.v[0], i.a.v[1], i.a.v[2]),
            r.translate(-i.a.v[0], -i.a.v[1], i.a.v[2]),
            r.scale(n ? 1 / u : u, n ? 1 / d : d),
            r.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
        }),
        (RepeaterModifier.prototype.init = function (e, t, r, i) {
          for (
            this.elem = e,
              this.arr = t,
              this.pos = r,
              this.elemsData = i,
              this._currentCopies = 0,
              this._elements = [],
              this._groups = [],
              this.frameId = -1,
              this.initDynamicPropertyContainer(e),
              this.initModifierProperties(e, t[r]);
            r > 0;

          )
            (r -= 1), this._elements.unshift(t[r]);
          this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
        }),
        (RepeaterModifier.prototype.resetElements = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1)
            (e[t]._processed = !1),
              e[t].ty === 'gr' && this.resetElements(e[t].it);
        }),
        (RepeaterModifier.prototype.cloneElements = function (e) {
          var t = JSON.parse(JSON.stringify(e));
          return this.resetElements(t), t;
        }),
        (RepeaterModifier.prototype.changeGroupRender = function (e, t) {
          var r,
            i = e.length;
          for (r = 0; r < i; r += 1)
            (e[r]._render = t),
              e[r].ty === 'gr' && this.changeGroupRender(e[r].it, t);
        }),
        (RepeaterModifier.prototype.processShapes = function (e) {
          var t,
            r,
            i,
            s,
            n,
            l = !1;
          if (this._mdf || e) {
            var u = Math.ceil(this.c.v);
            if (this._groups.length < u) {
              for (; this._groups.length < u; ) {
                var d = { it: this.cloneElements(this._elements), ty: 'gr' };
                d.it.push({
                  a: { a: 0, ix: 1, k: [0, 0] },
                  nm: 'Transform',
                  o: { a: 0, ix: 7, k: 100 },
                  p: { a: 0, ix: 2, k: [0, 0] },
                  r: {
                    a: 1,
                    ix: 6,
                    k: [
                      { s: 0, e: 0, t: 0 },
                      { s: 0, e: 0, t: 1 },
                    ],
                  },
                  s: { a: 0, ix: 3, k: [100, 100] },
                  sa: { a: 0, ix: 5, k: 0 },
                  sk: { a: 0, ix: 4, k: 0 },
                  ty: 'tr',
                }),
                  this.arr.splice(0, 0, d),
                  this._groups.splice(0, 0, d),
                  (this._currentCopies += 1);
              }
              this.elem.reloadShapes(), (l = !0);
            }
            n = 0;
            var v;
            for (i = 0; i <= this._groups.length - 1; i += 1) {
              if (
                ((v = n < u),
                (this._groups[i]._render = v),
                this.changeGroupRender(this._groups[i].it, v),
                !v)
              ) {
                var E = this.elemsData[i].it,
                  _ = E[E.length - 1];
                _.transform.op.v !== 0
                  ? ((_.transform.op._mdf = !0), (_.transform.op.v = 0))
                  : (_.transform.op._mdf = !1);
              }
              n += 1;
            }
            this._currentCopies = u;
            var m = this.o.v,
              y = m % 1,
              c = m > 0 ? Math.floor(m) : Math.ceil(m),
              g = this.pMatrix.props,
              p = this.rMatrix.props,
              a = this.sMatrix.props;
            this.pMatrix.reset(),
              this.rMatrix.reset(),
              this.sMatrix.reset(),
              this.tMatrix.reset(),
              this.matrix.reset();
            var o = 0;
            if (m > 0) {
              for (; o < c; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !1
                ),
                  (o += 1);
              y &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  y,
                  !1
                ),
                (o += y));
            } else if (m < 0) {
              for (; o > c; )
                this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  1,
                  !0
                ),
                  (o -= 1);
              y &&
                (this.applyTransforms(
                  this.pMatrix,
                  this.rMatrix,
                  this.sMatrix,
                  this.tr,
                  -y,
                  !0
                ),
                (o -= y));
            }
            (i = this.data.m === 1 ? 0 : this._currentCopies - 1),
              (s = this.data.m === 1 ? 1 : -1),
              (n = this._currentCopies);
            for (var h, f; n; ) {
              if (
                ((t = this.elemsData[i].it),
                (r = t[t.length - 1].transform.mProps.v.props),
                (f = r.length),
                (t[t.length - 1].transform.mProps._mdf = !0),
                (t[t.length - 1].transform.op._mdf = !0),
                (t[t.length - 1].transform.op.v =
                  this._currentCopies === 1
                    ? this.so.v
                    : this.so.v +
                      (this.eo.v - this.so.v) *
                        (i / (this._currentCopies - 1))),
                o !== 0)
              ) {
                for (
                  ((i !== 0 && s === 1) ||
                    (i !== this._currentCopies - 1 && s === -1)) &&
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                    this.matrix.transform(
                      p[0],
                      p[1],
                      p[2],
                      p[3],
                      p[4],
                      p[5],
                      p[6],
                      p[7],
                      p[8],
                      p[9],
                      p[10],
                      p[11],
                      p[12],
                      p[13],
                      p[14],
                      p[15]
                    ),
                    this.matrix.transform(
                      a[0],
                      a[1],
                      a[2],
                      a[3],
                      a[4],
                      a[5],
                      a[6],
                      a[7],
                      a[8],
                      a[9],
                      a[10],
                      a[11],
                      a[12],
                      a[13],
                      a[14],
                      a[15]
                    ),
                    this.matrix.transform(
                      g[0],
                      g[1],
                      g[2],
                      g[3],
                      g[4],
                      g[5],
                      g[6],
                      g[7],
                      g[8],
                      g[9],
                      g[10],
                      g[11],
                      g[12],
                      g[13],
                      g[14],
                      g[15]
                    ),
                    h = 0;
                  h < f;
                  h += 1
                )
                  r[h] = this.matrix.props[h];
                this.matrix.reset();
              } else
                for (this.matrix.reset(), h = 0; h < f; h += 1)
                  r[h] = this.matrix.props[h];
              (o += 1), (n -= 1), (i += s);
            }
          } else
            for (n = this._currentCopies, i = 0, s = 1; n; )
              (t = this.elemsData[i].it),
                (r = t[t.length - 1].transform.mProps.v.props),
                (t[t.length - 1].transform.mProps._mdf = !1),
                (t[t.length - 1].transform.op._mdf = !1),
                (n -= 1),
                (i += s);
          return l;
        }),
        (RepeaterModifier.prototype.addShape = function () {}),
        ShapeModifiers.registerModifier('rp', RepeaterModifier);
      function ShapeCollection() {
        (this._length = 0),
          (this._maxLength = 4),
          (this.shapes = createSizedArray(this._maxLength));
      }
      (ShapeCollection.prototype.addShape = function (e) {
        this._length === this._maxLength &&
          ((this.shapes = this.shapes.concat(
            createSizedArray(this._maxLength)
          )),
          (this._maxLength *= 2)),
          (this.shapes[this._length] = e),
          (this._length += 1);
      }),
        (ShapeCollection.prototype.releaseShapes = function () {
          var e;
          for (e = 0; e < this._length; e += 1)
            shapePool.release(this.shapes[e]);
          this._length = 0;
        });
      function DashProperty(e, t, r, i) {
        (this.elem = e),
          (this.frameId = -1),
          (this.dataProps = createSizedArray(t.length)),
          (this.renderer = r),
          (this.k = !1),
          (this.dashStr = ''),
          (this.dashArray = createTypedArray(
            'float32',
            t.length ? t.length - 1 : 0
          )),
          (this.dashoffset = createTypedArray('float32', 1)),
          this.initDynamicPropertyContainer(i);
        var s,
          n = t.length || 0,
          l;
        for (s = 0; s < n; s += 1)
          (l = PropertyFactory.getProp(e, t[s].v, 0, 0, this)),
            (this.k = l.k || this.k),
            (this.dataProps[s] = { n: t[s].n, p: l });
        this.k || this.getValue(!0), (this._isAnimated = this.k);
      }
      (DashProperty.prototype.getValue = function (e) {
        if (
          !(this.elem.globalData.frameId === this.frameId && !e) &&
          ((this.frameId = this.elem.globalData.frameId),
          this.iterateDynamicProperties(),
          (this._mdf = this._mdf || e),
          this._mdf)
        ) {
          var t = 0,
            r = this.dataProps.length;
          for (
            this.renderer === 'svg' && (this.dashStr = ''), t = 0;
            t < r;
            t += 1
          )
            this.dataProps[t].n !== 'o'
              ? this.renderer === 'svg'
                ? (this.dashStr += ' ' + this.dataProps[t].p.v)
                : (this.dashArray[t] = this.dataProps[t].p.v)
              : (this.dashoffset[0] = this.dataProps[t].p.v);
        }
      }),
        extendPrototype([DynamicPropertyContainer], DashProperty);
      function GradientProperty(e, t, r) {
        (this.data = t), (this.c = createTypedArray('uint8c', t.p * 4));
        var i = t.k.k[0].s
          ? t.k.k[0].s.length - t.p * 4
          : t.k.k.length - t.p * 4;
        (this.o = createTypedArray('float32', i)),
          (this._cmdf = !1),
          (this._omdf = !1),
          (this._collapsable = this.checkCollapsable()),
          (this._hasOpacity = i),
          this.initDynamicPropertyContainer(r),
          (this.prop = PropertyFactory.getProp(e, t.k, 1, null, this)),
          (this.k = this.prop.k),
          this.getValue(!0);
      }
      (GradientProperty.prototype.comparePoints = function (e, t) {
        for (var r = 0, i = this.o.length / 2, s; r < i; ) {
          if (((s = Math.abs(e[r * 4] - e[t * 4 + r * 2])), s > 0.01))
            return !1;
          r += 1;
        }
        return !0;
      }),
        (GradientProperty.prototype.checkCollapsable = function () {
          if (this.o.length / 2 != this.c.length / 4) return !1;
          if (this.data.k.k[0].s)
            for (var e = 0, t = this.data.k.k.length; e < t; ) {
              if (!this.comparePoints(this.data.k.k[e].s, this.data.p))
                return !1;
              e += 1;
            }
          else if (!this.comparePoints(this.data.k.k, this.data.p)) return !1;
          return !0;
        }),
        (GradientProperty.prototype.getValue = function (e) {
          if (
            (this.prop.getValue(),
            (this._mdf = !1),
            (this._cmdf = !1),
            (this._omdf = !1),
            this.prop._mdf || e)
          ) {
            var t,
              r = this.data.p * 4,
              i,
              s;
            for (t = 0; t < r; t += 1)
              (i = t % 4 == 0 ? 100 : 255),
                (s = Math.round(this.prop.v[t] * i)),
                this.c[t] !== s && ((this.c[t] = s), (this._cmdf = !e));
            if (this.o.length)
              for (r = this.prop.v.length, t = this.data.p * 4; t < r; t += 1)
                (i = t % 2 == 0 ? 100 : 1),
                  (s =
                    t % 2 == 0
                      ? Math.round(this.prop.v[t] * 100)
                      : this.prop.v[t]),
                  this.o[t - this.data.p * 4] !== s &&
                    ((this.o[t - this.data.p * 4] = s), (this._omdf = !e));
            this._mdf = !e;
          }
        }),
        extendPrototype([DynamicPropertyContainer], GradientProperty);
      var buildShapeString = function (e, t, r, i) {
          if (t === 0) return '';
          var s = e.o,
            n = e.i,
            l = e.v,
            u,
            d = ' M' + i.applyToPointStringified(l[0][0], l[0][1]);
          for (u = 1; u < t; u += 1)
            d +=
              ' C' +
              i.applyToPointStringified(s[u - 1][0], s[u - 1][1]) +
              ' ' +
              i.applyToPointStringified(n[u][0], n[u][1]) +
              ' ' +
              i.applyToPointStringified(l[u][0], l[u][1]);
          return (
            r &&
              t &&
              ((d +=
                ' C' +
                i.applyToPointStringified(s[u - 1][0], s[u - 1][1]) +
                ' ' +
                i.applyToPointStringified(n[0][0], n[0][1]) +
                ' ' +
                i.applyToPointStringified(l[0][0], l[0][1])),
              (d += 'z')),
            d
          );
        },
        audioControllerFactory = (function () {
          function e(t) {
            (this.audios = []),
              (this.audioFactory = t),
              (this._volume = 1),
              (this._isMuted = !1);
          }
          return (
            (e.prototype = {
              addAudio: function (t) {
                this.audios.push(t);
              },
              pause: function () {
                var t,
                  r = this.audios.length;
                for (t = 0; t < r; t += 1) this.audios[t].pause();
              },
              resume: function () {
                var t,
                  r = this.audios.length;
                for (t = 0; t < r; t += 1) this.audios[t].resume();
              },
              setRate: function (t) {
                var r,
                  i = this.audios.length;
                for (r = 0; r < i; r += 1) this.audios[r].setRate(t);
              },
              createAudio: function (t) {
                return this.audioFactory
                  ? this.audioFactory(t)
                  : Howl
                  ? new Howl({ src: [t] })
                  : {
                      isPlaying: !1,
                      play: function () {
                        this.isPlaying = !0;
                      },
                      seek: function () {
                        this.isPlaying = !1;
                      },
                      playing: function () {},
                      rate: function () {},
                      setVolume: function () {},
                    };
              },
              setAudioFactory: function (t) {
                this.audioFactory = t;
              },
              setVolume: function (t) {
                (this._volume = t), this._updateVolume();
              },
              mute: function () {
                (this._isMuted = !0), this._updateVolume();
              },
              unmute: function () {
                (this._isMuted = !1), this._updateVolume();
              },
              getVolume: function () {
                return this._volume;
              },
              _updateVolume: function () {
                var t,
                  r = this.audios.length;
                for (t = 0; t < r; t += 1)
                  this.audios[t].volume(this._volume * (this._isMuted ? 0 : 1));
              },
            }),
            function () {
              return new e();
            }
          );
        })(),
        ImagePreloader = (function () {
          var e = (function () {
            var a = createTag('canvas');
            (a.width = 1), (a.height = 1);
            var o = a.getContext('2d');
            return (o.fillStyle = 'rgba(0,0,0,0)'), o.fillRect(0, 0, 1, 1), a;
          })();
          function t() {
            (this.loadedAssets += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null);
          }
          function r() {
            (this.loadedFootagesCount += 1),
              this.loadedAssets === this.totalImages &&
                this.loadedFootagesCount === this.totalFootages &&
                this.imagesLoadedCb &&
                this.imagesLoadedCb(null);
          }
          function i(a, o, h) {
            var f = '';
            if (a.e) f = a.p;
            else if (o) {
              var b = a.p;
              b.indexOf('images/') !== -1 && (b = b.split('/')[1]), (f = o + b);
            } else (f = h), (f += a.u ? a.u : ''), (f += a.p);
            return f;
          }
          function s(a) {
            var o = 0,
              h = setInterval(
                function () {
                  var f = a.getBBox();
                  (f.width || o > 500) &&
                    (this._imageLoaded(), clearInterval(h)),
                    (o += 1);
                }.bind(this),
                50
              );
          }
          function n(a) {
            var o = i(a, this.assetsPath, this.path),
              h = createNS('image');
            isSafari
              ? this.testImageLoaded(h)
              : h.addEventListener('load', this._imageLoaded, !1),
              h.addEventListener(
                'error',
                function () {
                  (f.img = e), this._imageLoaded();
                }.bind(this),
                !1
              ),
              h.setAttributeNS('http://www.w3.org/1999/xlink', 'href', o),
              this._elementHelper.append
                ? this._elementHelper.append(h)
                : this._elementHelper.appendChild(h);
            var f = { img: h, assetData: a };
            return f;
          }
          function l(a) {
            var o = i(a, this.assetsPath, this.path),
              h = createTag('img');
            (h.crossOrigin = 'anonymous'),
              h.addEventListener('load', this._imageLoaded, !1),
              h.addEventListener(
                'error',
                function () {
                  (f.img = e), this._imageLoaded();
                }.bind(this),
                !1
              ),
              (h.src = o);
            var f = { img: h, assetData: a };
            return f;
          }
          function u(a) {
            var o = { assetData: a },
              h = i(a, this.assetsPath, this.path);
            return (
              assetLoader.load(
                h,
                function (f) {
                  (o.img = f), this._footageLoaded();
                }.bind(this),
                function () {
                  (o.img = {}), this._footageLoaded();
                }.bind(this)
              ),
              o
            );
          }
          function d(a, o) {
            this.imagesLoadedCb = o;
            var h,
              f = a.length;
            for (h = 0; h < f; h += 1)
              a[h].layers ||
                (!a[h].t || a[h].t === 'seq'
                  ? ((this.totalImages += 1),
                    this.images.push(this._createImageData(a[h])))
                  : a[h].t === 3 &&
                    ((this.totalFootages += 1),
                    this.images.push(this.createFootageData(a[h]))));
          }
          function v(a) {
            this.path = a || '';
          }
          function E(a) {
            this.assetsPath = a || '';
          }
          function _(a) {
            for (var o = 0, h = this.images.length; o < h; ) {
              if (this.images[o].assetData === a) return this.images[o].img;
              o += 1;
            }
            return null;
          }
          function m() {
            (this.imagesLoadedCb = null), (this.images.length = 0);
          }
          function y() {
            return this.totalImages === this.loadedAssets;
          }
          function c() {
            return this.totalFootages === this.loadedFootagesCount;
          }
          function g(a, o) {
            a === 'svg'
              ? ((this._elementHelper = o),
                (this._createImageData = this.createImageData.bind(this)))
              : (this._createImageData = this.createImgData.bind(this));
          }
          function p() {
            (this._imageLoaded = t.bind(this)),
              (this._footageLoaded = r.bind(this)),
              (this.testImageLoaded = s.bind(this)),
              (this.createFootageData = u.bind(this)),
              (this.assetsPath = ''),
              (this.path = ''),
              (this.totalImages = 0),
              (this.totalFootages = 0),
              (this.loadedAssets = 0),
              (this.loadedFootagesCount = 0),
              (this.imagesLoadedCb = null),
              (this.images = []);
          }
          return (
            (p.prototype = {
              loadAssets: d,
              setAssetsPath: E,
              setPath: v,
              loadedImages: y,
              loadedFootages: c,
              destroy: m,
              getAsset: _,
              createImgData: l,
              createImageData: n,
              imageLoaded: t,
              footageLoaded: r,
              setCacheType: g,
            }),
            p
          );
        })(),
        featureSupport = (function () {
          var e = { maskType: !0 };
          return (
            (/MSIE 10/i.test(navigator.userAgent) ||
              /MSIE 9/i.test(navigator.userAgent) ||
              /rv:11.0/i.test(navigator.userAgent) ||
              /Edge\/\d./i.test(navigator.userAgent)) &&
              (e.maskType = !1),
            e
          );
        })(),
        filtersFactory = (function () {
          var e = {};
          (e.createFilter = t), (e.createAlphaToLuminanceFilter = r);
          function t(i, s) {
            var n = createNS('filter');
            return (
              n.setAttribute('id', i),
              s !== !0 &&
                (n.setAttribute('filterUnits', 'objectBoundingBox'),
                n.setAttribute('x', '0%'),
                n.setAttribute('y', '0%'),
                n.setAttribute('width', '100%'),
                n.setAttribute('height', '100%')),
              n
            );
          }
          function r() {
            var i = createNS('feColorMatrix');
            return (
              i.setAttribute('type', 'matrix'),
              i.setAttribute('color-interpolation-filters', 'sRGB'),
              i.setAttribute(
                'values',
                '0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1'
              ),
              i
            );
          }
          return e;
        })(),
        assetLoader = (function () {
          function e(r) {
            return r.response && typeof r.response == 'object'
              ? r.response
              : r.response && typeof r.response == 'string'
              ? JSON.parse(r.response)
              : r.responseText
              ? JSON.parse(r.responseText)
              : null;
          }
          function t(r, i, s) {
            var n,
              l = new XMLHttpRequest();
            try {
              l.responseType = 'json';
            } catch (u) {}
            (l.onreadystatechange = function () {
              if (l.readyState === 4)
                if (l.status === 200) (n = e(l)), i(n);
                else
                  try {
                    (n = e(l)), i(n);
                  } catch (u) {
                    s && s(u);
                  }
            }),
              l.open('GET', r, !0),
              l.send();
          }
          return { load: t };
        })();
      function TextAnimatorProperty(e, t, r) {
        (this._isFirstFrame = !0),
          (this._hasMaskedPath = !1),
          (this._frameId = -1),
          (this._textData = e),
          (this._renderType = t),
          (this._elem = r),
          (this._animatorsData = createSizedArray(this._textData.a.length)),
          (this._pathData = {}),
          (this._moreOptions = { alignment: {} }),
          (this.renderedLetters = []),
          (this.lettersChangedFlag = !1),
          this.initDynamicPropertyContainer(r);
      }
      (TextAnimatorProperty.prototype.searchProperties = function () {
        var e,
          t = this._textData.a.length,
          r,
          i = PropertyFactory.getProp;
        for (e = 0; e < t; e += 1)
          (r = this._textData.a[e]),
            (this._animatorsData[e] = new TextAnimatorDataProperty(
              this._elem,
              r,
              this
            ));
        this._textData.p && 'm' in this._textData.p
          ? ((this._pathData = {
              a: i(this._elem, this._textData.p.a, 0, 0, this),
              f: i(this._elem, this._textData.p.f, 0, 0, this),
              l: i(this._elem, this._textData.p.l, 0, 0, this),
              r: i(this._elem, this._textData.p.r, 0, 0, this),
              p: i(this._elem, this._textData.p.p, 0, 0, this),
              m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
            }),
            (this._hasMaskedPath = !0))
          : (this._hasMaskedPath = !1),
          (this._moreOptions.alignment = i(
            this._elem,
            this._textData.m.a,
            1,
            0,
            this
          ));
      }),
        (TextAnimatorProperty.prototype.getMeasures = function (e, t) {
          if (
            ((this.lettersChangedFlag = t),
            !(
              !this._mdf &&
              !this._isFirstFrame &&
              !t &&
              (!this._hasMaskedPath || !this._pathData.m._mdf)
            ))
          ) {
            this._isFirstFrame = !1;
            var r = this._moreOptions.alignment.v,
              i = this._animatorsData,
              s = this._textData,
              n = this.mHelper,
              l = this._renderType,
              u = this.renderedLetters.length,
              d,
              v,
              E,
              _,
              m = e.l,
              y,
              c,
              g,
              p,
              a,
              o,
              h,
              f,
              b,
              P,
              S,
              w,
              M,
              I,
              C;
            if (this._hasMaskedPath) {
              if (
                ((C = this._pathData.m),
                !this._pathData.n || this._pathData._mdf)
              ) {
                var R = C.v;
                this._pathData.r.v && (R = R.reverse()),
                  (y = { tLength: 0, segments: [] }),
                  (_ = R._length - 1);
                var V;
                for (w = 0, E = 0; E < _; E += 1)
                  (V = bez.buildBezierData(
                    R.v[E],
                    R.v[E + 1],
                    [R.o[E][0] - R.v[E][0], R.o[E][1] - R.v[E][1]],
                    [
                      R.i[E + 1][0] - R.v[E + 1][0],
                      R.i[E + 1][1] - R.v[E + 1][1],
                    ]
                  )),
                    (y.tLength += V.segmentLength),
                    y.segments.push(V),
                    (w += V.segmentLength);
                (E = _),
                  C.v.c &&
                    ((V = bez.buildBezierData(
                      R.v[E],
                      R.v[0],
                      [R.o[E][0] - R.v[E][0], R.o[E][1] - R.v[E][1]],
                      [R.i[0][0] - R.v[0][0], R.i[0][1] - R.v[0][1]]
                    )),
                    (y.tLength += V.segmentLength),
                    y.segments.push(V),
                    (w += V.segmentLength)),
                  (this._pathData.pi = y);
              }
              if (
                ((y = this._pathData.pi),
                (c = this._pathData.f.v),
                (h = 0),
                (o = 1),
                (p = 0),
                (a = !0),
                (P = y.segments),
                c < 0 && C.v.c)
              )
                for (
                  y.tLength < Math.abs(c) && (c = -Math.abs(c) % y.tLength),
                    h = P.length - 1,
                    b = P[h].points,
                    o = b.length - 1;
                  c < 0;

                )
                  (c += b[o].partialLength),
                    (o -= 1),
                    o < 0 && ((h -= 1), (b = P[h].points), (o = b.length - 1));
              (b = P[h].points),
                (f = b[o - 1]),
                (g = b[o]),
                (S = g.partialLength);
            }
            (_ = m.length), (d = 0), (v = 0);
            var O = e.finalSize * 1.2 * 0.714,
              D = !0,
              x,
              T,
              A,
              k,
              F;
            k = i.length;
            var L,
              G = -1,
              z,
              N,
              H,
              j = c,
              W = h,
              K = o,
              Z = -1,
              U,
              q,
              X,
              B,
              $,
              te,
              ne,
              re,
              ee = '',
              ie = this.defaultPropsArray,
              se;
            if (e.j === 2 || e.j === 1) {
              var Y = 0,
                ae = 0,
                oe = e.j === 2 ? -0.5 : -1,
                J = 0,
                le = !0;
              for (E = 0; E < _; E += 1)
                if (m[E].n) {
                  for (Y && (Y += ae); J < E; )
                    (m[J].animatorJustifyOffset = Y), (J += 1);
                  (Y = 0), (le = !0);
                } else {
                  for (A = 0; A < k; A += 1)
                    (x = i[A].a),
                      x.t.propType &&
                        (le && e.j === 2 && (ae += x.t.v * oe),
                        (T = i[A].s),
                        (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                        L.length
                          ? (Y += x.t.v * L[0] * oe)
                          : (Y += x.t.v * L * oe));
                  le = !1;
                }
              for (Y && (Y += ae); J < E; )
                (m[J].animatorJustifyOffset = Y), (J += 1);
            }
            for (E = 0; E < _; E += 1) {
              if ((n.reset(), (U = 1), m[E].n))
                (d = 0),
                  (v += e.yOffset),
                  (v += D ? 1 : 0),
                  (c = j),
                  (D = !1),
                  this._hasMaskedPath &&
                    ((h = W),
                    (o = K),
                    (b = P[h].points),
                    (f = b[o - 1]),
                    (g = b[o]),
                    (S = g.partialLength),
                    (p = 0)),
                  (ee = ''),
                  (re = ''),
                  (te = ''),
                  (se = ''),
                  (ie = this.defaultPropsArray);
              else {
                if (this._hasMaskedPath) {
                  if (Z !== m[E].line) {
                    switch (e.j) {
                      case 1:
                        c += w - e.lineWidths[m[E].line];
                        break;
                      case 2:
                        c += (w - e.lineWidths[m[E].line]) / 2;
                        break;
                    }
                    Z = m[E].line;
                  }
                  G !== m[E].ind &&
                    (m[G] && (c += m[G].extra),
                    (c += m[E].an / 2),
                    (G = m[E].ind)),
                    (c += r[0] * m[E].an * 0.005);
                  var Q = 0;
                  for (A = 0; A < k; A += 1)
                    (x = i[A].a),
                      x.p.propType &&
                        ((T = i[A].s),
                        (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                        L.length
                          ? (Q += x.p.v[0] * L[0])
                          : (Q += x.p.v[0] * L)),
                      x.a.propType &&
                        ((T = i[A].s),
                        (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                        L.length
                          ? (Q += x.a.v[0] * L[0])
                          : (Q += x.a.v[0] * L));
                  for (
                    a = !0,
                      this._pathData.a.v &&
                        ((c =
                          m[0].an * 0.5 +
                          ((w -
                            this._pathData.f.v -
                            m[0].an * 0.5 -
                            m[m.length - 1].an * 0.5) *
                            G) /
                            (_ - 1)),
                        (c += this._pathData.f.v));
                    a;

                  )
                    p + S >= c + Q || !b
                      ? ((M = (c + Q - p) / g.partialLength),
                        (N = f.point[0] + (g.point[0] - f.point[0]) * M),
                        (H = f.point[1] + (g.point[1] - f.point[1]) * M),
                        n.translate(
                          -r[0] * m[E].an * 0.005,
                          -(r[1] * O) * 0.01
                        ),
                        (a = !1))
                      : b &&
                        ((p += g.partialLength),
                        (o += 1),
                        o >= b.length &&
                          ((o = 0),
                          (h += 1),
                          P[h]
                            ? (b = P[h].points)
                            : C.v.c
                            ? ((o = 0), (h = 0), (b = P[h].points))
                            : ((p -= g.partialLength), (b = null))),
                        b && ((f = g), (g = b[o]), (S = g.partialLength)));
                  (z = m[E].an / 2 - m[E].add), n.translate(-z, 0, 0);
                } else
                  (z = m[E].an / 2 - m[E].add),
                    n.translate(-z, 0, 0),
                    n.translate(-r[0] * m[E].an * 0.005, -r[1] * O * 0.01, 0);
                for (A = 0; A < k; A += 1)
                  (x = i[A].a),
                    x.t.propType &&
                      ((T = i[A].s),
                      (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                      (d !== 0 || e.j !== 0) &&
                        (this._hasMaskedPath
                          ? L.length
                            ? (c += x.t.v * L[0])
                            : (c += x.t.v * L)
                          : L.length
                          ? (d += x.t.v * L[0])
                          : (d += x.t.v * L)));
                for (
                  e.strokeWidthAnim && (X = e.sw || 0),
                    e.strokeColorAnim &&
                      (e.sc
                        ? (q = [e.sc[0], e.sc[1], e.sc[2]])
                        : (q = [0, 0, 0])),
                    e.fillColorAnim &&
                      e.fc &&
                      (B = [e.fc[0], e.fc[1], e.fc[2]]),
                    A = 0;
                  A < k;
                  A += 1
                )
                  (x = i[A].a),
                    x.a.propType &&
                      ((T = i[A].s),
                      (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                      L.length
                        ? n.translate(
                            -x.a.v[0] * L[0],
                            -x.a.v[1] * L[1],
                            x.a.v[2] * L[2]
                          )
                        : n.translate(
                            -x.a.v[0] * L,
                            -x.a.v[1] * L,
                            x.a.v[2] * L
                          ));
                for (A = 0; A < k; A += 1)
                  (x = i[A].a),
                    x.s.propType &&
                      ((T = i[A].s),
                      (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                      L.length
                        ? n.scale(
                            1 + (x.s.v[0] - 1) * L[0],
                            1 + (x.s.v[1] - 1) * L[1],
                            1
                          )
                        : n.scale(
                            1 + (x.s.v[0] - 1) * L,
                            1 + (x.s.v[1] - 1) * L,
                            1
                          ));
                for (A = 0; A < k; A += 1) {
                  if (
                    ((x = i[A].a),
                    (T = i[A].s),
                    (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                    x.sk.propType &&
                      (L.length
                        ? n.skewFromAxis(-x.sk.v * L[0], x.sa.v * L[1])
                        : n.skewFromAxis(-x.sk.v * L, x.sa.v * L)),
                    x.r.propType &&
                      (L.length
                        ? n.rotateZ(-x.r.v * L[2])
                        : n.rotateZ(-x.r.v * L)),
                    x.ry.propType &&
                      (L.length
                        ? n.rotateY(x.ry.v * L[1])
                        : n.rotateY(x.ry.v * L)),
                    x.rx.propType &&
                      (L.length
                        ? n.rotateX(x.rx.v * L[0])
                        : n.rotateX(x.rx.v * L)),
                    x.o.propType &&
                      (L.length
                        ? (U += (x.o.v * L[0] - U) * L[0])
                        : (U += (x.o.v * L - U) * L)),
                    e.strokeWidthAnim &&
                      x.sw.propType &&
                      (L.length ? (X += x.sw.v * L[0]) : (X += x.sw.v * L)),
                    e.strokeColorAnim && x.sc.propType)
                  )
                    for ($ = 0; $ < 3; $ += 1)
                      L.length
                        ? (q[$] += (x.sc.v[$] - q[$]) * L[0])
                        : (q[$] += (x.sc.v[$] - q[$]) * L);
                  if (e.fillColorAnim && e.fc) {
                    if (x.fc.propType)
                      for ($ = 0; $ < 3; $ += 1)
                        L.length
                          ? (B[$] += (x.fc.v[$] - B[$]) * L[0])
                          : (B[$] += (x.fc.v[$] - B[$]) * L);
                    x.fh.propType &&
                      (L.length
                        ? (B = addHueToRGB(B, x.fh.v * L[0]))
                        : (B = addHueToRGB(B, x.fh.v * L))),
                      x.fs.propType &&
                        (L.length
                          ? (B = addSaturationToRGB(B, x.fs.v * L[0]))
                          : (B = addSaturationToRGB(B, x.fs.v * L))),
                      x.fb.propType &&
                        (L.length
                          ? (B = addBrightnessToRGB(B, x.fb.v * L[0]))
                          : (B = addBrightnessToRGB(B, x.fb.v * L)));
                  }
                }
                for (A = 0; A < k; A += 1)
                  (x = i[A].a),
                    x.p.propType &&
                      ((T = i[A].s),
                      (L = T.getMult(m[E].anIndexes[A], s.a[A].s.totalChars)),
                      this._hasMaskedPath
                        ? L.length
                          ? n.translate(0, x.p.v[1] * L[0], -x.p.v[2] * L[1])
                          : n.translate(0, x.p.v[1] * L, -x.p.v[2] * L)
                        : L.length
                        ? n.translate(
                            x.p.v[0] * L[0],
                            x.p.v[1] * L[1],
                            -x.p.v[2] * L[2]
                          )
                        : n.translate(
                            x.p.v[0] * L,
                            x.p.v[1] * L,
                            -x.p.v[2] * L
                          ));
                if (
                  (e.strokeWidthAnim && (te = X < 0 ? 0 : X),
                  e.strokeColorAnim &&
                    (ne =
                      'rgb(' +
                      Math.round(q[0] * 255) +
                      ',' +
                      Math.round(q[1] * 255) +
                      ',' +
                      Math.round(q[2] * 255) +
                      ')'),
                  e.fillColorAnim &&
                    e.fc &&
                    (re =
                      'rgb(' +
                      Math.round(B[0] * 255) +
                      ',' +
                      Math.round(B[1] * 255) +
                      ',' +
                      Math.round(B[2] * 255) +
                      ')'),
                  this._hasMaskedPath)
                ) {
                  if (
                    (n.translate(0, -e.ls),
                    n.translate(0, r[1] * O * 0.01 + v, 0),
                    this._pathData.p.v)
                  ) {
                    I = (g.point[1] - f.point[1]) / (g.point[0] - f.point[0]);
                    var he = (Math.atan(I) * 180) / Math.PI;
                    g.point[0] < f.point[0] && (he += 180),
                      n.rotate((-he * Math.PI) / 180);
                  }
                  n.translate(N, H, 0),
                    (c -= r[0] * m[E].an * 0.005),
                    m[E + 1] &&
                      G !== m[E + 1].ind &&
                      ((c += m[E].an / 2), (c += e.tr * 0.001 * e.finalSize));
                } else {
                  switch (
                    (n.translate(d, v, 0),
                    e.ps && n.translate(e.ps[0], e.ps[1] + e.ascent, 0),
                    e.j)
                  ) {
                    case 1:
                      n.translate(
                        m[E].animatorJustifyOffset +
                          e.justifyOffset +
                          (e.boxWidth - e.lineWidths[m[E].line]),
                        0,
                        0
                      );
                      break;
                    case 2:
                      n.translate(
                        m[E].animatorJustifyOffset +
                          e.justifyOffset +
                          (e.boxWidth - e.lineWidths[m[E].line]) / 2,
                        0,
                        0
                      );
                      break;
                  }
                  n.translate(0, -e.ls),
                    n.translate(z, 0, 0),
                    n.translate(r[0] * m[E].an * 0.005, r[1] * O * 0.01, 0),
                    (d += m[E].l + e.tr * 0.001 * e.finalSize);
                }
                l === 'html'
                  ? (ee = n.toCSS())
                  : l === 'svg'
                  ? (ee = n.to2dCSS())
                  : (ie = [
                      n.props[0],
                      n.props[1],
                      n.props[2],
                      n.props[3],
                      n.props[4],
                      n.props[5],
                      n.props[6],
                      n.props[7],
                      n.props[8],
                      n.props[9],
                      n.props[10],
                      n.props[11],
                      n.props[12],
                      n.props[13],
                      n.props[14],
                      n.props[15],
                    ]),
                  (se = U);
              }
              u <= E
                ? ((F = new LetterProps(se, te, ne, re, ee, ie)),
                  this.renderedLetters.push(F),
                  (u += 1),
                  (this.lettersChangedFlag = !0))
                : ((F = this.renderedLetters[E]),
                  (this.lettersChangedFlag =
                    F.update(se, te, ne, re, ee, ie) ||
                    this.lettersChangedFlag));
            }
          }
        }),
        (TextAnimatorProperty.prototype.getValue = function () {
          this._elem.globalData.frameId !== this._frameId &&
            ((this._frameId = this._elem.globalData.frameId),
            this.iterateDynamicProperties());
        }),
        (TextAnimatorProperty.prototype.mHelper = new Matrix()),
        (TextAnimatorProperty.prototype.defaultPropsArray = []),
        extendPrototype([DynamicPropertyContainer], TextAnimatorProperty);
      function TextAnimatorDataProperty(e, t, r) {
        var i = { propType: !1 },
          s = PropertyFactory.getProp,
          n = t.a;
        (this.a = {
          r: n.r ? s(e, n.r, 0, degToRads, r) : i,
          rx: n.rx ? s(e, n.rx, 0, degToRads, r) : i,
          ry: n.ry ? s(e, n.ry, 0, degToRads, r) : i,
          sk: n.sk ? s(e, n.sk, 0, degToRads, r) : i,
          sa: n.sa ? s(e, n.sa, 0, degToRads, r) : i,
          s: n.s ? s(e, n.s, 1, 0.01, r) : i,
          a: n.a ? s(e, n.a, 1, 0, r) : i,
          o: n.o ? s(e, n.o, 0, 0.01, r) : i,
          p: n.p ? s(e, n.p, 1, 0, r) : i,
          sw: n.sw ? s(e, n.sw, 0, 0, r) : i,
          sc: n.sc ? s(e, n.sc, 1, 0, r) : i,
          fc: n.fc ? s(e, n.fc, 1, 0, r) : i,
          fh: n.fh ? s(e, n.fh, 0, 0, r) : i,
          fs: n.fs ? s(e, n.fs, 0, 0.01, r) : i,
          fb: n.fb ? s(e, n.fb, 0, 0.01, r) : i,
          t: n.t ? s(e, n.t, 0, 0, r) : i,
        }),
          (this.s = TextSelectorProp.getTextSelectorProp(e, t.s, r)),
          (this.s.t = t.s.t);
      }
      function LetterProps(e, t, r, i, s, n) {
        (this.o = e),
          (this.sw = t),
          (this.sc = r),
          (this.fc = i),
          (this.m = s),
          (this.p = n),
          (this._mdf = { o: !0, sw: !!t, sc: !!r, fc: !!i, m: !0, p: !0 });
      }
      LetterProps.prototype.update = function (e, t, r, i, s, n) {
        (this._mdf.o = !1),
          (this._mdf.sw = !1),
          (this._mdf.sc = !1),
          (this._mdf.fc = !1),
          (this._mdf.m = !1),
          (this._mdf.p = !1);
        var l = !1;
        return (
          this.o !== e && ((this.o = e), (this._mdf.o = !0), (l = !0)),
          this.sw !== t && ((this.sw = t), (this._mdf.sw = !0), (l = !0)),
          this.sc !== r && ((this.sc = r), (this._mdf.sc = !0), (l = !0)),
          this.fc !== i && ((this.fc = i), (this._mdf.fc = !0), (l = !0)),
          this.m !== s && ((this.m = s), (this._mdf.m = !0), (l = !0)),
          n.length &&
            (this.p[0] !== n[0] ||
              this.p[1] !== n[1] ||
              this.p[4] !== n[4] ||
              this.p[5] !== n[5] ||
              this.p[12] !== n[12] ||
              this.p[13] !== n[13]) &&
            ((this.p = n), (this._mdf.p = !0), (l = !0)),
          l
        );
      };
      function TextProperty(e, t) {
        (this._frameId = initialDefaultFrame),
          (this.pv = ''),
          (this.v = ''),
          (this.kf = !1),
          (this._isFirstFrame = !0),
          (this._mdf = !1),
          (this.data = t),
          (this.elem = e),
          (this.comp = this.elem.comp),
          (this.keysIndex = 0),
          (this.canResize = !1),
          (this.minimumFontSize = 1),
          (this.effectsSequence = []),
          (this.currentData = {
            ascent: 0,
            boxWidth: this.defaultBoxWidth,
            f: '',
            fStyle: '',
            fWeight: '',
            fc: '',
            j: '',
            justifyOffset: '',
            l: [],
            lh: 0,
            lineWidths: [],
            ls: '',
            of: '',
            s: '',
            sc: '',
            sw: 0,
            t: 0,
            tr: 0,
            sz: 0,
            ps: null,
            fillColorAnim: !1,
            strokeColorAnim: !1,
            strokeWidthAnim: !1,
            yOffset: 0,
            finalSize: 0,
            finalText: [],
            finalLineHeight: 0,
            __complete: !1,
          }),
          this.copyData(this.currentData, this.data.d.k[0].s),
          this.searchProperty() || this.completeTextData(this.currentData);
      }
      (TextProperty.prototype.defaultBoxWidth = [0, 0]),
        (TextProperty.prototype.copyData = function (e, t) {
          for (var r in t)
            Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
          return e;
        }),
        (TextProperty.prototype.setCurrentData = function (e) {
          e.__complete || this.completeTextData(e),
            (this.currentData = e),
            (this.currentData.boxWidth =
              this.currentData.boxWidth || this.defaultBoxWidth),
            (this._mdf = !0);
        }),
        (TextProperty.prototype.searchProperty = function () {
          return this.searchKeyframes();
        }),
        (TextProperty.prototype.searchKeyframes = function () {
          return (
            (this.kf = this.data.d.k.length > 1),
            this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
            this.kf
          );
        }),
        (TextProperty.prototype.addEffect = function (e) {
          this.effectsSequence.push(e), this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.getValue = function (e) {
          if (
            !(
              (this.elem.globalData.frameId === this.frameId ||
                !this.effectsSequence.length) &&
              !e
            )
          ) {
            this.currentData.t = this.data.d.k[this.keysIndex].s.t;
            var t = this.currentData,
              r = this.keysIndex;
            if (this.lock) {
              this.setCurrentData(this.currentData);
              return;
            }
            (this.lock = !0), (this._mdf = !1);
            var i,
              s = this.effectsSequence.length,
              n = e || this.data.d.k[this.keysIndex].s;
            for (i = 0; i < s; i += 1)
              r !== this.keysIndex
                ? (n = this.effectsSequence[i](n, n.t))
                : (n = this.effectsSequence[i](this.currentData, n.t));
            t !== n && this.setCurrentData(n),
              (this.v = this.currentData),
              (this.pv = this.v),
              (this.lock = !1),
              (this.frameId = this.elem.globalData.frameId);
          }
        }),
        (TextProperty.prototype.getKeyframeValue = function () {
          for (
            var e = this.data.d.k,
              t = this.elem.comp.renderedFrame,
              r = 0,
              i = e.length;
            r <= i - 1 && !(r === i - 1 || e[r + 1].t > t);

          )
            r += 1;
          return (
            this.keysIndex !== r && (this.keysIndex = r),
            this.data.d.k[this.keysIndex].s
          );
        }),
        (TextProperty.prototype.buildFinalText = function (e) {
          for (var t = [], r = 0, i = e.length, s, n, l = !1; r < i; )
            (s = e.charCodeAt(r)),
              FontManager.isCombinedCharacter(s)
                ? (t[t.length - 1] += e.charAt(r))
                : s >= 55296 && s <= 56319
                ? ((n = e.charCodeAt(r + 1)),
                  n >= 56320 && n <= 57343
                    ? (l || FontManager.isModifier(s, n)
                        ? ((t[t.length - 1] += e.substr(r, 2)), (l = !1))
                        : t.push(e.substr(r, 2)),
                      (r += 1))
                    : t.push(e.charAt(r)))
                : s > 56319
                ? ((n = e.charCodeAt(r + 1)),
                  FontManager.isZeroWidthJoiner(s, n)
                    ? ((l = !0), (t[t.length - 1] += e.substr(r, 2)), (r += 1))
                    : t.push(e.charAt(r)))
                : FontManager.isZeroWidthJoiner(s)
                ? ((t[t.length - 1] += e.charAt(r)), (l = !0))
                : t.push(e.charAt(r)),
              (r += 1);
          return t;
        }),
        (TextProperty.prototype.completeTextData = function (e) {
          e.__complete = !0;
          var t = this.elem.globalData.fontManager,
            r = this.data,
            i = [],
            s,
            n,
            l,
            u = 0,
            d,
            v = r.m.g,
            E = 0,
            _ = 0,
            m = 0,
            y = [],
            c = 0,
            g = 0,
            p,
            a,
            o = t.getFontByName(e.f),
            h,
            f = 0,
            b = getFontProperties(o);
          (e.fWeight = b.weight),
            (e.fStyle = b.style),
            (e.finalSize = e.s),
            (e.finalText = this.buildFinalText(e.t)),
            (n = e.finalText.length),
            (e.finalLineHeight = e.lh);
          var P = (e.tr / 1e3) * e.finalSize,
            S;
          if (e.sz)
            for (var w = !0, M = e.sz[0], I = e.sz[1], C, R; w; ) {
              (R = this.buildFinalText(e.t)),
                (C = 0),
                (c = 0),
                (n = R.length),
                (P = (e.tr / 1e3) * e.finalSize);
              var V = -1;
              for (s = 0; s < n; s += 1)
                (S = R[s].charCodeAt(0)),
                  (l = !1),
                  R[s] === ' '
                    ? (V = s)
                    : (S === 13 || S === 3) &&
                      ((c = 0),
                      (l = !0),
                      (C += e.finalLineHeight || e.finalSize * 1.2)),
                  t.chars
                    ? ((h = t.getCharData(R[s], o.fStyle, o.fFamily)),
                      (f = l ? 0 : (h.w * e.finalSize) / 100))
                    : (f = t.measureText(R[s], e.f, e.finalSize)),
                  c + f > M && R[s] !== ' '
                    ? (V === -1 ? (n += 1) : (s = V),
                      (C += e.finalLineHeight || e.finalSize * 1.2),
                      R.splice(s, V === s ? 1 : 0, '\r'),
                      (V = -1),
                      (c = 0))
                    : ((c += f), (c += P));
              (C += (o.ascent * e.finalSize) / 100),
                this.canResize && e.finalSize > this.minimumFontSize && I < C
                  ? ((e.finalSize -= 1),
                    (e.finalLineHeight = (e.finalSize * e.lh) / e.s))
                  : ((e.finalText = R), (n = e.finalText.length), (w = !1));
            }
          (c = -P), (f = 0);
          var O = 0,
            D;
          for (s = 0; s < n; s += 1)
            if (
              ((l = !1),
              (D = e.finalText[s]),
              (S = D.charCodeAt(0)),
              S === 13 || S === 3
                ? ((O = 0),
                  y.push(c),
                  (g = c > g ? c : g),
                  (c = -2 * P),
                  (d = ''),
                  (l = !0),
                  (m += 1))
                : (d = D),
              t.chars
                ? ((h = t.getCharData(
                    D,
                    o.fStyle,
                    t.getFontByName(e.f).fFamily
                  )),
                  (f = l ? 0 : (h.w * e.finalSize) / 100))
                : (f = t.measureText(d, e.f, e.finalSize)),
              D === ' ' ? (O += f + P) : ((c += f + P + O), (O = 0)),
              i.push({
                l: f,
                an: f,
                add: E,
                n: l,
                anIndexes: [],
                val: d,
                line: m,
                animatorJustifyOffset: 0,
              }),
              v == 2)
            ) {
              if (((E += f), d === '' || d === ' ' || s === n - 1)) {
                for ((d === '' || d === ' ') && (E -= f); _ <= s; )
                  (i[_].an = E), (i[_].ind = u), (i[_].extra = f), (_ += 1);
                (u += 1), (E = 0);
              }
            } else if (v == 3) {
              if (((E += f), d === '' || s === n - 1)) {
                for (d === '' && (E -= f); _ <= s; )
                  (i[_].an = E), (i[_].ind = u), (i[_].extra = f), (_ += 1);
                (E = 0), (u += 1);
              }
            } else (i[u].ind = u), (i[u].extra = 0), (u += 1);
          if (((e.l = i), (g = c > g ? c : g), y.push(c), e.sz))
            (e.boxWidth = e.sz[0]), (e.justifyOffset = 0);
          else
            switch (((e.boxWidth = g), e.j)) {
              case 1:
                e.justifyOffset = -e.boxWidth;
                break;
              case 2:
                e.justifyOffset = -e.boxWidth / 2;
                break;
              default:
                e.justifyOffset = 0;
            }
          e.lineWidths = y;
          var x = r.a,
            T,
            A;
          a = x.length;
          var k,
            F,
            L = [];
          for (p = 0; p < a; p += 1) {
            for (
              T = x[p],
                T.a.sc && (e.strokeColorAnim = !0),
                T.a.sw && (e.strokeWidthAnim = !0),
                (T.a.fc || T.a.fh || T.a.fs || T.a.fb) &&
                  (e.fillColorAnim = !0),
                F = 0,
                k = T.s.b,
                s = 0;
              s < n;
              s += 1
            )
              (A = i[s]),
                (A.anIndexes[p] = F),
                ((k == 1 && A.val !== '') ||
                  (k == 2 && A.val !== '' && A.val !== ' ') ||
                  (k == 3 && (A.n || A.val == ' ' || s == n - 1)) ||
                  (k == 4 && (A.n || s == n - 1))) &&
                  (T.s.rn === 1 && L.push(F), (F += 1));
            r.a[p].s.totalChars = F;
            var G = -1,
              z;
            if (T.s.rn === 1)
              for (s = 0; s < n; s += 1)
                (A = i[s]),
                  G != A.anIndexes[p] &&
                    ((G = A.anIndexes[p]),
                    (z = L.splice(Math.floor(Math.random() * L.length), 1)[0])),
                  (A.anIndexes[p] = z);
          }
          (e.yOffset = e.finalLineHeight || e.finalSize * 1.2),
            (e.ls = e.ls || 0),
            (e.ascent = (o.ascent * e.finalSize) / 100);
        }),
        (TextProperty.prototype.updateDocumentData = function (e, t) {
          t = t === void 0 ? this.keysIndex : t;
          var r = this.copyData({}, this.data.d.k[t].s);
          (r = this.copyData(r, e)),
            (this.data.d.k[t].s = r),
            this.recalculate(t),
            this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.recalculate = function (e) {
          var t = this.data.d.k[e].s;
          (t.__complete = !1),
            (this.keysIndex = 0),
            (this._isFirstFrame = !0),
            this.getValue(t);
        }),
        (TextProperty.prototype.canResizeFont = function (e) {
          (this.canResize = e),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this);
        }),
        (TextProperty.prototype.setMinimumFontSize = function (e) {
          (this.minimumFontSize = Math.floor(e) || 1),
            this.recalculate(this.keysIndex),
            this.elem.addDynamicProperty(this);
        });
      var TextSelectorProp = (function () {
          var e = Math.max,
            t = Math.min,
            r = Math.floor;
          function i(n, l) {
            (this._currentTextLength = -1),
              (this.k = !1),
              (this.data = l),
              (this.elem = n),
              (this.comp = n.comp),
              (this.finalS = 0),
              (this.finalE = 0),
              this.initDynamicPropertyContainer(n),
              (this.s = PropertyFactory.getProp(
                n,
                l.s || { k: 0 },
                0,
                0,
                this
              )),
              'e' in l
                ? (this.e = PropertyFactory.getProp(n, l.e, 0, 0, this))
                : (this.e = { v: 100 }),
              (this.o = PropertyFactory.getProp(
                n,
                l.o || { k: 0 },
                0,
                0,
                this
              )),
              (this.xe = PropertyFactory.getProp(
                n,
                l.xe || { k: 0 },
                0,
                0,
                this
              )),
              (this.ne = PropertyFactory.getProp(
                n,
                l.ne || { k: 0 },
                0,
                0,
                this
              )),
              (this.sm = PropertyFactory.getProp(
                n,
                l.sm || { k: 100 },
                0,
                0,
                this
              )),
              (this.a = PropertyFactory.getProp(n, l.a, 0, 0.01, this)),
              this.dynamicProperties.length || this.getValue();
          }
          (i.prototype = {
            getMult: function (n) {
              this._currentTextLength !==
                this.elem.textProperty.currentData.l.length && this.getValue();
              var l = 0,
                u = 0,
                d = 1,
                v = 1;
              this.ne.v > 0 ? (l = this.ne.v / 100) : (u = -this.ne.v / 100),
                this.xe.v > 0
                  ? (d = 1 - this.xe.v / 100)
                  : (v = 1 + this.xe.v / 100);
              var E = BezierFactory.getBezierEasing(l, u, d, v).get,
                _ = 0,
                m = this.finalS,
                y = this.finalE,
                c = this.data.sh;
              if (c === 2)
                y === m
                  ? (_ = n >= y ? 1 : 0)
                  : (_ = e(0, t(0.5 / (y - m) + (n - m) / (y - m), 1))),
                  (_ = E(_));
              else if (c === 3)
                y === m
                  ? (_ = n >= y ? 0 : 1)
                  : (_ = 1 - e(0, t(0.5 / (y - m) + (n - m) / (y - m), 1))),
                  (_ = E(_));
              else if (c === 4)
                y === m
                  ? (_ = 0)
                  : ((_ = e(0, t(0.5 / (y - m) + (n - m) / (y - m), 1))),
                    _ < 0.5 ? (_ *= 2) : (_ = 1 - 2 * (_ - 0.5))),
                  (_ = E(_));
              else if (c === 5) {
                if (y === m) _ = 0;
                else {
                  var g = y - m;
                  n = t(e(0, n + 0.5 - m), y - m);
                  var p = -g / 2 + n,
                    a = g / 2;
                  _ = Math.sqrt(1 - (p * p) / (a * a));
                }
                _ = E(_);
              } else
                c === 6
                  ? (y === m
                      ? (_ = 0)
                      : ((n = t(e(0, n + 0.5 - m), y - m)),
                        (_ =
                          (1 +
                            Math.cos(Math.PI + (Math.PI * 2 * n) / (y - m))) /
                          2)),
                    (_ = E(_)))
                  : (n >= r(m) &&
                      (n - m < 0
                        ? (_ = e(0, t(t(y, 1) - (m - n), 1)))
                        : (_ = e(0, t(y - n, 1)))),
                    (_ = E(_)));
              if (this.sm.v !== 100) {
                var o = this.sm.v * 0.01;
                o === 0 && (o = 1e-8);
                var h = 0.5 - o * 0.5;
                _ < h ? (_ = 0) : ((_ = (_ - h) / o), _ > 1 && (_ = 1));
              }
              return _ * this.a.v;
            },
            getValue: function (n) {
              this.iterateDynamicProperties(),
                (this._mdf = n || this._mdf),
                (this._currentTextLength =
                  this.elem.textProperty.currentData.l.length || 0),
                n && this.data.r === 2 && (this.e.v = this._currentTextLength);
              var l = this.data.r === 2 ? 1 : 100 / this.data.totalChars,
                u = this.o.v / l,
                d = this.s.v / l + u,
                v = this.e.v / l + u;
              if (d > v) {
                var E = d;
                (d = v), (v = E);
              }
              (this.finalS = d), (this.finalE = v);
            },
          }),
            extendPrototype([DynamicPropertyContainer], i);
          function s(n, l, u) {
            return new i(n, l, u);
          }
          return { getTextSelectorProp: s };
        })(),
        poolFactory = (function () {
          return function (e, t, r) {
            var i = 0,
              s = e,
              n = createSizedArray(s),
              l = { newElement: u, release: d };
            function u() {
              var v;
              return i ? ((i -= 1), (v = n[i])) : (v = t()), v;
            }
            function d(v) {
              i === s && ((n = pooling.double(n)), (s *= 2)),
                r && r(v),
                (n[i] = v),
                (i += 1);
            }
            return l;
          };
        })(),
        pooling = (function () {
          function e(t) {
            return t.concat(createSizedArray(t.length));
          }
          return { double: e };
        })(),
        pointPool = (function () {
          function e() {
            return createTypedArray('float32', 2);
          }
          return poolFactory(8, e);
        })(),
        shapePool = (function () {
          function e() {
            return new ShapePath();
          }
          function t(s) {
            var n = s._length,
              l;
            for (l = 0; l < n; l += 1)
              pointPool.release(s.v[l]),
                pointPool.release(s.i[l]),
                pointPool.release(s.o[l]),
                (s.v[l] = null),
                (s.i[l] = null),
                (s.o[l] = null);
            (s._length = 0), (s.c = !1);
          }
          function r(s) {
            var n = i.newElement(),
              l,
              u = s._length === void 0 ? s.v.length : s._length;
            for (n.setLength(u), n.c = s.c, l = 0; l < u; l += 1)
              n.setTripleAt(
                s.v[l][0],
                s.v[l][1],
                s.o[l][0],
                s.o[l][1],
                s.i[l][0],
                s.i[l][1],
                l
              );
            return n;
          }
          var i = poolFactory(4, e, t);
          return (i.clone = r), i;
        })(),
        shapeCollectionPool = (function () {
          var e = { newShapeCollection: s, release: n },
            t = 0,
            r = 4,
            i = createSizedArray(r);
          function s() {
            var l;
            return t ? ((t -= 1), (l = i[t])) : (l = new ShapeCollection()), l;
          }
          function n(l) {
            var u,
              d = l._length;
            for (u = 0; u < d; u += 1) shapePool.release(l.shapes[u]);
            (l._length = 0),
              t === r && ((i = pooling.double(i)), (r *= 2)),
              (i[t] = l),
              (t += 1);
          }
          return e;
        })(),
        segmentsLengthPool = (function () {
          function e() {
            return { lengths: [], totalLength: 0 };
          }
          function t(r) {
            var i,
              s = r.lengths.length;
            for (i = 0; i < s; i += 1) bezierLengthPool.release(r.lengths[i]);
            r.lengths.length = 0;
          }
          return poolFactory(8, e, t);
        })(),
        bezierLengthPool = (function () {
          function e() {
            return {
              addedLength: 0,
              percents: createTypedArray('float32', defaultCurveSegments),
              lengths: createTypedArray('float32', defaultCurveSegments),
            };
          }
          return poolFactory(8, e);
        })(),
        markerParser = (function () {
          function e(t) {
            for (
              var r = t.split(`\r
`),
                i = {},
                s,
                n = 0,
                l = 0;
              l < r.length;
              l += 1
            )
              (s = r[l].split(':')),
                s.length === 2 && ((i[s[0]] = s[1].trim()), (n += 1));
            if (n === 0) throw new Error();
            return i;
          }
          return function (t) {
            for (var r = [], i = 0; i < t.length; i += 1) {
              var s = t[i],
                n = { time: s.tm, duration: s.dr };
              try {
                n.payload = JSON.parse(t[i].cm);
              } catch (l) {
                try {
                  n.payload = e(t[i].cm);
                } catch (u) {
                  n.payload = { name: t[i] };
                }
              }
              r.push(n);
            }
            return r;
          };
        })();
      function BaseRenderer() {}
      (BaseRenderer.prototype.checkLayers = function (e) {
        var t,
          r = this.layers.length,
          i;
        for (this.completeLayers = !0, t = r - 1; t >= 0; t -= 1)
          this.elements[t] ||
            ((i = this.layers[t]),
            i.ip - i.st <= e - this.layers[t].st &&
              i.op - i.st > e - this.layers[t].st &&
              this.buildItem(t)),
            (this.completeLayers = this.elements[t] ? this.completeLayers : !1);
        this.checkPendingElements();
      }),
        (BaseRenderer.prototype.createItem = function (e) {
          switch (e.ty) {
            case 2:
              return this.createImage(e);
            case 0:
              return this.createComp(e);
            case 1:
              return this.createSolid(e);
            case 3:
              return this.createNull(e);
            case 4:
              return this.createShape(e);
            case 5:
              return this.createText(e);
            case 6:
              return this.createAudio(e);
            case 13:
              return this.createCamera(e);
            case 15:
              return this.createFootage(e);
            default:
              return this.createNull(e);
          }
        }),
        (BaseRenderer.prototype.createCamera = function () {
          throw new Error("You're using a 3d camera. Try the html renderer.");
        }),
        (BaseRenderer.prototype.createAudio = function (e) {
          return new AudioElement(e, this.globalData, this);
        }),
        (BaseRenderer.prototype.createFootage = function (e) {
          return new FootageElement(e, this.globalData, this);
        }),
        (BaseRenderer.prototype.buildAllItems = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1) this.buildItem(e);
          this.checkPendingElements();
        }),
        (BaseRenderer.prototype.includeLayers = function (e) {
          this.completeLayers = !1;
          var t,
            r = e.length,
            i,
            s = this.layers.length;
          for (t = 0; t < r; t += 1)
            for (i = 0; i < s; ) {
              if (this.layers[i].id === e[t].id) {
                this.layers[i] = e[t];
                break;
              }
              i += 1;
            }
        }),
        (BaseRenderer.prototype.setProjectInterface = function (e) {
          this.globalData.projectInterface = e;
        }),
        (BaseRenderer.prototype.initItems = function () {
          this.globalData.progressiveLoad || this.buildAllItems();
        }),
        (BaseRenderer.prototype.buildElementParenting = function (e, t, r) {
          for (
            var i = this.elements, s = this.layers, n = 0, l = s.length;
            n < l;

          )
            s[n].ind == t &&
              (!i[n] || i[n] === !0
                ? (this.buildItem(n), this.addPendingElement(e))
                : (r.push(i[n]),
                  i[n].setAsParent(),
                  s[n].parent !== void 0
                    ? this.buildElementParenting(e, s[n].parent, r)
                    : e.setHierarchy(r))),
              (n += 1);
        }),
        (BaseRenderer.prototype.addPendingElement = function (e) {
          this.pendingElements.push(e);
        }),
        (BaseRenderer.prototype.searchExtraCompositions = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1)
            if (e[t].xt) {
              var i = this.createComp(e[t]);
              i.initExpressions(),
                this.globalData.projectInterface.registerComposition(i);
            }
        }),
        (BaseRenderer.prototype.setupGlobalData = function (e, t) {
          (this.globalData.fontManager = new FontManager()),
            this.globalData.fontManager.addChars(e.chars),
            this.globalData.fontManager.addFonts(e.fonts, t),
            (this.globalData.getAssetData =
              this.animationItem.getAssetData.bind(this.animationItem)),
            (this.globalData.getAssetsPath =
              this.animationItem.getAssetsPath.bind(this.animationItem)),
            (this.globalData.imageLoader = this.animationItem.imagePreloader),
            (this.globalData.audioController =
              this.animationItem.audioController),
            (this.globalData.frameId = 0),
            (this.globalData.frameRate = e.fr),
            (this.globalData.nm = e.nm),
            (this.globalData.compSize = { w: e.w, h: e.h });
        });
      function SVGRenderer(e, t) {
        (this.animationItem = e),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.svgElement = createNS('svg'));
        var r = '';
        if (t && t.title) {
          var i = createNS('title'),
            s = createElementID();
          i.setAttribute('id', s),
            (i.textContent = t.title),
            this.svgElement.appendChild(i),
            (r += s);
        }
        if (t && t.description) {
          var n = createNS('desc'),
            l = createElementID();
          n.setAttribute('id', l),
            (n.textContent = t.description),
            this.svgElement.appendChild(n),
            (r += ' ' + l);
        }
        r && this.svgElement.setAttribute('aria-labelledby', r);
        var u = createNS('defs');
        this.svgElement.appendChild(u);
        var d = createNS('g');
        this.svgElement.appendChild(d),
          (this.layerElement = d),
          (this.renderConfig = {
            preserveAspectRatio:
              (t && t.preserveAspectRatio) || 'xMidYMid meet',
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
            progressiveLoad: (t && t.progressiveLoad) || !1,
            hideOnTransparent: !(t && t.hideOnTransparent === !1),
            viewBoxOnly: (t && t.viewBoxOnly) || !1,
            viewBoxSize: (t && t.viewBoxSize) || !1,
            className: (t && t.className) || '',
            id: (t && t.id) || '',
            focusable: t && t.focusable,
            filterSize: {
              width: (t && t.filterSize && t.filterSize.width) || '100%',
              height: (t && t.filterSize && t.filterSize.height) || '100%',
              x: (t && t.filterSize && t.filterSize.x) || '0%',
              y: (t && t.filterSize && t.filterSize.y) || '0%',
            },
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            defs: u,
            renderConfig: this.renderConfig,
          }),
          (this.elements = []),
          (this.pendingElements = []),
          (this.destroyed = !1),
          (this.rendererType = 'svg');
      }
      extendPrototype([BaseRenderer], SVGRenderer),
        (SVGRenderer.prototype.createNull = function (e) {
          return new NullElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.createShape = function (e) {
          return new SVGShapeElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.createText = function (e) {
          return new SVGTextLottieElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.createImage = function (e) {
          return new IImageElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.createComp = function (e) {
          return new SVGCompElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.createSolid = function (e) {
          return new ISolidElement(e, this.globalData, this);
        }),
        (SVGRenderer.prototype.configAnimation = function (e) {
          this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg'),
            this.renderConfig.viewBoxSize
              ? this.svgElement.setAttribute(
                  'viewBox',
                  this.renderConfig.viewBoxSize
                )
              : this.svgElement.setAttribute(
                  'viewBox',
                  '0 0 ' + e.w + ' ' + e.h
                ),
            this.renderConfig.viewBoxOnly ||
              (this.svgElement.setAttribute('width', e.w),
              this.svgElement.setAttribute('height', e.h),
              (this.svgElement.style.width = '100%'),
              (this.svgElement.style.height = '100%'),
              (this.svgElement.style.transform = 'translate3d(0,0,0)')),
            this.renderConfig.className &&
              this.svgElement.setAttribute(
                'class',
                this.renderConfig.className
              ),
            this.renderConfig.id &&
              this.svgElement.setAttribute('id', this.renderConfig.id),
            this.renderConfig.focusable !== void 0 &&
              this.svgElement.setAttribute(
                'focusable',
                this.renderConfig.focusable
              ),
            this.svgElement.setAttribute(
              'preserveAspectRatio',
              this.renderConfig.preserveAspectRatio
            ),
            this.animationItem.wrapper.appendChild(this.svgElement);
          var t = this.globalData.defs;
          this.setupGlobalData(e, t),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.data = e);
          var r = createNS('clipPath'),
            i = createNS('rect');
          i.setAttribute('width', e.w),
            i.setAttribute('height', e.h),
            i.setAttribute('x', 0),
            i.setAttribute('y', 0);
          var s = createElementID();
          r.setAttribute('id', s),
            r.appendChild(i),
            this.layerElement.setAttribute(
              'clip-path',
              'url(' + locationHref + '#' + s + ')'
            ),
            t.appendChild(r),
            (this.layers = e.layers),
            (this.elements = createSizedArray(e.layers.length));
        }),
        (SVGRenderer.prototype.destroy = function () {
          this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ''),
            (this.layerElement = null),
            (this.globalData.defs = null);
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = 0; e < t; e += 1)
            this.elements[e] && this.elements[e].destroy();
          (this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null);
        }),
        (SVGRenderer.prototype.updateContainerSize = function () {}),
        (SVGRenderer.prototype.buildItem = function (e) {
          var t = this.elements;
          if (!(t[e] || this.layers[e].ty === 99)) {
            t[e] = !0;
            var r = this.createItem(this.layers[e]);
            (t[e] = r),
              expressionsPlugin &&
                (this.layers[e].ty === 0 &&
                  this.globalData.projectInterface.registerComposition(r),
                r.initExpressions()),
              this.appendElementInPos(r, e),
              this.layers[e].tt &&
                (!this.elements[e - 1] || this.elements[e - 1] === !0
                  ? (this.buildItem(e - 1), this.addPendingElement(r))
                  : r.setMatte(t[e - 1].layerId));
          }
        }),
        (SVGRenderer.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            if ((e.checkParenting(), e.data.tt))
              for (var t = 0, r = this.elements.length; t < r; ) {
                if (this.elements[t] === e) {
                  e.setMatte(this.elements[t - 1].layerId);
                  break;
                }
                t += 1;
              }
          }
        }),
        (SVGRenderer.prototype.renderFrame = function (e) {
          if (!(this.renderedFrame === e || this.destroyed)) {
            e === null ? (e = this.renderedFrame) : (this.renderedFrame = e),
              (this.globalData.frameNum = e),
              (this.globalData.frameId += 1),
              (this.globalData.projectInterface.currentFrame = e),
              (this.globalData._mdf = !1);
            var t,
              r = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(e), t = r - 1;
              t >= 0;
              t -= 1
            )
              (this.completeLayers || this.elements[t]) &&
                this.elements[t].prepareFrame(e - this.layers[t].st);
            if (this.globalData._mdf)
              for (t = 0; t < r; t += 1)
                (this.completeLayers || this.elements[t]) &&
                  this.elements[t].renderFrame();
          }
        }),
        (SVGRenderer.prototype.appendElementInPos = function (e, t) {
          var r = e.getBaseElement();
          if (!!r) {
            for (var i = 0, s; i < t; )
              this.elements[i] &&
                this.elements[i] !== !0 &&
                this.elements[i].getBaseElement() &&
                (s = this.elements[i].getBaseElement()),
                (i += 1);
            s
              ? this.layerElement.insertBefore(r, s)
              : this.layerElement.appendChild(r);
          }
        }),
        (SVGRenderer.prototype.hide = function () {
          this.layerElement.style.display = 'none';
        }),
        (SVGRenderer.prototype.show = function () {
          this.layerElement.style.display = 'block';
        });
      function CanvasRenderer(e, t) {
        (this.animationItem = e),
          (this.renderConfig = {
            clearCanvas: t && t.clearCanvas !== void 0 ? t.clearCanvas : !0,
            context: (t && t.context) || null,
            progressiveLoad: (t && t.progressiveLoad) || !1,
            preserveAspectRatio:
              (t && t.preserveAspectRatio) || 'xMidYMid meet',
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
            className: (t && t.className) || '',
            id: (t && t.id) || '',
          }),
          (this.renderConfig.dpr = (t && t.dpr) || 1),
          this.animationItem.wrapper &&
            (this.renderConfig.dpr =
              (t && t.dpr) || window.devicePixelRatio || 1),
          (this.renderedFrame = -1),
          (this.globalData = {
            frameNum: -1,
            _mdf: !1,
            renderConfig: this.renderConfig,
            currentGlobalAlpha: -1,
          }),
          (this.contextData = new CVContextData()),
          (this.elements = []),
          (this.pendingElements = []),
          (this.transformMat = new Matrix()),
          (this.completeLayers = !1),
          (this.rendererType = 'canvas');
      }
      extendPrototype([BaseRenderer], CanvasRenderer),
        (CanvasRenderer.prototype.createShape = function (e) {
          return new CVShapeElement(e, this.globalData, this);
        }),
        (CanvasRenderer.prototype.createText = function (e) {
          return new CVTextElement(e, this.globalData, this);
        }),
        (CanvasRenderer.prototype.createImage = function (e) {
          return new CVImageElement(e, this.globalData, this);
        }),
        (CanvasRenderer.prototype.createComp = function (e) {
          return new CVCompElement(e, this.globalData, this);
        }),
        (CanvasRenderer.prototype.createSolid = function (e) {
          return new CVSolidElement(e, this.globalData, this);
        }),
        (CanvasRenderer.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (CanvasRenderer.prototype.ctxTransform = function (e) {
          if (
            !(
              e[0] === 1 &&
              e[1] === 0 &&
              e[4] === 0 &&
              e[5] === 1 &&
              e[12] === 0 &&
              e[13] === 0
            )
          ) {
            if (!this.renderConfig.clearCanvas) {
              this.canvasContext.transform(
                e[0],
                e[1],
                e[4],
                e[5],
                e[12],
                e[13]
              );
              return;
            }
            this.transformMat.cloneFromProps(e);
            var t = this.contextData.cTr.props;
            this.transformMat.transform(
              t[0],
              t[1],
              t[2],
              t[3],
              t[4],
              t[5],
              t[6],
              t[7],
              t[8],
              t[9],
              t[10],
              t[11],
              t[12],
              t[13],
              t[14],
              t[15]
            ),
              this.contextData.cTr.cloneFromProps(this.transformMat.props);
            var r = this.contextData.cTr.props;
            this.canvasContext.setTransform(
              r[0],
              r[1],
              r[4],
              r[5],
              r[12],
              r[13]
            );
          }
        }),
        (CanvasRenderer.prototype.ctxOpacity = function (e) {
          if (!this.renderConfig.clearCanvas) {
            (this.canvasContext.globalAlpha *= e < 0 ? 0 : e),
              (this.globalData.currentGlobalAlpha = this.contextData.cO);
            return;
          }
          (this.contextData.cO *= e < 0 ? 0 : e),
            this.globalData.currentGlobalAlpha !== this.contextData.cO &&
              ((this.canvasContext.globalAlpha = this.contextData.cO),
              (this.globalData.currentGlobalAlpha = this.contextData.cO));
        }),
        (CanvasRenderer.prototype.reset = function () {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          this.contextData.reset();
        }),
        (CanvasRenderer.prototype.save = function (e) {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.save();
            return;
          }
          e && this.canvasContext.save();
          var t = this.contextData.cTr.props;
          this.contextData._length <= this.contextData.cArrPos &&
            this.contextData.duplicate();
          var r,
            i = this.contextData.saved[this.contextData.cArrPos];
          for (r = 0; r < 16; r += 1) i[r] = t[r];
          (this.contextData.savedOp[this.contextData.cArrPos] =
            this.contextData.cO),
            (this.contextData.cArrPos += 1);
        }),
        (CanvasRenderer.prototype.restore = function (e) {
          if (!this.renderConfig.clearCanvas) {
            this.canvasContext.restore();
            return;
          }
          e &&
            (this.canvasContext.restore(),
            (this.globalData.blendMode = 'source-over')),
            (this.contextData.cArrPos -= 1);
          var t = this.contextData.saved[this.contextData.cArrPos],
            r,
            i = this.contextData.cTr.props;
          for (r = 0; r < 16; r += 1) i[r] = t[r];
          this.canvasContext.setTransform(t[0], t[1], t[4], t[5], t[12], t[13]),
            (t = this.contextData.savedOp[this.contextData.cArrPos]),
            (this.contextData.cO = t),
            this.globalData.currentGlobalAlpha !== t &&
              ((this.canvasContext.globalAlpha = t),
              (this.globalData.currentGlobalAlpha = t));
        }),
        (CanvasRenderer.prototype.configAnimation = function (e) {
          if (this.animationItem.wrapper) {
            this.animationItem.container = createTag('canvas');
            var t = this.animationItem.container.style;
            (t.width = '100%'), (t.height = '100%');
            var r = '0px 0px 0px';
            (t.transformOrigin = r),
              (t.mozTransformOrigin = r),
              (t.webkitTransformOrigin = r),
              (t['-webkit-transform'] = r),
              this.animationItem.wrapper.appendChild(
                this.animationItem.container
              ),
              (this.canvasContext =
                this.animationItem.container.getContext('2d')),
              this.renderConfig.className &&
                this.animationItem.container.setAttribute(
                  'class',
                  this.renderConfig.className
                ),
              this.renderConfig.id &&
                this.animationItem.container.setAttribute(
                  'id',
                  this.renderConfig.id
                );
          } else this.canvasContext = this.renderConfig.context;
          (this.data = e),
            (this.layers = e.layers),
            (this.transformCanvas = {
              w: e.w,
              h: e.h,
              sx: 0,
              sy: 0,
              tx: 0,
              ty: 0,
            }),
            this.setupGlobalData(e, document.body),
            (this.globalData.canvasContext = this.canvasContext),
            (this.globalData.renderer = this),
            (this.globalData.isDashed = !1),
            (this.globalData.progressiveLoad =
              this.renderConfig.progressiveLoad),
            (this.globalData.transformCanvas = this.transformCanvas),
            (this.elements = createSizedArray(e.layers.length)),
            this.updateContainerSize();
        }),
        (CanvasRenderer.prototype.updateContainerSize = function () {
          this.reset();
          var e, t;
          this.animationItem.wrapper && this.animationItem.container
            ? ((e = this.animationItem.wrapper.offsetWidth),
              (t = this.animationItem.wrapper.offsetHeight),
              this.animationItem.container.setAttribute(
                'width',
                e * this.renderConfig.dpr
              ),
              this.animationItem.container.setAttribute(
                'height',
                t * this.renderConfig.dpr
              ))
            : ((e = this.canvasContext.canvas.width * this.renderConfig.dpr),
              (t = this.canvasContext.canvas.height * this.renderConfig.dpr));
          var r, i;
          if (
            this.renderConfig.preserveAspectRatio.indexOf('meet') !== -1 ||
            this.renderConfig.preserveAspectRatio.indexOf('slice') !== -1
          ) {
            var s = this.renderConfig.preserveAspectRatio.split(' '),
              n = s[1] || 'meet',
              l = s[0] || 'xMidYMid',
              u = l.substr(0, 4),
              d = l.substr(4);
            (r = e / t),
              (i = this.transformCanvas.w / this.transformCanvas.h),
              (i > r && n === 'meet') || (i < r && n === 'slice')
                ? ((this.transformCanvas.sx =
                    e / (this.transformCanvas.w / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    e / (this.transformCanvas.w / this.renderConfig.dpr)))
                : ((this.transformCanvas.sx =
                    t / (this.transformCanvas.h / this.renderConfig.dpr)),
                  (this.transformCanvas.sy =
                    t / (this.transformCanvas.h / this.renderConfig.dpr))),
              u === 'xMid' &&
              ((i < r && n === 'meet') || (i > r && n === 'slice'))
                ? (this.transformCanvas.tx =
                    ((e -
                      this.transformCanvas.w * (t / this.transformCanvas.h)) /
                      2) *
                    this.renderConfig.dpr)
                : u === 'xMax' &&
                  ((i < r && n === 'meet') || (i > r && n === 'slice'))
                ? (this.transformCanvas.tx =
                    (e -
                      this.transformCanvas.w * (t / this.transformCanvas.h)) *
                    this.renderConfig.dpr)
                : (this.transformCanvas.tx = 0),
              d === 'YMid' &&
              ((i > r && n === 'meet') || (i < r && n === 'slice'))
                ? (this.transformCanvas.ty =
                    ((t -
                      this.transformCanvas.h * (e / this.transformCanvas.w)) /
                      2) *
                    this.renderConfig.dpr)
                : d === 'YMax' &&
                  ((i > r && n === 'meet') || (i < r && n === 'slice'))
                ? (this.transformCanvas.ty =
                    (t -
                      this.transformCanvas.h * (e / this.transformCanvas.w)) *
                    this.renderConfig.dpr)
                : (this.transformCanvas.ty = 0);
          } else
            this.renderConfig.preserveAspectRatio === 'none'
              ? ((this.transformCanvas.sx =
                  e / (this.transformCanvas.w / this.renderConfig.dpr)),
                (this.transformCanvas.sy =
                  t / (this.transformCanvas.h / this.renderConfig.dpr)),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0))
              : ((this.transformCanvas.sx = this.renderConfig.dpr),
                (this.transformCanvas.sy = this.renderConfig.dpr),
                (this.transformCanvas.tx = 0),
                (this.transformCanvas.ty = 0));
          (this.transformCanvas.props = [
            this.transformCanvas.sx,
            0,
            0,
            0,
            0,
            this.transformCanvas.sy,
            0,
            0,
            0,
            0,
            1,
            0,
            this.transformCanvas.tx,
            this.transformCanvas.ty,
            0,
            1,
          ]),
            this.ctxTransform(this.transformCanvas.props),
            this.canvasContext.beginPath(),
            this.canvasContext.rect(
              0,
              0,
              this.transformCanvas.w,
              this.transformCanvas.h
            ),
            this.canvasContext.closePath(),
            this.canvasContext.clip(),
            this.renderFrame(this.renderedFrame, !0);
        }),
        (CanvasRenderer.prototype.destroy = function () {
          this.renderConfig.clearCanvas &&
            this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = '');
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = t - 1; e >= 0; e -= 1)
            this.elements[e] && this.elements[e].destroy();
          (this.elements.length = 0),
            (this.globalData.canvasContext = null),
            (this.animationItem.container = null),
            (this.destroyed = !0);
        }),
        (CanvasRenderer.prototype.renderFrame = function (e, t) {
          if (
            !(
              (this.renderedFrame === e &&
                this.renderConfig.clearCanvas === !0 &&
                !t) ||
              this.destroyed ||
              e === -1
            )
          ) {
            (this.renderedFrame = e),
              (this.globalData.frameNum = e - this.animationItem._isFirstFrame),
              (this.globalData.frameId += 1),
              (this.globalData._mdf = !this.renderConfig.clearCanvas || t),
              (this.globalData.projectInterface.currentFrame = e);
            var r,
              i = this.layers.length;
            for (
              this.completeLayers || this.checkLayers(e), r = 0;
              r < i;
              r += 1
            )
              (this.completeLayers || this.elements[r]) &&
                this.elements[r].prepareFrame(e - this.layers[r].st);
            if (this.globalData._mdf) {
              for (
                this.renderConfig.clearCanvas === !0
                  ? this.canvasContext.clearRect(
                      0,
                      0,
                      this.transformCanvas.w,
                      this.transformCanvas.h
                    )
                  : this.save(),
                  r = i - 1;
                r >= 0;
                r -= 1
              )
                (this.completeLayers || this.elements[r]) &&
                  this.elements[r].renderFrame();
              this.renderConfig.clearCanvas !== !0 && this.restore();
            }
          }
        }),
        (CanvasRenderer.prototype.buildItem = function (e) {
          var t = this.elements;
          if (!(t[e] || this.layers[e].ty === 99)) {
            var r = this.createItem(this.layers[e], this, this.globalData);
            (t[e] = r), r.initExpressions();
          }
        }),
        (CanvasRenderer.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            e.checkParenting();
          }
        }),
        (CanvasRenderer.prototype.hide = function () {
          this.animationItem.container.style.display = 'none';
        }),
        (CanvasRenderer.prototype.show = function () {
          this.animationItem.container.style.display = 'block';
        });
      function HybridRenderer(e, t) {
        (this.animationItem = e),
          (this.layers = null),
          (this.renderedFrame = -1),
          (this.renderConfig = {
            className: (t && t.className) || '',
            imagePreserveAspectRatio:
              (t && t.imagePreserveAspectRatio) || 'xMidYMid slice',
            hideOnTransparent: !(t && t.hideOnTransparent === !1),
            filterSize: {
              width: (t && t.filterSize && t.filterSize.width) || '400%',
              height: (t && t.filterSize && t.filterSize.height) || '400%',
              x: (t && t.filterSize && t.filterSize.x) || '-100%',
              y: (t && t.filterSize && t.filterSize.y) || '-100%',
            },
          }),
          (this.globalData = {
            _mdf: !1,
            frameNum: -1,
            renderConfig: this.renderConfig,
          }),
          (this.pendingElements = []),
          (this.elements = []),
          (this.threeDElements = []),
          (this.destroyed = !1),
          (this.camera = null),
          (this.supports3d = !0),
          (this.rendererType = 'html');
      }
      extendPrototype([BaseRenderer], HybridRenderer),
        (HybridRenderer.prototype.buildItem = SVGRenderer.prototype.buildItem),
        (HybridRenderer.prototype.checkPendingElements = function () {
          for (; this.pendingElements.length; ) {
            var e = this.pendingElements.pop();
            e.checkParenting();
          }
        }),
        (HybridRenderer.prototype.appendElementInPos = function (e, t) {
          var r = e.getBaseElement();
          if (!!r) {
            var i = this.layers[t];
            if (!i.ddd || !this.supports3d)
              if (this.threeDElements) this.addTo3dContainer(r, t);
              else {
                for (var s = 0, n, l, u; s < t; )
                  this.elements[s] &&
                    this.elements[s] !== !0 &&
                    this.elements[s].getBaseElement &&
                    ((l = this.elements[s]),
                    (u = this.layers[s].ddd
                      ? this.getThreeDContainerByPos(s)
                      : l.getBaseElement()),
                    (n = u || n)),
                    (s += 1);
                n
                  ? (!i.ddd || !this.supports3d) &&
                    this.layerElement.insertBefore(r, n)
                  : (!i.ddd || !this.supports3d) &&
                    this.layerElement.appendChild(r);
              }
            else this.addTo3dContainer(r, t);
          }
        }),
        (HybridRenderer.prototype.createShape = function (e) {
          return this.supports3d
            ? new HShapeElement(e, this.globalData, this)
            : new SVGShapeElement(e, this.globalData, this);
        }),
        (HybridRenderer.prototype.createText = function (e) {
          return this.supports3d
            ? new HTextElement(e, this.globalData, this)
            : new SVGTextLottieElement(e, this.globalData, this);
        }),
        (HybridRenderer.prototype.createCamera = function (e) {
          return (
            (this.camera = new HCameraElement(e, this.globalData, this)),
            this.camera
          );
        }),
        (HybridRenderer.prototype.createImage = function (e) {
          return this.supports3d
            ? new HImageElement(e, this.globalData, this)
            : new IImageElement(e, this.globalData, this);
        }),
        (HybridRenderer.prototype.createComp = function (e) {
          return this.supports3d
            ? new HCompElement(e, this.globalData, this)
            : new SVGCompElement(e, this.globalData, this);
        }),
        (HybridRenderer.prototype.createSolid = function (e) {
          return this.supports3d
            ? new HSolidElement(e, this.globalData, this)
            : new ISolidElement(e, this.globalData, this);
        }),
        (HybridRenderer.prototype.createNull =
          SVGRenderer.prototype.createNull),
        (HybridRenderer.prototype.getThreeDContainerByPos = function (e) {
          for (var t = 0, r = this.threeDElements.length; t < r; ) {
            if (
              this.threeDElements[t].startPos <= e &&
              this.threeDElements[t].endPos >= e
            )
              return this.threeDElements[t].perspectiveElem;
            t += 1;
          }
          return null;
        }),
        (HybridRenderer.prototype.createThreeDContainer = function (e, t) {
          var r = createTag('div'),
            i,
            s;
          styleDiv(r);
          var n = createTag('div');
          if ((styleDiv(n), t === '3d')) {
            (i = r.style),
              (i.width = this.globalData.compSize.w + 'px'),
              (i.height = this.globalData.compSize.h + 'px');
            var l = '50% 50%';
            (i.webkitTransformOrigin = l),
              (i.mozTransformOrigin = l),
              (i.transformOrigin = l),
              (s = n.style);
            var u = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
            (s.transform = u), (s.webkitTransform = u);
          }
          r.appendChild(n);
          var d = {
            container: n,
            perspectiveElem: r,
            startPos: e,
            endPos: e,
            type: t,
          };
          return this.threeDElements.push(d), d;
        }),
        (HybridRenderer.prototype.build3dContainers = function () {
          var e,
            t = this.layers.length,
            r,
            i = '';
          for (e = 0; e < t; e += 1)
            this.layers[e].ddd && this.layers[e].ty !== 3
              ? (i !== '3d' &&
                  ((i = '3d'), (r = this.createThreeDContainer(e, '3d'))),
                (r.endPos = Math.max(r.endPos, e)))
              : (i !== '2d' &&
                  ((i = '2d'), (r = this.createThreeDContainer(e, '2d'))),
                (r.endPos = Math.max(r.endPos, e)));
          for (t = this.threeDElements.length, e = t - 1; e >= 0; e -= 1)
            this.resizerElem.appendChild(
              this.threeDElements[e].perspectiveElem
            );
        }),
        (HybridRenderer.prototype.addTo3dContainer = function (e, t) {
          for (var r = 0, i = this.threeDElements.length; r < i; ) {
            if (t <= this.threeDElements[r].endPos) {
              for (var s = this.threeDElements[r].startPos, n; s < t; )
                this.elements[s] &&
                  this.elements[s].getBaseElement &&
                  (n = this.elements[s].getBaseElement()),
                  (s += 1);
              n
                ? this.threeDElements[r].container.insertBefore(e, n)
                : this.threeDElements[r].container.appendChild(e);
              break;
            }
            r += 1;
          }
        }),
        (HybridRenderer.prototype.configAnimation = function (e) {
          var t = createTag('div'),
            r = this.animationItem.wrapper,
            i = t.style;
          (i.width = e.w + 'px'),
            (i.height = e.h + 'px'),
            (this.resizerElem = t),
            styleDiv(t),
            (i.transformStyle = 'flat'),
            (i.mozTransformStyle = 'flat'),
            (i.webkitTransformStyle = 'flat'),
            this.renderConfig.className &&
              t.setAttribute('class', this.renderConfig.className),
            r.appendChild(t),
            (i.overflow = 'hidden');
          var s = createNS('svg');
          s.setAttribute('width', '1'),
            s.setAttribute('height', '1'),
            styleDiv(s),
            this.resizerElem.appendChild(s);
          var n = createNS('defs');
          s.appendChild(n),
            (this.data = e),
            this.setupGlobalData(e, s),
            (this.globalData.defs = n),
            (this.layers = e.layers),
            (this.layerElement = this.resizerElem),
            this.build3dContainers(),
            this.updateContainerSize();
        }),
        (HybridRenderer.prototype.destroy = function () {
          this.animationItem.wrapper &&
            (this.animationItem.wrapper.innerText = ''),
            (this.animationItem.container = null),
            (this.globalData.defs = null);
          var e,
            t = this.layers ? this.layers.length : 0;
          for (e = 0; e < t; e += 1) this.elements[e].destroy();
          (this.elements.length = 0),
            (this.destroyed = !0),
            (this.animationItem = null);
        }),
        (HybridRenderer.prototype.updateContainerSize = function () {
          var e = this.animationItem.wrapper.offsetWidth,
            t = this.animationItem.wrapper.offsetHeight,
            r = e / t,
            i = this.globalData.compSize.w / this.globalData.compSize.h,
            s,
            n,
            l,
            u;
          i > r
            ? ((s = e / this.globalData.compSize.w),
              (n = e / this.globalData.compSize.w),
              (l = 0),
              (u =
                (t -
                  this.globalData.compSize.h *
                    (e / this.globalData.compSize.w)) /
                2))
            : ((s = t / this.globalData.compSize.h),
              (n = t / this.globalData.compSize.h),
              (l =
                (e -
                  this.globalData.compSize.w *
                    (t / this.globalData.compSize.h)) /
                2),
              (u = 0));
          var d = this.resizerElem.style;
          (d.webkitTransform =
            'matrix3d(' +
            s +
            ',0,0,0,0,' +
            n +
            ',0,0,0,0,1,0,' +
            l +
            ',' +
            u +
            ',0,1)'),
            (d.transform = d.webkitTransform);
        }),
        (HybridRenderer.prototype.renderFrame =
          SVGRenderer.prototype.renderFrame),
        (HybridRenderer.prototype.hide = function () {
          this.resizerElem.style.display = 'none';
        }),
        (HybridRenderer.prototype.show = function () {
          this.resizerElem.style.display = 'block';
        }),
        (HybridRenderer.prototype.initItems = function () {
          if ((this.buildAllItems(), this.camera)) this.camera.setup();
          else {
            var e = this.globalData.compSize.w,
              t = this.globalData.compSize.h,
              r,
              i = this.threeDElements.length;
            for (r = 0; r < i; r += 1) {
              var s = this.threeDElements[r].perspectiveElem.style;
              (s.webkitPerspective =
                Math.sqrt(Math.pow(e, 2) + Math.pow(t, 2)) + 'px'),
                (s.perspective = s.webkitPerspective);
            }
          }
        }),
        (HybridRenderer.prototype.searchExtraCompositions = function (e) {
          var t,
            r = e.length,
            i = createTag('div');
          for (t = 0; t < r; t += 1)
            if (e[t].xt) {
              var s = this.createComp(e[t], i, this.globalData.comp, null);
              s.initExpressions(),
                this.globalData.projectInterface.registerComposition(s);
            }
        });
      function MaskElement(e, t, r) {
        (this.data = e),
          (this.element = t),
          (this.globalData = r),
          (this.storedData = []),
          (this.masksProperties = this.data.masksProperties || []),
          (this.maskElement = null);
        var i = this.globalData.defs,
          s,
          n = this.masksProperties ? this.masksProperties.length : 0;
        (this.viewData = createSizedArray(n)), (this.solidPath = '');
        var l,
          u = this.masksProperties,
          d = 0,
          v = [],
          E,
          _,
          m = createElementID(),
          y,
          c,
          g,
          p,
          a = 'clipPath',
          o = 'clip-path';
        for (s = 0; s < n; s += 1)
          if (
            (((u[s].mode !== 'a' && u[s].mode !== 'n') ||
              u[s].inv ||
              u[s].o.k !== 100 ||
              u[s].o.x) &&
              ((a = 'mask'), (o = 'mask')),
            (u[s].mode === 's' || u[s].mode === 'i') && d === 0
              ? ((y = createNS('rect')),
                y.setAttribute('fill', '#ffffff'),
                y.setAttribute('width', this.element.comp.data.w || 0),
                y.setAttribute('height', this.element.comp.data.h || 0),
                v.push(y))
              : (y = null),
            (l = createNS('path')),
            u[s].mode === 'n')
          )
            (this.viewData[s] = {
              op: PropertyFactory.getProp(
                this.element,
                u[s].o,
                0,
                0.01,
                this.element
              ),
              prop: ShapePropertyFactory.getShapeProp(this.element, u[s], 3),
              elem: l,
              lastPath: '',
            }),
              i.appendChild(l);
          else {
            (d += 1),
              l.setAttribute('fill', u[s].mode === 's' ? '#000000' : '#ffffff'),
              l.setAttribute('clip-rule', 'nonzero');
            var h;
            if (
              (u[s].x.k !== 0
                ? ((a = 'mask'),
                  (o = 'mask'),
                  (p = PropertyFactory.getProp(
                    this.element,
                    u[s].x,
                    0,
                    null,
                    this.element
                  )),
                  (h = createElementID()),
                  (c = createNS('filter')),
                  c.setAttribute('id', h),
                  (g = createNS('feMorphology')),
                  g.setAttribute('operator', 'erode'),
                  g.setAttribute('in', 'SourceGraphic'),
                  g.setAttribute('radius', '0'),
                  c.appendChild(g),
                  i.appendChild(c),
                  l.setAttribute(
                    'stroke',
                    u[s].mode === 's' ? '#000000' : '#ffffff'
                  ))
                : ((g = null), (p = null)),
              (this.storedData[s] = {
                elem: l,
                x: p,
                expan: g,
                lastPath: '',
                lastOperator: '',
                filterId: h,
                lastRadius: 0,
              }),
              u[s].mode === 'i')
            ) {
              _ = v.length;
              var f = createNS('g');
              for (E = 0; E < _; E += 1) f.appendChild(v[E]);
              var b = createNS('mask');
              b.setAttribute('mask-type', 'alpha'),
                b.setAttribute('id', m + '_' + d),
                b.appendChild(l),
                i.appendChild(b),
                f.setAttribute(
                  'mask',
                  'url(' + locationHref + '#' + m + '_' + d + ')'
                ),
                (v.length = 0),
                v.push(f);
            } else v.push(l);
            u[s].inv &&
              !this.solidPath &&
              (this.solidPath = this.createLayerSolidPath()),
              (this.viewData[s] = {
                elem: l,
                lastPath: '',
                op: PropertyFactory.getProp(
                  this.element,
                  u[s].o,
                  0,
                  0.01,
                  this.element
                ),
                prop: ShapePropertyFactory.getShapeProp(this.element, u[s], 3),
                invRect: y,
              }),
              this.viewData[s].prop.k ||
                this.drawPath(u[s], this.viewData[s].prop.v, this.viewData[s]);
          }
        for (this.maskElement = createNS(a), n = v.length, s = 0; s < n; s += 1)
          this.maskElement.appendChild(v[s]);
        d > 0 &&
          (this.maskElement.setAttribute('id', m),
          this.element.maskedElement.setAttribute(
            o,
            'url(' + locationHref + '#' + m + ')'
          ),
          i.appendChild(this.maskElement)),
          this.viewData.length && this.element.addRenderableComponent(this);
      }
      (MaskElement.prototype.getMaskProperty = function (e) {
        return this.viewData[e].prop;
      }),
        (MaskElement.prototype.renderFrame = function (e) {
          var t = this.element.finalTransform.mat,
            r,
            i = this.masksProperties.length;
          for (r = 0; r < i; r += 1)
            if (
              ((this.viewData[r].prop._mdf || e) &&
                this.drawPath(
                  this.masksProperties[r],
                  this.viewData[r].prop.v,
                  this.viewData[r]
                ),
              (this.viewData[r].op._mdf || e) &&
                this.viewData[r].elem.setAttribute(
                  'fill-opacity',
                  this.viewData[r].op.v
                ),
              this.masksProperties[r].mode !== 'n' &&
                (this.viewData[r].invRect &&
                  (this.element.finalTransform.mProp._mdf || e) &&
                  this.viewData[r].invRect.setAttribute(
                    'transform',
                    t.getInverseMatrix().to2dCSS()
                  ),
                this.storedData[r].x && (this.storedData[r].x._mdf || e)))
            ) {
              var s = this.storedData[r].expan;
              this.storedData[r].x.v < 0
                ? (this.storedData[r].lastOperator !== 'erode' &&
                    ((this.storedData[r].lastOperator = 'erode'),
                    this.storedData[r].elem.setAttribute(
                      'filter',
                      'url(' +
                        locationHref +
                        '#' +
                        this.storedData[r].filterId +
                        ')'
                    )),
                  s.setAttribute('radius', -this.storedData[r].x.v))
                : (this.storedData[r].lastOperator !== 'dilate' &&
                    ((this.storedData[r].lastOperator = 'dilate'),
                    this.storedData[r].elem.setAttribute('filter', null)),
                  this.storedData[r].elem.setAttribute(
                    'stroke-width',
                    this.storedData[r].x.v * 2
                  ));
            }
        }),
        (MaskElement.prototype.getMaskelement = function () {
          return this.maskElement;
        }),
        (MaskElement.prototype.createLayerSolidPath = function () {
          var e = 'M0,0 ';
          return (
            (e += ' h' + this.globalData.compSize.w),
            (e += ' v' + this.globalData.compSize.h),
            (e += ' h-' + this.globalData.compSize.w),
            (e += ' v-' + this.globalData.compSize.h + ' '),
            e
          );
        }),
        (MaskElement.prototype.drawPath = function (e, t, r) {
          var i = ' M' + t.v[0][0] + ',' + t.v[0][1],
            s,
            n;
          for (n = t._length, s = 1; s < n; s += 1)
            i +=
              ' C' +
              t.o[s - 1][0] +
              ',' +
              t.o[s - 1][1] +
              ' ' +
              t.i[s][0] +
              ',' +
              t.i[s][1] +
              ' ' +
              t.v[s][0] +
              ',' +
              t.v[s][1];
          if (
            (t.c &&
              n > 1 &&
              (i +=
                ' C' +
                t.o[s - 1][0] +
                ',' +
                t.o[s - 1][1] +
                ' ' +
                t.i[0][0] +
                ',' +
                t.i[0][1] +
                ' ' +
                t.v[0][0] +
                ',' +
                t.v[0][1]),
            r.lastPath !== i)
          ) {
            var l = '';
            r.elem &&
              (t.c && (l = e.inv ? this.solidPath + i : i),
              r.elem.setAttribute('d', l)),
              (r.lastPath = i);
          }
        }),
        (MaskElement.prototype.destroy = function () {
          (this.element = null),
            (this.globalData = null),
            (this.maskElement = null),
            (this.data = null),
            (this.masksProperties = null);
        });
      function HierarchyElement() {}
      HierarchyElement.prototype = {
        initHierarchy: function () {
          (this.hierarchy = []), (this._isParent = !1), this.checkParenting();
        },
        setHierarchy: function (e) {
          this.hierarchy = e;
        },
        setAsParent: function () {
          this._isParent = !0;
        },
        checkParenting: function () {
          this.data.parent !== void 0 &&
            this.comp.buildElementParenting(this, this.data.parent, []);
        },
      };
      function FrameElement() {}
      FrameElement.prototype = {
        initFrame: function () {
          (this._isFirstFrame = !1),
            (this.dynamicProperties = []),
            (this._mdf = !1);
        },
        prepareProperties: function (e, t) {
          var r,
            i = this.dynamicProperties.length;
          for (r = 0; r < i; r += 1)
            (t ||
              (this._isParent &&
                this.dynamicProperties[r].propType === 'transform')) &&
              (this.dynamicProperties[r].getValue(),
              this.dynamicProperties[r]._mdf &&
                ((this.globalData._mdf = !0), (this._mdf = !0)));
        },
        addDynamicProperty: function (e) {
          this.dynamicProperties.indexOf(e) === -1 &&
            this.dynamicProperties.push(e);
        },
      };
      function TransformElement() {}
      TransformElement.prototype = {
        initTransform: function () {
          (this.finalTransform = {
            mProp: this.data.ks
              ? TransformPropertyFactory.getTransformProperty(
                  this,
                  this.data.ks,
                  this
                )
              : { o: 0 },
            _matMdf: !1,
            _opMdf: !1,
            mat: new Matrix(),
          }),
            this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
            this.data.ty !== 11;
        },
        renderTransform: function () {
          if (
            ((this.finalTransform._opMdf =
              this.finalTransform.mProp.o._mdf || this._isFirstFrame),
            (this.finalTransform._matMdf =
              this.finalTransform.mProp._mdf || this._isFirstFrame),
            this.hierarchy)
          ) {
            var e,
              t = this.finalTransform.mat,
              r = 0,
              i = this.hierarchy.length;
            if (!this.finalTransform._matMdf)
              for (; r < i; ) {
                if (this.hierarchy[r].finalTransform.mProp._mdf) {
                  this.finalTransform._matMdf = !0;
                  break;
                }
                r += 1;
              }
            if (this.finalTransform._matMdf)
              for (
                e = this.finalTransform.mProp.v.props,
                  t.cloneFromProps(e),
                  r = 0;
                r < i;
                r += 1
              )
                (e = this.hierarchy[r].finalTransform.mProp.v.props),
                  t.transform(
                    e[0],
                    e[1],
                    e[2],
                    e[3],
                    e[4],
                    e[5],
                    e[6],
                    e[7],
                    e[8],
                    e[9],
                    e[10],
                    e[11],
                    e[12],
                    e[13],
                    e[14],
                    e[15]
                  );
          }
        },
        globalToLocal: function (e) {
          var t = [];
          t.push(this.finalTransform);
          for (var r = !0, i = this.comp; r; )
            i.finalTransform
              ? (i.data.hasMask && t.splice(0, 0, i.finalTransform),
                (i = i.comp))
              : (r = !1);
          var s,
            n = t.length,
            l;
          for (s = 0; s < n; s += 1)
            (l = t[s].mat.applyToPointArray(0, 0, 0)),
              (e = [e[0] - l[0], e[1] - l[1], 0]);
          return e;
        },
        mHelper: new Matrix(),
      };
      function RenderableElement() {}
      RenderableElement.prototype = {
        initRenderable: function () {
          (this.isInRange = !1),
            (this.hidden = !1),
            (this.isTransparent = !1),
            (this.renderableComponents = []);
        },
        addRenderableComponent: function (e) {
          this.renderableComponents.indexOf(e) === -1 &&
            this.renderableComponents.push(e);
        },
        removeRenderableComponent: function (e) {
          this.renderableComponents.indexOf(e) !== -1 &&
            this.renderableComponents.splice(
              this.renderableComponents.indexOf(e),
              1
            );
        },
        prepareRenderableFrame: function (e) {
          this.checkLayerLimits(e);
        },
        checkTransparency: function () {
          this.finalTransform.mProp.o.v <= 0
            ? !this.isTransparent &&
              this.globalData.renderConfig.hideOnTransparent &&
              ((this.isTransparent = !0), this.hide())
            : this.isTransparent && ((this.isTransparent = !1), this.show());
        },
        checkLayerLimits: function (e) {
          this.data.ip - this.data.st <= e && this.data.op - this.data.st > e
            ? this.isInRange !== !0 &&
              ((this.globalData._mdf = !0),
              (this._mdf = !0),
              (this.isInRange = !0),
              this.show())
            : this.isInRange !== !1 &&
              ((this.globalData._mdf = !0), (this.isInRange = !1), this.hide());
        },
        renderRenderable: function () {
          var e,
            t = this.renderableComponents.length;
          for (e = 0; e < t; e += 1)
            this.renderableComponents[e].renderFrame(this._isFirstFrame);
        },
        sourceRectAtTime: function () {
          return { top: 0, left: 0, width: 100, height: 100 };
        },
        getLayerSize: function () {
          return this.data.ty === 5
            ? { w: this.data.textData.width, h: this.data.textData.height }
            : { w: this.data.width, h: this.data.height };
        },
      };
      function RenderableDOMElement() {}
      (function () {
        var e = {
          initElement: function (t, r, i) {
            this.initFrame(),
              this.initBaseData(t, r, i),
              this.initTransform(t, r, i),
              this.initHierarchy(),
              this.initRenderable(),
              this.initRendererElement(),
              this.createContainerElements(),
              this.createRenderableComponents(),
              this.createContent(),
              this.hide();
          },
          hide: function () {
            if (!this.hidden && (!this.isInRange || this.isTransparent)) {
              var t = this.baseElement || this.layerElement;
              (t.style.display = 'none'), (this.hidden = !0);
            }
          },
          show: function () {
            if (this.isInRange && !this.isTransparent) {
              if (!this.data.hd) {
                var t = this.baseElement || this.layerElement;
                t.style.display = 'block';
              }
              (this.hidden = !1), (this._isFirstFrame = !0);
            }
          },
          renderFrame: function () {
            this.data.hd ||
              this.hidden ||
              (this.renderTransform(),
              this.renderRenderable(),
              this.renderElement(),
              this.renderInnerContent(),
              this._isFirstFrame && (this._isFirstFrame = !1));
          },
          renderInnerContent: function () {},
          prepareFrame: function (t) {
            (this._mdf = !1),
              this.prepareRenderableFrame(t),
              this.prepareProperties(t, this.isInRange),
              this.checkTransparency();
          },
          destroy: function () {
            (this.innerElem = null), this.destroyBaseElement();
          },
        };
        extendPrototype(
          [RenderableElement, createProxyFunction(e)],
          RenderableDOMElement
        );
      })();
      function ProcessedElement(e, t) {
        (this.elem = e), (this.pos = t);
      }
      function SVGStyleData(e, t) {
        (this.data = e),
          (this.type = e.ty),
          (this.d = ''),
          (this.lvl = t),
          (this._mdf = !1),
          (this.closed = e.hd === !0),
          (this.pElem = createNS('path')),
          (this.msElem = null);
      }
      SVGStyleData.prototype.reset = function () {
        (this.d = ''), (this._mdf = !1);
      };
      function SVGShapeData(e, t, r) {
        (this.caches = []),
          (this.styles = []),
          (this.transformers = e),
          (this.lStr = ''),
          (this.sh = r),
          (this.lvl = t),
          (this._isAnimated = !!r.k);
        for (var i = 0, s = e.length; i < s; ) {
          if (e[i].mProps.dynamicProperties.length) {
            this._isAnimated = !0;
            break;
          }
          i += 1;
        }
      }
      SVGShapeData.prototype.setAsAnimated = function () {
        this._isAnimated = !0;
      };
      function SVGTransformData(e, t, r) {
        (this.transform = { mProps: e, op: t, container: r }),
          (this.elements = []),
          (this._isAnimated =
            this.transform.mProps.dynamicProperties.length ||
            this.transform.op.effectsSequence.length);
      }
      function SVGStrokeStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
          (this.d = new DashProperty(e, t.d || {}, 'svg', this)),
          (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
          (this.style = r),
          (this._isAnimated = !!this._isAnimated);
      }
      extendPrototype([DynamicPropertyContainer], SVGStrokeStyleData);
      function SVGFillStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.c = PropertyFactory.getProp(e, t.c, 1, 255, this)),
          (this.style = r);
      }
      extendPrototype([DynamicPropertyContainer], SVGFillStyleData);
      function SVGGradientFillStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          this.initGradientData(e, t, r);
      }
      (SVGGradientFillStyleData.prototype.initGradientData = function (
        e,
        t,
        r
      ) {
        (this.o = PropertyFactory.getProp(e, t.o, 0, 0.01, this)),
          (this.s = PropertyFactory.getProp(e, t.s, 1, null, this)),
          (this.e = PropertyFactory.getProp(e, t.e, 1, null, this)),
          (this.h = PropertyFactory.getProp(e, t.h || { k: 0 }, 0, 0.01, this)),
          (this.a = PropertyFactory.getProp(
            e,
            t.a || { k: 0 },
            0,
            degToRads,
            this
          )),
          (this.g = new GradientProperty(e, t.g, this)),
          (this.style = r),
          (this.stops = []),
          this.setGradientData(r.pElem, t),
          this.setGradientOpacity(t, r),
          (this._isAnimated = !!this._isAnimated);
      }),
        (SVGGradientFillStyleData.prototype.setGradientData = function (e, t) {
          var r = createElementID(),
            i = createNS(t.t === 1 ? 'linearGradient' : 'radialGradient');
          i.setAttribute('id', r),
            i.setAttribute('spreadMethod', 'pad'),
            i.setAttribute('gradientUnits', 'userSpaceOnUse');
          var s = [],
            n,
            l,
            u;
          for (u = t.g.p * 4, l = 0; l < u; l += 4)
            (n = createNS('stop')), i.appendChild(n), s.push(n);
          e.setAttribute(
            t.ty === 'gf' ? 'fill' : 'stroke',
            'url(' + locationHref + '#' + r + ')'
          ),
            (this.gf = i),
            (this.cst = s);
        }),
        (SVGGradientFillStyleData.prototype.setGradientOpacity = function (
          e,
          t
        ) {
          if (this.g._hasOpacity && !this.g._collapsable) {
            var r,
              i,
              s,
              n = createNS('mask'),
              l = createNS('path');
            n.appendChild(l);
            var u = createElementID(),
              d = createElementID();
            n.setAttribute('id', d);
            var v = createNS(e.t === 1 ? 'linearGradient' : 'radialGradient');
            v.setAttribute('id', u),
              v.setAttribute('spreadMethod', 'pad'),
              v.setAttribute('gradientUnits', 'userSpaceOnUse'),
              (s = e.g.k.k[0].s ? e.g.k.k[0].s.length : e.g.k.k.length);
            var E = this.stops;
            for (i = e.g.p * 4; i < s; i += 2)
              (r = createNS('stop')),
                r.setAttribute('stop-color', 'rgb(255,255,255)'),
                v.appendChild(r),
                E.push(r);
            l.setAttribute(
              e.ty === 'gf' ? 'fill' : 'stroke',
              'url(' + locationHref + '#' + u + ')'
            ),
              e.ty === 'gs' &&
                (l.setAttribute('stroke-linecap', lineCapEnum[e.lc || 2]),
                l.setAttribute('stroke-linejoin', lineJoinEnum[e.lj || 2]),
                e.lj === 1 && l.setAttribute('stroke-miterlimit', e.ml)),
              (this.of = v),
              (this.ms = n),
              (this.ost = E),
              (this.maskId = d),
              (t.msElem = l);
          }
        }),
        extendPrototype([DynamicPropertyContainer], SVGGradientFillStyleData);
      function SVGGradientStrokeStyleData(e, t, r) {
        this.initDynamicPropertyContainer(e),
          (this.getValue = this.iterateDynamicProperties),
          (this.w = PropertyFactory.getProp(e, t.w, 0, null, this)),
          (this.d = new DashProperty(e, t.d || {}, 'svg', this)),
          this.initGradientData(e, t, r),
          (this._isAnimated = !!this._isAnimated);
      }
      extendPrototype(
        [SVGGradientFillStyleData, DynamicPropertyContainer],
        SVGGradientStrokeStyleData
      );
      function ShapeGroupData() {
        (this.it = []), (this.prevViewData = []), (this.gr = createNS('g'));
      }
      var SVGElementsRenderer = (function () {
        var e = new Matrix(),
          t = new Matrix(),
          r = { createRenderFunction: i };
        function i(E) {
          switch (E.ty) {
            case 'fl':
              return l;
            case 'gf':
              return d;
            case 'gs':
              return u;
            case 'st':
              return v;
            case 'sh':
            case 'el':
            case 'rc':
            case 'sr':
              return n;
            case 'tr':
              return s;
            default:
              return null;
          }
        }
        function s(E, _, m) {
          (m || _.transform.op._mdf) &&
            _.transform.container.setAttribute('opacity', _.transform.op.v),
            (m || _.transform.mProps._mdf) &&
              _.transform.container.setAttribute(
                'transform',
                _.transform.mProps.v.to2dCSS()
              );
        }
        function n(E, _, m) {
          var y,
            c,
            g,
            p,
            a,
            o,
            h = _.styles.length,
            f = _.lvl,
            b,
            P,
            S,
            w,
            M;
          for (o = 0; o < h; o += 1) {
            if (((p = _.sh._mdf || m), _.styles[o].lvl < f)) {
              for (
                P = t.reset(),
                  w = f - _.styles[o].lvl,
                  M = _.transformers.length - 1;
                !p && w > 0;

              )
                (p = _.transformers[M].mProps._mdf || p), (w -= 1), (M -= 1);
              if (p)
                for (
                  w = f - _.styles[o].lvl, M = _.transformers.length - 1;
                  w > 0;

                )
                  (S = _.transformers[M].mProps.v.props),
                    P.transform(
                      S[0],
                      S[1],
                      S[2],
                      S[3],
                      S[4],
                      S[5],
                      S[6],
                      S[7],
                      S[8],
                      S[9],
                      S[10],
                      S[11],
                      S[12],
                      S[13],
                      S[14],
                      S[15]
                    ),
                    (w -= 1),
                    (M -= 1);
            } else P = e;
            if (((b = _.sh.paths), (c = b._length), p)) {
              for (g = '', y = 0; y < c; y += 1)
                (a = b.shapes[y]),
                  a &&
                    a._length &&
                    (g += buildShapeString(a, a._length, a.c, P));
              _.caches[o] = g;
            } else g = _.caches[o];
            (_.styles[o].d += E.hd === !0 ? '' : g),
              (_.styles[o]._mdf = p || _.styles[o]._mdf);
          }
        }
        function l(E, _, m) {
          var y = _.style;
          (_.c._mdf || m) &&
            y.pElem.setAttribute(
              'fill',
              'rgb(' +
                bmFloor(_.c.v[0]) +
                ',' +
                bmFloor(_.c.v[1]) +
                ',' +
                bmFloor(_.c.v[2]) +
                ')'
            ),
            (_.o._mdf || m) && y.pElem.setAttribute('fill-opacity', _.o.v);
        }
        function u(E, _, m) {
          d(E, _, m), v(E, _, m);
        }
        function d(E, _, m) {
          var y = _.gf,
            c = _.g._hasOpacity,
            g = _.s.v,
            p = _.e.v;
          if (_.o._mdf || m) {
            var a = E.ty === 'gf' ? 'fill-opacity' : 'stroke-opacity';
            _.style.pElem.setAttribute(a, _.o.v);
          }
          if (_.s._mdf || m) {
            var o = E.t === 1 ? 'x1' : 'cx',
              h = o === 'x1' ? 'y1' : 'cy';
            y.setAttribute(o, g[0]),
              y.setAttribute(h, g[1]),
              c &&
                !_.g._collapsable &&
                (_.of.setAttribute(o, g[0]), _.of.setAttribute(h, g[1]));
          }
          var f, b, P, S;
          if (_.g._cmdf || m) {
            f = _.cst;
            var w = _.g.c;
            for (P = f.length, b = 0; b < P; b += 1)
              (S = f[b]),
                S.setAttribute('offset', w[b * 4] + '%'),
                S.setAttribute(
                  'stop-color',
                  'rgb(' +
                    w[b * 4 + 1] +
                    ',' +
                    w[b * 4 + 2] +
                    ',' +
                    w[b * 4 + 3] +
                    ')'
                );
          }
          if (c && (_.g._omdf || m)) {
            var M = _.g.o;
            for (
              _.g._collapsable ? (f = _.cst) : (f = _.ost), P = f.length, b = 0;
              b < P;
              b += 1
            )
              (S = f[b]),
                _.g._collapsable || S.setAttribute('offset', M[b * 2] + '%'),
                S.setAttribute('stop-opacity', M[b * 2 + 1]);
          }
          if (E.t === 1)
            (_.e._mdf || m) &&
              (y.setAttribute('x2', p[0]),
              y.setAttribute('y2', p[1]),
              c &&
                !_.g._collapsable &&
                (_.of.setAttribute('x2', p[0]), _.of.setAttribute('y2', p[1])));
          else {
            var I;
            if (
              ((_.s._mdf || _.e._mdf || m) &&
                ((I = Math.sqrt(
                  Math.pow(g[0] - p[0], 2) + Math.pow(g[1] - p[1], 2)
                )),
                y.setAttribute('r', I),
                c && !_.g._collapsable && _.of.setAttribute('r', I)),
              _.e._mdf || _.h._mdf || _.a._mdf || m)
            ) {
              I ||
                (I = Math.sqrt(
                  Math.pow(g[0] - p[0], 2) + Math.pow(g[1] - p[1], 2)
                ));
              var C = Math.atan2(p[1] - g[1], p[0] - g[0]),
                R = _.h.v;
              R >= 1 ? (R = 0.99) : R <= -1 && (R = -0.99);
              var V = I * R,
                O = Math.cos(C + _.a.v) * V + g[0],
                D = Math.sin(C + _.a.v) * V + g[1];
              y.setAttribute('fx', O),
                y.setAttribute('fy', D),
                c &&
                  !_.g._collapsable &&
                  (_.of.setAttribute('fx', O), _.of.setAttribute('fy', D));
            }
          }
        }
        function v(E, _, m) {
          var y = _.style,
            c = _.d;
          c &&
            (c._mdf || m) &&
            c.dashStr &&
            (y.pElem.setAttribute('stroke-dasharray', c.dashStr),
            y.pElem.setAttribute('stroke-dashoffset', c.dashoffset[0])),
            _.c &&
              (_.c._mdf || m) &&
              y.pElem.setAttribute(
                'stroke',
                'rgb(' +
                  bmFloor(_.c.v[0]) +
                  ',' +
                  bmFloor(_.c.v[1]) +
                  ',' +
                  bmFloor(_.c.v[2]) +
                  ')'
              ),
            (_.o._mdf || m) && y.pElem.setAttribute('stroke-opacity', _.o.v),
            (_.w._mdf || m) &&
              (y.pElem.setAttribute('stroke-width', _.w.v),
              y.msElem && y.msElem.setAttribute('stroke-width', _.w.v));
        }
        return r;
      })();
      function ShapeTransformManager() {
        (this.sequences = {}),
          (this.sequenceList = []),
          (this.transform_key_count = 0);
      }
      ShapeTransformManager.prototype = {
        addTransformSequence: function (e) {
          var t,
            r = e.length,
            i = '_';
          for (t = 0; t < r; t += 1) i += e[t].transform.key + '_';
          var s = this.sequences[i];
          return (
            s ||
              ((s = {
                transforms: [].concat(e),
                finalTransform: new Matrix(),
                _mdf: !1,
              }),
              (this.sequences[i] = s),
              this.sequenceList.push(s)),
            s
          );
        },
        processSequence: function (e, t) {
          for (var r = 0, i = e.transforms.length, s = t; r < i && !t; ) {
            if (e.transforms[r].transform.mProps._mdf) {
              s = !0;
              break;
            }
            r += 1;
          }
          if (s) {
            var n;
            for (e.finalTransform.reset(), r = i - 1; r >= 0; r -= 1)
              (n = e.transforms[r].transform.mProps.v.props),
                e.finalTransform.transform(
                  n[0],
                  n[1],
                  n[2],
                  n[3],
                  n[4],
                  n[5],
                  n[6],
                  n[7],
                  n[8],
                  n[9],
                  n[10],
                  n[11],
                  n[12],
                  n[13],
                  n[14],
                  n[15]
                );
          }
          e._mdf = s;
        },
        processSequences: function (e) {
          var t,
            r = this.sequenceList.length;
          for (t = 0; t < r; t += 1)
            this.processSequence(this.sequenceList[t], e);
        },
        getNewKey: function () {
          return (
            (this.transform_key_count += 1), '_' + this.transform_key_count
          );
        },
      };
      function CVShapeData(e, t, r, i) {
        (this.styledShapes = []), (this.tr = [0, 0, 0, 0, 0, 0]);
        var s = 4;
        t.ty === 'rc'
          ? (s = 5)
          : t.ty === 'el'
          ? (s = 6)
          : t.ty === 'sr' && (s = 7),
          (this.sh = ShapePropertyFactory.getShapeProp(e, t, s, e));
        var n,
          l = r.length,
          u;
        for (n = 0; n < l; n += 1)
          r[n].closed ||
            ((u = {
              transforms: i.addTransformSequence(r[n].transforms),
              trNodes: [],
            }),
            this.styledShapes.push(u),
            r[n].elements.push(u));
      }
      CVShapeData.prototype.setAsAnimated =
        SVGShapeData.prototype.setAsAnimated;
      function BaseElement() {}
      BaseElement.prototype = {
        checkMasks: function () {
          if (!this.data.hasMask) return !1;
          for (var e = 0, t = this.data.masksProperties.length; e < t; ) {
            if (
              this.data.masksProperties[e].mode !== 'n' &&
              this.data.masksProperties[e].cl !== !1
            )
              return !0;
            e += 1;
          }
          return !1;
        },
        initExpressions: function () {
          (this.layerInterface = LayerExpressionInterface(this)),
            this.data.hasMask &&
              this.maskManager &&
              this.layerInterface.registerMaskInterface(this.maskManager);
          var e = EffectsExpressionInterface.createEffectsInterface(
            this,
            this.layerInterface
          );
          this.layerInterface.registerEffectsInterface(e),
            this.data.ty === 0 || this.data.xt
              ? (this.compInterface = CompExpressionInterface(this))
              : this.data.ty === 4
              ? ((this.layerInterface.shapeInterface = ShapeExpressionInterface(
                  this.shapesData,
                  this.itemsData,
                  this.layerInterface
                )),
                (this.layerInterface.content =
                  this.layerInterface.shapeInterface))
              : this.data.ty === 5 &&
                ((this.layerInterface.textInterface =
                  TextExpressionInterface(this)),
                (this.layerInterface.text = this.layerInterface.textInterface));
        },
        setBlendMode: function () {
          var e = getBlendMode(this.data.bm),
            t = this.baseElement || this.layerElement;
          t.style['mix-blend-mode'] = e;
        },
        initBaseData: function (e, t, r) {
          (this.globalData = t),
            (this.comp = r),
            (this.data = e),
            (this.layerId = createElementID()),
            this.data.sr || (this.data.sr = 1),
            (this.effectsManager = new EffectsManager(
              this.data,
              this,
              this.dynamicProperties
            ));
        },
        getType: function () {
          return this.type;
        },
        sourceRectAtTime: function () {},
      };
      function NullElement(e, t, r) {
        this.initFrame(),
          this.initBaseData(e, t, r),
          this.initFrame(),
          this.initTransform(e, t, r),
          this.initHierarchy();
      }
      (NullElement.prototype.prepareFrame = function (e) {
        this.prepareProperties(e, !0);
      }),
        (NullElement.prototype.renderFrame = function () {}),
        (NullElement.prototype.getBaseElement = function () {
          return null;
        }),
        (NullElement.prototype.destroy = function () {}),
        (NullElement.prototype.sourceRectAtTime = function () {}),
        (NullElement.prototype.hide = function () {}),
        extendPrototype(
          [BaseElement, TransformElement, HierarchyElement, FrameElement],
          NullElement
        );
      function SVGBaseElement() {}
      SVGBaseElement.prototype = {
        initRendererElement: function () {
          this.layerElement = createNS('g');
        },
        createContainerElements: function () {
          (this.matteElement = createNS('g')),
            (this.transformedElement = this.layerElement),
            (this.maskedElement = this.layerElement),
            (this._sizeChanged = !1);
          var e = null,
            t,
            r,
            i;
          if (this.data.td) {
            if (this.data.td == 3 || this.data.td == 1) {
              var s = createNS('mask');
              s.setAttribute('id', this.layerId),
                s.setAttribute(
                  'mask-type',
                  this.data.td == 3 ? 'luminance' : 'alpha'
                ),
                s.appendChild(this.layerElement),
                (e = s),
                this.globalData.defs.appendChild(s),
                !featureSupport.maskType &&
                  this.data.td == 1 &&
                  (s.setAttribute('mask-type', 'luminance'),
                  (t = createElementID()),
                  (r = filtersFactory.createFilter(t)),
                  this.globalData.defs.appendChild(r),
                  r.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (i = createNS('g')),
                  i.appendChild(this.layerElement),
                  (e = i),
                  s.appendChild(i),
                  i.setAttribute(
                    'filter',
                    'url(' + locationHref + '#' + t + ')'
                  ));
            } else if (this.data.td == 2) {
              var n = createNS('mask');
              n.setAttribute('id', this.layerId),
                n.setAttribute('mask-type', 'alpha');
              var l = createNS('g');
              n.appendChild(l),
                (t = createElementID()),
                (r = filtersFactory.createFilter(t));
              var u = createNS('feComponentTransfer');
              u.setAttribute('in', 'SourceGraphic'), r.appendChild(u);
              var d = createNS('feFuncA');
              d.setAttribute('type', 'table'),
                d.setAttribute('tableValues', '1.0 0.0'),
                u.appendChild(d),
                this.globalData.defs.appendChild(r);
              var v = createNS('rect');
              v.setAttribute('width', this.comp.data.w),
                v.setAttribute('height', this.comp.data.h),
                v.setAttribute('x', '0'),
                v.setAttribute('y', '0'),
                v.setAttribute('fill', '#ffffff'),
                v.setAttribute('opacity', '0'),
                l.setAttribute('filter', 'url(' + locationHref + '#' + t + ')'),
                l.appendChild(v),
                l.appendChild(this.layerElement),
                (e = l),
                featureSupport.maskType ||
                  (n.setAttribute('mask-type', 'luminance'),
                  r.appendChild(filtersFactory.createAlphaToLuminanceFilter()),
                  (i = createNS('g')),
                  l.appendChild(v),
                  i.appendChild(this.layerElement),
                  (e = i),
                  l.appendChild(i)),
                this.globalData.defs.appendChild(n);
            }
          } else
            this.data.tt
              ? (this.matteElement.appendChild(this.layerElement),
                (e = this.matteElement),
                (this.baseElement = this.matteElement))
              : (this.baseElement = this.layerElement);
          if (
            (this.data.ln && this.layerElement.setAttribute('id', this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute('class', this.data.cl),
            this.data.ty === 0 && !this.data.hd)
          ) {
            var E = createNS('clipPath'),
              _ = createNS('path');
            _.setAttribute(
              'd',
              'M0,0 L' +
                this.data.w +
                ',0 L' +
                this.data.w +
                ',' +
                this.data.h +
                ' L0,' +
                this.data.h +
                'z'
            );
            var m = createElementID();
            if (
              (E.setAttribute('id', m),
              E.appendChild(_),
              this.globalData.defs.appendChild(E),
              this.checkMasks())
            ) {
              var y = createNS('g');
              y.setAttribute(
                'clip-path',
                'url(' + locationHref + '#' + m + ')'
              ),
                y.appendChild(this.layerElement),
                (this.transformedElement = y),
                e
                  ? e.appendChild(this.transformedElement)
                  : (this.baseElement = this.transformedElement);
            } else
              this.layerElement.setAttribute(
                'clip-path',
                'url(' + locationHref + '#' + m + ')'
              );
          }
          this.data.bm !== 0 && this.setBlendMode();
        },
        renderElement: function () {
          this.finalTransform._matMdf &&
            this.transformedElement.setAttribute(
              'transform',
              this.finalTransform.mat.to2dCSS()
            ),
            this.finalTransform._opMdf &&
              this.transformedElement.setAttribute(
                'opacity',
                this.finalTransform.mProp.o.v
              );
        },
        destroyBaseElement: function () {
          (this.layerElement = null),
            (this.matteElement = null),
            this.maskManager.destroy();
        },
        getBaseElement: function () {
          return this.data.hd ? null : this.baseElement;
        },
        createRenderableComponents: function () {
          (this.maskManager = new MaskElement(
            this.data,
            this,
            this.globalData
          )),
            (this.renderableEffectsManager = new SVGEffects(this));
        },
        setMatte: function (e) {
          !this.matteElement ||
            this.matteElement.setAttribute(
              'mask',
              'url(' + locationHref + '#' + e + ')'
            );
        },
      };
      function IShapeElement() {}
      IShapeElement.prototype = {
        addShapeToModifiers: function (e) {
          var t,
            r = this.shapeModifiers.length;
          for (t = 0; t < r; t += 1) this.shapeModifiers[t].addShape(e);
        },
        isShapeInAnimatedModifiers: function (e) {
          for (var t = 0, r = this.shapeModifiers.length; t < r; )
            if (this.shapeModifiers[t].isAnimatedWithShape(e)) return !0;
          return !1;
        },
        renderModifiers: function () {
          if (!!this.shapeModifiers.length) {
            var e,
              t = this.shapes.length;
            for (e = 0; e < t; e += 1) this.shapes[e].sh.reset();
            t = this.shapeModifiers.length;
            var r;
            for (
              e = t - 1;
              e >= 0 &&
              ((r = this.shapeModifiers[e].processShapes(this._isFirstFrame)),
              !r);
              e -= 1
            );
          }
        },
        searchProcessedElement: function (e) {
          for (var t = this.processedElements, r = 0, i = t.length; r < i; ) {
            if (t[r].elem === e) return t[r].pos;
            r += 1;
          }
          return 0;
        },
        addProcessedElement: function (e, t) {
          for (var r = this.processedElements, i = r.length; i; )
            if (((i -= 1), r[i].elem === e)) {
              r[i].pos = t;
              return;
            }
          r.push(new ProcessedElement(e, t));
        },
        prepareFrame: function (e) {
          this.prepareRenderableFrame(e),
            this.prepareProperties(e, this.isInRange);
        },
      };
      function ITextElement() {}
      (ITextElement.prototype.initElement = function (e, t, r) {
        (this.lettersChangedFlag = !0),
          this.initFrame(),
          this.initBaseData(e, t, r),
          (this.textProperty = new TextProperty(
            this,
            e.t,
            this.dynamicProperties
          )),
          (this.textAnimator = new TextAnimatorProperty(
            e.t,
            this.renderType,
            this
          )),
          this.initTransform(e, t, r),
          this.initHierarchy(),
          this.initRenderable(),
          this.initRendererElement(),
          this.createContainerElements(),
          this.createRenderableComponents(),
          this.createContent(),
          this.hide(),
          this.textAnimator.searchProperties(this.dynamicProperties);
      }),
        (ITextElement.prototype.prepareFrame = function (e) {
          (this._mdf = !1),
            this.prepareRenderableFrame(e),
            this.prepareProperties(e, this.isInRange),
            (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
              (this.buildNewText(),
              (this.textProperty._isFirstFrame = !1),
              (this.textProperty._mdf = !1));
        }),
        (ITextElement.prototype.createPathShape = function (e, t) {
          var r,
            i = t.length,
            s,
            n = '';
          for (r = 0; r < i; r += 1)
            (s = t[r].ks.k), (n += buildShapeString(s, s.i.length, !0, e));
          return n;
        }),
        (ITextElement.prototype.updateDocumentData = function (e, t) {
          this.textProperty.updateDocumentData(e, t);
        }),
        (ITextElement.prototype.canResizeFont = function (e) {
          this.textProperty.canResizeFont(e);
        }),
        (ITextElement.prototype.setMinimumFontSize = function (e) {
          this.textProperty.setMinimumFontSize(e);
        }),
        (ITextElement.prototype.applyTextPropertiesToMatrix = function (
          e,
          t,
          r,
          i,
          s
        ) {
          switch (
            (e.ps && t.translate(e.ps[0], e.ps[1] + e.ascent, 0),
            t.translate(0, -e.ls, 0),
            e.j)
          ) {
            case 1:
              t.translate(
                e.justifyOffset + (e.boxWidth - e.lineWidths[r]),
                0,
                0
              );
              break;
            case 2:
              t.translate(
                e.justifyOffset + (e.boxWidth - e.lineWidths[r]) / 2,
                0,
                0
              );
              break;
          }
          t.translate(i, s, 0);
        }),
        (ITextElement.prototype.buildColor = function (e) {
          return (
            'rgb(' +
            Math.round(e[0] * 255) +
            ',' +
            Math.round(e[1] * 255) +
            ',' +
            Math.round(e[2] * 255) +
            ')'
          );
        }),
        (ITextElement.prototype.emptyProp = new LetterProps()),
        (ITextElement.prototype.destroy = function () {});
      function ICompElement() {}
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        ICompElement
      ),
        (ICompElement.prototype.initElement = function (e, t, r) {
          this.initFrame(),
            this.initBaseData(e, t, r),
            this.initTransform(e, t, r),
            this.initRenderable(),
            this.initHierarchy(),
            this.initRendererElement(),
            this.createContainerElements(),
            this.createRenderableComponents(),
            (this.data.xt || !t.progressiveLoad) && this.buildAllItems(),
            this.hide();
        }),
        (ICompElement.prototype.prepareFrame = function (e) {
          if (
            ((this._mdf = !1),
            this.prepareRenderableFrame(e),
            this.prepareProperties(e, this.isInRange),
            !(!this.isInRange && !this.data.xt))
          ) {
            if (this.tm._placeholder) this.renderedFrame = e / this.data.sr;
            else {
              var t = this.tm.v;
              t === this.data.op && (t = this.data.op - 1),
                (this.renderedFrame = t);
            }
            var r,
              i = this.elements.length;
            for (
              this.completeLayers || this.checkLayers(this.renderedFrame),
                r = i - 1;
              r >= 0;
              r -= 1
            )
              (this.completeLayers || this.elements[r]) &&
                (this.elements[r].prepareFrame(
                  this.renderedFrame - this.layers[r].st
                ),
                this.elements[r]._mdf && (this._mdf = !0));
          }
        }),
        (ICompElement.prototype.renderInnerContent = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1)
            (this.completeLayers || this.elements[e]) &&
              this.elements[e].renderFrame();
        }),
        (ICompElement.prototype.setElements = function (e) {
          this.elements = e;
        }),
        (ICompElement.prototype.getElements = function () {
          return this.elements;
        }),
        (ICompElement.prototype.destroyElements = function () {
          var e,
            t = this.layers.length;
          for (e = 0; e < t; e += 1)
            this.elements[e] && this.elements[e].destroy();
        }),
        (ICompElement.prototype.destroy = function () {
          this.destroyElements(), this.destroyBaseElement();
        });
      function IImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)),
          this.initElement(e, t, r),
          (this.sourceRect = {
            top: 0,
            left: 0,
            width: this.assetData.w,
            height: this.assetData.h,
          });
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        IImageElement
      ),
        (IImageElement.prototype.createContent = function () {
          var e = this.globalData.getAssetsPath(this.assetData);
          (this.innerElem = createNS('image')),
            this.innerElem.setAttribute('width', this.assetData.w + 'px'),
            this.innerElem.setAttribute('height', this.assetData.h + 'px'),
            this.innerElem.setAttribute(
              'preserveAspectRatio',
              this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio
            ),
            this.innerElem.setAttributeNS(
              'http://www.w3.org/1999/xlink',
              'href',
              e
            ),
            this.layerElement.appendChild(this.innerElem);
        }),
        (IImageElement.prototype.sourceRectAtTime = function () {
          return this.sourceRect;
        });
      function ISolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype([IImageElement], ISolidElement),
        (ISolidElement.prototype.createContent = function () {
          var e = createNS('rect');
          e.setAttribute('width', this.data.sw),
            e.setAttribute('height', this.data.sh),
            e.setAttribute('fill', this.data.sc),
            this.layerElement.appendChild(e);
        });
      function AudioElement(e, t, r) {
        this.initFrame(),
          this.initRenderable(),
          (this.assetData = t.getAssetData(e.refId)),
          this.initBaseData(e, t, r),
          (this._isPlaying = !1),
          (this._canPlay = !1);
        var i = this.globalData.getAssetsPath(this.assetData);
        (this.audio = this.globalData.audioController.createAudio(i)),
          (this._currentTime = 0),
          this.globalData.audioController.addAudio(this),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      (AudioElement.prototype.prepareFrame = function (e) {
        if (
          (this.prepareRenderableFrame(e, !0),
          this.prepareProperties(e, !0),
          this.tm._placeholder)
        )
          this._currentTime = e / this.data.sr;
        else {
          var t = this.tm.v;
          this._currentTime = t;
        }
      }),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          AudioElement
        ),
        (AudioElement.prototype.renderFrame = function () {
          this.isInRange &&
            this._canPlay &&
            (this._isPlaying
              ? (!this.audio.playing() ||
                  Math.abs(
                    this._currentTime / this.globalData.frameRate -
                      this.audio.seek()
                  ) > 0.1) &&
                this.audio.seek(this._currentTime / this.globalData.frameRate)
              : (this.audio.play(),
                this.audio.seek(this._currentTime / this.globalData.frameRate),
                (this._isPlaying = !0)));
        }),
        (AudioElement.prototype.show = function () {}),
        (AudioElement.prototype.hide = function () {
          this.audio.pause(), (this._isPlaying = !1);
        }),
        (AudioElement.prototype.pause = function () {
          this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1);
        }),
        (AudioElement.prototype.resume = function () {
          this._canPlay = !0;
        }),
        (AudioElement.prototype.setRate = function (e) {
          this.audio.rate(e);
        }),
        (AudioElement.prototype.volume = function (e) {
          this.audio.volume(e);
        }),
        (AudioElement.prototype.getBaseElement = function () {
          return null;
        }),
        (AudioElement.prototype.destroy = function () {}),
        (AudioElement.prototype.sourceRectAtTime = function () {}),
        (AudioElement.prototype.initExpressions = function () {});
      function FootageElement(e, t, r) {
        this.initFrame(),
          this.initRenderable(),
          (this.assetData = t.getAssetData(e.refId)),
          (this.footageData = t.imageLoader.getAsset(this.assetData)),
          this.initBaseData(e, t, r);
      }
      (FootageElement.prototype.prepareFrame = function () {}),
        extendPrototype(
          [RenderableElement, BaseElement, FrameElement],
          FootageElement
        ),
        (FootageElement.prototype.getBaseElement = function () {
          return null;
        }),
        (FootageElement.prototype.renderFrame = function () {}),
        (FootageElement.prototype.destroy = function () {}),
        (FootageElement.prototype.initExpressions = function () {
          this.layerInterface = FootageInterface(this);
        }),
        (FootageElement.prototype.getFootageData = function () {
          return this.footageData;
        });
      function SVGCompElement(e, t, r) {
        (this.layers = e.layers),
          (this.supports3d = !0),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [SVGRenderer, ICompElement, SVGBaseElement],
        SVGCompElement
      );
      function SVGTextLottieElement(e, t, r) {
        (this.textSpans = []),
          (this.renderType = 'svg'),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        SVGTextLottieElement
      ),
        (SVGTextLottieElement.prototype.createContent = function () {
          this.data.singleShape &&
            !this.globalData.fontManager.chars &&
            (this.textContainer = createNS('text'));
        }),
        (SVGTextLottieElement.prototype.buildTextContents = function (e) {
          for (var t = 0, r = e.length, i = [], s = ''; t < r; )
            e[t] === String.fromCharCode(13) || e[t] === String.fromCharCode(3)
              ? (i.push(s), (s = ''))
              : (s += e[t]),
              (t += 1);
          return i.push(s), i;
        }),
        (SVGTextLottieElement.prototype.buildNewText = function () {
          var e,
            t,
            r = this.textProperty.currentData;
          (this.renderedLetters = createSizedArray(r ? r.l.length : 0)),
            r.fc
              ? this.layerElement.setAttribute('fill', this.buildColor(r.fc))
              : this.layerElement.setAttribute('fill', 'rgba(0,0,0,0)'),
            r.sc &&
              (this.layerElement.setAttribute('stroke', this.buildColor(r.sc)),
              this.layerElement.setAttribute('stroke-width', r.sw)),
            this.layerElement.setAttribute('font-size', r.finalSize);
          var i = this.globalData.fontManager.getFontByName(r.f);
          if (i.fClass) this.layerElement.setAttribute('class', i.fClass);
          else {
            this.layerElement.setAttribute('font-family', i.fFamily);
            var s = r.fWeight,
              n = r.fStyle;
            this.layerElement.setAttribute('font-style', n),
              this.layerElement.setAttribute('font-weight', s);
          }
          this.layerElement.setAttribute('aria-label', r.t);
          var l = r.l || [],
            u = !!this.globalData.fontManager.chars;
          t = l.length;
          var d,
            v = this.mHelper,
            E,
            _ = '',
            m = this.data.singleShape,
            y = 0,
            c = 0,
            g = !0,
            p = r.tr * 0.001 * r.finalSize;
          if (m && !u && !r.sz) {
            var a = this.textContainer,
              o = 'start';
            switch (r.j) {
              case 1:
                o = 'end';
                break;
              case 2:
                o = 'middle';
                break;
              default:
                o = 'start';
                break;
            }
            a.setAttribute('text-anchor', o),
              a.setAttribute('letter-spacing', p);
            var h = this.buildTextContents(r.finalText);
            for (
              t = h.length, c = r.ps ? r.ps[1] + r.ascent : 0, e = 0;
              e < t;
              e += 1
            )
              (d = this.textSpans[e] || createNS('tspan')),
                (d.textContent = h[e]),
                d.setAttribute('x', 0),
                d.setAttribute('y', c),
                (d.style.display = 'inherit'),
                a.appendChild(d),
                (this.textSpans[e] = d),
                (c += r.finalLineHeight);
            this.layerElement.appendChild(a);
          } else {
            var f = this.textSpans.length,
              b,
              P;
            for (e = 0; e < t; e += 1)
              (!u || !m || e === 0) &&
                ((d =
                  f > e ? this.textSpans[e] : createNS(u ? 'path' : 'text')),
                f <= e &&
                  (d.setAttribute('stroke-linecap', 'butt'),
                  d.setAttribute('stroke-linejoin', 'round'),
                  d.setAttribute('stroke-miterlimit', '4'),
                  (this.textSpans[e] = d),
                  this.layerElement.appendChild(d)),
                (d.style.display = 'inherit')),
                v.reset(),
                v.scale(r.finalSize / 100, r.finalSize / 100),
                m &&
                  (l[e].n &&
                    ((y = -p), (c += r.yOffset), (c += g ? 1 : 0), (g = !1)),
                  this.applyTextPropertiesToMatrix(r, v, l[e].line, y, c),
                  (y += l[e].l || 0),
                  (y += p)),
                u
                  ? ((P = this.globalData.fontManager.getCharData(
                      r.finalText[e],
                      i.fStyle,
                      this.globalData.fontManager.getFontByName(r.f).fFamily
                    )),
                    (b = (P && P.data) || {}),
                    (E = b.shapes ? b.shapes[0].it : []),
                    m
                      ? (_ += this.createPathShape(v, E))
                      : d.setAttribute('d', this.createPathShape(v, E)))
                  : (m &&
                      d.setAttribute(
                        'transform',
                        'translate(' + v.props[12] + ',' + v.props[13] + ')'
                      ),
                    (d.textContent = l[e].val),
                    d.setAttributeNS(
                      'http://www.w3.org/XML/1998/namespace',
                      'xml:space',
                      'preserve'
                    ));
            m && d && d.setAttribute('d', _);
          }
          for (; e < this.textSpans.length; )
            (this.textSpans[e].style.display = 'none'), (e += 1);
          this._sizeChanged = !0;
        }),
        (SVGTextLottieElement.prototype.sourceRectAtTime = function () {
          if (
            (this.prepareFrame(this.comp.renderedFrame - this.data.st),
            this.renderInnerContent(),
            this._sizeChanged)
          ) {
            this._sizeChanged = !1;
            var e = this.layerElement.getBBox();
            this.bbox = {
              top: e.y,
              left: e.x,
              width: e.width,
              height: e.height,
            };
          }
          return this.bbox;
        }),
        (SVGTextLottieElement.prototype.renderInnerContent = function () {
          if (
            !this.data.singleShape &&
            (this.textAnimator.getMeasures(
              this.textProperty.currentData,
              this.lettersChangedFlag
            ),
            this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)
          ) {
            this._sizeChanged = !0;
            var e,
              t,
              r = this.textAnimator.renderedLetters,
              i = this.textProperty.currentData.l;
            t = i.length;
            var s, n;
            for (e = 0; e < t; e += 1)
              i[e].n ||
                ((s = r[e]),
                (n = this.textSpans[e]),
                s._mdf.m && n.setAttribute('transform', s.m),
                s._mdf.o && n.setAttribute('opacity', s.o),
                s._mdf.sw && n.setAttribute('stroke-width', s.sw),
                s._mdf.sc && n.setAttribute('stroke', s.sc),
                s._mdf.fc && n.setAttribute('fill', s.fc));
          }
        });
      function SVGShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          this.initElement(e, t, r),
          (this.prevViewData = []);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          SVGBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        SVGShapeElement
      ),
        (SVGShapeElement.prototype.initSecondaryElement = function () {}),
        (SVGShapeElement.prototype.identityMatrix = new Matrix()),
        (SVGShapeElement.prototype.buildExpressionInterface = function () {}),
        (SVGShapeElement.prototype.createContent = function () {
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.layerElement,
            0,
            [],
            !0
          ),
            this.filterUniqueShapes();
        }),
        (SVGShapeElement.prototype.filterUniqueShapes = function () {
          var e,
            t = this.shapes.length,
            r,
            i,
            s = this.stylesList.length,
            n,
            l = [],
            u = !1;
          for (i = 0; i < s; i += 1) {
            for (
              n = this.stylesList[i], u = !1, l.length = 0, e = 0;
              e < t;
              e += 1
            )
              (r = this.shapes[e]),
                r.styles.indexOf(n) !== -1 &&
                  (l.push(r), (u = r._isAnimated || u));
            l.length > 1 && u && this.setShapesAsAnimated(l);
          }
        }),
        (SVGShapeElement.prototype.setShapesAsAnimated = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) e[t].setAsAnimated();
        }),
        (SVGShapeElement.prototype.createStyleElement = function (e, t) {
          var r,
            i = new SVGStyleData(e, t),
            s = i.pElem;
          if (e.ty === 'st') r = new SVGStrokeStyleData(this, e, i);
          else if (e.ty === 'fl') r = new SVGFillStyleData(this, e, i);
          else if (e.ty === 'gf' || e.ty === 'gs') {
            var n =
              e.ty === 'gf'
                ? SVGGradientFillStyleData
                : SVGGradientStrokeStyleData;
            (r = new n(this, e, i)),
              this.globalData.defs.appendChild(r.gf),
              r.maskId &&
                (this.globalData.defs.appendChild(r.ms),
                this.globalData.defs.appendChild(r.of),
                s.setAttribute(
                  'mask',
                  'url(' + locationHref + '#' + r.maskId + ')'
                ));
          }
          return (
            (e.ty === 'st' || e.ty === 'gs') &&
              (s.setAttribute('stroke-linecap', lineCapEnum[e.lc || 2]),
              s.setAttribute('stroke-linejoin', lineJoinEnum[e.lj || 2]),
              s.setAttribute('fill-opacity', '0'),
              e.lj === 1 && s.setAttribute('stroke-miterlimit', e.ml)),
            e.r === 2 && s.setAttribute('fill-rule', 'evenodd'),
            e.ln && s.setAttribute('id', e.ln),
            e.cl && s.setAttribute('class', e.cl),
            e.bm && (s.style['mix-blend-mode'] = getBlendMode(e.bm)),
            this.stylesList.push(i),
            this.addToAnimatedContents(e, r),
            r
          );
        }),
        (SVGShapeElement.prototype.createGroupElement = function (e) {
          var t = new ShapeGroupData();
          return (
            e.ln && t.gr.setAttribute('id', e.ln),
            e.cl && t.gr.setAttribute('class', e.cl),
            e.bm && (t.gr.style['mix-blend-mode'] = getBlendMode(e.bm)),
            t
          );
        }),
        (SVGShapeElement.prototype.createTransformElement = function (e, t) {
          var r = TransformPropertyFactory.getTransformProperty(this, e, this),
            i = new SVGTransformData(r, r.o, t);
          return this.addToAnimatedContents(e, i), i;
        }),
        (SVGShapeElement.prototype.createShapeElement = function (e, t, r) {
          var i = 4;
          e.ty === 'rc'
            ? (i = 5)
            : e.ty === 'el'
            ? (i = 6)
            : e.ty === 'sr' && (i = 7);
          var s = ShapePropertyFactory.getShapeProp(this, e, i, this),
            n = new SVGShapeData(t, r, s);
          return (
            this.shapes.push(n),
            this.addShapeToModifiers(n),
            this.addToAnimatedContents(e, n),
            n
          );
        }),
        (SVGShapeElement.prototype.addToAnimatedContents = function (e, t) {
          for (var r = 0, i = this.animatedContents.length; r < i; ) {
            if (this.animatedContents[r].element === t) return;
            r += 1;
          }
          this.animatedContents.push({
            fn: SVGElementsRenderer.createRenderFunction(e),
            element: t,
            data: e,
          });
        }),
        (SVGShapeElement.prototype.setElementStyles = function (e) {
          var t = e.styles,
            r,
            i = this.stylesList.length;
          for (r = 0; r < i; r += 1)
            this.stylesList[r].closed || t.push(this.stylesList[r]);
        }),
        (SVGShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var e,
            t = this.itemsData.length;
          for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              this.layerElement,
              0,
              [],
              !0
            ),
              this.filterUniqueShapes(),
              t = this.dynamicProperties.length,
              e = 0;
            e < t;
            e += 1
          )
            this.dynamicProperties[e].getValue();
          this.renderModifiers();
        }),
        (SVGShapeElement.prototype.searchShapes = function (
          e,
          t,
          r,
          i,
          s,
          n,
          l
        ) {
          var u = [].concat(n),
            d,
            v = e.length - 1,
            E,
            _,
            m = [],
            y = [],
            c,
            g,
            p;
          for (d = v; d >= 0; d -= 1) {
            if (
              ((p = this.searchProcessedElement(e[d])),
              p ? (t[d] = r[p - 1]) : (e[d]._render = l),
              e[d].ty === 'fl' ||
                e[d].ty === 'st' ||
                e[d].ty === 'gf' ||
                e[d].ty === 'gs')
            )
              p
                ? (t[d].style.closed = !1)
                : (t[d] = this.createStyleElement(e[d], s)),
                e[d]._render && i.appendChild(t[d].style.pElem),
                m.push(t[d].style);
            else if (e[d].ty === 'gr') {
              if (!p) t[d] = this.createGroupElement(e[d]);
              else
                for (_ = t[d].it.length, E = 0; E < _; E += 1)
                  t[d].prevViewData[E] = t[d].it[E];
              this.searchShapes(
                e[d].it,
                t[d].it,
                t[d].prevViewData,
                t[d].gr,
                s + 1,
                u,
                l
              ),
                e[d]._render && i.appendChild(t[d].gr);
            } else
              e[d].ty === 'tr'
                ? (p || (t[d] = this.createTransformElement(e[d], i)),
                  (c = t[d].transform),
                  u.push(c))
                : e[d].ty === 'sh' ||
                  e[d].ty === 'rc' ||
                  e[d].ty === 'el' ||
                  e[d].ty === 'sr'
                ? (p || (t[d] = this.createShapeElement(e[d], u, s)),
                  this.setElementStyles(t[d]))
                : e[d].ty === 'tm' ||
                  e[d].ty === 'rd' ||
                  e[d].ty === 'ms' ||
                  e[d].ty === 'pb'
                ? (p
                    ? ((g = t[d]), (g.closed = !1))
                    : ((g = ShapeModifiers.getModifier(e[d].ty)),
                      g.init(this, e[d]),
                      (t[d] = g),
                      this.shapeModifiers.push(g)),
                  y.push(g))
                : e[d].ty === 'rp' &&
                  (p
                    ? ((g = t[d]), (g.closed = !0))
                    : ((g = ShapeModifiers.getModifier(e[d].ty)),
                      (t[d] = g),
                      g.init(this, e, d, t),
                      this.shapeModifiers.push(g),
                      (l = !1)),
                  y.push(g));
            this.addProcessedElement(e[d], d + 1);
          }
          for (v = m.length, d = 0; d < v; d += 1) m[d].closed = !0;
          for (v = y.length, d = 0; d < v; d += 1) y[d].closed = !0;
        }),
        (SVGShapeElement.prototype.renderInnerContent = function () {
          this.renderModifiers();
          var e,
            t = this.stylesList.length;
          for (e = 0; e < t; e += 1) this.stylesList[e].reset();
          for (this.renderShape(), e = 0; e < t; e += 1)
            (this.stylesList[e]._mdf || this._isFirstFrame) &&
              (this.stylesList[e].msElem &&
                (this.stylesList[e].msElem.setAttribute(
                  'd',
                  this.stylesList[e].d
                ),
                (this.stylesList[e].d = 'M0 0' + this.stylesList[e].d)),
              this.stylesList[e].pElem.setAttribute(
                'd',
                this.stylesList[e].d || 'M0 0'
              ));
        }),
        (SVGShapeElement.prototype.renderShape = function () {
          var e,
            t = this.animatedContents.length,
            r;
          for (e = 0; e < t; e += 1)
            (r = this.animatedContents[e]),
              (this._isFirstFrame || r.element._isAnimated) &&
                r.data !== !0 &&
                r.fn(r.data, r.element, this._isFirstFrame);
        }),
        (SVGShapeElement.prototype.destroy = function () {
          this.destroyBaseElement(),
            (this.shapesData = null),
            (this.itemsData = null);
        });
      function SVGTintFilter(e, t) {
        this.filterManager = t;
        var r = createNS('feColorMatrix');
        if (
          (r.setAttribute('type', 'matrix'),
          r.setAttribute('color-interpolation-filters', 'linearRGB'),
          r.setAttribute(
            'values',
            '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
          ),
          r.setAttribute('result', 'f1'),
          e.appendChild(r),
          (r = createNS('feColorMatrix')),
          r.setAttribute('type', 'matrix'),
          r.setAttribute('color-interpolation-filters', 'sRGB'),
          r.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
          r.setAttribute('result', 'f2'),
          e.appendChild(r),
          (this.matrixFilter = r),
          t.effectElements[2].p.v !== 100 || t.effectElements[2].p.k)
        ) {
          var i = createNS('feMerge');
          e.appendChild(i);
          var s;
          (s = createNS('feMergeNode')),
            s.setAttribute('in', 'SourceGraphic'),
            i.appendChild(s),
            (s = createNS('feMergeNode')),
            s.setAttribute('in', 'f2'),
            i.appendChild(s);
        }
      }
      SVGTintFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = this.filterManager.effectElements[0].p.v,
            r = this.filterManager.effectElements[1].p.v,
            i = this.filterManager.effectElements[2].p.v / 100;
          this.matrixFilter.setAttribute(
            'values',
            r[0] -
              t[0] +
              ' 0 0 0 ' +
              t[0] +
              ' ' +
              (r[1] - t[1]) +
              ' 0 0 0 ' +
              t[1] +
              ' ' +
              (r[2] - t[2]) +
              ' 0 0 0 ' +
              t[2] +
              ' 0 0 0 ' +
              i +
              ' 0'
          );
        }
      };
      function SVGFillFilter(e, t) {
        this.filterManager = t;
        var r = createNS('feColorMatrix');
        r.setAttribute('type', 'matrix'),
          r.setAttribute('color-interpolation-filters', 'sRGB'),
          r.setAttribute('values', '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0'),
          e.appendChild(r),
          (this.matrixFilter = r);
      }
      SVGFillFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = this.filterManager.effectElements[2].p.v,
            r = this.filterManager.effectElements[6].p.v;
          this.matrixFilter.setAttribute(
            'values',
            '0 0 0 0 ' +
              t[0] +
              ' 0 0 0 0 ' +
              t[1] +
              ' 0 0 0 0 ' +
              t[2] +
              ' 0 0 0 ' +
              r +
              ' 0'
          );
        }
      };
      function SVGGaussianBlurEffect(e, t) {
        e.setAttribute('x', '-100%'),
          e.setAttribute('y', '-100%'),
          e.setAttribute('width', '300%'),
          e.setAttribute('height', '300%'),
          (this.filterManager = t);
        var r = createNS('feGaussianBlur');
        e.appendChild(r), (this.feGaussianBlur = r);
      }
      SVGGaussianBlurEffect.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = 0.3,
            r = this.filterManager.effectElements[0].p.v * t,
            i = this.filterManager.effectElements[1].p.v,
            s = i == 3 ? 0 : r,
            n = i == 2 ? 0 : r;
          this.feGaussianBlur.setAttribute('stdDeviation', s + ' ' + n);
          var l =
            this.filterManager.effectElements[2].p.v == 1
              ? 'wrap'
              : 'duplicate';
          this.feGaussianBlur.setAttribute('edgeMode', l);
        }
      };
      function SVGStrokeEffect(e, t) {
        (this.initialized = !1),
          (this.filterManager = t),
          (this.elem = e),
          (this.paths = []);
      }
      (SVGStrokeEffect.prototype.initialize = function () {
        var e =
            this.elem.layerElement.children ||
            this.elem.layerElement.childNodes,
          t,
          r,
          i,
          s;
        for (
          this.filterManager.effectElements[1].p.v === 1
            ? ((s = this.elem.maskManager.masksProperties.length), (i = 0))
            : ((i = this.filterManager.effectElements[0].p.v - 1), (s = i + 1)),
            r = createNS('g'),
            r.setAttribute('fill', 'none'),
            r.setAttribute('stroke-linecap', 'round'),
            r.setAttribute('stroke-dashoffset', 1),
            i;
          i < s;
          i += 1
        )
          (t = createNS('path')),
            r.appendChild(t),
            this.paths.push({ p: t, m: i });
        if (this.filterManager.effectElements[10].p.v === 3) {
          var n = createNS('mask'),
            l = createElementID();
          n.setAttribute('id', l),
            n.setAttribute('mask-type', 'alpha'),
            n.appendChild(r),
            this.elem.globalData.defs.appendChild(n);
          var u = createNS('g');
          for (
            u.setAttribute('mask', 'url(' + locationHref + '#' + l + ')');
            e[0];

          )
            u.appendChild(e[0]);
          this.elem.layerElement.appendChild(u),
            (this.masker = n),
            r.setAttribute('stroke', '#fff');
        } else if (
          this.filterManager.effectElements[10].p.v === 1 ||
          this.filterManager.effectElements[10].p.v === 2
        ) {
          if (this.filterManager.effectElements[10].p.v === 2)
            for (
              e =
                this.elem.layerElement.children ||
                this.elem.layerElement.childNodes;
              e.length;

            )
              this.elem.layerElement.removeChild(e[0]);
          this.elem.layerElement.appendChild(r),
            this.elem.layerElement.removeAttribute('mask'),
            r.setAttribute('stroke', '#fff');
        }
        (this.initialized = !0), (this.pathMasker = r);
      }),
        (SVGStrokeEffect.prototype.renderFrame = function (e) {
          this.initialized || this.initialize();
          var t,
            r = this.paths.length,
            i,
            s;
          for (t = 0; t < r; t += 1)
            if (
              this.paths[t].m !== -1 &&
              ((i = this.elem.maskManager.viewData[this.paths[t].m]),
              (s = this.paths[t].p),
              (e || this.filterManager._mdf || i.prop._mdf) &&
                s.setAttribute('d', i.lastPath),
              e ||
                this.filterManager.effectElements[9].p._mdf ||
                this.filterManager.effectElements[4].p._mdf ||
                this.filterManager.effectElements[7].p._mdf ||
                this.filterManager.effectElements[8].p._mdf ||
                i.prop._mdf)
            ) {
              var n;
              if (
                this.filterManager.effectElements[7].p.v !== 0 ||
                this.filterManager.effectElements[8].p.v !== 100
              ) {
                var l =
                    Math.min(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v
                    ) * 0.01,
                  u =
                    Math.max(
                      this.filterManager.effectElements[7].p.v,
                      this.filterManager.effectElements[8].p.v
                    ) * 0.01,
                  d = s.getTotalLength();
                n = '0 0 0 ' + d * l + ' ';
                var v = d * (u - l),
                  E =
                    1 +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01,
                  _ = Math.floor(v / E),
                  m;
                for (m = 0; m < _; m += 1)
                  n +=
                    '1 ' +
                    this.filterManager.effectElements[4].p.v *
                      2 *
                      this.filterManager.effectElements[9].p.v *
                      0.01 +
                    ' ';
                n += '0 ' + d * 10 + ' 0 0';
              } else
                n =
                  '1 ' +
                  this.filterManager.effectElements[4].p.v *
                    2 *
                    this.filterManager.effectElements[9].p.v *
                    0.01;
              s.setAttribute('stroke-dasharray', n);
            }
          if (
            ((e || this.filterManager.effectElements[4].p._mdf) &&
              this.pathMasker.setAttribute(
                'stroke-width',
                this.filterManager.effectElements[4].p.v * 2
              ),
            (e || this.filterManager.effectElements[6].p._mdf) &&
              this.pathMasker.setAttribute(
                'opacity',
                this.filterManager.effectElements[6].p.v
              ),
            (this.filterManager.effectElements[10].p.v === 1 ||
              this.filterManager.effectElements[10].p.v === 2) &&
              (e || this.filterManager.effectElements[3].p._mdf))
          ) {
            var y = this.filterManager.effectElements[3].p.v;
            this.pathMasker.setAttribute(
              'stroke',
              'rgb(' +
                bmFloor(y[0] * 255) +
                ',' +
                bmFloor(y[1] * 255) +
                ',' +
                bmFloor(y[2] * 255) +
                ')'
            );
          }
        });
      function SVGTritoneFilter(e, t) {
        this.filterManager = t;
        var r = createNS('feColorMatrix');
        r.setAttribute('type', 'matrix'),
          r.setAttribute('color-interpolation-filters', 'linearRGB'),
          r.setAttribute(
            'values',
            '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0'
          ),
          r.setAttribute('result', 'f1'),
          e.appendChild(r);
        var i = createNS('feComponentTransfer');
        i.setAttribute('color-interpolation-filters', 'sRGB'),
          e.appendChild(i),
          (this.matrixFilter = i);
        var s = createNS('feFuncR');
        s.setAttribute('type', 'table'), i.appendChild(s), (this.feFuncR = s);
        var n = createNS('feFuncG');
        n.setAttribute('type', 'table'), i.appendChild(n), (this.feFuncG = n);
        var l = createNS('feFuncB');
        l.setAttribute('type', 'table'), i.appendChild(l), (this.feFuncB = l);
      }
      SVGTritoneFilter.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          var t = this.filterManager.effectElements[0].p.v,
            r = this.filterManager.effectElements[1].p.v,
            i = this.filterManager.effectElements[2].p.v,
            s = i[0] + ' ' + r[0] + ' ' + t[0],
            n = i[1] + ' ' + r[1] + ' ' + t[1],
            l = i[2] + ' ' + r[2] + ' ' + t[2];
          this.feFuncR.setAttribute('tableValues', s),
            this.feFuncG.setAttribute('tableValues', n),
            this.feFuncB.setAttribute('tableValues', l);
        }
      };
      function SVGProLevelsFilter(e, t) {
        this.filterManager = t;
        var r = this.filterManager.effectElements,
          i = createNS('feComponentTransfer');
        (r[10].p.k ||
          r[10].p.v !== 0 ||
          r[11].p.k ||
          r[11].p.v !== 1 ||
          r[12].p.k ||
          r[12].p.v !== 1 ||
          r[13].p.k ||
          r[13].p.v !== 0 ||
          r[14].p.k ||
          r[14].p.v !== 1) &&
          (this.feFuncR = this.createFeFunc('feFuncR', i)),
          (r[17].p.k ||
            r[17].p.v !== 0 ||
            r[18].p.k ||
            r[18].p.v !== 1 ||
            r[19].p.k ||
            r[19].p.v !== 1 ||
            r[20].p.k ||
            r[20].p.v !== 0 ||
            r[21].p.k ||
            r[21].p.v !== 1) &&
            (this.feFuncG = this.createFeFunc('feFuncG', i)),
          (r[24].p.k ||
            r[24].p.v !== 0 ||
            r[25].p.k ||
            r[25].p.v !== 1 ||
            r[26].p.k ||
            r[26].p.v !== 1 ||
            r[27].p.k ||
            r[27].p.v !== 0 ||
            r[28].p.k ||
            r[28].p.v !== 1) &&
            (this.feFuncB = this.createFeFunc('feFuncB', i)),
          (r[31].p.k ||
            r[31].p.v !== 0 ||
            r[32].p.k ||
            r[32].p.v !== 1 ||
            r[33].p.k ||
            r[33].p.v !== 1 ||
            r[34].p.k ||
            r[34].p.v !== 0 ||
            r[35].p.k ||
            r[35].p.v !== 1) &&
            (this.feFuncA = this.createFeFunc('feFuncA', i)),
          (this.feFuncR || this.feFuncG || this.feFuncB || this.feFuncA) &&
            (i.setAttribute('color-interpolation-filters', 'sRGB'),
            e.appendChild(i),
            (i = createNS('feComponentTransfer'))),
          (r[3].p.k ||
            r[3].p.v !== 0 ||
            r[4].p.k ||
            r[4].p.v !== 1 ||
            r[5].p.k ||
            r[5].p.v !== 1 ||
            r[6].p.k ||
            r[6].p.v !== 0 ||
            r[7].p.k ||
            r[7].p.v !== 1) &&
            (i.setAttribute('color-interpolation-filters', 'sRGB'),
            e.appendChild(i),
            (this.feFuncRComposed = this.createFeFunc('feFuncR', i)),
            (this.feFuncGComposed = this.createFeFunc('feFuncG', i)),
            (this.feFuncBComposed = this.createFeFunc('feFuncB', i)));
      }
      (SVGProLevelsFilter.prototype.createFeFunc = function (e, t) {
        var r = createNS(e);
        return r.setAttribute('type', 'table'), t.appendChild(r), r;
      }),
        (SVGProLevelsFilter.prototype.getTableValue = function (e, t, r, i, s) {
          for (
            var n = 0,
              l = 256,
              u,
              d = Math.min(e, t),
              v = Math.max(e, t),
              E = Array.call(null, { length: l }),
              _,
              m = 0,
              y = s - i,
              c = t - e;
            n <= 256;

          )
            (u = n / 256),
              u <= d
                ? (_ = c < 0 ? s : i)
                : u >= v
                ? (_ = c < 0 ? i : s)
                : (_ = i + y * Math.pow((u - e) / c, 1 / r)),
              (E[m] = _),
              (m += 1),
              (n += 256 / (l - 1));
          return E.join(' ');
        }),
        (SVGProLevelsFilter.prototype.renderFrame = function (e) {
          if (e || this.filterManager._mdf) {
            var t,
              r = this.filterManager.effectElements;
            this.feFuncRComposed &&
              (e ||
                r[3].p._mdf ||
                r[4].p._mdf ||
                r[5].p._mdf ||
                r[6].p._mdf ||
                r[7].p._mdf) &&
              ((t = this.getTableValue(
                r[3].p.v,
                r[4].p.v,
                r[5].p.v,
                r[6].p.v,
                r[7].p.v
              )),
              this.feFuncRComposed.setAttribute('tableValues', t),
              this.feFuncGComposed.setAttribute('tableValues', t),
              this.feFuncBComposed.setAttribute('tableValues', t)),
              this.feFuncR &&
                (e ||
                  r[10].p._mdf ||
                  r[11].p._mdf ||
                  r[12].p._mdf ||
                  r[13].p._mdf ||
                  r[14].p._mdf) &&
                ((t = this.getTableValue(
                  r[10].p.v,
                  r[11].p.v,
                  r[12].p.v,
                  r[13].p.v,
                  r[14].p.v
                )),
                this.feFuncR.setAttribute('tableValues', t)),
              this.feFuncG &&
                (e ||
                  r[17].p._mdf ||
                  r[18].p._mdf ||
                  r[19].p._mdf ||
                  r[20].p._mdf ||
                  r[21].p._mdf) &&
                ((t = this.getTableValue(
                  r[17].p.v,
                  r[18].p.v,
                  r[19].p.v,
                  r[20].p.v,
                  r[21].p.v
                )),
                this.feFuncG.setAttribute('tableValues', t)),
              this.feFuncB &&
                (e ||
                  r[24].p._mdf ||
                  r[25].p._mdf ||
                  r[26].p._mdf ||
                  r[27].p._mdf ||
                  r[28].p._mdf) &&
                ((t = this.getTableValue(
                  r[24].p.v,
                  r[25].p.v,
                  r[26].p.v,
                  r[27].p.v,
                  r[28].p.v
                )),
                this.feFuncB.setAttribute('tableValues', t)),
              this.feFuncA &&
                (e ||
                  r[31].p._mdf ||
                  r[32].p._mdf ||
                  r[33].p._mdf ||
                  r[34].p._mdf ||
                  r[35].p._mdf) &&
                ((t = this.getTableValue(
                  r[31].p.v,
                  r[32].p.v,
                  r[33].p.v,
                  r[34].p.v,
                  r[35].p.v
                )),
                this.feFuncA.setAttribute('tableValues', t));
          }
        });
      function SVGDropShadowEffect(e, t) {
        var r = t.container.globalData.renderConfig.filterSize;
        e.setAttribute('x', r.x),
          e.setAttribute('y', r.y),
          e.setAttribute('width', r.width),
          e.setAttribute('height', r.height),
          (this.filterManager = t);
        var i = createNS('feGaussianBlur');
        i.setAttribute('in', 'SourceAlpha'),
          i.setAttribute('result', 'drop_shadow_1'),
          i.setAttribute('stdDeviation', '0'),
          (this.feGaussianBlur = i),
          e.appendChild(i);
        var s = createNS('feOffset');
        s.setAttribute('dx', '25'),
          s.setAttribute('dy', '0'),
          s.setAttribute('in', 'drop_shadow_1'),
          s.setAttribute('result', 'drop_shadow_2'),
          (this.feOffset = s),
          e.appendChild(s);
        var n = createNS('feFlood');
        n.setAttribute('flood-color', '#00ff00'),
          n.setAttribute('flood-opacity', '1'),
          n.setAttribute('result', 'drop_shadow_3'),
          (this.feFlood = n),
          e.appendChild(n);
        var l = createNS('feComposite');
        l.setAttribute('in', 'drop_shadow_3'),
          l.setAttribute('in2', 'drop_shadow_2'),
          l.setAttribute('operator', 'in'),
          l.setAttribute('result', 'drop_shadow_4'),
          e.appendChild(l);
        var u = createNS('feMerge');
        e.appendChild(u);
        var d;
        (d = createNS('feMergeNode')),
          u.appendChild(d),
          (d = createNS('feMergeNode')),
          d.setAttribute('in', 'SourceGraphic'),
          (this.feMergeNode = d),
          (this.feMerge = u),
          (this.originalNodeAdded = !1),
          u.appendChild(d);
      }
      SVGDropShadowEffect.prototype.renderFrame = function (e) {
        if (e || this.filterManager._mdf) {
          if (
            ((e || this.filterManager.effectElements[4].p._mdf) &&
              this.feGaussianBlur.setAttribute(
                'stdDeviation',
                this.filterManager.effectElements[4].p.v / 4
              ),
            e || this.filterManager.effectElements[0].p._mdf)
          ) {
            var t = this.filterManager.effectElements[0].p.v;
            this.feFlood.setAttribute(
              'flood-color',
              rgbToHex(
                Math.round(t[0] * 255),
                Math.round(t[1] * 255),
                Math.round(t[2] * 255)
              )
            );
          }
          if (
            ((e || this.filterManager.effectElements[1].p._mdf) &&
              this.feFlood.setAttribute(
                'flood-opacity',
                this.filterManager.effectElements[1].p.v / 255
              ),
            e ||
              this.filterManager.effectElements[2].p._mdf ||
              this.filterManager.effectElements[3].p._mdf)
          ) {
            var r = this.filterManager.effectElements[3].p.v,
              i = (this.filterManager.effectElements[2].p.v - 90) * degToRads,
              s = r * Math.cos(i),
              n = r * Math.sin(i);
            this.feOffset.setAttribute('dx', s),
              this.feOffset.setAttribute('dy', n);
          }
        }
      };
      var _svgMatteSymbols = [];
      function SVGMatte3Effect(e, t, r) {
        (this.initialized = !1),
          (this.filterManager = t),
          (this.filterElem = e),
          (this.elem = r),
          (r.matteElement = createNS('g')),
          r.matteElement.appendChild(r.layerElement),
          r.matteElement.appendChild(r.transformedElement),
          (r.baseElement = r.matteElement);
      }
      (SVGMatte3Effect.prototype.findSymbol = function (e) {
        for (var t = 0, r = _svgMatteSymbols.length; t < r; ) {
          if (_svgMatteSymbols[t] === e) return _svgMatteSymbols[t];
          t += 1;
        }
        return null;
      }),
        (SVGMatte3Effect.prototype.replaceInParent = function (e, t) {
          var r = e.layerElement.parentNode;
          if (!!r) {
            for (
              var i = r.children, s = 0, n = i.length;
              s < n && i[s] !== e.layerElement;

            )
              s += 1;
            var l;
            s <= n - 2 && (l = i[s + 1]);
            var u = createNS('use');
            u.setAttribute('href', '#' + t),
              l ? r.insertBefore(u, l) : r.appendChild(u);
          }
        }),
        (SVGMatte3Effect.prototype.setElementAsMask = function (e, t) {
          if (!this.findSymbol(t)) {
            var r = createElementID(),
              i = createNS('mask');
            i.setAttribute('id', t.layerId),
              i.setAttribute('mask-type', 'alpha'),
              _svgMatteSymbols.push(t);
            var s = e.globalData.defs;
            s.appendChild(i);
            var n = createNS('symbol');
            n.setAttribute('id', r),
              this.replaceInParent(t, r),
              n.appendChild(t.layerElement),
              s.appendChild(n);
            var l = createNS('use');
            l.setAttribute('href', '#' + r),
              i.appendChild(l),
              (t.data.hd = !1),
              t.show();
          }
          e.setMatte(t.layerId);
        }),
        (SVGMatte3Effect.prototype.initialize = function () {
          for (
            var e = this.filterManager.effectElements[0].p.v,
              t = this.elem.comp.elements,
              r = 0,
              i = t.length;
            r < i;

          )
            t[r] &&
              t[r].data.ind === e &&
              this.setElementAsMask(this.elem, t[r]),
              (r += 1);
          this.initialized = !0;
        }),
        (SVGMatte3Effect.prototype.renderFrame = function () {
          this.initialized || this.initialize();
        });
      function SVGEffects(e) {
        var t,
          r = e.data.ef ? e.data.ef.length : 0,
          i = createElementID(),
          s = filtersFactory.createFilter(i, !0),
          n = 0;
        this.filters = [];
        var l;
        for (t = 0; t < r; t += 1)
          (l = null),
            e.data.ef[t].ty === 20
              ? ((n += 1),
                (l = new SVGTintFilter(s, e.effectsManager.effectElements[t])))
              : e.data.ef[t].ty === 21
              ? ((n += 1),
                (l = new SVGFillFilter(s, e.effectsManager.effectElements[t])))
              : e.data.ef[t].ty === 22
              ? (l = new SVGStrokeEffect(e, e.effectsManager.effectElements[t]))
              : e.data.ef[t].ty === 23
              ? ((n += 1),
                (l = new SVGTritoneFilter(
                  s,
                  e.effectsManager.effectElements[t]
                )))
              : e.data.ef[t].ty === 24
              ? ((n += 1),
                (l = new SVGProLevelsFilter(
                  s,
                  e.effectsManager.effectElements[t]
                )))
              : e.data.ef[t].ty === 25
              ? ((n += 1),
                (l = new SVGDropShadowEffect(
                  s,
                  e.effectsManager.effectElements[t]
                )))
              : e.data.ef[t].ty === 28
              ? (l = new SVGMatte3Effect(
                  s,
                  e.effectsManager.effectElements[t],
                  e
                ))
              : e.data.ef[t].ty === 29 &&
                ((n += 1),
                (l = new SVGGaussianBlurEffect(
                  s,
                  e.effectsManager.effectElements[t]
                ))),
            l && this.filters.push(l);
        n &&
          (e.globalData.defs.appendChild(s),
          e.layerElement.setAttribute(
            'filter',
            'url(' + locationHref + '#' + i + ')'
          )),
          this.filters.length && e.addRenderableComponent(this);
      }
      SVGEffects.prototype.renderFrame = function (e) {
        var t,
          r = this.filters.length;
        for (t = 0; t < r; t += 1) this.filters[t].renderFrame(e);
      };
      function CVContextData() {
        (this.saved = []),
          (this.cArrPos = 0),
          (this.cTr = new Matrix()),
          (this.cO = 1);
        var e,
          t = 15;
        for (
          this.savedOp = createTypedArray('float32', t), e = 0;
          e < t;
          e += 1
        )
          this.saved[e] = createTypedArray('float32', 16);
        this._length = t;
      }
      (CVContextData.prototype.duplicate = function () {
        var e = this._length * 2,
          t = this.savedOp;
        (this.savedOp = createTypedArray('float32', e)), this.savedOp.set(t);
        var r = 0;
        for (r = this._length; r < e; r += 1)
          this.saved[r] = createTypedArray('float32', 16);
        this._length = e;
      }),
        (CVContextData.prototype.reset = function () {
          (this.cArrPos = 0), this.cTr.reset(), (this.cO = 1);
        });
      function CVBaseElement() {}
      (CVBaseElement.prototype = {
        createElements: function () {},
        initRendererElement: function () {},
        createContainerElements: function () {
          (this.canvasContext = this.globalData.canvasContext),
            (this.renderableEffectsManager = new CVEffects(this));
        },
        createContent: function () {},
        setBlendMode: function () {
          var e = this.globalData;
          if (e.blendMode !== this.data.bm) {
            e.blendMode = this.data.bm;
            var t = getBlendMode(this.data.bm);
            e.canvasContext.globalCompositeOperation = t;
          }
        },
        createRenderableComponents: function () {
          this.maskManager = new CVMaskElement(this.data, this);
        },
        hideElement: function () {
          !this.hidden &&
            (!this.isInRange || this.isTransparent) &&
            (this.hidden = !0);
        },
        showElement: function () {
          this.isInRange &&
            !this.isTransparent &&
            ((this.hidden = !1),
            (this._isFirstFrame = !0),
            (this.maskManager._isFirstFrame = !0));
        },
        renderFrame: function () {
          if (!(this.hidden || this.data.hd)) {
            this.renderTransform(),
              this.renderRenderable(),
              this.setBlendMode();
            var e = this.data.ty === 0;
            this.globalData.renderer.save(e),
              this.globalData.renderer.ctxTransform(
                this.finalTransform.mat.props
              ),
              this.globalData.renderer.ctxOpacity(
                this.finalTransform.mProp.o.v
              ),
              this.renderInnerContent(),
              this.globalData.renderer.restore(e),
              this.maskManager.hasMasks && this.globalData.renderer.restore(!0),
              this._isFirstFrame && (this._isFirstFrame = !1);
          }
        },
        destroy: function () {
          (this.canvasContext = null),
            (this.data = null),
            (this.globalData = null),
            this.maskManager.destroy();
        },
        mHelper: new Matrix(),
      }),
        (CVBaseElement.prototype.hide = CVBaseElement.prototype.hideElement),
        (CVBaseElement.prototype.show = CVBaseElement.prototype.showElement);
      function CVImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)),
          (this.img = t.imageLoader.getAsset(this.assetData)),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVImageElement
      ),
        (CVImageElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVImageElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVImageElement.prototype.createContent = function () {
          if (
            this.img.width &&
            (this.assetData.w !== this.img.width ||
              this.assetData.h !== this.img.height)
          ) {
            var e = createTag('canvas');
            (e.width = this.assetData.w), (e.height = this.assetData.h);
            var t = e.getContext('2d'),
              r = this.img.width,
              i = this.img.height,
              s = r / i,
              n = this.assetData.w / this.assetData.h,
              l,
              u,
              d =
                this.assetData.pr ||
                this.globalData.renderConfig.imagePreserveAspectRatio;
            (s > n && d === 'xMidYMid slice') ||
            (s < n && d !== 'xMidYMid slice')
              ? ((u = i), (l = u * n))
              : ((l = r), (u = l / n)),
              t.drawImage(
                this.img,
                (r - l) / 2,
                (i - u) / 2,
                l,
                u,
                0,
                0,
                this.assetData.w,
                this.assetData.h
              ),
              (this.img = e);
          }
        }),
        (CVImageElement.prototype.renderInnerContent = function () {
          this.canvasContext.drawImage(this.img, 0, 0);
        }),
        (CVImageElement.prototype.destroy = function () {
          this.img = null;
        });
      function CVCompElement(e, t, r) {
        (this.completeLayers = !1),
          (this.layers = e.layers),
          (this.pendingElements = []),
          (this.elements = createSizedArray(this.layers.length)),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [CanvasRenderer, ICompElement, CVBaseElement],
        CVCompElement
      ),
        (CVCompElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          e.beginPath(),
            e.moveTo(0, 0),
            e.lineTo(this.data.w, 0),
            e.lineTo(this.data.w, this.data.h),
            e.lineTo(0, this.data.h),
            e.lineTo(0, 0),
            e.clip();
          var t,
            r = this.layers.length;
          for (t = r - 1; t >= 0; t -= 1)
            (this.completeLayers || this.elements[t]) &&
              this.elements[t].renderFrame();
        }),
        (CVCompElement.prototype.destroy = function () {
          var e,
            t = this.layers.length;
          for (e = t - 1; e >= 0; e -= 1)
            this.elements[e] && this.elements[e].destroy();
          (this.layers = null), (this.elements = null);
        });
      function CVMaskElement(e, t) {
        (this.data = e),
          (this.element = t),
          (this.masksProperties = this.data.masksProperties || []),
          (this.viewData = createSizedArray(this.masksProperties.length));
        var r,
          i = this.masksProperties.length,
          s = !1;
        for (r = 0; r < i; r += 1)
          this.masksProperties[r].mode !== 'n' && (s = !0),
            (this.viewData[r] = ShapePropertyFactory.getShapeProp(
              this.element,
              this.masksProperties[r],
              3
            ));
        (this.hasMasks = s), s && this.element.addRenderableComponent(this);
      }
      (CVMaskElement.prototype.renderFrame = function () {
        if (!!this.hasMasks) {
          var e = this.element.finalTransform.mat,
            t = this.element.canvasContext,
            r,
            i = this.masksProperties.length,
            s,
            n,
            l;
          for (t.beginPath(), r = 0; r < i; r += 1)
            if (this.masksProperties[r].mode !== 'n') {
              this.masksProperties[r].inv &&
                (t.moveTo(0, 0),
                t.lineTo(this.element.globalData.compSize.w, 0),
                t.lineTo(
                  this.element.globalData.compSize.w,
                  this.element.globalData.compSize.h
                ),
                t.lineTo(0, this.element.globalData.compSize.h),
                t.lineTo(0, 0)),
                (l = this.viewData[r].v),
                (s = e.applyToPointArray(l.v[0][0], l.v[0][1], 0)),
                t.moveTo(s[0], s[1]);
              var u,
                d = l._length;
              for (u = 1; u < d; u += 1)
                (n = e.applyToTriplePoints(l.o[u - 1], l.i[u], l.v[u])),
                  t.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
              (n = e.applyToTriplePoints(l.o[u - 1], l.i[0], l.v[0])),
                t.bezierCurveTo(n[0], n[1], n[2], n[3], n[4], n[5]);
            }
          this.element.globalData.renderer.save(!0), t.clip();
        }
      }),
        (CVMaskElement.prototype.getMaskProperty =
          MaskElement.prototype.getMaskProperty),
        (CVMaskElement.prototype.destroy = function () {
          this.element = null;
        });
      function CVShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.itemsData = []),
          (this.prevViewData = []),
          (this.shapeModifiers = []),
          (this.processedElements = []),
          (this.transformsManager = new ShapeTransformManager()),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          IShapeElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVShapeElement
      ),
        (CVShapeElement.prototype.initElement =
          RenderableDOMElement.prototype.initElement),
        (CVShapeElement.prototype.transformHelper = { opacity: 1, _opMdf: !1 }),
        (CVShapeElement.prototype.dashResetter = []),
        (CVShapeElement.prototype.createContent = function () {
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            !0,
            []
          );
        }),
        (CVShapeElement.prototype.createStyleElement = function (e, t) {
          var r = {
              data: e,
              type: e.ty,
              preTransforms: this.transformsManager.addTransformSequence(t),
              transforms: [],
              elements: [],
              closed: e.hd === !0,
            },
            i = {};
          if (
            (e.ty === 'fl' || e.ty === 'st'
              ? ((i.c = PropertyFactory.getProp(this, e.c, 1, 255, this)),
                i.c.k ||
                  (r.co =
                    'rgb(' +
                    bmFloor(i.c.v[0]) +
                    ',' +
                    bmFloor(i.c.v[1]) +
                    ',' +
                    bmFloor(i.c.v[2]) +
                    ')'))
              : (e.ty === 'gf' || e.ty === 'gs') &&
                ((i.s = PropertyFactory.getProp(this, e.s, 1, null, this)),
                (i.e = PropertyFactory.getProp(this, e.e, 1, null, this)),
                (i.h = PropertyFactory.getProp(
                  this,
                  e.h || { k: 0 },
                  0,
                  0.01,
                  this
                )),
                (i.a = PropertyFactory.getProp(
                  this,
                  e.a || { k: 0 },
                  0,
                  degToRads,
                  this
                )),
                (i.g = new GradientProperty(this, e.g, this))),
            (i.o = PropertyFactory.getProp(this, e.o, 0, 0.01, this)),
            e.ty === 'st' || e.ty === 'gs')
          ) {
            if (
              ((r.lc = lineCapEnum[e.lc || 2]),
              (r.lj = lineJoinEnum[e.lj || 2]),
              e.lj == 1 && (r.ml = e.ml),
              (i.w = PropertyFactory.getProp(this, e.w, 0, null, this)),
              i.w.k || (r.wi = i.w.v),
              e.d)
            ) {
              var s = new DashProperty(this, e.d, 'canvas', this);
              (i.d = s),
                i.d.k || ((r.da = i.d.dashArray), (r.do = i.d.dashoffset[0]));
            }
          } else r.r = e.r === 2 ? 'evenodd' : 'nonzero';
          return this.stylesList.push(r), (i.style = r), i;
        }),
        (CVShapeElement.prototype.createGroupElement = function () {
          var e = { it: [], prevViewData: [] };
          return e;
        }),
        (CVShapeElement.prototype.createTransformElement = function (e) {
          var t = {
            transform: {
              opacity: 1,
              _opMdf: !1,
              key: this.transformsManager.getNewKey(),
              op: PropertyFactory.getProp(this, e.o, 0, 0.01, this),
              mProps: TransformPropertyFactory.getTransformProperty(
                this,
                e,
                this
              ),
            },
          };
          return t;
        }),
        (CVShapeElement.prototype.createShapeElement = function (e) {
          var t = new CVShapeData(
            this,
            e,
            this.stylesList,
            this.transformsManager
          );
          return this.shapes.push(t), this.addShapeToModifiers(t), t;
        }),
        (CVShapeElement.prototype.reloadShapes = function () {
          this._isFirstFrame = !0;
          var e,
            t = this.itemsData.length;
          for (e = 0; e < t; e += 1) this.prevViewData[e] = this.itemsData[e];
          for (
            this.searchShapes(
              this.shapesData,
              this.itemsData,
              this.prevViewData,
              !0,
              []
            ),
              t = this.dynamicProperties.length,
              e = 0;
            e < t;
            e += 1
          )
            this.dynamicProperties[e].getValue();
          this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame);
        }),
        (CVShapeElement.prototype.addTransformToStyleList = function (e) {
          var t,
            r = this.stylesList.length;
          for (t = 0; t < r; t += 1)
            this.stylesList[t].closed || this.stylesList[t].transforms.push(e);
        }),
        (CVShapeElement.prototype.removeTransformFromStyleList = function () {
          var e,
            t = this.stylesList.length;
          for (e = 0; e < t; e += 1)
            this.stylesList[e].closed || this.stylesList[e].transforms.pop();
        }),
        (CVShapeElement.prototype.closeStyles = function (e) {
          var t,
            r = e.length;
          for (t = 0; t < r; t += 1) e[t].closed = !0;
        }),
        (CVShapeElement.prototype.searchShapes = function (e, t, r, i, s) {
          var n,
            l = e.length - 1,
            u,
            d,
            v = [],
            E = [],
            _,
            m,
            y,
            c = [].concat(s);
          for (n = l; n >= 0; n -= 1) {
            if (
              ((_ = this.searchProcessedElement(e[n])),
              _ ? (t[n] = r[_ - 1]) : (e[n]._shouldRender = i),
              e[n].ty === 'fl' ||
                e[n].ty === 'st' ||
                e[n].ty === 'gf' ||
                e[n].ty === 'gs')
            )
              _
                ? (t[n].style.closed = !1)
                : (t[n] = this.createStyleElement(e[n], c)),
                v.push(t[n].style);
            else if (e[n].ty === 'gr') {
              if (!_) t[n] = this.createGroupElement(e[n]);
              else
                for (d = t[n].it.length, u = 0; u < d; u += 1)
                  t[n].prevViewData[u] = t[n].it[u];
              this.searchShapes(e[n].it, t[n].it, t[n].prevViewData, i, c);
            } else
              e[n].ty === 'tr'
                ? (_ || ((y = this.createTransformElement(e[n])), (t[n] = y)),
                  c.push(t[n]),
                  this.addTransformToStyleList(t[n]))
                : e[n].ty === 'sh' ||
                  e[n].ty === 'rc' ||
                  e[n].ty === 'el' ||
                  e[n].ty === 'sr'
                ? _ || (t[n] = this.createShapeElement(e[n]))
                : e[n].ty === 'tm' || e[n].ty === 'rd' || e[n].ty === 'pb'
                ? (_
                    ? ((m = t[n]), (m.closed = !1))
                    : ((m = ShapeModifiers.getModifier(e[n].ty)),
                      m.init(this, e[n]),
                      (t[n] = m),
                      this.shapeModifiers.push(m)),
                  E.push(m))
                : e[n].ty === 'rp' &&
                  (_
                    ? ((m = t[n]), (m.closed = !0))
                    : ((m = ShapeModifiers.getModifier(e[n].ty)),
                      (t[n] = m),
                      m.init(this, e, n, t),
                      this.shapeModifiers.push(m),
                      (i = !1)),
                  E.push(m));
            this.addProcessedElement(e[n], n + 1);
          }
          for (
            this.removeTransformFromStyleList(),
              this.closeStyles(v),
              l = E.length,
              n = 0;
            n < l;
            n += 1
          )
            E[n].closed = !0;
        }),
        (CVShapeElement.prototype.renderInnerContent = function () {
          (this.transformHelper.opacity = 1),
            (this.transformHelper._opMdf = !1),
            this.renderModifiers(),
            this.transformsManager.processSequences(this._isFirstFrame),
            this.renderShape(
              this.transformHelper,
              this.shapesData,
              this.itemsData,
              !0
            );
        }),
        (CVShapeElement.prototype.renderShapeTransform = function (e, t) {
          (e._opMdf || t.op._mdf || this._isFirstFrame) &&
            ((t.opacity = e.opacity), (t.opacity *= t.op.v), (t._opMdf = !0));
        }),
        (CVShapeElement.prototype.drawLayer = function () {
          var e,
            t = this.stylesList.length,
            r,
            i,
            s,
            n,
            l,
            u,
            d = this.globalData.renderer,
            v = this.globalData.canvasContext,
            E,
            _;
          for (e = 0; e < t; e += 1)
            if (
              ((_ = this.stylesList[e]),
              (E = _.type),
              !(
                ((E === 'st' || E === 'gs') && _.wi === 0) ||
                !_.data._shouldRender ||
                _.coOp === 0 ||
                this.globalData.currentGlobalAlpha === 0
              ))
            ) {
              for (
                d.save(),
                  l = _.elements,
                  E === 'st' || E === 'gs'
                    ? ((v.strokeStyle = E === 'st' ? _.co : _.grd),
                      (v.lineWidth = _.wi),
                      (v.lineCap = _.lc),
                      (v.lineJoin = _.lj),
                      (v.miterLimit = _.ml || 0))
                    : (v.fillStyle = E === 'fl' ? _.co : _.grd),
                  d.ctxOpacity(_.coOp),
                  E !== 'st' && E !== 'gs' && v.beginPath(),
                  d.ctxTransform(_.preTransforms.finalTransform.props),
                  i = l.length,
                  r = 0;
                r < i;
                r += 1
              ) {
                for (
                  (E === 'st' || E === 'gs') &&
                    (v.beginPath(),
                    _.da && (v.setLineDash(_.da), (v.lineDashOffset = _.do))),
                    u = l[r].trNodes,
                    n = u.length,
                    s = 0;
                  s < n;
                  s += 1
                )
                  u[s].t === 'm'
                    ? v.moveTo(u[s].p[0], u[s].p[1])
                    : u[s].t === 'c'
                    ? v.bezierCurveTo(
                        u[s].pts[0],
                        u[s].pts[1],
                        u[s].pts[2],
                        u[s].pts[3],
                        u[s].pts[4],
                        u[s].pts[5]
                      )
                    : v.closePath();
                (E === 'st' || E === 'gs') &&
                  (v.stroke(), _.da && v.setLineDash(this.dashResetter));
              }
              E !== 'st' && E !== 'gs' && v.fill(_.r), d.restore();
            }
        }),
        (CVShapeElement.prototype.renderShape = function (e, t, r, i) {
          var s,
            n = t.length - 1,
            l;
          for (l = e, s = n; s >= 0; s -= 1)
            t[s].ty === 'tr'
              ? ((l = r[s].transform), this.renderShapeTransform(e, l))
              : t[s].ty === 'sh' ||
                t[s].ty === 'el' ||
                t[s].ty === 'rc' ||
                t[s].ty === 'sr'
              ? this.renderPath(t[s], r[s])
              : t[s].ty === 'fl'
              ? this.renderFill(t[s], r[s], l)
              : t[s].ty === 'st'
              ? this.renderStroke(t[s], r[s], l)
              : t[s].ty === 'gf' || t[s].ty === 'gs'
              ? this.renderGradientFill(t[s], r[s], l)
              : t[s].ty === 'gr'
              ? this.renderShape(l, t[s].it, r[s].it)
              : t[s].ty === 'tm';
          i && this.drawLayer();
        }),
        (CVShapeElement.prototype.renderStyledShape = function (e, t) {
          if (this._isFirstFrame || t._mdf || e.transforms._mdf) {
            var r = e.trNodes,
              i = t.paths,
              s,
              n,
              l,
              u = i._length;
            r.length = 0;
            var d = e.transforms.finalTransform;
            for (l = 0; l < u; l += 1) {
              var v = i.shapes[l];
              if (v && v.v) {
                for (n = v._length, s = 1; s < n; s += 1)
                  s === 1 &&
                    r.push({
                      t: 'm',
                      p: d.applyToPointArray(v.v[0][0], v.v[0][1], 0),
                    }),
                    r.push({
                      t: 'c',
                      pts: d.applyToTriplePoints(v.o[s - 1], v.i[s], v.v[s]),
                    });
                n === 1 &&
                  r.push({
                    t: 'm',
                    p: d.applyToPointArray(v.v[0][0], v.v[0][1], 0),
                  }),
                  v.c &&
                    n &&
                    (r.push({
                      t: 'c',
                      pts: d.applyToTriplePoints(v.o[s - 1], v.i[0], v.v[0]),
                    }),
                    r.push({ t: 'z' }));
              }
            }
            e.trNodes = r;
          }
        }),
        (CVShapeElement.prototype.renderPath = function (e, t) {
          if (e.hd !== !0 && e._shouldRender) {
            var r,
              i = t.styledShapes.length;
            for (r = 0; r < i; r += 1)
              this.renderStyledShape(t.styledShapes[r], t.sh);
          }
        }),
        (CVShapeElement.prototype.renderFill = function (e, t, r) {
          var i = t.style;
          (t.c._mdf || this._isFirstFrame) &&
            (i.co =
              'rgb(' +
              bmFloor(t.c.v[0]) +
              ',' +
              bmFloor(t.c.v[1]) +
              ',' +
              bmFloor(t.c.v[2]) +
              ')'),
            (t.o._mdf || r._opMdf || this._isFirstFrame) &&
              (i.coOp = t.o.v * r.opacity);
        }),
        (CVShapeElement.prototype.renderGradientFill = function (e, t, r) {
          var i = t.style,
            s;
          if (
            !i.grd ||
            t.g._mdf ||
            t.s._mdf ||
            t.e._mdf ||
            (e.t !== 1 && (t.h._mdf || t.a._mdf))
          ) {
            var n = this.globalData.canvasContext,
              l = t.s.v,
              u = t.e.v;
            if (e.t === 1) s = n.createLinearGradient(l[0], l[1], u[0], u[1]);
            else {
              var d = Math.sqrt(
                  Math.pow(l[0] - u[0], 2) + Math.pow(l[1] - u[1], 2)
                ),
                v = Math.atan2(u[1] - l[1], u[0] - l[0]),
                E = t.h.v;
              E >= 1 ? (E = 0.99) : E <= -1 && (E = -0.99);
              var _ = d * E,
                m = Math.cos(v + t.a.v) * _ + l[0],
                y = Math.sin(v + t.a.v) * _ + l[1];
              s = n.createRadialGradient(m, y, 0, l[0], l[1], d);
            }
            var c,
              g = e.g.p,
              p = t.g.c,
              a = 1;
            for (c = 0; c < g; c += 1)
              t.g._hasOpacity && t.g._collapsable && (a = t.g.o[c * 2 + 1]),
                s.addColorStop(
                  p[c * 4] / 100,
                  'rgba(' +
                    p[c * 4 + 1] +
                    ',' +
                    p[c * 4 + 2] +
                    ',' +
                    p[c * 4 + 3] +
                    ',' +
                    a +
                    ')'
                );
            i.grd = s;
          }
          i.coOp = t.o.v * r.opacity;
        }),
        (CVShapeElement.prototype.renderStroke = function (e, t, r) {
          var i = t.style,
            s = t.d;
          s &&
            (s._mdf || this._isFirstFrame) &&
            ((i.da = s.dashArray), (i.do = s.dashoffset[0])),
            (t.c._mdf || this._isFirstFrame) &&
              (i.co =
                'rgb(' +
                bmFloor(t.c.v[0]) +
                ',' +
                bmFloor(t.c.v[1]) +
                ',' +
                bmFloor(t.c.v[2]) +
                ')'),
            (t.o._mdf || r._opMdf || this._isFirstFrame) &&
              (i.coOp = t.o.v * r.opacity),
            (t.w._mdf || this._isFirstFrame) && (i.wi = t.w.v);
        }),
        (CVShapeElement.prototype.destroy = function () {
          (this.shapesData = null),
            (this.globalData = null),
            (this.canvasContext = null),
            (this.stylesList.length = 0),
            (this.itemsData.length = 0);
        });
      function CVSolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        CVSolidElement
      ),
        (CVSolidElement.prototype.initElement =
          SVGShapeElement.prototype.initElement),
        (CVSolidElement.prototype.prepareFrame =
          IImageElement.prototype.prepareFrame),
        (CVSolidElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          (e.fillStyle = this.data.sc),
            e.fillRect(0, 0, this.data.sw, this.data.sh);
        });
      function CVTextElement(e, t, r) {
        (this.textSpans = []),
          (this.yOffset = 0),
          (this.fillColorAnim = !1),
          (this.strokeColorAnim = !1),
          (this.strokeWidthAnim = !1),
          (this.stroke = !1),
          (this.fill = !1),
          (this.justifyOffset = 0),
          (this.currentRender = null),
          (this.renderType = 'canvas'),
          (this.values = {
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
            sWidth: 0,
            fValue: '',
          }),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          CVBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
          ITextElement,
        ],
        CVTextElement
      ),
        (CVTextElement.prototype.tHelper =
          createTag('canvas').getContext('2d')),
        (CVTextElement.prototype.buildNewText = function () {
          var e = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
          var t = !1;
          e.fc
            ? ((t = !0), (this.values.fill = this.buildColor(e.fc)))
            : (this.values.fill = 'rgba(0,0,0,0)'),
            (this.fill = t);
          var r = !1;
          e.sc &&
            ((r = !0),
            (this.values.stroke = this.buildColor(e.sc)),
            (this.values.sWidth = e.sw));
          var i = this.globalData.fontManager.getFontByName(e.f),
            s,
            n,
            l = e.l,
            u = this.mHelper;
          (this.stroke = r),
            (this.values.fValue =
              e.finalSize +
              'px ' +
              this.globalData.fontManager.getFontByName(e.f).fFamily),
            (n = e.finalText.length);
          var d,
            v,
            E,
            _,
            m,
            y,
            c,
            g,
            p,
            a,
            o = this.data.singleShape,
            h = e.tr * 0.001 * e.finalSize,
            f = 0,
            b = 0,
            P = !0,
            S = 0;
          for (s = 0; s < n; s += 1) {
            for (
              d = this.globalData.fontManager.getCharData(
                e.finalText[s],
                i.fStyle,
                this.globalData.fontManager.getFontByName(e.f).fFamily
              ),
                v = (d && d.data) || {},
                u.reset(),
                o &&
                  l[s].n &&
                  ((f = -h), (b += e.yOffset), (b += P ? 1 : 0), (P = !1)),
                m = v.shapes ? v.shapes[0].it : [],
                c = m.length,
                u.scale(e.finalSize / 100, e.finalSize / 100),
                o && this.applyTextPropertiesToMatrix(e, u, l[s].line, f, b),
                p = createSizedArray(c),
                y = 0;
              y < c;
              y += 1
            ) {
              for (
                _ = m[y].ks.k.i.length, g = m[y].ks.k, a = [], E = 1;
                E < _;
                E += 1
              )
                E === 1 &&
                  a.push(
                    u.applyToX(g.v[0][0], g.v[0][1], 0),
                    u.applyToY(g.v[0][0], g.v[0][1], 0)
                  ),
                  a.push(
                    u.applyToX(g.o[E - 1][0], g.o[E - 1][1], 0),
                    u.applyToY(g.o[E - 1][0], g.o[E - 1][1], 0),
                    u.applyToX(g.i[E][0], g.i[E][1], 0),
                    u.applyToY(g.i[E][0], g.i[E][1], 0),
                    u.applyToX(g.v[E][0], g.v[E][1], 0),
                    u.applyToY(g.v[E][0], g.v[E][1], 0)
                  );
              a.push(
                u.applyToX(g.o[E - 1][0], g.o[E - 1][1], 0),
                u.applyToY(g.o[E - 1][0], g.o[E - 1][1], 0),
                u.applyToX(g.i[0][0], g.i[0][1], 0),
                u.applyToY(g.i[0][0], g.i[0][1], 0),
                u.applyToX(g.v[0][0], g.v[0][1], 0),
                u.applyToY(g.v[0][0], g.v[0][1], 0)
              ),
                (p[y] = a);
            }
            o && ((f += l[s].l), (f += h)),
              this.textSpans[S]
                ? (this.textSpans[S].elem = p)
                : (this.textSpans[S] = { elem: p }),
              (S += 1);
          }
        }),
        (CVTextElement.prototype.renderInnerContent = function () {
          var e = this.canvasContext;
          (e.font = this.values.fValue),
            (e.lineCap = 'butt'),
            (e.lineJoin = 'miter'),
            (e.miterLimit = 4),
            this.data.singleShape ||
              this.textAnimator.getMeasures(
                this.textProperty.currentData,
                this.lettersChangedFlag
              );
          var t,
            r,
            i,
            s,
            n,
            l,
            u = this.textAnimator.renderedLetters,
            d = this.textProperty.currentData.l;
          r = d.length;
          var v,
            E = null,
            _ = null,
            m = null,
            y,
            c;
          for (t = 0; t < r; t += 1)
            if (!d[t].n) {
              if (
                ((v = u[t]),
                v &&
                  (this.globalData.renderer.save(),
                  this.globalData.renderer.ctxTransform(v.p),
                  this.globalData.renderer.ctxOpacity(v.o)),
                this.fill)
              ) {
                for (
                  v && v.fc
                    ? E !== v.fc && ((E = v.fc), (e.fillStyle = v.fc))
                    : E !== this.values.fill &&
                      ((E = this.values.fill),
                      (e.fillStyle = this.values.fill)),
                    y = this.textSpans[t].elem,
                    s = y.length,
                    this.globalData.canvasContext.beginPath(),
                    i = 0;
                  i < s;
                  i += 1
                )
                  for (
                    c = y[i],
                      l = c.length,
                      this.globalData.canvasContext.moveTo(c[0], c[1]),
                      n = 2;
                    n < l;
                    n += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      c[n],
                      c[n + 1],
                      c[n + 2],
                      c[n + 3],
                      c[n + 4],
                      c[n + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.fill();
              }
              if (this.stroke) {
                for (
                  v && v.sw
                    ? m !== v.sw && ((m = v.sw), (e.lineWidth = v.sw))
                    : m !== this.values.sWidth &&
                      ((m = this.values.sWidth),
                      (e.lineWidth = this.values.sWidth)),
                    v && v.sc
                      ? _ !== v.sc && ((_ = v.sc), (e.strokeStyle = v.sc))
                      : _ !== this.values.stroke &&
                        ((_ = this.values.stroke),
                        (e.strokeStyle = this.values.stroke)),
                    y = this.textSpans[t].elem,
                    s = y.length,
                    this.globalData.canvasContext.beginPath(),
                    i = 0;
                  i < s;
                  i += 1
                )
                  for (
                    c = y[i],
                      l = c.length,
                      this.globalData.canvasContext.moveTo(c[0], c[1]),
                      n = 2;
                    n < l;
                    n += 6
                  )
                    this.globalData.canvasContext.bezierCurveTo(
                      c[n],
                      c[n + 1],
                      c[n + 2],
                      c[n + 3],
                      c[n + 4],
                      c[n + 5]
                    );
                this.globalData.canvasContext.closePath(),
                  this.globalData.canvasContext.stroke();
              }
              v && this.globalData.renderer.restore();
            }
        });
      function CVEffects() {}
      CVEffects.prototype.renderFrame = function () {};
      function HBaseElement() {}
      (HBaseElement.prototype = {
        checkBlendMode: function () {},
        initRendererElement: function () {
          (this.baseElement = createTag(this.data.tg || 'div')),
            this.data.hasMask
              ? ((this.svgElement = createNS('svg')),
                (this.layerElement = createNS('g')),
                (this.maskedElement = this.layerElement),
                this.svgElement.appendChild(this.layerElement),
                this.baseElement.appendChild(this.svgElement))
              : (this.layerElement = this.baseElement),
            styleDiv(this.baseElement);
        },
        createContainerElements: function () {
          (this.renderableEffectsManager = new CVEffects(this)),
            (this.transformedElement = this.baseElement),
            (this.maskedElement = this.layerElement),
            this.data.ln && this.layerElement.setAttribute('id', this.data.ln),
            this.data.cl &&
              this.layerElement.setAttribute('class', this.data.cl),
            this.data.bm !== 0 && this.setBlendMode();
        },
        renderElement: function () {
          var e = this.transformedElement ? this.transformedElement.style : {};
          if (this.finalTransform._matMdf) {
            var t = this.finalTransform.mat.toCSS();
            (e.transform = t), (e.webkitTransform = t);
          }
          this.finalTransform._opMdf &&
            (e.opacity = this.finalTransform.mProp.o.v);
        },
        renderFrame: function () {
          this.data.hd ||
            this.hidden ||
            (this.renderTransform(),
            this.renderRenderable(),
            this.renderElement(),
            this.renderInnerContent(),
            this._isFirstFrame && (this._isFirstFrame = !1));
        },
        destroy: function () {
          (this.layerElement = null),
            (this.transformedElement = null),
            this.matteElement && (this.matteElement = null),
            this.maskManager &&
              (this.maskManager.destroy(), (this.maskManager = null));
        },
        createRenderableComponents: function () {
          this.maskManager = new MaskElement(this.data, this, this.globalData);
        },
        addEffects: function () {},
        setMatte: function () {},
      }),
        (HBaseElement.prototype.getBaseElement =
          SVGBaseElement.prototype.getBaseElement),
        (HBaseElement.prototype.destroyBaseElement =
          HBaseElement.prototype.destroy),
        (HBaseElement.prototype.buildElementParenting =
          HybridRenderer.prototype.buildElementParenting);
      function HSolidElement(e, t, r) {
        this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
        ],
        HSolidElement
      ),
        (HSolidElement.prototype.createContent = function () {
          var e;
          this.data.hasMask
            ? ((e = createNS('rect')),
              e.setAttribute('width', this.data.sw),
              e.setAttribute('height', this.data.sh),
              e.setAttribute('fill', this.data.sc),
              this.svgElement.setAttribute('width', this.data.sw),
              this.svgElement.setAttribute('height', this.data.sh))
            : ((e = createTag('div')),
              (e.style.width = this.data.sw + 'px'),
              (e.style.height = this.data.sh + 'px'),
              (e.style.backgroundColor = this.data.sc)),
            this.layerElement.appendChild(e);
        });
      function HCompElement(e, t, r) {
        (this.layers = e.layers),
          (this.supports3d = !e.hasMask),
          (this.completeLayers = !1),
          (this.pendingElements = []),
          (this.elements = this.layers
            ? createSizedArray(this.layers.length)
            : []),
          this.initElement(e, t, r),
          (this.tm = e.tm
            ? PropertyFactory.getProp(this, e.tm, 0, t.frameRate, this)
            : { _placeholder: !0 });
      }
      extendPrototype(
        [HybridRenderer, ICompElement, HBaseElement],
        HCompElement
      ),
        (HCompElement.prototype._createBaseContainerElements =
          HCompElement.prototype.createContainerElements),
        (HCompElement.prototype.createContainerElements = function () {
          this._createBaseContainerElements(),
            this.data.hasMask
              ? (this.svgElement.setAttribute('width', this.data.w),
                this.svgElement.setAttribute('height', this.data.h),
                (this.transformedElement = this.baseElement))
              : (this.transformedElement = this.layerElement);
        }),
        (HCompElement.prototype.addTo3dContainer = function (e, t) {
          for (var r = 0, i; r < t; )
            this.elements[r] &&
              this.elements[r].getBaseElement &&
              (i = this.elements[r].getBaseElement()),
              (r += 1);
          i
            ? this.layerElement.insertBefore(e, i)
            : this.layerElement.appendChild(e);
        });
      function HShapeElement(e, t, r) {
        (this.shapes = []),
          (this.shapesData = e.shapes),
          (this.stylesList = []),
          (this.shapeModifiers = []),
          (this.itemsData = []),
          (this.processedElements = []),
          (this.animatedContents = []),
          (this.shapesContainer = createNS('g')),
          this.initElement(e, t, r),
          (this.prevViewData = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 });
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HSolidElement,
          SVGShapeElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HShapeElement
      ),
        (HShapeElement.prototype._renderShapeFrame =
          HShapeElement.prototype.renderInnerContent),
        (HShapeElement.prototype.createContent = function () {
          var e;
          if (((this.baseElement.style.fontSize = 0), this.data.hasMask))
            this.layerElement.appendChild(this.shapesContainer),
              (e = this.svgElement);
          else {
            e = createNS('svg');
            var t = this.comp.data ? this.comp.data : this.globalData.compSize;
            e.setAttribute('width', t.w),
              e.setAttribute('height', t.h),
              e.appendChild(this.shapesContainer),
              this.layerElement.appendChild(e);
          }
          this.searchShapes(
            this.shapesData,
            this.itemsData,
            this.prevViewData,
            this.shapesContainer,
            0,
            [],
            !0
          ),
            this.filterUniqueShapes(),
            (this.shapeCont = e);
        }),
        (HShapeElement.prototype.getTransformedPoint = function (e, t) {
          var r,
            i = e.length;
          for (r = 0; r < i; r += 1)
            t = e[r].mProps.v.applyToPointArray(t[0], t[1], 0);
          return t;
        }),
        (HShapeElement.prototype.calculateShapeBoundingBox = function (e, t) {
          var r = e.sh.v,
            i = e.transformers,
            s,
            n = r._length,
            l,
            u,
            d,
            v;
          if (!(n <= 1)) {
            for (s = 0; s < n - 1; s += 1)
              (l = this.getTransformedPoint(i, r.v[s])),
                (u = this.getTransformedPoint(i, r.o[s])),
                (d = this.getTransformedPoint(i, r.i[s + 1])),
                (v = this.getTransformedPoint(i, r.v[s + 1])),
                this.checkBounds(l, u, d, v, t);
            r.c &&
              ((l = this.getTransformedPoint(i, r.v[s])),
              (u = this.getTransformedPoint(i, r.o[s])),
              (d = this.getTransformedPoint(i, r.i[0])),
              (v = this.getTransformedPoint(i, r.v[0])),
              this.checkBounds(l, u, d, v, t));
          }
        }),
        (HShapeElement.prototype.checkBounds = function (e, t, r, i, s) {
          this.getBoundsOfCurve(e, t, r, i);
          var n = this.shapeBoundingBox;
          (s.x = bmMin(n.left, s.x)),
            (s.xMax = bmMax(n.right, s.xMax)),
            (s.y = bmMin(n.top, s.y)),
            (s.yMax = bmMax(n.bottom, s.yMax));
        }),
        (HShapeElement.prototype.shapeBoundingBox = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }),
        (HShapeElement.prototype.tempBoundingBox = {
          x: 0,
          xMax: 0,
          y: 0,
          yMax: 0,
          width: 0,
          height: 0,
        }),
        (HShapeElement.prototype.getBoundsOfCurve = function (e, t, r, i) {
          for (
            var s = [
                [e[0], i[0]],
                [e[1], i[1]],
              ],
              n,
              l,
              u,
              d,
              v,
              E,
              _,
              m = 0;
            m < 2;
            ++m
          )
            (l = 6 * e[m] - 12 * t[m] + 6 * r[m]),
              (n = -3 * e[m] + 9 * t[m] - 9 * r[m] + 3 * i[m]),
              (u = 3 * t[m] - 3 * e[m]),
              (l |= 0),
              (n |= 0),
              (u |= 0),
              (n === 0 && l === 0) ||
                (n === 0
                  ? ((d = -u / l),
                    d > 0 &&
                      d < 1 &&
                      s[m].push(this.calculateF(d, e, t, r, i, m)))
                  : ((v = l * l - 4 * u * n),
                    v >= 0 &&
                      ((E = (-l + bmSqrt(v)) / (2 * n)),
                      E > 0 &&
                        E < 1 &&
                        s[m].push(this.calculateF(E, e, t, r, i, m)),
                      (_ = (-l - bmSqrt(v)) / (2 * n)),
                      _ > 0 &&
                        _ < 1 &&
                        s[m].push(this.calculateF(_, e, t, r, i, m)))));
          (this.shapeBoundingBox.left = bmMin.apply(null, s[0])),
            (this.shapeBoundingBox.top = bmMin.apply(null, s[1])),
            (this.shapeBoundingBox.right = bmMax.apply(null, s[0])),
            (this.shapeBoundingBox.bottom = bmMax.apply(null, s[1]));
        }),
        (HShapeElement.prototype.calculateF = function (e, t, r, i, s, n) {
          return (
            bmPow(1 - e, 3) * t[n] +
            3 * bmPow(1 - e, 2) * e * r[n] +
            3 * (1 - e) * bmPow(e, 2) * i[n] +
            bmPow(e, 3) * s[n]
          );
        }),
        (HShapeElement.prototype.calculateBoundingBox = function (e, t) {
          var r,
            i = e.length;
          for (r = 0; r < i; r += 1)
            e[r] && e[r].sh
              ? this.calculateShapeBoundingBox(e[r], t)
              : e[r] && e[r].it && this.calculateBoundingBox(e[r].it, t);
        }),
        (HShapeElement.prototype.currentBoxContains = function (e) {
          return (
            this.currentBBox.x <= e.x &&
            this.currentBBox.y <= e.y &&
            this.currentBBox.width + this.currentBBox.x >= e.x + e.width &&
            this.currentBBox.height + this.currentBBox.y >= e.y + e.height
          );
        }),
        (HShapeElement.prototype.renderInnerContent = function () {
          if (
            (this._renderShapeFrame(),
            !this.hidden && (this._isFirstFrame || this._mdf))
          ) {
            var e = this.tempBoundingBox,
              t = 999999;
            if (
              ((e.x = t),
              (e.xMax = -t),
              (e.y = t),
              (e.yMax = -t),
              this.calculateBoundingBox(this.itemsData, e),
              (e.width = e.xMax < e.x ? 0 : e.xMax - e.x),
              (e.height = e.yMax < e.y ? 0 : e.yMax - e.y),
              this.currentBoxContains(e))
            )
              return;
            var r = !1;
            if (
              (this.currentBBox.w !== e.width &&
                ((this.currentBBox.w = e.width),
                this.shapeCont.setAttribute('width', e.width),
                (r = !0)),
              this.currentBBox.h !== e.height &&
                ((this.currentBBox.h = e.height),
                this.shapeCont.setAttribute('height', e.height),
                (r = !0)),
              r || this.currentBBox.x !== e.x || this.currentBBox.y !== e.y)
            ) {
              (this.currentBBox.w = e.width),
                (this.currentBBox.h = e.height),
                (this.currentBBox.x = e.x),
                (this.currentBBox.y = e.y),
                this.shapeCont.setAttribute(
                  'viewBox',
                  this.currentBBox.x +
                    ' ' +
                    this.currentBBox.y +
                    ' ' +
                    this.currentBBox.w +
                    ' ' +
                    this.currentBBox.h
                );
              var i = this.shapeCont.style,
                s =
                  'translate(' +
                  this.currentBBox.x +
                  'px,' +
                  this.currentBBox.y +
                  'px)';
              (i.transform = s), (i.webkitTransform = s);
            }
          }
        });
      function HTextElement(e, t, r) {
        (this.textSpans = []),
          (this.textPaths = []),
          (this.currentBBox = { x: 999999, y: -999999, h: 0, w: 0 }),
          (this.renderType = 'svg'),
          (this.isMasked = !1),
          this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HierarchyElement,
          FrameElement,
          RenderableDOMElement,
          ITextElement,
        ],
        HTextElement
      ),
        (HTextElement.prototype.createContent = function () {
          if (((this.isMasked = this.checkMasks()), this.isMasked)) {
            (this.renderType = 'svg'),
              (this.compW = this.comp.data.w),
              (this.compH = this.comp.data.h),
              this.svgElement.setAttribute('width', this.compW),
              this.svgElement.setAttribute('height', this.compH);
            var e = createNS('g');
            this.maskedElement.appendChild(e), (this.innerElem = e);
          } else
            (this.renderType = 'html'), (this.innerElem = this.layerElement);
          this.checkParenting();
        }),
        (HTextElement.prototype.buildNewText = function () {
          var e = this.textProperty.currentData;
          this.renderedLetters = createSizedArray(e.l ? e.l.length : 0);
          var t = this.innerElem.style,
            r = e.fc ? this.buildColor(e.fc) : 'rgba(0,0,0,0)';
          (t.fill = r),
            (t.color = r),
            e.sc &&
              ((t.stroke = this.buildColor(e.sc)),
              (t.strokeWidth = e.sw + 'px'));
          var i = this.globalData.fontManager.getFontByName(e.f);
          if (!this.globalData.fontManager.chars)
            if (
              ((t.fontSize = e.finalSize + 'px'),
              (t.lineHeight = e.finalSize + 'px'),
              i.fClass)
            )
              this.innerElem.className = i.fClass;
            else {
              t.fontFamily = i.fFamily;
              var s = e.fWeight,
                n = e.fStyle;
              (t.fontStyle = n), (t.fontWeight = s);
            }
          var l,
            u,
            d = e.l;
          u = d.length;
          var v,
            E,
            _,
            m = this.mHelper,
            y,
            c = '',
            g = 0;
          for (l = 0; l < u; l += 1) {
            if (
              (this.globalData.fontManager.chars
                ? (this.textPaths[g]
                    ? (v = this.textPaths[g])
                    : ((v = createNS('path')),
                      v.setAttribute('stroke-linecap', lineCapEnum[1]),
                      v.setAttribute('stroke-linejoin', lineJoinEnum[2]),
                      v.setAttribute('stroke-miterlimit', '4')),
                  this.isMasked ||
                    (this.textSpans[g]
                      ? ((E = this.textSpans[g]), (_ = E.children[0]))
                      : ((E = createTag('div')),
                        (E.style.lineHeight = 0),
                        (_ = createNS('svg')),
                        _.appendChild(v),
                        styleDiv(E))))
                : this.isMasked
                ? (v = this.textPaths[g] ? this.textPaths[g] : createNS('text'))
                : this.textSpans[g]
                ? ((E = this.textSpans[g]), (v = this.textPaths[g]))
                : ((E = createTag('span')),
                  styleDiv(E),
                  (v = createTag('span')),
                  styleDiv(v),
                  E.appendChild(v)),
              this.globalData.fontManager.chars)
            ) {
              var p = this.globalData.fontManager.getCharData(
                  e.finalText[l],
                  i.fStyle,
                  this.globalData.fontManager.getFontByName(e.f).fFamily
                ),
                a;
              if (
                (p ? (a = p.data) : (a = null),
                m.reset(),
                a &&
                  a.shapes &&
                  ((y = a.shapes[0].it),
                  m.scale(e.finalSize / 100, e.finalSize / 100),
                  (c = this.createPathShape(m, y)),
                  v.setAttribute('d', c)),
                this.isMasked)
              )
                this.innerElem.appendChild(v);
              else {
                if ((this.innerElem.appendChild(E), a && a.shapes)) {
                  document.body.appendChild(_);
                  var o = _.getBBox();
                  _.setAttribute('width', o.width + 2),
                    _.setAttribute('height', o.height + 2),
                    _.setAttribute(
                      'viewBox',
                      o.x -
                        1 +
                        ' ' +
                        (o.y - 1) +
                        ' ' +
                        (o.width + 2) +
                        ' ' +
                        (o.height + 2)
                    );
                  var h = _.style,
                    f = 'translate(' + (o.x - 1) + 'px,' + (o.y - 1) + 'px)';
                  (h.transform = f),
                    (h.webkitTransform = f),
                    (d[l].yOffset = o.y - 1);
                } else _.setAttribute('width', 1), _.setAttribute('height', 1);
                E.appendChild(_);
              }
            } else if (
              ((v.textContent = d[l].val),
              v.setAttributeNS(
                'http://www.w3.org/XML/1998/namespace',
                'xml:space',
                'preserve'
              ),
              this.isMasked)
            )
              this.innerElem.appendChild(v);
            else {
              this.innerElem.appendChild(E);
              var b = v.style,
                P = 'translate3d(0,' + -e.finalSize / 1.2 + 'px,0)';
              (b.transform = P), (b.webkitTransform = P);
            }
            this.isMasked ? (this.textSpans[g] = v) : (this.textSpans[g] = E),
              (this.textSpans[g].style.display = 'block'),
              (this.textPaths[g] = v),
              (g += 1);
          }
          for (; g < this.textSpans.length; )
            (this.textSpans[g].style.display = 'none'), (g += 1);
        }),
        (HTextElement.prototype.renderInnerContent = function () {
          var e;
          if (this.data.singleShape) {
            if (!this._isFirstFrame && !this.lettersChangedFlag) return;
            if (this.isMasked && this.finalTransform._matMdf) {
              this.svgElement.setAttribute(
                'viewBox',
                -this.finalTransform.mProp.p.v[0] +
                  ' ' +
                  -this.finalTransform.mProp.p.v[1] +
                  ' ' +
                  this.compW +
                  ' ' +
                  this.compH
              ),
                (e = this.svgElement.style);
              var t =
                'translate(' +
                -this.finalTransform.mProp.p.v[0] +
                'px,' +
                -this.finalTransform.mProp.p.v[1] +
                'px)';
              (e.transform = t), (e.webkitTransform = t);
            }
          }
          if (
            (this.textAnimator.getMeasures(
              this.textProperty.currentData,
              this.lettersChangedFlag
            ),
            !(
              !this.lettersChangedFlag && !this.textAnimator.lettersChangedFlag
            ))
          ) {
            var r,
              i,
              s = 0,
              n = this.textAnimator.renderedLetters,
              l = this.textProperty.currentData.l;
            i = l.length;
            var u, d, v;
            for (r = 0; r < i; r += 1)
              l[r].n
                ? (s += 1)
                : ((d = this.textSpans[r]),
                  (v = this.textPaths[r]),
                  (u = n[s]),
                  (s += 1),
                  u._mdf.m &&
                    (this.isMasked
                      ? d.setAttribute('transform', u.m)
                      : ((d.style.webkitTransform = u.m),
                        (d.style.transform = u.m))),
                  (d.style.opacity = u.o),
                  u.sw && u._mdf.sw && v.setAttribute('stroke-width', u.sw),
                  u.sc && u._mdf.sc && v.setAttribute('stroke', u.sc),
                  u.fc &&
                    u._mdf.fc &&
                    (v.setAttribute('fill', u.fc), (v.style.color = u.fc)));
            if (
              this.innerElem.getBBox &&
              !this.hidden &&
              (this._isFirstFrame || this._mdf)
            ) {
              var E = this.innerElem.getBBox();
              this.currentBBox.w !== E.width &&
                ((this.currentBBox.w = E.width),
                this.svgElement.setAttribute('width', E.width)),
                this.currentBBox.h !== E.height &&
                  ((this.currentBBox.h = E.height),
                  this.svgElement.setAttribute('height', E.height));
              var _ = 1;
              if (
                this.currentBBox.w !== E.width + _ * 2 ||
                this.currentBBox.h !== E.height + _ * 2 ||
                this.currentBBox.x !== E.x - _ ||
                this.currentBBox.y !== E.y - _
              ) {
                (this.currentBBox.w = E.width + _ * 2),
                  (this.currentBBox.h = E.height + _ * 2),
                  (this.currentBBox.x = E.x - _),
                  (this.currentBBox.y = E.y - _),
                  this.svgElement.setAttribute(
                    'viewBox',
                    this.currentBBox.x +
                      ' ' +
                      this.currentBBox.y +
                      ' ' +
                      this.currentBBox.w +
                      ' ' +
                      this.currentBBox.h
                  ),
                  (e = this.svgElement.style);
                var m =
                  'translate(' +
                  this.currentBBox.x +
                  'px,' +
                  this.currentBBox.y +
                  'px)';
                (e.transform = m), (e.webkitTransform = m);
              }
            }
          }
        });
      function HImageElement(e, t, r) {
        (this.assetData = t.getAssetData(e.refId)), this.initElement(e, t, r);
      }
      extendPrototype(
        [
          BaseElement,
          TransformElement,
          HBaseElement,
          HSolidElement,
          HierarchyElement,
          FrameElement,
          RenderableElement,
        ],
        HImageElement
      ),
        (HImageElement.prototype.createContent = function () {
          var e = this.globalData.getAssetsPath(this.assetData),
            t = new Image();
          this.data.hasMask
            ? ((this.imageElem = createNS('image')),
              this.imageElem.setAttribute('width', this.assetData.w + 'px'),
              this.imageElem.setAttribute('height', this.assetData.h + 'px'),
              this.imageElem.setAttributeNS(
                'http://www.w3.org/1999/xlink',
                'href',
                e
              ),
              this.layerElement.appendChild(this.imageElem),
              this.baseElement.setAttribute('width', this.assetData.w),
              this.baseElement.setAttribute('height', this.assetData.h))
            : this.layerElement.appendChild(t),
            (t.crossOrigin = 'anonymous'),
            (t.src = e),
            this.data.ln && this.baseElement.setAttribute('id', this.data.ln);
        });
      function HCameraElement(e, t, r) {
        this.initFrame(), this.initBaseData(e, t, r), this.initHierarchy();
        var i = PropertyFactory.getProp;
        if (
          ((this.pe = i(this, e.pe, 0, 0, this)),
          e.ks.p.s
            ? ((this.px = i(this, e.ks.p.x, 1, 0, this)),
              (this.py = i(this, e.ks.p.y, 1, 0, this)),
              (this.pz = i(this, e.ks.p.z, 1, 0, this)))
            : (this.p = i(this, e.ks.p, 1, 0, this)),
          e.ks.a && (this.a = i(this, e.ks.a, 1, 0, this)),
          e.ks.or.k.length && e.ks.or.k[0].to)
        ) {
          var s,
            n = e.ks.or.k.length;
          for (s = 0; s < n; s += 1)
            (e.ks.or.k[s].to = null), (e.ks.or.k[s].ti = null);
        }
        (this.or = i(this, e.ks.or, 1, degToRads, this)),
          (this.or.sh = !0),
          (this.rx = i(this, e.ks.rx, 0, degToRads, this)),
          (this.ry = i(this, e.ks.ry, 0, degToRads, this)),
          (this.rz = i(this, e.ks.rz, 0, degToRads, this)),
          (this.mat = new Matrix()),
          (this._prevMat = new Matrix()),
          (this._isFirstFrame = !0),
          (this.finalTransform = { mProp: this });
      }
      extendPrototype(
        [BaseElement, FrameElement, HierarchyElement],
        HCameraElement
      ),
        (HCameraElement.prototype.setup = function () {
          var e,
            t = this.comp.threeDElements.length,
            r,
            i,
            s;
          for (e = 0; e < t; e += 1)
            if (((r = this.comp.threeDElements[e]), r.type === '3d')) {
              (i = r.perspectiveElem.style), (s = r.container.style);
              var n = this.pe.v + 'px',
                l = '0px 0px 0px',
                u = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)';
              (i.perspective = n),
                (i.webkitPerspective = n),
                (s.transformOrigin = l),
                (s.mozTransformOrigin = l),
                (s.webkitTransformOrigin = l),
                (i.transform = u),
                (i.webkitTransform = u);
            }
        }),
        (HCameraElement.prototype.createElements = function () {}),
        (HCameraElement.prototype.hide = function () {}),
        (HCameraElement.prototype.renderFrame = function () {
          var e = this._isFirstFrame,
            t,
            r;
          if (this.hierarchy)
            for (r = this.hierarchy.length, t = 0; t < r; t += 1)
              e = this.hierarchy[t].finalTransform.mProp._mdf || e;
          if (
            e ||
            this.pe._mdf ||
            (this.p && this.p._mdf) ||
            (this.px && (this.px._mdf || this.py._mdf || this.pz._mdf)) ||
            this.rx._mdf ||
            this.ry._mdf ||
            this.rz._mdf ||
            this.or._mdf ||
            (this.a && this.a._mdf)
          ) {
            if ((this.mat.reset(), this.hierarchy))
              for (r = this.hierarchy.length - 1, t = r; t >= 0; t -= 1) {
                var i = this.hierarchy[t].finalTransform.mProp;
                this.mat.translate(-i.p.v[0], -i.p.v[1], i.p.v[2]),
                  this.mat
                    .rotateX(-i.or.v[0])
                    .rotateY(-i.or.v[1])
                    .rotateZ(i.or.v[2]),
                  this.mat.rotateX(-i.rx.v).rotateY(-i.ry.v).rotateZ(i.rz.v),
                  this.mat.scale(1 / i.s.v[0], 1 / i.s.v[1], 1 / i.s.v[2]),
                  this.mat.translate(i.a.v[0], i.a.v[1], i.a.v[2]);
              }
            if (
              (this.p
                ? this.mat.translate(-this.p.v[0], -this.p.v[1], this.p.v[2])
                : this.mat.translate(-this.px.v, -this.py.v, this.pz.v),
              this.a)
            ) {
              var s;
              this.p
                ? (s = [
                    this.p.v[0] - this.a.v[0],
                    this.p.v[1] - this.a.v[1],
                    this.p.v[2] - this.a.v[2],
                  ])
                : (s = [
                    this.px.v - this.a.v[0],
                    this.py.v - this.a.v[1],
                    this.pz.v - this.a.v[2],
                  ]);
              var n = Math.sqrt(
                  Math.pow(s[0], 2) + Math.pow(s[1], 2) + Math.pow(s[2], 2)
                ),
                l = [s[0] / n, s[1] / n, s[2] / n],
                u = Math.sqrt(l[2] * l[2] + l[0] * l[0]),
                d = Math.atan2(l[1], u),
                v = Math.atan2(l[0], -l[2]);
              this.mat.rotateY(v).rotateX(-d);
            }
            this.mat.rotateX(-this.rx.v).rotateY(-this.ry.v).rotateZ(this.rz.v),
              this.mat
                .rotateX(-this.or.v[0])
                .rotateY(-this.or.v[1])
                .rotateZ(this.or.v[2]),
              this.mat.translate(
                this.globalData.compSize.w / 2,
                this.globalData.compSize.h / 2,
                0
              ),
              this.mat.translate(0, 0, this.pe.v);
            var E = !this._prevMat.equals(this.mat);
            if ((E || this.pe._mdf) && this.comp.threeDElements) {
              r = this.comp.threeDElements.length;
              var _, m, y;
              for (t = 0; t < r; t += 1)
                if (((_ = this.comp.threeDElements[t]), _.type === '3d')) {
                  if (E) {
                    var c = this.mat.toCSS();
                    (y = _.container.style),
                      (y.transform = c),
                      (y.webkitTransform = c);
                  }
                  this.pe._mdf &&
                    ((m = _.perspectiveElem.style),
                    (m.perspective = this.pe.v + 'px'),
                    (m.webkitPerspective = this.pe.v + 'px'));
                }
              this.mat.clone(this._prevMat);
            }
          }
          this._isFirstFrame = !1;
        }),
        (HCameraElement.prototype.prepareFrame = function (e) {
          this.prepareProperties(e, !0);
        }),
        (HCameraElement.prototype.destroy = function () {}),
        (HCameraElement.prototype.getBaseElement = function () {
          return null;
        });
      var animationManager = (function () {
          var e = {},
            t = [],
            r = 0,
            i = 0,
            s = 0,
            n = !0,
            l = !1;
          function u(x) {
            for (var T = 0, A = x.target; T < i; )
              t[T].animation === A &&
                (t.splice(T, 1), (T -= 1), (i -= 1), A.isPaused || _()),
                (T += 1);
          }
          function d(x, T) {
            if (!x) return null;
            for (var A = 0; A < i; ) {
              if (t[A].elem === x && t[A].elem !== null) return t[A].animation;
              A += 1;
            }
            var k = new AnimationItem();
            return m(k, x), k.setData(x, T), k;
          }
          function v() {
            var x,
              T = t.length,
              A = [];
            for (x = 0; x < T; x += 1) A.push(t[x].animation);
            return A;
          }
          function E() {
            (s += 1), I();
          }
          function _() {
            s -= 1;
          }
          function m(x, T) {
            x.addEventListener('destroy', u),
              x.addEventListener('_active', E),
              x.addEventListener('_idle', _),
              t.push({ elem: T, animation: x }),
              (i += 1);
          }
          function y(x) {
            var T = new AnimationItem();
            return m(T, null), T.setParams(x), T;
          }
          function c(x, T) {
            var A;
            for (A = 0; A < i; A += 1) t[A].animation.setSpeed(x, T);
          }
          function g(x, T) {
            var A;
            for (A = 0; A < i; A += 1) t[A].animation.setDirection(x, T);
          }
          function p(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.play(x);
          }
          function a(x) {
            var T = x - r,
              A;
            for (A = 0; A < i; A += 1) t[A].animation.advanceTime(T);
            (r = x), s && !l ? window.requestAnimationFrame(a) : (n = !0);
          }
          function o(x) {
            (r = x), window.requestAnimationFrame(a);
          }
          function h(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.pause(x);
          }
          function f(x, T, A) {
            var k;
            for (k = 0; k < i; k += 1) t[k].animation.goToAndStop(x, T, A);
          }
          function b(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.stop(x);
          }
          function P(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.togglePause(x);
          }
          function S(x) {
            var T;
            for (T = i - 1; T >= 0; T -= 1) t[T].animation.destroy(x);
          }
          function w(x, T, A) {
            var k = [].concat(
                [].slice.call(document.getElementsByClassName('lottie')),
                [].slice.call(document.getElementsByClassName('bodymovin'))
              ),
              F,
              L = k.length;
            for (F = 0; F < L; F += 1)
              A && k[F].setAttribute('data-bm-type', A), d(k[F], x);
            if (T && L === 0) {
              A || (A = 'svg');
              var G = document.getElementsByTagName('body')[0];
              G.innerText = '';
              var z = createTag('div');
              (z.style.width = '100%'),
                (z.style.height = '100%'),
                z.setAttribute('data-bm-type', A),
                G.appendChild(z),
                d(z, x);
            }
          }
          function M() {
            var x;
            for (x = 0; x < i; x += 1) t[x].animation.resize();
          }
          function I() {
            !l && s && n && (window.requestAnimationFrame(o), (n = !1));
          }
          function C() {
            l = !0;
          }
          function R() {
            (l = !1), I();
          }
          function V(x, T) {
            var A;
            for (A = 0; A < i; A += 1) t[A].animation.setVolume(x, T);
          }
          function O(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.mute(x);
          }
          function D(x) {
            var T;
            for (T = 0; T < i; T += 1) t[T].animation.unmute(x);
          }
          return (
            (e.registerAnimation = d),
            (e.loadAnimation = y),
            (e.setSpeed = c),
            (e.setDirection = g),
            (e.play = p),
            (e.pause = h),
            (e.stop = b),
            (e.togglePause = P),
            (e.searchAnimations = w),
            (e.resize = M),
            (e.goToAndStop = f),
            (e.destroy = S),
            (e.freeze = C),
            (e.unfreeze = R),
            (e.setVolume = V),
            (e.mute = O),
            (e.unmute = D),
            (e.getRegisteredAnimations = v),
            e
          );
        })(),
        AnimationItem = function () {
          (this._cbs = []),
            (this.name = ''),
            (this.path = ''),
            (this.isLoaded = !1),
            (this.currentFrame = 0),
            (this.currentRawFrame = 0),
            (this.firstFrame = 0),
            (this.totalFrames = 0),
            (this.frameRate = 0),
            (this.frameMult = 0),
            (this.playSpeed = 1),
            (this.playDirection = 1),
            (this.playCount = 0),
            (this.animationData = {}),
            (this.assets = []),
            (this.isPaused = !0),
            (this.autoplay = !1),
            (this.loop = !0),
            (this.renderer = null),
            (this.animationID = createElementID()),
            (this.assetsPath = ''),
            (this.timeCompleted = 0),
            (this.segmentPos = 0),
            (this.isSubframeEnabled = subframeEnabled),
            (this.segments = []),
            (this._idle = !0),
            (this._completedLoop = !1),
            (this.projectInterface = ProjectInterface()),
            (this.imagePreloader = new ImagePreloader()),
            (this.audioController = audioControllerFactory()),
            (this.markers = []);
        };
      extendPrototype([BaseEvent], AnimationItem),
        (AnimationItem.prototype.setParams = function (e) {
          (e.wrapper || e.container) &&
            (this.wrapper = e.wrapper || e.container);
          var t = 'svg';
          switch (
            (e.animType ? (t = e.animType) : e.renderer && (t = e.renderer), t)
          ) {
            case 'canvas':
              this.renderer = new CanvasRenderer(this, e.rendererSettings);
              break;
            case 'svg':
              this.renderer = new SVGRenderer(this, e.rendererSettings);
              break;
            default:
              this.renderer = new HybridRenderer(this, e.rendererSettings);
              break;
          }
          this.imagePreloader.setCacheType(t, this.renderer.globalData.defs),
            this.renderer.setProjectInterface(this.projectInterface),
            (this.animType = t),
            e.loop === '' ||
            e.loop === null ||
            e.loop === void 0 ||
            e.loop === !0
              ? (this.loop = !0)
              : e.loop === !1
              ? (this.loop = !1)
              : (this.loop = parseInt(e.loop, 10)),
            (this.autoplay = 'autoplay' in e ? e.autoplay : !0),
            (this.name = e.name ? e.name : ''),
            (this.autoloadSegments = Object.prototype.hasOwnProperty.call(
              e,
              'autoloadSegments'
            )
              ? e.autoloadSegments
              : !0),
            (this.assetsPath = e.assetsPath),
            (this.initialSegment = e.initialSegment),
            e.audioFactory &&
              this.audioController.setAudioFactory(e.audioFactory),
            e.animationData
              ? this.configAnimation(e.animationData)
              : e.path &&
                (e.path.lastIndexOf('\\') !== -1
                  ? (this.path = e.path.substr(0, e.path.lastIndexOf('\\') + 1))
                  : (this.path = e.path.substr(0, e.path.lastIndexOf('/') + 1)),
                (this.fileName = e.path.substr(e.path.lastIndexOf('/') + 1)),
                (this.fileName = this.fileName.substr(
                  0,
                  this.fileName.lastIndexOf('.json')
                )),
                assetLoader.load(
                  e.path,
                  this.configAnimation.bind(this),
                  function () {
                    this.trigger('data_failed');
                  }.bind(this)
                ));
        }),
        (AnimationItem.prototype.setData = function (e, t) {
          t && typeof t != 'object' && (t = JSON.parse(t));
          var r = { wrapper: e, animationData: t },
            i = e.attributes;
          (r.path = i.getNamedItem('data-animation-path')
            ? i.getNamedItem('data-animation-path').value
            : i.getNamedItem('data-bm-path')
            ? i.getNamedItem('data-bm-path').value
            : i.getNamedItem('bm-path')
            ? i.getNamedItem('bm-path').value
            : ''),
            (r.animType = i.getNamedItem('data-anim-type')
              ? i.getNamedItem('data-anim-type').value
              : i.getNamedItem('data-bm-type')
              ? i.getNamedItem('data-bm-type').value
              : i.getNamedItem('bm-type')
              ? i.getNamedItem('bm-type').value
              : i.getNamedItem('data-bm-renderer')
              ? i.getNamedItem('data-bm-renderer').value
              : i.getNamedItem('bm-renderer')
              ? i.getNamedItem('bm-renderer').value
              : 'canvas');
          var s = i.getNamedItem('data-anim-loop')
            ? i.getNamedItem('data-anim-loop').value
            : i.getNamedItem('data-bm-loop')
            ? i.getNamedItem('data-bm-loop').value
            : i.getNamedItem('bm-loop')
            ? i.getNamedItem('bm-loop').value
            : '';
          s === 'false'
            ? (r.loop = !1)
            : s === 'true'
            ? (r.loop = !0)
            : s !== '' && (r.loop = parseInt(s, 10));
          var n = i.getNamedItem('data-anim-autoplay')
            ? i.getNamedItem('data-anim-autoplay').value
            : i.getNamedItem('data-bm-autoplay')
            ? i.getNamedItem('data-bm-autoplay').value
            : i.getNamedItem('bm-autoplay')
            ? i.getNamedItem('bm-autoplay').value
            : !0;
          (r.autoplay = n !== 'false'),
            (r.name = i.getNamedItem('data-name')
              ? i.getNamedItem('data-name').value
              : i.getNamedItem('data-bm-name')
              ? i.getNamedItem('data-bm-name').value
              : i.getNamedItem('bm-name')
              ? i.getNamedItem('bm-name').value
              : '');
          var l = i.getNamedItem('data-anim-prerender')
            ? i.getNamedItem('data-anim-prerender').value
            : i.getNamedItem('data-bm-prerender')
            ? i.getNamedItem('data-bm-prerender').value
            : i.getNamedItem('bm-prerender')
            ? i.getNamedItem('bm-prerender').value
            : '';
          l === 'false' && (r.prerender = !1), this.setParams(r);
        }),
        (AnimationItem.prototype.includeLayers = function (e) {
          e.op > this.animationData.op &&
            ((this.animationData.op = e.op),
            (this.totalFrames = Math.floor(e.op - this.animationData.ip)));
          var t = this.animationData.layers,
            r,
            i = t.length,
            s = e.layers,
            n,
            l = s.length;
          for (n = 0; n < l; n += 1)
            for (r = 0; r < i; ) {
              if (t[r].id === s[n].id) {
                t[r] = s[n];
                break;
              }
              r += 1;
            }
          if (
            ((e.chars || e.fonts) &&
              (this.renderer.globalData.fontManager.addChars(e.chars),
              this.renderer.globalData.fontManager.addFonts(
                e.fonts,
                this.renderer.globalData.defs
              )),
            e.assets)
          )
            for (i = e.assets.length, r = 0; r < i; r += 1)
              this.animationData.assets.push(e.assets[r]);
          (this.animationData.__complete = !1),
            dataManager.completeData(
              this.animationData,
              this.renderer.globalData.fontManager
            ),
            this.renderer.includeLayers(e.layers),
            expressionsPlugin && expressionsPlugin.initExpressions(this),
            this.loadNextSegment();
        }),
        (AnimationItem.prototype.loadNextSegment = function () {
          var e = this.animationData.segments;
          if (!e || e.length === 0 || !this.autoloadSegments) {
            this.trigger('data_ready'), (this.timeCompleted = this.totalFrames);
            return;
          }
          var t = e.shift();
          this.timeCompleted = t.time * this.frameRate;
          var r = this.path + this.fileName + '_' + this.segmentPos + '.json';
          (this.segmentPos += 1),
            assetLoader.load(
              r,
              this.includeLayers.bind(this),
              function () {
                this.trigger('data_failed');
              }.bind(this)
            );
        }),
        (AnimationItem.prototype.loadSegments = function () {
          var e = this.animationData.segments;
          e || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
        }),
        (AnimationItem.prototype.imagesLoaded = function () {
          this.trigger('loaded_images'), this.checkLoaded();
        }),
        (AnimationItem.prototype.preloadImages = function () {
          this.imagePreloader.setAssetsPath(this.assetsPath),
            this.imagePreloader.setPath(this.path),
            this.imagePreloader.loadAssets(
              this.animationData.assets,
              this.imagesLoaded.bind(this)
            );
        }),
        (AnimationItem.prototype.configAnimation = function (e) {
          if (!!this.renderer)
            try {
              (this.animationData = e),
                this.initialSegment
                  ? ((this.totalFrames = Math.floor(
                      this.initialSegment[1] - this.initialSegment[0]
                    )),
                    (this.firstFrame = Math.round(this.initialSegment[0])))
                  : ((this.totalFrames = Math.floor(
                      this.animationData.op - this.animationData.ip
                    )),
                    (this.firstFrame = Math.round(this.animationData.ip))),
                this.renderer.configAnimation(e),
                e.assets || (e.assets = []),
                (this.assets = this.animationData.assets),
                (this.frameRate = this.animationData.fr),
                (this.frameMult = this.animationData.fr / 1e3),
                this.renderer.searchExtraCompositions(e.assets),
                (this.markers = markerParser(e.markers || [])),
                this.trigger('config_ready'),
                this.preloadImages(),
                this.loadSegments(),
                this.updaFrameModifier(),
                this.waitForFontsLoaded(),
                this.isPaused && this.audioController.pause();
            } catch (t) {
              this.triggerConfigError(t);
            }
        }),
        (AnimationItem.prototype.waitForFontsLoaded = function () {
          !this.renderer ||
            (this.renderer.globalData.fontManager.isLoaded
              ? this.checkLoaded()
              : setTimeout(this.waitForFontsLoaded.bind(this), 20));
        }),
        (AnimationItem.prototype.checkLoaded = function () {
          !this.isLoaded &&
            this.renderer.globalData.fontManager.isLoaded &&
            (this.imagePreloader.loadedImages() ||
              this.renderer.rendererType !== 'canvas') &&
            this.imagePreloader.loadedFootages() &&
            ((this.isLoaded = !0),
            dataManager.completeData(
              this.animationData,
              this.renderer.globalData.fontManager
            ),
            expressionsPlugin && expressionsPlugin.initExpressions(this),
            this.renderer.initItems(),
            setTimeout(
              function () {
                this.trigger('DOMLoaded');
              }.bind(this),
              0
            ),
            this.gotoFrame(),
            this.autoplay && this.play());
        }),
        (AnimationItem.prototype.resize = function () {
          this.renderer.updateContainerSize();
        }),
        (AnimationItem.prototype.setSubframe = function (e) {
          this.isSubframeEnabled = !!e;
        }),
        (AnimationItem.prototype.gotoFrame = function () {
          (this.currentFrame = this.isSubframeEnabled
            ? this.currentRawFrame
            : ~~this.currentRawFrame),
            this.timeCompleted !== this.totalFrames &&
              this.currentFrame > this.timeCompleted &&
              (this.currentFrame = this.timeCompleted),
            this.trigger('enterFrame'),
            this.renderFrame();
        }),
        (AnimationItem.prototype.renderFrame = function () {
          if (!(this.isLoaded === !1 || !this.renderer))
            try {
              this.renderer.renderFrame(this.currentFrame + this.firstFrame);
            } catch (e) {
              this.triggerRenderFrameError(e);
            }
        }),
        (AnimationItem.prototype.play = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !0 &&
              ((this.isPaused = !1),
              this.audioController.resume(),
              this._idle && ((this._idle = !1), this.trigger('_active'))));
        }),
        (AnimationItem.prototype.pause = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !1 &&
              ((this.isPaused = !0),
              (this._idle = !0),
              this.trigger('_idle'),
              this.audioController.pause()));
        }),
        (AnimationItem.prototype.togglePause = function (e) {
          (e && this.name !== e) ||
            (this.isPaused === !0 ? this.play() : this.pause());
        }),
        (AnimationItem.prototype.stop = function (e) {
          (e && this.name !== e) ||
            (this.pause(),
            (this.playCount = 0),
            (this._completedLoop = !1),
            this.setCurrentRawFrameValue(0));
        }),
        (AnimationItem.prototype.getMarkerData = function (e) {
          for (var t, r = 0; r < this.markers.length; r += 1)
            if (((t = this.markers[r]), t.payload && t.payload.name === e))
              return t;
          return null;
        }),
        (AnimationItem.prototype.goToAndStop = function (e, t, r) {
          if (!(r && this.name !== r)) {
            var i = Number(e);
            if (isNaN(i)) {
              var s = this.getMarkerData(e);
              s && this.goToAndStop(s.time, !0);
            } else
              t
                ? this.setCurrentRawFrameValue(e)
                : this.setCurrentRawFrameValue(e * this.frameModifier);
            this.pause();
          }
        }),
        (AnimationItem.prototype.goToAndPlay = function (e, t, r) {
          if (!(r && this.name !== r)) {
            var i = Number(e);
            if (isNaN(i)) {
              var s = this.getMarkerData(e);
              s &&
                (s.duration
                  ? this.playSegments([s.time, s.time + s.duration], !0)
                  : this.goToAndStop(s.time, !0));
            } else this.goToAndStop(i, t, r);
            this.play();
          }
        }),
        (AnimationItem.prototype.advanceTime = function (e) {
          if (!(this.isPaused === !0 || this.isLoaded === !1)) {
            var t = this.currentRawFrame + e * this.frameModifier,
              r = !1;
            t >= this.totalFrames - 1 && this.frameModifier > 0
              ? !this.loop || this.playCount === this.loop
                ? this.checkSegments(
                    t > this.totalFrames ? t % this.totalFrames : 0
                  ) || ((r = !0), (t = this.totalFrames - 1))
                : t >= this.totalFrames
                ? ((this.playCount += 1),
                  this.checkSegments(t % this.totalFrames) ||
                    (this.setCurrentRawFrameValue(t % this.totalFrames),
                    (this._completedLoop = !0),
                    this.trigger('loopComplete')))
                : this.setCurrentRawFrameValue(t)
              : t < 0
              ? this.checkSegments(t % this.totalFrames) ||
                (this.loop && !(this.playCount-- <= 0 && this.loop !== !0)
                  ? (this.setCurrentRawFrameValue(
                      this.totalFrames + (t % this.totalFrames)
                    ),
                    this._completedLoop
                      ? this.trigger('loopComplete')
                      : (this._completedLoop = !0))
                  : ((r = !0), (t = 0)))
              : this.setCurrentRawFrameValue(t),
              r &&
                (this.setCurrentRawFrameValue(t),
                this.pause(),
                this.trigger('complete'));
          }
        }),
        (AnimationItem.prototype.adjustSegment = function (e, t) {
          (this.playCount = 0),
            e[1] < e[0]
              ? (this.frameModifier > 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(-1)),
                (this.totalFrames = e[0] - e[1]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = e[1]),
                this.setCurrentRawFrameValue(this.totalFrames - 0.001 - t))
              : e[1] > e[0] &&
                (this.frameModifier < 0 &&
                  (this.playSpeed < 0
                    ? this.setSpeed(-this.playSpeed)
                    : this.setDirection(1)),
                (this.totalFrames = e[1] - e[0]),
                (this.timeCompleted = this.totalFrames),
                (this.firstFrame = e[0]),
                this.setCurrentRawFrameValue(0.001 + t)),
            this.trigger('segmentStart');
        }),
        (AnimationItem.prototype.setSegment = function (e, t) {
          var r = -1;
          this.isPaused &&
            (this.currentRawFrame + this.firstFrame < e
              ? (r = e)
              : this.currentRawFrame + this.firstFrame > t && (r = t - e)),
            (this.firstFrame = e),
            (this.totalFrames = t - e),
            (this.timeCompleted = this.totalFrames),
            r !== -1 && this.goToAndStop(r, !0);
        }),
        (AnimationItem.prototype.playSegments = function (e, t) {
          if ((t && (this.segments.length = 0), typeof e[0] == 'object')) {
            var r,
              i = e.length;
            for (r = 0; r < i; r += 1) this.segments.push(e[r]);
          } else this.segments.push(e);
          this.segments.length &&
            t &&
            this.adjustSegment(this.segments.shift(), 0),
            this.isPaused && this.play();
        }),
        (AnimationItem.prototype.resetSegments = function (e) {
          (this.segments.length = 0),
            this.segments.push([this.animationData.ip, this.animationData.op]),
            e && this.checkSegments(0);
        }),
        (AnimationItem.prototype.checkSegments = function (e) {
          return this.segments.length
            ? (this.adjustSegment(this.segments.shift(), e), !0)
            : !1;
        }),
        (AnimationItem.prototype.destroy = function (e) {
          (e && this.name !== e) ||
            !this.renderer ||
            (this.renderer.destroy(),
            this.imagePreloader.destroy(),
            this.trigger('destroy'),
            (this._cbs = null),
            (this.onEnterFrame = null),
            (this.onLoopComplete = null),
            (this.onComplete = null),
            (this.onSegmentStart = null),
            (this.onDestroy = null),
            (this.renderer = null),
            (this.renderer = null),
            (this.imagePreloader = null),
            (this.projectInterface = null));
        }),
        (AnimationItem.prototype.setCurrentRawFrameValue = function (e) {
          (this.currentRawFrame = e), this.gotoFrame();
        }),
        (AnimationItem.prototype.setSpeed = function (e) {
          (this.playSpeed = e), this.updaFrameModifier();
        }),
        (AnimationItem.prototype.setDirection = function (e) {
          (this.playDirection = e < 0 ? -1 : 1), this.updaFrameModifier();
        }),
        (AnimationItem.prototype.setVolume = function (e, t) {
          (t && this.name !== t) || this.audioController.setVolume(e);
        }),
        (AnimationItem.prototype.getVolume = function () {
          return this.audioController.getVolume();
        }),
        (AnimationItem.prototype.mute = function (e) {
          (e && this.name !== e) || this.audioController.mute();
        }),
        (AnimationItem.prototype.unmute = function (e) {
          (e && this.name !== e) || this.audioController.unmute();
        }),
        (AnimationItem.prototype.updaFrameModifier = function () {
          (this.frameModifier =
            this.frameMult * this.playSpeed * this.playDirection),
            this.audioController.setRate(this.playSpeed * this.playDirection);
        }),
        (AnimationItem.prototype.getPath = function () {
          return this.path;
        }),
        (AnimationItem.prototype.getAssetsPath = function (e) {
          var t = '';
          if (e.e) t = e.p;
          else if (this.assetsPath) {
            var r = e.p;
            r.indexOf('images/') !== -1 && (r = r.split('/')[1]),
              (t = this.assetsPath + r);
          } else (t = this.path), (t += e.u ? e.u : ''), (t += e.p);
          return t;
        }),
        (AnimationItem.prototype.getAssetData = function (e) {
          for (var t = 0, r = this.assets.length; t < r; ) {
            if (e === this.assets[t].id) return this.assets[t];
            t += 1;
          }
          return null;
        }),
        (AnimationItem.prototype.hide = function () {
          this.renderer.hide();
        }),
        (AnimationItem.prototype.show = function () {
          this.renderer.show();
        }),
        (AnimationItem.prototype.getDuration = function (e) {
          return e ? this.totalFrames : this.totalFrames / this.frameRate;
        }),
        (AnimationItem.prototype.trigger = function (e) {
          if (this._cbs && this._cbs[e])
            switch (e) {
              case 'enterFrame':
                this.triggerEvent(
                  e,
                  new BMEnterFrameEvent(
                    e,
                    this.currentFrame,
                    this.totalFrames,
                    this.frameModifier
                  )
                );
                break;
              case 'loopComplete':
                this.triggerEvent(
                  e,
                  new BMCompleteLoopEvent(
                    e,
                    this.loop,
                    this.playCount,
                    this.frameMult
                  )
                );
                break;
              case 'complete':
                this.triggerEvent(e, new BMCompleteEvent(e, this.frameMult));
                break;
              case 'segmentStart':
                this.triggerEvent(
                  e,
                  new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
                );
                break;
              case 'destroy':
                this.triggerEvent(e, new BMDestroyEvent(e, this));
                break;
              default:
                this.triggerEvent(e);
            }
          e === 'enterFrame' &&
            this.onEnterFrame &&
            this.onEnterFrame.call(
              this,
              new BMEnterFrameEvent(
                e,
                this.currentFrame,
                this.totalFrames,
                this.frameMult
              )
            ),
            e === 'loopComplete' &&
              this.onLoopComplete &&
              this.onLoopComplete.call(
                this,
                new BMCompleteLoopEvent(
                  e,
                  this.loop,
                  this.playCount,
                  this.frameMult
                )
              ),
            e === 'complete' &&
              this.onComplete &&
              this.onComplete.call(
                this,
                new BMCompleteEvent(e, this.frameMult)
              ),
            e === 'segmentStart' &&
              this.onSegmentStart &&
              this.onSegmentStart.call(
                this,
                new BMSegmentStartEvent(e, this.firstFrame, this.totalFrames)
              ),
            e === 'destroy' &&
              this.onDestroy &&
              this.onDestroy.call(this, new BMDestroyEvent(e, this));
        }),
        (AnimationItem.prototype.triggerRenderFrameError = function (e) {
          var t = new BMRenderFrameErrorEvent(e, this.currentFrame);
          this.triggerEvent('error', t),
            this.onError && this.onError.call(this, t);
        }),
        (AnimationItem.prototype.triggerConfigError = function (e) {
          var t = new BMConfigErrorEvent(e, this.currentFrame);
          this.triggerEvent('error', t),
            this.onError && this.onError.call(this, t);
        });
      var Expressions = (function () {
        var e = {};
        e.initExpressions = t;
        function t(r) {
          var i = 0,
            s = [];
          function n() {
            i += 1;
          }
          function l() {
            (i -= 1), i === 0 && d();
          }
          function u(v) {
            s.indexOf(v) === -1 && s.push(v);
          }
          function d() {
            var v,
              E = s.length;
            for (v = 0; v < E; v += 1) s[v].release();
            s.length = 0;
          }
          (r.renderer.compInterface = CompExpressionInterface(r.renderer)),
            r.renderer.globalData.projectInterface.registerComposition(
              r.renderer
            ),
            (r.renderer.globalData.pushExpression = n),
            (r.renderer.globalData.popExpression = l),
            (r.renderer.globalData.registerExpressionProperty = u);
        }
        return e;
      })();
      expressionsPlugin = Expressions;
      var ExpressionManager = (function () {
          var ob = {},
            Math = BMMath;
          BezierFactory.getBezierEasing(0.333, 0, 0.833, 0.833, 'easeIn').get,
            BezierFactory.getBezierEasing(0.167, 0.167, 0.667, 1, 'easeOut')
              .get,
            BezierFactory.getBezierEasing(0.33, 0, 0.667, 1, 'easeInOut').get;
          function initiateExpression(elem, data, property) {
            var val = data.x,
              needsVelocity = /velocity(?![\w\d])/.test(val),
              _needsRandom = val.indexOf('random') !== -1,
              elemType = elem.data.ty,
              transform,
              content,
              effect,
              thisProperty = property;
            (thisProperty.valueAtTime = thisProperty.getValueAtTime),
              Object.defineProperty(thisProperty, 'value', {
                get: function () {
                  return thisProperty.v;
                },
              }),
              (elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate),
              (elem.comp.displayStartTime = 0),
              elem.data.ip / elem.comp.globalData.frameRate,
              elem.data.op / elem.comp.globalData.frameRate,
              elem.data.sw && elem.data.sw,
              elem.data.sh && elem.data.sh,
              elem.data.nm;
            var thisLayer,
              velocityAtTime,
              scoped_bm_rt,
              expression_function = eval(
                '[function _expression_function(){' +
                  val +
                  ';scoped_bm_rt=$bm_rt}]'
              )[0];
            property.kf && data.k.length,
              !this.data || this.data.hd,
              function (t, r) {
                var i,
                  s,
                  n = this.pv.length ? this.pv.length : 1,
                  l = createTypedArray('float32', n);
                t = 5;
                var u = Math.floor(time * t);
                for (i = 0, s = 0; i < u; ) {
                  for (s = 0; s < n; s += 1)
                    l[s] += -r + r * 2 * BMMath.random();
                  i += 1;
                }
                var d = time * t,
                  v = d - Math.floor(d),
                  E = createTypedArray('float32', n);
                if (n > 1) {
                  for (s = 0; s < n; s += 1)
                    E[s] =
                      this.pv[s] + l[s] + (-r + r * 2 * BMMath.random()) * v;
                  return E;
                }
                return this.pv + l[0] + (-r + r * 2 * BMMath.random()) * v;
              }.bind(this),
              thisProperty.loopIn && thisProperty.loopIn.bind(thisProperty),
              thisProperty.loopOut && thisProperty.loopOut.bind(thisProperty),
              thisProperty.smooth && thisProperty.smooth.bind(thisProperty),
              this.getValueAtTime && this.getValueAtTime.bind(this),
              this.getVelocityAtTime &&
                (velocityAtTime = this.getVelocityAtTime.bind(this)),
              elem.comp.globalData.projectInterface.bind(
                elem.comp.globalData.projectInterface
              );
            function seedRandom(e) {
              BMMath.seedrandom(randSeed + e);
            }
            var time, value;
            elem.data.ind;
            var hasParent = !!(elem.hierarchy && elem.hierarchy.length),
              parent,
              randSeed = Math.floor(Math.random() * 1e6);
            elem.globalData;
            function executeExpression(e) {
              return (
                (value = e),
                _needsRandom && seedRandom(randSeed),
                this.frameExpressionId === elem.globalData.frameId &&
                this.propType !== 'textSelector'
                  ? value
                  : (this.propType === 'textSelector',
                    thisLayer ||
                      (elem.layerInterface.text,
                      (thisLayer = elem.layerInterface),
                      elem.comp.compInterface,
                      thisLayer.toWorld.bind(thisLayer),
                      thisLayer.fromWorld.bind(thisLayer),
                      thisLayer.fromComp.bind(thisLayer),
                      thisLayer.toComp.bind(thisLayer),
                      thisLayer.mask && thisLayer.mask.bind(thisLayer)),
                    transform ||
                      (transform = elem.layerInterface('ADBE Transform Group')),
                    elemType === 4 &&
                      !content &&
                      (content = thisLayer('ADBE Root Vectors Group')),
                    effect || (effect = thisLayer(4)),
                    (hasParent = !!(elem.hierarchy && elem.hierarchy.length)),
                    hasParent &&
                      !parent &&
                      (parent = elem.hierarchy[0].layerInterface),
                    (time =
                      this.comp.renderedFrame / this.comp.globalData.frameRate),
                    needsVelocity && velocityAtTime(time),
                    expression_function(),
                    (this.frameExpressionId = elem.globalData.frameId),
                    scoped_bm_rt.propType === 'shape',
                    scoped_bm_rt)
              );
            }
            return executeExpression;
          }
          return (ob.initiateExpression = initiateExpression), ob;
        })(),
        expressionHelpers = (function () {
          function e(l, u, d) {
            u.x &&
              ((d.k = !0),
              (d.x = !0),
              (d.initiateExpression = ExpressionManager.initiateExpression),
              d.effectsSequence.push(d.initiateExpression(l, u, d).bind(d)));
          }
          function t(l) {
            return (
              (l *= this.elem.globalData.frameRate),
              (l -= this.offsetTime),
              l !== this._cachingAtTime.lastFrame &&
                ((this._cachingAtTime.lastIndex =
                  this._cachingAtTime.lastFrame < l
                    ? this._cachingAtTime.lastIndex
                    : 0),
                (this._cachingAtTime.value = this.interpolateValue(
                  l,
                  this._cachingAtTime
                )),
                (this._cachingAtTime.lastFrame = l)),
              this._cachingAtTime.value
            );
          }
          function r(l) {
            var u = -0.01,
              d = this.getValueAtTime(l),
              v = this.getValueAtTime(l + u),
              E = 0;
            if (d.length) {
              var _;
              for (_ = 0; _ < d.length; _ += 1) E += Math.pow(v[_] - d[_], 2);
              E = Math.sqrt(E) * 100;
            } else E = 0;
            return E;
          }
          function i(l) {
            if (this.vel !== void 0) return this.vel;
            var u = -0.001,
              d = this.getValueAtTime(l),
              v = this.getValueAtTime(l + u),
              E;
            if (d.length) {
              E = createTypedArray('float32', d.length);
              var _;
              for (_ = 0; _ < d.length; _ += 1) E[_] = (v[_] - d[_]) / u;
            } else E = (v - d) / u;
            return E;
          }
          function s() {
            return this.pv;
          }
          function n(l) {
            this.propertyGroup = l;
          }
          return {
            searchExpressions: e,
            getSpeedAtTime: r,
            getVelocityAtTime: i,
            getValueAtTime: t,
            getStaticValueAtTime: s,
            setGroupProperty: n,
          };
        })();
      (function () {
        function t(y, c, g) {
          if (!this.k || !this.keyframes) return this.pv;
          y = y ? y.toLowerCase() : '';
          var p = this.comp.renderedFrame,
            a = this.keyframes,
            o = a[a.length - 1].t;
          if (p <= o) return this.pv;
          var h, f;
          g
            ? (c
                ? (h = Math.abs(o - this.elem.comp.globalData.frameRate * c))
                : (h = Math.max(0, o - this.elem.data.ip)),
              (f = o - h))
            : ((!c || c > a.length - 1) && (c = a.length - 1),
              (f = a[a.length - 1 - c].t),
              (h = o - f));
          var b, P, S;
          if (y === 'pingpong') {
            var w = Math.floor((p - f) / h);
            if (w % 2 != 0)
              return this.getValueAtTime(
                (h - ((p - f) % h) + f) / this.comp.globalData.frameRate,
                0
              );
          } else if (y === 'offset') {
            var M = this.getValueAtTime(f / this.comp.globalData.frameRate, 0),
              I = this.getValueAtTime(o / this.comp.globalData.frameRate, 0),
              C = this.getValueAtTime(
                (((p - f) % h) + f) / this.comp.globalData.frameRate,
                0
              ),
              R = Math.floor((p - f) / h);
            if (this.pv.length) {
              for (S = new Array(M.length), P = S.length, b = 0; b < P; b += 1)
                S[b] = (I[b] - M[b]) * R + C[b];
              return S;
            }
            return (I - M) * R + C;
          } else if (y === 'continue') {
            var V = this.getValueAtTime(o / this.comp.globalData.frameRate, 0),
              O = this.getValueAtTime(
                (o - 0.001) / this.comp.globalData.frameRate,
                0
              );
            if (this.pv.length) {
              for (S = new Array(V.length), P = S.length, b = 0; b < P; b += 1)
                S[b] =
                  V[b] +
                  ((V[b] - O[b]) * ((p - o) / this.comp.globalData.frameRate)) /
                    5e-4;
              return S;
            }
            return V + (V - O) * ((p - o) / 0.001);
          }
          return this.getValueAtTime(
            (((p - f) % h) + f) / this.comp.globalData.frameRate,
            0
          );
        }
        function r(y, c, g) {
          if (!this.k) return this.pv;
          y = y ? y.toLowerCase() : '';
          var p = this.comp.renderedFrame,
            a = this.keyframes,
            o = a[0].t;
          if (p >= o) return this.pv;
          var h, f;
          g
            ? (c
                ? (h = Math.abs(this.elem.comp.globalData.frameRate * c))
                : (h = Math.max(0, this.elem.data.op - o)),
              (f = o + h))
            : ((!c || c > a.length - 1) && (c = a.length - 1),
              (f = a[c].t),
              (h = f - o));
          var b, P, S;
          if (y === 'pingpong') {
            var w = Math.floor((o - p) / h);
            if (w % 2 == 0)
              return this.getValueAtTime(
                (((o - p) % h) + o) / this.comp.globalData.frameRate,
                0
              );
          } else if (y === 'offset') {
            var M = this.getValueAtTime(o / this.comp.globalData.frameRate, 0),
              I = this.getValueAtTime(f / this.comp.globalData.frameRate, 0),
              C = this.getValueAtTime(
                (h - ((o - p) % h) + o) / this.comp.globalData.frameRate,
                0
              ),
              R = Math.floor((o - p) / h) + 1;
            if (this.pv.length) {
              for (S = new Array(M.length), P = S.length, b = 0; b < P; b += 1)
                S[b] = C[b] - (I[b] - M[b]) * R;
              return S;
            }
            return C - (I - M) * R;
          } else if (y === 'continue') {
            var V = this.getValueAtTime(o / this.comp.globalData.frameRate, 0),
              O = this.getValueAtTime(
                (o + 0.001) / this.comp.globalData.frameRate,
                0
              );
            if (this.pv.length) {
              for (S = new Array(V.length), P = S.length, b = 0; b < P; b += 1)
                S[b] = V[b] + ((V[b] - O[b]) * (o - p)) / 0.001;
              return S;
            }
            return V + ((V - O) * (o - p)) / 0.001;
          }
          return this.getValueAtTime(
            (h - (((o - p) % h) + o)) / this.comp.globalData.frameRate,
            0
          );
        }
        function i(y, c) {
          if (!this.k) return this.pv;
          if (((y = (y || 0.4) * 0.5), (c = Math.floor(c || 5)), c <= 1))
            return this.pv;
          var g = this.comp.renderedFrame / this.comp.globalData.frameRate,
            p = g - y,
            a = g + y,
            o = c > 1 ? (a - p) / (c - 1) : 1,
            h = 0,
            f = 0,
            b;
          this.pv.length
            ? (b = createTypedArray('float32', this.pv.length))
            : (b = 0);
          for (var P; h < c; ) {
            if (((P = this.getValueAtTime(p + h * o)), this.pv.length))
              for (f = 0; f < this.pv.length; f += 1) b[f] += P[f];
            else b += P;
            h += 1;
          }
          if (this.pv.length) for (f = 0; f < this.pv.length; f += 1) b[f] /= c;
          else b /= c;
          return b;
        }
        function s(y) {
          this._transformCachingAtTime ||
            (this._transformCachingAtTime = { v: new Matrix() });
          var c = this._transformCachingAtTime.v;
          if (
            (c.cloneFromProps(this.pre.props), this.appliedTransformations < 1)
          ) {
            var g = this.a.getValueAtTime(y);
            c.translate(
              -g[0] * this.a.mult,
              -g[1] * this.a.mult,
              g[2] * this.a.mult
            );
          }
          if (this.appliedTransformations < 2) {
            var p = this.s.getValueAtTime(y);
            c.scale(p[0] * this.s.mult, p[1] * this.s.mult, p[2] * this.s.mult);
          }
          if (this.sk && this.appliedTransformations < 3) {
            var a = this.sk.getValueAtTime(y),
              o = this.sa.getValueAtTime(y);
            c.skewFromAxis(-a * this.sk.mult, o * this.sa.mult);
          }
          if (this.r && this.appliedTransformations < 4) {
            var h = this.r.getValueAtTime(y);
            c.rotate(-h * this.r.mult);
          } else if (!this.r && this.appliedTransformations < 4) {
            var f = this.rz.getValueAtTime(y),
              b = this.ry.getValueAtTime(y),
              P = this.rx.getValueAtTime(y),
              S = this.or.getValueAtTime(y);
            c.rotateZ(-f * this.rz.mult)
              .rotateY(b * this.ry.mult)
              .rotateX(P * this.rx.mult)
              .rotateZ(-S[2] * this.or.mult)
              .rotateY(S[1] * this.or.mult)
              .rotateX(S[0] * this.or.mult);
          }
          if (this.data.p && this.data.p.s) {
            var w = this.px.getValueAtTime(y),
              M = this.py.getValueAtTime(y);
            if (this.data.p.z) {
              var I = this.pz.getValueAtTime(y);
              c.translate(
                w * this.px.mult,
                M * this.py.mult,
                -I * this.pz.mult
              );
            } else c.translate(w * this.px.mult, M * this.py.mult, 0);
          } else {
            var C = this.p.getValueAtTime(y);
            c.translate(
              C[0] * this.p.mult,
              C[1] * this.p.mult,
              -C[2] * this.p.mult
            );
          }
          return c;
        }
        function n() {
          return this.v.clone(new Matrix());
        }
        var l = TransformPropertyFactory.getTransformProperty;
        TransformPropertyFactory.getTransformProperty = function (y, c, g) {
          var p = l(y, c, g);
          return (
            p.dynamicProperties.length
              ? (p.getValueAtTime = s.bind(p))
              : (p.getValueAtTime = n.bind(p)),
            (p.setGroupProperty = expressionHelpers.setGroupProperty),
            p
          );
        };
        var u = PropertyFactory.getProp;
        PropertyFactory.getProp = function (y, c, g, p, a) {
          var o = u(y, c, g, p, a);
          o.kf
            ? (o.getValueAtTime = expressionHelpers.getValueAtTime.bind(o))
            : (o.getValueAtTime =
                expressionHelpers.getStaticValueAtTime.bind(o)),
            (o.setGroupProperty = expressionHelpers.setGroupProperty),
            (o.loopOut = t),
            (o.loopIn = r),
            (o.smooth = i),
            (o.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(o)),
            (o.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(o)),
            (o.numKeys = c.a === 1 ? c.k.length : 0),
            (o.propertyIndex = c.ix);
          var h = 0;
          return (
            g !== 0 &&
              (h = createTypedArray(
                'float32',
                c.a === 1 ? c.k[0].s.length : c.k.length
              )),
            (o._cachingAtTime = {
              lastFrame: initialDefaultFrame,
              lastIndex: 0,
              value: h,
            }),
            expressionHelpers.searchExpressions(y, c, o),
            o.k && a.addDynamicProperty(o),
            o
          );
        };
        function d(y) {
          return (
            this._cachingAtTime ||
              (this._cachingAtTime = {
                shapeValue: shapePool.clone(this.pv),
                lastIndex: 0,
                lastTime: initialDefaultFrame,
              }),
            (y *= this.elem.globalData.frameRate),
            (y -= this.offsetTime),
            y !== this._cachingAtTime.lastTime &&
              ((this._cachingAtTime.lastIndex =
                this._cachingAtTime.lastTime < y ? this._caching.lastIndex : 0),
              (this._cachingAtTime.lastTime = y),
              this.interpolateShape(
                y,
                this._cachingAtTime.shapeValue,
                this._cachingAtTime
              )),
            this._cachingAtTime.shapeValue
          );
        }
        var v = ShapePropertyFactory.getConstructorFunction(),
          E = ShapePropertyFactory.getKeyframedConstructorFunction();
        function _() {}
        (_.prototype = {
          vertices: function (y, c) {
            this.k && this.getValue();
            var g = this.v;
            c !== void 0 && (g = this.getValueAtTime(c, 0));
            var p,
              a = g._length,
              o = g[y],
              h = g.v,
              f = createSizedArray(a);
            for (p = 0; p < a; p += 1)
              y === 'i' || y === 'o'
                ? (f[p] = [o[p][0] - h[p][0], o[p][1] - h[p][1]])
                : (f[p] = [o[p][0], o[p][1]]);
            return f;
          },
          points: function (y) {
            return this.vertices('v', y);
          },
          inTangents: function (y) {
            return this.vertices('i', y);
          },
          outTangents: function (y) {
            return this.vertices('o', y);
          },
          isClosed: function () {
            return this.v.c;
          },
          pointOnPath: function (y, c) {
            var g = this.v;
            c !== void 0 && (g = this.getValueAtTime(c, 0)),
              this._segmentsLength ||
                (this._segmentsLength = bez.getSegmentsLength(g));
            for (
              var p = this._segmentsLength,
                a = p.lengths,
                o = p.totalLength * y,
                h = 0,
                f = a.length,
                b = 0,
                P;
              h < f;

            ) {
              if (b + a[h].addedLength > o) {
                var S = h,
                  w = g.c && h === f - 1 ? 0 : h + 1,
                  M = (o - b) / a[h].addedLength;
                P = bez.getPointInSegment(
                  g.v[S],
                  g.v[w],
                  g.o[S],
                  g.i[w],
                  M,
                  a[h]
                );
                break;
              } else b += a[h].addedLength;
              h += 1;
            }
            return (
              P ||
                (P = g.c
                  ? [g.v[0][0], g.v[0][1]]
                  : [g.v[g._length - 1][0], g.v[g._length - 1][1]]),
              P
            );
          },
          vectorOnPath: function (y, c, g) {
            y == 1 ? (y = this.v.c) : y == 0 && (y = 0.999);
            var p = this.pointOnPath(y, c),
              a = this.pointOnPath(y + 0.001, c),
              o = a[0] - p[0],
              h = a[1] - p[1],
              f = Math.sqrt(Math.pow(o, 2) + Math.pow(h, 2));
            if (f === 0) return [0, 0];
            var b = g === 'tangent' ? [o / f, h / f] : [-h / f, o / f];
            return b;
          },
          tangentOnPath: function (y, c) {
            return this.vectorOnPath(y, c, 'tangent');
          },
          normalOnPath: function (y, c) {
            return this.vectorOnPath(y, c, 'normal');
          },
          setGroupProperty: expressionHelpers.setGroupProperty,
          getValueAtTime: expressionHelpers.getStaticValueAtTime,
        }),
          extendPrototype([_], v),
          extendPrototype([_], E),
          (E.prototype.getValueAtTime = d),
          (E.prototype.initiateExpression =
            ExpressionManager.initiateExpression);
        var m = ShapePropertyFactory.getShapeProp;
        ShapePropertyFactory.getShapeProp = function (y, c, g, p, a) {
          var o = m(y, c, g, p, a);
          return (
            (o.propertyIndex = c.ix),
            (o.lock = !1),
            g === 3
              ? expressionHelpers.searchExpressions(y, c.pt, o)
              : g === 4 && expressionHelpers.searchExpressions(y, c.ks, o),
            o.k && y.addDynamicProperty(o),
            o
          );
        };
      })(),
        (function () {
          function t() {
            return this.data.d.x
              ? ((this.calculateExpression =
                  ExpressionManager.initiateExpression.bind(this)(
                    this.elem,
                    this.data.d,
                    this
                  )),
                this.addEffect(this.getExpressionValue.bind(this)),
                !0)
              : null;
          }
          (TextProperty.prototype.getExpressionValue = function (r, i) {
            var s = this.calculateExpression(i);
            if (r.t !== s) {
              var n = {};
              return (
                this.copyData(n, r),
                (n.t = s.toString()),
                (n.__complete = !1),
                n
              );
            }
            return r;
          }),
            (TextProperty.prototype.searchProperty = function () {
              var r = this.searchKeyframes(),
                i = this.searchExpressions();
              return (this.kf = r || i), this.kf;
            }),
            (TextProperty.prototype.searchExpressions = t);
        })();
      var ShapePathInterface = (function () {
          return function (t, r, i) {
            var s = r.sh;
            function n(u) {
              return u === 'Shape' ||
                u === 'shape' ||
                u === 'Path' ||
                u === 'path' ||
                u === 'ADBE Vector Shape' ||
                u === 2
                ? n.path
                : null;
            }
            var l = propertyGroupFactory(n, i);
            return (
              s.setGroupProperty(PropertyInterface('Path', l)),
              Object.defineProperties(n, {
                path: {
                  get: function () {
                    return s.k && s.getValue(), s;
                  },
                },
                shape: {
                  get: function () {
                    return s.k && s.getValue(), s;
                  },
                },
                _name: { value: t.nm },
                ix: { value: t.ix },
                propertyIndex: { value: t.ix },
                mn: { value: t.mn },
                propertyGroup: { value: i },
              }),
              n
            );
          };
        })(),
        propertyGroupFactory = (function () {
          return function (e, t) {
            return function (r) {
              return (r = r === void 0 ? 1 : r), r <= 0 ? e : t(r - 1);
            };
          };
        })(),
        PropertyInterface = (function () {
          return function (e, t) {
            var r = { _name: e };
            function i(s) {
              return (s = s === void 0 ? 1 : s), s <= 0 ? r : t(s - 1);
            }
            return i;
          };
        })(),
        ShapeExpressionInterface = (function () {
          function e(c, g, p) {
            var a = [],
              o,
              h = c ? c.length : 0;
            for (o = 0; o < h; o += 1)
              c[o].ty === 'gr'
                ? a.push(r(c[o], g[o], p))
                : c[o].ty === 'fl'
                ? a.push(i(c[o], g[o], p))
                : c[o].ty === 'st'
                ? a.push(l(c[o], g[o], p))
                : c[o].ty === 'tm'
                ? a.push(u(c[o], g[o], p))
                : c[o].ty === 'tr' ||
                  (c[o].ty === 'el'
                    ? a.push(v(c[o], g[o], p))
                    : c[o].ty === 'sr'
                    ? a.push(E(c[o], g[o], p))
                    : c[o].ty === 'sh'
                    ? a.push(ShapePathInterface(c[o], g[o], p))
                    : c[o].ty === 'rc'
                    ? a.push(_(c[o], g[o], p))
                    : c[o].ty === 'rd'
                    ? a.push(m(c[o], g[o], p))
                    : c[o].ty === 'rp'
                    ? a.push(y(c[o], g[o], p))
                    : c[o].ty === 'gf'
                    ? a.push(s(c[o], g[o], p))
                    : a.push(n(c[o], g[o])));
            return a;
          }
          function t(c, g, p) {
            var a,
              o = function (b) {
                for (var P = 0, S = a.length; P < S; ) {
                  if (
                    a[P]._name === b ||
                    a[P].mn === b ||
                    a[P].propertyIndex === b ||
                    a[P].ix === b ||
                    a[P].ind === b
                  )
                    return a[P];
                  P += 1;
                }
                return typeof b == 'number' ? a[b - 1] : null;
              };
            (o.propertyGroup = propertyGroupFactory(o, p)),
              (a = e(c.it, g.it, o.propertyGroup)),
              (o.numProperties = a.length);
            var h = d(
              c.it[c.it.length - 1],
              g.it[g.it.length - 1],
              o.propertyGroup
            );
            return (
              (o.transform = h), (o.propertyIndex = c.cix), (o._name = c.nm), o
            );
          }
          function r(c, g, p) {
            var a = function (b) {
              switch (b) {
                case 'ADBE Vectors Group':
                case 'Contents':
                case 2:
                  return a.content;
                default:
                  return a.transform;
              }
            };
            a.propertyGroup = propertyGroupFactory(a, p);
            var o = t(c, g, a.propertyGroup),
              h = d(
                c.it[c.it.length - 1],
                g.it[g.it.length - 1],
                a.propertyGroup
              );
            return (
              (a.content = o),
              (a.transform = h),
              Object.defineProperty(a, '_name', {
                get: function () {
                  return c.nm;
                },
              }),
              (a.numProperties = c.np),
              (a.propertyIndex = c.ix),
              (a.nm = c.nm),
              (a.mn = c.mn),
              a
            );
          }
          function i(c, g, p) {
            function a(o) {
              return o === 'Color' || o === 'color'
                ? a.color
                : o === 'Opacity' || o === 'opacity'
                ? a.opacity
                : null;
            }
            return (
              Object.defineProperties(a, {
                color: { get: ExpressionPropertyInterface(g.c) },
                opacity: { get: ExpressionPropertyInterface(g.o) },
                _name: { value: c.nm },
                mn: { value: c.mn },
              }),
              g.c.setGroupProperty(PropertyInterface('Color', p)),
              g.o.setGroupProperty(PropertyInterface('Opacity', p)),
              a
            );
          }
          function s(c, g, p) {
            function a(o) {
              return o === 'Start Point' || o === 'start point'
                ? a.startPoint
                : o === 'End Point' || o === 'end point'
                ? a.endPoint
                : o === 'Opacity' || o === 'opacity'
                ? a.opacity
                : null;
            }
            return (
              Object.defineProperties(a, {
                startPoint: { get: ExpressionPropertyInterface(g.s) },
                endPoint: { get: ExpressionPropertyInterface(g.e) },
                opacity: { get: ExpressionPropertyInterface(g.o) },
                type: {
                  get: function () {
                    return 'a';
                  },
                },
                _name: { value: c.nm },
                mn: { value: c.mn },
              }),
              g.s.setGroupProperty(PropertyInterface('Start Point', p)),
              g.e.setGroupProperty(PropertyInterface('End Point', p)),
              g.o.setGroupProperty(PropertyInterface('Opacity', p)),
              a
            );
          }
          function n() {
            function c() {
              return null;
            }
            return c;
          }
          function l(c, g, p) {
            var a = propertyGroupFactory(S, p),
              o = propertyGroupFactory(P, a);
            function h(w) {
              Object.defineProperty(P, c.d[w].nm, {
                get: ExpressionPropertyInterface(g.d.dataProps[w].p),
              });
            }
            var f,
              b = c.d ? c.d.length : 0,
              P = {};
            for (f = 0; f < b; f += 1)
              h(f), g.d.dataProps[f].p.setGroupProperty(o);
            function S(w) {
              return w === 'Color' || w === 'color'
                ? S.color
                : w === 'Opacity' || w === 'opacity'
                ? S.opacity
                : w === 'Stroke Width' || w === 'stroke width'
                ? S.strokeWidth
                : null;
            }
            return (
              Object.defineProperties(S, {
                color: { get: ExpressionPropertyInterface(g.c) },
                opacity: { get: ExpressionPropertyInterface(g.o) },
                strokeWidth: { get: ExpressionPropertyInterface(g.w) },
                dash: {
                  get: function () {
                    return P;
                  },
                },
                _name: { value: c.nm },
                mn: { value: c.mn },
              }),
              g.c.setGroupProperty(PropertyInterface('Color', a)),
              g.o.setGroupProperty(PropertyInterface('Opacity', a)),
              g.w.setGroupProperty(PropertyInterface('Stroke Width', a)),
              S
            );
          }
          function u(c, g, p) {
            function a(h) {
              return h === c.e.ix || h === 'End' || h === 'end'
                ? a.end
                : h === c.s.ix
                ? a.start
                : h === c.o.ix
                ? a.offset
                : null;
            }
            var o = propertyGroupFactory(a, p);
            return (
              (a.propertyIndex = c.ix),
              g.s.setGroupProperty(PropertyInterface('Start', o)),
              g.e.setGroupProperty(PropertyInterface('End', o)),
              g.o.setGroupProperty(PropertyInterface('Offset', o)),
              (a.propertyIndex = c.ix),
              (a.propertyGroup = p),
              Object.defineProperties(a, {
                start: { get: ExpressionPropertyInterface(g.s) },
                end: { get: ExpressionPropertyInterface(g.e) },
                offset: { get: ExpressionPropertyInterface(g.o) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          function d(c, g, p) {
            function a(h) {
              return c.a.ix === h || h === 'Anchor Point'
                ? a.anchorPoint
                : c.o.ix === h || h === 'Opacity'
                ? a.opacity
                : c.p.ix === h || h === 'Position'
                ? a.position
                : c.r.ix === h ||
                  h === 'Rotation' ||
                  h === 'ADBE Vector Rotation'
                ? a.rotation
                : c.s.ix === h || h === 'Scale'
                ? a.scale
                : (c.sk && c.sk.ix === h) || h === 'Skew'
                ? a.skew
                : (c.sa && c.sa.ix === h) || h === 'Skew Axis'
                ? a.skewAxis
                : null;
            }
            var o = propertyGroupFactory(a, p);
            return (
              g.transform.mProps.o.setGroupProperty(
                PropertyInterface('Opacity', o)
              ),
              g.transform.mProps.p.setGroupProperty(
                PropertyInterface('Position', o)
              ),
              g.transform.mProps.a.setGroupProperty(
                PropertyInterface('Anchor Point', o)
              ),
              g.transform.mProps.s.setGroupProperty(
                PropertyInterface('Scale', o)
              ),
              g.transform.mProps.r.setGroupProperty(
                PropertyInterface('Rotation', o)
              ),
              g.transform.mProps.sk &&
                (g.transform.mProps.sk.setGroupProperty(
                  PropertyInterface('Skew', o)
                ),
                g.transform.mProps.sa.setGroupProperty(
                  PropertyInterface('Skew Angle', o)
                )),
              g.transform.op.setGroupProperty(PropertyInterface('Opacity', o)),
              Object.defineProperties(a, {
                opacity: {
                  get: ExpressionPropertyInterface(g.transform.mProps.o),
                },
                position: {
                  get: ExpressionPropertyInterface(g.transform.mProps.p),
                },
                anchorPoint: {
                  get: ExpressionPropertyInterface(g.transform.mProps.a),
                },
                scale: {
                  get: ExpressionPropertyInterface(g.transform.mProps.s),
                },
                rotation: {
                  get: ExpressionPropertyInterface(g.transform.mProps.r),
                },
                skew: {
                  get: ExpressionPropertyInterface(g.transform.mProps.sk),
                },
                skewAxis: {
                  get: ExpressionPropertyInterface(g.transform.mProps.sa),
                },
                _name: { value: c.nm },
              }),
              (a.ty = 'tr'),
              (a.mn = c.mn),
              (a.propertyGroup = p),
              a
            );
          }
          function v(c, g, p) {
            function a(f) {
              return c.p.ix === f ? a.position : c.s.ix === f ? a.size : null;
            }
            var o = propertyGroupFactory(a, p);
            a.propertyIndex = c.ix;
            var h = g.sh.ty === 'tm' ? g.sh.prop : g.sh;
            return (
              h.s.setGroupProperty(PropertyInterface('Size', o)),
              h.p.setGroupProperty(PropertyInterface('Position', o)),
              Object.defineProperties(a, {
                size: { get: ExpressionPropertyInterface(h.s) },
                position: { get: ExpressionPropertyInterface(h.p) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          function E(c, g, p) {
            function a(f) {
              return c.p.ix === f
                ? a.position
                : c.r.ix === f
                ? a.rotation
                : c.pt.ix === f
                ? a.points
                : c.or.ix === f || f === 'ADBE Vector Star Outer Radius'
                ? a.outerRadius
                : c.os.ix === f
                ? a.outerRoundness
                : c.ir &&
                  (c.ir.ix === f || f === 'ADBE Vector Star Inner Radius')
                ? a.innerRadius
                : c.is && c.is.ix === f
                ? a.innerRoundness
                : null;
            }
            var o = propertyGroupFactory(a, p),
              h = g.sh.ty === 'tm' ? g.sh.prop : g.sh;
            return (
              (a.propertyIndex = c.ix),
              h.or.setGroupProperty(PropertyInterface('Outer Radius', o)),
              h.os.setGroupProperty(PropertyInterface('Outer Roundness', o)),
              h.pt.setGroupProperty(PropertyInterface('Points', o)),
              h.p.setGroupProperty(PropertyInterface('Position', o)),
              h.r.setGroupProperty(PropertyInterface('Rotation', o)),
              c.ir &&
                (h.ir.setGroupProperty(PropertyInterface('Inner Radius', o)),
                h.is.setGroupProperty(PropertyInterface('Inner Roundness', o))),
              Object.defineProperties(a, {
                position: { get: ExpressionPropertyInterface(h.p) },
                rotation: { get: ExpressionPropertyInterface(h.r) },
                points: { get: ExpressionPropertyInterface(h.pt) },
                outerRadius: { get: ExpressionPropertyInterface(h.or) },
                outerRoundness: { get: ExpressionPropertyInterface(h.os) },
                innerRadius: { get: ExpressionPropertyInterface(h.ir) },
                innerRoundness: { get: ExpressionPropertyInterface(h.is) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          function _(c, g, p) {
            function a(f) {
              return c.p.ix === f
                ? a.position
                : c.r.ix === f
                ? a.roundness
                : c.s.ix === f || f === 'Size' || f === 'ADBE Vector Rect Size'
                ? a.size
                : null;
            }
            var o = propertyGroupFactory(a, p),
              h = g.sh.ty === 'tm' ? g.sh.prop : g.sh;
            return (
              (a.propertyIndex = c.ix),
              h.p.setGroupProperty(PropertyInterface('Position', o)),
              h.s.setGroupProperty(PropertyInterface('Size', o)),
              h.r.setGroupProperty(PropertyInterface('Rotation', o)),
              Object.defineProperties(a, {
                position: { get: ExpressionPropertyInterface(h.p) },
                roundness: { get: ExpressionPropertyInterface(h.r) },
                size: { get: ExpressionPropertyInterface(h.s) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          function m(c, g, p) {
            function a(f) {
              return c.r.ix === f || f === 'Round Corners 1' ? a.radius : null;
            }
            var o = propertyGroupFactory(a, p),
              h = g;
            return (
              (a.propertyIndex = c.ix),
              h.rd.setGroupProperty(PropertyInterface('Radius', o)),
              Object.defineProperties(a, {
                radius: { get: ExpressionPropertyInterface(h.rd) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          function y(c, g, p) {
            function a(f) {
              return c.c.ix === f || f === 'Copies'
                ? a.copies
                : c.o.ix === f || f === 'Offset'
                ? a.offset
                : null;
            }
            var o = propertyGroupFactory(a, p),
              h = g;
            return (
              (a.propertyIndex = c.ix),
              h.c.setGroupProperty(PropertyInterface('Copies', o)),
              h.o.setGroupProperty(PropertyInterface('Offset', o)),
              Object.defineProperties(a, {
                copies: { get: ExpressionPropertyInterface(h.c) },
                offset: { get: ExpressionPropertyInterface(h.o) },
                _name: { value: c.nm },
              }),
              (a.mn = c.mn),
              a
            );
          }
          return function (c, g, p) {
            var a;
            function o(f) {
              if (typeof f == 'number')
                return (f = f === void 0 ? 1 : f), f === 0 ? p : a[f - 1];
              for (var b = 0, P = a.length; b < P; ) {
                if (a[b]._name === f) return a[b];
                b += 1;
              }
              return null;
            }
            function h() {
              return p;
            }
            return (
              (o.propertyGroup = propertyGroupFactory(o, h)),
              (a = e(c, g, o.propertyGroup)),
              (o.numProperties = a.length),
              (o._name = 'Contents'),
              o
            );
          };
        })(),
        TextExpressionInterface = (function () {
          return function (e) {
            var t, r;
            function i(s) {
              switch (s) {
                case 'ADBE Text Document':
                  return i.sourceText;
                default:
                  return null;
              }
            }
            return (
              Object.defineProperty(i, 'sourceText', {
                get: function () {
                  e.textProperty.getValue();
                  var s = e.textProperty.currentData.t;
                  return (
                    s !== t &&
                      ((e.textProperty.currentData.t = t),
                      (r = new String(s)),
                      (r.value = s || new String(s))),
                    r
                  );
                },
              }),
              i
            );
          };
        })(),
        LayerExpressionInterface = (function () {
          function e(v) {
            var E = new Matrix();
            if (v !== void 0) {
              var _ = this._elem.finalTransform.mProp.getValueAtTime(v);
              _.clone(E);
            } else {
              var m = this._elem.finalTransform.mProp;
              m.applyToMatrix(E);
            }
            return E;
          }
          function t(v, E) {
            var _ = this.getMatrix(E);
            return (
              (_.props[12] = 0),
              (_.props[13] = 0),
              (_.props[14] = 0),
              this.applyPoint(_, v)
            );
          }
          function r(v, E) {
            var _ = this.getMatrix(E);
            return this.applyPoint(_, v);
          }
          function i(v, E) {
            var _ = this.getMatrix(E);
            return (
              (_.props[12] = 0),
              (_.props[13] = 0),
              (_.props[14] = 0),
              this.invertPoint(_, v)
            );
          }
          function s(v, E) {
            var _ = this.getMatrix(E);
            return this.invertPoint(_, v);
          }
          function n(v, E) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var _,
                m = this._elem.hierarchy.length;
              for (_ = 0; _ < m; _ += 1)
                this._elem.hierarchy[_].finalTransform.mProp.applyToMatrix(v);
            }
            return v.applyToPointArray(E[0], E[1], E[2] || 0);
          }
          function l(v, E) {
            if (this._elem.hierarchy && this._elem.hierarchy.length) {
              var _,
                m = this._elem.hierarchy.length;
              for (_ = 0; _ < m; _ += 1)
                this._elem.hierarchy[_].finalTransform.mProp.applyToMatrix(v);
            }
            return v.inversePoint(E);
          }
          function u(v) {
            var E = new Matrix();
            if (
              (E.reset(),
              this._elem.finalTransform.mProp.applyToMatrix(E),
              this._elem.hierarchy && this._elem.hierarchy.length)
            ) {
              var _,
                m = this._elem.hierarchy.length;
              for (_ = 0; _ < m; _ += 1)
                this._elem.hierarchy[_].finalTransform.mProp.applyToMatrix(E);
              return E.inversePoint(v);
            }
            return E.inversePoint(v);
          }
          function d() {
            return [1, 1, 1, 1];
          }
          return function (v) {
            var E;
            function _(g) {
              y.mask = new MaskManagerInterface(g, v);
            }
            function m(g) {
              y.effect = g;
            }
            function y(g) {
              switch (g) {
                case 'ADBE Root Vectors Group':
                case 'Contents':
                case 2:
                  return y.shapeInterface;
                case 1:
                case 6:
                case 'Transform':
                case 'transform':
                case 'ADBE Transform Group':
                  return E;
                case 4:
                case 'ADBE Effect Parade':
                case 'effects':
                case 'Effects':
                  return y.effect;
                case 'ADBE Text Properties':
                  return y.textInterface;
                default:
                  return null;
              }
            }
            (y.getMatrix = e),
              (y.invertPoint = l),
              (y.applyPoint = n),
              (y.toWorld = r),
              (y.toWorldVec = t),
              (y.fromWorld = s),
              (y.fromWorldVec = i),
              (y.toComp = r),
              (y.fromComp = u),
              (y.sampleImage = d),
              (y.sourceRectAtTime = v.sourceRectAtTime.bind(v)),
              (y._elem = v),
              (E = TransformExpressionInterface(v.finalTransform.mProp));
            var c = getDescriptor(E, 'anchorPoint');
            return (
              Object.defineProperties(y, {
                hasParent: {
                  get: function () {
                    return v.hierarchy.length;
                  },
                },
                parent: {
                  get: function () {
                    return v.hierarchy[0].layerInterface;
                  },
                },
                rotation: getDescriptor(E, 'rotation'),
                scale: getDescriptor(E, 'scale'),
                position: getDescriptor(E, 'position'),
                opacity: getDescriptor(E, 'opacity'),
                anchorPoint: c,
                anchor_point: c,
                transform: {
                  get: function () {
                    return E;
                  },
                },
                active: {
                  get: function () {
                    return v.isInRange;
                  },
                },
              }),
              (y.startTime = v.data.st),
              (y.index = v.data.ind),
              (y.source = v.data.refId),
              (y.height = v.data.ty === 0 ? v.data.h : 100),
              (y.width = v.data.ty === 0 ? v.data.w : 100),
              (y.inPoint = v.data.ip / v.comp.globalData.frameRate),
              (y.outPoint = v.data.op / v.comp.globalData.frameRate),
              (y._name = v.data.nm),
              (y.registerMaskInterface = _),
              (y.registerEffectsInterface = m),
              y
            );
          };
        })(),
        FootageInterface = (function () {
          var e = function (r) {
              var i = '',
                s = r.getFootageData();
              function n() {
                return (i = ''), (s = r.getFootageData()), l;
              }
              function l(u) {
                if (s[u])
                  return (i = u), (s = s[u]), typeof s == 'object' ? l : s;
                var d = u.indexOf(i);
                if (d !== -1) {
                  var v = parseInt(u.substr(d + i.length), 10);
                  return (s = s[v]), typeof s == 'object' ? l : s;
                }
                return '';
              }
              return n;
            },
            t = function (r) {
              function i(s) {
                return s === 'Outline' ? i.outlineInterface() : null;
              }
              return (i._name = 'Outline'), (i.outlineInterface = e(r)), i;
            };
          return function (r) {
            function i(s) {
              return s === 'Data' ? i.dataInterface : null;
            }
            return (i._name = 'Data'), (i.dataInterface = t(r)), i;
          };
        })(),
        CompExpressionInterface = (function () {
          return function (e) {
            function t(r) {
              for (var i = 0, s = e.layers.length; i < s; ) {
                if (e.layers[i].nm === r || e.layers[i].ind === r)
                  return e.elements[i].layerInterface;
                i += 1;
              }
              return null;
            }
            return (
              Object.defineProperty(t, '_name', { value: e.data.nm }),
              (t.layer = t),
              (t.pixelAspect = 1),
              (t.height = e.data.h || e.globalData.compSize.h),
              (t.width = e.data.w || e.globalData.compSize.w),
              (t.pixelAspect = 1),
              (t.frameDuration = 1 / e.globalData.frameRate),
              (t.displayStartTime = 0),
              (t.numLayers = e.layers.length),
              t
            );
          };
        })(),
        TransformExpressionInterface = (function () {
          return function (e) {
            function t(l) {
              switch (l) {
                case 'scale':
                case 'Scale':
                case 'ADBE Scale':
                case 6:
                  return t.scale;
                case 'rotation':
                case 'Rotation':
                case 'ADBE Rotation':
                case 'ADBE Rotate Z':
                case 10:
                  return t.rotation;
                case 'ADBE Rotate X':
                  return t.xRotation;
                case 'ADBE Rotate Y':
                  return t.yRotation;
                case 'position':
                case 'Position':
                case 'ADBE Position':
                case 2:
                  return t.position;
                case 'ADBE Position_0':
                  return t.xPosition;
                case 'ADBE Position_1':
                  return t.yPosition;
                case 'ADBE Position_2':
                  return t.zPosition;
                case 'anchorPoint':
                case 'AnchorPoint':
                case 'Anchor Point':
                case 'ADBE AnchorPoint':
                case 1:
                  return t.anchorPoint;
                case 'opacity':
                case 'Opacity':
                case 11:
                  return t.opacity;
                default:
                  return null;
              }
            }
            Object.defineProperty(t, 'rotation', {
              get: ExpressionPropertyInterface(e.r || e.rz),
            }),
              Object.defineProperty(t, 'zRotation', {
                get: ExpressionPropertyInterface(e.rz || e.r),
              }),
              Object.defineProperty(t, 'xRotation', {
                get: ExpressionPropertyInterface(e.rx),
              }),
              Object.defineProperty(t, 'yRotation', {
                get: ExpressionPropertyInterface(e.ry),
              }),
              Object.defineProperty(t, 'scale', {
                get: ExpressionPropertyInterface(e.s),
              });
            var r, i, s, n;
            return (
              e.p
                ? (n = ExpressionPropertyInterface(e.p))
                : ((r = ExpressionPropertyInterface(e.px)),
                  (i = ExpressionPropertyInterface(e.py)),
                  e.pz && (s = ExpressionPropertyInterface(e.pz))),
              Object.defineProperty(t, 'position', {
                get: function () {
                  return e.p ? n() : [r(), i(), s ? s() : 0];
                },
              }),
              Object.defineProperty(t, 'xPosition', {
                get: ExpressionPropertyInterface(e.px),
              }),
              Object.defineProperty(t, 'yPosition', {
                get: ExpressionPropertyInterface(e.py),
              }),
              Object.defineProperty(t, 'zPosition', {
                get: ExpressionPropertyInterface(e.pz),
              }),
              Object.defineProperty(t, 'anchorPoint', {
                get: ExpressionPropertyInterface(e.a),
              }),
              Object.defineProperty(t, 'opacity', {
                get: ExpressionPropertyInterface(e.o),
              }),
              Object.defineProperty(t, 'skew', {
                get: ExpressionPropertyInterface(e.sk),
              }),
              Object.defineProperty(t, 'skewAxis', {
                get: ExpressionPropertyInterface(e.sa),
              }),
              Object.defineProperty(t, 'orientation', {
                get: ExpressionPropertyInterface(e.or),
              }),
              t
            );
          };
        })(),
        ProjectInterface = (function () {
          function e(t) {
            this.compositions.push(t);
          }
          return function () {
            function t(r) {
              for (var i = 0, s = this.compositions.length; i < s; ) {
                if (
                  this.compositions[i].data &&
                  this.compositions[i].data.nm === r
                )
                  return (
                    this.compositions[i].prepareFrame &&
                      this.compositions[i].data.xt &&
                      this.compositions[i].prepareFrame(this.currentFrame),
                    this.compositions[i].compInterface
                  );
                i += 1;
              }
              return null;
            }
            return (
              (t.compositions = []),
              (t.currentFrame = 0),
              (t.registerComposition = e),
              t
            );
          };
        })(),
        EffectsExpressionInterface = (function () {
          var e = { createEffectsInterface: t };
          function t(s, n) {
            if (s.effectsManager) {
              var l = [],
                u = s.data.ef,
                d,
                v = s.effectsManager.effectElements.length;
              for (d = 0; d < v; d += 1)
                l.push(r(u[d], s.effectsManager.effectElements[d], n, s));
              var E = s.data.ef || [],
                _ = function (m) {
                  for (d = 0, v = E.length; d < v; ) {
                    if (m === E[d].nm || m === E[d].mn || m === E[d].ix)
                      return l[d];
                    d += 1;
                  }
                  return null;
                };
              return (
                Object.defineProperty(_, 'numProperties', {
                  get: function () {
                    return E.length;
                  },
                }),
                _
              );
            }
            return null;
          }
          function r(s, n, l, u) {
            function d(y) {
              for (var c = s.ef, g = 0, p = c.length; g < p; ) {
                if (y === c[g].nm || y === c[g].mn || y === c[g].ix)
                  return c[g].ty === 5 ? E[g] : E[g]();
                g += 1;
              }
              throw new Error();
            }
            var v = propertyGroupFactory(d, l),
              E = [],
              _,
              m = s.ef.length;
            for (_ = 0; _ < m; _ += 1)
              s.ef[_].ty === 5
                ? E.push(
                    r(
                      s.ef[_],
                      n.effectElements[_],
                      n.effectElements[_].propertyGroup,
                      u
                    )
                  )
                : E.push(i(n.effectElements[_], s.ef[_].ty, u, v));
            return (
              s.mn === 'ADBE Color Control' &&
                Object.defineProperty(d, 'color', {
                  get: function () {
                    return E[0]();
                  },
                }),
              Object.defineProperties(d, {
                numProperties: {
                  get: function () {
                    return s.np;
                  },
                },
                _name: { value: s.nm },
                propertyGroup: { value: v },
              }),
              (d.enabled = s.en !== 0),
              (d.active = d.enabled),
              d
            );
          }
          function i(s, n, l, u) {
            var d = ExpressionPropertyInterface(s.p);
            function v() {
              return n === 10 ? l.comp.compInterface(s.p.v) : d();
            }
            return (
              s.p.setGroupProperty &&
                s.p.setGroupProperty(PropertyInterface('', u)),
              v
            );
          }
          return e;
        })(),
        MaskManagerInterface = (function () {
          function e(r, i) {
            (this._mask = r), (this._data = i);
          }
          Object.defineProperty(e.prototype, 'maskPath', {
            get: function () {
              return (
                this._mask.prop.k && this._mask.prop.getValue(), this._mask.prop
              );
            },
          }),
            Object.defineProperty(e.prototype, 'maskOpacity', {
              get: function () {
                return (
                  this._mask.op.k && this._mask.op.getValue(),
                  this._mask.op.v * 100
                );
              },
            });
          var t = function (r) {
            var i = createSizedArray(r.viewData.length),
              s,
              n = r.viewData.length;
            for (s = 0; s < n; s += 1)
              i[s] = new e(r.viewData[s], r.masksProperties[s]);
            var l = function (u) {
              for (s = 0; s < n; ) {
                if (r.masksProperties[s].nm === u) return i[s];
                s += 1;
              }
              return null;
            };
            return l;
          };
          return t;
        })(),
        ExpressionPropertyInterface = (function () {
          var e = { pv: 0, v: 0, mult: 1 },
            t = { pv: [0, 0, 0], v: [0, 0, 0], mult: 1 };
          function r(l, u, d) {
            Object.defineProperty(l, 'velocity', {
              get: function () {
                return u.getVelocityAtTime(u.comp.currentFrame);
              },
            }),
              (l.numKeys = u.keyframes ? u.keyframes.length : 0),
              (l.key = function (v) {
                if (!l.numKeys) return 0;
                var E = '';
                's' in u.keyframes[v - 1]
                  ? (E = u.keyframes[v - 1].s)
                  : 'e' in u.keyframes[v - 2]
                  ? (E = u.keyframes[v - 2].e)
                  : (E = u.keyframes[v - 2].s);
                var _ =
                  d === 'unidimensional' ? new Number(E) : Object.assign({}, E);
                return (
                  (_.time =
                    u.keyframes[v - 1].t / u.elem.comp.globalData.frameRate),
                  (_.value = d === 'unidimensional' ? E[0] : E),
                  _
                );
              }),
              (l.valueAtTime = u.getValueAtTime),
              (l.speedAtTime = u.getSpeedAtTime),
              (l.velocityAtTime = u.getVelocityAtTime),
              (l.propertyGroup = u.propertyGroup);
          }
          function i(l) {
            (!l || !('pv' in l)) && (l = e);
            var u = 1 / l.mult,
              d = l.pv * u,
              v = new Number(d);
            return (
              (v.value = d),
              r(v, l, 'unidimensional'),
              function () {
                return (
                  l.k && l.getValue(),
                  (d = l.v * u),
                  v.value !== d &&
                    ((v = new Number(d)),
                    (v.value = d),
                    r(v, l, 'unidimensional')),
                  v
                );
              }
            );
          }
          function s(l) {
            (!l || !('pv' in l)) && (l = t);
            var u = 1 / l.mult,
              d = (l.data && l.data.l) || l.pv.length,
              v = createTypedArray('float32', d),
              E = createTypedArray('float32', d);
            return (
              (v.value = E),
              r(v, l, 'multidimensional'),
              function () {
                l.k && l.getValue();
                for (var _ = 0; _ < d; _ += 1)
                  (E[_] = l.v[_] * u), (v[_] = E[_]);
                return v;
              }
            );
          }
          function n() {
            return e;
          }
          return function (l) {
            return l ? (l.propType === 'unidimensional' ? i(l) : s(l)) : n;
          };
        })(),
        TextExpressionSelectorPropFactory = (function () {
          function e(t, r) {
            return (
              (this.textIndex = t + 1),
              (this.textTotal = r),
              (this.v = this.getValue() * this.mult),
              this.v
            );
          }
          return function (t, r) {
            (this.pv = 1),
              (this.comp = t.comp),
              (this.elem = t),
              (this.mult = 0.01),
              (this.propType = 'textSelector'),
              (this.textTotal = r.totalChars),
              (this.selectorValue = 100),
              (this.lastValue = [1, 1, 1]),
              (this.k = !0),
              (this.x = !0),
              (this.getValue = ExpressionManager.initiateExpression.bind(this)(
                t,
                r,
                this
              )),
              (this.getMult = e),
              (this.getVelocityAtTime = expressionHelpers.getVelocityAtTime),
              this.kf
                ? (this.getValueAtTime =
                    expressionHelpers.getValueAtTime.bind(this))
                : (this.getValueAtTime =
                    expressionHelpers.getStaticValueAtTime.bind(this)),
              (this.setGroupProperty = expressionHelpers.setGroupProperty);
          };
        })(),
        propertyGetTextProp = TextSelectorProp.getTextSelectorProp;
      TextSelectorProp.getTextSelectorProp = function (e, t, r) {
        return t.t === 1
          ? new TextExpressionSelectorPropFactory(e, t, r)
          : propertyGetTextProp(e, t, r);
      };
      function SliderEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function AngleEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function ColorEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 1, 0, r);
      }
      function PointEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 1, 0, r);
      }
      function LayerIndexEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function MaskIndexEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function CheckboxEffect(e, t, r) {
        this.p = PropertyFactory.getProp(t, e.v, 0, 0, r);
      }
      function NoValueEffect() {
        this.p = {};
      }
      function EffectsManager(e, t) {
        var r = e.ef || [];
        this.effectElements = [];
        var i,
          s = r.length,
          n;
        for (i = 0; i < s; i += 1)
          (n = new GroupEffect(r[i], t)), this.effectElements.push(n);
      }
      function GroupEffect(e, t) {
        this.init(e, t);
      }
      extendPrototype([DynamicPropertyContainer], GroupEffect),
        (GroupEffect.prototype.getValue =
          GroupEffect.prototype.iterateDynamicProperties),
        (GroupEffect.prototype.init = function (e, t) {
          (this.data = e),
            (this.effectElements = []),
            this.initDynamicPropertyContainer(t);
          var r,
            i = this.data.ef.length,
            s,
            n = this.data.ef;
          for (r = 0; r < i; r += 1) {
            switch (((s = null), n[r].ty)) {
              case 0:
                s = new SliderEffect(n[r], t, this);
                break;
              case 1:
                s = new AngleEffect(n[r], t, this);
                break;
              case 2:
                s = new ColorEffect(n[r], t, this);
                break;
              case 3:
                s = new PointEffect(n[r], t, this);
                break;
              case 4:
              case 7:
                s = new CheckboxEffect(n[r], t, this);
                break;
              case 10:
                s = new LayerIndexEffect(n[r], t, this);
                break;
              case 11:
                s = new MaskIndexEffect(n[r], t, this);
                break;
              case 5:
                s = new EffectsManager(n[r], t, this);
                break;
              default:
                s = new NoValueEffect(n[r], t, this);
                break;
            }
            s && this.effectElements.push(s);
          }
        });
      var lottie = {};
      function setLocationHref(e) {
        locationHref = e;
      }
      function searchAnimations() {
        animationManager.searchAnimations();
      }
      function setSubframeRendering(e) {
        subframeEnabled = e;
      }
      function setIDPrefix(e) {
        idPrefix = e;
      }
      function loadAnimation(e) {
        return animationManager.loadAnimation(e);
      }
      function setQuality(e) {
        if (typeof e == 'string')
          switch (e) {
            case 'high':
              defaultCurveSegments = 200;
              break;
            default:
            case 'medium':
              defaultCurveSegments = 50;
              break;
            case 'low':
              defaultCurveSegments = 10;
              break;
          }
        else !isNaN(e) && e > 1 && (defaultCurveSegments = e);
      }
      function inBrowser() {
        return typeof navigator != 'undefined';
      }
      function installPlugin(e, t) {
        e === 'expressions' && (expressionsPlugin = t);
      }
      function getFactory(e) {
        switch (e) {
          case 'propertyFactory':
            return PropertyFactory;
          case 'shapePropertyFactory':
            return ShapePropertyFactory;
          case 'matrix':
            return Matrix;
          default:
            return null;
        }
      }
      (lottie.play = animationManager.play),
        (lottie.pause = animationManager.pause),
        (lottie.setLocationHref = setLocationHref),
        (lottie.togglePause = animationManager.togglePause),
        (lottie.setSpeed = animationManager.setSpeed),
        (lottie.setDirection = animationManager.setDirection),
        (lottie.stop = animationManager.stop),
        (lottie.searchAnimations = searchAnimations),
        (lottie.registerAnimation = animationManager.registerAnimation),
        (lottie.loadAnimation = loadAnimation),
        (lottie.setSubframeRendering = setSubframeRendering),
        (lottie.resize = animationManager.resize),
        (lottie.goToAndStop = animationManager.goToAndStop),
        (lottie.destroy = animationManager.destroy),
        (lottie.setQuality = setQuality),
        (lottie.inBrowser = inBrowser),
        (lottie.installPlugin = installPlugin),
        (lottie.freeze = animationManager.freeze),
        (lottie.unfreeze = animationManager.unfreeze),
        (lottie.setVolume = animationManager.setVolume),
        (lottie.mute = animationManager.mute),
        (lottie.unmute = animationManager.unmute),
        (lottie.getRegisteredAnimations =
          animationManager.getRegisteredAnimations),
        (lottie.setIDPrefix = setIDPrefix),
        (lottie.__getFactory = getFactory),
        (lottie.version = '5.7.14');
      function checkReady() {
        document.readyState === 'complete' &&
          (clearInterval(readyStateCheckInterval), searchAnimations());
      }
      function getQueryVariable(e) {
        for (var t = queryString.split('&'), r = 0; r < t.length; r += 1) {
          var i = t[r].split('=');
          if (decodeURIComponent(i[0]) == e) return decodeURIComponent(i[1]);
        }
        return null;
      }
      var queryString;
      {
        var scripts = document.getElementsByTagName('script'),
          index = scripts.length - 1,
          myScript = scripts[index] || { src: '' };
        (queryString = myScript.src.replace(/^[^\?]+\??/, '')),
          getQueryVariable('renderer');
      }
      var readyStateCheckInterval = setInterval(checkReady, 100);
      return lottie;
    });
})(lottie);
var index_svelte_svelte_type_style_lang = '';
const parseNumber = parseFloat;
function joinCss(e, t = ';') {
  let r;
  if (Array.isArray(e)) r = e.filter((i) => i);
  else {
    r = [];
    for (const i in e) e[i] && r.push(`${i}:${e[i]}`);
  }
  return r.join(t);
}
function getStyles(e, t, r, i) {
  let s, n;
  const l = '1em';
  let u,
    d,
    v,
    E = '-.125em';
  const _ = 'visible';
  return (
    i && ((v = 'center'), (n = '1.25em')),
    r && (s = r),
    t &&
      (t == 'lg'
        ? ((d = '1.33333em'), (u = '.75em'), (E = '-.225em'))
        : t == 'xs'
        ? (d = '.75em')
        : t == 'sm'
        ? (d = '.875em')
        : (d = t.replace('x', 'em'))),
    joinCss([
      joinCss({
        float: s,
        width: n,
        height: l,
        'line-height': u,
        'font-size': d,
        'text-align': v,
        'vertical-align': E,
        'transform-origin': 'center',
        overflow: _,
      }),
      e,
    ])
  );
}
function getTransform(e, t, r, i, s, n = 1, l = '', u = '') {
  let d = 1,
    v = 1;
  return (
    s &&
      (s == 'horizontal'
        ? (d = -1)
        : s == 'vertical'
        ? (v = -1)
        : (d = v = -1)),
    joinCss(
      [
        `translate(${parseNumber(t) * n}${l},${parseNumber(r) * n}${l})`,
        `scale(${d * parseNumber(e)},${v * parseNumber(e)})`,
        i && `rotate(${i}${u})`,
      ],
      ' '
    )
  );
}
var fa_svelte_svelte_type_style_lang = '';
function create_if_block(e) {
  let t, r, i, s, n, l, u;
  function d(_, m) {
    return typeof _[7][4] == 'string' ? create_if_block_1 : create_else_block;
  }
  let v = d(e),
    E = v(e);
  return {
    c() {
      (t = svg_element('svg')),
        (r = svg_element('g')),
        (i = svg_element('g')),
        E.c(),
        this.h();
    },
    l(_) {
      t = claim_svg_element(_, 'svg', {
        id: !0,
        class: !0,
        style: !0,
        viewBox: !0,
        'aria-hidden': !0,
        role: !0,
        xmlns: !0,
      });
      var m = children(t);
      r = claim_svg_element(m, 'g', { transform: !0, 'transform-origin': !0 });
      var y = children(r);
      i = claim_svg_element(y, 'g', { transform: !0 });
      var c = children(i);
      E.l(c), c.forEach(detach), y.forEach(detach), m.forEach(detach), this.h();
    },
    h() {
      attr(i, 'transform', e[10]),
        attr(r, 'transform', (s = `translate(${e[7][0] / 2} ${e[7][1] / 2})`)),
        attr(r, 'transform-origin', (n = `${e[7][0] / 4} 0`)),
        attr(t, 'id', e[0]),
        attr(t, 'class', (l = '' + (null_to_empty(e[8]) + ' svelte-1w3t65e'))),
        attr(t, 'style', e[9]),
        attr(t, 'viewBox', (u = `0 0 ${e[7][0]} ${e[7][1]}`)),
        attr(t, 'aria-hidden', 'true'),
        attr(t, 'role', 'img'),
        attr(t, 'xmlns', 'http://www.w3.org/2000/svg');
    },
    m(_, m) {
      insert_hydration(_, t, m),
        append_hydration(t, r),
        append_hydration(r, i),
        E.m(i, null);
    },
    p(_, m) {
      v === (v = d(_)) && E
        ? E.p(_, m)
        : (E.d(1), (E = v(_)), E && (E.c(), E.m(i, null))),
        m & 1024 && attr(i, 'transform', _[10]),
        m & 128 &&
          s !== (s = `translate(${_[7][0] / 2} ${_[7][1] / 2})`) &&
          attr(r, 'transform', s),
        m & 128 &&
          n !== (n = `${_[7][0] / 4} 0`) &&
          attr(r, 'transform-origin', n),
        m & 1 && attr(t, 'id', _[0]),
        m & 256 &&
          l !== (l = '' + (null_to_empty(_[8]) + ' svelte-1w3t65e')) &&
          attr(t, 'class', l),
        m & 512 && attr(t, 'style', _[9]),
        m & 128 &&
          u !== (u = `0 0 ${_[7][0]} ${_[7][1]}`) &&
          attr(t, 'viewBox', u);
    },
    d(_) {
      _ && detach(t), E.d();
    },
  };
}
function create_else_block(e) {
  let t, r, i, s, n, l, u, d, v, E;
  return {
    c() {
      (t = svg_element('path')), (l = svg_element('path')), this.h();
    },
    l(_) {
      (t = claim_svg_element(_, 'path', {
        d: !0,
        fill: !0,
        'fill-opacity': !0,
        transform: !0,
      })),
        children(t).forEach(detach),
        (l = claim_svg_element(_, 'path', {
          d: !0,
          fill: !0,
          'fill-opacity': !0,
          transform: !0,
        })),
        children(l).forEach(detach),
        this.h();
    },
    h() {
      attr(t, 'd', (r = e[7][4][0])),
        attr(t, 'fill', (i = e[3] || e[1] || 'currentColor')),
        attr(t, 'fill-opacity', (s = e[6] != !1 ? e[4] : e[5])),
        attr(
          t,
          'transform',
          (n = `translate(${e[7][0] / -2} ${e[7][1] / -2})`)
        ),
        attr(l, 'd', (u = e[7][4][1])),
        attr(l, 'fill', (d = e[2] || e[1] || 'currentColor')),
        attr(l, 'fill-opacity', (v = e[6] != !1 ? e[5] : e[4])),
        attr(
          l,
          'transform',
          (E = `translate(${e[7][0] / -2} ${e[7][1] / -2})`)
        );
    },
    m(_, m) {
      insert_hydration(_, t, m), insert_hydration(_, l, m);
    },
    p(_, m) {
      m & 128 && r !== (r = _[7][4][0]) && attr(t, 'd', r),
        m & 10 &&
          i !== (i = _[3] || _[1] || 'currentColor') &&
          attr(t, 'fill', i),
        m & 112 &&
          s !== (s = _[6] != !1 ? _[4] : _[5]) &&
          attr(t, 'fill-opacity', s),
        m & 128 &&
          n !== (n = `translate(${_[7][0] / -2} ${_[7][1] / -2})`) &&
          attr(t, 'transform', n),
        m & 128 && u !== (u = _[7][4][1]) && attr(l, 'd', u),
        m & 6 &&
          d !== (d = _[2] || _[1] || 'currentColor') &&
          attr(l, 'fill', d),
        m & 112 &&
          v !== (v = _[6] != !1 ? _[5] : _[4]) &&
          attr(l, 'fill-opacity', v),
        m & 128 &&
          E !== (E = `translate(${_[7][0] / -2} ${_[7][1] / -2})`) &&
          attr(l, 'transform', E);
    },
    d(_) {
      _ && detach(t), _ && detach(l);
    },
  };
}
function create_if_block_1(e) {
  let t, r, i, s;
  return {
    c() {
      (t = svg_element('path')), this.h();
    },
    l(n) {
      (t = claim_svg_element(n, 'path', { d: !0, fill: !0, transform: !0 })),
        children(t).forEach(detach),
        this.h();
    },
    h() {
      attr(t, 'd', (r = e[7][4])),
        attr(t, 'fill', (i = e[1] || e[2] || 'currentColor')),
        attr(
          t,
          'transform',
          (s = `translate(${e[7][0] / -2} ${e[7][1] / -2})`)
        );
    },
    m(n, l) {
      insert_hydration(n, t, l);
    },
    p(n, l) {
      l & 128 && r !== (r = n[7][4]) && attr(t, 'd', r),
        l & 6 &&
          i !== (i = n[1] || n[2] || 'currentColor') &&
          attr(t, 'fill', i),
        l & 128 &&
          s !== (s = `translate(${n[7][0] / -2} ${n[7][1] / -2})`) &&
          attr(t, 'transform', s);
    },
    d(n) {
      n && detach(t);
    },
  };
}
function create_fragment(e) {
  let t,
    r = e[7][4] && create_if_block(e);
  return {
    c() {
      r && r.c(), (t = empty());
    },
    l(i) {
      r && r.l(i), (t = empty());
    },
    m(i, s) {
      r && r.m(i, s), insert_hydration(i, t, s);
    },
    p(i, [s]) {
      i[7][4]
        ? r
          ? r.p(i, s)
          : ((r = create_if_block(i)), r.c(), r.m(t.parentNode, t))
        : r && (r.d(1), (r = null));
    },
    i: noop,
    o: noop,
    d(i) {
      r && r.d(i), i && detach(t);
    },
  };
}
function instance(e, t, r) {
  let { class: i = '' } = t,
    { id: s = '' } = t,
    { style: n = '' } = t,
    { icon: l } = t,
    { size: u = '' } = t,
    { color: d = '' } = t,
    { fw: v = !1 } = t,
    { pull: E = '' } = t,
    { scale: _ = 1 } = t,
    { translateX: m = 0 } = t,
    { translateY: y = 0 } = t,
    { rotate: c = '' } = t,
    { flip: g = !1 } = t,
    { spin: p = !1 } = t,
    { pulse: a = !1 } = t,
    { primaryColor: o = '' } = t,
    { secondaryColor: h = '' } = t,
    { primaryOpacity: f = 1 } = t,
    { secondaryOpacity: b = 0.4 } = t,
    { swapOpacity: P = !1 } = t,
    S,
    w,
    M,
    I;
  return (
    (e.$$set = (C) => {
      'class' in C && r(11, (i = C.class)),
        'id' in C && r(0, (s = C.id)),
        'style' in C && r(12, (n = C.style)),
        'icon' in C && r(13, (l = C.icon)),
        'size' in C && r(14, (u = C.size)),
        'color' in C && r(1, (d = C.color)),
        'fw' in C && r(15, (v = C.fw)),
        'pull' in C && r(16, (E = C.pull)),
        'scale' in C && r(17, (_ = C.scale)),
        'translateX' in C && r(18, (m = C.translateX)),
        'translateY' in C && r(19, (y = C.translateY)),
        'rotate' in C && r(20, (c = C.rotate)),
        'flip' in C && r(21, (g = C.flip)),
        'spin' in C && r(22, (p = C.spin)),
        'pulse' in C && r(23, (a = C.pulse)),
        'primaryColor' in C && r(2, (o = C.primaryColor)),
        'secondaryColor' in C && r(3, (h = C.secondaryColor)),
        'primaryOpacity' in C && r(4, (f = C.primaryOpacity)),
        'secondaryOpacity' in C && r(5, (b = C.secondaryOpacity)),
        'swapOpacity' in C && r(6, (P = C.swapOpacity));
    }),
    (e.$$.update = () => {
      e.$$.dirty & 8192 && r(7, (S = (l && l.icon) || [0, 0, '', [], ''])),
        e.$$.dirty & 12584960 &&
          r(8, (w = joinCss([i, 'fa', p && 'spin', a && 'pulse'], ' '))),
        e.$$.dirty & 118784 && r(9, (M = getStyles(n, u, E, v))),
        e.$$.dirty & 4063232 && r(10, (I = getTransform(_, m, y, c, g, 512)));
    }),
    [s, d, o, h, f, b, P, S, w, M, I, i, n, l, u, v, E, _, m, y, c, g, p, a]
  );
}
class Fa extends SvelteComponent {
  constructor(t) {
    super();
    init(this, t, instance, create_fragment, safe_not_equal, {
      class: 11,
      id: 0,
      style: 12,
      icon: 13,
      size: 14,
      color: 1,
      fw: 15,
      pull: 16,
      scale: 17,
      translateX: 18,
      translateY: 19,
      rotate: 20,
      flip: 21,
      spin: 22,
      pulse: 23,
      primaryColor: 2,
      secondaryColor: 3,
      primaryOpacity: 4,
      secondaryOpacity: 5,
      swapOpacity: 6,
    });
  }
}
var Fa$1 = Fa;
/*!
 * Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */ var faBars = {
    prefix: 'fas',
    iconName: 'bars',
    icon: [
      448,
      512,
      [],
      'f0c9',
      'M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z',
    ],
  },
  faHome = {
    prefix: 'fas',
    iconName: 'home',
    icon: [
      576,
      512,
      [],
      'f015',
      'M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z',
    ],
  },
  slugify$1 = { exports: {} };
(function (e, t) {
  (function (r, i, s) {
    (e.exports = s()), (e.exports.default = s());
  })('slugify', commonjsGlobal, function () {
    var r = JSON.parse(
        `{"$":"dollar","%":"percent","&":"and","<":"less",">":"greater","|":"or","\xA2":"cent","\xA3":"pound","\xA4":"currency","\xA5":"yen","\xA9":"(c)","\xAA":"a","\xAE":"(r)","\xBA":"o","\xC0":"A","\xC1":"A","\xC2":"A","\xC3":"A","\xC4":"A","\xC5":"A","\xC6":"AE","\xC7":"C","\xC8":"E","\xC9":"E","\xCA":"E","\xCB":"E","\xCC":"I","\xCD":"I","\xCE":"I","\xCF":"I","\xD0":"D","\xD1":"N","\xD2":"O","\xD3":"O","\xD4":"O","\xD5":"O","\xD6":"O","\xD8":"O","\xD9":"U","\xDA":"U","\xDB":"U","\xDC":"U","\xDD":"Y","\xDE":"TH","\xDF":"ss","\xE0":"a","\xE1":"a","\xE2":"a","\xE3":"a","\xE4":"a","\xE5":"a","\xE6":"ae","\xE7":"c","\xE8":"e","\xE9":"e","\xEA":"e","\xEB":"e","\xEC":"i","\xED":"i","\xEE":"i","\xEF":"i","\xF0":"d","\xF1":"n","\xF2":"o","\xF3":"o","\xF4":"o","\xF5":"o","\xF6":"o","\xF8":"o","\xF9":"u","\xFA":"u","\xFB":"u","\xFC":"u","\xFD":"y","\xFE":"th","\xFF":"y","\u0100":"A","\u0101":"a","\u0102":"A","\u0103":"a","\u0104":"A","\u0105":"a","\u0106":"C","\u0107":"c","\u010C":"C","\u010D":"c","\u010E":"D","\u010F":"d","\u0110":"DJ","\u0111":"dj","\u0112":"E","\u0113":"e","\u0116":"E","\u0117":"e","\u0118":"e","\u0119":"e","\u011A":"E","\u011B":"e","\u011E":"G","\u011F":"g","\u0122":"G","\u0123":"g","\u0128":"I","\u0129":"i","\u012A":"i","\u012B":"i","\u012E":"I","\u012F":"i","\u0130":"I","\u0131":"i","\u0136":"k","\u0137":"k","\u013B":"L","\u013C":"l","\u013D":"L","\u013E":"l","\u0141":"L","\u0142":"l","\u0143":"N","\u0144":"n","\u0145":"N","\u0146":"n","\u0147":"N","\u0148":"n","\u014C":"O","\u014D":"o","\u0150":"O","\u0151":"o","\u0152":"OE","\u0153":"oe","\u0154":"R","\u0155":"r","\u0158":"R","\u0159":"r","\u015A":"S","\u015B":"s","\u015E":"S","\u015F":"s","\u0160":"S","\u0161":"s","\u0162":"T","\u0163":"t","\u0164":"T","\u0165":"t","\u0168":"U","\u0169":"u","\u016A":"u","\u016B":"u","\u016E":"U","\u016F":"u","\u0170":"U","\u0171":"u","\u0172":"U","\u0173":"u","\u0174":"W","\u0175":"w","\u0176":"Y","\u0177":"y","\u0178":"Y","\u0179":"Z","\u017A":"z","\u017B":"Z","\u017C":"z","\u017D":"Z","\u017E":"z","\u018F":"E","\u0192":"f","\u01A0":"O","\u01A1":"o","\u01AF":"U","\u01B0":"u","\u01C8":"LJ","\u01C9":"lj","\u01CB":"NJ","\u01CC":"nj","\u0218":"S","\u0219":"s","\u021A":"T","\u021B":"t","\u0259":"e","\u02DA":"o","\u0386":"A","\u0388":"E","\u0389":"H","\u038A":"I","\u038C":"O","\u038E":"Y","\u038F":"W","\u0390":"i","\u0391":"A","\u0392":"B","\u0393":"G","\u0394":"D","\u0395":"E","\u0396":"Z","\u0397":"H","\u0398":"8","\u0399":"I","\u039A":"K","\u039B":"L","\u039C":"M","\u039D":"N","\u039E":"3","\u039F":"O","\u03A0":"P","\u03A1":"R","\u03A3":"S","\u03A4":"T","\u03A5":"Y","\u03A6":"F","\u03A7":"X","\u03A8":"PS","\u03A9":"W","\u03AA":"I","\u03AB":"Y","\u03AC":"a","\u03AD":"e","\u03AE":"h","\u03AF":"i","\u03B0":"y","\u03B1":"a","\u03B2":"b","\u03B3":"g","\u03B4":"d","\u03B5":"e","\u03B6":"z","\u03B7":"h","\u03B8":"8","\u03B9":"i","\u03BA":"k","\u03BB":"l","\u03BC":"m","\u03BD":"n","\u03BE":"3","\u03BF":"o","\u03C0":"p","\u03C1":"r","\u03C2":"s","\u03C3":"s","\u03C4":"t","\u03C5":"y","\u03C6":"f","\u03C7":"x","\u03C8":"ps","\u03C9":"w","\u03CA":"i","\u03CB":"y","\u03CC":"o","\u03CD":"y","\u03CE":"w","\u0401":"Yo","\u0402":"DJ","\u0404":"Ye","\u0406":"I","\u0407":"Yi","\u0408":"J","\u0409":"LJ","\u040A":"NJ","\u040B":"C","\u040F":"DZ","\u0410":"A","\u0411":"B","\u0412":"V","\u0413":"G","\u0414":"D","\u0415":"E","\u0416":"Zh","\u0417":"Z","\u0418":"I","\u0419":"J","\u041A":"K","\u041B":"L","\u041C":"M","\u041D":"N","\u041E":"O","\u041F":"P","\u0420":"R","\u0421":"S","\u0422":"T","\u0423":"U","\u0424":"F","\u0425":"H","\u0426":"C","\u0427":"Ch","\u0428":"Sh","\u0429":"Sh","\u042A":"U","\u042B":"Y","\u042C":"","\u042D":"E","\u042E":"Yu","\u042F":"Ya","\u0430":"a","\u0431":"b","\u0432":"v","\u0433":"g","\u0434":"d","\u0435":"e","\u0436":"zh","\u0437":"z","\u0438":"i","\u0439":"j","\u043A":"k","\u043B":"l","\u043C":"m","\u043D":"n","\u043E":"o","\u043F":"p","\u0440":"r","\u0441":"s","\u0442":"t","\u0443":"u","\u0444":"f","\u0445":"h","\u0446":"c","\u0447":"ch","\u0448":"sh","\u0449":"sh","\u044A":"u","\u044B":"y","\u044C":"","\u044D":"e","\u044E":"yu","\u044F":"ya","\u0451":"yo","\u0452":"dj","\u0454":"ye","\u0456":"i","\u0457":"yi","\u0458":"j","\u0459":"lj","\u045A":"nj","\u045B":"c","\u045D":"u","\u045F":"dz","\u0490":"G","\u0491":"g","\u0492":"GH","\u0493":"gh","\u049A":"KH","\u049B":"kh","\u04A2":"NG","\u04A3":"ng","\u04AE":"UE","\u04AF":"ue","\u04B0":"U","\u04B1":"u","\u04BA":"H","\u04BB":"h","\u04D8":"AE","\u04D9":"ae","\u04E8":"OE","\u04E9":"oe","\u0531":"A","\u0532":"B","\u0533":"G","\u0534":"D","\u0535":"E","\u0536":"Z","\u0537":"E'","\u0538":"Y'","\u0539":"T'","\u053A":"JH","\u053B":"I","\u053C":"L","\u053D":"X","\u053E":"C'","\u053F":"K","\u0540":"H","\u0541":"D'","\u0542":"GH","\u0543":"TW","\u0544":"M","\u0545":"Y","\u0546":"N","\u0547":"SH","\u0549":"CH","\u054A":"P","\u054B":"J","\u054C":"R'","\u054D":"S","\u054E":"V","\u054F":"T","\u0550":"R","\u0551":"C","\u0553":"P'","\u0554":"Q'","\u0555":"O''","\u0556":"F","\u0587":"EV","\u0621":"a","\u0622":"aa","\u0623":"a","\u0624":"u","\u0625":"i","\u0626":"e","\u0627":"a","\u0628":"b","\u0629":"h","\u062A":"t","\u062B":"th","\u062C":"j","\u062D":"h","\u062E":"kh","\u062F":"d","\u0630":"th","\u0631":"r","\u0632":"z","\u0633":"s","\u0634":"sh","\u0635":"s","\u0636":"dh","\u0637":"t","\u0638":"z","\u0639":"a","\u063A":"gh","\u0641":"f","\u0642":"q","\u0643":"k","\u0644":"l","\u0645":"m","\u0646":"n","\u0647":"h","\u0648":"w","\u0649":"a","\u064A":"y","\u064B":"an","\u064C":"on","\u064D":"en","\u064E":"a","\u064F":"u","\u0650":"e","\u0652":"","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u067E":"p","\u0686":"ch","\u0698":"zh","\u06A9":"k","\u06AF":"g","\u06CC":"y","\u06F0":"0","\u06F1":"1","\u06F2":"2","\u06F3":"3","\u06F4":"4","\u06F5":"5","\u06F6":"6","\u06F7":"7","\u06F8":"8","\u06F9":"9","\u0E3F":"baht","\u10D0":"a","\u10D1":"b","\u10D2":"g","\u10D3":"d","\u10D4":"e","\u10D5":"v","\u10D6":"z","\u10D7":"t","\u10D8":"i","\u10D9":"k","\u10DA":"l","\u10DB":"m","\u10DC":"n","\u10DD":"o","\u10DE":"p","\u10DF":"zh","\u10E0":"r","\u10E1":"s","\u10E2":"t","\u10E3":"u","\u10E4":"f","\u10E5":"k","\u10E6":"gh","\u10E7":"q","\u10E8":"sh","\u10E9":"ch","\u10EA":"ts","\u10EB":"dz","\u10EC":"ts","\u10ED":"ch","\u10EE":"kh","\u10EF":"j","\u10F0":"h","\u1E80":"W","\u1E81":"w","\u1E82":"W","\u1E83":"w","\u1E84":"W","\u1E85":"w","\u1E9E":"SS","\u1EA0":"A","\u1EA1":"a","\u1EA2":"A","\u1EA3":"a","\u1EA4":"A","\u1EA5":"a","\u1EA6":"A","\u1EA7":"a","\u1EA8":"A","\u1EA9":"a","\u1EAA":"A","\u1EAB":"a","\u1EAC":"A","\u1EAD":"a","\u1EAE":"A","\u1EAF":"a","\u1EB0":"A","\u1EB1":"a","\u1EB2":"A","\u1EB3":"a","\u1EB4":"A","\u1EB5":"a","\u1EB6":"A","\u1EB7":"a","\u1EB8":"E","\u1EB9":"e","\u1EBA":"E","\u1EBB":"e","\u1EBC":"E","\u1EBD":"e","\u1EBE":"E","\u1EBF":"e","\u1EC0":"E","\u1EC1":"e","\u1EC2":"E","\u1EC3":"e","\u1EC4":"E","\u1EC5":"e","\u1EC6":"E","\u1EC7":"e","\u1EC8":"I","\u1EC9":"i","\u1ECA":"I","\u1ECB":"i","\u1ECC":"O","\u1ECD":"o","\u1ECE":"O","\u1ECF":"o","\u1ED0":"O","\u1ED1":"o","\u1ED2":"O","\u1ED3":"o","\u1ED4":"O","\u1ED5":"o","\u1ED6":"O","\u1ED7":"o","\u1ED8":"O","\u1ED9":"o","\u1EDA":"O","\u1EDB":"o","\u1EDC":"O","\u1EDD":"o","\u1EDE":"O","\u1EDF":"o","\u1EE0":"O","\u1EE1":"o","\u1EE2":"O","\u1EE3":"o","\u1EE4":"U","\u1EE5":"u","\u1EE6":"U","\u1EE7":"u","\u1EE8":"U","\u1EE9":"u","\u1EEA":"U","\u1EEB":"u","\u1EEC":"U","\u1EED":"u","\u1EEE":"U","\u1EEF":"u","\u1EF0":"U","\u1EF1":"u","\u1EF2":"Y","\u1EF3":"y","\u1EF4":"Y","\u1EF5":"y","\u1EF6":"Y","\u1EF7":"y","\u1EF8":"Y","\u1EF9":"y","\u2013":"-","\u2018":"'","\u2019":"'","\u201C":"\\"","\u201D":"\\"","\u201E":"\\"","\u2020":"+","\u2022":"*","\u2026":"...","\u20A0":"ecu","\u20A2":"cruzeiro","\u20A3":"french franc","\u20A4":"lira","\u20A5":"mill","\u20A6":"naira","\u20A7":"peseta","\u20A8":"rupee","\u20A9":"won","\u20AA":"new shequel","\u20AB":"dong","\u20AC":"euro","\u20AD":"kip","\u20AE":"tugrik","\u20AF":"drachma","\u20B0":"penny","\u20B1":"peso","\u20B2":"guarani","\u20B3":"austral","\u20B4":"hryvnia","\u20B5":"cedi","\u20B8":"kazakhstani tenge","\u20B9":"indian rupee","\u20BA":"turkish lira","\u20BD":"russian ruble","\u20BF":"bitcoin","\u2120":"sm","\u2122":"tm","\u2202":"d","\u2206":"delta","\u2211":"sum","\u221E":"infinity","\u2665":"love","\u5143":"yuan","\u5186":"yen","\uFDFC":"rial","\uFEF5":"laa","\uFEF7":"laa","\uFEF9":"lai","\uFEFB":"la"}`
      ),
      i = JSON.parse(
        '{"bg":{"\u0419":"Y","\u0426":"Ts","\u0429":"Sht","\u042A":"A","\u042C":"Y","\u0439":"y","\u0446":"ts","\u0449":"sht","\u044A":"a","\u044C":"y"},"de":{"\xC4":"AE","\xE4":"ae","\xD6":"OE","\xF6":"oe","\xDC":"UE","\xFC":"ue","%":"prozent","&":"und","|":"oder","\u2211":"summe","\u221E":"unendlich","\u2665":"liebe"},"es":{"%":"por ciento","&":"y","<":"menor que",">":"mayor que","|":"o","\xA2":"centavos","\xA3":"libras","\xA4":"moneda","\u20A3":"francos","\u2211":"suma","\u221E":"infinito","\u2665":"amor"},"fr":{"%":"pourcent","&":"et","<":"plus petit",">":"plus grand","|":"ou","\xA2":"centime","\xA3":"livre","\xA4":"devise","\u20A3":"franc","\u2211":"somme","\u221E":"infini","\u2665":"amour"},"pt":{"%":"porcento","&":"e","<":"menor",">":"maior","|":"ou","\xA2":"centavo","\u2211":"soma","\xA3":"libra","\u221E":"infinito","\u2665":"amor"},"uk":{"\u0418":"Y","\u0438":"y","\u0419":"Y","\u0439":"y","\u0426":"Ts","\u0446":"ts","\u0425":"Kh","\u0445":"kh","\u0429":"Shch","\u0449":"shch","\u0413":"H","\u0433":"h"},"vi":{"\u0110":"D","\u0111":"d"},"da":{"\xD8":"OE","\xF8":"oe","\xC5":"AA","\xE5":"aa","%":"procent","&":"og","|":"eller","$":"dollar","<":"mindre end",">":"st\xF8rre end"}}'
      );
    function s(n, l) {
      if (typeof n != 'string')
        throw new Error('slugify: string argument expected');
      l = typeof l == 'string' ? { replacement: l } : l || {};
      var u = i[l.locale] || {},
        d = l.replacement === void 0 ? '-' : l.replacement,
        v = l.trim === void 0 ? !0 : l.trim,
        E = n
          .normalize()
          .split('')
          .reduce(function (_, m) {
            return (
              _ +
              (u[m] || r[m] || (m === d ? ' ' : m)).replace(
                l.remove || /[^\w\s$*_+~.()'"!\-:@]+/g,
                ''
              )
            );
          }, '');
      return (
        l.strict && (E = E.replace(/[^A-Za-z0-9\s]/g, '')),
        v && (E = E.trim()),
        (E = E.replace(/\s+/g, d)),
        l.lower && (E = E.toLowerCase()),
        E
      );
    }
    return (
      (s.extend = function (n) {
        Object.assign(r, n);
      }),
      s
    );
  });
})(slugify$1);
var slugify = slugify$1.exports;
export {
  onMount as A,
  assign as B,
  set_paths as C,
  writable as D,
  groupBy$1 as E,
  Fa$1 as F,
  faBars as G,
  faHome as H,
  append_hydration as I,
  base as J,
  toggle_class as K,
  destroy_each as L,
  create_slot as M,
  listen as N,
  update_slot_base as O,
  get_all_dirty_from_scope as P,
  get_slot_changes as Q,
  component_subscribe as R,
  SvelteComponent as S,
  page as T,
  Nav as U,
  noop as V,
  SEO as W,
  slugify as X,
  children as a,
  attr as b,
  claim_element as c,
  detach as d,
  element as e,
  insert_hydration as f,
  claim_text as g,
  set_data as h,
  init as i,
  create_component as j,
  space as k,
  empty as l,
  claim_component as m,
  claim_space as n,
  mount_component as o,
  get_spread_update as p,
  get_spread_object as q,
  group_outros as r,
  safe_not_equal as s,
  text as t,
  transition_out as u,
  destroy_component as v,
  check_outros as w,
  transition_in as x,
  setContext as y,
  afterUpdate as z,
};
