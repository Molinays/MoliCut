import { u as useTranslation, a as useUiStore, c as useQueueStore, r as reactExports, d as call, o as on, j as jsxRuntimeExports, I as Icon, g as formatNumber, e as formatBytes, f as formatClock, h as roundTo } from "./index-cNB6aAEX.js";
import { M as Modal } from "./Modal-Cdrp0PR3.js";
const TABS = [
  { id: "system", label: "debug.system", icon: "chip" },
  { id: "gpu", label: "debug.gpu", icon: "gauge" },
  { id: "deps", label: "debug.deps", icon: "download" },
  { id: "logs", label: "debug.logs", icon: "file" },
  { id: "actions", label: "debug.actions", icon: "settings" }
];
function DebugPanel() {
  const { t } = useTranslation();
  const close = useUiStore((s) => s.closeModal);
  const tab = useUiStore((s) => s.debugTab);
  const setTab = useUiStore((s) => s.setDebugTab);
  const toast = useUiStore((s) => s.toast);
  const jobs = useQueueStore((s) => s.jobs);
  const queueStats = useQueueStore((s) => s.stats);
  const refreshQueue = useQueueStore((s) => s.refresh);
  const [profile, setProfile] = reactExports.useState(null);
  const [deps, setDeps] = reactExports.useState([]);
  const [logs, setLogs] = reactExports.useState([]);
  const [ipc, setIpc] = reactExports.useState(null);
  const [metrics, setMetrics] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [scan, setScan] = reactExports.useState(null);
  const [benchmark, setBenchmark] = reactExports.useState(null);
  const [tests, setTests] = reactExports.useState({});
  const [gpuBench, setGpuBench] = reactExports.useState(null);
  const [gpuBenchRunning, setGpuBenchRunning] = reactExports.useState(false);
  const [logLevel, setLogLevel] = reactExports.useState("all");
  const [logSearch, setLogSearch] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(null);
  const gpuCanvas = reactExports.useRef(null);
  const load = reactExports.useCallback(async () => {
    const [p, d, l, i] = await Promise.allSettled([
      call("system:profile", {}),
      call("deps:status", {}),
      call("debug:logs", { limit: 800 }),
      call("debug:ipcStats", {})
    ]);
    if (p.status === "fulfilled") setProfile(p.value.profile);
    if (d.status === "fulfilled") setDeps(d.value.dependencies);
    if (l.status === "fulfilled") setLogs(l.value.logs);
    if (i.status === "fulfilled") setIpc(i.value);
    void refreshQueue();
  }, [refreshQueue]);
  reactExports.useEffect(() => {
    void load();
    const off = on("scan:progress", ({ percent, message }) => setScan({ percent, message }));
    const interval = setInterval(() => {
      void call("debug:metrics", {}).then((m) => {
        setMetrics(m);
        setHistory((prev) => [...prev.slice(-59), m]);
      }).catch(() => void 0);
      void call("debug:logs", { limit: 800 }).then((r) => setLogs(r.logs)).catch(() => void 0);
      void call("debug:ipcStats", {}).then(setIpc).catch(() => void 0);
    }, 2500);
    return () => {
      off();
      clearInterval(interval);
    };
  }, [load]);
  const scanHardware = async () => {
    setBusy("scan");
    setScan({ percent: 0, message: "Avvio scansione…" });
    try {
      const { profile: next } = await call("system:scan", { force: true });
      setProfile(next);
      toast("success", `Scan completato · backend ${next.acceleration.preferredBackend.toUpperCase()}`);
    } catch (err) {
      toast("error", err.message);
    } finally {
      setBusy(null);
      setScan(null);
    }
  };
  const runBenchmark = async () => {
    setBusy("benchmark");
    try {
      setBenchmark(await call("system:benchmark", {}));
      toast("success", "Benchmark completato");
    } catch (err) {
      toast("error", err.message);
    } finally {
      setBusy(null);
    }
  };
  const testEncoder = async (encoderId, codec) => {
    setTests((prev) => ({ ...prev, [encoderId]: "running" }));
    try {
      const result = await call("system:testEncoder", { encoderId, codec });
      setTests((prev) => ({ ...prev, [encoderId]: result }));
    } catch (err) {
      setTests((prev) => ({
        ...prev,
        [encoderId]: { encoderId, ok: false, encodeFps: null, detail: err.message, durationMs: 0 }
      }));
    }
  };
  const runGpuBenchmark = async () => {
    setGpuBenchRunning(true);
    await new Promise((r) => setTimeout(r, 40));
    try {
      const canvas = gpuCanvas.current ?? document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const gl = canvas.getContext("webgl2", { antialias: false });
      if (!gl) {
        setGpuBench(0);
        return;
      }
      const frame = () => {
        gl.clearColor(Math.random() * 0.2, 0.1, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.finish();
      };
      frame();
      const start = performance.now();
      let frames = 0;
      while (performance.now() - start < 1200) {
        frame();
        frames++;
      }
      setGpuBench(roundTo(frames * 1e3 / (performance.now() - start), 1));
    } finally {
      setGpuBenchRunning(false);
    }
  };
  const action = async (name) => {
    setBusy(name);
    try {
      const result = await call("debug:action", { action: name });
      toast("success", result.detail);
      if (name === "redetect-hardware" || name === "restart-engine") await load();
    } catch (err) {
      toast("error", err.message);
    } finally {
      setBusy(null);
    }
  };
  const diagnosticBundle = async () => {
    setBusy("bundle");
    try {
      const { path } = await call("debug:bundle", {});
      toast("success", `Report diagnostico: ${path}`);
    } catch (err) {
      toast("error", err.message);
    } finally {
      setBusy(null);
    }
  };
  const filteredLogs = reactExports.useMemo(
    () => logs.filter((entry) => {
      if (logLevel !== "all" && entry.level !== logLevel) return false;
      if (!logSearch.trim()) return true;
      return `${entry.scope} ${entry.message}`.toLowerCase().includes(logSearch.toLowerCase());
    }),
    [logLevel, logSearch, logs]
  );
  const activeJob = jobs.find((j) => j.state === "running");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: t("debug.title"), subtitle: "Diagnostica locale · nessun invio remoto", onClose: close, width: 1080, className: "debug-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-tabs", role: "tablist", children: [
      TABS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { role: "tab", "aria-selected": tab === item.id, className: `debug-tab ${tab === item.id ? "active" : ""}`, onClick: () => setTab(item.id), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: item.icon, size: 14 }),
        " ",
        t(item.label)
      ] }, item.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-tabs-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `live-dot ${busy ? "busy" : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: busy ? "Operazione in corso…" : "Live" })
      ] })
    ] }),
    scan && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scan-progress", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scan-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${scan.percent}%` } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: scan.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
        scan.percent,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-body", children: [
      tab === "system" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-actions-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-accent", onClick: () => void scanHardware(), disabled: busy === "scan", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
            " ",
            t("debug.scan")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void runBenchmark(), disabled: busy === "benchmark", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 13 }),
            " ",
            t("debug.benchmark")
          ] }),
          profile && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
            "hash ",
            profile.hardwareHash.slice(0, 12),
            "… · ",
            new Date(profile.scannedAt).toLocaleString()
          ] })
        ] }),
        profile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chip", size: 14 }),
              " CPU"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Modello" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.cpu.manufacturer,
                " ",
                profile.cpu.brand
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Core / Thread" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.cpu.physicalCores,
                " / ",
                profile.cpu.cores
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Frequenza" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.cpu.speedGHz,
                " GHz"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Istruzioni" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.cpu.flags.join(" · ") || "n/d" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 14 }),
              " Memoria"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Totale" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.memoryTotalGB,
                " GB"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Libera" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.memoryFreeGB,
                " GB"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mini-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${Math.round((1 - profile.memoryFreeGB / Math.max(1, profile.memoryTotalGB)) * 100)}%` } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chip", size: 14 }),
              " Accelerazione"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "backend-pill", children: profile.acceleration.preferredBackend.toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Hardware" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.acceleration.hardwareAvailable ? "disponibile" : "assente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WebGL2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.acceleration.webgl2 ? "sì" : "no" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WebGPU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.acceleration.webgpu ? "sì" : "no" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 14 }),
              " GPU"
            ] }),
            profile.gpus.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted", children: "Nessuna GPU rilevata." }),
            profile.gpus.map((gpu) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "gpu-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: gpu.model }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  gpu.vendor,
                  " · ",
                  gpu.vramMB,
                  " MB VRAM · driver ",
                  gpu.driverVersion
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "api-chips", children: gpu.api.map((api) => /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: api }, api)) })
            ] }, gpu.model))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 14 }),
              " OS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Sistema" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                profile.os.distro,
                " ",
                profile.os.release
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Kernel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.os.kernel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Build" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile.os.build })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 14 }),
              " Dischi"
            ] }),
            profile.disks.map((disk) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "disk-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: disk.mount }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  disk.fs,
                  " · ",
                  disk.kind.toUpperCase()
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "disk-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${Math.round((disk.sizeGB - disk.freeGB) / Math.max(1, disk.sizeGB) * 100)}%` } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                disk.freeGB,
                " GB liberi"
              ] })
            ] }, disk.mount))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 14 }),
              " Bottleneck analysis"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "analysis-list", children: [
              profile.acceleration.notes.map((note, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: note }, i)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: profile.cpu.cores >= 16 ? "CPU ad alto parallelismo: worker pool preview dimensionato su 16+ thread." : "CPU modesta: la preview riduce automaticamente la risoluzione." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: profile.gpus[0] ? `GPU ${profile.gpus[0].model}: decode/encode hardware prioritari.` : "Nessuna GPU: decode software e preview a risoluzione ridotta." })
            ] })
          ] }),
          benchmark && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 14 }),
              " Benchmark"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bench-grid", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "CPU score" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatNumber(benchmark.cpuScore) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GPU score" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: benchmark.gpuScore ?? "—" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Disk read" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  benchmark.diskReadMBs,
                  " MB/s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Disk write" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  benchmark.diskWriteMBs,
                  " MB/s"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Render 1080p" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  benchmark.renderFps ?? "—",
                  " fps"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Durata" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                  benchmark.durationMs,
                  " ms"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "analysis-list", children: benchmark.details.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: d }, i)) })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "debug-loading", children: "Scansione hardware in corso…" })
      ] }),
      tab === "gpu" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `gpu-banner ${profile?.acceleration.hardwareAvailable ? "ok" : "warn"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: profile?.acceleration.hardwareAvailable ? "chip" : "warning", size: 22 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile?.acceleration.preferredBackend.toUpperCase() ?? "SCAN" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: profile?.acceleration.hardwareAvailable ? "GPU-first attivo: decode/encode/preview usano l’accelerazione hardware. Il fallback software è esplicito e loggato." : "Nessun encoder hardware: fallback software esplicito (mai silenzioso)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void scanHardware(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
            " Re-detection"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chip", size: 14 }),
            " Encoder hardware"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "encoder-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "encoder-head", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Backend" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Codec" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Test 1s" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Esito" })
            ] }),
            (profile?.encoders ?? []).map((encoder) => {
              const test = tests[encoder.id];
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `encoder-row ${encoder.available ? "" : "unavailable"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: encoder.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: encoder.id })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: encoder.codecs.join(", ") || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "btn btn-xs",
                    disabled: !encoder.available || test === "running" || encoder.id === "software",
                    onClick: () => void testEncoder(encoder.id === "software" ? "libx264" : encoder.id === "nvenc" ? "h264_nvenc" : encoder.id === "amf" ? "h264_amf" : encoder.id === "qsv" ? "h264_qsv" : encoder.id === "videotoolbox" ? "h264_videotoolbox" : "h264_vaapi", "h264"),
                    children: test === "running" ? "Test…" : t("debug.testEncoders")
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: test && test !== "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: test.ok ? "ok-text" : "err-text", children: test.ok ? `${test.encodeFps ?? "?"} fps` : test.detail.slice(0, 60) }) : encoder.testedOk === null ? /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: "muted", children: "non testato" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: encoder.testedOk ? "ok-text" : "err-text", children: encoder.testedOk ? "ok" : "fallito" }) })
              ] }, encoder.id);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 14 }),
            " WebGL2 / WebGPU"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WebGL2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile?.acceleration.webgl2 ? "supportato" : "non disponibile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "WebGPU" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: profile?.acceleration.webgpu ? "supportato" : "non disponibile" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Benchmark locale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: gpuBench === null ? "—" : `${gpuBench} fps` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void runGpuBenchmark(), disabled: gpuBenchRunning, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play", size: 12 }),
            " ",
            gpuBenchRunning ? "Esecuzione…" : "Benchmark WebGL2"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: gpuCanvas, className: "hidden-canvas", width: 8, height: 8 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 14 }),
            " Hot-unplug / driver crash"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Se la GPU sparisce a runtime il motore annulla il job hardware, logga l’evento, notifica l’utente e ritenta in software. Il backend attivo è sempre visibile nella status bar e in questa scheda." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Fallback" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "esplicito + notifica" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Retry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "automatico" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "film", size: 14 }),
            " hwaccels FFmpeg"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "api-chips", children: profile?.hwaccels.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: h }, h)) ?? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "—" }) })
        ] })
      ] }),
      tab === "deps" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-actions-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-accent", onClick: () => void call("deps:download", { component: "all" }).then(() => load()).catch((e) => toast("error", e.message)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 13 }),
            " Scarica dipendenze mancanti"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", onClick: () => void load(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
            " Verifica"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "Download firmato · verifica SHA-256 · estrazione atomica" })
        ] }),
        deps.map((dep) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `card dep-card ${dep.status}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dep-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: dep.status === "ok" ? "check" : dep.status === "missing" ? "warning" : "warning", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: dep.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `status-chip ${dep.status}`, children: dep.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Versione" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: dep.version ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Path" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "truncate", title: dep.path ?? "", children: dep.path ?? "non trovato" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SHA-256 atteso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "mono", children: [
              dep.expectedSha256?.slice(0, 16) ?? "—",
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SHA-256 reale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "mono", children: [
              dep.actualSha256?.slice(0, 16) ?? "—",
              "…"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "dep-detail", children: dep.detail })
        ] }, dep.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 14 }),
            " Rollback atomico"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Le dipendenze vengono estratte in una directory temporanea, verificate e spostate con rename atomico. Un aggiornamento fallito non sostituisce il binario funzionante (ROADMAP DEP-2)." })
        ] })
      ] }),
      tab === "logs" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "logs-layout", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "logs-main", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "logs-toolbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select select-sm", value: logLevel, onChange: (e) => setLogLevel(e.target.value), "aria-label": "Livello log", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "Tutti i livelli" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "debug", children: "Debug" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "info", children: "Info" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "warn", children: "Warn" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "error", children: "Error" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-field compact", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "search", size: 12 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: logSearch, onChange: (e) => setLogSearch(e.target.value), placeholder: "Filtra log…", "aria-label": "Filtra log" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-xs", onClick: () => void diagnosticBundle(), disabled: busy === "bundle", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 12 }),
              " Bundle ZIP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-list", role: "log", children: [
            filteredLogs.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `log-row ${entry.level}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-time", children: new Date(entry.at).toLocaleTimeString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-level", children: entry.level }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-scope", children: entry.scope }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-msg", children: entry.message })
            ] }, entry.id)),
            filteredLogs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted padded", children: "Nessun log con questi filtri." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "logs-side", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "gauge", size: 14 }),
              " Risorse live"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { values: history.map((h) => h.cpuPercent), color: "#7c5cff", label: "CPU", suffix: "%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkline, { values: history.map((h) => h.memoryUsedMB), color: "#38bdd8", label: "RAM", suffix: " MB" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "GPU" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: metrics?.gpuPercent === null ? "n/d" : `${metrics?.gpuPercent?.toFixed(0)}%` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Cache render" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: formatBytes((metrics?.renderCacheMB ?? 0) * 1024 ** 2) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                metrics?.previewFps.toFixed(0),
                " fps"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "queue", size: 14 }),
              " Render queue"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "kv", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Attivi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: queueStats.running }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "In coda" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: queueStats.queued }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Errori" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: queueStats.error }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "FPS aggregati" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: queueStats.aggregateFps })
            ] }),
            activeJob && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "active-job-mini", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: activeJob.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "progress", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: `${activeJob.progress}%` } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                activeJob.fps,
                " fps · ETA ",
                formatClock(activeJob.etaSec)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 14 }),
              " IPC Inspector"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ipc-table", children: (ipc?.channels ?? []).slice(0, 8).map((channel) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ipc-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: channel.channel, children: channel.channel }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: channel.calls }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("em", { className: channel.errors > 0 ? "err-text" : "", children: channel.errors }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("em", { children: [
                channel.avgMs,
                "ms"
              ] })
            ] }, channel.channel)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "muted small", children: [
              ipc?.totalCalls ?? 0,
              " chiamate · ",
              ipc?.totalErrors ?? 0,
              " errori"
            ] })
          ] })
        ] })
      ] }),
      tab === "actions" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 14 }),
            " Manutenzione"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "action-grid", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "refresh", label: "Reset cache", detail: "Thumbnail, waveform e frame cache", onClick: () => void action("reset-cache"), busy: busy === "reset-cache" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "film", label: "Rigenera proxy", detail: "Elimina i proxy esistenti", onClick: () => void action("regenerate-proxies"), busy: busy === "regenerate-proxies" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "sparkles", label: "Flush shader cache", detail: "Reset contesto WebGL/WebGPU", onClick: () => void action("flush-shaders"), busy: busy === "flush-shaders" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "chip", label: "Riavvia motore media", detail: "Ri-risolve FFmpeg e hardware", onClick: () => void action("restart-engine"), busy: busy === "restart-engine" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "gauge", label: "Re-detect encoder", detail: "Forza la scansione hardware", onClick: () => void action("redetect-hardware"), busy: busy === "redetect-hardware" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "queue", label: "Ripara DB coda", detail: "Backup automatico + requeue", onClick: () => void action("repair-queue-db"), busy: busy === "repair-queue-db" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "trash", label: "Pulisci log", detail: "Svuota buffer e file", onClick: () => void action("clear-logs"), busy: busy === "clear-logs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionButton, { icon: "download", label: "Report diagnostico", detail: "ZIP redatto da PII", onClick: () => void diagnosticBundle(), busy: busy === "bundle" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 14 }),
            " Safe mode"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Disabilita plugin, accelerazione GPU e automazioni di avvio per il troubleshooting." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void action(useUiStore.getState().settings.safeMode ? "safe-mode-off" : "safe-mode-on"), disabled: busy === "safe-mode-on" || busy === "safe-mode-off", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 13 }),
            " ",
            useUiStore.getState().settings.safeMode ? "Disattiva safe mode" : "Attiva safe mode"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file", size: 14 }),
            " Configurazione"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Backup e ripristino impostazioni sono persistiti in SQLite (kv settings)." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm full", onClick: () => void call("updater:check", {}).then((r) => toast("info", r.message ?? r.status)).catch((e) => toast("error", e.message)), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 13 }),
            " Verifica aggiornamenti"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card span2 danger-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 14 }),
            " Attenzione"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "muted small", children: "Queste azioni modificano cache, proxy o database. Un backup viene creato prima delle operazioni distruttive sulla coda. Il safe mode richiede un riavvio per disabilitare completamente i plugin." })
        ] })
      ] })
    ] })
  ] });
}
function Sparkline({ values, color, label, suffix }) {
  const max = Math.max(1, ...values);
  const width = 220;
  const height = 42;
  const points = values.map((v, i) => `${i / Math.max(1, values.length - 1) * width},${height - v / max * (height - 4) - 2}`).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spark-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
        values[values.length - 1]?.toFixed(1) ?? "—",
        suffix
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100%", viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points, fill: "none", stroke: color, strokeWidth: "1.6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: `0,${height} ${points} ${width},${height}`, fill: color, opacity: "0.08", stroke: "none" })
    ] })
  ] });
}
function ActionButton({ icon, label, detail, onClick, busy }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "action-button", onClick, disabled: busy, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "action-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: icon, size: 16 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "action-text", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: detail })
    ] }),
    busy && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "spinner" })
  ] });
}
export {
  DebugPanel
};
