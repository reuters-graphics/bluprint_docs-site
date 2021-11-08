import {
  S as g,
  i as v,
  s as x,
  e as n,
  t as E,
  c as d,
  a as c,
  g as b,
  d as o,
  b as u,
  f as S,
  I as l,
  V as h,
} from './vendor-3470fd39.js';
function y(_) {
  let e, t, a, i;
  return {
    c() {
      (e = n('section')), (t = n('h1')), (a = n('a')), (i = E(m)), this.h();
    },
    l(s) {
      e = d(s, 'SECTION', {});
      var r = c(e);
      t = d(r, 'H1', { id: !0 });
      var p = c(t);
      a = d(p, 'A', { href: !0 });
      var f = c(a);
      (i = b(f, m)), f.forEach(o), p.forEach(o), r.forEach(o), this.h();
    },
    h() {
      u(a, 'href', '#title'), u(t, 'id', 'title');
    },
    m(s, r) {
      S(s, e, r), l(e, t), l(t, a), l(a, i);
    },
    p: h,
    i: h,
    o: h,
    d(s) {
      s && o(e);
    },
  };
}
const C = {
    title: 'Nested page',
    description: 'How to make pages',
    published: !0,
    order: 2,
  },
  { title: m, description: I, published: N, order: j } = C;
class k extends g {
  constructor(e) {
    super();
    v(this, e, null, y, x, {});
  }
}
export { k as default, C as metadata };
