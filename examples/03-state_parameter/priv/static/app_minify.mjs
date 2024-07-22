;(() => {
  var l = class {
      withFields(t) {
        let r = Object.keys(this).map((n) => (n in t ? t[n] : this[n]))
        return new this.constructor(...r)
      }
    },
    b = class {
      static fromArray(t, r) {
        let n = r || new U()
        for (let i = t.length - 1; i >= 0; --i) n = new R(t[i], n)
        return n
      }
      [Symbol.iterator]() {
        return new Z(this)
      }
      toArray() {
        return [...this]
      }
      atLeastLength(t) {
        for (let r of this) {
          if (t <= 0) return !0
          t--
        }
        return t <= 0
      }
      hasLength(t) {
        for (let r of this) {
          if (t <= 0) return !1
          t--
        }
        return t === 0
      }
      countLength() {
        let t = 0
        for (let r of this) t++
        return t
      }
    }
  function u(e, t) {
    return b.fromArray(e, t)
  }
  var Z = class {
      #e
      constructor(t) {
        this.#e = t
      }
      next() {
        if (this.#e instanceof U) return { done: !0 }
        {
          let { head: t, tail: r } = this.#e
          return (this.#e = r), { value: t, done: !1 }
        }
      }
    },
    U = class extends b {},
    R = class extends b {
      constructor(t, r) {
        super(), (this.head = t), (this.tail = r)
      }
    }
  function S(e, t, r, n, i, o) {
    let s = new globalThis.Error(i)
    ;(s.gleam_error = e), (s.module = t), (s.line = r), (s.fn = n)
    for (let _ in o) s[_] = o[_]
    return s
  }
  var k = class extends l {
      constructor(t) {
        super(), (this[0] = t)
      }
    },
    O = class extends l {}
  function z(e, t) {
    for (;;) {
      let r = e,
        n = t
      if (r.hasLength(0)) return
      {
        let i = r.head,
          o = r.tail
        n(i), (e = o), (t = n)
      }
    }
  }
  var Rr = new DataView(new ArrayBuffer(8))
  var ct = 5,
    re = Math.pow(2, ct),
    Fr = re - 1,
    Gr = re / 2,
    Wr = re / 4
  function xe(e) {
    console.log(e)
  }
  function ne(e) {
    return xe(e)
  }
  function ie(e, t) {
    return t(e), e
  }
  function c() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0)
  }
  var C = class extends l {
    constructor(t, r) {
      super(), (this.id = t), (this.tag = r)
    }
  }
  function X() {
    return new C("document", "")
  }
  function we() {
    return new C("_drag_", "")
  }
  function $e(e) {
    return new C(e, "")
  }
  function N(e, t) {
    let r = c(),
      n = new C(r, e)
    return ie(n, (i) => p(i, t))
  }
  var wt = "_TEXT_"
  function K(e) {
    let t = c(),
      r = new C(t, wt)
    return ie(r, (n) => p(n, e))
  }
  function ue(e) {
    return new d("click", e)
  }
  function ge(e) {
    return new d("mousemove", e)
  }
  function ye(e) {
    return new d("mouseup", e)
  }
  function be(e) {
    return new d("keydown", e)
  }
  function ke() {
    let e = X()
    a(e, u([be(Oe)]))
  }
  var Le = "_HTML_"
  String.prototype.smartSplit = function (e) {
    return this.split(e).filter((t) => t.length > 0)
  }
  Array.prototype.toList = function () {
    return b.fromArray(this)
  }
  function ve() {
    ;(globalThis.state_map = new Map()),
      (globalThis.parameter_component_map = new Map()),
      (globalThis.state_parameter_last_value_map = new Map()),
      (globalThis.state_listener = new Map()),
      (globalThis.reference_map = new Map()),
      (globalThis.hotkey_key_map = new Map()),
      (globalThis.hotkey_id_map = new Map()),
      (globalThis.hotkey_listener = new Map())
  }
  function yt(e) {
    document.getElementById("_unrendered_").appendChild(e)
  }
  function oe(e, t) {
    let r = p(e)
    document.getElementById(t).appendChild(r)
  }
  function p(e, t) {
    if (e.id === "document") return document
    if (e.id === Le) {
      let i = document.createElement(Le)
      return i.insertAdjacentHTML("beforeend", e.tag), i
    }
    let r = document.getElementById(e.id)
    if (r) return r
    let n = document.createElement(e.tag)
    n.setAttribute("id", e.id)
    try {
      let i = t.toArray().map(p)
      n.replaceChildren(...i)
    } catch {
      let o = document.createTextNode(t.replace(" ", "\xA0"))
      n.replaceChildren(o)
    }
    return yt(n), n
  }
  function Ae(e, t) {
    return globalThis.parameter_component_map.set(t, e.id), e
  }
  function Te(e) {
    return globalThis.parameter_component_map.get(e)
  }
  function Ee(e, t, r) {
    let n = p(e)
    return Se(n, t, r, !1), e
  }
  function Ce(e, t, r) {
    let n = p(e)
    return Se(n, t, r, !0), e
  }
  function Se(e, t, r, n) {
    if (r === "" || r.length === 0) {
      e.removeAttribute(t)
      return
    }
    switch (t) {
      case "class":
        r.smartSplit(" ").forEach((i) => {
          if (n) {
            e.classList.remove(i)
            return
          }
          e.classList.add(i)
        })
        return
      case "style":
        r.smartSplit(";").forEach((i) => {
          if (!i.includes(":")) {
            e.style.setProperty(i, "")
            return
          }
          let o = i.smartSplit(":")
          if (n) {
            e.style.removeProperty(o[0])
            return
          }
          e.style.setProperty(o[0], o[1].trim())
        })
        return
      default:
        if (n) {
          e.removeAttribute(t)
          return
        }
        e.setAttribute(t, r)
        return
    }
  }
  function je(e, t, r) {
    return p(e).addEventListener(t, r), e
  }
  function ze(e, t, r) {
    return p(e).removeEventListener(t, r), e
  }
  function B(e, t) {
    let r = p(e),
      n = t.toArray().map(p)
    return r.replaceChildren(...n), e
  }
  function qe(e, t) {
    ;(globalThis.state_listener.get(e) || []).forEach((r) => r(t)), Y(e, t)
  }
  function Y(e, t) {
    globalThis.state_map.set(e, t)
  }
  function Ie(e) {
    return globalThis.state_map.get(e)
  }
  function Me(e, t) {
    let r = globalThis.state_listener.get(e) || []
    globalThis.state_listener.set(e, [t, ...r])
  }
  function le(e, t) {
    globalThis.state_parameter_last_value_map.set(e, t)
  }
  function Ne(e) {
    return globalThis.state_parameter_last_value_map.get(e)
  }
  function bt(e) {
    let t = e.ctrlKey || e.metaKey,
      r = e.shiftKey,
      n = e.altKey
    if (e.modifiers) {
      let i = e.modifiers.toArray().map((o) => o.constructor.name)
      ;(t = i.includes("Short")), (r = i.includes("Shift")), (n = i.includes("Alt"))
    }
    return e.code + ";" + (r ? "Shift," : "") + (n ? "Alt," : "") + (t ? "Short," : "")
  }
  function Oe(e) {
    let t = bt(e),
      r = globalThis.hotkey_key_map.get(t) || []
    r.length !== 0 && (e.preventDefault(), r.forEach((n) => globalThis.hotkey_listener.get(n)(e)))
  }
  function Be(e) {
    let t = document.getElementById("_drag_")
    t.style.setProperty("--mouse-x", e.clientX + "px"),
      t.style.setProperty("--mouse-y", e.clientY + "px")
  }
  var A = class extends l {
      constructor(t, r) {
        super(), (this.name = t), (this.value = r)
      }
    },
    d = class extends l {
      constructor(t, r) {
        super(), (this.name = t), (this.callback = r)
      }
    },
    se = class extends l {
      constructor(t, r) {
        super(), (this.name = t), (this.callback = r)
      }
    },
    T = class extends l {
      constructor(t, r) {
        super(), (this.id = t), (this[1] = r)
      }
    }
  function q(e, t) {
    return (
      z(t, (r) => {
        if (r instanceof A) {
          let n = r.name,
            i = r.value
          return Ce(e, n, i)
        } else if (r instanceof d) {
          let n = r.name,
            i = r.callback
          return ze(e, n, i)
        } else
          throw S(
            "panic",
            "novdom/internals/parameter",
            47,
            "",
            "Can only remove attributes and listeners",
            {}
          )
      }),
      e
    )
  }
  function a(e, t) {
    return (
      z(t, (r) => {
        if (r instanceof A) {
          let n = r.name,
            i = r.value
          return Ee(e, n, i)
        } else if (r instanceof d) {
          let n = r.name,
            i = r.callback
          return je(e, n, i)
        } else if (r instanceof se) {
          let n = r.name,
            i = r.callback
          throw S("todo", "novdom/internals/parameter", 26, "", "Implement add_modifier", {})
        } else {
          let n = r.id,
            i = r[1],
            s = Ae(e, n)
          return a(s, i)
        }
      }),
      e
    )
  }
  function I(e) {
    let r = Te(e)
    return $e(r)
  }
  function h(e) {
    return new A("class", e)
  }
  var D = class extends l {
    constructor(t) {
      super(), (this.state_id = t)
    }
  }
  function De(e) {
    return new D(e)
  }
  function f(e) {
    return Ie(e.state_id)
  }
  function fe(e) {
    let t = c()
    return Y(t, e), new D(t)
  }
  function Pe(e, t) {
    return Y(e, t), new D(e)
  }
  function P(e, t) {
    return qe(e.state_id, t)
  }
  function g(e, t) {
    return Me(e.state_id, t)
  }
  function V(e) {
    return z(e, (t) => {
      if (!(t instanceof A)) {
        if (t instanceof d) return
        throw S(
          "panic",
          "novdom/state_parameter",
          146,
          "",
          "Only attributes and listeners are allowed",
          {}
        )
      }
    })
  }
  function ae(e, t, r) {
    V(r)
    let n = c()
    g(e, (s) => {
      let _ = I(n)
      t(s) ? a(_, r) : q(_, r)
    })
    let o = t(f(e)) ? r : u([])
    return new T(n, o)
  }
  function Re(e, t, r, n) {
    V(n)
    let i = c(),
      o = (x, m) => {
        let E = I(i)
        r(x, m) ? a(E, n) : q(E, n)
      }
    g(e, (x) => {
      let m = f(t)
      return o(x, m)
    }),
      g(t, (x) => {
        let m = f(e)
        return o(m, x)
      })
    let y = r(f(e), f(t)) ? n : u([])
    return new T(i, y)
  }
  function Fe(e, t, r, n) {
    V(r), V(n)
    let i = c()
    g(e, (_) => {
      let y = I(i)
      if (t(_)) {
        let E = q(y, n)
        a(E, r)
      } else {
        let E = q(y, r)
        a(E, n)
      }
    })
    let s = t(f(e)) ? r : n
    return new T(i, s)
  }
  function Ge(e, t) {
    let r = c()
    g(e, (o) => {
      let s = I(r),
        _ = Ne(r),
        y = t(o),
        m = q(s, _)
      a(m, y), le(r, y)
    })
    let i = t(f(e))
    return le(r, i), new T(r, i)
  }
  var Ot = "_STATE_COMPONENT_"
  function He(e, t) {
    let r = t(f(e)),
      n = N(Ot, r)
    return (
      g(e, (o) => {
        B(n, t(o))
      }),
      n
    )
  }
  var Xe = "_DRAGGABLE_"
  function At() {
    let e = De(Xe)
    return () => P(e, new O())
  }
  function Ke() {
    let e = Pe(Xe, new O()),
      t = X()
    a(
      t,
      u([
        ye((n) => {
          let i = f(e)
          if (i instanceof k && !i[0].droppable) {
            let o = i[0]
            return o.cancel(o, At())
          } else return
        }),
        ge((n) => Be(n)),
      ])
    )
    let r = we()
    return B(
      r,
      u([
        He(e, (n) => {
          if (n instanceof k) {
            let i = n[0]
            return u([i.preview])
          } else return u([])
        }),
      ])
    )
  }
  function Ye(e) {
    ve(), Ke(), ke()
    let t = e()
    return oe(t, "_app_")
  }
  var Ct = "div"
  function J(e, t) {
    let r = N(Ct, t)
    return a(r, e)
  }
  function Mo() {
    return Ye(() => {
      let e = fe(!1),
        t = fe(!1)
      return J(
        u([
          h("p-5"),
          ae(e, (r) => r, u([h("rounded-3xl")])),
          Re(e, t, (r, n) => r && n, u([h("scale-150")])),
          Fe(e, (r) => r, u([h("bg-red-100")]), u([h("bg-blue-100")])),
          Ge(e, (r) => (r ? u([h("text-black")]) : u([h("text-white")]))),
        ]),
        u([
          J(
            u([
              h("p-2 bg-green-200 select-none"),
              ue((r) => {
                ne("Button clicked!"), P(e, !f(e))
              }),
            ]),
            u([K("current value: nothind")])
          ),
          J(
            u([
              h("p-2 bg-yellow-200 select-none"),
              ue((r) => {
                ne("Button2 clicked!"), P(t, !f(t))
              }),
            ]),
            u([K("current value: nothind")])
          ),
        ])
      )
    })
  }
})()
