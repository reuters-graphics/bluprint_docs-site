import {
  S as _,
  i as y,
  s as x,
  e as i,
  t as v,
  c as n,
  a as d,
  g as E,
  d as r,
  b as l,
  f as b,
  I as h,
  V as u,
} from './vendor-ae834d0e.js';
function H(p) {
  let e, t, s, c;
  return {
    c() {
      (e = i('section')),
        (t = i('h1')),
        (s = i('a')),
        (c = v('Welcome to your docs site')),
        this.h();
    },
    l(o) {
      e = n(o, 'SECTION', { class: !0 });
      var a = d(e);
      t = n(a, 'H1', { id: !0 });
      var m = d(t);
      s = n(m, 'A', { href: !0 });
      var f = d(s);
      (c = E(f, 'Welcome to your docs site')),
        f.forEach(r),
        m.forEach(r),
        a.forEach(r),
        this.h();
    },
    h() {
      l(s, 'href', '#welcome-to-your-docs-site'),
        l(t, 'id', 'welcome-to-your-docs-site'),
        l(e, 'class', 'body-text');
    },
    m(o, a) {
      b(o, e, a), h(e, t), h(t, s), h(s, c);
    },
    p: u,
    i: u,
    o: u,
    d(o) {
      o && r(e);
    },
  };
}
const g = {
  title: 'Home',
  description: 'Reuters Graphics docs site',
  published: !0,
};
class w extends _ {
  constructor(e) {
    super();
    y(this, e, null, H, x, {});
  }
}
export { w as default, g as metadata };
