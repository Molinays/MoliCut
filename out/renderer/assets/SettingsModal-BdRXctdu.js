import { u as useTranslation, a as useUiStore, r as reactExports, j as jsxRuntimeExports, I as Icon } from "./index-cNB6aAEX.js";
import { M as Modal } from "./Modal-Cdrp0PR3.js";
const ACCENTS = ["#4f8dff", "#22d3ee", "#38d9a9", "#ffb547", "#ff5c8a", "#a78bfa"];
function SettingsModal() {
  const { t } = useTranslation();
  const settings = useUiStore((s) => s.settings);
  const update = useUiStore((s) => s.updateSettings);
  const close = useUiStore((s) => s.closeModal);
  const toast = useUiStore((s) => s.toast);
  const [draft, setDraft] = reactExports.useState(settings);
  const [saving, setSaving] = reactExports.useState(false);
  const patch = (value) => setDraft((d) => ({ ...d, ...value }));
  const save = async () => {
    setSaving(true);
    try {
      await update(draft);
      toast("success", "Impostazioni salvate");
      close();
    } finally {
      setSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      title: t("settings.title"),
      subtitle: "Preferenze persistite in SQLite · nessuna telemetria",
      onClose: close,
      width: 820,
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: close, children: t("common.cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-accent", onClick: () => void save(), disabled: saving, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 14 }),
          " ",
          t("settings.save")
        ] })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t("settings.general") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.language") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: draft.language, onChange: (e) => patch({ language: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "it", children: "Italiano" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "en", children: "English" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.theme") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: draft.theme, onChange: (e) => patch({ theme: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dark", children: "Dark" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "light", children: "Light" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "system", children: "System" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.accent") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "accent-swatches", children: [
              ACCENTS.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `swatch ${draft.accent === color ? "active" : ""}`,
                  style: { background: color },
                  onClick: () => patch({ accent: color }),
                  "aria-label": `Accent ${color}`
                },
                color
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: draft.accent, onChange: (e) => patch({ accent: e.target.value }), "aria-label": "Accent personalizzato" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: t("settings.notifications"), checked: draft.notifications, onChange: (v) => patch({ notifications: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: t("settings.startMinimized"), checked: draft.startMinimized, onChange: (v) => patch({ startMinimized: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: t("settings.runAtLogin"), checked: draft.runAtLogin, onChange: (v) => patch({ runAtLogin: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: t("settings.watch"), checked: draft.watchEnabled, onChange: (v) => patch({ watchEnabled: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "telemetry-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.telemetry") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: "OFF" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t("settings.performance") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangeField, { label: t("queue.concurrency"), value: draft.maxConcurrentJobs, min: 1, max: 8, step: 1, onChange: (v) => patch({ maxConcurrentJobs: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangeField, { label: "CPU limit (%)", value: draft.cpuLimitPercent, min: 10, max: 100, step: 5, onChange: (v) => patch({ cpuLimitPercent: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangeField, { label: t("settings.memory"), value: draft.memoryLimitMB, min: 1024, max: 65536, step: 512, onChange: (v) => patch({ memoryLimitMB: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangeField, { label: t("settings.cache"), value: draft.cacheSizeMB, min: 512, max: 16384, step: 512, onChange: (v) => patch({ cacheSizeMB: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RangeField, { label: t("settings.autosave"), value: draft.autosaveSeconds, min: 15, max: 600, step: 15, onChange: (v) => patch({ autosaveSeconds: v }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("preview.quality") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: draft.previewQuality, onChange: (e) => patch({ previewQuality: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: "Auto (adattiva)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "full", children: "Piena" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "half", children: "1/2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "quarter", children: "1/4" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("settings.hardware") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: draft.hardwareOverride, onChange: (e) => patch({ hardwareOverride: e.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: "Auto (GPU-first)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "nvidia", children: "NVIDIA NVENC" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "amd", children: "AMD AMF" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "intel", children: "Intel QSV" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "apple", children: "Apple VideoToolbox" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "vaapi", children: "VAAPI (Linux)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "software", children: "Solo software" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Toggle,
            {
              label: "Solo GPU (nessun fallback CPU)",
              checked: draft.gpuOnly,
              onChange: (v) => patch({ gpuOnly: v })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Con una GPU rilevata l'export usa solo NVENC/AMF/QSV/VideoToolbox. Se l'encoder non è disponibile il job fallisce invece di passare alla CPU." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Toggle, { label: t("settings.safeMode"), checked: draft.safeMode, onChange: (v) => patch({ safeMode: v }), danger: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-section wide", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: t("settings.shortcuts") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shortcuts-grid", children: Object.entries(draft.shortcuts).map(([id, key]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shortcut-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shortcutLabel(id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: key })
          ] }, id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "La rimappatura completa è prevista in roadmap (UX-3); i valori sono persistiti e validati." })
        ] })
      ] })
    }
  );
}
function Toggle({ label, checked, onChange, danger }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: `toggle-row ${danger ? "danger" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { role: "switch", "aria-checked": checked, className: `toggle ${checked ? "on" : ""}`, onClick: () => onChange(!checked), type: "button", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}) })
  ] });
}
function RangeField({ label, value, min, max, step, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "field range", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min, max, step, value, onChange: (e) => onChange(Number(e.target.value)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: value })
    ] })
  ] });
}
function shortcutLabel(id) {
  const map = {
    "command.palette": "Command palette",
    "debug.panel": "Debug panel",
    "timeline.split": "Dividi clip",
    "timeline.rippleDelete": "Elimina con ripple",
    "timeline.addTitle": "Aggiungi testo",
    "timeline.snap": "Snap",
    "timeline.delete": "Elimina",
    "playback.playPause": "Play / Pausa",
    "project.save": "Salva progetto",
    "project.saveAs": "Salva con nome",
    "export.dialog": "Apri export",
    "queue.window": "Render queue"
  };
  return map[id] ?? id;
}
export {
  SettingsModal
};
