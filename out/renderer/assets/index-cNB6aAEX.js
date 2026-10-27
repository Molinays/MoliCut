const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./ExportDialog-0vXN7K87.js","./Modal-Cdrp0PR3.js","./DebugPanel-BaFBZD1N.js","./SettingsModal-BdRXctdu.js"])))=>i.map(i=>d[i]);
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape$1(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape$1("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React$2 = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok$1 = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok$1.transition, d = C;
  try {
    if (ok$1.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok$1.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok$1.transition;
  try {
    ok$1.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok$1.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok$1.transition;
    ok$1.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok$1.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok$1.transition, c = C;
    try {
      ok$1.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok$1.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err2) {
    console.error(err2);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const isString$1 = (obj) => typeof obj === "string";
const defer = () => {
  let res;
  let rej;
  const promise = new Promise((resolve, reject) => {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
};
const makeString = (object) => {
  if (object == null) return "";
  return "" + object;
};
const copy = (a, s, t2) => {
  a.forEach((m2) => {
    if (s[m2]) t2[m2] = s[m2];
  });
};
const lastOfPathSeparatorRegExp = /###/g;
const cleanKey = (key) => key && key.indexOf("###") > -1 ? key.replace(lastOfPathSeparatorRegExp, ".") : key;
const canNotTraverseDeeper = (object) => !object || isString$1(object);
const getLastOfPath = (object, path, Empty) => {
  const stack = !isString$1(path) ? path : path.split(".");
  let stackIndex = 0;
  while (stackIndex < stack.length - 1) {
    if (canNotTraverseDeeper(object)) return {};
    const key = cleanKey(stack[stackIndex]);
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
    ++stackIndex;
  }
  if (canNotTraverseDeeper(object)) return {};
  return {
    obj: object,
    k: cleanKey(stack[stackIndex])
  };
};
const setPath = (object, path, newValue) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path, Object);
  if (obj !== void 0 || path.length === 1) {
    obj[k2] = newValue;
    return;
  }
  let e = path[path.length - 1];
  let p2 = path.slice(0, path.length - 1);
  let last = getLastOfPath(object, p2, Object);
  while (last.obj === void 0 && p2.length) {
    e = `${p2[p2.length - 1]}.${e}`;
    p2 = p2.slice(0, p2.length - 1);
    last = getLastOfPath(object, p2, Object);
    if (last && last.obj && typeof last.obj[`${last.k}.${e}`] !== "undefined") {
      last.obj = void 0;
    }
  }
  last.obj[`${last.k}.${e}`] = newValue;
};
const pushPath = (object, path, newValue, concat) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path, Object);
  obj[k2] = obj[k2] || [];
  obj[k2].push(newValue);
};
const getPath = (object, path) => {
  const {
    obj,
    k: k2
  } = getLastOfPath(object, path);
  if (!obj) return void 0;
  return obj[k2];
};
const getPathWithDefaults = (data, defaultData, key) => {
  const value = getPath(data, key);
  if (value !== void 0) {
    return value;
  }
  return getPath(defaultData, key);
};
const deepExtend = (target, source, overwrite) => {
  for (const prop in source) {
    if (prop !== "__proto__" && prop !== "constructor") {
      if (prop in target) {
        if (isString$1(target[prop]) || target[prop] instanceof String || isString$1(source[prop]) || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
};
const regexEscape = (str) => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const escape = (data) => {
  if (isString$1(data)) {
    return data.replace(/[&<>"'\/]/g, (s) => _entityMap[s]);
  }
  return data;
};
class RegExpCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.regExpMap = /* @__PURE__ */ new Map();
    this.regExpQueue = [];
  }
  getRegExp(pattern) {
    const regExpFromCache = this.regExpMap.get(pattern);
    if (regExpFromCache !== void 0) {
      return regExpFromCache;
    }
    const regExpNew = new RegExp(pattern);
    if (this.regExpQueue.length === this.capacity) {
      this.regExpMap.delete(this.regExpQueue.shift());
    }
    this.regExpMap.set(pattern, regExpNew);
    this.regExpQueue.push(pattern);
    return regExpNew;
  }
}
const chars = [" ", ",", "?", "!", ";"];
const looksLikeObjectPathRegExpCache = new RegExpCache(20);
const looksLikeObjectPath = (key, nsSeparator, keySeparator) => {
  nsSeparator = nsSeparator || "";
  keySeparator = keySeparator || "";
  const possibleChars = chars.filter((c) => nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0);
  if (possibleChars.length === 0) return true;
  const r2 = looksLikeObjectPathRegExpCache.getRegExp(`(${possibleChars.map((c) => c === "?" ? "\\?" : c).join("|")})`);
  let matched = !r2.test(key);
  if (!matched) {
    const ki2 = key.indexOf(keySeparator);
    if (ki2 > 0 && !r2.test(key.substring(0, ki2))) {
      matched = true;
    }
  }
  return matched;
};
const deepFind = function(obj, path) {
  let keySeparator = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : ".";
  if (!obj) return void 0;
  if (obj[path]) return obj[path];
  const tokens = path.split(keySeparator);
  let current = obj;
  for (let i = 0; i < tokens.length; ) {
    if (!current || typeof current !== "object") {
      return void 0;
    }
    let next;
    let nextPath = "";
    for (let j = i; j < tokens.length; ++j) {
      if (j !== i) {
        nextPath += keySeparator;
      }
      nextPath += tokens[j];
      next = current[nextPath];
      if (next !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof next) > -1 && j < tokens.length - 1) {
          continue;
        }
        i += j - i + 1;
        break;
      }
    }
    current = next;
  }
  return current;
};
const getCleanedCode = (code) => code && code.replace("_", "-");
const consoleLogger = {
  type: "logger",
  log(args) {
    this.output("log", args);
  },
  warn(args) {
    this.output("warn", args);
  },
  error(args) {
    this.output("error", args);
  },
  output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};
class Logger {
  constructor(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.init(concreteLogger, options);
  }
  init(concreteLogger) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.prefix = options.prefix || "i18next:";
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.forward(args, "log", "", true);
  }
  warn() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.forward(args, "warn", "", true);
  }
  error() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.forward(args, "error", "");
  }
  deprecate() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.forward(args, "warn", "WARNING DEPRECATED: ", true);
  }
  forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (isString$1(args[0])) args[0] = `${prefix}${this.prefix} ${args[0]}`;
    return this.logger[lvl](args);
  }
  create(moduleName) {
    return new Logger(this.logger, {
      ...{
        prefix: `${this.prefix}:${moduleName}:`
      },
      ...this.options
    });
  }
  clone(options) {
    options = options || this.options;
    options.prefix = options.prefix || this.prefix;
    return new Logger(this.logger, options);
  }
}
var baseLogger = new Logger();
class EventEmitter {
  constructor() {
    this.observers = {};
  }
  on(events, listener) {
    events.split(" ").forEach((event) => {
      if (!this.observers[event]) this.observers[event] = /* @__PURE__ */ new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }
  off(event, listener) {
    if (!this.observers[event]) return;
    if (!listener) {
      delete this.observers[event];
      return;
    }
    this.observers[event].delete(listener);
  }
  emit(event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach((_ref) => {
        let [observer, numTimesAdded] = _ref;
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }
    if (this.observers["*"]) {
      const cloned = Array.from(this.observers["*"].entries());
      cloned.forEach((_ref2) => {
        let [observer, numTimesAdded] = _ref2;
        for (let i = 0; i < numTimesAdded; i++) {
          observer.apply(observer, [event, ...args]);
        }
      });
    }
  }
}
class ResourceStore extends EventEmitter {
  constructor(data) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      ns: ["translation"],
      defaultNS: "translation"
    };
    super();
    this.data = data || {};
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    if (this.options.ignoreJSONStructure === void 0) {
      this.options.ignoreJSONStructure = true;
    }
  }
  addNamespaces(ns) {
    if (this.options.ns.indexOf(ns) < 0) {
      this.options.ns.push(ns);
    }
  }
  removeNamespaces(ns) {
    const index = this.options.ns.indexOf(ns);
    if (index > -1) {
      this.options.ns.splice(index, 1);
    }
  }
  getResource(lng, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const ignoreJSONStructure = options.ignoreJSONStructure !== void 0 ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let path;
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
    } else {
      path = [lng, ns];
      if (key) {
        if (Array.isArray(key)) {
          path.push(...key);
        } else if (isString$1(key) && keySeparator) {
          path.push(...key.split(keySeparator));
        } else {
          path.push(key);
        }
      }
    }
    const result = getPath(this.data, path);
    if (!result && !ns && !key && lng.indexOf(".") > -1) {
      lng = path[0];
      ns = path[1];
      key = path.slice(2).join(".");
    }
    if (result || !ignoreJSONStructure || !isString$1(key)) return result;
    return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
  }
  addResource(lng, ns, key, value) {
    let options = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : {
      silent: false
    };
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      value = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    setPath(this.data, path, value);
    if (!options.silent) this.emit("added", lng, ns, key, value);
  }
  addResources(lng, ns, resources) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {
      silent: false
    };
    for (const m2 in resources) {
      if (isString$1(resources[m2]) || Array.isArray(resources[m2])) this.addResource(lng, ns, m2, resources[m2], {
        silent: true
      });
    }
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  addResourceBundle(lng, ns, resources, deep, overwrite) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {
      silent: false,
      skipCopy: false
    };
    let path = [lng, ns];
    if (lng.indexOf(".") > -1) {
      path = lng.split(".");
      deep = resources;
      resources = ns;
      ns = path[1];
    }
    this.addNamespaces(ns);
    let pack = getPath(this.data, path) || {};
    if (!options.skipCopy) resources = JSON.parse(JSON.stringify(resources));
    if (deep) {
      deepExtend(pack, resources, overwrite);
    } else {
      pack = {
        ...pack,
        ...resources
      };
    }
    setPath(this.data, path, pack);
    if (!options.silent) this.emit("added", lng, ns, resources);
  }
  removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);
    this.emit("removed", lng, ns);
  }
  hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== void 0;
  }
  getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;
    if (this.options.compatibilityAPI === "v1") return {
      ...{},
      ...this.getResource(lng, ns)
    };
    return this.getResource(lng, ns);
  }
  getDataByLanguage(lng) {
    return this.data[lng];
  }
  hasLanguageSomeTranslations(lng) {
    const data = this.getDataByLanguage(lng);
    const n2 = data && Object.keys(data) || [];
    return !!n2.find((v2) => data[v2] && Object.keys(data[v2]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var postProcessor = {
  processors: {},
  addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle(processors, value, key, options, translator) {
    processors.forEach((processor) => {
      if (this.processors[processor]) value = this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};
const checkedLoadedFor = {};
class Translator extends EventEmitter {
  constructor(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    super();
    copy(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], services, this);
    this.options = options;
    if (this.options.keySeparator === void 0) {
      this.options.keySeparator = ".";
    }
    this.logger = baseLogger.create("translator");
  }
  changeLanguage(lng) {
    if (lng) this.language = lng;
  }
  exists(key) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    if (key === void 0 || key === null) {
      return false;
    }
    const resolved = this.resolve(key, options);
    return resolved && resolved.res !== void 0;
  }
  extractFromKey(key, options) {
    let nsSeparator = options.nsSeparator !== void 0 ? options.nsSeparator : this.options.nsSeparator;
    if (nsSeparator === void 0) nsSeparator = ":";
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    let namespaces = options.ns || this.options.defaultNS || [];
    const wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
    const seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
    if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
      const m2 = key.match(this.interpolator.nestingRegexp);
      if (m2 && m2.length > 0) {
        return {
          key,
          namespaces: isString$1(namespaces) ? [namespaces] : namespaces
        };
      }
      const parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    return {
      key,
      namespaces: isString$1(namespaces) ? [namespaces] : namespaces
    };
  }
  translate(keys, options, lastKey) {
    if (typeof options !== "object" && this.options.overloadTranslationOptionHandler) {
      options = this.options.overloadTranslationOptionHandler(arguments);
    }
    if (typeof options === "object") options = {
      ...options
    };
    if (!options) options = {};
    if (keys === void 0 || keys === null) return "";
    if (!Array.isArray(keys)) keys = [String(keys)];
    const returnDetails = options.returnDetails !== void 0 ? options.returnDetails : this.options.returnDetails;
    const keySeparator = options.keySeparator !== void 0 ? options.keySeparator : this.options.keySeparator;
    const {
      key,
      namespaces
    } = this.extractFromKey(keys[keys.length - 1], options);
    const namespace = namespaces[namespaces.length - 1];
    const lng = options.lng || this.language;
    const appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === "cimode") {
      if (appendNamespaceToCIMode) {
        const nsSeparator = options.nsSeparator || this.options.nsSeparator;
        if (returnDetails) {
          return {
            res: `${namespace}${nsSeparator}${key}`,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace,
            usedParams: this.getUsedParamsDetails(options)
          };
        }
        return `${namespace}${nsSeparator}${key}`;
      }
      if (returnDetails) {
        return {
          res: key,
          usedKey: key,
          exactUsedKey: key,
          usedLng: lng,
          usedNS: namespace,
          usedParams: this.getUsedParamsDetails(options)
        };
      }
      return key;
    }
    const resolved = this.resolve(keys, options);
    let res = resolved && resolved.res;
    const resUsedKey = resolved && resolved.usedKey || key;
    const resExactUsedKey = resolved && resolved.exactUsedKey || key;
    const resType = Object.prototype.toString.apply(res);
    const noObject = ["[object Number]", "[object Function]", "[object RegExp]"];
    const joinArrays = options.joinArrays !== void 0 ? options.joinArrays : this.options.joinArrays;
    const handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
    const handleAsObject = !isString$1(res) && typeof res !== "boolean" && typeof res !== "number";
    if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(isString$1(joinArrays) && Array.isArray(res))) {
      if (!options.returnObjects && !this.options.returnObjects) {
        if (!this.options.returnedObjectHandler) {
          this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        }
        const r2 = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, {
          ...options,
          ns: namespaces
        }) : `key '${key} (${this.language})' returned an object instead of string.`;
        if (returnDetails) {
          resolved.res = r2;
          resolved.usedParams = this.getUsedParamsDetails(options);
          return resolved;
        }
        return r2;
      }
      if (keySeparator) {
        const resTypeIsArray = Array.isArray(res);
        const copy2 = resTypeIsArray ? [] : {};
        const newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
        for (const m2 in res) {
          if (Object.prototype.hasOwnProperty.call(res, m2)) {
            const deepKey = `${newKeyToUse}${keySeparator}${m2}`;
            copy2[m2] = this.translate(deepKey, {
              ...options,
              ...{
                joinArrays: false,
                ns: namespaces
              }
            });
            if (copy2[m2] === deepKey) copy2[m2] = res[m2];
          }
        }
        res = copy2;
      }
    } else if (handleAsObjectInI18nFormat && isString$1(joinArrays) && Array.isArray(res)) {
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options, lastKey);
    } else {
      let usedDefault = false;
      let usedKey = false;
      const needsPluralHandling = options.count !== void 0 && !isString$1(options.count);
      const hasDefaultValue = Translator.hasDefaultValue(options);
      const defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : "";
      const defaultValueSuffixOrdinalFallback = options.ordinal && needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, {
        ordinal: false
      }) : "";
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const defaultValue = needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] || options[`defaultValue${defaultValueSuffix}`] || options[`defaultValue${defaultValueSuffixOrdinalFallback}`] || options.defaultValue;
      if (!this.isValidLookup(res) && hasDefaultValue) {
        usedDefault = true;
        res = defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }
      const missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
      const resForMissing = missingKeyNoValueFallbackToKey && usedKey ? void 0 : res;
      const updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
      if (usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? "updateKey" : "missingKey", lng, namespace, key, updateMissing ? defaultValue : res);
        if (keySeparator) {
          const fk2 = this.resolve(key, {
            ...options,
            keySeparator: false
          });
          if (fk2 && fk2.res) this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let lngs = [];
        const fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
          for (let i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === "all") {
          lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
        } else {
          lngs.push(options.lng || this.language);
        }
        const send = (l2, k2, specificDefaultValue) => {
          const defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
          if (this.options.missingKeyHandler) {
            this.options.missingKeyHandler(l2, namespace, k2, defaultForMissing, updateMissing, options);
          } else if (this.backendConnector && this.backendConnector.saveMissing) {
            this.backendConnector.saveMissing(l2, namespace, k2, defaultForMissing, updateMissing, options);
          }
          this.emit("missingKey", l2, namespace, k2, res);
        };
        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && needsPluralHandling) {
            lngs.forEach((language) => {
              const suffixes = this.pluralResolver.getSuffixes(language, options);
              if (needsZeroSuffixLookup && options[`defaultValue${this.options.pluralSeparator}zero`] && suffixes.indexOf(`${this.options.pluralSeparator}zero`) < 0) {
                suffixes.push(`${this.options.pluralSeparator}zero`);
              }
              suffixes.forEach((suffix) => {
                send([language], key + suffix, options[`defaultValue${suffix}`] || defaultValue);
              });
            });
          } else {
            send(lngs, key, defaultValue);
          }
        }
      }
      res = this.extendTranslation(res, keys, options, resolved, lastKey);
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = `${namespace}:${key}`;
      if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
        if (this.options.compatibilityAPI !== "v1") {
          res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${namespace}:${key}` : key, usedDefault ? res : void 0);
        } else {
          res = this.options.parseMissingKeyHandler(res);
        }
      }
    }
    if (returnDetails) {
      resolved.res = res;
      resolved.usedParams = this.getUsedParamsDetails(options);
      return resolved;
    }
    return res;
  }
  extendTranslation(res, key, options, resolved, lastKey) {
    var _this = this;
    if (this.i18nFormat && this.i18nFormat.parse) {
      res = this.i18nFormat.parse(res, {
        ...this.options.interpolation.defaultVariables,
        ...options
      }, options.lng || this.language || resolved.usedLng, resolved.usedNS, resolved.usedKey, {
        resolved
      });
    } else if (!options.skipInterpolation) {
      if (options.interpolation) this.interpolator.init({
        ...options,
        ...{
          interpolation: {
            ...this.options.interpolation,
            ...options.interpolation
          }
        }
      });
      const skipOnVariables = isString$1(res) && (options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let nestBef;
      if (skipOnVariables) {
        const nb2 = res.match(this.interpolator.nestingRegexp);
        nestBef = nb2 && nb2.length;
      }
      let data = options.replace && !isString$1(options.replace) ? options.replace : options;
      if (this.options.interpolation.defaultVariables) data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
      res = this.interpolator.interpolate(res, data, options.lng || this.language || resolved.usedLng, options);
      if (skipOnVariables) {
        const na = res.match(this.interpolator.nestingRegexp);
        const nestAft = na && na.length;
        if (nestBef < nestAft) options.nest = false;
      }
      if (!options.lng && this.options.compatibilityAPI !== "v1" && resolved && resolved.res) options.lng = this.language || resolved.usedLng;
      if (options.nest !== false) res = this.interpolator.nest(res, function() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (lastKey && lastKey[0] === args[0] && !options.context) {
          _this.logger.warn(`It seems you are nesting recursively key: ${args[0]} in key: ${key[0]}`);
          return null;
        }
        return _this.translate(...args, key);
      }, options);
      if (options.interpolation) this.interpolator.reset();
    }
    const postProcess = options.postProcess || this.options.postProcess;
    const postProcessorNames = isString$1(postProcess) ? [postProcess] : postProcess;
    if (res !== void 0 && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? {
        i18nResolved: {
          ...resolved,
          usedParams: this.getUsedParamsDetails(options)
        },
        ...options
      } : options, this);
    }
    return res;
  }
  resolve(keys) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let found;
    let usedKey;
    let exactUsedKey;
    let usedLng;
    let usedNS;
    if (isString$1(keys)) keys = [keys];
    keys.forEach((k2) => {
      if (this.isValidLookup(found)) return;
      const extracted = this.extractFromKey(k2, options);
      const key = extracted.key;
      usedKey = key;
      let namespaces = extracted.namespaces;
      if (this.options.fallbackNS) namespaces = namespaces.concat(this.options.fallbackNS);
      const needsPluralHandling = options.count !== void 0 && !isString$1(options.count);
      const needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && this.pluralResolver.shouldUseIntlApi();
      const needsContextHandling = options.context !== void 0 && (isString$1(options.context) || typeof options.context === "number") && options.context !== "";
      const codes = options.lngs ? options.lngs : this.languageUtils.toResolveHierarchy(options.lng || this.language, options.fallbackLng);
      namespaces.forEach((ns) => {
        if (this.isValidLookup(found)) return;
        usedNS = ns;
        if (!checkedLoadedFor[`${codes[0]}-${ns}`] && this.utils && this.utils.hasLoadedNamespace && !this.utils.hasLoadedNamespace(usedNS)) {
          checkedLoadedFor[`${codes[0]}-${ns}`] = true;
          this.logger.warn(`key "${usedKey}" for languages "${codes.join(", ")}" won't get resolved as namespace "${usedNS}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
        }
        codes.forEach((code) => {
          if (this.isValidLookup(found)) return;
          usedLng = code;
          const finalKeys = [key];
          if (this.i18nFormat && this.i18nFormat.addLookupKeys) {
            this.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
          } else {
            let pluralSuffix;
            if (needsPluralHandling) pluralSuffix = this.pluralResolver.getSuffix(code, options.count, options);
            const zeroSuffix = `${this.options.pluralSeparator}zero`;
            const ordinalPrefix = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (needsPluralHandling) {
              finalKeys.push(key + pluralSuffix);
              if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                finalKeys.push(key + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
              }
              if (needsZeroSuffixLookup) {
                finalKeys.push(key + zeroSuffix);
              }
            }
            if (needsContextHandling) {
              const contextKey = `${key}${this.options.contextSeparator}${options.context}`;
              finalKeys.push(contextKey);
              if (needsPluralHandling) {
                finalKeys.push(contextKey + pluralSuffix);
                if (options.ordinal && pluralSuffix.indexOf(ordinalPrefix) === 0) {
                  finalKeys.push(contextKey + pluralSuffix.replace(ordinalPrefix, this.options.pluralSeparator));
                }
                if (needsZeroSuffixLookup) {
                  finalKeys.push(contextKey + zeroSuffix);
                }
              }
            }
          }
          let possibleKey;
          while (possibleKey = finalKeys.pop()) {
            if (!this.isValidLookup(found)) {
              exactUsedKey = possibleKey;
              found = this.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });
    return {
      res: found,
      usedKey,
      exactUsedKey,
      usedLng,
      usedNS
    };
  }
  isValidLookup(res) {
    return res !== void 0 && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
  }
  getResource(code, ns, key) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
    return this.resourceStore.getResource(code, ns, key, options);
  }
  getUsedParamsDetails() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const optionsKeys = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"];
    const useOptionsReplaceForData = options.replace && !isString$1(options.replace);
    let data = useOptionsReplaceForData ? options.replace : options;
    if (useOptionsReplaceForData && typeof options.count !== "undefined") {
      data.count = options.count;
    }
    if (this.options.interpolation.defaultVariables) {
      data = {
        ...this.options.interpolation.defaultVariables,
        ...data
      };
    }
    if (!useOptionsReplaceForData) {
      data = {
        ...data
      };
      for (const key of optionsKeys) {
        delete data[key];
      }
    }
    return data;
  }
  static hasDefaultValue(options) {
    const prefix = "defaultValue";
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && void 0 !== options[option]) {
        return true;
      }
    }
    return false;
  }
}
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);
class LanguageUtil {
  constructor(options) {
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create("languageUtils");
  }
  getScriptPartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return null;
    const p2 = code.split("-");
    if (p2.length === 2) return null;
    p2.pop();
    if (p2[p2.length - 1].toLowerCase() === "x") return null;
    return this.formatLanguageCode(p2.join("-"));
  }
  getLanguagePartFromCode(code) {
    code = getCleanedCode(code);
    if (!code || code.indexOf("-") < 0) return code;
    const p2 = code.split("-");
    return this.formatLanguageCode(p2[0]);
  }
  formatLanguageCode(code) {
    if (isString$1(code) && code.indexOf("-") > -1) {
      if (typeof Intl !== "undefined" && typeof Intl.getCanonicalLocales !== "undefined") {
        try {
          let formattedCode = Intl.getCanonicalLocales(code)[0];
          if (formattedCode && this.options.lowerCaseLng) {
            formattedCode = formattedCode.toLowerCase();
          }
          if (formattedCode) return formattedCode;
        } catch (e) {
        }
      }
      const specialCases = ["hans", "hant", "latn", "cyrl", "cans", "mong", "arab"];
      let p2 = code.split("-");
      if (this.options.lowerCaseLng) {
        p2 = p2.map((part) => part.toLowerCase());
      } else if (p2.length === 2) {
        p2[0] = p2[0].toLowerCase();
        p2[1] = p2[1].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize(p2[1].toLowerCase());
      } else if (p2.length === 3) {
        p2[0] = p2[0].toLowerCase();
        if (p2[1].length === 2) p2[1] = p2[1].toUpperCase();
        if (p2[0] !== "sgn" && p2[2].length === 2) p2[2] = p2[2].toUpperCase();
        if (specialCases.indexOf(p2[1].toLowerCase()) > -1) p2[1] = capitalize(p2[1].toLowerCase());
        if (specialCases.indexOf(p2[2].toLowerCase()) > -1) p2[2] = capitalize(p2[2].toLowerCase());
      }
      return p2.join("-");
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  }
  isSupportedCode(code) {
    if (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
  }
  getBestMatchFromCodes(codes) {
    if (!codes) return null;
    let found;
    codes.forEach((code) => {
      if (found) return;
      const cleanedLng = this.formatLanguageCode(code);
      if (!this.options.supportedLngs || this.isSupportedCode(cleanedLng)) found = cleanedLng;
    });
    if (!found && this.options.supportedLngs) {
      codes.forEach((code) => {
        if (found) return;
        const lngOnly = this.getLanguagePartFromCode(code);
        if (this.isSupportedCode(lngOnly)) return found = lngOnly;
        found = this.options.supportedLngs.find((supportedLng) => {
          if (supportedLng === lngOnly) return supportedLng;
          if (supportedLng.indexOf("-") < 0 && lngOnly.indexOf("-") < 0) return;
          if (supportedLng.indexOf("-") > 0 && lngOnly.indexOf("-") < 0 && supportedLng.substring(0, supportedLng.indexOf("-")) === lngOnly) return supportedLng;
          if (supportedLng.indexOf(lngOnly) === 0 && lngOnly.length > 1) return supportedLng;
        });
      });
    }
    if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
    return found;
  }
  getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === "function") fallbacks = fallbacks(code);
    if (isString$1(fallbacks)) fallbacks = [fallbacks];
    if (Array.isArray(fallbacks)) return fallbacks;
    if (!code) return fallbacks.default || [];
    let found = fallbacks[code];
    if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
    if (!found) found = fallbacks[this.formatLanguageCode(code)];
    if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
    if (!found) found = fallbacks.default;
    return found || [];
  }
  toResolveHierarchy(code, fallbackCode) {
    const fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
    const codes = [];
    const addCode = (c) => {
      if (!c) return;
      if (this.isSupportedCode(c)) {
        codes.push(c);
      } else {
        this.logger.warn(`rejecting language code not found in supportedLngs: ${c}`);
      }
    };
    if (isString$1(code) && (code.indexOf("-") > -1 || code.indexOf("_") > -1)) {
      if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code));
      if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
    } else if (isString$1(code)) {
      addCode(this.formatLanguageCode(code));
    }
    fallbackCodes.forEach((fc2) => {
      if (codes.indexOf(fc2) < 0) addCode(this.formatLanguageCode(fc2));
    });
    return codes;
  }
}
let sets = [{
  lngs: ["ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "pt", "pt-BR", "tg", "tl", "ti", "tr", "uz", "wa"],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ["af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "hi", "hu", "hy", "ia", "it", "kk", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt-PT", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo"],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ["ay", "bo", "cgg", "fa", "ht", "id", "ja", "jbo", "ka", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh"],
  nr: [1],
  fc: 3
}, {
  lngs: ["be", "bs", "cnr", "dz", "hr", "ru", "sr", "uk"],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ["ar"],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ["cs", "sk"],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ["csb", "pl"],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ["cy"],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ["fr"],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ["ga"],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ["gd"],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ["is"],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ["jv"],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ["kw"],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ["lt"],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ["lv"],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ["mk"],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ["mnk"],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ["mt"],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ["or"],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ["ro"],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ["sl"],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ["he", "iw"],
  nr: [1, 2, 20, 21],
  fc: 22
}];
let _rulesPluralsTypes = {
  1: (n2) => Number(n2 > 1),
  2: (n2) => Number(n2 != 1),
  3: (n2) => 0,
  4: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  5: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : n2 == 2 ? 2 : n2 % 100 >= 3 && n2 % 100 <= 10 ? 3 : n2 % 100 >= 11 ? 4 : 5),
  6: (n2) => Number(n2 == 1 ? 0 : n2 >= 2 && n2 <= 4 ? 1 : 2),
  7: (n2) => Number(n2 == 1 ? 0 : n2 % 10 >= 2 && n2 % 10 <= 4 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  8: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 != 8 && n2 != 11 ? 2 : 3),
  9: (n2) => Number(n2 >= 2),
  10: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 < 7 ? 2 : n2 < 11 ? 3 : 4),
  11: (n2) => Number(n2 == 1 || n2 == 11 ? 0 : n2 == 2 || n2 == 12 ? 1 : n2 > 2 && n2 < 20 ? 2 : 3),
  12: (n2) => Number(n2 % 10 != 1 || n2 % 100 == 11),
  13: (n2) => Number(n2 !== 0),
  14: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : n2 == 3 ? 2 : 3),
  15: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 % 10 >= 2 && (n2 % 100 < 10 || n2 % 100 >= 20) ? 1 : 2),
  16: (n2) => Number(n2 % 10 == 1 && n2 % 100 != 11 ? 0 : n2 !== 0 ? 1 : 2),
  17: (n2) => Number(n2 == 1 || n2 % 10 == 1 && n2 % 100 != 11 ? 0 : 1),
  18: (n2) => Number(n2 == 0 ? 0 : n2 == 1 ? 1 : 2),
  19: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 1 && n2 % 100 < 11 ? 1 : n2 % 100 > 10 && n2 % 100 < 20 ? 2 : 3),
  20: (n2) => Number(n2 == 1 ? 0 : n2 == 0 || n2 % 100 > 0 && n2 % 100 < 20 ? 1 : 2),
  21: (n2) => Number(n2 % 100 == 1 ? 1 : n2 % 100 == 2 ? 2 : n2 % 100 == 3 || n2 % 100 == 4 ? 3 : 0),
  22: (n2) => Number(n2 == 1 ? 0 : n2 == 2 ? 1 : (n2 < 0 || n2 > 10) && n2 % 10 == 0 ? 2 : 3)
};
const nonIntlVersions = ["v1", "v2", "v3"];
const intlVersions = ["v4"];
const suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
const createRules = () => {
  const rules = {};
  sets.forEach((set) => {
    set.lngs.forEach((l2) => {
      rules[l2] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
};
class PluralResolver {
  constructor(languageUtils) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create("pluralResolver");
    if ((!this.options.compatibilityJSON || intlVersions.includes(this.options.compatibilityJSON)) && (typeof Intl === "undefined" || !Intl.PluralRules)) {
      this.options.compatibilityJSON = "v3";
      this.logger.error("Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.");
    }
    this.rules = createRules();
    this.pluralRulesCache = {};
  }
  addRule(lng, obj) {
    this.rules[lng] = obj;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.shouldUseIntlApi()) {
      const cleanedCode = getCleanedCode(code === "dev" ? "en" : code);
      const type = options.ordinal ? "ordinal" : "cardinal";
      const cacheKey = JSON.stringify({
        cleanedCode,
        type
      });
      if (cacheKey in this.pluralRulesCache) {
        return this.pluralRulesCache[cacheKey];
      }
      let rule;
      try {
        rule = new Intl.PluralRules(cleanedCode, {
          type
        });
      } catch (err2) {
        if (!code.match(/-|_/)) return;
        const lngPart = this.languageUtils.getLanguagePartFromCode(code);
        rule = this.getRule(lngPart, options);
      }
      this.pluralRulesCache[cacheKey] = rule;
      return rule;
    }
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  }
  needsPlural(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (this.shouldUseIntlApi()) {
      return rule && rule.resolvedOptions().pluralCategories.length > 1;
    }
    return rule && rule.numbers.length > 1;
  }
  getPluralFormsOfKey(code, key) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return this.getSuffixes(code, options).map((suffix) => `${key}${suffix}`);
  }
  getSuffixes(code) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const rule = this.getRule(code, options);
    if (!rule) {
      return [];
    }
    if (this.shouldUseIntlApi()) {
      return rule.resolvedOptions().pluralCategories.sort((pluralCategory1, pluralCategory2) => suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2]).map((pluralCategory) => `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${pluralCategory}`);
    }
    return rule.numbers.map((number) => this.getSuffix(code, number, options));
  }
  getSuffix(code, count) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const rule = this.getRule(code, options);
    if (rule) {
      if (this.shouldUseIntlApi()) {
        return `${this.options.prepend}${options.ordinal ? `ordinal${this.options.prepend}` : ""}${rule.select(count)}`;
      }
      return this.getSuffixRetroCompatible(rule, count);
    }
    this.logger.warn(`no plural rule found for: ${code}`);
    return "";
  }
  getSuffixRetroCompatible(rule, count) {
    const idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
    let suffix = rule.numbers[idx];
    if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      if (suffix === 2) {
        suffix = "plural";
      } else if (suffix === 1) {
        suffix = "";
      }
    }
    const returnSuffix = () => this.options.prepend && suffix.toString() ? this.options.prepend + suffix.toString() : suffix.toString();
    if (this.options.compatibilityJSON === "v1") {
      if (suffix === 1) return "";
      if (typeof suffix === "number") return `_plural_${suffix.toString()}`;
      return returnSuffix();
    } else if (this.options.compatibilityJSON === "v2") {
      return returnSuffix();
    } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
      return returnSuffix();
    }
    return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
  }
  shouldUseIntlApi() {
    return !nonIntlVersions.includes(this.options.compatibilityJSON);
  }
}
const deepFindWithDefaults = function(data, defaultData, key) {
  let keySeparator = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : ".";
  let ignoreJSONStructure = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true;
  let path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && isString$1(key)) {
    path = deepFind(data, key, keySeparator);
    if (path === void 0) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
};
const regexSafe = (val) => val.replace(/\$/g, "$$$$");
class Interpolator {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("interpolator");
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || ((value) => value);
    this.init(options);
  }
  init() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!options.interpolation) options.interpolation = {
      escapeValue: true
    };
    const {
      escape: escape$12,
      escapeValue,
      useRawValueToEscape,
      prefix,
      prefixEscaped,
      suffix,
      suffixEscaped,
      formatSeparator,
      unescapeSuffix,
      unescapePrefix,
      nestingPrefix,
      nestingPrefixEscaped,
      nestingSuffix,
      nestingSuffixEscaped,
      nestingOptionsSeparator,
      maxReplaces,
      alwaysFormat
    } = options.interpolation;
    this.escape = escape$12 !== void 0 ? escape$12 : escape;
    this.escapeValue = escapeValue !== void 0 ? escapeValue : true;
    this.useRawValueToEscape = useRawValueToEscape !== void 0 ? useRawValueToEscape : false;
    this.prefix = prefix ? regexEscape(prefix) : prefixEscaped || "{{";
    this.suffix = suffix ? regexEscape(suffix) : suffixEscaped || "}}";
    this.formatSeparator = formatSeparator || ",";
    this.unescapePrefix = unescapeSuffix ? "" : unescapePrefix || "-";
    this.unescapeSuffix = this.unescapePrefix ? "" : unescapeSuffix || "";
    this.nestingPrefix = nestingPrefix ? regexEscape(nestingPrefix) : nestingPrefixEscaped || regexEscape("$t(");
    this.nestingSuffix = nestingSuffix ? regexEscape(nestingSuffix) : nestingSuffixEscaped || regexEscape(")");
    this.nestingOptionsSeparator = nestingOptionsSeparator || ",";
    this.maxReplaces = maxReplaces || 1e3;
    this.alwaysFormat = alwaysFormat !== void 0 ? alwaysFormat : false;
    this.resetRegExp();
  }
  reset() {
    if (this.options) this.init(this.options);
  }
  resetRegExp() {
    const getOrResetRegExp = (existingRegExp, pattern) => {
      if (existingRegExp && existingRegExp.source === pattern) {
        existingRegExp.lastIndex = 0;
        return existingRegExp;
      }
      return new RegExp(pattern, "g");
    };
    this.regexp = getOrResetRegExp(this.regexp, `${this.prefix}(.+?)${this.suffix}`);
    this.regexpUnescape = getOrResetRegExp(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`);
    this.nestingRegexp = getOrResetRegExp(this.nestingRegexp, `${this.nestingPrefix}(.+?)${this.nestingSuffix}`);
  }
  interpolate(str, data, lng, options) {
    let match;
    let value;
    let replaces;
    const defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
    const handleFormat = (key) => {
      if (key.indexOf(this.formatSeparator) < 0) {
        const path = deepFindWithDefaults(data, defaultData, key, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(path, void 0, lng, {
          ...options,
          ...data,
          interpolationkey: key
        }) : path;
      }
      const p2 = key.split(this.formatSeparator);
      const k2 = p2.shift().trim();
      const f2 = p2.join(this.formatSeparator).trim();
      return this.format(deepFindWithDefaults(data, defaultData, k2, this.options.keySeparator, this.options.ignoreJSONStructure), f2, lng, {
        ...options,
        ...data,
        interpolationkey: k2
      });
    };
    this.resetRegExp();
    const missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
    const skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== void 0 ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    const todos = [{
      regex: this.regexpUnescape,
      safeValue: (val) => regexSafe(val)
    }, {
      regex: this.regexp,
      safeValue: (val) => this.escapeValue ? regexSafe(this.escape(val)) : regexSafe(val)
    }];
    todos.forEach((todo) => {
      replaces = 0;
      while (match = todo.regex.exec(str)) {
        const matchedVar = match[1].trim();
        value = handleFormat(matchedVar);
        if (value === void 0) {
          if (typeof missingInterpolationHandler === "function") {
            const temp = missingInterpolationHandler(str, match, options);
            value = isString$1(temp) ? temp : "";
          } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
            value = "";
          } else if (skipOnVariables) {
            value = match[0];
            continue;
          } else {
            this.logger.warn(`missed to pass in variable ${matchedVar} for interpolating ${str}`);
            value = "";
          }
        } else if (!isString$1(value) && !this.useRawValueToEscape) {
          value = makeString(value);
        }
        const safeValue = todo.safeValue(value);
        str = str.replace(match[0], safeValue);
        if (skipOnVariables) {
          todo.regex.lastIndex += value.length;
          todo.regex.lastIndex -= match[0].length;
        } else {
          todo.regex.lastIndex = 0;
        }
        replaces++;
        if (replaces >= this.maxReplaces) {
          break;
        }
      }
    });
    return str;
  }
  nest(str, fc2) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let match;
    let value;
    let clonedOptions;
    const handleHasOptions = (key, inheritedOptions) => {
      const sep = this.nestingOptionsSeparator;
      if (key.indexOf(sep) < 0) return key;
      const c = key.split(new RegExp(`${sep}[ ]*{`));
      let optionsString = `{${c[1]}`;
      key = c[0];
      optionsString = this.interpolate(optionsString, clonedOptions);
      const matchedSingleQuotes = optionsString.match(/'/g);
      const matchedDoubleQuotes = optionsString.match(/"/g);
      if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
        optionsString = optionsString.replace(/'/g, '"');
      }
      try {
        clonedOptions = JSON.parse(optionsString);
        if (inheritedOptions) clonedOptions = {
          ...inheritedOptions,
          ...clonedOptions
        };
      } catch (e) {
        this.logger.warn(`failed parsing options string in nesting for key ${key}`, e);
        return `${key}${sep}${optionsString}`;
      }
      if (clonedOptions.defaultValue && clonedOptions.defaultValue.indexOf(this.prefix) > -1) delete clonedOptions.defaultValue;
      return key;
    };
    while (match = this.nestingRegexp.exec(str)) {
      let formatters = [];
      clonedOptions = {
        ...options
      };
      clonedOptions = clonedOptions.replace && !isString$1(clonedOptions.replace) ? clonedOptions.replace : clonedOptions;
      clonedOptions.applyPostProcessor = false;
      delete clonedOptions.defaultValue;
      let doReduce = false;
      if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
        const r2 = match[1].split(this.formatSeparator).map((elem) => elem.trim());
        match[1] = r2.shift();
        formatters = r2;
        doReduce = true;
      }
      value = fc2(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
      if (value && match[0] === str && !isString$1(value)) return value;
      if (!isString$1(value)) value = makeString(value);
      if (!value) {
        this.logger.warn(`missed to resolve ${match[1]} for nesting ${str}`);
        value = "";
      }
      if (doReduce) {
        value = formatters.reduce((v2, f2) => this.format(v2, f2, options.lng, {
          ...options,
          interpolationkey: match[1].trim()
        }), value.trim());
      }
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  }
}
const parseFormatStr = (formatStr) => {
  let formatName = formatStr.toLowerCase().trim();
  const formatOptions = {};
  if (formatStr.indexOf("(") > -1) {
    const p2 = formatStr.split("(");
    formatName = p2[0].toLowerCase().trim();
    const optStr = p2[1].substring(0, p2[1].length - 1);
    if (formatName === "currency" && optStr.indexOf(":") < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === "relativetime" && optStr.indexOf(":") < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      const opts = optStr.split(";");
      opts.forEach((opt) => {
        if (opt) {
          const [key, ...rest] = opt.split(":");
          const val = rest.join(":").trim().replace(/^'+|'+$/g, "");
          const trimmedKey = key.trim();
          if (!formatOptions[trimmedKey]) formatOptions[trimmedKey] = val;
          if (val === "false") formatOptions[trimmedKey] = false;
          if (val === "true") formatOptions[trimmedKey] = true;
          if (!isNaN(val)) formatOptions[trimmedKey] = parseInt(val, 10);
        }
      });
    }
  }
  return {
    formatName,
    formatOptions
  };
};
const createCachedFormatter = (fn) => {
  const cache = {};
  return (val, lng, options) => {
    let optForCache = options;
    if (options && options.interpolationkey && options.formatParams && options.formatParams[options.interpolationkey] && options[options.interpolationkey]) {
      optForCache = {
        ...optForCache,
        [options.interpolationkey]: void 0
      };
    }
    const key = lng + JSON.stringify(optForCache);
    let formatter = cache[key];
    if (!formatter) {
      formatter = fn(getCleanedCode(lng), options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
};
class Formatter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.logger = baseLogger.create("formatter");
    this.options = options;
    this.formats = {
      number: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      currency: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.NumberFormat(lng, {
          ...opt,
          style: "currency"
        });
        return (val) => formatter.format(val);
      }),
      datetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.DateTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      }),
      relativetime: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.RelativeTimeFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val, opt.range || "day");
      }),
      list: createCachedFormatter((lng, opt) => {
        const formatter = new Intl.ListFormat(lng, {
          ...opt
        });
        return (val) => formatter.format(val);
      })
    };
    this.init(options);
  }
  init(services) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      interpolation: {}
    };
    this.formatSeparator = options.interpolation.formatSeparator || ",";
  }
  add(name, fc2) {
    this.formats[name.toLowerCase().trim()] = fc2;
  }
  addCached(name, fc2) {
    this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc2);
  }
  format(value, format, lng) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    const formats = format.split(this.formatSeparator);
    if (formats.length > 1 && formats[0].indexOf("(") > 1 && formats[0].indexOf(")") < 0 && formats.find((f2) => f2.indexOf(")") > -1)) {
      const lastIndex = formats.findIndex((f2) => f2.indexOf(")") > -1);
      formats[0] = [formats[0], ...formats.splice(1, lastIndex)].join(this.formatSeparator);
    }
    const result = formats.reduce((mem, f2) => {
      const {
        formatName,
        formatOptions
      } = parseFormatStr(f2);
      if (this.formats[formatName]) {
        let formatted = mem;
        try {
          const valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
          const l2 = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
          formatted = this.formats[formatName](mem, l2, {
            ...formatOptions,
            ...options,
            ...valOptions
          });
        } catch (error) {
          this.logger.warn(error);
        }
        return formatted;
      } else {
        this.logger.warn(`there was no format function for ${formatName}`);
      }
      return mem;
    }, value);
    return result;
  }
}
const removePending = (q2, name) => {
  if (q2.pending[name] !== void 0) {
    delete q2.pending[name];
    q2.pendingCount--;
  }
};
class Connector extends EventEmitter {
  constructor(backend, store, services) {
    let options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
    super();
    this.backend = backend;
    this.store = store;
    this.services = services;
    this.languageUtils = services.languageUtils;
    this.options = options;
    this.logger = baseLogger.create("backendConnector");
    this.waitingReads = [];
    this.maxParallelReads = options.maxParallelReads || 10;
    this.readingCalls = 0;
    this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    this.state = {};
    this.queue = [];
    if (this.backend && this.backend.init) {
      this.backend.init(services, options.backend, options);
    }
  }
  queueLoad(languages, namespaces, options, callback) {
    const toLoad = {};
    const pending = {};
    const toLoadLanguages = {};
    const toLoadNamespaces = {};
    languages.forEach((lng) => {
      let hasAllNamespaces = true;
      namespaces.forEach((ns) => {
        const name = `${lng}|${ns}`;
        if (!options.reload && this.store.hasResourceBundle(lng, ns)) {
          this.state[name] = 2;
        } else if (this.state[name] < 0) ;
        else if (this.state[name] === 1) {
          if (pending[name] === void 0) pending[name] = true;
        } else {
          this.state[name] = 1;
          hasAllNamespaces = false;
          if (pending[name] === void 0) pending[name] = true;
          if (toLoad[name] === void 0) toLoad[name] = true;
          if (toLoadNamespaces[ns] === void 0) toLoadNamespaces[ns] = true;
        }
      });
      if (!hasAllNamespaces) toLoadLanguages[lng] = true;
    });
    if (Object.keys(toLoad).length || Object.keys(pending).length) {
      this.queue.push({
        pending,
        pendingCount: Object.keys(pending).length,
        loaded: {},
        errors: [],
        callback
      });
    }
    return {
      toLoad: Object.keys(toLoad),
      pending: Object.keys(pending),
      toLoadLanguages: Object.keys(toLoadLanguages),
      toLoadNamespaces: Object.keys(toLoadNamespaces)
    };
  }
  loaded(name, err2, data) {
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    if (err2) this.emit("failedLoading", lng, ns, err2);
    if (!err2 && data) {
      this.store.addResourceBundle(lng, ns, data, void 0, void 0, {
        skipCopy: true
      });
    }
    this.state[name] = err2 ? -1 : 2;
    if (err2 && data) this.state[name] = 0;
    const loaded = {};
    this.queue.forEach((q2) => {
      pushPath(q2.loaded, [lng], ns);
      removePending(q2, name);
      if (err2) q2.errors.push(err2);
      if (q2.pendingCount === 0 && !q2.done) {
        Object.keys(q2.loaded).forEach((l2) => {
          if (!loaded[l2]) loaded[l2] = {};
          const loadedKeys = q2.loaded[l2];
          if (loadedKeys.length) {
            loadedKeys.forEach((n2) => {
              if (loaded[l2][n2] === void 0) loaded[l2][n2] = true;
            });
          }
        });
        q2.done = true;
        if (q2.errors.length) {
          q2.callback(q2.errors);
        } else {
          q2.callback();
        }
      }
    });
    this.emit("loaded", loaded);
    this.queue = this.queue.filter((q2) => !q2.done);
  }
  read(lng, ns, fcName) {
    let tried = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    let wait = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : this.retryTimeout;
    let callback = arguments.length > 5 ? arguments[5] : void 0;
    if (!lng.length) return callback(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng,
        ns,
        fcName,
        tried,
        wait,
        callback
      });
      return;
    }
    this.readingCalls++;
    const resolver = (err2, data) => {
      this.readingCalls--;
      if (this.waitingReads.length > 0) {
        const next = this.waitingReads.shift();
        this.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
      }
      if (err2 && data && tried < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err2, data);
    };
    const fc2 = this.backend[fcName].bind(this.backend);
    if (fc2.length === 2) {
      try {
        const r2 = fc2(lng, ns);
        if (r2 && typeof r2.then === "function") {
          r2.then((data) => resolver(null, data)).catch(resolver);
        } else {
          resolver(null, r2);
        }
      } catch (err2) {
        resolver(err2);
      }
      return;
    }
    return fc2(lng, ns, resolver);
  }
  prepareLoading(languages, namespaces) {
    let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    let callback = arguments.length > 3 ? arguments[3] : void 0;
    if (!this.backend) {
      this.logger.warn("No backend was added via i18next.use. Will not load resources.");
      return callback && callback();
    }
    if (isString$1(languages)) languages = this.languageUtils.toResolveHierarchy(languages);
    if (isString$1(namespaces)) namespaces = [namespaces];
    const toLoad = this.queueLoad(languages, namespaces, options, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback();
      return null;
    }
    toLoad.toLoad.forEach((name) => {
      this.loadOne(name);
    });
  }
  load(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {}, callback);
  }
  reload(languages, namespaces, callback) {
    this.prepareLoading(languages, namespaces, {
      reload: true
    }, callback);
  }
  loadOne(name) {
    let prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    const s = name.split("|");
    const lng = s[0];
    const ns = s[1];
    this.read(lng, ns, "read", void 0, void 0, (err2, data) => {
      if (err2) this.logger.warn(`${prefix}loading namespace ${ns} for language ${lng} failed`, err2);
      if (!err2 && data) this.logger.log(`${prefix}loaded namespace ${ns} for language ${lng}`, data);
      this.loaded(name, err2, data);
    });
  }
  saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    let options = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : {};
    let clb = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : () => {
    };
    if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
      this.logger.warn(`did not save key "${key}" as the namespace "${namespace}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (key === void 0 || key === null || key === "") return;
    if (this.backend && this.backend.create) {
      const opts = {
        ...options,
        isUpdate
      };
      const fc2 = this.backend.create.bind(this.backend);
      if (fc2.length < 6) {
        try {
          let r2;
          if (fc2.length === 5) {
            r2 = fc2(languages, namespace, key, fallbackValue, opts);
          } else {
            r2 = fc2(languages, namespace, key, fallbackValue);
          }
          if (r2 && typeof r2.then === "function") {
            r2.then((data) => clb(null, data)).catch(clb);
          } else {
            clb(null, r2);
          }
        } catch (err2) {
          clb(err2);
        }
      } else {
        fc2(languages, namespace, key, fallbackValue, clb, opts);
      }
    }
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  }
}
const get = () => ({
  debug: false,
  initImmediate: true,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: false,
  supportedLngs: false,
  nonExplicitSupportedLngs: false,
  load: "all",
  preload: false,
  simplifyPluralSuffix: true,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: false,
  saveMissing: false,
  updateMissing: false,
  saveMissingTo: "fallback",
  saveMissingPlurals: true,
  missingKeyHandler: false,
  missingInterpolationHandler: false,
  postProcess: false,
  postProcessPassResolved: false,
  returnNull: false,
  returnEmptyString: true,
  returnObjects: false,
  joinArrays: false,
  returnedObjectHandler: false,
  parseMissingKeyHandler: false,
  appendNamespaceToMissingKey: false,
  appendNamespaceToCIMode: false,
  overloadTranslationOptionHandler: (args) => {
    let ret = {};
    if (typeof args[1] === "object") ret = args[1];
    if (isString$1(args[1])) ret.defaultValue = args[1];
    if (isString$1(args[2])) ret.tDescription = args[2];
    if (typeof args[2] === "object" || typeof args[3] === "object") {
      const options = args[3] || args[2];
      Object.keys(options).forEach((key) => {
        ret[key] = options[key];
      });
    }
    return ret;
  },
  interpolation: {
    escapeValue: true,
    format: (value) => value,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: true
  }
});
const transformOptions = (options) => {
  if (isString$1(options.ns)) options.ns = [options.ns];
  if (isString$1(options.fallbackLng)) options.fallbackLng = [options.fallbackLng];
  if (isString$1(options.fallbackNS)) options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf("cimode") < 0) {
    options.supportedLngs = options.supportedLngs.concat(["cimode"]);
  }
  return options;
};
const noop = () => {
};
const bindMemberFunctions = (inst) => {
  const mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach((mem) => {
    if (typeof inst[mem] === "function") {
      inst[mem] = inst[mem].bind(inst);
    }
  });
};
class I18n extends EventEmitter {
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    super();
    this.options = transformOptions(options);
    this.services = {};
    this.logger = baseLogger;
    this.modules = {
      external: []
    };
    bindMemberFunctions(this);
    if (callback && !this.isInitialized && !options.isClone) {
      if (!this.options.initImmediate) {
        this.init(options, callback);
        return this;
      }
      setTimeout(() => {
        this.init(options, callback);
      }, 0);
    }
  }
  init() {
    var _this = this;
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    this.isInitializing = true;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    if (!options.defaultNS && options.defaultNS !== false && options.ns) {
      if (isString$1(options.ns)) {
        options.defaultNS = options.ns;
      } else if (options.ns.indexOf("translation") < 0) {
        options.defaultNS = options.ns[0];
      }
    }
    const defOpts = get();
    this.options = {
      ...defOpts,
      ...this.options,
      ...transformOptions(options)
    };
    if (this.options.compatibilityAPI !== "v1") {
      this.options.interpolation = {
        ...defOpts.interpolation,
        ...this.options.interpolation
      };
    }
    if (options.keySeparator !== void 0) {
      this.options.userDefinedKeySeparator = options.keySeparator;
    }
    if (options.nsSeparator !== void 0) {
      this.options.userDefinedNsSeparator = options.nsSeparator;
    }
    const createClassOnDemand = (ClassOrObject) => {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === "function") return new ClassOrObject();
      return ClassOrObject;
    };
    if (!this.options.isClone) {
      if (this.modules.logger) {
        baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
      } else {
        baseLogger.init(null, this.options);
      }
      let formatter;
      if (this.modules.formatter) {
        formatter = this.modules.formatter;
      } else if (typeof Intl !== "undefined") {
        formatter = Formatter;
      }
      const lu = new LanguageUtil(this.options);
      this.store = new ResourceStore(this.options.resources, this.options);
      const s = this.services;
      s.logger = baseLogger;
      s.resourceStore = this.store;
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, {
        prepend: this.options.pluralSeparator,
        compatibilityJSON: this.options.compatibilityJSON,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      });
      if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
        s.formatter = createClassOnDemand(formatter);
        s.formatter.init(s, this.options);
        this.options.interpolation.format = s.formatter.format.bind(s.formatter);
      }
      s.interpolator = new Interpolator(this.options);
      s.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      };
      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      s.backendConnector.on("*", function(event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }
        _this.emit(event, ...args);
      });
      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
      }
      if (this.modules.i18nFormat) {
        s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
        if (s.i18nFormat.init) s.i18nFormat.init(this);
      }
      this.translator = new Translator(this.services, this.options);
      this.translator.on("*", function(event) {
        for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }
        _this.emit(event, ...args);
      });
      this.modules.external.forEach((m2) => {
        if (m2.init) m2.init(this);
      });
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;
    if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      if (codes.length > 0 && codes[0] !== "dev") this.options.lng = codes[0];
    }
    if (!this.services.languageDetector && !this.options.lng) {
      this.logger.warn("init: no languageDetector is used and no lng is defined");
    }
    const storeApi = ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"];
    storeApi.forEach((fcName) => {
      this[fcName] = function() {
        return _this.store[fcName](...arguments);
      };
    });
    const storeApiChained = ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"];
    storeApiChained.forEach((fcName) => {
      this[fcName] = function() {
        _this.store[fcName](...arguments);
        return _this;
      };
    });
    const deferred = defer();
    const load = () => {
      const finish = (err2, t2) => {
        this.isInitializing = false;
        if (this.isInitialized && !this.initializedStoreOnce) this.logger.warn("init: i18next is already initialized. You should call init just once!");
        this.isInitialized = true;
        if (!this.options.isClone) this.logger.log("initialized", this.options);
        this.emit("initialized", this.options);
        deferred.resolve(t2);
        callback(err2, t2);
      };
      if (this.languages && this.options.compatibilityAPI !== "v1" && !this.isInitialized) return finish(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, finish);
    };
    if (this.options.resources || !this.options.initImmediate) {
      load();
    } else {
      setTimeout(load, 0);
    }
    return deferred;
  }
  loadResources(language) {
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    let usedCallback = callback;
    const usedLng = isString$1(language) ? language : this.language;
    if (typeof language === "function") usedCallback = language;
    if (!this.options.resources || this.options.partialBundledLanguages) {
      if (usedLng && usedLng.toLowerCase() === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return usedCallback();
      const toLoad = [];
      const append = (lng) => {
        if (!lng) return;
        if (lng === "cimode") return;
        const lngs = this.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach((l2) => {
          if (l2 === "cimode") return;
          if (toLoad.indexOf(l2) < 0) toLoad.push(l2);
        });
      };
      if (!usedLng) {
        const fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach((l2) => append(l2));
      } else {
        append(usedLng);
      }
      if (this.options.preload) {
        this.options.preload.forEach((l2) => append(l2));
      }
      this.services.backendConnector.load(toLoad, this.options.ns, (e) => {
        if (!e && !this.resolvedLanguage && this.language) this.setResolvedLanguage(this.language);
        usedCallback(e);
      });
    } else {
      usedCallback(null);
    }
  }
  reloadResources(lngs, ns, callback) {
    const deferred = defer();
    if (typeof lngs === "function") {
      callback = lngs;
      lngs = void 0;
    }
    if (typeof ns === "function") {
      callback = ns;
      ns = void 0;
    }
    if (!lngs) lngs = this.languages;
    if (!ns) ns = this.options.ns;
    if (!callback) callback = noop;
    this.services.backendConnector.reload(lngs, ns, (err2) => {
      deferred.resolve();
      callback(err2);
    });
    return deferred;
  }
  use(module) {
    if (!module) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!module.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    if (module.type === "backend") {
      this.modules.backend = module;
    }
    if (module.type === "logger" || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }
    if (module.type === "languageDetector") {
      this.modules.languageDetector = module;
    }
    if (module.type === "i18nFormat") {
      this.modules.i18nFormat = module;
    }
    if (module.type === "postProcessor") {
      postProcessor.addPostProcessor(module);
    }
    if (module.type === "formatter") {
      this.modules.formatter = module;
    }
    if (module.type === "3rdParty") {
      this.modules.external.push(module);
    }
    return this;
  }
  setResolvedLanguage(l2) {
    if (!l2 || !this.languages) return;
    if (["cimode", "dev"].indexOf(l2) > -1) return;
    for (let li2 = 0; li2 < this.languages.length; li2++) {
      const lngInLngs = this.languages[li2];
      if (["cimode", "dev"].indexOf(lngInLngs) > -1) continue;
      if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
        this.resolvedLanguage = lngInLngs;
        break;
      }
    }
  }
  changeLanguage(lng, callback) {
    var _this2 = this;
    this.isLanguageChangingTo = lng;
    const deferred = defer();
    this.emit("languageChanging", lng);
    const setLngProps = (l2) => {
      this.language = l2;
      this.languages = this.services.languageUtils.toResolveHierarchy(l2);
      this.resolvedLanguage = void 0;
      this.setResolvedLanguage(l2);
    };
    const done = (err2, l2) => {
      if (l2) {
        setLngProps(l2);
        this.translator.changeLanguage(l2);
        this.isLanguageChangingTo = void 0;
        this.emit("languageChanged", l2);
        this.logger.log("languageChanged", l2);
      } else {
        this.isLanguageChangingTo = void 0;
      }
      deferred.resolve(function() {
        return _this2.t(...arguments);
      });
      if (callback) callback(err2, function() {
        return _this2.t(...arguments);
      });
    };
    const setLng = (lngs) => {
      if (!lng && !lngs && this.services.languageDetector) lngs = [];
      const l2 = isString$1(lngs) ? lngs : this.services.languageUtils.getBestMatchFromCodes(lngs);
      if (l2) {
        if (!this.language) {
          setLngProps(l2);
        }
        if (!this.translator.language) this.translator.changeLanguage(l2);
        if (this.services.languageDetector && this.services.languageDetector.cacheUserLanguage) this.services.languageDetector.cacheUserLanguage(l2);
      }
      this.loadResources(l2, (err2) => {
        done(err2, l2);
      });
    };
    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      if (this.services.languageDetector.detect.length === 0) {
        this.services.languageDetector.detect().then(setLng);
      } else {
        this.services.languageDetector.detect(setLng);
      }
    } else {
      setLng(lng);
    }
    return deferred;
  }
  getFixedT(lng, ns, keyPrefix) {
    var _this3 = this;
    const fixedT = function(key, opts) {
      let options;
      if (typeof opts !== "object") {
        for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
          rest[_key3 - 2] = arguments[_key3];
        }
        options = _this3.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      } else {
        options = {
          ...opts
        };
      }
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      if (options.keyPrefix !== "") options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
      const keySeparator = _this3.options.keySeparator || ".";
      let resultKey;
      if (options.keyPrefix && Array.isArray(key)) {
        resultKey = key.map((k2) => `${options.keyPrefix}${keySeparator}${k2}`);
      } else {
        resultKey = options.keyPrefix ? `${options.keyPrefix}${keySeparator}${key}` : key;
      }
      return _this3.t(resultKey, options);
    };
    if (isString$1(lng)) {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    fixedT.keyPrefix = keyPrefix;
    return fixedT;
  }
  t() {
    return this.translator && this.translator.translate(...arguments);
  }
  exists() {
    return this.translator && this.translator.exists(...arguments);
  }
  setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  }
  hasLoadedNamespace(ns) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!this.isInitialized) {
      this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages);
      return false;
    }
    if (!this.languages || !this.languages.length) {
      this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages);
      return false;
    }
    const lng = options.lng || this.resolvedLanguage || this.languages[0];
    const fallbackLng = this.options ? this.options.fallbackLng : false;
    const lastLng = this.languages[this.languages.length - 1];
    if (lng.toLowerCase() === "cimode") return true;
    const loadNotPending = (l2, n2) => {
      const loadState = this.services.backendConnector.state[`${l2}|${n2}`];
      return loadState === -1 || loadState === 0 || loadState === 2;
    };
    if (options.precheck) {
      const preResult = options.precheck(this, loadNotPending);
      if (preResult !== void 0) return preResult;
    }
    if (this.hasResourceBundle(lng, ns)) return true;
    if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
    if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
    return false;
  }
  loadNamespaces(ns, callback) {
    const deferred = defer();
    if (!this.options.ns) {
      if (callback) callback();
      return Promise.resolve();
    }
    if (isString$1(ns)) ns = [ns];
    ns.forEach((n2) => {
      if (this.options.ns.indexOf(n2) < 0) this.options.ns.push(n2);
    });
    this.loadResources((err2) => {
      deferred.resolve();
      if (callback) callback(err2);
    });
    return deferred;
  }
  loadLanguages(lngs, callback) {
    const deferred = defer();
    if (isString$1(lngs)) lngs = [lngs];
    const preloaded = this.options.preload || [];
    const newLngs = lngs.filter((lng) => preloaded.indexOf(lng) < 0 && this.services.languageUtils.isSupportedCode(lng));
    if (!newLngs.length) {
      if (callback) callback();
      return Promise.resolve();
    }
    this.options.preload = preloaded.concat(newLngs);
    this.loadResources((err2) => {
      deferred.resolve();
      if (callback) callback(err2);
    });
    return deferred;
  }
  dir(lng) {
    if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
    if (!lng) return "rtl";
    const rtlLngs = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"];
    const languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
    return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 ? arguments[1] : void 0;
    return new I18n(options, callback);
  }
  cloneInstance() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let callback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : noop;
    const forkResourceStore = options.forkResourceStore;
    if (forkResourceStore) delete options.forkResourceStore;
    const mergedOptions = {
      ...this.options,
      ...options,
      ...{
        isClone: true
      }
    };
    const clone = new I18n(mergedOptions);
    if (options.debug !== void 0 || options.prefix !== void 0) {
      clone.logger = clone.logger.clone(options);
    }
    const membersToCopy = ["store", "services", "language"];
    membersToCopy.forEach((m2) => {
      clone[m2] = this[m2];
    });
    clone.services = {
      ...this.services
    };
    clone.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    if (forkResourceStore) {
      clone.store = new ResourceStore(this.store.data, mergedOptions);
      clone.services.resourceStore = clone.store;
    }
    clone.translator = new Translator(clone.services, mergedOptions);
    clone.translator.on("*", function(event) {
      for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }
      clone.emit(event, ...args);
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = mergedOptions;
    clone.translator.backendConnector.services.utils = {
      hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
    };
    return clone;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;
instance.createInstance;
instance.dir;
instance.init;
instance.loadResources;
instance.reloadResources;
instance.use;
instance.changeLanguage;
instance.getFixedT;
instance.t;
instance.exists;
instance.setDefaultNamespace;
instance.hasLoadedNamespace;
instance.loadNamespaces;
instance.loadLanguages;
const warn = (i18n, code, msg, rest) => {
  const args = [msg, {
    code,
    ...rest || {}
  }];
  if (i18n?.services?.logger?.forward) {
    return i18n.services.logger.forward(args, "warn", "react-i18next::", true);
  }
  if (isString(args[0])) args[0] = `react-i18next:: ${args[0]}`;
  if (i18n?.services?.logger?.warn) {
    i18n.services.logger.warn(...args);
  } else if (console?.warn) {
    console.warn(...args);
  }
};
const alreadyWarned = {};
const warnOnce = (i18n, code, msg, rest) => {
  if (isString(msg) && alreadyWarned[msg]) return;
  if (isString(msg)) alreadyWarned[msg] = /* @__PURE__ */ new Date();
  warn(i18n, code, msg, rest);
};
const loadedClb = (i18n, cb2) => () => {
  if (i18n.isInitialized) {
    cb2();
  } else {
    const initialized = () => {
      setTimeout(() => {
        i18n.off("initialized", initialized);
      }, 0);
      cb2();
    };
    i18n.on("initialized", initialized);
  }
};
const loadNamespaces = (i18n, ns, cb2) => {
  i18n.loadNamespaces(ns, loadedClb(i18n, cb2));
};
const loadLanguages = (i18n, lng, ns, cb2) => {
  if (isString(ns)) ns = [ns];
  if (i18n.options.preload && i18n.options.preload.indexOf(lng) > -1) return loadNamespaces(i18n, ns, cb2);
  ns.forEach((n2) => {
    if (i18n.options.ns.indexOf(n2) < 0) i18n.options.ns.push(n2);
  });
  i18n.loadLanguages(lng, loadedClb(i18n, cb2));
};
const hasLoadedNamespace = (ns, i18n, options = {}) => {
  if (!i18n.languages || !i18n.languages.length) {
    warnOnce(i18n, "NO_LANGUAGES", "i18n.languages were undefined or empty", {
      languages: i18n.languages
    });
    return true;
  }
  return i18n.hasLoadedNamespace(ns, {
    lng: options.lng,
    precheck: (i18nInstance2, loadNotPending) => {
      if (options.bindI18n && options.bindI18n.indexOf("languageChanging") > -1 && i18nInstance2.services.backendConnector.backend && i18nInstance2.isLanguageChangingTo && !loadNotPending(i18nInstance2.isLanguageChangingTo, ns)) return false;
    }
  });
};
const isString = (obj) => typeof obj === "string";
const isObject = (obj) => typeof obj === "object" && obj !== null;
const matchHtmlEntity = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g;
const htmlEntities = {
  "&amp;": "&",
  "&#38;": "&",
  "&lt;": "<",
  "&#60;": "<",
  "&gt;": ">",
  "&#62;": ">",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&#34;": '"',
  "&nbsp;": " ",
  "&#160;": " ",
  "&copy;": "©",
  "&#169;": "©",
  "&reg;": "®",
  "&#174;": "®",
  "&hellip;": "…",
  "&#8230;": "…",
  "&#x2F;": "/",
  "&#47;": "/"
};
const unescapeHtmlEntity = (m2) => htmlEntities[m2];
const unescape = (text) => text.replace(matchHtmlEntity, unescapeHtmlEntity);
let defaultOptions = {
  bindI18n: "languageChanged",
  bindI18nStore: "",
  transEmptyNodeValue: "",
  transSupportBasicHtmlNodes: true,
  transWrapTextNodes: "",
  transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
  useSuspense: true,
  unescape
};
const setDefaults = (options = {}) => {
  defaultOptions = {
    ...defaultOptions,
    ...options
  };
};
const getDefaults = () => defaultOptions;
let i18nInstance;
const setI18n = (instance2) => {
  i18nInstance = instance2;
};
const getI18n = () => i18nInstance;
const initReactI18next = {
  type: "3rdParty",
  init(instance2) {
    setDefaults(instance2.options.react);
    setI18n(instance2);
  }
};
const I18nContext = reactExports.createContext();
class ReportNamespaces {
  constructor() {
    this.usedNamespaces = {};
  }
  addUsedNamespaces(namespaces) {
    namespaces.forEach((ns) => {
      if (!this.usedNamespaces[ns]) this.usedNamespaces[ns] = true;
    });
  }
  getUsedNamespaces() {
    return Object.keys(this.usedNamespaces);
  }
}
const usePrevious = (value, ignore) => {
  const ref = reactExports.useRef();
  reactExports.useEffect(() => {
    ref.current = value;
  }, [value, ignore]);
  return ref.current;
};
const alwaysNewT = (i18n, language, namespace, keyPrefix) => i18n.getFixedT(language, namespace, keyPrefix);
const useMemoizedT = (i18n, language, namespace, keyPrefix) => reactExports.useCallback(alwaysNewT(i18n, language, namespace, keyPrefix), [i18n, language, namespace, keyPrefix]);
const useTranslation = (ns, props = {}) => {
  const {
    i18n: i18nFromProps
  } = props;
  const {
    i18n: i18nFromContext,
    defaultNS: defaultNSFromContext
  } = reactExports.useContext(I18nContext) || {};
  const i18n = i18nFromProps || i18nFromContext || getI18n();
  if (i18n && !i18n.reportNamespaces) i18n.reportNamespaces = new ReportNamespaces();
  if (!i18n) {
    warnOnce(i18n, "NO_I18NEXT_INSTANCE", "useTranslation: You will need to pass in an i18next instance by using initReactI18next");
    const notReadyT = (k2, optsOrDefaultValue) => {
      if (isString(optsOrDefaultValue)) return optsOrDefaultValue;
      if (isObject(optsOrDefaultValue) && isString(optsOrDefaultValue.defaultValue)) return optsOrDefaultValue.defaultValue;
      return Array.isArray(k2) ? k2[k2.length - 1] : k2;
    };
    const retNotReady = [notReadyT, {}, false];
    retNotReady.t = notReadyT;
    retNotReady.i18n = {};
    retNotReady.ready = false;
    return retNotReady;
  }
  if (i18n.options.react?.wait) warnOnce(i18n, "DEPRECATED_OPTION", "useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");
  const i18nOptions = {
    ...getDefaults(),
    ...i18n.options.react,
    ...props
  };
  const {
    useSuspense,
    keyPrefix
  } = i18nOptions;
  let namespaces = defaultNSFromContext || i18n.options?.defaultNS;
  namespaces = isString(namespaces) ? [namespaces] : namespaces || ["translation"];
  i18n.reportNamespaces.addUsedNamespaces?.(namespaces);
  const ready = (i18n.isInitialized || i18n.initializedStoreOnce) && namespaces.every((n2) => hasLoadedNamespace(n2, i18n, i18nOptions));
  const memoGetT = useMemoizedT(i18n, props.lng || null, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix);
  const getT = () => memoGetT;
  const getNewT = () => alwaysNewT(i18n, props.lng || null, i18nOptions.nsMode === "fallback" ? namespaces : namespaces[0], keyPrefix);
  const [t2, setT] = reactExports.useState(getT);
  let joinedNS = namespaces.join();
  if (props.lng) joinedNS = `${props.lng}${joinedNS}`;
  const previousJoinedNS = usePrevious(joinedNS);
  const isMounted = reactExports.useRef(true);
  reactExports.useEffect(() => {
    const {
      bindI18n,
      bindI18nStore
    } = i18nOptions;
    isMounted.current = true;
    if (!ready && !useSuspense) {
      if (props.lng) {
        loadLanguages(i18n, props.lng, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      } else {
        loadNamespaces(i18n, namespaces, () => {
          if (isMounted.current) setT(getNewT);
        });
      }
    }
    if (ready && previousJoinedNS && previousJoinedNS !== joinedNS && isMounted.current) {
      setT(getNewT);
    }
    const boundReset = () => {
      if (isMounted.current) setT(getNewT);
    };
    if (bindI18n) i18n?.on(bindI18n, boundReset);
    if (bindI18nStore) i18n?.store.on(bindI18nStore, boundReset);
    return () => {
      isMounted.current = false;
      if (i18n && bindI18n) bindI18n?.split(" ").forEach((e) => i18n.off(e, boundReset));
      if (bindI18nStore && i18n) bindI18nStore.split(" ").forEach((e) => i18n.store.off(e, boundReset));
    };
  }, [i18n, joinedNS]);
  reactExports.useEffect(() => {
    if (isMounted.current && ready) {
      setT(getT);
    }
  }, [i18n, keyPrefix, ready]);
  const ret = [t2, i18n, ready];
  ret.t = t2;
  ret.i18n = i18n;
  ret.ready = ready;
  if (ready) return ret;
  if (!ready && !useSuspense) return ret;
  throw new Promise((resolve) => {
    if (props.lng) {
      loadLanguages(i18n, props.lng, namespaces, () => resolve());
    } else {
      loadNamespaces(i18n, namespaces, () => resolve());
    }
  });
};
const it = {
  "app.name": "MoliCut",
  "app.tagline": "Editor video professionale · open source",
  "menu.file": "File",
  "menu.edit": "Modifica",
  "menu.sequence": "Sequenza",
  "menu.clip": "Clip",
  "menu.effects": "Effetti",
  "menu.view": "Vista",
  "menu.window": "Finestra",
  "menu.help": "Aiuto",
  "menu.new": "Nuovo progetto",
  "menu.open": "Apri progetto…",
  "menu.save": "Salva",
  "menu.saveAs": "Salva con nome…",
  "menu.import": "Importa media…",
  "menu.export": "Esporta / Invia alla coda…",
  "menu.exportInterchange": "Esporta EDL/FCPXML/XML…",
  "menu.settings": "Impostazioni…",
  "menu.quit": "Esci",
  "menu.undo": "Annulla",
  "menu.redo": "Ripeti",
  "menu.cut": "Dividi al playhead",
  "menu.delete": "Elimina selezione",
  "menu.duplicate": "Duplica clip",
  "menu.selectAll": "Seleziona tutto",
  "menu.addVideoTrack": "Aggiungi traccia video",
  "menu.addAudioTrack": "Aggiungi traccia audio",
  "menu.addSubtitleTrack": "Aggiungi traccia testo",
  "menu.addTitle": "Aggiungi testo / titolo",
  "menu.addMarker": "Aggiungi marker",
  "menu.queue": "Render Queue",
  "menu.debug": "Scheda Debug",
  "menu.commandPalette": "Command Palette",
  "menu.about": "Informazioni su MoliCut",
  "media.title": "Media Bin",
  "media.import": "Importa",
  "media.search": "Cerca media…",
  "media.empty": "Nessun media. Trascina file qui o premi Importa.",
  "media.offline": "Offline",
  "media.addToTimeline": "Aggiungi alla timeline",
  "media.relink": "Rilink…",
  "media.remove": "Rimuovi",
  "media.proxy": "Proxy",
  "media.duration": "Durata",
  "preview.title": "Program Monitor",
  "preview.empty": "Nessuna clip sotto il playhead",
  "preview.scopes": "Scope",
  "preview.safeArea": "Safe area",
  "preview.quality": "Qualità preview",
  "preview.auto": "Auto",
  "preview.full": "Piena",
  "preview.half": "1/2",
  "preview.quarter": "1/4",
  "timeline.title": "Timeline",
  "timeline.select": "Selezione",
  "timeline.blade": "Forbici",
  "timeline.snap": "Snap",
  "timeline.addTrack": "Traccia",
  "timeline.marker": "Marker",
  "timeline.zoom": "Zoom",
  "timeline.empty": "Trascina un media qui per iniziare",
  "inspector.title": "Inspector",
  "inspector.video": "Video",
  "inspector.audio": "Audio",
  "inspector.color": "Colore",
  "inspector.effects": "Effetti",
  "inspector.transform": "Trasformazione",
  "inspector.position": "Posizione",
  "inspector.scale": "Scala",
  "inspector.rotation": "Rotazione",
  "inspector.opacity": "Opacità",
  "inspector.volume": "Volume",
  "inspector.speed": "Velocità",
  "inspector.addEffect": "Aggiungi effetto",
  "inspector.reset": "Reset",
  "inspector.noSelection": "Seleziona una clip nella timeline",
  "inspector.noSelectionHint": "I parametri, gli effetti e i keyframe della clip appariranno qui.",
  "inspector.keyframe": "Keyframe",
  "inspector.temperature": "Temperatura",
  "inspector.tint": "Tinta",
  "inspector.contrast": "Contrasto",
  "inspector.saturation": "Saturazione",
  "inspector.sharpness": "Nitidezza",
  "export.title": "Esporta",
  "export.subtitle": "Ogni export passa dalla coda del Media Encoder",
  "export.source": "Sorgente",
  "export.preset": "Preset",
  "export.output": "Output",
  "export.estimated": "Dimensione stimata",
  "export.queue": "Aggiungi alla coda",
  "export.hdr": "HDR preservato",
  "export.note": "Il compositing completo della timeline è in roadmap: la coda esporta la clip selezionata con la pipeline condivisa.",
  "export.still": "Esporta frame",
  "queue.title": "Render Queue",
  "queue.jobs": "Job",
  "queue.watch": "Watch Folder",
  "queue.presets": "Preset",
  "queue.settings": "Impostazioni coda",
  "queue.all": "Tutti",
  "queue.queued": "In coda",
  "queue.running": "In esecuzione",
  "queue.done": "Completati",
  "queue.errors": "Errori",
  "queue.paused": "In pausa",
  "queue.canceled": "Annullati",
  "queue.addJobs": "Aggiungi file…",
  "queue.openEditor": "Editor",
  "queue.pause": "Pausa",
  "queue.resume": "Riprendi",
  "queue.cancel": "Annulla",
  "queue.retry": "Riprova",
  "queue.remove": "Rimuovi",
  "queue.duplicate": "Duplica",
  "queue.clearFinished": "Pulisci completati",
  "queue.concurrency": "Job concorrenti",
  "queue.exportReport": "Esporta report",
  "queue.detail": "Dettaglio job",
  "queue.logs": "Log",
  "queue.metrics": "Metriche",
  "queue.noSelection": "Seleziona un job per vedere log e metriche",
  "queue.noJobs": "La coda è vuota",
  "queue.priority": "Priorità",
  "queue.eta": "ETA",
  "queue.fps": "FPS",
  "queue.size": "Dimensione",
  "queue.watchAdd": "Aggiungi cartella",
  "queue.watchEmpty": "Nessuna watch folder configurata",
  "queue.stability": "Stabilità file",
  "queue.conflict": "Conflitti",
  "queue.dryRun": "Dry-run",
  "queue.detailsTab": "Job",
  "debug.title": "Debug & Diagnostica",
  "debug.system": "Sistema",
  "debug.gpu": "GPU",
  "debug.deps": "Dipendenze",
  "debug.logs": "Log",
  "debug.actions": "Azioni",
  "debug.scan": "Riscansiona",
  "debug.benchmark": "Benchmark",
  "debug.testEncoders": "Test encoder",
  "debug.bundle": "Report diagnostico",
  "debug.ipc": "IPC Inspector",
  "debug.cache": "Cache",
  "debug.proxies": "Proxy",
  "debug.safeMode": "Safe mode",
  "debug.activeBackend": "Backend attivo",
  "debug.hwUnavailable": "Hardware non disponibile",
  "settings.title": "Impostazioni",
  "settings.general": "Generale",
  "settings.theme": "Tema",
  "settings.accent": "Accent",
  "settings.language": "Lingua",
  "settings.performance": "Performance",
  "settings.hardware": "Accelerazione",
  "settings.notifications": "Notifiche native",
  "settings.startMinimized": "Avvia in tray",
  "settings.runAtLogin": "Avvio automatico",
  "settings.cache": "Cache (MB)",
  "settings.memory": "Limite memoria (MB)",
  "settings.autosave": "Autosave (secondi)",
  "settings.watch": "Watch folder attive",
  "settings.save": "Salva impostazioni",
  "settings.shortcuts": "Scorciatoie",
  "settings.safeMode": "Safe mode (disabilita plugin e GPU)",
  "settings.telemetry": "Telemetria (sempre disattivata)",
  "common.cancel": "Annulla",
  "common.close": "Chiudi",
  "common.save": "Salva",
  "common.search": "Cerca",
  "common.loading": "Caricamento…",
  "common.error": "Errore",
  "common.ok": "OK",
  "common.offlineHint": "File mancante: usa Rilink per riconnetterlo.",
  "status.ready": "Pronto",
  "status.autosaved": "Autosave completato",
  "onboarding.title": "Benvenuto in MoliCut",
  "onboarding.body": "GPU-first, codec hardware rilevati all’avvio, coda di render persistente e debug integrato. Importa un media per iniziare.",
  "onboarding.start": "Inizia",
  "onboarding.skip": "Non mostrare più",
  "palette.placeholder": "Digita un comando…"
};
const en = {
  "app.tagline": "Professional video editor · open source",
  "menu.file": "File",
  "menu.edit": "Edit",
  "menu.sequence": "Sequence",
  "menu.clip": "Clip",
  "menu.effects": "Effects",
  "menu.view": "View",
  "menu.window": "Window",
  "menu.help": "Help",
  "menu.new": "New project",
  "menu.open": "Open project…",
  "menu.save": "Save",
  "menu.import": "Import media…",
  "menu.export": "Export / Send to queue…",
  "menu.settings": "Settings…",
  "menu.undo": "Undo",
  "menu.redo": "Redo",
  "menu.cut": "Split at playhead",
  "menu.delete": "Delete selection",
  "menu.queue": "Render Queue",
  "menu.debug": "Debug panel",
  "menu.commandPalette": "Command palette",
  "media.title": "Media Bin",
  "media.import": "Import",
  "media.search": "Search media…",
  "media.empty": "No media yet. Drop files here or press Import.",
  "media.offline": "Offline",
  "preview.empty": "No clip under the playhead",
  "preview.scopes": "Scopes",
  "preview.safeArea": "Safe area",
  "timeline.title": "Timeline",
  "timeline.empty": "Drag media here to start",
  "inspector.title": "Inspector",
  "inspector.video": "Video",
  "inspector.audio": "Audio",
  "inspector.color": "Color",
  "inspector.effects": "Effects",
  "inspector.noSelection": "Select a clip in the timeline",
  "inspector.noSelectionHint": "Parameters, effects and keyframes will appear here.",
  "export.title": "Export",
  "export.subtitle": "Every export goes through the Media Encoder queue",
  "export.source": "Source",
  "export.preset": "Preset",
  "export.output": "Output",
  "export.estimated": "Estimated size",
  "export.queue": "Add to queue",
  "queue.title": "Render Queue",
  "queue.jobs": "Jobs",
  "queue.watch": "Watch folder",
  "queue.presets": "Presets",
  "queue.settings": "Queue settings",
  "queue.all": "All",
  "queue.queued": "Queued",
  "queue.running": "Running",
  "queue.done": "Done",
  "queue.errors": "Errors",
  "queue.noJobs": "Queue is empty",
  "queue.noSelection": "Select a job to see logs and metrics",
  "queue.concurrency": "Concurrent jobs",
  "queue.exportReport": "Export report",
  "debug.title": "Debug & Diagnostics",
  "debug.system": "System",
  "debug.gpu": "GPU",
  "debug.deps": "Dependencies",
  "debug.logs": "Logs",
  "debug.actions": "Actions",
  "settings.title": "Settings",
  "settings.save": "Save settings",
  "common.cancel": "Cancel",
  "common.close": "Close",
  "common.loading": "Loading…",
  "common.error": "Error"
};
const stored = (() => {
  try {
    return localStorage.getItem("molicut.language") ?? "it";
  } catch {
    return "it";
  }
})();
void instance.use(initReactI18next).init({
  resources: {
    it: { translation: it },
    en: { translation: { ...it, ...en } }
  },
  lng: stored,
  fallbackLng: "it",
  interpolation: { escapeValue: false }
});
function setLanguage(language) {
  void instance.changeLanguage(language);
  try {
    localStorage.setItem("molicut.language", language);
  } catch {
  }
}
const scriptRel = function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps2, importerUrl) {
  let promise = Promise.resolve();
  if (deps2 && deps2.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps2.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err2) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err2;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err2;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k2) => typeof obj[obj[k2]] !== "number");
    const filtered = {};
    for (const k2 of validKeys) {
      filtered[k2] = obj[k2];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
const getParsedType = (data) => {
  const t2 = typeof data;
  switch (t2) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
const ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el2 = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el2] = curr[el2] || { _errors: [] };
            } else {
              curr[el2] = curr[el2] || { _errors: [] };
              curr[el2]._errors.push(mapper(issue));
            }
            curr = curr[el2];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
const errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
let overrideErrorMap = errorMap;
function getErrorMap() {
  return overrideErrorMap;
}
const makeIssue = (params2) => {
  const { data, path, errorMaps, issueData } = params2;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m2) => !!m2).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === errorMap ? void 0 : errorMap
      // then global default map
    ].filter((x2) => !!x2)
  });
  ctx.common.issues.push(issue);
}
class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
const INVALID = Object.freeze({
  status: "aborted"
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x2) => x2.status === "aborted";
const isDirty = (x2) => x2.status === "dirty";
const isValid = (x2) => x2.status === "valid";
const isAsync = (x2) => typeof Promise !== "undefined" && x2 instanceof Promise;
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));
class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
const handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params2) {
  if (!params2)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params2;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params2;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params2) {
    const result = this.safeParse(data, params2);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params2) {
    const ctx = {
      common: {
        issues: [],
        async: params2?.async ?? false,
        contextualErrorMap: params2?.errorMap
      },
      path: params2?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err2) {
        if (err2?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params2) {
    const result = await this.safeParseAsync(data, params2);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params2) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params2?.errorMap,
        async: true
      },
      path: params2?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[0-9a-z]+$/;
const ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
const uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
const nanoidRegex = /^[a-z0-9_-]{21}$/i;
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
const durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
const emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
const _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
let emojiRegex;
const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
const ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
const base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
const dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch2) => ch2.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch2) => ch2.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch2) => ch2.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch2) => ch2.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch2) => ch2.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch2) => ch2.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch2) => ch2.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch2) => ch2.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch2) => ch2.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch2) => ch2.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch2) => ch2.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch2) => ch2.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch2) => ch2.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch2) => ch2.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch2) => ch2.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch2) => ch2.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "min") {
        if (min === null || ch2.value > min)
          min = ch2.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "max") {
        if (max === null || ch2.value < max)
          max = ch2.value;
      }
    }
    return max;
  }
}
ZodString.create = (params2) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params2?.coerce ?? false,
    ...processCreateParams(params2)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "min") {
        if (min === null || ch2.value > min)
          min = ch2.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "max") {
        if (max === null || ch2.value < max)
          max = ch2.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch2) => ch2.kind === "int" || ch2.kind === "multipleOf" && util.isInteger(ch2.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "finite" || ch2.kind === "int" || ch2.kind === "multipleOf") {
        return true;
      } else if (ch2.kind === "min") {
        if (min === null || ch2.value > min)
          min = ch2.value;
      } else if (ch2.kind === "max") {
        if (max === null || ch2.value < max)
          max = ch2.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params2) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params2?.coerce || false,
    ...processCreateParams(params2)
  });
};
class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "min") {
        if (min === null || ch2.value > min)
          min = ch2.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "max") {
        if (max === null || ch2.value < max)
          max = ch2.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params2) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params2?.coerce ?? false,
    ...processCreateParams(params2)
  });
};
class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params2) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params2?.coerce || false,
    ...processCreateParams(params2)
  });
};
class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "min") {
        if (min === null || ch2.value > min)
          min = ch2.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch2 of this._def.checks) {
      if (ch2.kind === "max") {
        if (max === null || ch2.value < max)
          max = ch2.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params2) => {
  return new ZodDate({
    checks: [],
    coerce: params2?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params2)
  });
};
class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params2) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params2)
  });
};
class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params2) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params2)
  });
};
class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params2) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params2)
  });
};
class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params2) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params2)
  });
};
class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params2) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params2)
  });
};
class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params2) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params2)
  });
};
class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params2) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params2)
  });
};
class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params2) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params2)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params2) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params2)
  });
};
ZodObject.strictCreate = (shape, params2) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params2)
  });
};
ZodObject.lazycreate = (shape, params2) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params2)
  });
};
class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params2) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params2)
  });
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params2) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params2)
  });
};
class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x2) => !!x2);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params2) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params2)
  });
};
class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}
class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params2) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params2)
  });
};
class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params2) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params2)
  });
};
class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params2) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params2)
  });
};
class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params2) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params2)
  });
};
function createZodEnum(values, params2) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params2)
  });
}
class ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
ZodNativeEnum.create = (values, params2) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params2)
  });
};
class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params2) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params2)
  });
};
class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params2) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params2)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params2) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params2)
  });
};
class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params2) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params2)
  });
};
class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params2) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params2)
  });
};
class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params2) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params2.default === "function" ? params2.default : () => params2.default,
    ...processCreateParams(params2)
  });
};
class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params2) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params2.catch === "function" ? params2.catch : () => params2.catch,
    ...processCreateParams(params2)
  });
};
class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params2) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params2)
  });
};
class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}
class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params2) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params2)
  });
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const booleanType = ZodBoolean.create;
const unknownType = ZodUnknown.create;
ZodNever.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const unionType = ZodUnion.create;
ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
ZodPromise.create;
ZodOptional.create;
ZodNullable.create;
const PROJECT_SCHEMA_VERSION = 1;
const idSchema = stringType().min(1).max(96);
const pathSchema = stringType().min(1).max(4096).refine((value) => /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith("/") || value.startsWith("\\\\"), {
  message: "Il path deve essere assoluto"
});
const keyframeSchema = objectType({
  id: idSchema,
  time: numberType().min(0),
  value: numberType(),
  easing: enumType(["linear", "easeIn", "easeOut", "easeInOut", "bezier"]),
  cubic: tupleType([numberType(), numberType(), numberType(), numberType()]).optional()
});
const transformSchema = objectType({
  x: numberType().min(-1e5).max(1e5),
  y: numberType().min(-1e5).max(1e5),
  scale: numberType().min(0.01).max(20),
  rotation: numberType().min(-3600).max(3600),
  opacity: numberType().min(0).max(1)
});
const effectSchema = objectType({
  id: idSchema,
  type: stringType().min(1).max(80),
  enabled: booleanType(),
  params: recordType(unionType([numberType(), stringType(), booleanType()])),
  keyframes: recordType(arrayType(keyframeSchema)).optional()
});
const clipTextSchema = objectType({
  content: stringType().max(2e3),
  fontSize: numberType().min(8).max(400),
  color: stringType().max(32),
  align: enumType(["left", "center", "right"]),
  /** Normalised position in the sequence frame (0..1). */
  x: numberType().min(0).max(1),
  y: numberType().min(0).max(1),
  background: booleanType()
});
const clipSchema = objectType({
  id: idSchema,
  name: stringType().min(1).max(512),
  trackId: idSchema,
  mediaId: idSchema.nullable(),
  start: numberType().min(0),
  duration: numberType().min(1e-3),
  inPoint: numberType().min(0),
  speed: numberType().min(0.05).max(20),
  color: stringType().max(32),
  volume: numberType().min(0).max(4),
  transform: transformSchema,
  effects: arrayType(effectSchema).max(128),
  keyframes: recordType(arrayType(keyframeSchema)).optional(),
  label: stringType().max(64).optional(),
  nestedSequenceId: idSchema.nullable().optional(),
  // Shared by an imported A/V pair: the picture clip and its audio twin form
  // one edit unit — move/trim/split/delete/duplicate propagate across it.
  linkId: idSchema.optional(),
  // Title/generator clip: mediaId is null and this payload is rendered by the
  // preview overlay and by the timeline export's drawtext chain.
  text: clipTextSchema.optional()
});
const trackSchema = objectType({
  id: idSchema,
  kind: enumType(["video", "audio", "subtitle", "adjustment", "nested"]),
  name: stringType().min(1).max(96),
  height: numberType().min(28).max(240),
  mute: booleanType(),
  solo: booleanType(),
  locked: booleanType(),
  volume: numberType().min(0).max(4),
  pan: numberType().min(-1).max(1),
  clips: arrayType(clipSchema).max(5e3)
});
const markerSchema = objectType({
  id: idSchema,
  time: numberType().min(0),
  label: stringType().max(256),
  color: stringType().max(32)
});
const sequenceSchema = objectType({
  id: idSchema,
  name: stringType().min(1).max(200),
  width: numberType().int().min(16).max(16384),
  height: numberType().int().min(16).max(16384),
  fps: numberType().min(1).max(480),
  duration: numberType().min(0),
  colorSpace: enumType(["rec709", "rec2020", "p3", "aces"]),
  tracks: arrayType(trackSchema).max(64),
  markers: arrayType(markerSchema).max(500)
});
const mediaAssetSchema = objectType({
  id: idSchema,
  path: pathSchema,
  name: stringType().min(1).max(512),
  kind: enumType(["video", "audio", "image"]),
  durationSec: numberType().min(0),
  width: numberType().int().min(0),
  height: numberType().int().min(0),
  fps: numberType().min(0),
  codec: stringType().max(80),
  audioCodec: stringType().max(80),
  channels: numberType().int().min(0).max(64),
  sampleRate: numberType().int().min(0).max(384e3),
  bitrate: numberType().min(0),
  colorSpace: stringType().max(80),
  // Raw ffprobe stream color metadata (matrix/primaries/range), optional for
  // backward compatibility with projects saved before it was recorded.
  colorMatrix: stringType().max(80).optional(),
  colorPrimaries: stringType().max(80).optional(),
  colorRange: stringType().max(20).optional(),
  rotation: numberType().min(-360).max(360),
  isHDR: booleanType(),
  timecode: stringType().max(80).nullable(),
  fileSize: numberType().min(0),
  proxyPath: stringType().max(4096).nullable(),
  thumbnailPath: stringType().max(4096).nullable(),
  status: enumType(["online", "offline", "processing", "error"]),
  importedAt: stringType()
});
const projectSchema = objectType({
  schemaVersion: literalType(PROJECT_SCHEMA_VERSION),
  id: idSchema,
  name: stringType().min(1).max(200),
  createdAt: stringType(),
  modifiedAt: stringType(),
  activeSequenceId: idSchema,
  sequences: arrayType(sequenceSchema).min(1).max(64),
  media: arrayType(mediaAssetSchema).max(1e4),
  notes: stringType().max(2e4).optional()
});
const videoCodecSchema = enumType(["h264", "hevc", "av1", "vp9", "prores", "dnxhr", "gif", "png", "mjpeg", "none"]);
const encoderPolicySchema = enumType(["auto", "hardware", "software"]);
const colorSpaceSchema = enumType(["rec709", "rec2020", "p3", "aces"]);
const hdrSchema = enumType(["none", "hdr10", "hlg"]);
const videoSettingsSchema = objectType({
  codec: videoCodecSchema,
  encoderPolicy: encoderPolicySchema,
  width: numberType().int().min(16).max(16384).nullable(),
  height: numberType().int().min(16).max(16384).nullable(),
  fps: numberType().min(1).max(480).nullable(),
  bitrateMode: enumType(["cbr", "vbr", "crf"]),
  bitrateKbps: numberType().int().min(64).max(8e5),
  crf: numberType().int().min(0).max(63),
  gopSeconds: numberType().min(0.1).max(30),
  preset: stringType().max(32),
  profile: stringType().max(32).nullable(),
  pixelFormat: stringType().max(32),
  colorSpace: colorSpaceSchema,
  hdr: hdrSchema,
  hdrMastering: objectType({
    maxLuminance: numberType().min(1).max(1e4),
    minLuminance: numberType().min(0).max(1),
    maxCLL: numberType().min(0).max(1e4),
    maxFALL: numberType().min(0).max(1e4)
  }).optional()
});
const audioSettingsSchema = objectType({
  codec: enumType(["aac", "mp3", "pcm_s16le", "pcm_s24le", "opus", "none"]),
  bitrateKbps: numberType().int().min(32).max(8192),
  channels: numberType().int().min(1).max(32),
  sampleRate: numberType().int().min(8e3).max(384e3),
  loudness: objectType({
    enabled: booleanType(),
    targetLufs: numberType().min(-40).max(0),
    truePeakDb: numberType().min(-9).max(0),
    lra: numberType().min(1).max(50)
  })
});
const filterSettingsSchema = objectType({
  lut: stringType().max(4096).nullable(),
  burnSubtitles: booleanType(),
  subtitlePath: stringType().max(4096).nullable(),
  scaleMode: enumType(["fit", "fill", "stretch"]),
  colorConversion: booleanType()
});
const encodePresetSchema = objectType({
  id: idSchema,
  name: stringType().min(1).max(120),
  description: stringType().max(2e3),
  container: enumType(["mp4", "mov", "mkv", "webm", "wav", "mp3", "gif", "image2"]),
  video: videoSettingsSchema,
  audio: audioSettingsSchema,
  filters: filterSettingsSchema,
  output: objectType({ suffix: stringType().max(64), directory: stringType().max(4096).nullable() }),
  tags: arrayType(stringType().max(32)).max(20),
  version: numberType().int().min(1),
  builtin: booleanType(),
  createdAt: stringType(),
  updatedAt: stringType()
});
const jobStateSchema = enumType(["queued", "running", "paused", "done", "error", "canceled"]);
const jobMetricsSchema = objectType({
  avgFps: numberType().min(0),
  encodedFrames: numberType().min(0),
  durationMs: numberType().min(0),
  outputBytes: numberType().min(0),
  speed: numberType().min(0)
});
const queueJobSchema = objectType({
  id: idSchema,
  name: stringType().min(1).max(300),
  sourcePath: pathSchema,
  sourceMediaId: idSchema.nullable(),
  sequenceId: idSchema.nullable(),
  /** Set for timeline exports: the exact project snapshot to render. */
  timeline: objectType({
    project: projectSchema,
    sequenceId: idSchema
  }).nullable().optional(),
  preset: encodePresetSchema,
  outputPath: pathSchema,
  durationSec: numberType().min(0),
  hasAudio: booleanType(),
  state: jobStateSchema,
  priority: numberType().int().min(0).max(100),
  progress: numberType().min(0).max(100),
  fps: numberType().min(0),
  speed: numberType().min(0),
  etaSec: numberType().min(0),
  sizeBytes: numberType().min(0),
  attempts: numberType().int().min(0),
  maxRetries: numberType().int().min(0).max(20),
  error: stringType().max(8e3).nullable(),
  logs: arrayType(stringType().max(4e3)).max(2e3),
  groupId: stringType().max(96).nullable(),
  metrics: jobMetricsSchema,
  createdAt: stringType(),
  startedAt: stringType().nullable(),
  finishedAt: stringType().nullable(),
  nextAttemptAt: stringType().nullable()
});
const addJobInputSchema = objectType({
  sourcePath: pathSchema.optional(),
  name: stringType().min(1).max(300).optional(),
  mediaId: idSchema.nullable().optional(),
  sequenceId: idSchema.nullable().optional(),
  /** Timeline export: render the whole sequence instead of a single media file. */
  timeline: objectType({
    project: projectSchema,
    sequenceId: idSchema
  }).optional(),
  presetId: idSchema.optional(),
  preset: encodePresetSchema.optional(),
  outputPath: pathSchema.optional(),
  durationSec: numberType().min(0).optional(),
  hasAudio: booleanType().optional(),
  priority: numberType().int().min(0).max(100).default(50),
  groupId: stringType().max(96).nullable().optional(),
  maxRetries: numberType().int().min(0).max(20).default(3)
});
const watchFolderSchema = objectType({
  id: idSchema,
  path: pathSchema,
  presetId: idSchema,
  outputDir: pathSchema,
  enabled: booleanType(),
  recursive: booleanType(),
  extensions: arrayType(stringType().max(16)).min(1).max(40),
  namePattern: stringType().max(300).nullable(),
  excludePattern: stringType().max(300).nullable(),
  stabilityMs: numberType().int().min(500).max(12e4),
  action: enumType(["queue", "proxy", "ignore"]),
  conflict: enumType(["suffix", "overwrite", "skip"]),
  dryRun: booleanType(),
  createdAt: stringType()
});
const watchLogSchema = objectType({
  at: stringType(),
  folderId: idSchema,
  level: enumType(["info", "warn", "error"]),
  message: stringType().max(2e3),
  file: stringType().max(4096).optional()
});
const hardwareEncoderSchema = objectType({
  id: stringType().max(40),
  name: stringType().max(120),
  vendor: enumType(["nvidia", "amd", "intel", "apple", "software"]),
  available: booleanType(),
  codecs: arrayType(stringType().max(32)),
  testedOk: booleanType().nullable(),
  testDetail: stringType().max(2e3).nullable()
});
const gpuInfoSchema = objectType({
  model: stringType().max(200),
  vendor: stringType().max(100),
  vramMB: numberType().min(0),
  driverVersion: stringType().max(80),
  api: arrayType(stringType().max(24))
});
const diskInfoSchema = objectType({
  mount: stringType().max(40),
  fs: stringType().max(32),
  sizeGB: numberType().min(0),
  freeGB: numberType().min(0),
  kind: enumType(["ssd", "hdd", "unknown"])
});
const hardwareProfileSchema = objectType({
  hardwareHash: stringType(),
  scannedAt: stringType(),
  platform: stringType(),
  arch: stringType(),
  cpu: objectType({
    manufacturer: stringType(),
    brand: stringType(),
    cores: numberType(),
    physicalCores: numberType(),
    speedGHz: numberType(),
    flags: arrayType(stringType().max(32))
  }),
  memoryTotalGB: numberType(),
  memoryFreeGB: numberType(),
  gpus: arrayType(gpuInfoSchema),
  disks: arrayType(diskInfoSchema),
  os: objectType({
    platform: stringType(),
    distro: stringType(),
    release: stringType(),
    kernel: stringType(),
    build: stringType()
  }),
  encoders: arrayType(hardwareEncoderSchema),
  hwaccels: arrayType(stringType().max(40)),
  acceleration: objectType({
    preferredBackend: stringType().max(40),
    hardwareAvailable: booleanType(),
    webgpu: booleanType(),
    webgl2: booleanType(),
    recommendedConcurrency: numberType().int().min(1).max(16),
    notes: arrayType(stringType().max(500)).max(40)
  })
});
const dependencyStatusSchema = objectType({
  id: stringType().max(40),
  name: stringType().max(120),
  required: booleanType(),
  path: stringType().max(4096).nullable(),
  version: stringType().max(120).nullable(),
  expectedSha256: stringType().max(128).nullable(),
  actualSha256: stringType().max(128).nullable(),
  status: enumType(["ok", "missing", "corrupt", "unsupported"]),
  detail: stringType().max(2e3)
});
const logEntrySchema = objectType({
  id: numberType(),
  at: stringType(),
  level: enumType(["debug", "info", "warn", "error"]),
  scope: stringType().max(64),
  message: stringType().max(8e3)
});
const metricsSnapshotSchema = objectType({
  at: stringType(),
  cpuPercent: numberType(),
  memoryUsedMB: numberType(),
  memoryTotalMB: numberType(),
  gpuPercent: numberType().nullable(),
  renderCacheMB: numberType(),
  activeWorkers: numberType(),
  previewFps: numberType(),
  droppedFrames: numberType()
});
const settingsSchema = objectType({
  theme: enumType(["dark", "light", "system"]),
  accent: stringType().max(24),
  language: enumType(["it", "en"]),
  hardwareOverride: enumType(["auto", "nvidia", "amd", "intel", "apple", "vaapi", "software"]),
  previewQuality: enumType(["auto", "quarter", "half", "full"]),
  maxConcurrentJobs: numberType().int().min(1).max(16),
  queueMaxJobs: numberType().int().min(10).max(1e4),
  queueRetentionDays: numberType().int().min(1).max(365),
  cpuLimitPercent: numberType().int().min(10).max(100),
  memoryLimitMB: numberType().int().min(512).max(262144),
  cacheSizeMB: numberType().int().min(256).max(1048576),
  notifications: booleanType(),
  startMinimized: booleanType(),
  runAtLogin: booleanType(),
  shutdownAfterQueue: booleanType(),
  watchEnabled: booleanType(),
  autosaveSeconds: numberType().int().min(5).max(600),
  telemetry: literalType(false),
  safeMode: booleanType(),
  /** When true and a GPU encoder exists, export never falls back to CPU. */
  gpuOnly: booleanType().default(true),
  shortcuts: recordType(stringType().max(40)),
  recentProjects: arrayType(stringType().max(4096)).max(12)
});
const defaultSettings = {
  theme: "dark",
  accent: "#4f8dff",
  language: "it",
  hardwareOverride: "auto",
  previewQuality: "auto",
  maxConcurrentJobs: 1,
  queueMaxJobs: 500,
  queueRetentionDays: 30,
  cpuLimitPercent: 85,
  memoryLimitMB: 8192,
  cacheSizeMB: 4096,
  notifications: true,
  startMinimized: false,
  runAtLogin: false,
  shutdownAfterQueue: false,
  watchEnabled: true,
  autosaveSeconds: 120,
  telemetry: false,
  safeMode: false,
  gpuOnly: true,
  shortcuts: {
    "command.palette": "Ctrl+Shift+P",
    "debug.panel": "Ctrl+Shift+D",
    "timeline.split": "Ctrl+K",
    "timeline.rippleDelete": "Shift+Delete",
    "timeline.addTitle": "T",
    "timeline.snap": "S",
    "timeline.delete": "Delete",
    "playback.playPause": "Space",
    "project.save": "Ctrl+S",
    "project.saveAs": "Ctrl+Shift+S",
    "export.dialog": "Ctrl+M",
    "queue.window": "Ctrl+Shift+Q"
  },
  recentProjects: []
};
function uid(prefix = "id") {
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && "randomUUID" in cryptoObj) return `${prefix}_${cryptoObj.randomUUID().slice(0, 8)}`;
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function lerp(a, b, t2) {
  return a + (b - a) * clamp(t2, 0, 1);
}
function roundTo(value, decimals = 2) {
  const f2 = 10 ** decimals;
  return Math.round(value * f2) / f2;
}
function formatTimecode(seconds, fps = 30) {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  const totalFrames = Math.round(safe * fps);
  const frames = totalFrames % Math.round(fps);
  const totalSeconds = Math.floor(totalFrames / fps);
  const s = totalSeconds % 60;
  const m2 = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const p2 = (n2) => String(n2).padStart(2, "0");
  return `${p2(h)}:${p2(m2)}:${p2(s)}:${p2(frames)}`;
}
function formatClock(seconds) {
  const safe = Math.max(0, seconds);
  const s = Math.floor(safe % 60);
  const m2 = Math.floor(safe / 60) % 60;
  const h = Math.floor(safe / 3600);
  const p2 = (n2) => String(n2).padStart(2, "0");
  return h > 0 ? `${h}:${p2(m2)}:${p2(s)}` : `${p2(m2)}:${p2(s)}`;
}
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${roundTo(bytes / 1024 ** i, i === 0 ? 0 : 1)} ${units[i]}`;
}
function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m2 = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m2}m ${String(s).padStart(2, "0")}s`;
}
function formatNumber(value, locale = "it-IT") {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}
function cubicBezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t2) => ((ax * t2 + bx) * t2 + cx) * t2;
  const sampleY = (t2) => ((ay * t2 + by) * t2 + cy) * t2;
  const sampleDX = (t2) => (3 * ax * t2 + 2 * bx) * t2 + cx;
  const solve = (x3) => {
    let guess = x3;
    for (let i = 0; i < 8; i++) {
      const err2 = sampleX(guess) - x3;
      if (Math.abs(err2) < 1e-5) return guess;
      const d = sampleDX(guess);
      if (Math.abs(d) < 1e-6) break;
      guess -= err2 / d;
    }
    return x3;
  };
  return (t2) => sampleY(solve(clamp(t2, 0, 1)));
}
const easings = {
  linear: (t2) => t2,
  easeIn: (t2) => t2 * t2,
  easeOut: (t2) => 1 - (1 - t2) * (1 - t2),
  easeInOut: (t2) => t2 < 0.5 ? 2 * t2 * t2 : 1 - (-2 * t2 + 2) ** 2 / 2
};
function interpolateKeyframes(keyframes, time, fallback) {
  if (keyframes.length === 0) return fallback;
  const sorted = [...keyframes].sort((a, b) => a.time - b.time);
  const first = sorted[0];
  if (time <= first.time) return first.value;
  const last = sorted[sorted.length - 1];
  if (time >= last.time) return last.value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (time >= a.time && time <= b.time) {
      const span = b.time - a.time || 1;
      const t2 = (time - a.time) / span;
      let eased = t2;
      if (b.easing === "bezier" && b.cubic) {
        eased = cubicBezier(b.cubic[0], b.cubic[1], b.cubic[2], b.cubic[3])(t2);
      } else if (b.easing in easings) {
        eased = easings[b.easing](t2);
      }
      return lerp(a.value, b.value, eased);
    }
  }
  return last.value;
}
function deepClone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
function createTrack(kind, index) {
  const prefix = kind === "video" ? "V" : kind === "audio" ? "A" : kind === "subtitle" ? "T" : kind === "adjustment" ? "ADJ" : "N";
  return {
    id: uid("trk"),
    kind,
    name: `${prefix}${index}`,
    height: kind === "audio" ? 56 : kind === "subtitle" ? 48 : 72,
    mute: false,
    solo: false,
    locked: false,
    volume: 1,
    pan: 0,
    clips: []
  };
}
function createSequence(name = "Sequence 01", width = 1920, height = 1080, fps = 30) {
  return {
    id: uid("seq"),
    name,
    width,
    height,
    fps,
    duration: 300,
    colorSpace: "rec709",
    tracks: [createTrack("video", 2), createTrack("video", 1), createTrack("subtitle", 1), createTrack("audio", 1)],
    markers: []
  };
}
function createProject(name = "Untitled Project") {
  const sequence = createSequence("Sequence 01");
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: uid("prj"),
    name,
    createdAt: now2,
    modifiedAt: now2,
    activeSequenceId: sequence.id,
    sequences: [sequence],
    media: []
  };
}
function getActiveSequence(project2) {
  return project2.sequences.find((s) => s.id === project2.activeSequenceId) ?? project2.sequences[0];
}
function sequenceContentDuration(sequence) {
  let end = 0;
  for (const track of sequence.tracks) {
    for (const clip of track.clips) end = Math.max(end, clip.start + clip.duration);
  }
  return end;
}
function refreshSequenceDurations(project2) {
  for (const sequence of project2.sequences) {
    const end = sequenceContentDuration(sequence);
    sequence.duration = Math.max(30, Math.ceil((end + 5) / 5) * 5);
  }
}
const __vite_import_meta_env__$1 = {};
const createStoreImpl = (createState) => {
  let state;
  const listeners2 = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners2.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners2.add(listener);
    return () => listeners2.delete(listener);
  };
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners2.clear();
  };
  const api = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const { useDebugValue } = React$2;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore(api, selector = identity, equalityFn) {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api, selector, equalityFn);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const IPC_CHANNEL_LIST = [
  "app:info",
  "settings:get",
  "settings:set",
  "settings:reset",
  "project:new",
  "project:open",
  "project:openDialog",
  "project:save",
  "project:autosave",
  "project:recoverAutosave",
  "project:recent",
  "project:exportInterchange",
  "media:importDialog",
  "media:importPaths",
  "media:probe",
  "media:thumbnail",
  "media:waveform",
  "media:relink",
  "media:chooseRelink",
  "media:missing",
  "queue:list",
  "queue:add",
  "queue:action",
  "queue:reorder",
  "queue:setPriority",
  "queue:setConcurrency",
  "queue:openWindow",
  "queue:exportReport",
  "presets:list",
  "presets:save",
  "presets:delete",
  "presets:export",
  "presets:import",
  "presets:suggest",
  "watch:list",
  "watch:add",
  "watch:update",
  "watch:remove",
  "watch:logs",
  "watch:test",
  "system:profile",
  "system:scan",
  "system:benchmark",
  "system:testEncoder",
  "deps:status",
  "deps:download",
  "debug:logs",
  "debug:clientError",
  "debug:ipcStats",
  "debug:metrics",
  "debug:action",
  "debug:bundle",
  "window:control",
  "shell:reveal",
  "updater:check",
  "updater:install",
  "plugins:list",
  "plugins:install",
  "plugins:toggle"
];
const empty = objectType({}).strict();
const okSchema = objectType({ ok: literalType(true) });
const queueStatsSchema = objectType({
  queued: numberType(),
  running: numberType(),
  paused: numberType(),
  done: numberType(),
  error: numberType(),
  canceled: numberType(),
  total: numberType(),
  progress: numberType(),
  aggregateFps: numberType()
});
const appInfoSchema = objectType({
  name: stringType(),
  version: stringType(),
  electron: stringType(),
  chrome: stringType(),
  node: stringType(),
  platform: stringType(),
  arch: stringType(),
  userDataPath: stringType(),
  isPackaged: booleanType(),
  recoveredFromCrash: booleanType(),
  ffmpegAvailable: booleanType(),
  dbDriver: stringType()
});
const benchmarkResultSchema = objectType({
  at: stringType(),
  cpuScore: numberType(),
  gpuScore: numberType().nullable(),
  diskReadMBs: numberType(),
  diskWriteMBs: numberType(),
  renderFps: numberType().nullable(),
  durationMs: numberType(),
  details: arrayType(stringType())
});
const encoderTestSchema = objectType({
  encoderId: stringType(),
  ok: booleanType(),
  encodeFps: numberType().nullable(),
  detail: stringType(),
  durationMs: numberType()
});
const pluginInfoSchema = objectType({
  id: stringType(),
  name: stringType(),
  version: stringType(),
  vendor: stringType(),
  description: stringType(),
  permissions: arrayType(stringType()),
  enabled: booleanType(),
  signed: booleanType(),
  verified: booleanType(),
  path: stringType()
});
const ipcStatsSchema = objectType({
  channels: arrayType(
    objectType({
      channel: stringType(),
      calls: numberType(),
      errors: numberType(),
      avgMs: numberType(),
      lastMs: numberType(),
      lastAt: stringType().nullable()
    })
  ),
  totalCalls: numberType(),
  totalErrors: numberType()
});
const ipcRoutes = {
  "app:info": { input: empty, output: appInfoSchema },
  "settings:get": { input: empty, output: objectType({ settings: settingsSchema }) },
  "settings:set": {
    input: objectType({ patch: settingsSchema.partial() }),
    output: objectType({ settings: settingsSchema })
  },
  "settings:reset": { input: empty, output: objectType({ settings: settingsSchema }) },
  "project:new": { input: objectType({ name: stringType().min(1).max(200) }), output: objectType({ project: projectSchema }) },
  "project:open": {
    input: objectType({ path: pathSchema.optional() }),
    output: objectType({ project: projectSchema, path: stringType() })
  },
  "project:openDialog": {
    input: empty,
    output: objectType({ canceled: booleanType(), project: projectSchema.optional(), path: stringType().optional() })
  },
  "project:save": {
    input: objectType({ project: projectSchema, path: pathSchema.optional() }),
    output: objectType({ path: stringType(), savedAt: stringType(), canceled: booleanType() })
  },
  "project:autosave": {
    input: objectType({ project: projectSchema }),
    output: objectType({ path: stringType(), savedAt: stringType() })
  },
  "project:recoverAutosave": {
    input: empty,
    output: objectType({ project: projectSchema, path: stringType(), savedAt: stringType() }).nullable()
  },
  "project:recent": { input: empty, output: objectType({ items: arrayType(stringType()) }) },
  "project:exportInterchange": {
    input: objectType({
      project: projectSchema,
      sequenceId: stringType(),
      format: enumType(["edl", "fcpxml", "xml"])
    }),
    output: objectType({ path: stringType().nullable(), canceled: booleanType() })
  },
  "media:importDialog": {
    input: objectType({ generateProxies: booleanType().default(false) }),
    output: objectType({ assets: arrayType(mediaAssetSchema), canceled: booleanType() })
  },
  "media:importPaths": {
    input: objectType({ paths: arrayType(pathSchema).min(1).max(200), generateProxies: booleanType().default(false) }),
    output: objectType({ assets: arrayType(mediaAssetSchema) })
  },
  "media:probe": { input: objectType({ path: pathSchema }), output: objectType({ asset: mediaAssetSchema }) },
  "media:thumbnail": {
    input: objectType({ path: pathSchema, timeSec: numberType().min(0).max(86400).default(1) }),
    output: objectType({ dataUrl: stringType(), fromCache: booleanType() })
  },
  "media:waveform": {
    input: objectType({ path: pathSchema, buckets: numberType().int().min(64).max(16384).default(2048) }),
    output: objectType({ peaks: arrayType(numberType()), durationSec: numberType() })
  },
  "media:relink": {
    input: objectType({ assetId: stringType(), newPath: pathSchema }),
    output: objectType({ asset: mediaAssetSchema })
  },
  "media:chooseRelink": {
    input: objectType({ assetId: stringType(), name: stringType().optional() }),
    output: objectType({ asset: mediaAssetSchema.nullable(), canceled: booleanType() })
  },
  "media:missing": {
    input: objectType({ paths: arrayType(pathSchema).max(1e4) }),
    output: objectType({ missing: arrayType(stringType()) })
  },
  "queue:list": {
    input: empty,
    output: objectType({ jobs: arrayType(queueJobSchema), stats: queueStatsSchema, concurrency: numberType() })
  },
  "queue:add": {
    input: objectType({ items: arrayType(addJobInputSchema).min(1).max(500) }),
    output: objectType({ jobs: arrayType(queueJobSchema) })
  },
  "queue:action": {
    input: objectType({
      action: enumType([
        "pause",
        "resume",
        "cancel",
        "retry",
        "remove",
        "duplicate",
        "stop-after-current",
        "pause-all",
        "resume-all",
        "clear-finished"
      ]),
      jobId: stringType().optional(),
      value: booleanType().optional()
    }),
    output: objectType({ jobs: arrayType(queueJobSchema) })
  },
  "queue:reorder": {
    input: objectType({ jobId: stringType(), toIndex: numberType().int().min(0).max(1e5) }),
    output: objectType({ jobs: arrayType(queueJobSchema) })
  },
  "queue:setPriority": {
    input: objectType({ jobId: stringType(), priority: numberType().int().min(0).max(100) }),
    output: objectType({ jobs: arrayType(queueJobSchema) })
  },
  "queue:setConcurrency": {
    input: objectType({ value: numberType().int().min(1).max(16) }),
    output: objectType({ jobs: arrayType(queueJobSchema) })
  },
  "queue:openWindow": { input: empty, output: okSchema },
  "queue:exportReport": {
    input: objectType({ format: enumType(["json", "csv"]), jobIds: arrayType(stringType()).optional() }),
    output: objectType({ path: stringType(), canceled: booleanType() })
  },
  "presets:list": { input: empty, output: objectType({ presets: arrayType(encodePresetSchema) }) },
  "presets:save": { input: objectType({ preset: encodePresetSchema }), output: objectType({ preset: encodePresetSchema }) },
  "presets:delete": { input: objectType({ id: stringType() }), output: objectType({ presets: arrayType(encodePresetSchema) }) },
  "presets:export": {
    input: objectType({ ids: arrayType(stringType()).optional() }),
    output: objectType({ path: stringType().nullable(), canceled: booleanType() })
  },
  "presets:import": {
    input: empty,
    output: objectType({ presets: arrayType(encodePresetSchema), canceled: booleanType() })
  },
  "presets:suggest": {
    input: objectType({ asset: mediaAssetSchema }),
    output: objectType({ presets: arrayType(encodePresetSchema) })
  },
  "watch:list": { input: empty, output: objectType({ folders: arrayType(watchFolderSchema) }) },
  "watch:add": {
    input: objectType({ folder: watchFolderSchema.omit({ id: true, createdAt: true }) }),
    output: objectType({ folder: watchFolderSchema })
  },
  "watch:update": { input: objectType({ folder: watchFolderSchema }), output: objectType({ folder: watchFolderSchema }) },
  "watch:remove": { input: objectType({ id: stringType() }), output: objectType({ folders: arrayType(watchFolderSchema) }) },
  "watch:logs": {
    input: objectType({ limit: numberType().int().min(1).max(1e3).default(200) }),
    output: objectType({ logs: arrayType(watchLogSchema) })
  },
  "watch:test": {
    input: objectType({ id: stringType() }),
    output: objectType({ matches: arrayType(stringType()), scanned: numberType() })
  },
  "system:profile": { input: empty, output: objectType({ profile: hardwareProfileSchema.nullable() }) },
  "system:scan": { input: objectType({ force: booleanType().default(false) }), output: objectType({ profile: hardwareProfileSchema }) },
  "system:benchmark": { input: empty, output: benchmarkResultSchema },
  "system:testEncoder": {
    input: objectType({ encoderId: stringType(), codec: enumType(["h264", "hevc", "av1"]) }),
    output: encoderTestSchema
  },
  "deps:status": { input: empty, output: objectType({ dependencies: arrayType(dependencyStatusSchema) }) },
  "deps:download": {
    input: objectType({ component: enumType(["ffmpeg", "ffprobe", "all"]) }),
    output: objectType({ dependencies: arrayType(dependencyStatusSchema), detail: stringType() })
  },
  "debug:logs": {
    input: objectType({ level: enumType(["debug", "info", "warn", "error"]).optional(), limit: numberType().int().min(1).max(5e3).default(500) }),
    output: objectType({ logs: arrayType(logEntrySchema) })
  },
  "debug:clientError": {
    input: objectType({
      message: stringType().min(1).max(8e3),
      stack: stringType().max(16e3).optional(),
      componentStack: stringType().max(16e3).optional(),
      source: stringType().max(200).optional()
    }),
    output: okSchema
  },
  "debug:ipcStats": { input: empty, output: ipcStatsSchema },
  "debug:metrics": { input: empty, output: metricsSnapshotSchema },
  "debug:action": {
    input: objectType({
      action: enumType([
        "reset-cache",
        "regenerate-proxies",
        "flush-shaders",
        "restart-engine",
        "redetect-hardware",
        "repair-queue-db",
        "safe-mode-on",
        "safe-mode-off",
        "clear-logs"
      ]),
      confirmation: booleanType().optional()
    }),
    output: objectType({ ok: booleanType(), detail: stringType() })
  },
  "debug:bundle": { input: empty, output: objectType({ path: stringType() }) },
  "window:control": {
    input: objectType({ action: enumType(["minimize", "maximize", "close", "toggle-devtools", "open-queue", "open-editor"]) }),
    output: okSchema
  },
  "shell:reveal": { input: objectType({ path: pathSchema }), output: okSchema },
  "updater:check": { input: empty, output: objectType({ status: enumType(["disabled", "checking", "none", "available", "error"]), version: stringType().optional(), message: stringType().optional() }) },
  "updater:install": { input: empty, output: okSchema },
  "plugins:list": { input: empty, output: objectType({ plugins: arrayType(pluginInfoSchema) }) },
  "plugins:install": { input: objectType({ path: pathSchema }), output: objectType({ plugin: pluginInfoSchema }) },
  "plugins:toggle": { input: objectType({ id: stringType(), enabled: booleanType() }), output: objectType({ plugins: arrayType(pluginInfoSchema) }) }
};
const ROUTE_KEYS = Object.keys(ipcRoutes);
if (ROUTE_KEYS.some((channel) => !IPC_CHANNEL_LIST.includes(channel))) {
  throw new Error("IPC contract contains channels missing from channelList.ts");
}
enumType([
  "VALIDATION",
  "UNAUTHORIZED",
  "RATE_LIMITED",
  "NOT_FOUND",
  "CONFLICT",
  "CANCELED",
  "FFMPEG",
  "INTERNAL"
]);
({
  "queue:changed": objectType({ jobs: arrayType(queueJobSchema), stats: queueStatsSchema }),
  "queue:progress": objectType({
    jobId: stringType(),
    progress: numberType(),
    fps: numberType(),
    speed: numberType(),
    etaSec: numberType(),
    sizeBytes: numberType()
  }),
  "queue:log": objectType({ jobId: stringType(), line: stringType() }),
  "scan:progress": objectType({ stage: stringType(), percent: numberType(), message: stringType() }),
  toast: objectType({
    kind: enumType(["info", "success", "warn", "error"]),
    message: stringType(),
    action: objectType({ label: stringType(), channel: stringType(), payload: unknownType() }).optional()
  }),
  "relink:request": objectType({ mediaId: stringType(), path: stringType() }),
  "updater:status": objectType({ status: stringType(), version: stringType().optional(), message: stringType().optional() }),
  "settings:changed": objectType({ settings: settingsSchema }),
  "media:proxy-ready": objectType({ mediaId: stringType(), proxyPath: stringType() })
});
const FIXED_DATE = "2026-01-01T00:00:00.000Z";
const baseVideo = {
  codec: "h264",
  encoderPolicy: "auto",
  width: null,
  height: null,
  fps: null,
  bitrateMode: "vbr",
  bitrateKbps: 12e3,
  crf: 20,
  gopSeconds: 2,
  preset: "medium",
  profile: null,
  pixelFormat: "yuv420p",
  colorSpace: "rec709",
  hdr: "none"
};
const baseAudio = {
  codec: "aac",
  bitrateKbps: 192,
  channels: 2,
  sampleRate: 48e3,
  loudness: { enabled: false, targetLufs: -16, truePeakDb: -1, lra: 11 }
};
function seed(input) {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    container: input.container,
    video: { ...baseVideo, ...input.video },
    audio: { ...baseAudio, ...input.audio },
    filters: { lut: null, burnSubtitles: false, subtitlePath: null, scaleMode: "fit", colorConversion: true },
    output: { suffix: input.suffix ?? "", directory: null },
    tags: input.tags,
    version: 1,
    builtin: true,
    createdAt: FIXED_DATE,
    updatedAt: FIXED_DATE
  };
}
function builtinPresets() {
  return [
    seed({
      id: "builtin-youtube-1080p",
      name: "YouTube 1080p",
      description: "H.264 1080p30 VBR 12 Mbps, AAC 192 kbps, faststart.",
      container: "mp4",
      video: { width: 1920, height: 1080, fps: 30, bitrateKbps: 12e3, preset: "medium", profile: "high" },
      audio: { codec: "aac", bitrateKbps: 192 },
      tags: ["web", "youtube", "h264"]
    }),
    seed({
      id: "builtin-youtube-4k",
      name: "YouTube 4K",
      description: "H.265/HEVC 2160p VBR 45 Mbps con fallback hardware automatico.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 30,
        bitrateKbps: 45e3,
        preset: "slow",
        profile: "main10",
        pixelFormat: "yuv420p10le"
      },
      audio: { bitrateKbps: 256 },
      tags: ["web", "youtube", "hevc", "4k"]
    }),
    seed({
      id: "builtin-vimeo-1080p",
      name: "Vimeo 1080p",
      description: "H.264 1080p VBR 10 Mbps, audio AAC 192 kbps.",
      container: "mp4",
      video: { width: 1920, height: 1080, bitrateKbps: 1e4 },
      tags: ["web", "vimeo"]
    }),
    seed({
      id: "builtin-instagram-reels",
      name: "Instagram Reels",
      description: "Verticale 1080x1920 30 fps, 8 Mbps, AAC 128 kbps.",
      container: "mp4",
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8e3, preset: "veryfast" },
      audio: { bitrateKbps: 128 },
      tags: ["social", "vertical", "instagram"]
    }),
    seed({
      id: "builtin-tiktok",
      name: "TikTok 1080x1920",
      description: "Verticale 9:16, GOP 1s, bitrate 8 Mbps, loudness -14 LUFS.",
      container: "mp4",
      video: { width: 1080, height: 1920, fps: 30, bitrateKbps: 8e3, gopSeconds: 1, preset: "veryfast" },
      audio: { bitrateKbps: 128, loudness: { enabled: true, targetLufs: -14, truePeakDb: -1, lra: 9 } },
      tags: ["social", "vertical", "tiktok"]
    }),
    seed({
      id: "builtin-broadcast-prores-422hq",
      name: "ProRes 422 HQ",
      description: "Master broadcast Apple ProRes 422 HQ 1080p, PCM 24-bit 48 kHz.",
      container: "mov",
      video: { codec: "prores", width: 1920, height: 1080, fps: 25, bitrateMode: "vbr", bitrateKbps: 22e4, profile: "hq", pixelFormat: "yuv422p10le" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304 },
      tags: ["broadcast", "prores", "master"]
    }),
    seed({
      id: "builtin-broadcast-dnxhr-hqx",
      name: "DNxHR HQX",
      description: "Avid DNxHR HQX 10-bit 1080p per workflow broadcast.",
      container: "mov",
      video: { codec: "dnxhr", width: 1920, height: 1080, fps: 25, bitrateKbps: 18e4, profile: "hqx", pixelFormat: "yuv422p10le" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304 },
      tags: ["broadcast", "dnxhr", "master"]
    }),
    seed({
      id: "builtin-master-hdr10",
      name: "Master HDR10",
      description: "HEVC 10-bit, Rec.2020 PQ, metadata HDR10 statici, 60 Mbps.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 24,
        bitrateKbps: 6e4,
        profile: "main10",
        pixelFormat: "yuv420p10le",
        colorSpace: "rec2020",
        hdr: "hdr10",
        hdrMastering: { maxLuminance: 1e3, minLuminance: 5e-3, maxCLL: 1e3, maxFALL: 400 }
      },
      audio: { bitrateKbps: 320 },
      tags: ["hdr", "master", "hdr10"]
    }),
    seed({
      id: "builtin-master-hlg",
      name: "Master HLG",
      description: "HEVC 10-bit HLG per distribuzione broadcast HDR.",
      container: "mp4",
      video: {
        codec: "hevc",
        width: 3840,
        height: 2160,
        fps: 25,
        bitrateKbps: 5e4,
        profile: "main10",
        pixelFormat: "yuv420p10le",
        colorSpace: "rec2020",
        hdr: "hlg"
      },
      tags: ["hdr", "hlg", "broadcast"]
    }),
    seed({
      id: "builtin-audio-wav",
      name: "WAV 48 kHz 24-bit",
      description: "Solo audio PCM 24-bit, loudness normalization opzionale.",
      container: "wav",
      video: { codec: "none" },
      audio: { codec: "pcm_s24le", bitrateKbps: 2304, sampleRate: 48e3 },
      tags: ["audio", "wav"]
    }),
    seed({
      id: "builtin-audio-mp3",
      name: "MP3 320 kbps",
      description: "Audio MP3 CBR 320 kbps 44.1 kHz.",
      container: "mp3",
      video: { codec: "none" },
      audio: { codec: "mp3", bitrateKbps: 320, sampleRate: 44100 },
      tags: ["audio", "mp3"]
    }),
    seed({
      id: "builtin-audio-aac",
      name: "AAC 256 kbps",
      description: "Audio AAC-LC 256 kbps dentro container MP4 (solo audio).",
      container: "mp4",
      video: { codec: "none" },
      audio: { codec: "aac", bitrateKbps: 256 },
      tags: ["audio", "aac"]
    }),
    seed({
      id: "builtin-gif",
      name: "GIF 720p",
      description: "GIF 15 fps, palette 256 colori, larghezza 720.",
      container: "gif",
      video: { codec: "gif", width: 720, height: null, fps: 15, bitrateMode: "crf", crf: 0 },
      audio: { codec: "none" },
      tags: ["image", "gif", "social"]
    }),
    seed({
      id: "builtin-webm-vp9",
      name: "WebM VP9",
      description: "VP9 CRF 32 + Opus 128 kbps, per web moderno.",
      container: "webm",
      video: { codec: "vp9", bitrateMode: "crf", crf: 32, preset: "good", pixelFormat: "yuv420p" },
      audio: { codec: "opus", bitrateKbps: 128 },
      tags: ["web", "webm", "vp9"]
    }),
    seed({
      id: "builtin-av1",
      name: "AV1 SVT 1080p",
      description: "SVT-AV1 CRF 30, massima efficienza, fallback software.",
      container: "mp4",
      video: { codec: "av1", width: 1920, height: 1080, bitrateMode: "crf", crf: 30, preset: "6" },
      tags: ["web", "av1", "efficient"]
    }),
    seed({
      id: "builtin-image-png",
      name: "Sequenza PNG",
      description: "Image sequence PNG RGBA, un frame per file.",
      container: "image2",
      video: { codec: "png", bitrateMode: "crf", crf: 0, pixelFormat: "rgba" },
      audio: { codec: "none" },
      suffix: "_%04d",
      tags: ["image", "sequence", "vfx"]
    })
  ];
}
const now = () => (/* @__PURE__ */ new Date()).toISOString();
const demoAssets = [
  {
    id: "med_city",
    path: "C:\\Demo\\City_Night_HDR.mp4",
    name: "City_Night_HDR.mp4",
    kind: "video",
    durationSec: 32,
    width: 3840,
    height: 2160,
    fps: 25,
    codec: "hevc",
    audioCodec: "aac",
    channels: 2,
    sampleRate: 48e3,
    bitrate: 8e7,
    colorSpace: "smpte2084",
    rotation: 0,
    isHDR: true,
    timecode: "01:00:00:00",
    fileSize: 512e6,
    proxyPath: null,
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  },
  {
    id: "med_interview",
    path: "C:\\Demo\\Interview_A.mov",
    name: "Interview_A.mov",
    kind: "video",
    durationSec: 48,
    width: 1920,
    height: 1080,
    fps: 25,
    codec: "prores",
    audioCodec: "pcm_s24le",
    channels: 2,
    sampleRate: 48e3,
    bitrate: 22e7,
    colorSpace: "bt709",
    rotation: 0,
    isHDR: false,
    timecode: "10:00:00:00",
    fileSize: 13e8,
    proxyPath: "C:\\Proxies\\interview_540p.mp4",
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  },
  {
    id: "med_drone",
    path: "C:\\Demo\\Drone_Coast.mp4",
    name: "Drone_Coast.mp4",
    kind: "video",
    durationSec: 24,
    width: 3840,
    height: 2160,
    fps: 30,
    codec: "h264",
    audioCodec: "aac",
    channels: 2,
    sampleRate: 48e3,
    bitrate: 6e7,
    colorSpace: "bt709",
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 21e7,
    proxyPath: null,
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  },
  {
    id: "med_ambient",
    path: "C:\\Demo\\Ambient_Bed.wav",
    name: "Ambient_Bed.wav",
    kind: "audio",
    durationSec: 62,
    width: 0,
    height: 0,
    fps: 0,
    codec: "pcm_s24le",
    audioCodec: "pcm_s24le",
    channels: 2,
    sampleRate: 48e3,
    bitrate: 2304,
    colorSpace: "unknown",
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 18e6,
    proxyPath: null,
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  },
  {
    id: "med_logo",
    path: "C:\\Demo\\MoliCut_Logo.png",
    name: "MoliCut_Logo.png",
    kind: "image",
    durationSec: 5,
    width: 1200,
    height: 1200,
    fps: 30,
    codec: "png",
    audioCodec: "",
    channels: 0,
    sampleRate: 0,
    bitrate: 0,
    colorSpace: "unknown",
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 12e5,
    proxyPath: null,
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  }
];
const gradients = {
  med_city: ["#2b1055", "#7597de"],
  med_interview: ["#42275a", "#734b6d"],
  med_drone: ["#134e5e", "#71b280"],
  med_ambient: ["#232526", "#414345"],
  med_logo: ["#7c5cff", "#38d9a9"]
};
function artwork(id2, label) {
  const [a, b] = gradients[id2] ?? ["#1c1d26", "#34364a"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="270"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="480" height="270" fill="url(#g)"/><g fill="white" opacity=".18"><circle cx="90" cy="80" r="60"/><circle cx="380" cy="200" r="90"/></g><text x="24" y="238" font-family="Inter,system-ui,sans-serif" font-size="18" font-weight="600" fill="white" opacity=".92">${label}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
function demoProject() {
  const project2 = createProject("MoliCut Demo");
  project2.media = demoAssets.map((a) => ({ ...a }));
  const sequence = project2.sequences[0];
  sequence.name = "Trailer 01";
  sequence.duration = 48;
  const v2 = sequence.tracks.find((track) => track.kind === "video" && track.name === "V2");
  const v1 = sequence.tracks.find((track) => track.kind === "video" && track.name === "V1");
  const a1 = sequence.tracks.find((track) => track.kind === "audio");
  if (v2 && v1 && a1) {
    v2.clips.push({
      id: uid("clip"),
      name: "City_Night_HDR.mp4",
      trackId: v2.id,
      mediaId: "med_city",
      start: 0,
      duration: 14,
      inPoint: 2,
      speed: 1,
      color: "#7c5cff",
      volume: 1,
      transform: { x: 0, y: 0, scale: 1.04, rotation: 0, opacity: 1 },
      effects: [
        { id: uid("fx"), type: "Cinematic LUT", enabled: true, params: { intensity: 0.85, contrast: 1.12 } },
        { id: uid("fx"), type: "Gaussian Blur", enabled: false, params: { radius: 4 } }
      ]
    });
    v1.clips.push({
      id: uid("clip"),
      name: "Interview_A.mov",
      trackId: v1.id,
      mediaId: "med_interview",
      start: 12,
      duration: 16,
      inPoint: 5,
      speed: 1,
      color: "#4c8dff",
      volume: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: [{ id: uid("fx"), type: "Sharpen", enabled: true, params: { amount: 0.4 } }]
    });
    v1.clips.push({
      id: uid("clip"),
      name: "Drone_Coast.mp4",
      trackId: v1.id,
      mediaId: "med_drone",
      start: 28,
      duration: 12,
      inPoint: 0,
      speed: 1,
      color: "#38d9a9",
      volume: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: []
    });
    a1.clips.push({
      id: uid("clip"),
      name: "Ambient_Bed.wav",
      trackId: a1.id,
      mediaId: "med_ambient",
      start: 0,
      duration: 42,
      inPoint: 0,
      speed: 1,
      color: "#ffb547",
      volume: 0.55,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
      effects: []
    });
  }
  sequence.markers = [
    { id: uid("mk"), time: 12, label: "Intervista", color: "#4c8dff" },
    { id: uid("mk"), time: 28, label: "B-roll drone", color: "#38d9a9" }
  ];
  project2.activeSequenceId = sequence.id;
  return project2;
}
const listeners = /* @__PURE__ */ new Map();
function emit(event, payload) {
  for (const fn of listeners.get(event) ?? []) fn(payload);
}
let settings = { ...defaultSettings, shortcuts: { ...defaultSettings.shortcuts }, recentProjects: ["C:\\Projects\\MoliCut Demo.mcut"] };
let project = demoProject();
let presets = builtinPresets();
let folders = [
  {
    id: "wf_demo",
    path: "C:\\Watch\\Incoming",
    presetId: "builtin-youtube-1080p",
    outputDir: "C:\\Watch\\Out",
    enabled: false,
    recursive: true,
    extensions: ["mp4", "mov"],
    namePattern: null,
    excludePattern: "*_tmp*",
    stabilityMs: 4e3,
    action: "queue",
    conflict: "suffix",
    dryRun: true,
    createdAt: now()
  }
];
const jobs = [];
const timers = /* @__PURE__ */ new Map();
function presetById(id2) {
  return presets.find((p2) => p2.id === id2) ?? presets[0];
}
function makeJob(source, presetId, state = "queued") {
  const preset = presetById(presetId);
  const name = source.split(/[\\/]/).pop() ?? "source";
  return {
    id: uid("job"),
    name: `${name} → ${preset.name}`,
    sourcePath: source,
    sourceMediaId: demoAssets.find((a) => a.name === name)?.id ?? null,
    sequenceId: null,
    preset,
    outputPath: `C:\\Exports\\${name.replace(/\.[^.]+$/, "")}_${preset.video.height ?? 1080}p.mp4`,
    durationSec: 30,
    hasAudio: true,
    state,
    priority: 50,
    progress: state === "done" ? 100 : 0,
    fps: 0,
    speed: 0,
    etaSec: 0,
    sizeBytes: state === "done" ? 148e6 : 0,
    attempts: state === "done" ? 1 : 0,
    maxRetries: 3,
    error: null,
    logs: [`[queue] accodato ${now()}`],
    groupId: null,
    metrics: state === "done" ? { avgFps: 61.4, encodedFrames: 1842, durationMs: 3e4, outputBytes: 148e6, speed: 1.9 } : { avgFps: 0, encodedFrames: 0, durationMs: 0, outputBytes: 0, speed: 0 },
    createdAt: now(),
    startedAt: state === "done" ? now() : null,
    finishedAt: state === "done" ? now() : null,
    nextAttemptAt: null
  };
}
jobs.push(
  { ...makeJob("C:\\Demo\\Interview_A.mov", "builtin-youtube-1080p", "done") },
  { ...makeJob("C:\\Demo\\Drone_Coast.mp4", "builtin-instagram-reels", "done") }
);
function stats() {
  const count = (state) => jobs.filter((j) => j.state === state).length;
  return {
    queued: count("queued"),
    running: count("running"),
    paused: count("paused"),
    done: count("done"),
    error: count("error"),
    canceled: count("canceled"),
    total: jobs.length,
    progress: jobs.length ? Math.round(jobs.reduce((s, j) => s + (j.state === "done" ? 100 : j.progress), 0) / jobs.length * 10) / 10 : 0,
    aggregateFps: jobs.filter((j) => j.state === "running").reduce((s, j) => s + j.fps, 0)
  };
}
function queueChanged() {
  emit("queue:changed", { jobs: [...jobs], stats: stats() });
}
function startSim(job) {
  if (timers.has(job.id)) return;
  job.state = "running";
  job.startedAt = now();
  job.attempts += 1;
  job.logs.push(`[queue] avvio tentativo ${job.attempts}/4`);
  emit("queue:log", { jobId: job.id, line: job.logs[job.logs.length - 1] });
  queueChanged();
  const interval = setInterval(() => {
    job.progress = Math.min(100, job.progress + 2.4);
    job.fps = 48 + Math.round(Math.random() * 30);
    job.speed = 7.4;
    job.etaSec = Math.max(0, Math.round((100 - job.progress) * 1.4));
    job.sizeBytes = Math.round(job.progress / 100 * 148e6);
    emit("queue:progress", {
      jobId: job.id,
      progress: job.progress,
      fps: job.fps,
      speed: job.speed,
      etaSec: job.etaSec,
      sizeBytes: job.sizeBytes
    });
    if (Math.random() < 0.12) {
      const line = `[ffmpeg] frame=${Math.round(job.progress * 18)} fps=${job.fps} speed=${job.speed}x`;
      job.logs.push(line);
      emit("queue:log", { jobId: job.id, line });
    }
    queueChanged();
    if (job.progress >= 100) {
      clearInterval(interval);
      timers.delete(job.id);
      job.state = "done";
      job.finishedAt = now();
      job.metrics = { avgFps: job.fps, encodedFrames: 1842, durationMs: 18400, outputBytes: 148e6, speed: job.speed };
      job.logs.push(`[queue] completato (mock encoder)`);
      emit("queue:changed", { jobs: [...jobs], stats: stats() });
      emit("toast", { kind: "success", message: `Render completato: ${job.name}` });
    }
  }, 700);
  timers.set(job.id, interval);
}
setTimeout(() => {
  const first = jobs.find((j) => j.state === "queued");
  if (first) startSim(first);
}, 4e3);
const logs = [
  { id: 1, at: now(), level: "info", scope: "main", message: "MoliCut 0.1.0 starting (win32-x64) — modalità demo browser" },
  { id: 2, at: now(), level: "info", scope: "hardware", message: "scan complete: cpu=AMD Ryzen 9 7950X gpu=NVIDIA GeForce RTX 4070 backend=nvenc" },
  { id: 3, at: now(), level: "warn", scope: "deps", message: "checksum SHA-256 non pinnato per ffmpeg (win32-x64)" },
  { id: 4, at: now(), level: "info", scope: "queue", message: "restored 2 jobs, concurrency=1" },
  { id: 5, at: now(), level: "error", scope: "media", message: "proxy failed for med_drone: FFmpeg non disponibile (demo)" }
];
const profile = {
  hardwareHash: "demo-hardware-hash",
  scannedAt: now(),
  platform: "win32",
  arch: "x64",
  cpu: {
    manufacturer: "AMD",
    brand: "Ryzen 9 7950X 16-Core Processor",
    cores: 32,
    physicalCores: 16,
    speedGHz: 4.5,
    flags: ["avx2", "avx512", "fma", "sse4_2"]
  },
  memoryTotalGB: 64,
  memoryFreeGB: 38.4,
  gpus: [
    { model: "NVIDIA GeForce RTX 4070", vendor: "NVIDIA", vramMB: 12282, driverVersion: "560.94", api: ["CUDA", "Vulkan", "DX12", "OpenCL"] }
  ],
  disks: [
    { mount: "C:", fs: "NTFS", sizeGB: 1863, freeGB: 612, kind: "ssd" },
    { mount: "D:", fs: "NTFS", sizeGB: 3726, freeGB: 1204, kind: "hdd" }
  ],
  os: { platform: "win32", distro: "Windows 11 Pro", release: "10.0.26100", kernel: "10.0.26100", build: "26100" },
  encoders: [
    { id: "nvenc", name: "NVIDIA NVENC", vendor: "nvidia", available: true, codecs: ["h264", "hevc", "av1"], testedOk: true, testDetail: "Encode 1s ok, 214 fps" },
    { id: "qsv", name: "Intel Quick Sync", vendor: "intel", available: false, codecs: [], testedOk: null, testDetail: null },
    { id: "amf", name: "AMD AMF", vendor: "amd", available: false, codecs: [], testedOk: null, testDetail: null },
    { id: "software", name: "Software (CPU)", vendor: "software", available: true, codecs: ["h264", "hevc", "av1", "vp9"], testedOk: true, testDetail: null }
  ],
  hwaccels: ["cuda", "dxva2", "qsv"],
  acceleration: {
    preferredBackend: "nvenc",
    hardwareAvailable: true,
    webgpu: true,
    webgl2: true,
    recommendedConcurrency: 2,
    notes: ["Backend preferito: nvenc. Selezione automatica all’avvio; override manuale nelle Impostazioni.", "GPU presente ma senza encoder supportati da FFmpeg su questa build."]
  }
};
const deps = [
  { id: "ffmpeg", name: "FFmpeg", required: true, path: "C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\bin\\ffmpeg.exe", version: "ffmpeg version 7.1", expectedSha256: null, actualSha256: "a7c4d1e9f832bc0091d9c0d1c7e2b7a1b2c3d4e5f60718293a4b5c6d7e8f9012", status: "ok", detail: "Firma SHA-256 verificata (a7c4d1e9f832…)." },
  { id: "ffprobe", name: "FFprobe", required: true, path: "C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\bin\\ffprobe.exe", version: "ffprobe version 7.1", expectedSha256: null, actualSha256: "b1c2d3e4f5061728394a5b6c7d8e9f00112233445566778899aabbccddeeff00", status: "ok", detail: "Firma SHA-256 verificata." },
  { id: "sqlite", name: "SQLite (better-sqlite3 / sql.js)", required: false, path: null, version: "better-sqlite3", expectedSha256: null, actualSha256: null, status: "ok", detail: "Driver nativo attivo." }
];
const invokeMock = async (channel, payload) => {
  await new Promise((r2) => setTimeout(r2, 60));
  switch (channel) {
    case "app:info":
      return ok({
        name: "MoliCut",
        version: "0.1.0-demo",
        electron: "33.4.11",
        chrome: "130.0.6723.191",
        node: "20.18.1",
        platform: "win32",
        arch: "x64",
        userDataPath: "C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut",
        isPackaged: false,
        recoveredFromCrash: false,
        ffmpegAvailable: true,
        dbDriver: "better-sqlite3"
      });
    case "settings:get":
      return ok({ settings });
    case "settings:set":
      settings = { ...settings, ...payload.patch, shortcuts: { ...settings.shortcuts, ...payload.patch.shortcuts ?? {} } };
      emit("settings:changed", { settings });
      return ok({ settings });
    case "settings:reset":
      settings = { ...defaultSettings };
      return ok({ settings });
    case "project:new":
      project = demoProject();
      project.name = payload.name;
      return ok({ project });
    case "project:open":
    case "project:openDialog":
      return ok({ project, path: "C:\\Projects\\MoliCut Demo.mcut", canceled: false });
    case "project:save":
      project = { ...payload.project, modifiedAt: now() };
      return ok({ path: payload.path ?? "C:\\Projects\\MoliCut Demo.mcut", savedAt: now(), canceled: false });
    case "project:autosave":
      project = payload.project;
      return ok({ path: "C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\projects\\demo.autosave.mcut", savedAt: now() });
    case "project:recoverAutosave":
      return ok(null);
    case "project:recent":
      return ok({ items: ["C:\\Projects\\MoliCut Demo.mcut", "C:\\Projects\\Client_Spot.mcut"] });
    case "project:exportInterchange":
      return ok({ path: `C:\\Exports\\sequence.${payload.format}`, canceled: false });
    case "media:importDialog":
    case "media:importPaths": {
      const pool = demoAssets.filter((a) => !project.media.some((m2) => m2.id === a.id));
      const added = pool.slice(0, Math.min(2, pool.length));
      if (added.length === 0) {
        return ok({ assets: [deliveryAsset()], canceled: false });
      }
      project = { ...project, media: [...project.media, ...added.map((a) => ({ ...a }))] };
      return ok({ assets: added, canceled: false });
    }
    case "media:probe":
      return ok({ asset: demoAssets.find((a) => a.path === payload.path) ?? deliveryAsset() });
    case "media:thumbnail": {
      const asset = project.media.find((a) => a.path === payload.path) ?? demoAssets[0];
      return ok({ dataUrl: artwork(asset.id, asset.name), fromCache: true });
    }
    case "media:waveform": {
      const buckets = payload.buckets ?? 512;
      const peaks = Array.from({ length: buckets }, (_, i) => Math.abs(Math.sin(i / 7) * 0.65 + Math.sin(i / 31) * 0.3) * (i % 23 === 0 ? 0.9 : 0.8));
      return ok({ peaks, durationSec: 42 });
    }
    case "media:relink": {
      project = {
        ...project,
        media: project.media.map((m2) => m2.id === payload.assetId ? { ...m2, path: payload.newPath, status: "online" } : m2)
      };
      return ok({ asset: project.media.find((m2) => m2.id === payload.assetId) ?? deliveryAsset() });
    }
    case "media:chooseRelink": {
      const asset = { ...project.media.find((m2) => m2.id === payload.assetId) ?? deliveryAsset(), path: "D:\\Relink\\media_ricollegato.mp4", status: "online" };
      project = { ...project, media: project.media.map((m2) => m2.id === payload.assetId ? asset : m2) };
      return ok({ asset, canceled: false });
    }
    case "media:missing":
      return ok({ missing: [] });
    case "queue:list":
      return ok({ jobs: [...jobs], stats: stats(), concurrency: settings.maxConcurrentJobs });
    case "queue:add": {
      const created = payload.items.map((item) => {
        if (item.timeline) {
          const seq = item.timeline.project.sequences.find((entry) => entry.id === item.timeline.sequenceId);
          const job = makeJob(`${item.timeline.project.name}_${seq?.name ?? "Timeline"}`, item.presetId, "queued");
          job.timeline = item.timeline;
          job.sequenceId = item.timeline.sequenceId;
          job.name = item.name ?? `${item.timeline.project.name} — ${seq?.name ?? "Timeline"} → ${job.preset.name}`;
          job.outputPath = `C:\\Videos\\MoliCut\\${job.name.replace(/[\\/:*?"<>|]+/g, "-")}.mp4`;
          job.durationSec = item.durationSec ?? 30;
          return job;
        }
        return makeJob(item.sourcePath, item.presetId, "queued");
      });
      jobs.push(...created);
      queueChanged();
      setTimeout(() => {
        const next = jobs.find((j) => j.state === "queued" && !timers.has(j.id));
        if (next) startSim(next);
      }, 600);
      return ok({ jobs: created });
    }
    case "queue:action": {
      const job = jobs.find((j) => j.id === payload.jobId);
      switch (payload.action) {
        case "pause":
          jobs.forEach((j) => {
            if (j.state === "queued" || j.state === "running") {
              if (j.id === payload.jobId || !payload.jobId) {
                if (timers.has(j.id)) {
                  clearInterval(timers.get(j.id));
                  timers.delete(j.id);
                }
                j.state = payload.jobId ? "paused" : "paused";
              }
            }
          });
          break;
        case "resume":
          jobs.forEach((j) => {
            if (j.state === "paused") {
              j.state = "queued";
            }
          });
          setTimeout(() => {
            const next = jobs.find((j) => j.state === "queued");
            if (next) startSim(next);
          }, 400);
          break;
        case "pause-all":
          jobs.forEach((j) => {
            if (j.state === "queued" || j.state === "running") j.state = "paused";
            if (timers.has(j.id)) {
              clearInterval(timers.get(j.id));
              timers.delete(j.id);
            }
          });
          break;
        case "resume-all":
          jobs.forEach((j) => {
            if (j.state === "paused") j.state = "queued";
          });
          setTimeout(() => {
            const next = jobs.find((j) => j.state === "queued");
            if (next) startSim(next);
          }, 300);
          break;
        case "cancel":
          if (job) {
            if (timers.has(job.id)) clearInterval(timers.get(job.id));
            timers.delete(job.id);
            job.state = "canceled";
            job.finishedAt = now();
          }
          break;
        case "retry":
          if (job) {
            job.state = "queued";
            job.progress = 0;
            job.error = null;
            setTimeout(() => startSim(job), 300);
          }
          break;
        case "remove":
          if (job) {
            if (timers.has(job.id)) clearInterval(timers.get(job.id));
            timers.delete(job.id);
            jobs.splice(jobs.indexOf(job), 1);
          }
          break;
        case "duplicate":
          if (job) {
            const copy2 = { ...structuredClone(job), id: uid("job"), state: "queued", progress: 0, attempts: 0, finishedAt: null };
            jobs.push(copy2);
          }
          break;
        case "clear-finished":
          for (let i = jobs.length - 1; i >= 0; i--) {
            if (jobs[i].state === "done" || jobs[i].state === "canceled") jobs.splice(i, 1);
          }
          break;
      }
      queueChanged();
      return ok({ jobs: [...jobs] });
    }
    case "queue:reorder": {
      const from = jobs.findIndex((j) => j.id === payload.jobId);
      if (from >= 0) {
        const [moved] = jobs.splice(from, 1);
        if (moved) jobs.splice(payload.toIndex, 0, moved);
      }
      return ok({ jobs: [...jobs] });
    }
    case "queue:setPriority": {
      const job = jobs.find((j) => j.id === payload.jobId);
      if (job) job.priority = payload.priority;
      return ok({ jobs: [...jobs] });
    }
    case "queue:setConcurrency":
      settings = { ...settings, maxConcurrentJobs: payload.value };
      return ok({ jobs: [...jobs] });
    case "queue:openWindow":
      emit("toast", { kind: "info", message: "In Electron la Render Queue è una finestra separata (tray)." });
      return ok({ ok: true });
    case "queue:exportReport":
      return ok({ path: `C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\molicut-report.${payload.format}`, canceled: false });
    case "presets:list":
      return ok({ presets });
    case "presets:save": {
      const existing = presets.findIndex((p2) => p2.id === payload.preset.id);
      if (existing >= 0) presets[existing] = payload.preset;
      else presets.push(payload.preset);
      return ok({ preset: payload.preset });
    }
    case "presets:delete":
      presets = presets.filter((p2) => p2.id !== payload.id || p2.builtin);
      return ok({ presets });
    case "presets:export":
      return ok({ path: "C:\\Users\\%USER%\\molicut-presets.json", canceled: false });
    case "presets:import":
      return ok({ presets: [], canceled: false });
    case "presets:suggest": {
      const asset = payload.asset;
      return ok({ presets: presets.filter((p2) => asset.kind === "audio" ? p2.video.codec === "none" : p2.video.codec !== "none").slice(0, 3) });
    }
    case "watch:list":
      return ok({ folders });
    case "watch:add":
      folders = [...folders, { ...payload.folder, id: uid("wf"), createdAt: now() }];
      return ok({ folder: folders[folders.length - 1] });
    case "watch:update":
      folders = folders.map((f2) => f2.id === payload.folder.id ? payload.folder : f2);
      return ok({ folder: payload.folder });
    case "watch:remove":
      folders = folders.filter((f2) => f2.id !== payload.id);
      return ok({ folders });
    case "watch:logs":
      return ok({
        logs: [
          { at: now(), folderId: "wf_demo", level: "info", message: "[dry-run] queue → clip_001.mp4 (preset YouTube 1080p)", file: "C:\\Watch\\Incoming\\clip_001.mp4" },
          { at: now(), folderId: "wf_demo", level: "warn", message: "Output esistente, skip per policy" }
        ].slice(0, payload.limit ?? 200)
      });
    case "watch:test":
      return ok({ matches: ["C:\\Watch\\Incoming\\clip_001.mp4", "C:\\Watch\\Incoming\\interview_final.mov"], scanned: 8 });
    case "system:profile":
      return ok({ profile });
    case "system:scan": {
      for (const [stage, percent, message] of [
        ["cpu", 10, "Lettura CPU e memoria"],
        ["gpu", 30, "Rilevamento GPU"],
        ["ffmpeg", 55, "Interrogazione FFmpeg"],
        ["strategy", 80, "Calcolo strategia di accelerazione"],
        ["done", 100, "Scansione completata"]
      ]) {
        emit("scan:progress", { stage, percent, message });
        await new Promise((r2) => setTimeout(r2, 160));
      }
      return ok({ profile: { ...profile, scannedAt: now() } });
    }
    case "system:benchmark":
      await new Promise((r2) => setTimeout(r2, 900));
      return ok({
        at: now(),
        cpuScore: 2840,
        gpuScore: null,
        diskReadMBs: 3120,
        diskWriteMBs: 2210,
        renderFps: 486,
        durationMs: 2100,
        details: [
          "CPU hash: 18422 ops in 450ms, avg 0.024ms, p95 0.031ms",
          "Disco: 2210 MB/s write, 3120 MB/s read (32 MB)",
          "Encode CPU 1080p: 486 fps (libx264 veryfast)"
        ]
      });
    case "system:testEncoder":
      await new Promise((r2) => setTimeout(r2, 700));
      return ok({ encoderId: payload.encoderId, ok: true, encodeFps: 214, detail: "Encode 1s completato in 640ms", durationMs: 640 });
    case "deps:status":
      return ok({ dependencies: deps });
    case "deps:download":
      return ok({ dependencies: deps, detail: "Demo: download disabilitato nel browser." });
    case "debug:logs":
      return ok({ logs: payload.level ? logs.filter((l2) => l2.level === payload.level) : logs });
    case "debug:clientError":
      logs.unshift({ id: logs.length + 1, at: now(), level: "error", scope: payload.source ?? "renderer", message: payload.message });
      return ok({ ok: true });
    case "debug:ipcStats":
      return ok({
        channels: [
          { channel: "queue:list", calls: 84, errors: 0, avgMs: 1.2, lastMs: 0.8, lastAt: now() },
          { channel: "media:thumbnail", calls: 31, errors: 1, avgMs: 12.4, lastMs: 9.1, lastAt: now() },
          { channel: "settings:get", calls: 12, errors: 0, avgMs: 0.4, lastMs: 0.3, lastAt: now() },
          { channel: "system:scan", calls: 3, errors: 0, avgMs: 842, lastMs: 796, lastAt: now() }
        ],
        totalCalls: 130,
        totalErrors: 1
      });
    case "debug:metrics":
      return ok({
        at: now(),
        cpuPercent: 18 + Math.random() * 22,
        memoryUsedMB: 2860 + Math.random() * 240,
        memoryTotalMB: 65536,
        gpuPercent: 42 + Math.random() * 18,
        renderCacheMB: 184,
        activeWorkers: jobs.filter((j) => j.state === "running").length,
        previewFps: 59.9,
        droppedFrames: 0
      });
    case "debug:action":
      return ok({ ok: true, detail: `Azione "${payload.action}" eseguita (mock).` });
    case "debug:bundle":
      return ok({ path: "C:\\Users\\%USER%\\AppData\\Roaming\\MoliCut\\diagnostics\\molicut-diagnostic.zip" });
    case "window:control":
      return ok({ ok: true });
    case "shell:reveal":
      return ok({ ok: true });
    case "updater:check":
      return ok({ status: "disabled", message: "Updater attivo solo nei pacchetti firmati" });
    case "updater:install":
      return ok({ ok: true });
    case "plugins:list":
      return ok({ plugins: [] });
    case "plugins:install":
      return err("NOT_FOUND", "Installazione plugin disponibile solo in Electron");
    case "plugins:toggle":
      return ok({ plugins: [] });
    default:
      return err("NOT_FOUND", `Canale non implementato nel mock: ${channel}`);
  }
};
function deliveryAsset() {
  const id2 = uid("med");
  return {
    id: id2,
    path: `C:\\Incoming\\nuovo_media_${id2.slice(-4)}.mp4`,
    name: `nuovo_media_${id2.slice(-4)}.mp4`,
    kind: "video",
    durationSec: 18,
    width: 1920,
    height: 1080,
    fps: 25,
    codec: "h264",
    audioCodec: "aac",
    channels: 2,
    sampleRate: 48e3,
    bitrate: 12e6,
    colorSpace: "bt709",
    rotation: 0,
    isHDR: false,
    timecode: null,
    fileSize: 27e6,
    proxyPath: null,
    thumbnailPath: null,
    status: "online",
    importedAt: now()
  };
}
function ok(data) {
  return { ok: true, data };
}
function err(code, message) {
  return { ok: false, error: { code, message } };
}
function createMockBridge() {
  return {
    platform: "win32",
    versions: { electron: "33.4.11", chrome: "130.0.6723.191", node: "20.18.1" },
    isMock: true,
    getPathForFile(file) {
      return file.path ?? "";
    },
    invoke: invokeMock,
    on(event, listener) {
      const name = event;
      const set = listeners.get(name) ?? /* @__PURE__ */ new Set();
      set.add(listener);
      listeners.set(name, set);
      return () => set.delete(listener);
    }
  };
}
class BridgeError extends Error {
  code;
  details;
  constructor(code, message, details) {
    super(message);
    this.name = "BridgeError";
    this.code = code;
    this.details = details;
  }
}
let mock = null;
const bridge = () => {
  if (window.molicut) return window.molicut;
  mock ??= createMockBridge();
  return mock;
};
const isMock = () => !window.molicut;
const platform = () => bridge().platform;
function filePath(file) {
  return bridge().getPathForFile(file);
}
async function call(channel, payload) {
  let result;
  try {
    result = await bridge().invoke(channel, payload);
  } catch (err2) {
    throw new BridgeError("TRANSPORT", err2.message);
  }
  if (!result.ok) throw new BridgeError(result.error.code, result.error.message, result.error.details);
  return result.data;
}
function on(event, listener) {
  return bridge().on(event, (payload) => listener(payload));
}
function mediaSrc(path) {
  if (isMock()) return "";
  return `molicut-media://media/${encodeURIComponent(path)}`;
}
const MAX_HISTORY = 80;
function touch(project2) {
  return { ...project2, modifiedAt: (/* @__PURE__ */ new Date()).toISOString() };
}
function pruneSelection(project2, selection) {
  const ids = /* @__PURE__ */ new Set();
  for (const sequence of project2.sequences) {
    for (const track of sequence.tracks) for (const clip of track.clips) ids.add(clip.id);
  }
  const clipIds = selection.clipIds.filter((id2) => ids.has(id2));
  return { clipIds, trackId: clipIds.length > 0 ? selection.trackId : null };
}
const useProjectStore = create((set, get2) => {
  const mutate = (fn, options = {}) => {
    const state = get2();
    const snapshot = options.history === false ? null : deepClone(state.project);
    const draft = deepClone(state.project);
    fn(draft);
    refreshSequenceDurations(draft);
    set({
      project: touch(draft),
      dirty: true,
      history: snapshot ? { past: [...state.history.past, snapshot].slice(-MAX_HISTORY), future: [] } : state.history
    });
  };
  const findClip = (clipId) => {
    for (const track of get2().sequence().tracks) {
      const clip = track.clips.find((c) => c.id === clipId);
      if (clip) return { clip, track };
    }
    return null;
  };
  return {
    project: {
      schemaVersion: 1,
      id: "prj_boot",
      name: "Loading",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      modifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
      activeSequenceId: "seq_boot",
      sequences: [
        {
          id: "seq_boot",
          name: "Sequence 01",
          width: 1920,
          height: 1080,
          fps: 30,
          duration: 300,
          colorSpace: "rec709",
          tracks: [],
          markers: []
        }
      ],
      media: []
    },
    projectPath: null,
    dirty: false,
    history: { past: [], future: [] },
    selection: { clipIds: [], trackId: null },
    playhead: 0,
    playing: false,
    speed: 1,
    zoom: 42,
    tool: "select",
    snapping: true,
    waveforms: {},
    bootstrapped: false,
    autosaveAt: null,
    error: null,
    sequence: () => getActiveSequence(get2().project),
    bootstrap: async () => {
      try {
        const { settings: settings2 } = await call("settings:get", {});
        const info = await call("app:info", {});
        let restored = false;
        if (info.recoveredFromCrash) {
          try {
            const recovery = await call("project:recoverAutosave", {});
            if (recovery) {
              get2().setProject(recovery.project);
              set({ autosaveAt: recovery.savedAt });
              restored = true;
            }
          } catch (err2) {
            set({ error: err2.message });
          }
        }
        if (!restored) {
          const { project: project2 } = await call("project:new", { name: "Untitled Project" });
          get2().setProject(project2);
        }
        set({ zoom: settings2.previewQuality === "quarter" ? 28 : 42, bootstrapped: true });
      } catch (err2) {
        set({ error: err2.message, bootstrapped: true });
      }
    },
    setProject: (project2, path = null) => set({
      project: project2,
      projectPath: path,
      dirty: false,
      history: { past: [], future: [] },
      selection: { clipIds: [], trackId: null },
      playhead: 0,
      playing: false,
      waveforms: {}
    }),
    newProject: async (name = "Untitled Project") => {
      const { project: project2 } = await call("project:new", { name });
      get2().setProject(project2);
    },
    openProject: async () => {
      const result = await call("project:openDialog", {});
      if (result.canceled || !result.project) return;
      get2().setProject(result.project, result.path ?? null);
    },
    saveProject: async (saveAs = false) => {
      const result = await call("project:save", { project: get2().project, path: saveAs ? void 0 : get2().projectPath ?? void 0 });
      if (result.canceled) return;
      set({ projectPath: result.path, dirty: false });
    },
    autosave: async () => {
      if (!get2().dirty) return;
      const result = await call("project:autosave", { project: get2().project });
      set({ autosaveAt: result.savedAt, dirty: false });
    },
    importMedia: async () => {
      const result = await call("media:importDialog", { generateProxies: false });
      if (result.canceled) return [];
      get2().addMedia(result.assets);
      return result.assets;
    },
    addMedia: (assets) => {
      const existing = new Set(get2().project.media.map((m2) => m2.path));
      const fresh = assets.filter((a) => !existing.has(a.path));
      if (fresh.length === 0) return;
      mutate((draft) => {
        draft.media.push(...fresh);
      });
    },
    removeMedia: (mediaId) => mutate((draft) => {
      draft.media = draft.media.filter((m2) => m2.id !== mediaId);
      for (const sequence of draft.sequences) {
        for (const track of sequence.tracks) {
          track.clips = track.clips.filter((c) => c.mediaId !== mediaId);
        }
      }
    }),
    relinkMedia: async (mediaId) => {
      const current = get2().project.media.find((m2) => m2.id === mediaId);
      const result = await call("media:chooseRelink", { assetId: mediaId, name: current?.name });
      if (result.canceled || !result.asset) return;
      mutate((draft) => {
        draft.media = draft.media.map((m2) => m2.id === mediaId ? { ...result.asset, status: "online" } : m2);
      });
    },
    loadWaveform: async (mediaId) => {
      if (get2().waveforms[mediaId]) return;
      const asset = get2().project.media.find((m2) => m2.id === mediaId);
      if (!asset) return;
      try {
        const { peaks } = await call("media:waveform", { path: asset.path, buckets: 600 });
        set((state) => ({ waveforms: { ...state.waveforms, [mediaId]: peaks } }));
      } catch {
      }
    },
    addClip: (mediaId, trackId, start) => {
      const asset = get2().project.media.find((m2) => m2.id === mediaId);
      if (!asset) return;
      const sequence = get2().sequence();
      const requested = trackId ? sequence.tracks.find((t2) => t2.id === trackId && !t2.locked) : void 0;
      const hasAudio = asset.kind === "audio" || asset.audioCodec !== "" && asset.channels > 0;
      const at = Math.max(0, start ?? get2().playhead);
      const duration = asset.kind === "image" ? 5 : Math.max(0.1, asset.durationSec || 5);
      const audioTracks = sequence.tracks.filter((t2) => t2.kind === "audio" && !t2.locked);
      const videoTracks = sequence.tracks.filter((t2) => (t2.kind === "video" || t2.kind === "adjustment") && !t2.locked);
      const audioOnly = asset.kind === "audio" || asset.kind === "video" && hasAudio && requested?.kind === "audio";
      const target = audioOnly ? requested ?? [...audioTracks].reverse()[0] : requested && (requested.kind === "video" || requested.kind === "adjustment") ? requested : [...videoTracks].reverse()[0];
      if (!target) return;
      const clip = {
        id: uid("clip"),
        name: asset.name,
        trackId: target.id,
        mediaId: asset.id,
        start: at,
        duration,
        inPoint: 0,
        speed: 1,
        color: audioOnly ? "#ffb547" : "#4c8dff",
        volume: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
        effects: [],
        keyframes: {}
      };
      let twin = null;
      if (!audioOnly && asset.kind === "video" && hasAudio) {
        const audioTarget = [...audioTracks].reverse()[0];
        if (audioTarget) {
          clip.linkId = uid("link");
          twin = {
            ...clip,
            id: uid("clip"),
            trackId: audioTarget.id,
            color: "#ffb547"
          };
        }
      }
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        const targetTrack = seq?.tracks.find((t2) => t2.id === target.id);
        targetTrack?.clips.push(clip);
        if (twin) {
          const twinTrack = seq?.tracks.find((t2) => t2.id === twin.trackId);
          twinTrack?.clips.push(twin);
        }
      });
      set({
        selection: {
          clipIds: twin ? [clip.id, twin.id] : [clip.id],
          trackId: target.id
        }
      });
      if (target.kind === "audio" || twin) void get2().loadWaveform(mediaId);
    },
    moveClip: (clipId, start, trackId, recordHistory = true) => mutate((draft) => {
      const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
      if (!seq) return;
      let found = null;
      let originTrack = null;
      for (const track of seq.tracks) {
        const clip = track.clips.find((c) => c.id === clipId);
        if (clip) {
          found = clip;
          originTrack = track;
          break;
        }
      }
      if (!found || !originTrack) return;
      const moving = found;
      const from = originTrack;
      const requested = seq.tracks.find((t2) => t2.id === trackId);
      const isAudioClip = from.kind === "audio";
      const compatible = requested !== void 0 && !requested.locked && (isAudioClip ? requested.kind === "audio" : requested.kind === "video" || requested.kind === "adjustment");
      const target = compatible ? requested : from;
      const linked = [];
      if (moving.linkId) {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            for (const clip of track.clips) {
              if (clip.id !== moving.id && clip.linkId === moving.linkId) linked.push(clip);
            }
          }
        }
      }
      const minStart = Math.min(moving.start, ...linked.map((c) => c.start));
      const delta = Math.max(Math.max(0, start) - moving.start, -minStart);
      for (const clip of linked) clip.start = Math.max(0, clip.start + delta);
      moving.start = Math.max(0, moving.start + delta);
      if (target.id !== from.id) {
        const index = from.clips.findIndex((c) => c.id === moving.id);
        if (index >= 0) from.clips.splice(index, 1);
        target.clips.push(moving);
      }
      moving.trackId = target.id;
    }, { history: recordHistory }),
    trimClip: (clipId, edge, deltaSeconds, recordHistory = true) => mutate((draft) => {
      const locate = (id2) => {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            const clip = track.clips.find((c) => c.id === id2);
            if (clip) return clip;
          }
        }
        return null;
      };
      const main = locate(clipId);
      if (!main) return;
      const applyTrim = (clip, delta) => {
        if (edge === "left") {
          const speed = Math.max(0.05, clip.speed);
          const by2 = clamp(delta, -clip.inPoint / speed, clip.duration - 0.1);
          clip.start += by2;
          clip.inPoint = Math.max(0, clip.inPoint + by2 * speed);
          clip.duration = Math.max(0.1, clip.duration - by2);
          return by2;
        }
        const asset = draft.media.find((m2) => m2.id === clip.mediaId);
        const sourceMax = asset && asset.durationSec > 0 ? (asset.durationSec - clip.inPoint) / Math.max(0.01, clip.speed) - clip.duration : Number.POSITIVE_INFINITY;
        const by = clamp(delta, -(clip.duration - 0.1), sourceMax);
        clip.duration = Math.max(0.1, clip.duration + by);
        return by;
      };
      const applied = applyTrim(main, deltaSeconds);
      if (main.linkId) {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            for (const c of track.clips) {
              if (c.id !== main.id && c.linkId === main.linkId) applyTrim(c, applied);
            }
          }
        }
      }
    }, { history: recordHistory }),
    splitAtPlayhead: () => {
      const time = get2().playhead;
      const selected = get2().selection.clipIds;
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        if (!seq) return;
        const selectedLinks = /* @__PURE__ */ new Set();
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (clip.linkId && selected.includes(clip.id)) selectedLinks.add(clip.linkId);
          }
        }
        const rightLinks = /* @__PURE__ */ new Map();
        for (const track of seq.tracks) {
          if (track.locked) continue;
          const additions = [];
          for (const clip of track.clips) {
            const inside = time > clip.start + 0.01 && time < clip.start + clip.duration - 0.01;
            if (!inside) continue;
            if (selected.length > 0 && !selected.includes(clip.id) && !(clip.linkId && selectedLinks.has(clip.linkId))) continue;
            const offset = time - clip.start;
            const right = {
              ...deepClone(clip),
              id: uid("clip"),
              start: time,
              duration: clip.duration - offset,
              // Source time advances at the clip's speed, not at 1×.
              inPoint: clip.inPoint + offset * clip.speed
            };
            if (clip.linkId) {
              const link = rightLinks.get(clip.linkId) ?? uid("link");
              rightLinks.set(clip.linkId, link);
              right.linkId = link;
            }
            clip.duration = offset;
            additions.push(right);
          }
          track.clips.push(...additions);
        }
      });
    },
    addTextClip: (content = "Titolo") => {
      const sequence = get2().sequence();
      const at = Math.max(0, get2().playhead);
      const text = content.trim() || "Titolo";
      let target = sequence.tracks.find((track) => track.kind === "subtitle" && !track.locked) ?? null;
      const clip = {
        id: uid("clip"),
        name: text.slice(0, 48),
        trackId: target?.id ?? "pending",
        mediaId: null,
        start: at,
        duration: 5,
        inPoint: 0,
        speed: 1,
        color: "#c8b6ff",
        volume: 1,
        transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
        effects: [],
        keyframes: {},
        text: {
          content: text,
          fontSize: Math.max(24, Math.round(sequence.height * 0.07)),
          color: "#ffffff",
          align: "center",
          x: 0.5,
          y: 0.82,
          background: true
        }
      };
      let trackId = target?.id ?? "";
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        if (!seq) return;
        if (!target) {
          const created = createTrack("subtitle", seq.tracks.filter((t2) => t2.kind === "subtitle").length + 1);
          seq.tracks.unshift(created);
          target = created;
          trackId = created.id;
        }
        const live = seq.tracks.find((t2) => t2.id === target.id);
        if (!live) return;
        clip.trackId = live.id;
        live.clips.push(clip);
      });
      if (trackId) set({ selection: { clipIds: [clip.id], trackId } });
    },
    deleteSelected: () => {
      const ids = new Set(get2().selection.clipIds);
      if (ids.size === 0) return;
      mutate((draft) => {
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) {
            for (const c of track.clips) {
              if (!c.linkId || !ids.has(c.id)) continue;
              for (const track2 of sequence.tracks) {
                for (const c2 of track2.clips) if (c2.linkId === c.linkId) ids.add(c2.id);
              }
            }
          }
        }
        for (const sequence of draft.sequences) {
          for (const track of sequence.tracks) track.clips = track.clips.filter((c) => !ids.has(c.id));
        }
      });
      set({ selection: { clipIds: [], trackId: null } });
    },
    rippleDeleteSelected: () => {
      const ids = new Set(get2().selection.clipIds);
      if (ids.size === 0) return;
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        if (!seq) return;
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (!clip.linkId || !ids.has(clip.id)) continue;
            for (const other of seq.tracks.flatMap((t2) => t2.clips)) if (other.linkId === clip.linkId) ids.add(other.id);
          }
        }
        const gaps = /* @__PURE__ */ new Map();
        for (const track of seq.tracks) {
          for (const clip of track.clips) {
            if (!ids.has(clip.id)) continue;
            const list = gaps.get(track.id) ?? [];
            list.push({ start: clip.start, end: clip.start + clip.duration });
            gaps.set(track.id, list);
          }
        }
        for (const track of seq.tracks) {
          const ranges = (gaps.get(track.id) ?? []).sort((a, b) => a.start - b.start);
          track.clips = track.clips.filter((clip) => !ids.has(clip.id));
          if (ranges.length === 0) continue;
          for (const clip of track.clips) {
            let shift = 0;
            for (const range of ranges) {
              if (range.end <= clip.start + 1e-4) shift += range.end - range.start;
              else if (range.start < clip.start) clip.start = Math.max(range.start, clip.start - (clip.start - range.start));
            }
            clip.start = Math.max(0, clip.start - shift);
          }
        }
      });
      set({ selection: { clipIds: [], trackId: null } });
    },
    duplicateSelected: () => {
      const ids = new Set(get2().selection.clipIds);
      const created = [];
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        if (!seq) return;
        const links = /* @__PURE__ */ new Set();
        for (const track of seq.tracks) {
          for (const c of track.clips) if (c.linkId && ids.has(c.id)) links.add(c.linkId);
        }
        for (const track of seq.tracks) {
          for (const c of track.clips) if (c.linkId && links.has(c.linkId)) ids.add(c.id);
        }
        const linkRemap = /* @__PURE__ */ new Map();
        for (const track of seq.tracks) {
          const copies = track.clips.filter((c) => ids.has(c.id)).map((c) => {
            let link;
            if (c.linkId) {
              link = linkRemap.get(c.linkId) ?? uid("link");
              linkRemap.set(c.linkId, link);
            }
            const copy2 = { ...deepClone(c), id: uid("clip"), start: c.start + c.duration };
            if (link) copy2.linkId = link;
            created.push(copy2.id);
            return copy2;
          });
          track.clips.push(...copies);
        }
      });
      if (created.length) set({ selection: { clipIds: created, trackId: get2().selection.trackId } });
    },
    selectAllClips: () => {
      const sequence = get2().sequence();
      const clipIds = sequence.tracks.flatMap((track) => track.clips.map((clip) => clip.id));
      set({ selection: { clipIds, trackId: get2().selection.trackId ?? sequence.tracks[0]?.id ?? null } });
    },
    selectClip: (clipId, additive = false) => {
      if (!clipId) {
        set({ selection: { clipIds: [], trackId: null } });
        return;
      }
      const found = findClip(clipId);
      const current = get2().selection.clipIds;
      const base = additive ? current.includes(clipId) ? current.filter((id2) => id2 !== clipId) : [...current, clipId] : [clipId];
      let next = base;
      if (found?.clip.linkId) {
        const linkId = found.clip.linkId;
        const dropping = !base.includes(clipId);
        for (const track of get2().sequence().tracks) {
          for (const c of track.clips) {
            if (c.linkId !== linkId || c.id === clipId) continue;
            if (dropping) next = next.filter((id2) => id2 !== c.id);
            else if (!next.includes(c.id)) next = [...next, c.id];
          }
        }
      }
      set({ selection: { clipIds: next, trackId: found?.track.id ?? null } });
    },
    updateClip: (clipId, patch, recordHistory = true) => mutate((draft) => {
      for (const sequence of draft.sequences) {
        for (const track of sequence.tracks) {
          const clip = track.clips.find((c) => c.id === clipId);
          if (!clip) continue;
          Object.assign(clip, patch);
          if (clip.linkId && patch.volume !== void 0) {
            for (const track2 of sequence.tracks) {
              for (const c2 of track2.clips) {
                if (c2.id !== clip.id && c2.linkId === clip.linkId) c2.volume = patch.volume;
              }
            }
          }
        }
      }
    }, { history: recordHistory }),
    updateEffect: (clipId, effectId, patch, recordHistory = true) => mutate((draft) => {
      for (const sequence of draft.sequences) {
        for (const track of sequence.tracks) {
          const clip = track.clips.find((c) => c.id === clipId);
          const effect = clip?.effects.find((e) => e.id === effectId);
          if (effect) {
            if (patch.enabled !== void 0) effect.enabled = patch.enabled;
            if (patch.params) effect.params = { ...effect.params, ...patch.params };
          }
        }
      }
    }, { history: recordHistory }),
    addEffect: (clipId, type) => {
      const effect = {
        id: uid("fx"),
        type,
        enabled: true,
        params: defaultEffectParams(type)
      };
      get2().updateClip(clipId, {
        effects: [...findClip(clipId)?.clip.effects ?? [], effect]
      });
    },
    removeEffect: (clipId, effectId) => {
      const clip = findClip(clipId)?.clip;
      if (!clip) return;
      get2().updateClip(clipId, { effects: clip.effects.filter((e) => e.id !== effectId) });
    },
    toggleKeyframe: (clipId, property, value) => {
      const found = findClip(clipId);
      if (!found) return;
      const time = get2().playhead - found.clip.start;
      const existing = found.clip.keyframes?.[property] ?? [];
      const at = existing.find((k2) => Math.abs(k2.time - time) < 0.05);
      const next = at ? existing.filter((k2) => k2.id !== at.id) : [...existing, { id: uid("kf"), time, value, easing: "easeInOut" }];
      get2().updateClip(clipId, { keyframes: { ...found.clip.keyframes ?? {}, [property]: next } });
    },
    setPlayhead: (seconds) => set({ playhead: Math.max(0, seconds) }),
    setPlaying: (playing) => set({ playing }),
    togglePlay: () => set((s) => ({ playing: !s.playing, speed: s.speed })),
    setZoom: (zoom) => set({ zoom: clamp(zoom, 8, 320) }),
    setTool: (tool) => set({ tool }),
    toggleSnap: () => set((s) => ({ snapping: !s.snapping })),
    addTrack: (kind) => {
      mutate((draft) => {
        const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
        if (!seq) return;
        const count = seq.tracks.filter((t2) => t2.kind === kind).length + 1;
        const created = createTrack(kind, count);
        if (kind === "video" || kind === "adjustment") {
          const lastVideo = seq.tracks.map((t2) => t2.kind).lastIndexOf("video");
          seq.tracks.splice(lastVideo >= 0 ? lastVideo + 1 : 0, 0, created);
        } else if (kind === "subtitle") {
          const lastText = seq.tracks.map((t2) => t2.kind).lastIndexOf("subtitle");
          if (lastText >= 0) {
            seq.tracks.splice(lastText + 1, 0, created);
          } else {
            const firstAudio = seq.tracks.findIndex((t2) => t2.kind === "audio");
            seq.tracks.splice(firstAudio >= 0 ? firstAudio : seq.tracks.length, 0, created);
          }
        } else {
          seq.tracks.push(created);
        }
      });
    },
    updateTrack: (trackId, patch, recordHistory = true) => mutate((draft) => {
      for (const sequence of draft.sequences) {
        const track = sequence.tracks.find((t2) => t2.id === trackId);
        if (track) Object.assign(track, patch);
      }
    }, { history: recordHistory }),
    addMarker: (label) => mutate((draft) => {
      const seq = draft.sequences.find((s) => s.id === draft.activeSequenceId);
      if (!seq) return;
      seq.markers.push({ id: uid("mk"), time: get2().playhead, label: label || `Marker ${seq.markers.length + 1}`, color: "#ffb547" });
    }),
    setActiveSequence: (sequenceId) => {
      const seq = get2().project.sequences.find((s) => s.id === sequenceId);
      if (!seq) return;
      mutate((draft) => {
        draft.activeSequenceId = sequenceId;
      }, { history: false });
      set({ playhead: 0, playing: false });
    },
    pushHistory: () => {
      const state = get2();
      const snapshot = deepClone(state.project);
      set({ history: { past: [...state.history.past, snapshot].slice(-MAX_HISTORY), future: [] } });
    },
    undo: () => {
      const { history, project: project2 } = get2();
      const previous = history.past[history.past.length - 1];
      if (!previous) return;
      set({
        project: previous,
        history: { past: history.past.slice(0, -1), future: [deepClone(project2), ...history.future].slice(0, MAX_HISTORY) },
        dirty: true,
        selection: pruneSelection(previous, get2().selection)
      });
    },
    redo: () => {
      const { history, project: project2 } = get2();
      const next = history.future[0];
      if (!next) return;
      set({
        project: next,
        history: { past: [...history.past, deepClone(project2)].slice(-MAX_HISTORY), future: history.future.slice(1) },
        dirty: true,
        selection: pruneSelection(next, get2().selection)
      });
    },
    selectedClip: () => {
      const id2 = get2().selection.clipIds[0];
      return id2 ? findClip(id2) : null;
    }
  };
});
function defaultEffectParams(type) {
  switch (type) {
    case "Gaussian Blur":
      return { radius: 8 };
    case "Box Blur":
      return { radius: 6 };
    case "Directional Blur":
      return { angle: 0, length: 12 };
    case "Sharpen":
      return { amount: 0.5 };
    case "Glow":
      return { threshold: 0.7, radius: 16, intensity: 0.8 };
    case "Film Grain":
      return { amount: 0.25, size: 1.2 };
    case "Chroma Key":
      return { hue: 120, tolerance: 0.25, spill: 0.1 };
    case "Opacity":
      return { opacity: 1 };
    case "Crop":
      return { top: 0, right: 0, bottom: 0, left: 0 };
    case "Cinematic LUT":
      return { intensity: 0.8, contrast: 1.05 };
    case "Color Wheels":
      return { temperature: 0, tint: 0, contrast: 1.05, saturation: 1.05, lift: 0, gamma: 0, gain: 0 };
    case "Timecode Burn-in":
      return { size: 18, x: 40, y: 40 };
    default:
      return { amount: 0.5 };
  }
}
const EFFECT_CATALOG = [
  "Transform",
  "Crop",
  "Opacity",
  "Gaussian Blur",
  "Box Blur",
  "Directional Blur",
  "Sharpen",
  "Glow",
  "Film Grain",
  "Chroma Key",
  "Luma Key",
  "Cinematic LUT",
  "Color Wheels",
  "Timecode Burn-in",
  "Text Generator",
  "Noise"
];
const STORAGE_KEY = "molicut.theme";
function applyTheme(theme, accent) {
  const root = document.documentElement;
  const resolved = theme === "system" ? window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark" : theme;
  root.dataset.theme = resolved;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-soft", hexToRgba(accent, 0.16));
  root.style.setProperty("--accent-border", hexToRgba(accent, 0.45));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, accent }));
  } catch {
  }
}
function initTheme() {
  let theme = "dark";
  let accent = "#4f8dff";
  try {
    const stored2 = localStorage.getItem(STORAGE_KEY);
    if (stored2) {
      const parsed = JSON.parse(stored2);
      theme = parsed.theme ?? theme;
      accent = parsed.accent ?? accent;
    }
  } catch {
  }
  applyTheme(theme, accent);
}
function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const r2 = Number.parseInt(full.slice(0, 2), 16) || 79;
  const g = Number.parseInt(full.slice(2, 4), 16) || 141;
  const b = Number.parseInt(full.slice(4, 6), 16) || 255;
  return `rgba(${r2}, ${g}, ${b}, ${alpha})`;
}
let subscribed$1 = false;
const useUiStore = create((set, get2) => ({
  settings: defaultSettings,
  loaded: false,
  modal: null,
  modalPayload: null,
  toasts: [],
  inspectorTab: "video",
  debugTab: "system",
  showScopes: false,
  showSafeArea: false,
  mediaView: "grid",
  mediaSearch: "",
  draggedMediaId: null,
  onboardingDone: (() => {
    try {
      return localStorage.getItem("molicut.onboarding") === "done";
    } catch {
      return false;
    }
  })(),
  init: async () => {
    if (subscribed$1) {
      if (!get2().loaded) {
        const { settings: settings22 } = await call("settings:get", {});
        set({ settings: settings22, loaded: true });
      }
      return;
    }
    subscribed$1 = true;
    const { settings: settings2 } = await call("settings:get", {});
    set({ settings: settings2, loaded: true });
    applyTheme(settings2.theme, settings2.accent);
    setLanguage(settings2.language);
    on("settings:changed", ({ settings: next }) => {
      set({ settings: next });
      applyTheme(next.theme, next.accent);
      setLanguage(next.language);
    });
    on("toast", ({ kind, message }) => get2().toast(kind, message));
    on("media:proxy-ready", () => {
      get2().toast("success", "Proxy generato e disponibile");
    });
  },
  updateSettings: async (patch) => {
    const current = get2().settings;
    const optimistic = { ...current, ...patch, shortcuts: { ...current.shortcuts, ...patch.shortcuts ?? {} } };
    set({ settings: optimistic });
    applyTheme(optimistic.theme, optimistic.accent);
    setLanguage(optimistic.language);
    try {
      const { settings: persisted } = await call("settings:set", { patch });
      set({ settings: persisted });
      applyTheme(persisted.theme, persisted.accent);
    } catch (err2) {
      set({ settings: current });
      get2().toast("error", err2.message);
    }
  },
  openModal: (modal, payload) => set({ modal, modalPayload: payload ?? null }),
  closeModal: () => set({ modal: null, modalPayload: null }),
  toast: (kind, message) => {
    const id2 = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({ toasts: [...state.toasts.slice(-3), { id: id2, kind, message }] }));
    setTimeout(() => get2().dismissToast(id2), kind === "error" ? 7e3 : 4200);
  },
  dismissToast: (id2) => set((state) => ({ toasts: state.toasts.filter((t2) => t2.id !== id2) })),
  setInspectorTab: (tab) => set({ inspectorTab: tab }),
  setDebugTab: (tab) => set({ debugTab: tab }),
  toggleScopes: () => set((s) => ({ showScopes: !s.showScopes })),
  toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),
  setMediaView: (view2) => set({ mediaView: view2 }),
  setMediaSearch: (search) => set({ mediaSearch: search }),
  setDraggedMediaId: (mediaId) => set({ draggedMediaId: mediaId }),
  completeOnboarding: () => {
    set({ onboardingDone: true });
    try {
      localStorage.setItem("molicut.onboarding", "done");
    } catch {
    }
  }
}));
const emptyStats = {
  queued: 0,
  running: 0,
  paused: 0,
  done: 0,
  error: 0,
  canceled: 0,
  total: 0,
  progress: 0,
  aggregateFps: 0
};
let subscribed = false;
const useQueueStore = create((set, get2) => ({
  jobs: [],
  stats: emptyStats,
  concurrency: 1,
  presets: [],
  folders: [],
  watchLogs: [],
  selectedJobId: null,
  filter: "all",
  search: "",
  liveLogs: {},
  initialized: false,
  scanning: false,
  init: async () => {
    if (!subscribed) {
      subscribed = true;
      on("queue:changed", ({ jobs: jobs2, stats: stats2 }) => {
        set((state) => {
          const liveLogs = { ...state.liveLogs };
          for (const job of jobs2) {
            const incoming = job.logs.slice(-300);
            const existing = liveLogs[job.id] ?? [];
            if (incoming.length < existing.length || incoming[0] && existing[0] && incoming[0] !== existing[0]) {
              liveLogs[job.id] = incoming;
            } else {
              liveLogs[job.id] = [...existing, ...incoming.slice(existing.length)].slice(-400);
            }
          }
          return { jobs: jobs2, stats: stats2, liveLogs };
        });
      });
      on("queue:progress", ({ jobId, progress, fps, speed, etaSec, sizeBytes }) => {
        set((state) => ({
          jobs: state.jobs.map((j) => j.id === jobId ? { ...j, progress, fps, speed, etaSec, sizeBytes } : j)
        }));
      });
      on("queue:log", ({ jobId, line }) => {
        set((state) => ({
          liveLogs: { ...state.liveLogs, [jobId]: [...state.liveLogs[jobId] ?? [], line].slice(-400) }
        }));
      });
    }
    if (!get2().initialized) {
      await Promise.all([get2().refresh(), get2().loadPresets(), get2().loadWatch(), get2().loadWatchLogs()]);
      set({ initialized: true });
    }
  },
  refresh: async () => {
    const result = await call("queue:list", {});
    set((state) => ({
      jobs: result.jobs,
      stats: result.stats,
      concurrency: result.concurrency,
      liveLogs: {
        ...state.liveLogs,
        ...Object.fromEntries(result.jobs.map((j) => [j.id, state.liveLogs[j.id] ?? j.logs.slice(-300)]))
      }
    }));
  },
  selectJob: (id2) => set({ selectedJobId: id2 }),
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
  enqueue: async (items) => {
    await call("queue:add", { items });
    await get2().refresh();
  },
  action: async (action, jobId, value) => {
    const result = await call("queue:action", { action, jobId, value });
    set({ jobs: result.jobs });
    await get2().refresh();
  },
  reorder: async (jobId, toIndex) => {
    const result = await call("queue:reorder", { jobId, toIndex });
    set({ jobs: result.jobs });
  },
  setPriority: async (jobId, priority) => {
    const result = await call("queue:setPriority", { jobId, priority });
    set({ jobs: result.jobs });
  },
  setConcurrency: async (value) => {
    await call("queue:setConcurrency", { value });
    set({ concurrency: value });
    await get2().refresh();
  },
  exportReport: async (format) => {
    await call("queue:exportReport", { format });
  },
  openWindow: async () => {
    await call("queue:openWindow", {});
  },
  loadPresets: async () => {
    const { presets: presets2 } = await call("presets:list", {});
    set({ presets: presets2 });
  },
  suggestFor: async (asset) => {
    const { presets: presets2 } = await call("presets:suggest", { asset });
    return presets2;
  },
  loadWatch: async () => {
    const { folders: folders2 } = await call("watch:list", {});
    set({ folders: folders2 });
  },
  addFolder: async (folder) => {
    await call("watch:add", { folder });
    await get2().loadWatch();
    await get2().loadWatchLogs();
  },
  updateFolder: async (folder) => {
    await call("watch:update", { folder });
    await get2().loadWatch();
  },
  removeFolder: async (id2) => {
    const { folders: folders2 } = await call("watch:remove", { id: id2 });
    set({ folders: folders2 });
  },
  testFolder: async (id2) => call("watch:test", { id: id2 }),
  loadWatchLogs: async () => {
    const { logs: logs2 } = await call("watch:logs", { limit: 200 });
    set({ watchLogs: logs2 });
  },
  importPresets: async () => {
    const result = await call("presets:import", {});
    if (!result.canceled) await get2().loadPresets();
  },
  exportPresets: async () => {
    await call("presets:export", {});
  }
}));
function useCommands() {
  const { t: t2 } = useTranslation();
  const project2 = useProjectStore();
  const ui2 = useUiStore();
  const queue = useQueueStore();
  return reactExports.useMemo(() => {
    const commands = [
      {
        id: "project.new",
        label: t2("menu.new"),
        category: "File",
        shortcut: "Ctrl+N",
        icon: "file",
        run: () => void project2.newProject()
      },
      { id: "project.open", label: t2("menu.open"), category: "File", shortcut: "Ctrl+O", icon: "folder", run: () => void project2.openProject() },
      { id: "project.save", label: t2("menu.save"), category: "File", shortcut: "Ctrl+S", icon: "save", run: () => void project2.saveProject() },
      { id: "project.saveAs", label: t2("menu.saveAs"), category: "File", shortcut: "Ctrl+Shift+S", icon: "save", run: () => void project2.saveProject(true) },
      { id: "media.import", label: t2("menu.import"), category: "File", shortcut: "Ctrl+I", icon: "plus", run: () => void project2.importMedia() },
      { id: "export.open", label: t2("menu.export"), category: "File", shortcut: "Ctrl+M", icon: "export", run: () => ui2.openModal("export") },
      {
        id: "export.fcpxml",
        label: t2("menu.exportInterchange"),
        category: "File",
        icon: "external",
        run: () => void call("project:exportInterchange", {
          project: project2.project,
          sequenceId: project2.sequence().id,
          format: "fcpxml"
        }).then(() => ui2.toast("success", "Sequenza esportata in FCPXML"))
      },
      { id: "app.settings", label: t2("menu.settings"), category: "File", shortcut: "Ctrl+,", icon: "settings", run: () => ui2.openModal("settings") },
      { id: "app.quit", label: t2("menu.quit"), category: "File", icon: "close", run: () => void call("window:control", { action: "close" }) },
      { id: "edit.undo", label: t2("menu.undo"), category: "Modifica", shortcut: "Ctrl+Z", icon: "undo", run: () => project2.undo() },
      { id: "edit.redo", label: t2("menu.redo"), category: "Modifica", shortcut: "Ctrl+Shift+Z", icon: "redo", run: () => project2.redo() },
      { id: "edit.split", label: t2("menu.cut"), category: "Modifica", shortcut: "Ctrl+K", icon: "cut", run: () => project2.splitAtPlayhead() },
      { id: "edit.snap", label: "Snap (aggancio)", category: "Modifica", shortcut: "S", icon: "magnet", run: () => project2.toggleSnap() },
      { id: "edit.delete", label: t2("menu.delete"), category: "Modifica", shortcut: "Delete", icon: "trash", run: () => project2.deleteSelected() },
      { id: "edit.rippleDelete", label: "Elimina con ripple (chiudi buco)", category: "Modifica", shortcut: "Shift+Delete", icon: "trash", run: () => project2.rippleDeleteSelected() },
      { id: "edit.selectAll", label: t2("menu.selectAll"), category: "Modifica", shortcut: "Ctrl+A", icon: "layers", run: () => project2.selectAllClips() },
      { id: "edit.duplicate", label: t2("menu.duplicate"), category: "Modifica", shortcut: "Ctrl+D", icon: "layers", run: () => project2.duplicateSelected() },
      { id: "edit.keyframe", label: "Keyframe opacità al playhead", category: "Modifica", icon: "keyframe", run: () => {
        const selected = project2.selectedClip();
        if (selected) project2.toggleKeyframe(selected.clip.id, "opacity", selected.clip.transform.opacity);
      } },
      { id: "sequence.videoTrack", label: t2("menu.addVideoTrack"), category: "Sequenza", icon: "film", run: () => project2.addTrack("video") },
      { id: "sequence.audioTrack", label: t2("menu.addAudioTrack"), category: "Sequenza", icon: "audio", run: () => project2.addTrack("audio") },
      { id: "sequence.subtitleTrack", label: t2("menu.addSubtitleTrack"), category: "Sequenza", icon: "file", run: () => project2.addTrack("subtitle") },
      { id: "sequence.title", label: t2("menu.addTitle"), category: "Sequenza", shortcut: "T", icon: "sparkles", run: () => project2.addTextClip() },
      { id: "sequence.marker", label: t2("menu.addMarker"), category: "Sequenza", shortcut: "M", icon: "keyframe", run: () => project2.addMarker("") },
      { id: "sequence.scopes", label: t2("preview.scopes"), category: "Vista", icon: "gauge", run: () => ui2.toggleScopes() },
      { id: "sequence.safeArea", label: t2("preview.safeArea"), category: "Vista", icon: "shield", run: () => ui2.toggleSafeArea() },
      { id: "window.queue", label: t2("menu.queue"), category: "Finestra", shortcut: "Ctrl+Shift+Q", icon: "queue", run: () => void queue.openWindow() },
      { id: "window.debug", label: t2("menu.debug"), category: "Finestra", shortcut: "Ctrl+Shift+D", icon: "bug", run: () => ui2.openModal("debug") },
      { id: "window.palette", label: t2("menu.commandPalette"), category: "Finestra", shortcut: "Ctrl+Shift+P", icon: "command", run: () => ui2.openModal("palette") },
      {
        id: "help.about",
        label: t2("menu.about"),
        category: "Aiuto",
        icon: "sparkles",
        run: () => void call("app:info", {}).then(
          (info) => ui2.toast("info", `MoliCut ${info.version} · Electron ${info.electron} · ${info.dbDriver}`)
        )
      }
    ];
    return commands;
  }, [project2, queue, t2, ui2]);
}
const paths = {
  play: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 5.5v13l10.5-6.5z", fill: "currentColor", stroke: "none" }),
  pause: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7", y: "5", width: "3.4", height: "14", rx: "1", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13.6", y: "5", width: "3.4", height: "14", rx: "1", fill: "currentColor", stroke: "none" })
  ] }),
  stop: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6.5", y: "6.5", width: "11", height: "11", rx: "1.6", fill: "currentColor", stroke: "none" }),
  rewind: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11 6.5v11L3.5 12z", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20.5 6.5v11L13 12z", fill: "currentColor", stroke: "none" })
  ] }),
  forward: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M13 6.5v11L20.5 12z", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.5 6.5v11L11 12z", fill: "currentColor", stroke: "none" })
  ] }),
  skipStart: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 5v14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19 6.5v11L9 12z", fill: "currentColor", stroke: "none" })
  ] }),
  skipEnd: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17 5v14" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 6.5v11L15 12z", fill: "currentColor", stroke: "none" })
  ] }),
  undo: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 7H4v5M4 12a8 8 0 1015.5 3" }),
  redo: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 7h5v5m0 0A8 8 0 013.5 15" }),
  cut: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6.5", cy: "7", r: "2.6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6.5", cy: "17", r: "2.6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8.7 8.6L20 19M8.7 15.4L20 5" })
  ] }),
  export: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 15V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15v4a1 1 0 001 1h12a1 1 0 001-1v-4" }),
  queue: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 6h11M4 12h11M4 18h7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.5 12.5v6l4-3z", fill: "currentColor", stroke: "none" })
  ] }),
  settings: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "3.1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 2.6v2.2M12 19.2v2.2M4.4 7.2l1.9 1.1M17.7 15.7l1.9 1.1M4.4 16.8l1.9-1.1M17.7 8.3l1.9-1.1" })
  ] }),
  folder: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3.5 6.5a1.5 1.5 0 011.5-1.5h4l2 2.5h8A1.5 1.5 0 0120.5 9v8a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 17z" }),
  plus: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 5v14M5 12h14" }),
  trash: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 7h16M9 7V4.5h6V7m-8.5 0l.8 13h9.4l.8-13M10 11v5M14 11v5" }),
  eye: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "2.8" })
  ] }),
  eyeOff: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 4l16 16M10.6 6.1A9.6 9.6 0 0112 6c6 0 9.5 6 9.5 6a17 17 0 01-3 3.5M6.4 8.1A17 17 0 002.5 12S6 18 12 18a9 9 0 003.4-.6M9.9 9.9a3 3 0 004.2 4.2" }),
  lock: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "10.5", width: "14", height: "9.5", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 10.5V8a4 4 0 018 0v2.5" })
  ] }),
  unlock: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "10.5", width: "14", height: "9.5", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8 10.5V8a4 4 0 017.5-2" })
  ] }),
  volume: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 9.5h3L12 5.5v13L7 14.5H4z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15.5 9a4 4 0 010 6M18 6.5a7.5 7.5 0 010 11" })
  ] }),
  search: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10.5", cy: "10.5", r: "5.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M15 15l4.5 4.5" })
  ] }),
  film: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "4.5", width: "18", height: "15", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 4.5v15M17 4.5v15M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" })
  ] }),
  image: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "4.5", width: "18", height: "15", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8.5", cy: "9.5", r: "1.8" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 17l5-5 4 4 3-3 4 4" })
  ] }),
  audio: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 13V9m4 8V7m4 10V5m4 9v-4m4 5V9" }),
  chevronDown: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 9l6 6 6-6" }),
  chevronRight: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 6l6 6-6 6" }),
  close: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 6l12 12M18 6L6 18" }),
  minimize: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12h14" }),
  maximize: /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5.5", y: "5.5", width: "13", height: "13", rx: "1.5" }),
  bug: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7.5", y: "7", width: "9", height: "12", rx: "4.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 7V5.5a3 3 0 016 0V7M4 10h3M17 10h3M4 15h3M17 15h3M12 7v12" })
  ] }),
  waveform: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 12h2m3-6v12m4-9v6m4-9v12m4-6h2" }),
  grid: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "4", width: "7", height: "7", rx: "1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "4", width: "7", height: "7", rx: "1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "13", width: "7", height: "7", rx: "1.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "13", y: "13", width: "7", height: "7", rx: "1.5" })
  ] }),
  list: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 7h16M4 12h16M4 17h16" }),
  keyframe: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 4l7 8-7 8-7-8z" }),
  magnet: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 5v7a7 7 0 0014 0V5h-4v7a3 3 0 01-6 0V5z" }),
  check: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 12.5l4.5 4.5L19 7" }),
  warning: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 4l9 16H3zM12 10v4.5M12 17.5v.01" }),
  refresh: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20 7v5h-5M4 17v-5h5M5.5 8A8 8 0 0119 9.5M18.5 16A8 8 0 015 14.5" }),
  chip: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" })
  ] }),
  download: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" }),
  save: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 4h11l3 3v13H5zM8 4v5h6V4M8 20v-6h8v6" }),
  command: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 6a3 3 0 11-3 3h12a3 3 0 11-3-3v12a3 3 0 113-3H6a3 3 0 113 3z" }),
  sparkles: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9z" }),
  zoomIn: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15 15l4.5 4.5M10.5 8v5M8 10.5h5" }),
  zoomOut: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10.5 4a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM15 15l4.5 4.5M8 10.5h5" }),
  external: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" }),
  layers: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3l9 5-9 5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" }),
  gauge: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 18a8 8 0 1116 0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 18l4-6" })
  ] }),
  shield: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4.5" }),
  file: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 3h7l5 5v13H6zM13 3v5h5" })
};
function Icon({ name, size = 16, className, style, strokeWidth = 1.7 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className,
      style,
      "aria-hidden": "true",
      focusable: "false",
      children: paths[name]
    }
  );
}
function Brand({ size = 22 }) {
  const gradient = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brand-mark", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 32 32", width: size, height: size, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: gradient, x1: "0", y1: "0", x2: "1", y2: "1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0", stopColor: "var(--accent)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "1", stopColor: "#22d3ee" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "32", height: "32", rx: "7", fill: "#1a2232" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0.75", y: "0.75", width: "30.5", height: "30.5", rx: "6.5", fill: "none", stroke: "rgba(79,141,255,.38)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7.5 24V8h3.2l5.3 8.1L21.3 8h3.2v16h-3.3V13.6l-4.6 6.9h-1.2l-4.6-6.9V24z", fill: `url(#${gradient})` })
  ] }) });
}
function BrandName() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brand-name", children: [
    "Moli",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brand-name-accent", children: "Cut" })
  ] });
}
const MENUS = [
  { key: "menu.file", groups: [["project.new", "project.open", "project.save", "project.saveAs"], ["media.import", "export.open", "export.fcpxml"], ["app.settings", "app.quit"]] },
  {
    key: "menu.edit",
    groups: [
      ["edit.undo", "edit.redo"],
      ["edit.split", "edit.rippleDelete", "edit.delete", "edit.duplicate", "edit.selectAll"],
      ["edit.snap", "edit.keyframe"]
    ]
  },
  {
    key: "menu.sequence",
    groups: [["sequence.videoTrack", "sequence.audioTrack", "sequence.subtitleTrack"], ["sequence.title", "sequence.marker"]]
  },
  { key: "menu.view", groups: [["sequence.scopes", "sequence.safeArea"], ["window.queue", "window.debug", "window.palette"]] },
  { key: "menu.help", groups: [["help.about"]] }
];
function TitleBar() {
  const { t: t2 } = useTranslation();
  const commands = useCommands();
  const [openMenu, setOpenMenu] = reactExports.useState(null);
  const barRef = reactExports.useRef(null);
  const project2 = useProjectStore((s) => s.project);
  const dirty = useProjectStore((s) => s.dirty);
  const saveProject = useProjectStore((s) => s.saveProject);
  const queueStats = useQueueStore((s) => s.stats);
  const openModal = useUiStore((s) => s.openModal);
  const isMac = platform() === "darwin";
  reactExports.useEffect(() => {
    const close = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) setOpenMenu(null);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, []);
  const byId = new Map(commands.map((c) => [c.id, c]));
  const run = (command) => {
    setOpenMenu(null);
    void command?.run();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `titlebar ${isMac ? "mac" : ""}`,
      ref: barRef,
      onDoubleClick: (event) => {
        if (event.target.closest("button, a, input, select")) return;
        void call("window:control", { action: "maximize" });
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "titlebar-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BrandName, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "menubar", "aria-label": "Menu principale", children: MENUS.map((menu) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "menu-root", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `menu-trigger ${openMenu === menu.key ? "active" : ""}`,
                onClick: () => setOpenMenu(openMenu === menu.key ? null : menu.key),
                onMouseEnter: () => openMenu && setOpenMenu(menu.key),
                "aria-haspopup": "menu",
                "aria-expanded": openMenu === menu.key,
                children: t2(menu.key)
              }
            ),
            openMenu === menu.key && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-popover", role: "menu", children: menu.groups.map((group, gi2) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-group", children: group.map((id2) => {
              const command = byId.get(id2);
              if (!command) return null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "menuitem", className: "menu-item", onClick: () => run(command), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: command.icon, size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: command.label }),
                command.shortcut && /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: command.shortcut })
              ] }, id2);
            }) }, gi2)) })
          ] }, menu.key)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "project-identity", title: useProjectStore.getState().projectPath ?? "Progetto non salvato", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "project-name", children: project2.name }),
          dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dirty-dot", title: "Modifiche non salvate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "project-sep", children: "/" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sequence-name", children: useProjectStore.getState().sequence()?.name ?? "Sequence" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "titlebar-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "chip-btn", onClick: () => openModal("debug"), title: "Debug (Ctrl+Shift+D)", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chip", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: project2.sequences[0]?.colorSpace === "rec2020" ? "HDR" : "SDR" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "queue-chip", onClick: () => void useQueueStore.getState().openWindow(), title: "Render Queue", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "queue", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: queueStats.running > 0 ? `${queueStats.progress}%` : queueStats.queued > 0 ? queueStats.queued : "Coda" }),
            queueStats.running > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pulse-dot" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-accent btn-sm", onClick: () => openModal("export"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "export", size: 14 }),
            "Esporta"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => void saveProject(), title: "Salva (Ctrl+S)", "aria-label": "Salva", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save" }) }),
          !isMac && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void call("window:control", { action: "minimize" }), "aria-label": "Minimizza", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "minimize", size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void call("window:control", { action: "maximize" }), "aria-label": "Massimizza", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "maximize", size: 13 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "close", onClick: () => void call("window:control", { action: "close" }), "aria-label": "Chiudi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
          ] })
        ] })
      ]
    }
  );
}
const iconFor = { info: "sparkles", success: "check", warn: "warning", error: "warning" };
function Toasts() {
  const toasts = useUiStore((s) => s.toasts);
  const dismiss = useUiStore((s) => s.dismissToast);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toasts", role: "status", "aria-live": "polite", children: toasts.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `toast ${toast.kind}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: iconFor[toast.kind], size: 16 }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: toast.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => dismiss(toast.id), "aria-label": "Chiudi notifica", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 12 }) })
  ] }, toast.id)) });
}
function Onboarding() {
  const { t: t2 } = useTranslation();
  const complete = useUiStore((s) => s.completeOnboarding);
  const openModal = useUiStore((s) => s.openModal);
  const features = [
    { icon: "chip", title: "GPU-first", body: "NVENC, AMF, QSV, VideoToolbox e VAAPI rilevati all’avvio, con fallback software esplicito." },
    { icon: "queue", title: "Coda persistente", body: "Render in background con editor chiuso, watch folder e preset Media Encoder." },
    { icon: "bug", title: "Debug integrato", body: "Hardware, dipendenze, log, IPC inspector e report diagnostico redatto." }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onboarding-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, { size: 44 }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: t2("onboarding.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t2("app.tagline") })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "onboarding-copy", children: t2("onboarding.body") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "onboarding-features", children: features.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-feature", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "feature-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: f2.icon, size: 18 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: f2.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: f2.body })
      ] })
    ] }, f2.title)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "onboarding-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn",
          onClick: () => {
            complete();
            openModal("debug");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bug", size: 14 }),
            " Apri Debug"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn btn-accent",
          onClick: () => {
            complete();
            void useProjectStore.getState().importMedia();
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 14 }),
            " Importa media e inizia"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "onboarding-skip", onClick: complete, children: t2("onboarding.skip") })
  ] }) });
}
function StatusBar() {
  const project2 = useProjectStore((s) => s.project);
  const dirty = useProjectStore((s) => s.dirty);
  const autosaveAt = useProjectStore((s) => s.autosaveAt);
  const sequence = useProjectStore((s) => s.sequence());
  const stats2 = useQueueStore((s) => s.stats);
  const openModal = useUiStore((s) => s.openModal);
  const [profile2, setProfile] = reactExports.useState(null);
  const [scan, setScan] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void call("system:profile", {}).then(({ profile: p2 }) => setProfile(p2)).catch(() => void 0);
    return on("scan:progress", ({ percent, message }) => {
      setScan({ percent, message });
      if (percent >= 100) {
        setTimeout(() => setScan(null), 1200);
        void call("system:profile", {}).then(({ profile: p2 }) => setProfile(p2)).catch(() => void 0);
      }
    });
  }, []);
  const backend = profile2?.acceleration.preferredBackend ?? "software";
  const hardware = backend !== "software";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "statusbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-led ${dirty ? "dirty" : "ok"}` }),
        dirty ? "Modifiche non salvate" : autosaveAt ? `Autosave ${new Date(autosaveAt).toLocaleTimeString()}` : "Pronto"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 12 }),
        " ",
        sequence.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item dim", children: [
        sequence.width,
        "×",
        sequence.height,
        " · ",
        sequence.fps,
        "fps"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item dim", children: [
        project2.media.length,
        " media · ",
        sequence.tracks.length,
        " tracce"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "status-right", children: [
      scan && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item scanning", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner" }),
        " ",
        scan.message,
        " ",
        scan.percent,
        "%"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `status-item backend ${hardware ? "hw" : "sw"}`, onClick: () => openModal("debug"), title: "Apri debug / GPU", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chip", size: 12 }),
        " ",
        backend.toUpperCase(),
        profile2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dim", children: [
          "· ",
          profile2.gpus[0]?.model ?? profile2.cpu.brand
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "status-item", onClick: () => useQueueStore.getState().openWindow(), title: "Render queue", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "queue", size: 12 }),
        " ",
        stats2.running > 0 ? `${stats2.running} attivi · ${stats2.progress}%` : `${stats2.queued} in coda`,
        stats2.error > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "err-text", children: [
          " · ",
          stats2.error,
          " errori"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-divider" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-item dim", children: isMock() ? "DEMO BROWSER" : `${platform()} · ${navigator.hardwareConcurrency} thread` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-item dim", children: formatClock(project2.media.reduce((s, m2) => s + m2.durationSec, 0)) })
    ] })
  ] });
}
const kindIcon = { video: "film", audio: "waveform", image: "image" };
function MediaBin() {
  const { t: t2 } = useTranslation();
  const media = useProjectStore((s) => s.project.media);
  const importMedia = useProjectStore((s) => s.importMedia);
  const addClip = useProjectStore((s) => s.addClip);
  const relink = useProjectStore((s) => s.relinkMedia);
  const removeMedia = useProjectStore((s) => s.removeMedia);
  const toast = useUiStore((s) => s.toast);
  const view2 = useUiStore((s) => s.mediaView);
  const setView = useUiStore((s) => s.setMediaView);
  const search = useUiStore((s) => s.mediaSearch);
  const setSearch = useUiStore((s) => s.setMediaSearch);
  const setDraggedMediaId = useUiStore((s) => s.setDraggedMediaId);
  const [thumbs, setThumbs] = reactExports.useState({});
  const [kind, setKind] = reactExports.useState("all");
  const [dragOver, setDragOver] = reactExports.useState(false);
  const requested = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    for (const asset of media) {
      if (thumbs[asset.id] || requested.current.has(asset.id)) continue;
      requested.current.add(asset.id);
      void call("media:thumbnail", { path: asset.path, timeSec: 1 }).then(({ dataUrl }) => setThumbs((prev) => ({ ...prev, [asset.id]: dataUrl }))).catch(() => setThumbs((prev) => ({ ...prev, [asset.id]: "" })));
    }
  }, [media, thumbs]);
  const filtered = reactExports.useMemo(
    () => media.filter((asset) => {
      if (kind !== "all" && asset.kind !== kind) return false;
      if (!search.trim()) return true;
      return asset.name.toLowerCase().includes(search.toLowerCase());
    }),
    [kind, media, search]
  );
  const onDropFiles = async (event) => {
    event.preventDefault();
    setDragOver(false);
    const paths2 = Array.from(event.dataTransfer.files ?? []).map((file) => filePath(file)).filter((p2) => Boolean(p2));
    if (paths2.length === 0) {
      toast("warn", "Impossibile leggere il percorso dei file trascinati.");
      return;
    }
    try {
      const { assets } = await call("media:importPaths", { paths: paths2, generateProxies: false });
      useProjectStore.getState().addMedia(assets);
    } catch (err2) {
      toast("error", err2.message);
    }
  };
  const totalDuration = media.reduce((sum, m2) => sum + m2.durationSec, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      className: `panel media-bin ${dragOver ? "drag-over" : ""}`,
      "aria-label": t2("media.title"),
      onDragOver: (e) => {
        if (e.dataTransfer.types.includes("Files")) {
          e.preventDefault();
          setDragOver(true);
        }
      },
      onDragLeave: () => setDragOver(false),
      onDrop: (e) => void onDropFiles(e),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "panel-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t2("media.title") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: media.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: view2 === "grid" ? "Vista lista" : "Vista griglia", onClick: () => setView(view2 === "grid" ? "list" : "grid"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: view2 === "grid" ? "list" : "grid", size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void importMedia(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 14 }),
              " ",
              t2("media.import")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "media-toolbar", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-field", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, placeholder: t2("media.search"), onChange: (e) => setSearch(e.target.value), "aria-label": t2("media.search") })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-row", children: [
          ["all", "video", "audio", "image"].map((k2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `filter-chip ${kind === k2 ? "active" : ""}`, onClick: () => setKind(k2), children: k2 === "all" ? "Tutti" : k2 === "video" ? "Video" : k2 === "audio" ? "Audio" : "Immagini" }, k2)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "media-summary", children: [
            t2("media.duration"),
            ": ",
            formatClock(totalDuration),
            " · ",
            formatBytes(media.reduce((s, m2) => s + m2.fileSize, 0))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `media-list ${view2}`, role: "list", children: [
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-empty", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 26 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t2("media.empty") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void importMedia(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 13 }),
              " ",
              t2("media.import")
            ] })
          ] }),
          filtered.map((asset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "article",
            {
              className: `media-card ${asset.status === "offline" ? "offline" : ""}`,
              role: "listitem",
              draggable: true,
              onDragStart: (e) => {
                e.dataTransfer.setData("application/x-molicut-media", asset.id);
                e.dataTransfer.setData("text/plain", asset.name);
                e.dataTransfer.effectAllowed = "copy";
                setDraggedMediaId(asset.id);
              },
              onDragEnd: () => setDraggedMediaId(null),
              onDoubleClick: () => addClip(asset.id),
              title: `${asset.name}
${asset.width}×${asset.height} · ${asset.fps} fps · ${asset.codec}
${asset.path}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thumb", children: [
                  thumbs[asset.id] ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: thumbs[asset.id], alt: "", draggable: false }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "thumb-placeholder", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: kindIcon[asset.kind], size: 22 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kind-badge", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: kindIcon[asset.kind], size: 11 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "duration-badge", children: formatClock(asset.durationSec) }),
                  asset.isHDR && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hdr-badge", children: "HDR" }),
                  asset.proxyPath && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "proxy-badge", children: "PROXY" }),
                  asset.status === "offline" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-overlay", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2("media.offline") })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-hover", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: t2("media.addToTimeline"), onClick: () => addClip(asset.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "Rilink", onClick: () => void relink(asset.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: t2("media.remove"), onClick: () => removeMedia(asset.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 14 }) })
                  ] })
                ] }),
                view2 === "list" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-meta", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "media-name", children: asset.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "media-sub", children: [
                    asset.width > 0 ? `${asset.width}×${asset.height}` : "Audio",
                    " · ",
                    asset.codec.toUpperCase(),
                    " ·",
                    " ",
                    asset.kind === "audio" ? `${asset.channels}ch ${asset.sampleRate / 1e3}kHz` : `${asset.fps} fps`
                  ] })
                ] }),
                view2 === "grid" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "media-footer", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "media-name", children: asset.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "media-sub", children: [
                    asset.codec.toUpperCase(),
                    " · ",
                    asset.width > 0 ? `${asset.width}×${asset.height}` : "audio"
                  ] })
                ] })
              ]
            },
            asset.id
          ))
        ] }),
        dragOver && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "drop-hint", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rilascia per importare" })
        ] })
      ]
    }
  );
}
const reported = /* @__PURE__ */ new Map();
const WINDOW_MS = 3e4;
const MAX_MESSAGE = 8e3;
function reportClientError(source, error, componentStack) {
  const normalized = error instanceof Error ? error : new Error(String(error));
  const key = `${source}:${normalized.message}`;
  const now2 = Date.now();
  if ((reported.get(key) ?? 0) > now2 - WINDOW_MS) return;
  reported.set(key, now2);
  console.error(`[${source}]`, normalized);
  try {
    void window.molicut?.invoke("debug:clientError", {
      message: normalized.message.slice(0, MAX_MESSAGE) || "Unknown renderer error",
      stack: (normalized.stack ?? "").slice(0, 16e3),
      componentStack: (componentStack ?? "").slice(0, 16e3),
      source
    });
  } catch {
  }
}
function installGlobalErrorReporting() {
  window.addEventListener("error", (event) => {
    reportClientError("window.error", event.error ?? new Error(event.message));
  });
  window.addEventListener("unhandledrejection", (event) => {
    reportClientError("unhandledrejection", event.reason);
  });
}
const VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
uniform vec4 uRect; // x,y = center offset (clip space); z,w = on-screen size (clip space)
uniform float uRotation;
uniform float uAspect; // canvas width / height
void main() {
  vec2 p = aPos * 0.5; // -0.5..0.5
  // Scale to final on-screen size first, then rotate in *screen* space.
  // Rotating before the non-uniform fit/aspect mapping shears the picture
  // (the "stretched when rotating" bug) on any non-square canvas or letterbox.
  vec2 u = p * uRect.zw * 2.0;
  float c = cos(uRotation);
  float s = sin(uRotation);
  vec2 world = vec2(u.x * c - u.y * s / uAspect, u.x * s * uAspect + u.y * c) + uRect.xy;
  vUv = vec2(aPos.x * 0.5 + 0.5, 1.0 - (aPos.y * 0.5 + 0.5));
  gl_Position = vec4(world, 0.0, 1.0);
}`;
const FS = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uSaturation;
uniform float uContrast;
uniform float uTemperature;
uniform float uTint;
uniform float uVignette;
void main() {
  vec4 tex = texture(uTexture, vUv);
  vec3 color = tex.rgb;
  // Warm/cool axis: + red / - blue. Tint is the green-magenta axis.
  color.r += uTemperature * 0.08;
  color.b -= uTemperature * 0.08;
  color.g += uTint * 0.06;
  color.r -= uTint * 0.03;
  color.b -= uTint * 0.03;
  color = (color - 0.5) * uContrast + 0.5;
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luma), color, uSaturation);
  float d = distance(vUv, vec2(0.5));
  color *= 1.0 - smoothstep(0.45, 0.95, d) * uVignette;
  outColor = vec4(clamp(color, 0.0, 1.0), tex.a) * uOpacity;
}`;
const QUALITY_SCALE = { auto: 1, full: 1, half: 0.6, quarter: 0.4 };
function audible(track, hasSolo) {
  return !track.mute && (!hasSolo || track.solo);
}
function activeClip(sequence, time) {
  const hasSolo = sequence.tracks.some((t2) => t2.solo);
  const tracks = sequence.tracks.filter(
    (t2) => (t2.kind === "video" || t2.kind === "adjustment") && audible(t2, hasSolo)
  );
  for (const track of tracks) {
    let found = null;
    for (const clip of track.clips) {
      if (time >= clip.start && time < clip.start + clip.duration) {
        if (!found || clip.start >= found.start) found = clip;
      }
    }
    if (found) return { clip: found, track };
  }
  return null;
}
function activeTexts(sequence, time) {
  const hasSolo = sequence.tracks.some((t2) => t2.solo);
  const result = [];
  for (const track of [...sequence.tracks].reverse()) {
    if (!audible(track, hasSolo)) continue;
    for (const clip of track.clips) {
      if (!clip.text?.content.trim()) continue;
      if (time >= clip.start && time < clip.start + clip.duration) result.push({ clip, track });
    }
  }
  return result;
}
function activeAudios(sequence, time) {
  const result = [];
  const hasSolo = sequence.tracks.some((t2) => t2.solo);
  for (const track of sequence.tracks.filter((t2) => t2.kind === "audio" && audible(t2, hasSolo))) {
    for (const clip of track.clips) {
      if (time >= clip.start && time < clip.start + clip.duration) result.push({ clip, track });
    }
  }
  return result;
}
function driftRate(deltaSec) {
  const nudge = clamp(deltaSec * 4, -0.12, 0.12);
  return Math.abs(nudge) < 2e-3 ? 1 : 1 + nudge;
}
class PreviewEngine {
  canvas;
  overlay;
  gl = null;
  program = null;
  texture = null;
  videoCache = /* @__PURE__ */ new Map();
  imageCache = /* @__PURE__ */ new Map();
  currentSource = null;
  currentImage = null;
  audioElements = /* @__PURE__ */ new Map();
  raf = 0;
  input = null;
  baseTime = 0;
  baseClock = 0;
  audioContext = null;
  playing = false;
  lastScopesAt = 0;
  lastTimeEmit = 0;
  lastDrawAt = 0;
  hasFrame = false;
  lastAspect = 16 / 9;
  uploadedSource = null;
  uploadedAt = -1;
  frameCount = 0;
  fpsWindowStart = 0;
  mockSeed = Math.random() * 100;
  disposed = false;
  failing = false;
  onTime = () => {
  };
  onStats = () => {
  };
  /** Playback reached the last frame: the store must leave the playing state. */
  onEnded = () => {
  };
  constructor(canvas, overlay) {
    this.canvas = canvas;
    this.overlay = overlay;
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      this.gl = null;
      this.program = null;
      this.texture = null;
      this.hasFrame = false;
      this.uploadedSource = null;
      this.uploadedAt = -1;
    });
    canvas.addEventListener("webglcontextrestored", () => this.initGL());
    if (!isMock()) this.initGL();
    this.loop = this.loop.bind(this);
    window.addEventListener("resize", this.onWindowResize);
    this.raf = requestAnimationFrame(this.loop);
  }
  onWindowResize = () => {
    if (this.input) this.draw(this.input.time);
  };
  initGL() {
    try {
      const gl2 = this.canvas.getContext("webgl2", { alpha: false, antialias: true, powerPreference: "high-performance" });
      if (!gl2) return;
      const compile = (type, source) => {
        const shader = gl2.createShader(type);
        if (!shader) return null;
        gl2.shaderSource(shader, source);
        gl2.compileShader(shader);
        if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) return null;
        return shader;
      };
      const vs = compile(gl2.VERTEX_SHADER, VS);
      const fs = compile(gl2.FRAGMENT_SHADER, FS);
      if (!vs || !fs) return;
      const program = gl2.createProgram();
      if (!program) return;
      gl2.attachShader(program, vs);
      gl2.attachShader(program, fs);
      gl2.linkProgram(program);
      if (!gl2.getProgramParameter(program, gl2.LINK_STATUS)) return;
      gl2.useProgram(program);
      const buffer = gl2.createBuffer();
      gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer);
      gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl2.STATIC_DRAW);
      const loc = gl2.getAttribLocation(program, "aPos");
      gl2.enableVertexAttribArray(loc);
      gl2.vertexAttribPointer(loc, 2, gl2.FLOAT, false, 0, 0);
      const texture = gl2.createTexture();
      gl2.bindTexture(gl2.TEXTURE_2D, texture);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_S, gl2.CLAMP_TO_EDGE);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_WRAP_T, gl2.CLAMP_TO_EDGE);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MIN_FILTER, gl2.LINEAR);
      gl2.texParameteri(gl2.TEXTURE_2D, gl2.TEXTURE_MAG_FILTER, gl2.LINEAR);
      this.gl = gl2;
      this.program = program;
      this.texture = texture;
      this.uploadedSource = null;
      this.uploadedAt = -1;
    } catch {
      this.gl = null;
    }
  }
  update(input) {
    const wasPlaying = this.playing;
    const previous = this.input;
    const jumped = previous ? Math.abs(input.time - previous.time) > 0.35 : false;
    this.input = input;
    this.playing = input.playing;
    if (!input.playing) {
      this.baseTime = input.time;
      this.baseClock = this.clock();
    } else if (!wasPlaying || jumped) {
      this.baseTime = input.time;
      this.baseClock = this.clock();
    }
    if (!input.playing || jumped) this.syncMedia(input.time);
    if (!input.playing || jumped || previous?.sequence.id !== input.sequence.id) this.draw(input.time);
  }
  clock() {
    if (!this.audioContext) {
      try {
        this.audioContext = new AudioContext({ latencyHint: "interactive" });
      } catch {
        this.audioContext = null;
      }
    }
    if (this.audioContext) {
      if (this.audioContext.state === "suspended") void this.audioContext.resume();
      return this.audioContext.currentTime;
    }
    return performance.now() / 1e3;
  }
  /** Exact content end: playback stops there, not at the padded ruler length. */
  endTime() {
    return this.input ? sequenceContentDuration(this.input.sequence) : 0;
  }
  currentTime() {
    if (!this.input) return 0;
    if (!this.playing) return this.input.time;
    return clamp(this.baseTime + (this.clock() - this.baseClock), 0, this.endTime());
  }
  ensureVideo(asset) {
    if (isMock()) return null;
    let video = this.videoCache.get(asset.id);
    if (!video) {
      video = document.createElement("video");
      video.src = mediaSrc(asset.path);
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.playsInline = true;
      video.muted = false;
      video.load();
      video.addEventListener("seeked", () => this.mediaReady(video));
      video.addEventListener("loadeddata", () => this.mediaReady(video));
      this.videoCache.set(asset.id, video);
    }
    return video;
  }
  ensureImage(asset) {
    if (isMock()) return null;
    let image = this.imageCache.get(asset.id);
    if (!image) {
      image = new Image();
      image.crossOrigin = "anonymous";
      image.addEventListener("load", () => this.imageReady(image));
      image.src = mediaSrc(asset.path);
      this.imageCache.set(asset.id, image);
    }
    return image;
  }
  imageReady(image) {
    if (this.disposed || !this.input) return;
    if (this.currentImage !== image) return;
    this.uploadedSource = null;
    this.uploadedAt = -1;
    try {
      this.draw(this.input.time);
    } catch (err2) {
      reportClientError("preview.imageReady", err2);
    }
  }
  ensureAudio(asset) {
    if (isMock()) return null;
    let element = this.audioElements.get(asset.id) ?? null;
    if (!element) {
      const audio = document.createElement("audio");
      audio.src = mediaSrc(asset.path);
      audio.preload = "auto";
      element = audio;
      this.audioElements.set(asset.id, element);
    }
    return element;
  }
  /** True when an audio-track clip for this media covers `time` (muted tracks count). */
  audioTwinActive(sequence, time, mediaId) {
    for (const track of sequence.tracks) {
      if (track.kind !== "audio") continue;
      for (const clip of track.clips) {
        if (clip.mediaId === mediaId && time >= clip.start && time < clip.start + clip.duration) return true;
      }
    }
    return false;
  }
  /** Redraw the paused monitor once a seek/load delivers a fresh frame. */
  mediaReady(video) {
    if (this.disposed || this.playing || !this.input) return;
    if (this.currentSource !== video) return;
    this.uploadedAt = -1;
    try {
      this.draw(this.input.time);
    } catch (err2) {
      reportClientError("preview.mediaReady", err2);
    }
  }
  syncMedia(time) {
    const input = this.input;
    if (!input) return;
    const active = activeClip(input.sequence, time);
    const asset = active?.clip.mediaId ? input.project.media.find((m2) => m2.id === active.clip.mediaId) ?? null : null;
    if (active && asset?.kind === "image") {
      const image = this.ensureImage(asset);
      this.currentImage = image;
      this.currentSource = null;
    } else if (active && asset && asset.kind !== "image") {
      this.currentImage = null;
      const video = this.ensureVideo(asset);
      if (video) {
        this.currentSource = video;
        const target = active.clip.inPoint + (time - active.clip.start) * active.clip.speed;
        const epsilon = this.playing ? 0.2 : 1 / Math.max(1, input.sequence.fps) / 2;
        if (video.readyState < 1 || !video.seeking && Math.abs(video.currentTime - target) > epsilon) {
          try {
            video.currentTime = Math.max(0, target);
          } catch {
          }
        }
        video.muted = input.muted || this.audioTwinActive(input.sequence, time, asset.id);
        video.volume = clamp(active.clip.volume * active.track.volume, 0, 1);
        const baseRate = clamp(active.clip.speed, 0.25, 4);
        if (this.playing && !video.seeking && video.readyState >= 2) {
          const delta = video.currentTime - target;
          video.playbackRate = video.muted && Math.abs(delta) <= 0.5 ? clamp(baseRate * driftRate(delta), 0.25, 4) : baseRate;
        } else {
          video.playbackRate = baseRate;
        }
        if (this.playing && video.paused) void video.play().catch(() => void 0);
        if (!this.playing && !video.paused) video.pause();
      }
    } else {
      this.currentSource = null;
      this.currentImage = null;
    }
    const audios = activeAudios(input.sequence, time);
    for (const entry of audios) {
      const audioAsset = entry.clip.mediaId ? input.project.media.find((m2) => m2.id === entry.clip.mediaId) : null;
      if (audioAsset) this.ensureAudio(audioAsset);
    }
    for (const [mediaId, element] of this.audioElements) {
      const clipInfo = audios.find((entry) => entry.clip.mediaId === mediaId);
      if (!clipInfo || !this.playing) {
        element.pause();
        continue;
      }
      const target = clipInfo.clip.inPoint + (time - clipInfo.clip.start) * clipInfo.clip.speed;
      const baseRate = clamp(clipInfo.clip.speed, 0.25, 4);
      const delta = element.currentTime - target;
      if (Math.abs(delta) > 0.5) {
        try {
          element.currentTime = Math.max(0, target);
        } catch {
        }
        element.playbackRate = baseRate;
      } else {
        element.playbackRate = clamp(baseRate * driftRate(delta), 0.25, 4);
      }
      element.volume = clamp(clipInfo.clip.volume * clipInfo.track.volume, 0, 1);
      element.muted = input.muted;
      if (element.paused) void element.play().catch(() => void 0);
    }
  }
  loop() {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    if (!this.input) return;
    try {
      const now2 = performance.now();
      if (this.playing) {
        const time = this.currentTime();
        this.syncMedia(time);
        this.draw(time);
        if (now2 - this.lastTimeEmit > 33) {
          this.lastTimeEmit = now2;
          this.onTime(time);
        }
        const end = this.endTime();
        if (end > 0 && time >= end - 1e-3) {
          this.playing = false;
          this.onTime(end);
          this.onEnded();
        }
        this.frameCount++;
        if (!this.fpsWindowStart) this.fpsWindowStart = now2;
        if (now2 - this.fpsWindowStart > 1e3) {
          const fps = this.frameCount * 1e3 / (now2 - this.fpsWindowStart);
          this.onStats(Math.round(fps * 10) / 10, 0);
          this.frameCount = 0;
          this.fpsWindowStart = now2;
        }
      }
      this.failing = false;
    } catch (err2) {
      if (!this.failing) reportClientError("preview.loop", err2);
      this.failing = true;
    }
  }
  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const quality = QUALITY_SCALE[this.input?.quality ?? "full"];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(2, Math.round(rect.width * dpr * quality));
    const height = Math.max(2, Math.round(rect.height * dpr * quality));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    const overlayWidth = Math.max(2, Math.round(rect.width * dpr));
    const overlayHeight = Math.max(2, Math.round(rect.height * dpr));
    if (this.overlay.width !== overlayWidth || this.overlay.height !== overlayHeight) {
      this.overlay.width = overlayWidth;
      this.overlay.height = overlayHeight;
    }
  }
  draw(time) {
    const input = this.input;
    if (!input) return;
    this.resizeCanvas();
    this.drawPicture(input, time);
    this.drawOverlay(input, time);
  }
  drawPicture(input, time) {
    if (isMock()) {
      const ctx = this.canvas.getContext("2d");
      if (!ctx) return;
      const { width, height } = this.canvas;
      const active2 = activeClip(input.sequence, time);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const hue = active2 ? 250 : 230;
      const offset = (time * 12 + this.mockSeed) % 360;
      gradient.addColorStop(0, `hsl(${hue + offset * 0.1}, 55%, 12%)`);
      gradient.addColorStop(0.55, `hsl(${hue + 30 + offset * 0.06}, 62%, 26%)`);
      gradient.addColorStop(1, `hsl(${hue - 40}, 48%, 8%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 0.5;
      for (let i = 0; i < 4; i++) {
        const x2 = (Math.sin(time * 0.25 + i * 1.7) * 0.5 + 0.5) * width;
        const y2 = (Math.cos(time * 0.18 + i * 1.1) * 0.5 + 0.5) * height;
        const r2 = (0.12 + i * 0.04) * width;
        const glow = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
        glow.addColorStop(0, i % 2 === 0 ? "rgba(124,92,255,.5)" : "rgba(56,189,248,.38)");
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.globalAlpha = 1;
      return;
    }
    const gl2 = this.gl;
    if (!gl2 || !this.program) {
      const ctx = this.canvas.getContext("2d");
      ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
    gl2.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl2.clearColor(0.03, 0.035, 0.05, 1);
    gl2.clear(gl2.COLOR_BUFFER_BIT);
    const active = activeClip(input.sequence, time);
    const clip = active?.clip;
    const videoSource = this.currentSource;
    const imageSource = this.currentImage;
    const source = videoSource ?? imageSource;
    const ready = videoSource !== null ? videoSource.readyState >= 2 && videoSource.videoWidth > 0 : imageSource !== null && imageSource.complete && imageSource.naturalWidth > 0;
    if (ready && source) {
      gl2.useProgram(this.program);
      gl2.bindTexture(gl2.TEXTURE_2D, this.texture);
      const sourceTime = source instanceof HTMLVideoElement ? source.currentTime : 0;
      if (this.uploadedSource !== source || this.uploadedAt !== sourceTime) {
        gl2.texImage2D(gl2.TEXTURE_2D, 0, gl2.RGBA, gl2.RGBA, gl2.UNSIGNED_BYTE, source);
        this.uploadedSource = source;
        this.uploadedAt = sourceTime;
      }
      this.hasFrame = true;
      this.lastAspect = source instanceof HTMLVideoElement ? source.videoWidth / source.videoHeight : source.naturalWidth / source.naturalHeight;
    } else if (!this.hasFrame) {
      return;
    }
    gl2.useProgram(this.program);
    gl2.bindTexture(gl2.TEXTURE_2D, this.texture);
    const canvasAspect = this.canvas.width / this.canvas.height;
    const videoAspect = this.lastAspect || 16 / 9;
    let fitW = 1;
    let fitH = 1;
    if (videoAspect > canvasAspect) fitH = canvasAspect / videoAspect;
    else fitW = videoAspect / canvasAspect;
    const scale = clip ? interpolateKeyframes((clip.keyframes?.scale ?? []).map((k2) => ({ ...k2 })), time - clip.start, clip.transform.scale) : 1;
    const opacity = clip ? interpolateKeyframes(clip.keyframes?.opacity ?? [], time - clip.start, clip.transform.opacity) : 1;
    const rotation = (clip?.transform.rotation ?? 0) * Math.PI / 180;
    const offsetX = (clip?.transform.x ?? 0) / (input.sequence.width / 2);
    const offsetY = (clip?.transform.y ?? 0) / (input.sequence.height / 2);
    const grade = readGrade(clip);
    gl2.uniform4f(gl2.getUniformLocation(this.program, "uRect"), offsetX, -offsetY, fitW * scale, fitH * scale);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uRotation"), rotation);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uAspect"), this.canvas.width / Math.max(1, this.canvas.height));
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uOpacity"), clamp(opacity, 0, 1));
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uSaturation"), grade.saturation);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uContrast"), grade.contrast);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uTemperature"), grade.temperature);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uTint"), grade.tint);
    gl2.uniform1f(gl2.getUniformLocation(this.program, "uVignette"), grade.vignette);
    gl2.drawArrays(gl2.TRIANGLE_STRIP, 0, 4);
  }
  drawOverlay(input, time) {
    const canvas = this.overlay;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    const active = activeClip(input.sequence, time);
    const asset = active?.clip.mediaId ? input.project.media.find((m2) => m2.id === active.clip.mediaId) : null;
    const texts = activeTexts(input.sequence, time);
    if (!active && texts.length === 0) {
      if (!isMock()) {
        ctx.fillStyle = "rgba(8,9,12,.72)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(255,255,255,.4)";
        ctx.textAlign = "center";
        ctx.font = `${Math.round(width * 0.022)}px Inter, system-ui, sans-serif`;
        ctx.fillText("NO SIGNAL — nessuna clip sotto il playhead", width / 2, height / 2);
        ctx.textAlign = "left";
      }
    } else if (isMock() && active) {
      ctx.fillStyle = "rgba(255,255,255,.85)";
      const fontSize = Math.max(12, width * 0.028);
      ctx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillText(active.clip.name, width * 0.04, height * 0.88);
      ctx.font = `${fontSize * 0.55}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(255,255,255,.55)";
      ctx.fillText(`${asset?.width ?? 1920}×${asset?.height ?? 1080} · ${formatTimecode(time, input.sequence.fps)}`, width * 0.04, height * 0.94);
      if (asset?.isHDR) {
        ctx.fillStyle = "#ffb547";
        ctx.fillText("HDR10 · Rec.2020 PQ", width * 0.04, height * 0.82);
      }
    }
    for (const entry of texts) drawTitle(ctx, entry.clip, input.sequence, width, height);
    if (input.showSafeArea) {
      ctx.strokeStyle = "rgba(255,255,255,.35)";
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);
      ctx.strokeStyle = "rgba(255,255,255,.25)";
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
      ctx.beginPath();
      ctx.moveTo(width / 2, height * 0.1);
      ctx.lineTo(width / 2, height * 0.9);
      ctx.moveTo(width * 0.1, height / 2);
      ctx.lineTo(width * 0.9, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (input.showScopes && this.gl && !isMock() && performance.now() - this.lastScopesAt > 200) {
      this.lastScopesAt = performance.now();
      this.histogram = this.readHistogram();
    }
    if (input.showScopes) {
      this.drawScopes(ctx, width, height);
    }
    if (this.input?.playing) {
      ctx.fillStyle = "rgba(124,92,255,.9)";
      ctx.beginPath();
      ctx.arc(width - 22, 22, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  histogram = [[], [], []];
  readHistogram() {
    const gl2 = this.gl;
    if (!gl2) return [[], [], []];
    const w2 = 64;
    const h = 36;
    const pixels = new Uint8Array(w2 * h * 4);
    gl2.readPixels(0, 0, w2, h, gl2.RGBA, gl2.UNSIGNED_BYTE, pixels);
    const bins = [new Array(32).fill(0), new Array(32).fill(0), new Array(32).fill(0)];
    for (let i = 0; i < pixels.length; i += 4) {
      bins[0][Math.min(31, (pixels[i] ?? 0) >> 3)] += 1;
      bins[1][Math.min(31, (pixels[i + 1] ?? 0) >> 3)] += 1;
      bins[2][Math.min(31, (pixels[i + 2] ?? 0) >> 3)] += 1;
    }
    return bins;
  }
  drawScopes(ctx, width, height) {
    const boxW = Math.min(220, width * 0.28);
    const boxH = boxW * 0.42;
    const x2 = 14;
    const y2 = height - boxH - 14;
    ctx.fillStyle = "rgba(10,11,16,.78)";
    ctx.strokeStyle = "rgba(255,255,255,.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x2, y2, boxW, boxH, 0);
    ctx.fill();
    ctx.stroke();
    const colors = ["#ff5c5c", "#4cd964", "#4c8dff"];
    this.histogram.forEach((bins, ci2) => {
      if (!bins.length) return;
      const max = Math.max(1, ...bins);
      ctx.strokeStyle = colors[ci2];
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      bins.forEach((v2, i) => {
        const px = x2 + 6 + i / (bins.length - 1) * (boxW - 12);
        const py = y2 + boxH - 6 - v2 / max * (boxH - 12);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(255,255,255,.45)";
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText("RGB PARADE", x2 + 8, y2 + 14);
  }
  dispose() {
    this.disposed = true;
    window.removeEventListener("resize", this.onWindowResize);
    cancelAnimationFrame(this.raf);
    for (const element of this.videoCache.values()) {
      element.pause();
      element.removeAttribute("src");
      element.load();
    }
    for (const element of this.audioElements.values()) element.pause();
    for (const image of this.imageCache.values()) image.removeAttribute("src");
    this.videoCache.clear();
    this.imageCache.clear();
    this.audioElements.clear();
    this.currentImage = null;
    void this.audioContext?.close();
  }
}
function drawTitle(ctx, clip, sequence, width, height) {
  const text = clip.text;
  if (!text) return;
  const scale = width / Math.max(1, sequence.width);
  const fontSize = Math.max(8, text.fontSize * scale);
  const lineHeight = fontSize * 1.22;
  const lines = text.content.split(/\r?\n/);
  ctx.save();
  ctx.font = `600 ${fontSize}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = text.align;
  ctx.textBaseline = "middle";
  const anchorX = clamp(text.x, 0, 1) * width;
  const anchorY = clamp(text.y, 0, 1) * height;
  const total = lines.length * lineHeight;
  const startY = anchorY - total / 2 + lineHeight / 2;
  lines.forEach((line, index) => {
    const y2 = startY + index * lineHeight;
    if (text.background) {
      const metrics = ctx.measureText(line);
      const padX = fontSize * 0.35;
      const padY = fontSize * 0.18;
      const boxWidth = metrics.width + padX * 2;
      const left = text.align === "left" ? anchorX - padX : text.align === "right" ? anchorX - metrics.width - padX : anchorX - boxWidth / 2;
      ctx.fillStyle = "rgba(0,0,0,.38)";
      ctx.fillRect(left, y2 - lineHeight / 2 + padY * 0.2, boxWidth, lineHeight - padY * 0.4);
    }
    ctx.fillStyle = /^#[0-9a-f]{6}$/i.test(text.color) ? text.color : "#ffffff";
    ctx.fillText(line, anchorX, y2);
  });
  ctx.restore();
}
function readGrade(clip) {
  let saturation = 1;
  let contrast = 1;
  let temperature = 0;
  let tint = 0;
  let vignette = 0;
  for (const effect of clip?.effects ?? []) {
    if (!effect.enabled) continue;
    const value = (key, fallback) => Number(effect.params[key] ?? fallback);
    switch (effect.type) {
      case "Cinematic LUT": {
        const intensity = clamp(value("intensity", 0.8), 0, 1);
        contrast *= value("contrast", 1.08);
        saturation *= 0.95 + intensity * 0.15;
        vignette = 0.25 * intensity;
        break;
      }
      case "Color Wheels":
        saturation *= value("saturation", 1);
        contrast *= value("contrast", 1);
        temperature += value("temperature", 0) + value("lift", 0) * 0.25 + value("gain", 0) * 0.1;
        tint += value("tint", 0);
        break;
      case "Sharpen":
        contrast *= 1 + value("amount", 0.4) * 0.05;
        break;
      case "Film Grain": {
        const amount = value("amount", 0.2);
        saturation *= 1 - amount * 0.1;
        break;
      }
      case "Glow":
        contrast *= 0.98;
        break;
    }
  }
  return { saturation, contrast, temperature, tint, vignette };
}
function Preview() {
  const { t: t2 } = useTranslation();
  const project2 = useProjectStore((s) => s.project);
  const sequence = useProjectStore((s) => s.sequence());
  const playhead = useProjectStore((s) => s.playhead);
  const playing = useProjectStore((s) => s.playing);
  const setPlayhead = useProjectStore((s) => s.setPlayhead);
  const setPlaying = useProjectStore((s) => s.setPlaying);
  const togglePlay = useProjectStore((s) => s.togglePlay);
  const settings2 = useUiStore((s) => s.settings);
  const updateSettings = useUiStore((s) => s.updateSettings);
  const showScopes = useUiStore((s) => s.showScopes);
  const showSafeArea = useUiStore((s) => s.showSafeArea);
  const toggleScopes = useUiStore((s) => s.toggleScopes);
  const toggleSafeArea = useUiStore((s) => s.toggleSafeArea);
  const [fps, setFps] = reactExports.useState(60);
  const [muted, setMuted] = reactExports.useState(false);
  const canvasRef = reactExports.useRef(null);
  const overlayRef = reactExports.useRef(null);
  const engineRef = reactExports.useRef(null);
  const frame = 1 / sequence.fps;
  reactExports.useEffect(() => {
    if (!canvasRef.current || !overlayRef.current) return;
    const engine = new PreviewEngine(canvasRef.current, overlayRef.current);
    engine.onTime = (time) => useProjectStore.getState().setPlayhead(time);
    engine.onStats = (value) => setFps(value);
    engine.onEnded = () => {
      const state = useProjectStore.getState();
      state.setPlaying(false);
      state.setPlayhead(sequenceContentDuration(state.sequence()));
    };
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);
  reactExports.useEffect(() => {
    engineRef.current?.update({
      project: useProjectStore.getState().project,
      sequence: useProjectStore.getState().sequence(),
      time: playhead,
      playing,
      muted,
      showScopes,
      showSafeArea,
      quality: settings2.previewQuality
    });
  }, [muted, project2, playhead, playing, settings2.previewQuality, showSafeArea, showScopes, sequence]);
  const hasSolo = sequence.tracks.some((t22) => t22.solo);
  const activeClip2 = sequence.tracks.filter((t22) => (t22.kind === "video" || t22.kind === "adjustment") && !t22.mute && (!hasSolo || t22.solo)).flatMap((t22) => t22.clips).find((c) => playhead >= c.start && playhead < c.start + c.duration);
  const contentEnd = sequenceContentDuration(sequence);
  const aspect = sequence.width / sequence.height;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel preview-panel", "aria-label": "Program monitor", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 15 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t2("preview.title") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge subtle", children: sequence.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sequence.width,
          "×",
          sequence.height
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          sequence.fps,
          " fps"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "meta-dot" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: sequence.colorSpace === "rec709" ? "" : "hdr-text", children: sequence.colorSpace.toUpperCase() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `icon-btn ${showScopes ? "active" : ""}`, onClick: toggleScopes, title: t2("preview.scopes"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `icon-btn ${showSafeArea ? "active" : ""}`, onClick: toggleSafeArea, title: t2("preview.safeArea"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "select select-sm",
            value: settings2.previewQuality,
            onChange: (e) => void updateSettings({ previewQuality: e.target.value }),
            title: t2("preview.quality"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: t2("preview.auto") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full", children: t2("preview.full") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "half", children: t2("preview.half") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "quarter", children: t2("preview.quarter") })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-stage", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-frame", style: { aspectRatio: `${aspect}` }, onClick: () => togglePlay(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "preview-canvas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: overlayRef, className: "preview-overlay" }),
      activeClip2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-clip-tag", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tag-dot" }),
        activeClip2.name,
        activeClip2.effects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fx-count", children: [
          "FX ",
          activeClip2.effects.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preview-hud", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTimecode(playhead, sequence.fps) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          fps.toFixed(0),
          " fps"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: settings2.previewQuality === "auto" ? "AUTO" : settings2.previewQuality.toUpperCase() })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transport", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transport-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Vai all'inizio", onClick: () => setPlayhead(0), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "skipStart" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Frame precedente", onClick: () => setPlayhead(Math.max(0, playhead - frame)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "rewind" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "play-btn", onClick: () => togglePlay(), "aria-label": playing ? "Pausa" : "Play", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: playing ? "pause" : "play", size: 18 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Frame successivo", onClick: () => setPlayhead(playhead + frame), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "forward" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Fine", onClick: () => setPlayhead(contentEnd), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "skipEnd" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Stop", onClick: () => {
          setPlaying(false);
          setPlayhead(0);
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "stop" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timecode", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tc-current", children: formatTimecode(playhead, sequence.fps) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tc-sep", children: "/" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tc-total", children: formatTimecode(Math.max(contentEnd, playhead), sequence.fps) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "transport-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `icon-btn ${muted ? "active" : ""}`, title: "Muto monitor", onClick: () => setMuted(!muted), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: muted ? "eyeOff" : "volume", size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "audio-meter", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { height: playing ? "68%" : "18%" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { height: playing ? "44%" : "12%" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { height: playing ? "82%" : "22%" } })
        ] })
      ] })
    ] })
  ] });
}
function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  format,
  onChange,
  onBegin,
  hasKeyframe,
  onKeyframe,
  disabled
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `slider-row ${disabled ? "disabled" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slider-label", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "slider-value", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: Number.isFinite(value) ? Number(value.toFixed(2)) : 0,
            min,
            max,
            step,
            disabled,
            onFocus: onBegin,
            onChange: (e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) onChange(next);
            },
            "aria-label": label
          }
        ),
        unit && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: unit }),
        onKeyframe && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `keyframe-btn ${hasKeyframe ? "active" : ""}`,
            onClick: onKeyframe,
            title: hasKeyframe ? "Rimuovi keyframe al playhead" : "Aggiungi keyframe al playhead",
            "aria-label": "Keyframe",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "keyframe", size: 11 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "slider",
        type: "range",
        min,
        max,
        step,
        value,
        disabled,
        onPointerDown: onBegin,
        onChange: (e) => onChange(Number(e.target.value)),
        "aria-valuetext": format ? format(value) : `${value}${unit}`
      }
    )
  ] });
}
function Inspector() {
  const { t: t2 } = useTranslation();
  const tab = useUiStore((s) => s.inspectorTab);
  const setTab = useUiStore((s) => s.setInspectorTab);
  const toast = useUiStore((s) => s.toast);
  const project2 = useProjectStore((s) => s.project);
  const sequence = useProjectStore((s) => s.sequence());
  const selection = useProjectStore((s) => s.selection);
  const found = reactExports.useMemo(() => {
    const id2 = selection.clipIds[0];
    if (!id2) return null;
    for (const track2 of sequence.tracks) {
      const clip2 = track2.clips.find((c) => c.id === id2);
      if (clip2) return { clip: clip2, track: track2 };
    }
    return null;
  }, [selection.clipIds, sequence.tracks]);
  const clip = found?.clip ?? null;
  const track = found?.track ?? null;
  const playhead = useProjectStore((s) => s.playhead);
  const updateClip = useProjectStore((s) => s.updateClip);
  const updateTrack = useProjectStore((s) => s.updateTrack);
  const updateEffect = useProjectStore((s) => s.updateEffect);
  const addEffect = useProjectStore((s) => s.addEffect);
  const removeEffect = useProjectStore((s) => s.removeEffect);
  const toggleKeyframe = useProjectStore((s) => s.toggleKeyframe);
  const pushHistory = useProjectStore((s) => s.pushHistory);
  const splitAtPlayhead = useProjectStore((s) => s.splitAtPlayhead);
  const duplicate = useProjectStore((s) => s.duplicateSelected);
  const removeSelected = useProjectStore((s) => s.deleteSelected);
  const asset = reactExports.useMemo(() => clip?.mediaId ? project2.media.find((m2) => m2.id === clip.mediaId) : null, [clip?.mediaId, project2.media]);
  const colorEffect = clip?.effects.find((e) => e.type === "Color Wheels");
  if (!clip || !track) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel inspector", "aria-label": t2("inspector.title"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "panel-head", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 15 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t2("inspector.title") })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-empty", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "empty-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "keyframe", size: 22 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t2("inspector.noSelection") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t2("inspector.noSelectionHint") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-shortcuts", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "V" }),
            " Selezione"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "C" }),
            " Forbici"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Ctrl" }),
            "+",
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "K" }),
            " Dividi"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "T" }),
            " Aggiungi testo"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Ctrl" }),
            "+",
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Shift" }),
            "+",
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "P" }),
            " Comandi"
          ] })
        ] })
      ] })
    ] });
  }
  const localTime = playhead - clip.start;
  const animated = (key) => interpolateKeyframes(clip.keyframes?.[key] ?? [], localTime, clip.transform[key]);
  const hasKf = (key) => (clip.keyframes?.[key] ?? []).some((k2) => Math.abs(k2.time - localTime) < 0.05);
  const setTransform = (key, value) => {
    updateClip(clip.id, { transform: { ...clip.transform, [key]: value } }, false);
  };
  const setColor = (key, value) => {
    if (colorEffect) {
      updateEffect(clip.id, colorEffect.id, { params: { [key]: value } }, false);
      return;
    }
    addEffect(clip.id, "Color Wheels");
    const created = useProjectStore.getState().selectedClip()?.clip.effects.find((e) => e.type === "Color Wheels");
    if (created) useProjectStore.getState().updateEffect(clip.id, created.id, { params: { [key]: value } }, false);
  };
  const colorValue = (key, fallback) => Number(colorEffect?.params[key] ?? fallback);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel inspector", "aria-label": t2("inspector.title"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 15 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: t2("inspector.title") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", title: `${clip.start} → ${clip.start + clip.duration}`, children: formatTimecode(clip.duration, sequence.fps) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clip-summary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "clip-summary-color", style: { background: clip.color } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: clip.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          track.name,
          " · ",
          asset ? `${asset.codec.toUpperCase()} ${asset.width}×${asset.height}` : "generator"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clip-summary-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Dividi", onClick: splitAtPlayhead, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cut", size: 13 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", title: "Duplica", onClick: duplicate, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 13 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn danger", title: "Elimina", onClick: removeSelected, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 13 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabs", role: "tablist", children: ["video", "audio", "color", "effects"].map((key) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "tab", "aria-selected": tab === key, className: `tab ${tab === key ? "active" : ""}`, onClick: () => setTab(key), children: t2(`inspector.${key}`) }, key)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-body", children: [
      tab === "video" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        clip.text && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-editor", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Testo / Titolo" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: clip.text.content,
              onFocus: pushHistory,
              onChange: (e) => {
                const content = e.target.value;
                updateClip(
                  clip.id,
                  { text: { ...clip.text, content }, name: content.trim().slice(0, 48) || "Titolo" },
                  false
                );
              },
              "aria-label": "Contenuto testo"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-editor-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              "Font",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  min: 8,
                  max: 400,
                  value: Math.round(clip.text.fontSize),
                  onFocus: pushHistory,
                  onChange: (e) => updateClip(clip.id, { text: { ...clip.text, fontSize: Number(e.target.value) || 8 } }, false)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "color",
                value: clip.text.color.startsWith("#") ? clip.text.color : "#ffffff",
                onFocus: pushHistory,
                onChange: (e) => updateClip(clip.id, { text: { ...clip.text, color: e.target.value } }, false),
                "aria-label": "Colore testo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: clip.text.align,
                onFocus: pushHistory,
                onChange: (e) => updateClip(clip.id, { text: { ...clip.text, align: e.target.value } }, false),
                "aria-label": "Allineamento testo",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "left", children: "Sinistra" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "center", children: "Centro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "right", children: "Destra" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: clip.text.background,
                  onChange: (e) => updateClip(clip.id, { text: { ...clip.text, background: e.target.checked } })
                }
              ),
              " ",
              "Box"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-editor-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "X" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 1,
                step: 0.01,
                value: clip.text.x,
                onPointerDown: pushHistory,
                onChange: (e) => updateClip(clip.id, { text: { ...clip.text, x: Number(e.target.value) } }, false)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Y" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 1,
                step: 0.01,
                value: clip.text.y,
                onPointerDown: pushHistory,
                onChange: (e) => updateClip(clip.id, { text: { ...clip.text, y: Number(e.target.value) } }, false)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2("inspector.transform") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "link-btn",
              onClick: () => updateClip(clip.id, { transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 } }),
              children: t2("inspector.reset")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.position") + " X", value: animated("x"), min: -sequence.width, max: sequence.width, step: 1, unit: "px", onBegin: pushHistory, onChange: (v2) => setTransform("x", v2), hasKeyframe: hasKf("x"), onKeyframe: () => toggleKeyframe(clip.id, "x", clip.transform.x) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.position") + " Y", value: animated("y"), min: -sequence.height, max: sequence.height, step: 1, unit: "px", onBegin: pushHistory, onChange: (v2) => setTransform("y", v2), hasKeyframe: hasKf("y"), onKeyframe: () => toggleKeyframe(clip.id, "y", clip.transform.y) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.scale"), value: animated("scale"), min: 0.1, max: 4, step: 0.01, unit: "×", onBegin: pushHistory, onChange: (v2) => setTransform("scale", v2), hasKeyframe: hasKf("scale"), onKeyframe: () => toggleKeyframe(clip.id, "scale", clip.transform.scale) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.rotation"), value: animated("rotation"), min: -180, max: 180, step: 0.5, unit: "°", onBegin: pushHistory, onChange: (v2) => setTransform("rotation", v2), hasKeyframe: hasKf("rotation"), onKeyframe: () => toggleKeyframe(clip.id, "rotation", clip.transform.rotation) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.opacity"), value: animated("opacity"), min: 0, max: 1, step: 0.01, onBegin: pushHistory, onChange: (v2) => setTransform("opacity", v2), hasKeyframe: hasKf("opacity"), onKeyframe: () => toggleKeyframe(clip.id, "opacity", clip.transform.opacity) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.speed"), value: clip.speed, min: 0.1, max: 8, step: 0.05, unit: "×", onBegin: pushHistory, onChange: (v2) => updateClip(clip.id, { speed: v2 }, false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2("media.duration") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatTimecode(clip.duration, sequence.fps) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "In point" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatTimecode(clip.inPoint, sequence.fps) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sorgente" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "truncate", title: asset?.path, children: asset?.name ?? "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Keyframe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: Object.values(clip.keyframes ?? {}).reduce((s, list) => s + list.length, 0) })
        ] })
      ] }),
      tab === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2("inspector.audio") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.volume"), value: clip.volume, min: 0, max: 2, step: 0.01, onBegin: pushHistory, onChange: (v2) => updateClip(clip.id, { volume: v2 }, false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: `Pan ${track.name}`, value: track.pan, min: -1, max: 1, step: 0.01, onBegin: pushHistory, onChange: (v2) => updateTrack(track.id, { pan: v2 }, false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: `Volume ${track.name}`, value: track.volume, min: 0, max: 1.5, step: 0.01, onBegin: pushHistory, onChange: (v2) => updateTrack(track.id, { volume: v2 }, false) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "meters", children: ["L", "R"].map((ch2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meter", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ch2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "meter-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${Math.min(100, clip.volume * 55 + 12)}%` } }) })
        ] }, ch2)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "waveform", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Loudness EBU R128" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "La normalizzazione loudness è applicata dai preset in export (target −14/−16 LUFS)." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Routing" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Canali" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: asset?.channels ?? 2 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sample rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
            asset?.sampleRate ?? 48e3,
            " Hz"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bus" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Master" })
        ] })
      ] }),
      tab === "color" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Color grading" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "link-btn", onClick: () => addEffect(clip.id, "Cinematic LUT"), children: "+ LUT" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.temperature"), value: colorValue("temperature", 0), min: -1, max: 1, step: 0.01, onBegin: pushHistory, onChange: (v2) => setColor("temperature", v2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.tint"), value: colorValue("tint", 0), min: -1, max: 1, step: 0.01, onBegin: pushHistory, onChange: (v2) => setColor("tint", v2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.contrast"), value: colorValue("contrast", 1.05), min: 0.5, max: 2, step: 0.01, onBegin: pushHistory, onChange: (v2) => setColor("contrast", v2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Slider, { label: t2("inspector.saturation"), value: colorValue("saturation", 1), min: 0, max: 2, step: 0.01, onBegin: pushHistory, onChange: (v2) => setColor("saturation", v2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "color-wheels", children: ["lift", "gamma", "gain"].map((wheel) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wheel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wheel-dial", style: { background: `conic-gradient(from 0deg, #ff5c5c, #ffb547, #4cd964, #38bdf8, #7c5cff, #ff5c8a, #ff5c5c)` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wheel-pick", style: { transform: `translate(${colorValue(wheel, 0) * 14}px, ${colorValue(wheel, 0) * -10}px)` } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: wheel.toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: -1, max: 1, step: 0.01, value: colorValue(wheel, 0), onPointerDown: pushHistory, onChange: (e) => setColor(wheel, Number(e.target.value)), "aria-label": wheel })
        ] }, wheel)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 16 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              sequence.colorSpace.toUpperCase(),
              " · ",
              asset?.isHDR ? "HDR" : "SDR"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "La conversione colore è trasparente in preview e export (Rec.709 / Rec.2020 / P3 / ACES)." })
          ] })
        ] })
      ] }),
      tab === "effects" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "add-effect", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "select",
            defaultValue: "",
            onChange: (e) => {
              if (!e.target.value) return;
              addEffect(clip.id, e.target.value);
              toast("success", `Effetto ${e.target.value} aggiunto`);
              e.target.value = "";
            },
            "aria-label": "Aggiungi effetto",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "", children: [
                t2("inspector.addEffect"),
                "…"
              ] }),
              EFFECT_CATALOG.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: name, children: name }, name))
            ]
          }
        ) }),
        clip.effects.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted padded", children: "Nessun effetto. Aggiungine uno dal menu qui sopra." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "effects-stack", children: clip.effects.map((effect) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `effect ${effect.enabled ? "" : "disabled"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "effect-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "eye", onClick: () => updateEffect(clip.id, effect.id, { enabled: !effect.enabled }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: effect.enabled ? "eye" : "eyeOff", size: 13 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: effect.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn danger", onClick: () => removeEffect(clip.id, effect.id), "aria-label": "Rimuovi effetto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 12 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "effect-body", children: Object.entries(effect.params).filter(([, v2]) => typeof v2 === "number").map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              label: key,
              value: Number(value),
              min: numericRange(effect.type, key).min,
              max: numericRange(effect.type, key).max,
              step: 0.01,
              onBegin: pushHistory,
              onChange: (v2) => updateEffect(clip.id, effect.id, { params: { [key]: v2 } }, false)
            },
            key
          )) })
        ] }, effect.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn btn-ghost btn-sm full",
            onClick: () => {
              clip.effects.find((e) => e.type === "Adjustment Layer");
              toast("info", "Preset effetti: salvataggio in roadmap (FX-4)");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 13 }),
              " Salva preset effetti"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function numericRange(type, key) {
  if (/opacity/i.test(key)) return { min: 0, max: 1 };
  if (/radius|threshold|amount|intensity|tolerance|spill|size/i.test(`${key} ${type}`)) return { min: 0, max: type === "Crop" ? 100 : 2 };
  if (/angle|rotation/i.test(key)) return { min: -180, max: 180 };
  if (/contrast|saturation|gain/i.test(key)) return { min: 0, max: 2 };
  return { min: -100, max: 100 };
}
const HEADER_WIDTH = 186;
const RULER_HEIGHT = 28;
const STEPS = [0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300];
function Timeline() {
  const project2 = useProjectStore((s) => s.project);
  const sequence = useProjectStore((s) => s.sequence());
  const playhead = useProjectStore((s) => s.playhead);
  const zoom = useProjectStore((s) => s.zoom);
  const tool = useProjectStore((s) => s.tool);
  const snapping = useProjectStore((s) => s.snapping);
  const selection = useProjectStore((s) => s.selection);
  const waveforms = useProjectStore((s) => s.waveforms);
  const setPlayhead = useProjectStore((s) => s.setPlayhead);
  const setPlaying = useProjectStore((s) => s.setPlaying);
  const setZoom = useProjectStore((s) => s.setZoom);
  const setTool = useProjectStore((s) => s.setTool);
  const toggleSnap = useProjectStore((s) => s.toggleSnap);
  const selectClip = useProjectStore((s) => s.selectClip);
  const addTrack = useProjectStore((s) => s.addTrack);
  const addTextClip = useProjectStore((s) => s.addTextClip);
  const addMedia = useProjectStore((s) => s.addMedia);
  const updateTrack = useProjectStore((s) => s.updateTrack);
  const addMarker = useProjectStore((s) => s.addMarker);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const canUndo = useProjectStore((s) => s.history.past.length > 0);
  const canRedo = useProjectStore((s) => s.history.future.length > 0);
  const toast = useUiStore((s) => s.toast);
  const scrollRef = reactExports.useRef(null);
  const laneRef = reactExports.useRef(null);
  const dragRef = reactExports.useRef(null);
  const dragFrameRef = reactExports.useRef(0);
  const dragPendingRef = reactExports.useRef(null);
  const rulerFrameRef = reactExports.useRef(0);
  const rulerPendingRef = reactExports.useRef(null);
  const hoverFrameRef = reactExports.useRef(0);
  const hoverPendingRef = reactExports.useRef(null);
  const [hoverTime, setHoverTime] = reactExports.useState(null);
  const [dropPreview, setDropPreview] = reactExports.useState(null);
  const duration = reactExports.useMemo(() => {
    const end = Math.max(30, ...sequence.tracks.flatMap((t2) => t2.clips.map((c) => c.start + c.duration)));
    return Math.ceil((end + 10) / 30) * 30;
  }, [sequence.tracks]);
  const width = duration * zoom;
  const fps = sequence.fps;
  const frame = 1 / fps;
  const tickStep = STEPS.find((s) => s * zoom >= 72) ?? 300;
  const ticks = Math.ceil(duration / tickStep);
  const clips = reactExports.useMemo(() => sequence.tracks.flatMap((t2) => t2.clips.map((c) => ({ clip: c, track: t2 }))), [sequence.tracks]);
  const mediaById = reactExports.useMemo(() => new Map(project2.media.map((asset) => [asset.id, asset])), [project2.media]);
  const planForMedia = reactExports.useCallback(
    (mediaId, trackId, start) => {
      const asset = mediaById.get(mediaId);
      if (!asset) return null;
      const requested = sequence.tracks.find((track) => track.id === trackId && !track.locked);
      const videoTracks = sequence.tracks.filter((track) => (track.kind === "video" || track.kind === "adjustment") && !track.locked);
      const audioTracks = sequence.tracks.filter((track) => track.kind === "audio" && !track.locked);
      const hasAudio = asset.kind === "audio" || asset.audioCodec !== "" && asset.channels > 0;
      const audioOnly = asset.kind === "audio" || asset.kind === "video" && hasAudio && requested?.kind === "audio";
      const duration2 = asset.kind === "image" ? 5 : Math.max(0.1, asset.durationSec || 5);
      if (audioOnly) {
        const target = requested?.kind === "audio" ? requested : [...audioTracks].reverse()[0];
        if (!target) return null;
        return { start, duration: duration2, label: asset.name, kind: "audio", audioTrackId: target.id };
      }
      const videoTarget = requested && (requested.kind === "video" || requested.kind === "adjustment") ? requested : [...videoTracks].reverse()[0];
      if (!videoTarget) return null;
      const audioTarget = asset.kind === "video" && hasAudio ? [...audioTracks].reverse()[0] : void 0;
      return {
        start,
        duration: duration2,
        label: asset.name,
        kind: asset.kind === "image" ? "image" : "video",
        videoTrackId: videoTarget.id,
        audioTrackId: audioTarget?.id
      };
    },
    [mediaById, sequence.tracks]
  );
  const planForKind = reactExports.useCallback(
    (kind, trackId, start, label) => {
      const requested = sequence.tracks.find((track) => track.id === trackId && !track.locked);
      const videoTracks = sequence.tracks.filter((track) => (track.kind === "video" || track.kind === "adjustment") && !track.locked);
      const audioTracks = sequence.tracks.filter((track) => track.kind === "audio" && !track.locked);
      if (kind === "audio") {
        const target = requested?.kind === "audio" ? requested : [...audioTracks].reverse()[0];
        return target ? { start, duration: 5, label, kind, audioTrackId: target.id } : null;
      }
      const videoTarget = requested && (requested.kind === "video" || requested.kind === "adjustment") ? requested : [...videoTracks].reverse()[0];
      if (!videoTarget) return null;
      return {
        start,
        duration: 5,
        label,
        kind,
        videoTrackId: videoTarget.id,
        audioTrackId: kind === "video" ? [...audioTracks].reverse()[0]?.id : void 0
      };
    },
    [sequence.tracks]
  );
  const snapTime = reactExports.useCallback(
    (time, ignoreIds) => {
      const frameSnapped = Math.round(time / frame) * frame;
      if (!snapping) return frameSnapped;
      const threshold = 7 / zoom;
      const ignore = ignoreIds && ignoreIds.length > 0 ? new Set(ignoreIds) : null;
      const candidates = [0, playhead, ...sequence.markers.map((m2) => m2.time)];
      for (const item of clips) {
        if (ignore?.has(item.clip.id)) continue;
        candidates.push(item.clip.start, item.clip.start + item.clip.duration);
      }
      let best = frameSnapped;
      let bestDelta = threshold;
      for (const candidate of candidates) {
        const delta = Math.abs(candidate - frameSnapped);
        if (delta < bestDelta) {
          best = candidate;
          bestDelta = delta;
        }
      }
      return Math.max(0, best);
    },
    [clips, frame, playhead, sequence.markers, snapping, zoom]
  );
  const timeFromClientX = reactExports.useCallback(
    (clientX) => {
      const lane = laneRef.current;
      if (!lane) return 0;
      const rect = lane.getBoundingClientRect();
      return Math.max(0, (clientX - rect.left - HEADER_WIDTH) / zoom);
    },
    [zoom]
  );
  const seekTo = reactExports.useCallback(
    (clientX) => {
      const time = timeFromClientX(clientX);
      return Math.max(0, Math.round(time / frame) * frame);
    },
    [frame, timeFromClientX]
  );
  const queueSeek = (clientX) => {
    rulerPendingRef.current = clientX;
    if (rulerFrameRef.current) return;
    rulerFrameRef.current = requestAnimationFrame(() => {
      rulerFrameRef.current = 0;
      const x2 = rulerPendingRef.current;
      rulerPendingRef.current = null;
      if (x2 !== null) setPlayhead(seekTo(x2));
    });
  };
  const queueHover = (time) => {
    hoverPendingRef.current = time;
    if (hoverFrameRef.current) return;
    hoverFrameRef.current = requestAnimationFrame(() => {
      hoverFrameRef.current = 0;
      setHoverTime(hoverPendingRef.current);
    });
  };
  const onRulerPointer = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlaying(false);
    queueSeek(event.clientX);
  };
  const onRulerMove = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      queueSeek(event.clientX);
    }
  };
  const onClipPointerDown = (event, clip, track) => {
    event.stopPropagation();
    if (track.locked) return;
    setPlaying(false);
    selectClip(clip.id, event.ctrlKey || event.metaKey);
    if (tool === "blade") {
      const time = seekTo(event.clientX);
      useProjectStore.getState().setPlayhead(time);
      useProjectStore.getState().splitAtPlayhead();
      return;
    }
    const target = event.target;
    const clipRect = event.currentTarget.getBoundingClientRect();
    const zone = 8;
    const wide = clipRect.width > zone * 2 + 4;
    const nearLeft = wide && event.clientX - clipRect.left <= zone;
    const nearRight = wide && clipRect.right - event.clientX <= zone;
    const mode = target.dataset.handle === "left" || target.dataset.handle === void 0 && nearLeft ? "trim-left" : target.dataset.handle === "right" || target.dataset.handle === void 0 && nearRight ? "trim-right" : "move";
    const ignoreIds = clip.linkId ? useProjectStore.getState().sequence().tracks.flatMap((t2) => t2.clips).filter((c) => c.linkId === clip.linkId).map((c) => c.id) : [clip.id];
    const rows = Array.from(document.querySelectorAll("[data-track-id]")).map((el2) => {
      const rect = el2.getBoundingClientRect();
      return { id: el2.dataset.trackId ?? "", top: rect.top, bottom: rect.bottom };
    });
    dragRef.current = {
      mode,
      clipId: clip.id,
      startX: event.clientX,
      startY: event.clientY,
      originStart: clip.start,
      originDuration: clip.duration,
      originIn: clip.inPoint,
      originTrackId: track.id,
      isAudio: track.kind === "audio",
      ignoreIds,
      historyPushed: false,
      rows
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };
  const applyDrag = reactExports.useCallback(
    (clientX, clientY) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (Math.abs(clientX - drag.startX) < 2 && Math.abs(clientY - drag.startY) < 2) return;
      if (!drag.historyPushed) {
        useProjectStore.getState().pushHistory();
        drag.historyPushed = true;
      }
      const state = useProjectStore.getState();
      const live = state.sequence().tracks.flatMap((t2) => t2.clips).find((c) => c.id === drag.clipId);
      if (!live) return;
      const delta = (clientX - drag.startX) / zoom;
      if (drag.mode === "move") {
        const start = snapTime(Math.max(0, drag.originStart + delta), drag.ignoreIds);
        let trackId = drag.originTrackId;
        const row = drag.rows.find((r2) => clientY >= r2.top && clientY < r2.bottom);
        if (row?.id) {
          const candidate = sequence.tracks.find((t2) => t2.id === row.id);
          const allowed = candidate !== void 0 && !candidate.locked && (drag.isAudio ? candidate.kind === "audio" : candidate.kind === "video" || candidate.kind === "adjustment");
          if (allowed) trackId = candidate.id;
        }
        state.moveClip(drag.clipId, start, trackId, false);
      } else if (drag.mode === "trim-left") {
        const targetStart = snapTime(Math.max(0, drag.originStart + delta), drag.ignoreIds);
        state.trimClip(drag.clipId, "left", targetStart - live.start, false);
      } else {
        const targetEnd = snapTime(drag.originStart + drag.originDuration + delta, drag.ignoreIds);
        state.trimClip(drag.clipId, "right", targetEnd - (live.start + live.duration), false);
      }
    },
    [sequence.tracks, snapTime, zoom]
  );
  const onClipPointerMove = (event) => {
    if (!dragRef.current) return;
    dragPendingRef.current = { x: event.clientX, y: event.clientY };
    if (dragFrameRef.current) return;
    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = 0;
      const pending = dragPendingRef.current;
      dragPendingRef.current = null;
      if (pending) applyDrag(pending.x, pending.y);
    });
  };
  const onClipPointerUp = (event) => {
    if (dragFrameRef.current) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = 0;
    }
    const pending = dragPendingRef.current;
    dragPendingRef.current = null;
    if (pending) applyDrag(pending.x, pending.y);
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const clearDropPreview = () => {
    setDropPreview(null);
    useUiStore.getState().setDraggedMediaId(null);
  };
  const onTrackDragOver = (event, track) => {
    const types = Array.from(event.dataTransfer.types);
    const hasMedia = types.includes("application/x-molicut-media");
    const hasFiles = types.includes("Files");
    if (!hasMedia && !hasFiles) return;
    event.preventDefault();
    if (event.dataTransfer.dropEffect !== "none") event.dataTransfer.dropEffect = "copy";
    const time = snapTime(timeFromClientX(event.clientX));
    if (hasMedia) {
      const mediaId = useUiStore.getState().draggedMediaId;
      setDropPreview(mediaId ? planForMedia(mediaId, track.id, time) : null);
      return;
    }
    const items = Array.from(event.dataTransfer.items ?? []).filter((item) => item.kind === "file");
    const mime = items[0]?.type ?? "";
    const kind = mime.startsWith("audio/") ? "audio" : mime.startsWith("image/") ? "image" : "video";
    const label = items.length > 1 ? `${items.length} file` : kind === "audio" ? "File audio" : kind === "image" ? "Immagine" : "Video";
    setDropPreview(planForKind(kind, track.id, time, label));
  };
  const onDrop = (event, track) => {
    event.preventDefault();
    if (track.locked) {
      toast("warn", "Traccia bloccata");
      clearDropPreview();
      return;
    }
    const time = dropPreview?.start ?? snapTime(timeFromClientX(event.clientX));
    const files = Array.from(event.dataTransfer.files ?? []);
    if (files.length > 0) {
      const paths2 = files.map((file) => filePath(file)).filter((path) => path.length > 0);
      const plan2 = dropPreview;
      clearDropPreview();
      if (paths2.length === 0) {
        toast("warn", "Impossibile leggere il percorso dei file trascinati.");
        return;
      }
      void (async () => {
        try {
          const { assets } = await call("media:importPaths", { paths: paths2, generateProxies: false });
          if (assets.length === 0) {
            toast("warn", "Nessun file importabile (formato non supportato).");
            return;
          }
          addMedia(assets);
          const targetTrack = plan2?.videoTrackId ?? plan2?.audioTrackId ?? track.id;
          let cursor = time;
          for (const asset of assets) {
            useProjectStore.getState().addClip(asset.id, targetTrack, cursor);
            cursor += asset.kind === "image" ? 5 : Math.max(0.1, asset.durationSec || 5);
          }
          toast("success", `${assets.length} file importati nella timeline`);
        } catch (err2) {
          toast("error", err2.message);
        }
      })();
      return;
    }
    const mediaId = event.dataTransfer.getData("application/x-molicut-media");
    const plan = mediaId ? planForMedia(mediaId, track.id, time) : null;
    clearDropPreview();
    if (!mediaId || !plan) return;
    useProjectStore.getState().addClip(mediaId, plan.videoTrackId ?? plan.audioTrackId ?? track.id, plan.start);
  };
  const fitZoom = () => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    setZoom(clamp((scroll.clientWidth - HEADER_WIDTH - 40) / Math.max(20, duration), 8, 320));
    scroll.scrollLeft = 0;
  };
  const applyZoom = (next) => {
    const scroll = scrollRef.current;
    const clamped = clamp(next, 8, 320);
    if (!scroll || clamped === zoom) return;
    const viewport = Math.max(80, scroll.clientWidth - HEADER_WIDTH);
    const anchorTime = (scroll.scrollLeft + viewport / 2) / zoom;
    setZoom(clamped);
    requestAnimationFrame(() => {
      scroll.scrollLeft = Math.max(0, anchorTime * clamped - viewport / 2);
    });
  };
  reactExports.useEffect(() => {
    const onKey = (event) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "v" || event.key === "V") setTool("select");
      if (event.key === "c" || event.key === "C") setTool("blade");
    };
    const onDragEnd = () => clearDropPreview();
    window.addEventListener("keydown", onKey);
    window.addEventListener("dragend", onDragEnd);
    window.addEventListener("drop", onDragEnd);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dragend", onDragEnd);
      window.removeEventListener("drop", onDragEnd);
    };
  }, [setTool]);
  reactExports.useEffect(
    () => () => {
      if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current);
      if (rulerFrameRef.current) cancelAnimationFrame(rulerFrameRef.current);
      if (hoverFrameRef.current) cancelAnimationFrame(hoverFrameRef.current);
    },
    []
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `panel timeline tool-${tool}`, "aria-label": "Timeline", "data-tool": tool, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "panel-head timeline-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 15 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge subtle", children: sequence.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-tools", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tool-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `tool ${tool === "select" ? "active" : ""}`, onClick: () => setTool("select"), title: "Selezione (V)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "keyframe", size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `tool ${tool === "blade" ? "active" : ""}`, onClick: () => setTool("blade"), title: "Forbici (C)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cut", size: 14 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `tool ${snapping ? "active" : ""}`, onClick: toggleSnap, title: "Snap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "magnet", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tool-sep" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: undo, disabled: !canUndo, title: "Annulla", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "undo", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: redo, disabled: !canRedo, title: "Ripeti", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "redo", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tool-sep" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-btn", onClick: () => addTrack("video"), title: "Aggiungi traccia video", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mini-plus", children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-btn", onClick: () => addTrack("audio"), title: "Aggiungi traccia audio", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "audio", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mini-plus", children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-btn", onClick: () => addTrack("subtitle"), title: "Aggiungi traccia testo", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mini-plus", children: "+" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-btn", onClick: () => addTextClip(), title: "Aggiungi testo (T)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mini-plus", children: "T" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "icon-btn", onClick: () => addMarker(""), title: "Marker (M)", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "keyframe", size: 13 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mini-plus", children: "+" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "zoom-control", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => applyZoom(zoom / 1.25), "aria-label": "Zoom out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "zoomOut", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 8, max: 320, value: zoom, onChange: (e) => applyZoom(Number(e.target.value)), "aria-label": "Zoom timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: () => applyZoom(zoom * 1.25), "aria-label": "Zoom in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "zoomIn", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost btn-xs", onClick: fitZoom, children: "Fit" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timeline-scroll", ref: scrollRef, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-grid", style: { width: width + HEADER_WIDTH }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ruler-row", style: { height: RULER_HEIGHT }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ruler-spacer", style: { width: HEADER_WIDTH }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ruler-hint", children: formatTimecode(playhead, fps) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "ruler",
            style: { width },
            onPointerDown: onRulerPointer,
            onPointerMove: onRulerMove,
            onPointerLeave: () => queueHover(null),
            onMouseMove: (e) => queueHover(timeFromClientX(e.clientX)),
            role: "slider",
            "aria-label": "Playhead",
            "aria-valuemin": 0,
            "aria-valuemax": duration,
            "aria-valuenow": playhead,
            tabIndex: 0,
            children: [
              Array.from({ length: ticks + 1 }, (_, i) => {
                const time = i * tickStep;
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tick", style: { left: time * zoom }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTimecode(time, fps).slice(3, 8) }) }, i);
              }),
              sequence.markers.map((marker) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "marker", style: { left: marker.time * zoom, background: marker.color }, title: marker.label }, marker.id)),
              hoverTime !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ruler-hover", style: { left: hoverTime * zoom } })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lanes", ref: laneRef, children: sequence.tracks.map((track) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `track-row ${track.kind} ${track.locked ? "locked" : ""}`, style: { height: track.height }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "track-header", style: { width: HEADER_WIDTH }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "track-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: track.kind === "audio" ? "audio" : track.kind === "subtitle" ? "file" : "film", size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: track.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "track-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: track.mute ? "on" : "", onClick: () => updateTrack(track.id, { mute: !track.mute }), title: "Mute", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: track.mute ? "eyeOff" : "volume", size: 12 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: track.solo ? "on solo" : "", onClick: () => updateTrack(track.id, { solo: !track.solo }), title: "Solo", children: "S" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: track.locked ? "on" : "", onClick: () => updateTrack(track.id, { locked: !track.locked }), title: "Blocca", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: track.locked ? "lock" : "unlock", size: 12 }) })
          ] }),
          track.kind === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "track-volume",
              type: "range",
              min: 0,
              max: 1.5,
              step: 0.01,
              value: track.volume,
              onPointerDown: () => useProjectStore.getState().pushHistory(),
              onChange: (e) => updateTrack(track.id, { volume: Number(e.target.value) }, false),
              "aria-label": `Volume ${track.name}`
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "track-lane",
            style: { width },
            "data-track-id": track.id,
            onDragOver: (e) => onTrackDragOver(e, track),
            onDragLeave: (e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setDropPreview(null);
            },
            onDrop: (e) => onDrop(e, track),
            onPointerDown: (e) => {
              if (e.target === e.currentTarget) {
                selectClip(null);
                setPlaying(false);
                setPlayhead(seekTo(e.clientX));
              }
            },
            children: [
              track.clips.map((clip) => {
                const selected = selection.clipIds.includes(clip.id);
                const isAudio = track.kind === "audio";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `clip ${selected ? "selected" : ""} ${isAudio ? "audio-clip" : ""} ${clip.text ? "text-clip" : ""}`,
                    style: { left: clip.start * zoom, width: Math.max(3, clip.duration * zoom), borderColor: clip.color },
                    onPointerDown: (e) => onClipPointerDown(e, clip, track),
                    onPointerMove: onClipPointerMove,
                    onPointerUp: onClipPointerUp,
                    onDragStart: (e) => e.preventDefault(),
                    onDoubleClick: () => {
                      const asset = project2.media.find((m2) => m2.id === clip.mediaId);
                      if (asset) useProjectStore.getState().loadWaveform(asset.id);
                      useUiStore.getState().openModal("export", { mediaId: clip.mediaId });
                    },
                    title: `${clip.name} · ${formatTimecode(clip.start, fps)} → ${formatTimecode(clip.start + clip.duration, fps)}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipBody, { clip, isAudio, waveform: waveforms[clip.mediaId ?? ""] }),
                      selected && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trim-handle left", "data-handle": "left" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trim-handle right", "data-handle": "right" })
                      ] })
                    ]
                  },
                  clip.id
                );
              }),
              dropPreview && (dropPreview.videoTrackId === track.id || dropPreview.audioTrackId === track.id) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `drop-ghost ${dropPreview.videoTrackId === track.id ? "video" : "audio"}`,
                  style: {
                    left: dropPreview.start * zoom,
                    width: Math.max(6, dropPreview.duration * zoom)
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: dropPreview.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: dropPreview.audioTrackId === track.id && dropPreview.videoTrackId !== track.id ? "AUDIO" : dropPreview.kind === "image" ? "IMMAGINE" : "VIDEO" })
                  ]
                }
              ),
              track.clips.length === 0 && !dropPreview && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lane-empty", children: "Trascina media qui" })
            ]
          }
        )
      ] }, track.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "playhead", style: { left: HEADER_WIDTH + playhead * zoom, top: 0, height: RULER_HEIGHT + sequence.tracks.reduce((s, t2) => s + t2.height, 0) }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "playhead-cap" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timeline-foot", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatTimecode(playhead, fps) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "foot-dim", children: tool === "blade" ? "Forbici: clicca una clip per dividerla" : "Trascina clip, usa i bordi per il trim" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "foot-dim", children: [
        Math.round(zoom),
        " px/s · ",
        sequence.tracks.length,
        " tracce"
      ] })
    ] })
  ] });
}
function pseudoWave(seed2) {
  let hash = 0;
  for (let i = 0; i < seed2.length; i++) hash = (hash * 31 + seed2.charCodeAt(i)) % 9973;
  return Array.from({ length: 420 }, (_, i) => {
    const n2 = Math.abs(Math.sin((i + hash) / 9) * 0.55 + Math.sin((i + hash) / 2.7) * 0.25);
    return Math.min(1, n2 + (i % 17 === 0 ? 0.32 : 0));
  });
}
const ClipBody = reactExports.memo(function ClipBody2({
  clip,
  isAudio,
  waveform
}) {
  const fallback = reactExports.useMemo(() => pseudoWave(clip.id), [clip.id]);
  const peaks = waveform ?? fallback;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "clip-color", style: { background: clip.color } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clip-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "clip-name", children: [
        clip.name,
        clip.effects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { className: "clip-fx", children: [
          "FX ",
          clip.effects.length
        ] }),
        clip.speed !== 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { className: "clip-speed", children: [
          clip.speed,
          "x"
        ] })
      ] }),
      clip.text ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "clip-text-chip", children: [
        "TESTO · ",
        clip.text.content
      ] }) : isAudio ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "clip-wave", children: peaks.slice(0, Math.max(8, Math.floor(clip.duration * 18))).map((peak, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { height: `${Math.max(8, peak * 100)}%` } }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "clip-stripes", children: Array.from({ length: Math.max(1, Math.floor(clip.duration)) }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { opacity: 0.12 + i % 3 * 0.05 } }, i)) }),
      Object.keys(clip.keyframes ?? {}).some((k2) => (clip.keyframes?.[k2]?.length ?? 0) > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "clip-keyframes", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "keyframe", size: 9 }),
        " Keyframed"
      ] })
    ] })
  ] });
});
class ErrorBoundary extends reactExports.Component {
  state = { error: null, componentStack: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    const stack = info.componentStack ?? null;
    this.setState({ componentStack: stack });
    reportClientError(this.props.name, error, stack);
  }
  retry = () => {
    this.setState({ error: null, componentStack: null });
  };
  reload = () => {
    window.location.reload();
  };
  copy = () => {
    const { error, componentStack } = this.state;
    const text = [
      `MoliCut panel: ${this.props.name}`,
      `Message: ${error?.message ?? "unknown"}`,
      "",
      error?.stack ?? "",
      "",
      componentStack ?? ""
    ].join("\n");
    void navigator.clipboard?.writeText(text).catch(() => void 0);
  };
  render() {
    const { error, componentStack } = this.state;
    if (!error) return this.props.children;
    if (this.props.compact) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "panel crash-panel", role: "alert", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crash-panel-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "crash-kicker", children: "Pannello non disponibile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: this.props.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: error.message || "Errore imprevisto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crash-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-xs", onClick: this.retry, children: "Riprova" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-xs", onClick: this.reload, children: "Ricarica app" })
        ] })
      ] }) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "crash-screen", role: "alert", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crash-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "crash-kicker", children: "MoliCut ha isolato un errore" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Il progetto è al sicuro" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "L’interfaccia ha incontrato un errore in ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: this.props.name }),
        ". L’autosave e la coda di rendering restano attivi nel processo principale."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "crash-detail", children: error.message }),
      componentStack && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "crash-stack", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Dettagli tecnici" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: componentStack })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "crash-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-accent", onClick: this.retry, children: "Riprova senza riavviare" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: this.reload, children: "Ricarica finestra" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-ghost", onClick: this.copy, children: "Copia dettagli" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Se l’errore persiste, avvia in Safe Mode dal Debug panel: plugin ed effetti GPU vengono disattivati." })
    ] }) });
  }
}
const ExportDialog = reactExports.lazy(() => __vitePreload(() => import("./ExportDialog-0vXN7K87.js"), true ? __vite__mapDeps([0,1]) : void 0, import.meta.url).then((m2) => ({ default: m2.ExportDialog })));
const DebugPanel = reactExports.lazy(() => __vitePreload(() => import("./DebugPanel-BaFBZD1N.js"), true ? __vite__mapDeps([2,1]) : void 0, import.meta.url).then((m2) => ({ default: m2.DebugPanel })));
const SettingsModal = reactExports.lazy(() => __vitePreload(() => import("./SettingsModal-BdRXctdu.js"), true ? __vite__mapDeps([3,1]) : void 0, import.meta.url).then((m2) => ({ default: m2.SettingsModal })));
const CommandPalette = reactExports.lazy(() => __vitePreload(() => import("./CommandPalette-DEPGjky3.js"), true ? [] : void 0, import.meta.url).then((m2) => ({ default: m2.CommandPalette })));
function App() {
  useTranslation();
  const modal = useUiStore((s) => s.modal);
  const openModal = useUiStore((s) => s.openModal);
  const closeModal = useUiStore((s) => s.closeModal);
  const initUi = useUiStore((s) => s.init);
  const onboardingDone = useUiStore((s) => s.onboardingDone);
  const settings2 = useUiStore((s) => s.settings);
  const initQueue = useQueueStore((s) => s.init);
  reactExports.useEffect(() => {
    void initUi();
    void initQueue();
  }, [initQueue, initUi]);
  reactExports.useEffect(() => {
    const editPoints = () => {
      const project2 = useProjectStore.getState();
      const sequence = project2.sequence();
      const points = /* @__PURE__ */ new Set([0, sequenceContentDuration(sequence)]);
      for (const track of sequence.tracks) {
        for (const clip of track.clips) {
          points.add(clip.start);
          points.add(clip.start + clip.duration);
        }
      }
      return [...points].filter((point) => Number.isFinite(point)).sort((a, b) => a - b);
    };
    const onKey = (event) => {
      const target = event.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) {
        return;
      }
      const project2 = useProjectStore.getState();
      const sequence = project2.sequence();
      const mod = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      const frame = 1 / sequence.fps;
      if (mod) {
        if (event.shiftKey && key === "s") {
          event.preventDefault();
          void project2.saveProject(true);
        } else if (event.shiftKey && key === "p") {
          event.preventDefault();
          openModal("palette");
        } else if (event.shiftKey && key === "d") {
          event.preventDefault();
          openModal("debug");
        } else if (event.shiftKey && key === "q") {
          event.preventDefault();
          void useQueueStore.getState().openWindow();
        } else if (event.shiftKey && key === "k") {
          event.preventDefault();
          project2.splitAtPlayhead();
        } else if (key === "k") {
          event.preventDefault();
          project2.splitAtPlayhead();
        } else if (key === "m") {
          event.preventDefault();
          openModal("export");
        } else if (key === "i") {
          event.preventDefault();
          void project2.importMedia();
        } else if (key === "n") {
          event.preventDefault();
          void project2.newProject();
        } else if (key === "o") {
          event.preventDefault();
          void project2.openProject();
        } else if (key === "s") {
          event.preventDefault();
          void project2.saveProject();
        } else if (key === "z" && event.shiftKey) {
          event.preventDefault();
          project2.redo();
        } else if (key === "y") {
          event.preventDefault();
          project2.redo();
        } else if (key === "z") {
          event.preventDefault();
          project2.undo();
        } else if (key === "d") {
          event.preventDefault();
          project2.duplicateSelected();
        } else if (key === "a") {
          event.preventDefault();
          project2.selectAllClips();
        } else if (event.key === ",") {
          event.preventDefault();
          openModal("settings");
        }
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        project2.togglePlay();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (event.shiftKey) project2.rippleDeleteSelected();
        else project2.deleteSelected();
      } else if (event.key === "ArrowLeft" && event.altKey) {
        event.preventDefault();
        const points = editPoints().filter((point) => point < project2.playhead - 1e-4);
        project2.setPlayhead(points[points.length - 1] ?? 0);
      } else if (event.key === "ArrowRight" && event.altKey) {
        event.preventDefault();
        const points = editPoints().filter((point) => point > project2.playhead + 1e-4);
        project2.setPlayhead(points[0] ?? sequenceContentDuration(sequence));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        project2.setPlayhead(Math.max(0, project2.playhead - (event.shiftKey ? frame * 5 : frame)));
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        project2.setPlayhead(project2.playhead + (event.shiftKey ? frame * 5 : frame));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const points = editPoints().filter((point) => point < project2.playhead - 1e-4);
        project2.setPlayhead(points[points.length - 1] ?? 0);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const points = editPoints().filter((point) => point > project2.playhead + 1e-4);
        project2.setPlayhead(points[0] ?? sequenceContentDuration(sequence));
      } else if (event.key === "Home") {
        event.preventDefault();
        project2.setPlayhead(0);
      } else if (event.key === "End") {
        event.preventDefault();
        project2.setPlayhead(sequenceContentDuration(sequence));
      } else if (key === "m") {
        event.preventDefault();
        if (event.shiftKey) {
          const next = sequence.markers.filter((marker) => marker.time > project2.playhead + 1e-4).sort((a, b) => a.time - b.time)[0];
          if (next) project2.setPlayhead(next.time);
        } else {
          project2.addMarker("");
        }
      } else if (key === "j") {
        event.preventDefault();
        project2.setPlaying(false);
        project2.setPlayhead(Math.max(0, project2.playhead - 1));
      } else if (key === "k") {
        event.preventDefault();
        project2.setPlaying(false);
      } else if (key === "l") {
        event.preventDefault();
        project2.setPlaying(true);
      } else if (key === "s") {
        event.preventDefault();
        project2.toggleSnap();
      } else if (key === "t") {
        event.preventDefault();
        project2.addTextClip();
      } else if (key === "v") {
        event.preventDefault();
        project2.setTool("select");
      } else if (key === "c") {
        event.preventDefault();
        project2.setTool("blade");
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        project2.setZoom(project2.zoom * 1.25);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        project2.setZoom(project2.zoom / 1.25);
      } else if (event.key === "Escape" && modal) {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal, modal, openModal]);
  reactExports.useEffect(() => {
    if (!settings2.autosaveSeconds) return;
    const interval = setInterval(() => {
      void useProjectStore.getState().autosave();
    }, Math.max(15, settings2.autosaveSeconds) * 1e3);
    return () => clearInterval(interval);
  }, [settings2.autosaveSeconds]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TitleBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upper", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Media Bin", compact: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MediaBin, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Program Monitor", compact: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Preview, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Inspector", compact: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inspector, {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Timeline", compact: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Timeline, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Suspense, { fallback: null, children: [
      modal === "export" && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Export", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportDialog, {}) }),
      modal === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Impostazioni", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsModal, {}) }),
      modal === "debug" && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Debug", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DebugPanel, {}) }),
      modal === "palette" && /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: "Command Palette", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CommandPalette, {}) })
    ] }),
    !onboardingDone && /* @__PURE__ */ jsxRuntimeExports.jsx(Onboarding, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toasts, {})
  ] });
}
const FILTERS = [
  { id: "all", label: "queue.all" },
  { id: "queued", label: "queue.queued" },
  { id: "running", label: "queue.running" },
  { id: "paused", label: "queue.paused" },
  { id: "done", label: "queue.done" },
  { id: "error", label: "queue.errors" },
  { id: "canceled", label: "queue.canceled" }
];
const STATE_ICON = {
  queued: "queue",
  running: "play",
  paused: "pause",
  done: "check",
  error: "warning",
  canceled: "close"
};
function QueueApp() {
  const { t: t2 } = useTranslation();
  const queue = useQueueStore();
  const ui2 = useUiStore();
  const [panel, setPanel] = reactExports.useState("detail");
  const [presetId, setPresetId] = reactExports.useState("builtin-youtube-1080p");
  const [presetSearch, setPresetSearch] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const selected = queue.jobs.find((j) => j.id === queue.selectedJobId) ?? null;
  const logsRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    void queue.init();
    void ui2.init();
  }, []);
  reactExports.useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [queue.liveLogs, selected?.id]);
  const filtered = reactExports.useMemo(() => {
    const q2 = queue.search.trim().toLowerCase();
    return queue.jobs.filter((job) => {
      if (queue.filter !== "all" && job.state !== queue.filter) return false;
      if (!q2) return true;
      return `${job.name} ${job.preset.name} ${job.sourcePath} ${job.outputPath}`.toLowerCase().includes(q2);
    });
  }, [queue.filter, queue.jobs, queue.search]);
  const addFiles = async () => {
    setBusy(true);
    try {
      const result = await call("media:importDialog", { generateProxies: false });
      if (result.canceled || result.assets.length === 0) return;
      await queue.enqueue(result.assets.map((asset) => ({ sourcePath: asset.path, mediaId: asset.id, presetId, priority: 50, maxRetries: 3 })));
      ui2.toast("success", `${result.assets.length} file accodati`);
    } catch (err2) {
      ui2.toast("error", err2.message);
    } finally {
      setBusy(false);
    }
  };
  const currentLogs = selected ? queue.liveLogs[selected.id] ?? selected.logs : [];
  const presetFiltered = queue.presets.filter(
    (p2) => !presetSearch.trim() || `${p2.name} ${p2.description} ${p2.tags.join(" ")}`.toLowerCase().includes(presetSearch.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "queue-titlebar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "titlebar-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Brand, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BrandName, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "window-label", children: "Render Queue" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-title-meta", children: [
        isMock() && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge subtle", children: "DEMO" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-chip running", children: [
          queue.stats.running,
          " attivi"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-chip queued", children: [
          queue.stats.queued,
          " in coda"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-chip done", children: [
          queue.stats.done,
          " completati"
        ] }),
        queue.stats.error > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-chip error", children: [
          queue.stats.error,
          " errori"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "titlebar-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void call("window:control", { action: "open-editor" }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 13 }),
          " Editor"
        ] }),
        platform() !== "darwin" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "window-controls", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void call("window:control", { action: "minimize" }), "aria-label": "Minimizza", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "minimize", size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void call("window:control", { action: "maximize" }), "aria-label": "Massimizza", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "maximize", size: 13 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "close", onClick: () => void call("window:control", { action: "close" }), "aria-label": "Chiudi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "queue-sidebar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-accent full", onClick: () => void addFiles(), disabled: busy, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 14 }),
            " ",
            t2("queue.addJobs")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-selected-preset", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "select select-sm", value: presetId, onChange: (e) => setPresetId(e.target.value), "aria-label": "Preset per nuovi job", children: queue.presets.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: preset.id, children: preset.name }, preset.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "queue-filters", "aria-label": "Filtri coda", children: FILTERS.map((filter) => {
          const count = filter.id === "all" ? queue.stats.total : queue.stats[filter.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `filter-item ${queue.filter === filter.id ? "active" : ""}`, onClick: () => queue.setFilter(filter.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: filter.id === "all" ? "queue" : STATE_ICON[filter.id], size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2(filter.label) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: count })
          ] }, filter.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-sidebar-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-label", children: "Pannelli" }),
          [
            ["detail", "Dettaglio job", "file"],
            ["presets", "Preset manager", "sparkles"],
            ["watch", "Watch folder", "folder"],
            ["settings", "Impostazioni coda", "settings"]
          ].map(([id2, label, icon]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `filter-item ${panel === id2 ? "active" : ""}`, onClick: () => setPanel(id2), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: icon, size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
          ] }, id2))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-sidebar-foot", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-progress-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progresso coda" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                queue.stats.progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${queue.stats.progress}%` } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
              queue.stats.aggregateFps,
              " fps aggregati · ",
              queue.stats.running,
              "/",
              queue.concurrency,
              " worker"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.exportReport("csv"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 13 }),
            " ",
            t2("queue.exportReport")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "queue-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-toolbar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 13 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: queue.search, onChange: (e) => queue.setSearch(e.target.value), placeholder: "Cerca job, preset, path…", "aria-label": "Cerca job" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-toolbar-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void queue.action("pause-all"), disabled: queue.stats.running + queue.stats.queued === 0, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "pause", size: 12 }),
              " Pausa"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void queue.action("resume-all"), disabled: queue.stats.paused === 0, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play", size: 12 }),
              " Riprendi"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void queue.action("clear-finished"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 12 }),
              " ",
              t2("queue.clearFinished")
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "job-table", role: "table", "aria-label": "Render queue jobs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "job-head", role: "row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stato" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Job" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progresso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FPS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ETA" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dimensione" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "job-rows", children: [
            filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-empty", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "queue", size: 28 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t2("queue.noJobs") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Aggiungi file o invia una sequenza dall’editor. La coda sopravvive al riavvio." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-accent btn-sm", onClick: () => void addFiles(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 13 }),
                " ",
                t2("queue.addJobs")
              ] })
            ] }),
            filtered.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                role: "row",
                draggable: true,
                onDragStart: (e) => e.dataTransfer.setData("application/x-molicut-job", job.id),
                onDragOver: (e) => e.preventDefault(),
                onDrop: (e) => {
                  const id2 = e.dataTransfer.getData("application/x-molicut-job");
                  if (id2) void queue.reorder(id2, filtered.findIndex((j) => j.id === job.id));
                },
                className: `job-row ${job.state} ${queue.selectedJobId === job.id ? "selected" : ""}`,
                onClick: () => {
                  queue.selectJob(job.id);
                  setPanel("detail");
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `job-state ${job.state}`, title: job.state, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: STATE_ICON[job.state], size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: job.state })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "job-name", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { title: job.name, children: job.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { title: job.outputPath, children: job.error ? job.error.slice(0, 80) : job.outputPath })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "job-preset", children: [
                    job.preset.name,
                    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: job.preset.video.codec.toUpperCase() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "job-progress", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${job.state === "done" ? 100 : job.progress}%` } }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                      job.state === "done" ? 100 : job.progress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono", children: job.fps || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono", children: job.state === "running" ? formatEta(job.etaSec) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mono", children: job.sizeBytes ? formatBytes(job.sizeBytes) : "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "job-actions", children: [
                    job.state === "running" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("pause", job.id);
                    }, title: "Pausa", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "pause", size: 12 }) }),
                    job.state === "paused" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("resume", job.id);
                    }, title: "Riprendi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play", size: 12 }) }),
                    (job.state === "error" || job.state === "canceled") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("retry", job.id);
                    }, title: "Riprova", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 12 }) }),
                    (job.state === "running" || job.state === "queued" || job.state === "paused") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("cancel", job.id);
                    }, title: "Annulla", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 12 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("duplicate", job.id);
                    }, title: "Duplica", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 12 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: (e) => {
                      e.stopPropagation();
                      void queue.action("remove", job.id);
                    }, title: "Rimuovi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 12 }) })
                  ] })
                ]
              },
              job.id
            ))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "queue-detail", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "queue-detail-tabs", children: ["detail", "presets", "watch", "settings"].map((id2) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: panel === id2 ? "active" : "", onClick: () => setPanel(id2), children: id2 === "detail" ? "Job" : id2 === "presets" ? "Preset" : id2 === "watch" ? "Watch" : "Setup" }, id2)) }),
        panel === "detail" && (selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "job-detail-scroll", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-title", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `job-state ${selected.state}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: STATE_ICON[selected.state], size: 14 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                selected.preset.name,
                " · ",
                selected.preset.video.codec.toUpperCase(),
                " ",
                selected.preset.video.width ?? "src",
                "×",
                selected.preset.video.height ?? "src"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-progress", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress large", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${selected.progress}%` } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-stats", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Progresso" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selected.progress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "FPS" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.fps || "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Speed" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selected.speed || "—",
                  "x"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "ETA" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatEta(selected.etaSec) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sorgente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "truncate", title: selected.sourcePath, children: selected.sourcePath }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Output" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "truncate", title: selected.outputPath, children: selected.outputPath }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Durata" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatClock(selected.durationSec) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tentativi" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              selected.attempts,
              "/",
              selected.maxRetries + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Priorità" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.priority }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Encoder" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              selected.preset.video.encoderPolicy,
              " · ",
              selected.preset.video.codec.toUpperCase()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creazione" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: new Date(selected.createdAt).toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fine" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.finishedAt ? new Date(selected.finishedAt).toLocaleString() : "—" })
          ] }),
          selected.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-error", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 14 }),
            " ",
            selected.error
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Metriche" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-grid", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "FPS medi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.metrics.avgFps })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Frame" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selected.metrics.encodedFrames })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Tempo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatClock(selected.metrics.durationMs / 1e3) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Output" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatBytes(selected.metrics.outputBytes || selected.sizeBytes) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Log live" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "link-btn", onClick: () => void useQueueStore.getState().exportReport("json"), children: "JSON" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-logs", ref: logsRef, children: [
              currentLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: "Nessun log." }),
              currentLogs.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `queue-log ${/error|fail/i.test(line) ? "err" : /warn|fallback/i.test(line) ? "warn" : ""}`, children: line }, i))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void queue.action("duplicate", selected.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 12 }),
              " Duplica"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void call("shell:reveal", { path: selected.outputPath }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "folder", size: 12 }),
              " Output"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm danger", onClick: () => void queue.action("remove", selected.id), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 12 }),
              " Rimuovi"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-detail-empty", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 24 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t2("queue.noSelection") })
        ] })),
        panel === "presets" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-panel-scroll", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-field compact", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 12 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: presetSearch, onChange: (e) => setPresetSearch(e.target.value), placeholder: "Cerca preset…", "aria-label": "Cerca preset" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preset-mini-list", children: presetFiltered.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `preset-mini ${presetId === preset.id ? "active" : ""}`, onClick: () => setPresetId(preset.id), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: preset.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                preset.container.toUpperCase(),
                " · ",
                preset.video.codec.toUpperCase(),
                " · ",
                preset.video.width ?? "src",
                "×",
                preset.video.height ?? "src"
              ] })
            ] }),
            preset.video.hdr !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-chip hdr", children: preset.video.hdr.toUpperCase() }),
            presetId === preset.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 13 })
          ] }, preset.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void queue.importPresets(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 12 }),
              " Importa"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void queue.exportPresets(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "export", size: 12 }),
              " Esporta"
            ] })
          ] })
        ] }),
        panel === "watch" && /* @__PURE__ */ jsxRuntimeExports.jsx(WatchPanel, {}),
        panel === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-panel-scroll", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Esecuzione" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field range", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t2("queue.concurrency") }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: 1, max: 8, value: queue.concurrency, onChange: (e) => void queue.setConcurrency(Number(e.target.value)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: queue.concurrency })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.action("stop-after-current", void 0, true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "stop", size: 12 }),
              " Stop a fine job corrente"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.action("pause-all"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "pause", size: 12 }),
              " Pausa intera coda"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.action("resume-all"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play", size: 12 }),
              " Riprendi coda"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Report" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.exportReport("csv"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 12 }),
              " Report CSV"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void queue.exportReport("json"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 12 }),
              " Report JSON"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Notifiche" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "toggle-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Notifiche native" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "switch", "aria-checked": ui2.settings.notifications, className: `toggle ${ui2.settings.notifications ? "on" : ""}`, onClick: () => void ui2.updateSettings({ notifications: !ui2.settings.notifications }), type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "toggle-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Spegni PC a coda completata" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "switch", "aria-checked": ui2.settings.shutdownAfterQueue, className: `toggle ${ui2.settings.shutdownAfterQueue ? "on" : ""}`, onClick: () => void ui2.updateSettings({ shutdownAfterQueue: !ui2.settings.shutdownAfterQueue }), type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "La coda è persistente su SQLite: crash e riavvii non perdono i job. Limite e retention sono configurabili nelle Impostazioni." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "queue-foot", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 11 }),
        " Coda persistente · SQLite · retry con backoff"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dim", children: [
        queue.stats.total,
        " job · ",
        queue.concurrency,
        " worker · priorità dinamica"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dim", children: isMock() ? "DEMO BROWSER" : `${platform()} · tray attivo` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toasts, {})
  ] });
}
function WatchPanel() {
  const queue = useQueueStore();
  const ui2 = useUiStore();
  const [draft, setDraft] = reactExports.useState({ path: "", outputDir: "", presetId: "builtin-youtube-1080p", dryRun: true });
  const [test, setTest] = reactExports.useState(null);
  const add = async () => {
    if (!draft.path.trim() || !draft.outputDir.trim()) {
      ui2.toast("warn", "Inserisci cartella sorgente e output");
      return;
    }
    await queue.addFolder({
      path: draft.path.trim(),
      outputDir: draft.outputDir.trim(),
      presetId: draft.presetId,
      enabled: true,
      recursive: true,
      extensions: ["mp4", "mov", "mkv", "wav", "png", "jpg"],
      namePattern: null,
      excludePattern: null,
      stabilityMs: 4e3,
      action: "queue",
      conflict: "suffix",
      dryRun: draft.dryRun
    });
    ui2.toast("success", "Watch folder aggiunta");
    setDraft({ path: "", outputDir: "", presetId: draft.presetId, dryRun: true });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-panel-scroll", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cartelle monitorate" }) }),
      queue.folders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Nessuna watch folder configurata." }),
      queue.folders.map((folder) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "watch-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "watch-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "folder", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "truncate", title: folder.path, children: folder.path }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `toggle small ${folder.enabled ? "on" : ""}`,
              role: "switch",
              "aria-checked": folder.enabled,
              onClick: () => void queue.updateFolder({ ...folder, enabled: !folder.enabled }),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "watch-meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "→ ",
            folder.outputDir
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: folder.presetId.replace("builtin-", "") }),
          folder.dryRun && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-chip hdr", children: "DRY-RUN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: folder.conflict })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "watch-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void queue.testFolder(folder.id).then((r2) => setTest({ id: folder.id, ...r2 })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 11 }),
            " Test regole"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void queue.updateFolder({ ...folder, dryRun: !folder.dryRun }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "eye", size: 11 }),
            " Dry-run"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-xs danger", onClick: () => void queue.removeFolder(folder.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "trash", size: 11 }) })
        ] }),
        test?.id === folder.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "watch-test", children: [
          test.scanned,
          " file scansionati · ",
          test.matches.length,
          " corrispondenze",
          test.matches.slice(0, 4).map((match) => /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: match }, match))
        ] })
      ] }, folder.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nuova cartella" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: draft.path, onChange: (e) => setDraft({ ...draft, path: e.target.value }), placeholder: "C:\\\\Watch\\\\Incoming", "aria-label": "Cartella sorgente" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: draft.outputDir, onChange: (e) => setDraft({ ...draft, outputDir: e.target.value }), placeholder: "C:\\\\Watch\\\\Output", "aria-label": "Cartella output" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "select", value: draft.presetId, onChange: (e) => setDraft({ ...draft, presetId: e.target.value }), "aria-label": "Preset watch folder", children: queue.presets.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: preset.id, children: preset.name }, preset.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "toggle-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dry-run (non accoda)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "switch", "aria-checked": draft.dryRun, className: `toggle ${draft.dryRun ? "on" : ""}`, onClick: () => setDraft({ ...draft, dryRun: !draft.dryRun }), type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-accent full", onClick: () => void add(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "plus", size: 12 }),
        " Aggiungi watch folder"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "detail-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "detail-section-head", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Log watch" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "queue-logs short", children: [
        queue.watchLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: "Nessun evento." }),
        queue.watchLogs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `queue-log ${log.level}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-time", children: new Date(log.at).toLocaleTimeString() }),
          " ",
          log.message
        ] }, i))
      ] })
    ] })
  ] });
}
const params = new URLSearchParams(window.location.search);
const view = params.get("view") === "queue" ? "queue" : "editor";
initTheme();
installGlobalErrorReporting();
if (view === "editor") {
  void useProjectStore.getState().bootstrap().catch((err2) => reportClientError("project.bootstrap", err2));
  window.__stores = { project: useProjectStore };
}
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React$2.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { name: view === "queue" ? "Render Queue" : "Editor", children: view === "queue" ? /* @__PURE__ */ jsxRuntimeExports.jsx(QueueApp, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) })
);
export {
  Icon as I,
  useUiStore as a,
  useProjectStore as b,
  useQueueStore as c,
  call as d,
  formatBytes as e,
  formatClock as f,
  formatNumber as g,
  roundTo as h,
  useCommands as i,
  jsxRuntimeExports as j,
  on as o,
  reactExports as r,
  sequenceContentDuration as s,
  useTranslation as u
};
