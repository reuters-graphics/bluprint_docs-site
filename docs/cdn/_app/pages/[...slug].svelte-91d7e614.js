var k = (a, s, n) =>
  new Promise((t, r) => {
    var i = (e) => {
        try {
          p(n.next(e));
        } catch (o) {
          r(o);
        }
      },
      m = (e) => {
        try {
          p(n.throw(e));
        } catch (o) {
          r(o);
        }
      },
      p = (e) => (e.done ? t(e.value) : Promise.resolve(e.value).then(i, m));
    p((n = n.apply(a, s)).next());
  });
import { _ as u } from '../chunks/preload-helper-101fda89.js';
import {
  X as E,
  S as P,
  i as T,
  s as C,
  W as I,
  j as c,
  k as O,
  l as $,
  m as j,
  n as A,
  o as l,
  f as w,
  u as g,
  w as L,
  x as _,
  v as h,
  d as D,
  r as R,
} from '../chunks/vendor-0f5fab7e.js';
var v = (a) => {
  const s = a
    .replace('./../../pages/', '')
    .replace(/\.md$/i, '')
    .replace(/^\//, '');
  return E(s, { remove: /[*+~.()'"!:@]/g, lower: !0 });
};
function V(a) {
  let s, n, t, r, i;
  s = new I({
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
  function p(e) {
    return {};
  }
  return (
    m && (t = new m(p())),
    {
      c() {
        c(s.$$.fragment), (n = O()), t && c(t.$$.fragment), (r = $());
      },
      l(e) {
        j(s.$$.fragment, e), (n = A(e)), t && j(t.$$.fragment, e), (r = $());
      },
      m(e, o) {
        l(s, e, o), w(e, n, o), t && l(t, e, o), w(e, r, o), (i = !0);
      },
      p(e, [o]) {
        const f = {};
        if (
          (o & 2 && (f.seoTitle = e[1].title),
          o & 2 && (f.seoDescription = e[1].description),
          o & 2 && (f.shareTitle = e[1].title),
          o & 2 && (f.shareDescription = e[1].description),
          o & 2 &&
            (f.shareImgPath = e[1].image || 'images/reuters-graphics.jpg'),
          o & 2 && (f.lang = e[1].lang || 'en'),
          s.$set(f),
          m !== (m = e[0]))
        ) {
          if (t) {
            R();
            const d = t;
            g(d.$$.fragment, 1, 0, () => {
              h(d, 1);
            }),
              L();
          }
          m
            ? ((t = new m(p())),
              c(t.$$.fragment),
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
        h(s, e), e && D(n), e && D(r), t && h(t, e);
      },
    }
  );
}
function z(s) {
  return k(this, arguments, function* ({ page: a }) {
    const n = {
      './../../pages/home.md': () =>
        u(
          () => import('../chunks/home-825f5e2c.js'),
          [
            'chunks/home-825f5e2c.js',
            'chunks/vendor-0f5fab7e.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/making-pages.md': () =>
        u(
          () => import('../chunks/making-pages-40d7e246.js'),
          [
            'chunks/making-pages-40d7e246.js',
            'chunks/vendor-0f5fab7e.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/nested/another.md': () =>
        u(
          () => import('../chunks/another-56300375.js'),
          [
            'chunks/another-56300375.js',
            'chunks/vendor-0f5fab7e.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
      './../../pages/nested/page.md': () =>
        u(
          () => import('../chunks/page-4787e19e.js'),
          [
            'chunks/page-4787e19e.js',
            'chunks/vendor-0f5fab7e.js',
            'assets/vendor-4ab6d437.css',
          ]
        ),
    };
    let t;
    for (const [i, m] of Object.entries(n))
      if (v(i) === v(a.path)) {
        t = { path: i, resolver: m };
        break;
      }
    if (!t) return { status: 404 };
    const r = yield t.resolver();
    return { props: { Component: r.default, metadata: r.metadata } };
  });
}
function b(a, s, n) {
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
class B extends P {
  constructor(s) {
    super();
    T(this, s, b, V, C, { Component: 0, metadata: 1 });
  }
}
export { B as default, z as load };
