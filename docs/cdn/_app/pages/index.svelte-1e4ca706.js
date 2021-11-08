var g = (i, n, a) =>
  new Promise((t, r) => {
    var m = (e) => {
        try {
          f(a.next(e));
        } catch (o) {
          r(o);
        }
      },
      s = (e) => {
        try {
          f(a.throw(e));
        } catch (o) {
          r(o);
        }
      },
      f = (e) => (e.done ? t(e.value) : Promise.resolve(e.value).then(m, s));
    f((a = a.apply(i, n)).next());
  });
import {
  S as k,
  i as D,
  s as T,
  W as v,
  j as u,
  k as S,
  l as w,
  m as $,
  n as q,
  o as l,
  f as j,
  u as p,
  w as y,
  x as _,
  v as d,
  d as C,
  r as E,
} from '../chunks/vendor-ae834d0e.js';
import H, { metadata as I } from '../chunks/home-498e744a.js';
function N(i) {
  let n, a, t, r, m;
  n = new v({
    props: {
      seoTitle: i[1].title,
      seoDescription: i[1].description,
      shareTitle: i[1].title,
      shareDescription: i[1].description,
      shareImgPath: 'images/reuters-graphics.jpg',
      lang: 'en',
    },
  });
  var s = i[0];
  function f(e) {
    return {};
  }
  return (
    s && (t = new s(f())),
    {
      c() {
        u(n.$$.fragment), (a = S()), t && u(t.$$.fragment), (r = w());
      },
      l(e) {
        $(n.$$.fragment, e), (a = q(e)), t && $(t.$$.fragment, e), (r = w());
      },
      m(e, o) {
        l(n, e, o), j(e, a, o), t && l(t, e, o), j(e, r, o), (m = !0);
      },
      p(e, [o]) {
        const c = {};
        if (
          (o & 2 && (c.seoTitle = e[1].title),
          o & 2 && (c.seoDescription = e[1].description),
          o & 2 && (c.shareTitle = e[1].title),
          o & 2 && (c.shareDescription = e[1].description),
          n.$set(c),
          s !== (s = e[0]))
        ) {
          if (t) {
            E();
            const h = t;
            p(h.$$.fragment, 1, 0, () => {
              d(h, 1);
            }),
              y();
          }
          s
            ? ((t = new s(f())),
              u(t.$$.fragment),
              _(t.$$.fragment, 1),
              l(t, r.parentNode, r))
            : (t = null);
        }
      },
      i(e) {
        m || (_(n.$$.fragment, e), t && _(t.$$.fragment, e), (m = !0));
      },
      o(e) {
        p(n.$$.fragment, e), t && p(t.$$.fragment, e), (m = !1);
      },
      d(e) {
        d(n, e), e && C(a), e && C(r), t && d(t, e);
      },
    }
  );
}
const b = (n) =>
  g(void 0, [n], function* ({ fetch: i }) {
    return {
      props: {
        docs: yield i('./docs.json').then((t) => t.json()),
        Component: H,
        metadata: I,
      },
    };
  });
function O(i, n, a) {
  let { docs: t } = n,
    { Component: r } = n,
    { metadata: m } = n;
  return (
    (i.$$set = (s) => {
      'docs' in s && a(2, (t = s.docs)),
        'Component' in s && a(0, (r = s.Component)),
        'metadata' in s && a(1, (m = s.metadata));
    }),
    [r, m, t]
  );
}
class z extends k {
  constructor(n) {
    super();
    D(this, n, O, N, T, { docs: 2, Component: 0, metadata: 1 });
  }
}
export { z as default, b as load };
