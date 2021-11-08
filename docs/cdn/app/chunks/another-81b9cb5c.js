import {
  S as v,
  i as g,
  s as x,
  e as n,
  t as E,
  c as l,
  a as d,
  g as b,
  d as o,
  b as m,
  f as y,
  I as h,
  V as c,
} from './vendor-3470fd39.js';
function A(_) {
  let e, t, a, i;
  return {
    c() {
      (e = n('section')), (t = n('h1')), (a = n('a')), (i = E(u)), this.h();
    },
    l(s) {
      e = l(s, 'SECTION', {});
      var r = d(e);
      t = l(r, 'H1', { id: !0 });
      var f = d(t);
      a = l(f, 'A', { href: !0 });
      var p = d(a);
      (i = b(p, u)), p.forEach(o), f.forEach(o), r.forEach(o), this.h();
    },
    h() {
      m(a, 'href', '#title'), m(t, 'id', 'title');
    },
    m(s, r) {
      y(s, e, r), h(e, t), h(t, a), h(a, i);
    },
    p: c,
    i: c,
    o: c,
    d(s) {
      s && o(e);
    },
  };
}
const S = {
    title: 'Another page with a massively long title and more stuff here',
    description: 'How to make pages',
    published: !0,
    order: 2,
  },
  { title: u, description: C, published: H, order: I } = S;
class j extends v {
  constructor(e) {
    super();
    g(this, e, null, A, x, {});
  }
}
export { j as default, S as metadata };
