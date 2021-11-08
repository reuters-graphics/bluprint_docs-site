var k = (a, s, n) =>
  new Promise((t, r) => {
    var i = (e) => {
        try {
          c(n.next(e));
        } catch (o) {
          r(o);
        }
      },
      m = (e) => {
        try {
          c(n.throw(e));
        } catch (o) {
          r(o);
        }
      },
      c = (e) => (e.done ? t(e.value) : Promise.resolve(e.value).then(i, m));
    c((n = n.apply(a, s)).next());
  });
import { _ as f } from '../chunks/preload-helper-385eac3a.js';
import {
  X as v,
  S as E,
  i as P,
  s as T,
  W as C,
  j as u,
  k as I,
  l as $,
  m as j,
  n as O,
  o as l,
  f as b,
  u as g,
  w as A,
  x as _,
  v as h,
  d as w,
  r as L,
} from '../chunks/vendor-3470fd39.js';
var D = (a) => {
  const s = a
    .replace('./../../pages/', '')
    .replace(/\.md$/i, '')
    .replace(/^\//, '');
  return v(s, { remove: /[*+~.()'"!:@]/g, lower: !0 });
};
function R(a) {
  let s, n, t, r, i;
  s = new C({
    props: {
      seoTitle: a[1].title,
      seoDescription: a[1].description,
      shareTitle: a[1].title,
      shareDescription: a[1].description,
      shareImgPath: a[1].image || 'images/reuters-graphics.jpg',
      lang: a[1].lang || 'en',
    },
  });
  var m = a[0];
  function c(e) {
    return {};
  }
  return (
    m && (t = new m(c())),
    {
      c() {
        u(s.$$.fragment), (n = I()), t && u(t.$$.fragment), (r = $());
      },
      l(e) {
        j(s.$$.fragment, e), (n = O(e)), t && j(t.$$.fragment, e), (r = $());
      },
      m(e, o) {
        l(s, e, o), b(e, n, o), t && l(t, e, o), b(e, r, o), (i = !0);
      },
      p(e, [o]) {
        const p = {};
        if (
          (o & 2 && (p.seoTitle = e[1].title),
          o & 2 && (p.seoDescription = e[1].description),
          o & 2 && (p.shareTitle = e[1].title),
          o & 2 && (p.shareDescription = e[1].description),
          o & 2 &&
            (p.shareImgPath = e[1].image || 'images/reuters-graphics.jpg'),
          o & 2 && (p.lang = e[1].lang || 'en'),
          s.$set(p),
          m !== (m = e[0]))
        ) {
          if (t) {
            L();
            const d = t;
            g(d.$$.fragment, 1, 0, () => {
              h(d, 1);
            }),
              A();
          }
          m
            ? ((t = new m(c())),
              u(t.$$.fragment),
              _(t.$$.fragment, 1),
              l(t, r.parentNode, r))
            : (t = null);
        }
      },
      i(e) {
        i || (_(s.$$.fragment, e), t && _(t.$$.fragment, e), (i = !0));
      },
      o(e) {
        g(s.$$.fragment, e), t && g(t.$$.fragment, e), (i = !1);
      },
      d(e) {
        h(s, e), e && w(n), e && w(r), t && h(t, e);
      },
    }
  );
}
function z(s) {
  return k(this, arguments, function* ({ page: a }) {
    const n = {
      './../../pages/home.md': () =>
        f(
          () => import('../chunks/home-f1bc6107.js'),
          [
            'chunks/home-f1bc6107.js',
            'chunks/vendor-3470fd39.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/making-pages.md': () =>
        f(
          () => import('../chunks/making-pages-c72a6ada.js'),
          [
            'chunks/making-pages-c72a6ada.js',
            'chunks/vendor-3470fd39.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/nested/another.md': () =>
        f(
          () => import('../chunks/another-81b9cb5c.js'),
          [
            'chunks/another-81b9cb5c.js',
            'chunks/vendor-3470fd39.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/nested/page.md': () =>
        f(
          () => import('../chunks/page-5b794b9f.js'),
          [
            'chunks/page-5b794b9f.js',
            'chunks/vendor-3470fd39.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
    };
    let t;
    for (const [i, m] of Object.entries(n))
      if (D(i) === D(a.path)) {
        t = { path: i, resolver: m };
        break;
      }
    if (!t) return { status: 404 };
    const r = yield t.resolver();
    return { props: { Component: r.default, metadata: r.metadata } };
  });
}
function V(a, s, n) {
  let { Component: t } = s,
    { metadata: r } = s;
  return (
    (a.$$set = (i) => {
      'Component' in i && n(0, (t = i.Component)),
        'metadata' in i && n(1, (r = i.metadata));
    }),
    [t, r]
  );
}
class B extends E {
  constructor(s) {
    super();
    P(this, s, V, R, T, { Component: 0, metadata: 1 });
  }
}
export { B as default, z as load };
