var g = (i, n, a) =>
  new Promise((t, r) => {
    var f = (e) => {
        try {
          m(a.next(e));
        } catch (o) {
          r(o);
        }
      },
      s = (e) => {
        try {
          m(a.throw(e));
        } catch (o) {
          r(o);
        }
      },
      m = (e) => (e.done ? t(e.value) : Promise.resolve(e.value).then(f, s));
    m((a = a.apply(i, n)).next());
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
  n as b,
  o as l,
  f as j,
  u as p,
  w as q,
  x as _,
  v as d,
  d as C,
  r as y,
} from '../chunks/vendor-0f5fab7e.js';
import E, { metadata as H } from '../chunks/home-825f5e2c.js';
function I(i) {
  let n, a, t, r, f;
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
  function m(e) {
    return {};
  }
  return (
    s && (t = new s(m())),
    {
      c() {
        u(n.$$.fragment), (a = S()), t && u(t.$$.fragment), (r = w());
      },
      l(e) {
        $(n.$$.fragment, e), (a = b(e)), t && $(t.$$.fragment, e), (r = w());
      },
      m(e, o) {
        l(n, e, o), j(e, a, o), t && l(t, e, o), j(e, r, o), (f = !0);
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
            y();
            const h = t;
            p(h.$$.fragment, 1, 0, () => {
              d(h, 1);
            }),
              q();
          }
          s
            ? ((t = new s(m())),
              u(t.$$.fragment),
              _(t.$$.fragment, 1),
              l(t, r.parentNode, r))
            : (t = null);
        }
      },
      i(e) {
        f || (_(n.$$.fragment, e), t && _(t.$$.fragment, e), (f = !0));
      },
      o(e) {
        p(n.$$.fragment, e), t && p(t.$$.fragment, e), (f = !1);
      },
      d(e) {
        d(n, e), e && C(a), e && C(r), t && d(t, e);
      },
    }
  );
}
const W = (n) =>
  g(void 0, [n], function* ({ fetch: i }) {
    return {
      props: {
        docs: yield i('./docs.json').then((t) => t.json()),
        Component: E,
        metadata: H,
      },
    };
  });
function N(i, n, a) {
  let { docs: t } = n,
    { Component: r } = n,
    { metadata: f } = n;
  return (
    (i.$$set = (s) => {
      'docs' in s && a(2, (t = s.docs)),
        'Component' in s && a(0, (r = s.Component)),
        'metadata' in s && a(1, (f = s.metadata));
    }),
    [r, f, t]
  );
}
class z extends k {
  constructor(n) {
    super();
    D(this, n, N, I, T, { docs: 2, Component: 0, metadata: 1 });
  }
}
export { z as default, W as load };
