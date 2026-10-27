"use strict";
const electron = require("electron");
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
const EVENT_NAME_LIST = [
  "queue:changed",
  "queue:progress",
  "queue:log",
  "scan:progress",
  "toast",
  "log",
  "metrics",
  "watch:log",
  "relink:request",
  "updater:status",
  "settings:changed",
  "media:proxy-ready"
];
const channels = new Set(IPC_CHANNEL_LIST);
const events = new Set(EVENT_NAME_LIST);
const bridge = {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  },
  isMock: false,
  getPathForFile(file) {
    try {
      return electron.webUtils.getPathForFile(file);
    } catch {
      return "";
    }
  },
  invoke(channel, payload) {
    if (!channels.has(channel)) {
      return Promise.resolve({
        ok: false,
        error: { code: "UNAUTHORIZED", message: `Canale IPC non autorizzato: ${channel}` }
      });
    }
    return electron.ipcRenderer.invoke(channel, payload);
  },
  on(event, listener) {
    if (!events.has(event)) throw new Error(`Evento non autorizzato: ${event}`);
    const wrapped = (_event, payload) => listener(payload);
    electron.ipcRenderer.on(event, wrapped);
    return () => electron.ipcRenderer.removeListener(event, wrapped);
  }
};
if (process.contextIsolated) {
  electron.contextBridge.exposeInMainWorld("molicut", bridge);
} else {
  throw new Error("contextIsolation must be enabled");
}
