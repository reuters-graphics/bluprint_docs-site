import {
  S as j,
  i as k,
  s as y,
  W as S,
  j as m,
  k as D,
  l as g,
  m as h,
  n as T,
  o as c,
  f as d,
  u as p,
  w as b,
  x as u,
  v as l,
  d as w,
  r as q,
} from '../chunks/vendor-3470fd39.js';
import x, { metadata as r } from '../chunks/home-f1bc6107.js';
function C(v) {
  let s, o, t, n, f;
  s = new S({
    props: {
      seoTitle: r.title,
      seoDescription: r.description,
      shareTitle: r.title,
      shareDescription: r.description,
      shareImgPath: r.image || 'images/reuters-graphics.jpg',
      lang: r.lang || 'en',
    },
  });
  var a = x;
  function $(e) {
    return {};
  }
  return (
    a && (t = new a($())),
    {
      c() {
        m(s.$$.fragment), (o = D()), t && m(t.$$.fragment), (n = g());
      },
      l(e) {
        h(s.$$.fragment, e), (o = T(e)), t && h(t.$$.fragment, e), (n = g());
      },
      m(e, i) {
        c(s, e, i), d(e, o, i), t && c(t, e, i), d(e, n, i), (f = !0);
      },
      p(e, [i]) {
        if (a !== (a = x)) {
          if (t) {
            q();
            const _ = t;
            p(_.$$.fragment, 1, 0, () => {
              l(_, 1);
            }),
              b();
          }
          a
            ? ((t = new a($())),
              m(t.$$.fragment),
              u(t.$$.fragment, 1),
              c(t, n.parentNode, n))
            : (t = null);
        }
      },
      i(e) {
        f || (u(s.$$.fragment, e), t && u(t.$$.fragment, e), (f = !0));
      },
      o(e) {
        p(s.$$.fragment, e), t && p(t.$$.fragment, e), (f = !1);
      },
      d(e) {
        l(s, e), e && w(o), e && w(n), t && l(t, e);
      },
    }
  );
}
class I extends j {
  constructor(s) {
    super();
    k(this, s, null, C, y, {});
  }
}
export { I as default };
