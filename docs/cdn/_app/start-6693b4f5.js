var ot = Object.defineProperty,
  lt = Object.defineProperties;
var ct = Object.getOwnPropertyDescriptors;
var V = Object.getOwnPropertySymbols;
var X = Object.prototype.hasOwnProperty,
  F = Object.prototype.propertyIsEnumerable;
var Q = (i, t, e) =>
    t in i
      ? ot(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (i[t] = e),
  R = (i, t) => {
    for (var e in t || (t = {})) X.call(t, e) && Q(i, e, t[e]);
    if (V) for (var e of V(t)) F.call(t, e) && Q(i, e, t[e]);
    return i;
  },
  Z = (i, t) => lt(i, ct(t));
var x = (i, t) => {
  var e = {};
  for (var s in i) X.call(i, s) && t.indexOf(s) < 0 && (e[s] = i[s]);
  if (i != null && V)
    for (var s of V(i)) t.indexOf(s) < 0 && F.call(i, s) && (e[s] = i[s]);
  return e;
};
var p = (i, t, e) =>
  new Promise((s, r) => {
    var o = (l) => {
        try {
          n(e.next(l));
        } catch (c) {
          r(c);
        }
      },
      a = (l) => {
        try {
          n(e.throw(l));
        } catch (c) {
          r(c);
        }
      },
      n = (l) => (l.done ? s(l.value) : Promise.resolve(l.value).then(o, a));
    n((e = e.apply(i, t)).next());
  });
import {
  S as ut,
  i as ft,
  s as ht,
  e as dt,
  c as _t,
  a as pt,
  d as k,
  b as D,
  f as $,
  t as gt,
  g as mt,
  h as wt,
  j as U,
  k as bt,
  l as y,
  m as z,
  n as yt,
  o as A,
  p as J,
  q as M,
  r as N,
  u as v,
  v as T,
  w as O,
  x as w,
  y as vt,
  z as Et,
  A as kt,
  B as G,
  C as Rt,
  D as W,
} from './chunks/vendor-0f5fab7e.js';
import { _ as B } from './chunks/preload-helper-101fda89.js';
function tt(i) {
  let t, e, s;
  const r = [i[2] || {}];
  var o = i[0][1];
  function a(n) {
    let l = { $$slots: { default: [$t] }, $$scope: { ctx: n } };
    for (let c = 0; c < r.length; c += 1) l = G(l, r[c]);
    return { props: l };
  }
  return (
    o && (t = new o(a(i))),
    {
      c() {
        t && U(t.$$.fragment), (e = y());
      },
      l(n) {
        t && z(t.$$.fragment, n), (e = y());
      },
      m(n, l) {
        t && A(t, n, l), $(n, e, l), (s = !0);
      },
      p(n, l) {
        const c = l & 4 ? J(r, [M(n[2] || {})]) : {};
        if (
          (l & 521 && (c.$$scope = { dirty: l, ctx: n }), o !== (o = n[0][1]))
        ) {
          if (t) {
            N();
            const u = t;
            v(u.$$.fragment, 1, 0, () => {
              T(u, 1);
            }),
              O();
          }
          o
            ? ((t = new o(a(n))),
              U(t.$$.fragment),
              w(t.$$.fragment, 1),
              A(t, e.parentNode, e))
            : (t = null);
        } else o && t.$set(c);
      },
      i(n) {
        s || (t && w(t.$$.fragment, n), (s = !0));
      },
      o(n) {
        t && v(t.$$.fragment, n), (s = !1);
      },
      d(n) {
        n && k(e), t && T(t, n);
      },
    }
  );
}
function et(i) {
  let t, e, s;
  const r = [i[3] || {}];
  var o = i[0][2];
  function a(n) {
    let l = {};
    for (let c = 0; c < r.length; c += 1) l = G(l, r[c]);
    return { props: l };
  }
  return (
    o && (t = new o(a())),
    {
      c() {
        t && U(t.$$.fragment), (e = y());
      },
      l(n) {
        t && z(t.$$.fragment, n), (e = y());
      },
      m(n, l) {
        t && A(t, n, l), $(n, e, l), (s = !0);
      },
      p(n, l) {
        const c = l & 8 ? J(r, [M(n[3] || {})]) : {};
        if (o !== (o = n[0][2])) {
          if (t) {
            N();
            const u = t;
            v(u.$$.fragment, 1, 0, () => {
              T(u, 1);
            }),
              O();
          }
          o
            ? ((t = new o(a())),
              U(t.$$.fragment),
              w(t.$$.fragment, 1),
              A(t, e.parentNode, e))
            : (t = null);
        } else o && t.$set(c);
      },
      i(n) {
        s || (t && w(t.$$.fragment, n), (s = !0));
      },
      o(n) {
        t && v(t.$$.fragment, n), (s = !1);
      },
      d(n) {
        n && k(e), t && T(t, n);
      },
    }
  );
}
function $t(i) {
  let t,
    e,
    s = i[0][2] && et(i);
  return {
    c() {
      s && s.c(), (t = y());
    },
    l(r) {
      s && s.l(r), (t = y());
    },
    m(r, o) {
      s && s.m(r, o), $(r, t, o), (e = !0);
    },
    p(r, o) {
      r[0][2]
        ? s
          ? (s.p(r, o), o & 1 && w(s, 1))
          : ((s = et(r)), s.c(), w(s, 1), s.m(t.parentNode, t))
        : s &&
          (N(),
          v(s, 1, 1, () => {
            s = null;
          }),
          O());
    },
    i(r) {
      e || (w(s), (e = !0));
    },
    o(r) {
      v(s), (e = !1);
    },
    d(r) {
      s && s.d(r), r && k(t);
    },
  };
}
function St(i) {
  let t,
    e,
    s = i[0][1] && tt(i);
  return {
    c() {
      s && s.c(), (t = y());
    },
    l(r) {
      s && s.l(r), (t = y());
    },
    m(r, o) {
      s && s.m(r, o), $(r, t, o), (e = !0);
    },
    p(r, o) {
      r[0][1]
        ? s
          ? (s.p(r, o), o & 1 && w(s, 1))
          : ((s = tt(r)), s.c(), w(s, 1), s.m(t.parentNode, t))
        : s &&
          (N(),
          v(s, 1, 1, () => {
            s = null;
          }),
          O());
    },
    i(r) {
      e || (w(s), (e = !0));
    },
    o(r) {
      v(s), (e = !1);
    },
    d(r) {
      s && s.d(r), r && k(t);
    },
  };
}
function st(i) {
  let t,
    e = i[5] && rt(i);
  return {
    c() {
      (t = dt('div')), e && e.c(), this.h();
    },
    l(s) {
      t = _t(s, 'DIV', {
        id: !0,
        'aria-live': !0,
        'aria-atomic': !0,
        class: !0,
      });
      var r = pt(t);
      e && e.l(r), r.forEach(k), this.h();
    },
    h() {
      D(t, 'id', 'svelte-announcer'),
        D(t, 'aria-live', 'assertive'),
        D(t, 'aria-atomic', 'true'),
        D(t, 'class', 'svelte-9z6sc');
    },
    m(s, r) {
      $(s, t, r), e && e.m(t, null);
    },
    p(s, r) {
      s[5]
        ? e
          ? e.p(s, r)
          : ((e = rt(s)), e.c(), e.m(t, null))
        : e && (e.d(1), (e = null));
    },
    d(s) {
      s && k(t), e && e.d();
    },
  };
}
function rt(i) {
  let t;
  return {
    c() {
      t = gt(i[6]);
    },
    l(e) {
      t = mt(e, i[6]);
    },
    m(e, s) {
      $(e, t, s);
    },
    p(e, s) {
      s & 64 && wt(t, e[6]);
    },
    d(e) {
      e && k(t);
    },
  };
}
function qt(i) {
  let t, e, s, r;
  const o = [i[1] || {}];
  var a = i[0][0];
  function n(c) {
    let u = { $$slots: { default: [St] }, $$scope: { ctx: c } };
    for (let h = 0; h < o.length; h += 1) u = G(u, o[h]);
    return { props: u };
  }
  a && (t = new a(n(i)));
  let l = i[4] && st(i);
  return {
    c() {
      t && U(t.$$.fragment), (e = bt()), l && l.c(), (s = y());
    },
    l(c) {
      t && z(t.$$.fragment, c), (e = yt(c)), l && l.l(c), (s = y());
    },
    m(c, u) {
      t && A(t, c, u), $(c, e, u), l && l.m(c, u), $(c, s, u), (r = !0);
    },
    p(c, [u]) {
      const h = u & 2 ? J(o, [M(c[1] || {})]) : {};
      if (
        (u & 525 && (h.$$scope = { dirty: u, ctx: c }), a !== (a = c[0][0]))
      ) {
        if (t) {
          N();
          const f = t;
          v(f.$$.fragment, 1, 0, () => {
            T(f, 1);
          }),
            O();
        }
        a
          ? ((t = new a(n(c))),
            U(t.$$.fragment),
            w(t.$$.fragment, 1),
            A(t, e.parentNode, e))
          : (t = null);
      } else a && t.$set(h);
      c[4]
        ? l
          ? l.p(c, u)
          : ((l = st(c)), l.c(), l.m(s.parentNode, s))
        : l && (l.d(1), (l = null));
    },
    i(c) {
      r || (t && w(t.$$.fragment, c), (r = !0));
    },
    o(c) {
      t && v(t.$$.fragment, c), (r = !1);
    },
    d(c) {
      t && T(t, c), c && k(e), l && l.d(c), c && k(s);
    },
  };
}
function Lt(i, t, e) {
  let { stores: s } = t,
    { page: r } = t,
    { components: o } = t,
    { props_0: a = null } = t,
    { props_1: n = null } = t,
    { props_2: l = null } = t;
  vt('__svelte__', s), Et(s.page.notify);
  let c = !1,
    u = !1,
    h = null;
  return (
    kt(() => {
      const f = s.page.subscribe(() => {
        c && (e(5, (u = !0)), e(6, (h = document.title || 'untitled page')));
      });
      return e(4, (c = !0)), f;
    }),
    (i.$$set = (f) => {
      'stores' in f && e(7, (s = f.stores)),
        'page' in f && e(8, (r = f.page)),
        'components' in f && e(0, (o = f.components)),
        'props_0' in f && e(1, (a = f.props_0)),
        'props_1' in f && e(2, (n = f.props_1)),
        'props_2' in f && e(3, (l = f.props_2));
    }),
    (i.$$.update = () => {
      i.$$.dirty & 384 && s.page.set(r);
    }),
    [o, a, n, l, c, u, h, s, r]
  );
}
class Ut extends ut {
  constructor(t) {
    super();
    ft(this, t, Lt, qt, ht, {
      stores: 7,
      page: 8,
      components: 0,
      props_0: 1,
      props_1: 2,
      props_2: 3,
    });
  }
}
const S = [
    () =>
      B(
        () => import('./pages/__layout.svelte-ecdfca61.js'),
        [
          'pages/__layout.svelte-ecdfca61.js',
          'assets/pages/__layout.svelte-1c447b0e.css',
          'chunks/vendor-0f5fab7e.js',
          'assets/vendor-4ab6d437.css',
        ]
      ),
    () =>
      B(
        () => import('./error.svelte-429a6dff.js'),
        [
          'error.svelte-429a6dff.js',
          'chunks/vendor-0f5fab7e.js',
          'assets/vendor-4ab6d437.css',
        ]
      ),
    () =>
      B(
        () => import('./pages/index.svelte-ec944967.js'),
        [
          'pages/index.svelte-ec944967.js',
          'chunks/vendor-0f5fab7e.js',
          'assets/vendor-4ab6d437.css',
          'chunks/home-825f5e2c.js',
        ]
      ),
    () =>
      B(
        () => import('./pages/[...slug].svelte-91d7e614.js'),
        [
          'pages/[...slug].svelte-91d7e614.js',
          'chunks/preload-helper-101fda89.js',
          'chunks/vendor-0f5fab7e.js',
          'assets/vendor-4ab6d437.css',
        ]
      ),
  ],
  At = decodeURIComponent,
  Tt = [
    [/^\/$/, [S[0], S[2]], [S[1]]],
    ,
    [
      /^(?:\/(.*))?\/?$/,
      [S[0], S[3]],
      [S[1]],
      (i) => ({ slug: At(i[1] || '') }),
    ],
  ],
  jt = [S[0](), S[1]()];
function It(i) {
  let t = i.baseURI;
  if (!t) {
    const e = i.getElementsByTagName('base');
    t = e.length ? e[0].href : i.URL;
  }
  return t;
}
function Y() {
  return { x: pageXOffset, y: pageYOffset };
}
function it(i) {
  for (; i && i.nodeName.toUpperCase() !== 'A'; ) i = i.parentNode;
  return i;
}
function nt(i) {
  return i instanceof SVGAElement
    ? new URL(i.href.baseVal, document.baseURI)
    : new URL(i.href);
}
class Nt {
  constructor({ base: t, routes: e, trailing_slash: s, renderer: r }) {
    (this.base = t),
      (this.routes = e),
      (this.trailing_slash = s),
      (this.navigating = 0),
      (this.renderer = r),
      (r.router = this),
      (this.enabled = !0),
      document.body.setAttribute('tabindex', '-1'),
      history.replaceState(history.state || {}, '', location.href);
  }
  init_listeners() {
    'scrollRestoration' in history && (history.scrollRestoration = 'manual'),
      addEventListener('beforeunload', () => {
        history.scrollRestoration = 'auto';
      }),
      addEventListener('load', () => {
        history.scrollRestoration = 'manual';
      });
    let t;
    addEventListener('scroll', () => {
      clearTimeout(t),
        (t = setTimeout(() => {
          const o = Z(R({}, history.state || {}), { 'sveltekit:scroll': Y() });
          history.replaceState(o, document.title, window.location.href);
        }, 50));
    });
    const e = (o) => {
      const a = it(o.target);
      a &&
        a.href &&
        a.hasAttribute('sveltekit:prefetch') &&
        this.prefetch(nt(a));
    };
    let s;
    const r = (o) => {
      clearTimeout(s),
        (s = setTimeout(() => {
          e(o);
        }, 20));
    };
    addEventListener('touchstart', e),
      addEventListener('mousemove', r),
      addEventListener('click', (o) => {
        if (
          !this.enabled ||
          o.button ||
          o.which !== 1 ||
          o.metaKey ||
          o.ctrlKey ||
          o.shiftKey ||
          o.altKey ||
          o.defaultPrevented
        )
          return;
        const a = it(o.target);
        if (!a || !a.href) return;
        const n = nt(a),
          l = n.toString();
        if (l === location.href) {
          location.hash || o.preventDefault();
          return;
        }
        const c = (a.getAttribute('rel') || '').split(/\s+/);
        if (
          a.hasAttribute('download') ||
          (c && c.includes('external')) ||
          (a instanceof SVGAElement ? a.target.baseVal : a.target) ||
          !this.owns(n)
        )
          return;
        const u = a.hasAttribute('sveltekit:noscroll'),
          h = l.indexOf('#'),
          f = location.href.indexOf('#'),
          g = h >= 0 ? l.substring(0, h) : l,
          E = f >= 0 ? location.href.substring(0, f) : location.href;
        history.pushState({}, '', n.href),
          g === E && window.dispatchEvent(new HashChangeEvent('hashchange')),
          this._navigate(n, u ? Y() : null, !1, [], n.hash),
          o.preventDefault();
      }),
      addEventListener('popstate', (o) => {
        if (o.state && this.enabled) {
          const a = new URL(location.href);
          this._navigate(a, o.state['sveltekit:scroll'], !1, []);
        }
      });
  }
  owns(t) {
    return t.origin === location.origin && t.pathname.startsWith(this.base);
  }
  parse(t) {
    if (this.owns(t)) {
      const e = t.pathname.slice(this.base.length) || '/',
        s = decodeURI(e),
        r = this.routes.filter(([n]) => n.test(s)),
        o = new URLSearchParams(t.search);
      return { id: `${e}?${o}`, routes: r, path: e, decoded_path: s, query: o };
    }
  }
  goto(n) {
    return p(
      this,
      arguments,
      function* (
        t,
        {
          noscroll: e = !1,
          replaceState: s = !1,
          keepfocus: r = !1,
          state: o = {},
        } = {},
        a
      ) {
        const l = new URL(t, It(document));
        return this.enabled && this.owns(l)
          ? (history[s ? 'replaceState' : 'pushState'](o, '', t),
            this._navigate(l, e ? Y() : null, r, a, l.hash))
          : ((location.href = l.href), new Promise(() => {}));
      }
    );
  }
  enable() {
    this.enabled = !0;
  }
  disable() {
    this.enabled = !1;
  }
  prefetch(t) {
    return p(this, null, function* () {
      const e = this.parse(t);
      if (!e)
        throw new Error(
          'Attempted to prefetch a URL that does not belong to this app'
        );
      return this.renderer.load(e);
    });
  }
  _navigate(t, e, s, r, o) {
    return p(this, null, function* () {
      const a = this.parse(t);
      if (!a)
        throw new Error(
          'Attempted to navigate to a URL that does not belong to this app'
        );
      if (
        (this.navigating ||
          dispatchEvent(new CustomEvent('sveltekit:navigation-start')),
        this.navigating++,
        a.path !== '/')
      ) {
        const n = a.path.endsWith('/');
        ((n && this.trailing_slash === 'never') ||
          (!n &&
            this.trailing_slash === 'always' &&
            !(a.path.split('/').pop() || '').includes('.'))) &&
          ((a.path = n ? a.path.slice(0, -1) : a.path + '/'),
          history.replaceState(
            {},
            '',
            `${this.base}${a.path}${location.search}`
          ));
      }
      yield this.renderer.handle_navigation(a, r, !1, {
        hash: o,
        scroll: e,
        keepfocus: s,
      }),
        this.navigating--,
        this.navigating ||
          dispatchEvent(new CustomEvent('sveltekit:navigation-end'));
    });
  }
}
function at(i) {
  return i instanceof Error || (i && i.name && i.message)
    ? i
    : new Error(JSON.stringify(i));
}
function Ot(i) {
  let t = 5381,
    e = i.length;
  if (typeof i == 'string') for (; e; ) t = (t * 33) ^ i.charCodeAt(--e);
  else for (; e; ) t = (t * 33) ^ i[--e];
  return (t >>> 0).toString(36);
}
function Ct(i) {
  const t = i.status && i.status >= 400 && i.status <= 599 && !i.redirect;
  if (i.error || t) {
    const e = i.status;
    if (!i.error && t) return { status: e || 500, error: new Error() };
    const s = typeof i.error == 'string' ? new Error(i.error) : i.error;
    return s instanceof Error
      ? !e || e < 400 || e > 599
        ? (console.warn(
            '"error" returned from load() without a valid status code \u2014 defaulting to 500'
          ),
          { status: 500, error: s })
        : { status: e, error: s }
      : {
          status: 500,
          error: new Error(
            `"error" property returned from load() must be a string or instance of Error, received type "${typeof s}"`
          ),
        };
  }
  if (i.redirect) {
    if (!i.status || Math.floor(i.status / 100) !== 3)
      return {
        status: 500,
        error: new Error(
          '"redirect" property returned from load() must be accompanied by a 3xx status code'
        ),
      };
    if (typeof i.redirect != 'string')
      return {
        status: 500,
        error: new Error(
          '"redirect" property returned from load() must be a string'
        ),
      };
  }
  if (i.context)
    throw new Error(
      'You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.'
    );
  return i;
}
function Pt(i) {
  const t = W(i);
  let e = !0;
  function s() {
    (e = !0), t.update((a) => a);
  }
  function r(a) {
    (e = !1), t.set(a);
  }
  function o(a) {
    let n;
    return t.subscribe((l) => {
      (n === void 0 || (e && l !== n)) && a((n = l));
    });
  }
  return { notify: s, set: r, subscribe: o };
}
function Vt(i, t) {
  const e = typeof i == 'string' ? i : i.url;
  let s = `script[data-type="svelte-data"][data-url=${JSON.stringify(e)}]`;
  t && typeof t.body == 'string' && (s += `[data-body="${Ot(t.body)}"]`);
  const r = document.querySelector(s);
  if (r && r.textContent) {
    const o = JSON.parse(r.textContent),
      { body: a } = o,
      n = x(o, ['body']);
    return Promise.resolve(new Response(a, n));
  }
  return fetch(i, t);
}
class Dt {
  constructor({ Root: t, fallback: e, target: s, session: r, host: o }) {
    (this.Root = t),
      (this.fallback = e),
      (this.host = o),
      this.router,
      (this.target = s),
      (this.started = !1),
      (this.session_id = 1),
      (this.invalid = new Set()),
      (this.invalidating = null),
      (this.current = { page: null, session_id: 0, branch: [] }),
      (this.cache = new Map()),
      (this.loading = { id: null, promise: null }),
      (this.stores = { page: Pt({}), navigating: W(null), session: W(r) }),
      (this.$session = null),
      (this.root = null);
    let a = !1;
    this.stores.session.subscribe((n) =>
      p(this, null, function* () {
        if (((this.$session = n), !a || !this.router)) return;
        this.session_id += 1;
        const l = this.router.parse(new URL(location.href));
        l && this.update(l, [], !0);
      })
    ),
      (a = !0);
  }
  start(o) {
    return p(
      this,
      arguments,
      function* ({ status: t, error: e, nodes: s, page: r }) {
        const a = [];
        let n = {},
          l,
          c;
        try {
          for (let u = 0; u < s.length; u += 1) {
            const h = u === s.length - 1,
              f = yield this._load_node({
                module: yield s[u],
                page: r,
                stuff: n,
                status: h ? t : void 0,
                error: h ? e : void 0,
              });
            if ((a.push(f), f && f.loaded))
              if (f.loaded.error) {
                if (e) throw f.loaded.error;
                c = {
                  status: f.loaded.status,
                  error: f.loaded.error,
                  path: r.path,
                  query: r.query,
                };
              } else f.loaded.stuff && (n = R(R({}, n), f.loaded.stuff));
          }
          l = c
            ? yield this._load_error(c)
            : yield this._get_navigation_result_from_branch({
                page: r,
                branch: a,
              });
        } catch (u) {
          if (e) throw u;
          l = yield this._load_error({
            status: 500,
            error: at(u),
            path: r.path,
            query: r.query,
          });
        }
        if (l.redirect) {
          location.href = new URL(l.redirect, location.href).href;
          return;
        }
        this._init(l);
      }
    );
  }
  handle_navigation(t, e, s, r) {
    return p(this, null, function* () {
      this.started &&
        this.stores.navigating.set({
          from: {
            path: this.current.page.path,
            query: this.current.page.query,
          },
          to: { path: t.path, query: t.query },
        }),
        yield this.update(t, e, s, r);
    });
  }
  update(t, e, s, r) {
    return p(this, null, function* () {
      const o = (this.token = {});
      let a = yield this._get_navigation_result(t, s);
      if (o !== this.token) return;
      if ((this.invalid.clear(), a.redirect))
        if (e.length > 10 || e.includes(t.path))
          a = yield this._load_error({
            status: 500,
            error: new Error('Redirect loop'),
            path: t.path,
            query: t.query,
          });
        else {
          this.router
            ? this.router.goto(a.redirect, { replaceState: !0 }, [...e, t.path])
            : (location.href = new URL(a.redirect, location.href).href);
          return;
        }
      if (
        (a.reload
          ? location.reload()
          : this.started
          ? ((this.current = a.state),
            this.root.$set(a.props),
            this.stores.navigating.set(null))
          : this._init(a),
        r)
      ) {
        const { hash: l, scroll: c, keepfocus: u } = r;
        u || document.body.focus();
        const h = l && document.getElementById(l.slice(1));
        c ? scrollTo(c.x, c.y) : h ? h.scrollIntoView() : scrollTo(0, 0);
      }
      if (
        (yield 0,
        (this.loading.promise = null),
        (this.loading.id = null),
        !this.router)
      )
        return;
      const n = a.state.branch[a.state.branch.length - 1];
      n && n.module.router === !1
        ? this.router.disable()
        : this.router.enable();
    });
  }
  load(t) {
    return (
      (this.loading.promise = this._get_navigation_result(t, !1)),
      (this.loading.id = t.id),
      this.loading.promise
    );
  }
  invalidate(t) {
    return (
      this.invalid.add(t),
      this.invalidating ||
        (this.invalidating = Promise.resolve().then(() =>
          p(this, null, function* () {
            const e = this.router && this.router.parse(new URL(location.href));
            e && (yield this.update(e, [], !0)), (this.invalidating = null);
          })
        )),
      this.invalidating
    );
  }
  _init(t) {
    this.current = t.state;
    const e = document.querySelector('style[data-svelte]');
    e && e.remove(),
      (this.root = new this.Root({
        target: this.target,
        props: R({ stores: this.stores }, t.props),
        hydrate: !0,
      })),
      (this.started = !0);
  }
  _get_navigation_result(t, e) {
    return p(this, null, function* () {
      if (this.loading.id === t.id && this.loading.promise)
        return this.loading.promise;
      for (let s = 0; s < t.routes.length; s += 1) {
        const r = t.routes[s];
        let o = s + 1;
        for (; o < t.routes.length; ) {
          const n = t.routes[o];
          if (n[0].toString() === r[0].toString())
            n[1].forEach((l) => l()), (o += 1);
          else break;
        }
        const a = yield this._load({ route: r, info: t }, e);
        if (a) return a;
      }
      return yield this._load_error({
        status: 404,
        error: new Error(`Not found: ${t.path}`),
        path: t.path,
        query: t.query,
      });
    });
  }
  _get_navigation_result_from_branch(s) {
    return p(this, arguments, function* ({ page: t, branch: e }) {
      const r = e.filter(Boolean),
        o = r.find((c) => c.loaded && c.loaded.redirect),
        a = {
          redirect: o && o.loaded ? o.loaded.redirect : void 0,
          state: { page: t, branch: e, session_id: this.session_id },
          props: { components: r.map((c) => c.module.default) },
        };
      for (let c = 0; c < r.length; c += 1) {
        const u = r[c].loaded;
        a.props[`props_${c}`] = u ? yield u.props : null;
      }
      (!this.current.page ||
        t.path !== this.current.page.path ||
        t.query.toString() !== this.current.page.query.toString()) &&
        (a.props.page = t);
      const n = r[r.length - 1],
        l = n.loaded && n.loaded.maxage;
      if (l) {
        const c = `${t.path}?${t.query}`;
        let u = !1;
        const h = () => {
            this.cache.get(c) === a && this.cache.delete(c),
              g(),
              clearTimeout(f);
          },
          f = setTimeout(h, l * 1e3),
          g = this.stores.session.subscribe(() => {
            u && h();
          });
        (u = !0), this.cache.set(c, a);
      }
      return a;
    });
  }
  _load_node(a) {
    return p(
      this,
      arguments,
      function* ({ status: t, error: e, module: s, page: r, stuff: o }) {
        const n = {
            module: s,
            uses: {
              params: new Set(),
              path: !1,
              query: !1,
              session: !1,
              stuff: !1,
              dependencies: [],
            },
            loaded: null,
            stuff: o,
          },
          l = {};
        for (const u in r.params)
          Object.defineProperty(l, u, {
            get() {
              return n.uses.params.add(u), r.params[u];
            },
            enumerable: !0,
          });
        const c = this.$session;
        if (s.load) {
          const { started: u } = this,
            h = {
              page: {
                host: r.host,
                params: l,
                get path() {
                  return (n.uses.path = !0), r.path;
                },
                get query() {
                  return (n.uses.query = !0), r.query;
                },
              },
              get session() {
                return (n.uses.session = !0), c;
              },
              get stuff() {
                return (n.uses.stuff = !0), R({}, o);
              },
              fetch(g, E) {
                const j = typeof g == 'string' ? g : g.url,
                  { href: q } = new URL(j, new URL(r.path, document.baseURI));
                return n.uses.dependencies.push(q), u ? fetch(g, E) : Vt(g, E);
              },
            };
          e && ((h.status = t), (h.error = e));
          const f = yield s.load.call(null, h);
          if (!f) return;
          (n.loaded = Ct(f)), n.loaded.stuff && (n.stuff = n.loaded.stuff);
        }
        return n;
      }
    );
  }
  _load(a, n) {
    return p(
      this,
      arguments,
      function* (
        { route: t, info: { path: e, decoded_path: s, query: r } },
        o
      ) {
        const l = `${s}?${r}`;
        if (!o) {
          const d = this.cache.get(l);
          if (d) return d;
        }
        const [c, u, h, f] = t,
          g = f ? f(c.exec(s)) : {},
          E = this.current.page && {
            path: e !== this.current.page.path,
            params: Object.keys(g).filter(
              (d) => this.current.page.params[d] !== g[d]
            ),
            query: r.toString() !== this.current.page.query.toString(),
            session: this.session_id !== this.current.session_id,
          },
          j = { host: this.host, path: e, query: r, params: g };
        let q = [],
          K = {},
          H = !1,
          C = 200,
          I;
        u.forEach((d) => d());
        t: for (let d = 0; d < u.length; d += 1) {
          let _;
          try {
            if (!u[d]) continue;
            const b = yield u[d](),
              m = this.current.branch[d];
            if (
              !m ||
              b !== m.module ||
              (E.path && m.uses.path) ||
              E.params.some((L) => m.uses.params.has(L)) ||
              (E.query && m.uses.query) ||
              (E.session && m.uses.session) ||
              m.uses.dependencies.some((L) => this.invalid.has(L)) ||
              (H && m.uses.stuff)
            ) {
              _ = yield this._load_node({ module: b, page: j, stuff: K });
              const L = d === u.length - 1;
              if (_ && _.loaded) {
                if (
                  (_.loaded.error &&
                    ((C = _.loaded.status), (I = _.loaded.error)),
                  _.loaded.redirect)
                )
                  return {
                    redirect: _.loaded.redirect,
                    props: {},
                    state: this.current,
                  };
                _.loaded.stuff && (H = !0);
              } else if (L && b.load) return;
            } else _ = m;
          } catch (b) {
            (C = 500), (I = at(b));
          }
          if (I) {
            for (; d--; )
              if (h[d]) {
                let b,
                  m,
                  P = d;
                for (; !(m = q[P]); ) P -= 1;
                try {
                  if (
                    ((b = yield this._load_node({
                      status: C,
                      error: I,
                      module: yield h[d](),
                      page: j,
                      stuff: m.stuff,
                    })),
                    b && b.loaded && b.loaded.error)
                  )
                    continue;
                  q = q.slice(0, P + 1).concat(b);
                  break t;
                } catch (L) {
                  continue;
                }
              }
            return yield this._load_error({
              status: C,
              error: I,
              path: e,
              query: r,
            });
          } else
            _ &&
              _.loaded &&
              _.loaded.stuff &&
              (K = R(R({}, K), _.loaded.stuff)),
              q.push(_);
        }
        return yield this._get_navigation_result_from_branch({
          page: j,
          branch: q,
        });
      }
    );
  }
  _load_error(o) {
    return p(
      this,
      arguments,
      function* ({ status: t, error: e, path: s, query: r }) {
        const a = { host: this.host, path: s, query: r, params: {} },
          n = yield this._load_node({
            module: yield this.fallback[0],
            page: a,
            stuff: {},
          }),
          l = [
            n,
            yield this._load_node({
              status: t,
              error: e,
              module: yield this.fallback[1],
              page: a,
              stuff: (n && n.loaded && n.loaded.stuff) || {},
            }),
          ];
        return yield this._get_navigation_result_from_branch({
          page: a,
          branch: l,
        });
      }
    );
  }
}
function Jt(l) {
  return p(
    this,
    arguments,
    function* ({
      paths: i,
      target: t,
      session: e,
      host: s,
      route: r,
      spa: o,
      trailing_slash: a,
      hydrate: n,
    }) {
      const c = new Dt({
          Root: Ut,
          fallback: jt,
          target: t,
          session: e,
          host: s,
        }),
        u = r
          ? new Nt({ base: i.base, routes: Tt, trailing_slash: a, renderer: c })
          : null;
      Rt(i),
        n && (yield c.start(n)),
        u &&
          (o && u.goto(location.href, { replaceState: !0 }, []),
          u.init_listeners()),
        dispatchEvent(new CustomEvent('sveltekit:start'));
    }
  );
}
export { Jt as start };
