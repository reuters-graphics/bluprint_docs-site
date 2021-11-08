var de = Object.defineProperty,
  pe = Object.defineProperties;
var ve = Object.getOwnPropertyDescriptors;
var W = Object.getOwnPropertySymbols;
var $e = Object.prototype.hasOwnProperty,
  be = Object.prototype.propertyIsEnumerable;
var X = (a, t, e) =>
    t in a
      ? de(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (a[t] = e),
  Y = (a, t) => {
    for (var e in t || (t = {})) $e.call(t, e) && X(a, e, t[e]);
    if (W) for (var e of W(t)) be.call(t, e) && X(a, e, t[e]);
    return a;
  },
  Z = (a, t) => pe(a, ve(t));
var x = (a, t, e) =>
  new Promise((o, s) => {
    var l = (c) => {
        try {
          r(e.next(c));
        } catch (i) {
          s(i);
        }
      },
      n = (c) => {
        try {
          r(e.throw(c));
        } catch (i) {
          s(i);
        }
      },
      r = (c) => (c.done ? o(c.value) : Promise.resolve(c.value).then(l, n));
    r((e = e.apply(a, t)).next());
  });
import {
  E as we,
  S as ee,
  i as te,
  s as se,
  F as le,
  G as Ee,
  H as ke,
  k as M,
  e as v,
  n as N,
  c as $,
  a as b,
  d as _,
  b as m,
  f as I,
  I as d,
  t as q,
  g as J,
  h as ae,
  J as T,
  K as k,
  L as ne,
  M as re,
  j as C,
  m as G,
  o as U,
  N as Ie,
  O as oe,
  P as ce,
  Q as ie,
  x as O,
  u as j,
  v as y,
  R as Ae,
  T as De,
  U as Le,
} from '../chunks/vendor-3470fd39.js';
const Me = (a) => (a.includes('/') ? a.split('/')[0] : ''),
  Ne = (a, t) => `/${a}` === t,
  fe = (a) => (isNaN(a.order) ? 1 / 0 : Number(a.order));
var Oe = (a, t) => {
  const e = we(
      a.map((s) =>
        Z(Y({}, s), { navGroup: Me(s.slug), isActive: Ne(s.slug, t) })
      ),
      (s) => s.navGroup
    ),
    o = Object.keys(e);
  return (
    o.sort((s, l) => {
      const n = Math.min(...e[s].map((c) => fe(c))),
        r = Math.min(...e[l].map((c) => fe(c)));
      return n - r;
    }),
    [e, o]
  );
};
function ue(a, t, e) {
  const o = a.slice();
  return (o[8] = t[e]), o;
}
function _e(a, t, e) {
  const o = a.slice();
  return (o[11] = t[e]), o;
}
function he(a) {
  let t,
    e = a[8] + '',
    o;
  return {
    c() {
      (t = v('h5')), (o = q(e)), this.h();
    },
    l(s) {
      t = $(s, 'H5', { class: !0 });
      var l = b(t);
      (o = J(l, e)), l.forEach(_), this.h();
    },
    h() {
      m(t, 'class', 'svelte-cl1g5w');
    },
    m(s, l) {
      I(s, t, l), d(t, o);
    },
    p(s, l) {
      l & 4 && e !== (e = s[8] + '') && ae(o, e);
    },
    d(s) {
      s && _(t);
    },
  };
}
function me(a) {
  let t,
    e,
    o = a[11].title + '',
    s,
    l;
  return {
    c() {
      (t = v('li')), (e = v('a')), (s = q(o)), this.h();
    },
    l(n) {
      t = $(n, 'LI', { class: !0 });
      var r = b(t);
      e = $(r, 'A', { href: !0, class: !0 });
      var c = b(e);
      (s = J(c, o)), c.forEach(_), r.forEach(_), this.h();
    },
    h() {
      m(e, 'href', (l = `${T}/${a[11].slug}`)),
        m(e, 'class', 'svelte-cl1g5w'),
        m(t, 'class', 'svelte-cl1g5w'),
        k(t, 'active', a[11].isActive);
    },
    m(n, r) {
      I(n, t, r), d(t, e), d(e, s);
    },
    p(n, r) {
      r & 12 && o !== (o = n[11].title + '') && ae(s, o),
        r & 12 && l !== (l = `${T}/${n[11].slug}`) && m(e, 'href', l),
        r & 12 && k(t, 'active', n[11].isActive);
    },
    d(n) {
      n && _(t);
    },
  };
}
function ge(a) {
  let t,
    e,
    o,
    s = a[8] && he(a),
    l = a[3][a[8]],
    n = [];
  for (let r = 0; r < l.length; r += 1) n[r] = me(_e(a, l, r));
  return {
    c() {
      s && s.c(), (t = M()), (e = v('ul'));
      for (let r = 0; r < n.length; r += 1) n[r].c();
      (o = M()), this.h();
    },
    l(r) {
      s && s.l(r), (t = N(r)), (e = $(r, 'UL', { class: !0 }));
      var c = b(e);
      for (let i = 0; i < n.length; i += 1) n[i].l(c);
      (o = N(c)), c.forEach(_), this.h();
    },
    h() {
      m(e, 'class', 'svelte-cl1g5w');
    },
    m(r, c) {
      s && s.m(r, c), I(r, t, c), I(r, e, c);
      for (let i = 0; i < n.length; i += 1) n[i].m(e, null);
      d(e, o);
    },
    p(r, c) {
      if (
        (r[8]
          ? s
            ? s.p(r, c)
            : ((s = he(r)), s.c(), s.m(t.parentNode, t))
          : s && (s.d(1), (s = null)),
        c & 12)
      ) {
        l = r[3][r[8]];
        let i;
        for (i = 0; i < l.length; i += 1) {
          const E = _e(r, l, i);
          n[i] ? n[i].p(E, c) : ((n[i] = me(E)), n[i].c(), n[i].m(e, o));
        }
        for (; i < n.length; i += 1) n[i].d(1);
        n.length = l.length;
      }
    },
    d(r) {
      s && s.d(r), r && _(t), r && _(e), ne(n, r);
    },
  };
}
function je(a) {
  let t, e, o, s, l, n, r, c, i, E, w, B, A, D, V, K;
  (s = new le({ props: { fw: !0, icon: Ee } })),
    (i = new le({ props: { fw: !0, icon: ke } }));
  let L = a[2],
    h = [];
  for (let f = 0; f < L.length; f += 1) h[f] = ge(ue(a, L, f));
  const F = a[6].default,
    p = re(F, a, a[5], null);
  return {
    c() {
      (t = v('div')),
        (e = v('div')),
        (o = v('button')),
        C(s.$$.fragment),
        (l = M()),
        (n = v('ul')),
        (r = v('li')),
        (c = v('a')),
        C(i.$$.fragment),
        (E = q(' Home')),
        (w = M());
      for (let f = 0; f < h.length; f += 1) h[f].c();
      (B = M()), (A = v('div')), p && p.c(), this.h();
    },
    l(f) {
      t = $(f, 'DIV', { class: !0 });
      var g = b(t);
      e = $(g, 'DIV', { class: !0 });
      var u = b(e);
      o = $(u, 'BUTTON', { class: !0 });
      var H = b(o);
      G(s.$$.fragment, H),
        H.forEach(_),
        (l = N(u)),
        (n = $(u, 'UL', { class: !0 }));
      var P = b(n);
      r = $(P, 'LI', { class: !0 });
      var Q = b(r);
      c = $(Q, 'A', { href: !0, class: !0 });
      var R = b(c);
      G(i.$$.fragment, R),
        (E = J(R, ' Home')),
        R.forEach(_),
        Q.forEach(_),
        P.forEach(_),
        (w = N(u));
      for (let S = 0; S < h.length; S += 1) h[S].l(u);
      u.forEach(_), (B = N(g)), (A = $(g, 'DIV', { class: !0 }));
      var z = b(A);
      p && p.l(z), z.forEach(_), g.forEach(_), this.h();
    },
    h() {
      m(o, 'class', 'svelte-cl1g5w'),
        k(o, 'active', a[1]),
        m(c, 'href', `${T}/`),
        m(c, 'class', 'svelte-cl1g5w'),
        m(r, 'class', 'svelte-cl1g5w'),
        k(r, 'active', a[0].path === '/'),
        m(n, 'class', 'home svelte-cl1g5w'),
        m(e, 'class', 'page-menu svelte-cl1g5w'),
        k(e, 'active-mobile', a[1]),
        m(A, 'class', 'page-content svelte-cl1g5w'),
        m(t, 'class', 'page-container svelte-cl1g5w');
    },
    m(f, g) {
      I(f, t, g),
        d(t, e),
        d(e, o),
        U(s, o, null),
        d(e, l),
        d(e, n),
        d(n, r),
        d(r, c),
        U(i, c, null),
        d(c, E),
        d(e, w);
      for (let u = 0; u < h.length; u += 1) h[u].m(e, null);
      d(t, B),
        d(t, A),
        p && p.m(A, null),
        (D = !0),
        V || ((K = Ie(o, 'click', a[7])), (V = !0));
    },
    p(f, [g]) {
      if (
        (g & 2 && k(o, 'active', f[1]),
        g & 1 && k(r, 'active', f[0].path === '/'),
        g & 12)
      ) {
        L = f[2];
        let u;
        for (u = 0; u < L.length; u += 1) {
          const H = ue(f, L, u);
          h[u] ? h[u].p(H, g) : ((h[u] = ge(H)), h[u].c(), h[u].m(e, null));
        }
        for (; u < h.length; u += 1) h[u].d(1);
        h.length = L.length;
      }
      g & 2 && k(e, 'active-mobile', f[1]),
        p &&
          p.p &&
          (!D || g & 32) &&
          oe(p, F, f, f[5], D ? ie(F, f[5], g, null) : ce(f[5]), null);
    },
    i(f) {
      D || (O(s.$$.fragment, f), O(i.$$.fragment, f), O(p, f), (D = !0));
    },
    o(f) {
      j(s.$$.fragment, f), j(i.$$.fragment, f), j(p, f), (D = !1);
    },
    d(f) {
      f && _(t), y(s), y(i), ne(h, f), p && p.d(f), (V = !1), K();
    },
  };
}
function He(a, t, e) {
  let o, s, l;
  Ae(a, De, (w) => e(0, (l = w)));
  let { $$slots: n = {}, $$scope: r } = t,
    { docs: c } = t,
    i = !1;
  const E = () => {
    e(1, (i = !i));
  };
  return (
    (a.$$set = (w) => {
      'docs' in w && e(4, (c = w.docs)),
        '$$scope' in w && e(5, (r = w.$$scope));
    }),
    (a.$$.update = () => {
      a.$$.dirty & 17 &&
        e(3, ([o, s] = Oe(c, l.path)), o, (e(2, s), e(4, c), e(0, l)));
    }),
    [l, i, s, o, c, r, n, E]
  );
}
class Te extends ee {
  constructor(t) {
    super();
    te(this, t, He, je, se, { docs: 4 });
  }
}
function Ce(a) {
  let t, e;
  const o = a[1].default,
    s = re(o, a, a[2], null);
  return {
    c() {
      (t = v('article')), s && s.c(), this.h();
    },
    l(l) {
      t = $(l, 'ARTICLE', { class: !0 });
      var n = b(t);
      s && s.l(n), n.forEach(_), this.h();
    },
    h() {
      m(t, 'class', 'container-fluid');
    },
    m(l, n) {
      I(l, t, n), s && s.m(t, null), (e = !0);
    },
    p(l, n) {
      s &&
        s.p &&
        (!e || n & 4) &&
        oe(s, o, l, l[2], e ? ie(o, l[2], n, null) : ce(l[2]), null);
    },
    i(l) {
      e || (O(s, l), (e = !0));
    },
    o(l) {
      j(s, l), (e = !1);
    },
    d(l) {
      l && _(t), s && s.d(l);
    },
  };
}
function Ge(a) {
  let t, e, o, s;
  return (
    (t = new Le({
      props: { lightLogo: !1, backgroundColour: '#fff', link: T + '/' },
    })),
    (o = new Te({
      props: { docs: a[0], $$slots: { default: [Ce] }, $$scope: { ctx: a } },
    })),
    {
      c() {
        C(t.$$.fragment), (e = M()), C(o.$$.fragment);
      },
      l(l) {
        G(t.$$.fragment, l), (e = N(l)), G(o.$$.fragment, l);
      },
      m(l, n) {
        U(t, l, n), I(l, e, n), U(o, l, n), (s = !0);
      },
      p(l, [n]) {
        const r = {};
        n & 1 && (r.docs = l[0]),
          n & 4 && (r.$$scope = { dirty: n, ctx: l }),
          o.$set(r);
      },
      i(l) {
        s || (O(t.$$.fragment, l), O(o.$$.fragment, l), (s = !0));
      },
      o(l) {
        j(t.$$.fragment, l), j(o.$$.fragment, l), (s = !1);
      },
      d(l) {
        y(t, l), l && _(e), y(o, l);
      },
    }
  );
}
const Ve = (t) =>
  x(void 0, [t], function* ({ fetch: a }) {
    return { props: { docs: yield a('/docs.json').then((o) => o.json()) } };
  });
function Ue(a, t, e) {
  let { $$slots: o = {}, $$scope: s } = t,
    { docs: l } = t;
  return (
    (a.$$set = (n) => {
      'docs' in n && e(0, (l = n.docs)),
        '$$scope' in n && e(2, (s = n.$$scope));
    }),
    [l, o, s]
  );
}
class Fe extends ee {
  constructor(t) {
    super();
    te(this, t, Ue, Ge, se, { docs: 0 });
  }
}
export { Fe as default, Ve as load };
