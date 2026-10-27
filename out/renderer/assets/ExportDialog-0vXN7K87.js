import { u as useTranslation, a as useUiStore, b as useProjectStore, c as useQueueStore, r as reactExports, d as call, s as sequenceContentDuration, j as jsxRuntimeExports, I as Icon, f as formatClock, e as formatBytes } from "./index-cNB6aAEX.js";
import { M as Modal } from "./Modal-Cdrp0PR3.js";
function ExportDialog() {
  const { t } = useTranslation();
  const close = useUiStore((s) => s.closeModal);
  const toast = useUiStore((s) => s.toast);
  const gpuOnly = useUiStore((s) => s.settings.gpuOnly);
  const project = useProjectStore((s) => s.project);
  const sequence = useProjectStore((s) => s.sequence());
  const presets = useQueueStore((s) => s.presets);
  const loadPresets = useQueueStore((s) => s.loadPresets);
  const enqueue = useQueueStore((s) => s.enqueue);
  const [presetId, setPresetId] = reactExports.useState("builtin-youtube-1080p");
  const [search, setSearch] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [profile, setProfile] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (presets.length === 0) void loadPresets();
    void call("system:profile", {}).then(({ profile: loaded }) => setProfile(loaded)).catch(() => setProfile(null));
  }, [loadPresets, presets.length]);
  const selectedPreset = presets.find((p) => p.id === presetId);
  const durationSec = sequenceContentDuration(sequence);
  const clipCount = sequence.tracks.reduce((sum, track) => sum + track.clips.length, 0);
  const assetById = reactExports.useMemo(() => new Map(project.media.map((asset) => [asset.id, asset])), [project.media]);
  const hasAudio = sequence.tracks.filter((track) => track.kind === "audio").flatMap((track) => track.clips).some((clip) => clip.mediaId ? (assetById.get(clip.mediaId)?.channels ?? 0) > 0 : false);
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return presets.filter((p) => !q || `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase().includes(q));
  }, [presets, search]);
  const estimated = reactExports.useMemo(() => {
    if (!selectedPreset) return 0;
    const videoKbps = selectedPreset.video.codec === "none" ? 0 : selectedPreset.video.bitrateKbps;
    const audioKbps = selectedPreset.audio.codec === "none" || !hasAudio ? 0 : selectedPreset.audio.bitrateKbps;
    return Math.round((videoKbps + audioKbps) * 1e3 * durationSec / 8);
  }, [durationSec, hasAudio, selectedPreset]);
  const gpuEncoder = profile?.encoders.find((encoder) => encoder.available && encoder.id !== "software") ?? null;
  const gpuSupportsPreset = !gpuEncoder || !selectedPreset || selectedPreset.video.codec === "none" ? true : gpuEncoder.codecs.includes(selectedPreset.video.codec);
  const strictGpu = gpuOnly && Boolean(gpuEncoder);
  const addToQueue = async () => {
    if (!selectedPreset) return;
    if (durationSec <= 0 || clipCount === 0) {
      toast("warn", "La timeline è vuota: aggiungi almeno una clip prima di esportare.");
      return;
    }
    setBusy(true);
    try {
      await enqueue([
        {
          name: `${project.name} — ${sequence.name} → ${selectedPreset.name}`,
          timeline: { project, sequenceId: sequence.id },
          presetId: selectedPreset.id,
          durationSec,
          hasAudio,
          priority: 60,
          maxRetries: 1
        }
      ]);
      toast(
        "success",
        `Timeline accodata in ${strictGpu ? "GPU-only" : "export"}: ${sequence.name} (${formatClock(durationSec)})`
      );
      close();
    } catch (err) {
      toast("error", err.message);
    } finally {
      setBusy(false);
    }
  };
  const extension = selectedPreset?.container === "image2" ? "png" : selectedPreset?.container ?? "mp4";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Modal,
    {
      title: t("export.title"),
      subtitle: t("export.subtitle"),
      onClose: close,
      width: 980,
      footer: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-summary-foot", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            selectedPreset?.container.toUpperCase(),
            " · ",
            selectedPreset?.video.codec.toUpperCase(),
            " ·",
            " ",
            strictGpu ? "GPU ONLY" : "AUTO"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            t("export.estimated"),
            ": ",
            formatBytes(estimated)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn", onClick: close, children: t("common.cancel") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-accent", onClick: () => void addToQueue(), disabled: busy || clipCount === 0, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "queue", size: 14 }),
          " ",
          t("export.queue")
        ] })
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "export-h", children: "Timeline da esportare" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "output-card export-sequence-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 18 }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sequence.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                project.name,
                " · ",
                formatClock(durationSec),
                " · ",
                clipCount,
                " clip"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-source-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progetto" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: project.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sequenza" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sequence.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Risoluzione" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
              sequence.width,
              "×",
              sequence.height
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FPS" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sequence.fps }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Colore" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sequence.colorSpace }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Tracce" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: sequence.tracks.length }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Clip" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: clipCount }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Audio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: hasAudio ? "mix timeline" : "nessuno" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "note-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "L'export renderizza l'intera timeline: overlay video, mix audio e titoli. Non esporta i media singoli." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `note-card ${gpuSupportsPreset || !strictGpu ? "" : "warn-card"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: strictGpu ? "chip" : "warning", size: 14 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: gpuEncoder ? strictGpu ? gpuSupportsPreset ? `Solo GPU attiva: ${gpuEncoder.name} (${gpuEncoder.codecs.join(", ")}). Nessun fallback CPU.` : `${gpuEncoder.name} non supporta ${selectedPreset?.video.codec.toUpperCase()}. Scegli H.264/HEVC/AV1 o disattiva Solo GPU.` : `GPU rilevata (${gpuEncoder.name}) ma Solo GPU è disattivata nelle Impostazioni.` : "Nessun encoder GPU rilevato: l’export userà il software, unica opzione disponibile su questa macchina." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-col-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "export-h", children: t("export.preset") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-field compact", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Cerca preset…",
                  "aria-label": "Cerca preset"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preset-list", children: filtered.map((preset) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `preset-row ${presetId === preset.id ? "active" : ""}`,
              onClick: () => setPresetId(preset.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-main", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: preset.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-tags", children: [
                    preset.tags.slice(0, 4).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: tag }, tag)),
                    preset.video.hdr !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "hdr", children: preset.video.hdr.toUpperCase() })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "preset-spec", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.video.width ? `${preset.video.width}×${preset.video.height}` : "sorgente" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.video.codec.toUpperCase() }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: preset.video.bitrateMode === "crf" ? `CRF ${preset.video.crf}` : `${Math.round(preset.video.bitrateKbps / 1e3)} Mbps` })
                ] })
              ]
            },
            preset.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-col side", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "export-h", children: t("export.output") }),
          selectedPreset && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "output-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "folder", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  project.name,
                  "_",
                  sequence.name,
                  selectedPreset.output.suffix,
                  ".",
                  extension
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Video/MoliCut/" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spec-list", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Contenuto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Timeline completa" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Container" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedPreset.container })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Video" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selectedPreset.video.codec.toUpperCase(),
                  " ·",
                  " ",
                  strictGpu ? gpuEncoder.name : selectedPreset.video.encoderPolicy
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Bitrate" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selectedPreset.video.bitrateMode.toUpperCase(),
                  " ",
                  Math.round(selectedPreset.video.bitrateKbps / 1e3),
                  " Mbps"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GOP" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selectedPreset.video.gopSeconds,
                  "s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Colore" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedPreset.video.colorSpace.toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "HDR" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedPreset.video.hdr === "none" ? "—" : selectedPreset.video.hdr.toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Audio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  selectedPreset.audio.codec.toUpperCase(),
                  " ",
                  selectedPreset.audio.codec === "none" ? "" : `${selectedPreset.audio.bitrateKbps}k`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Loudness" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: selectedPreset.audio.loudness.enabled ? `${selectedPreset.audio.loudness.targetLufs} LUFS` : "off" })
              ] })
            ] }),
            selectedPreset.video.hdr !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hdr-note", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sparkles", size: 14 }),
              " ",
              t("export.hdr"),
              " · mastering metadata"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "export-sequence-note", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Destinazione predefinita" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Video/MoliCut/" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "La cartella viene creata automaticamente al primo export." })
          ] })
        ] })
      ] })
    }
  );
}
export {
  ExportDialog
};
