import { r as reactExports, j as jsxRuntimeExports, I as Icon } from "./index-cNB6aAEX.js";
function Modal({ title, subtitle, children, footer, onClose, width = 760, className = "" }) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.activeElement;
    ref.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-backdrop", role: "presentation", onMouseDown: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `modal ${className}`,
      style: { width },
      role: "dialog",
      "aria-modal": "true",
      "aria-label": title,
      tabIndex: -1,
      ref,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "modal-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: title }),
            subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: subtitle })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon-btn", onClick: onClose, "aria-label": "Chiudi", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-body", children }),
        footer && /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "modal-foot", children: footer })
      ]
    }
  ) });
}
export {
  Modal as M
};
