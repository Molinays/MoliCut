import { u as useTranslation, i as useCommands, a as useUiStore, r as reactExports, j as jsxRuntimeExports, I as Icon } from "./index-cNB6aAEX.js";
function CommandPalette() {
  const { t } = useTranslation();
  const commands = useCommands();
  const close = useUiStore((s) => s.closeModal);
  const [query, setQuery] = reactExports.useState("");
  const [index, setIndex] = reactExports.useState(0);
  const inputRef = reactExports.useRef(null);
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.category} ${c.id}`.toLowerCase().includes(q));
  }, [commands, query]);
  reactExports.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  reactExports.useEffect(() => {
    setIndex(0);
  }, [query]);
  const run = (i) => {
    const command = filtered[i];
    close();
    void command?.run();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "palette-backdrop", onMouseDown: (e) => e.target === e.currentTarget && close(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "palette", role: "dialog", "aria-label": t("menu.commandPalette"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "palette-input", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 17 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          value: query,
          placeholder: t("palette.placeholder"),
          onChange: (e) => setQuery(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(filtered.length - 1, i + 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(0, i - 1));
            }
            if (e.key === "Enter") run(index);
          },
          "aria-label": "Cerca comandi"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Esc" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "palette-results", role: "listbox", children: [
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "palette-empty", children: "Nessun comando trovato" }),
      filtered.map((command, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          role: "option",
          "aria-selected": i === index,
          className: `palette-item ${i === index ? "selected" : ""}`,
          onMouseEnter: () => setIndex(i),
          onClick: () => run(i),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "palette-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: command.icon, size: 15 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "palette-label", children: command.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "palette-cat", children: command.category }),
            command.shortcut && /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: command.shortcut })
          ]
        },
        command.id
      ))
    ] })
  ] }) });
}
export {
  CommandPalette
};
