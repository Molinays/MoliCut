/**
 * Channel whitelists shared by preload and main.
 * This file intentionally has ZERO imports: sandboxed preloads can only require
 * electron/timers/url, so pulling Zod (or the IPC contract) into preload would
 * break `sandbox: true`. A unit test asserts this list matches ipcRoutes.
 */

export const IPC_CHANNEL_LIST = [
  'app:info',
  'settings:get',
  'settings:set',
  'settings:reset',
  'project:new',
  'project:open',
  'project:openDialog',
  'project:save',
  'project:autosave',
  'project:recoverAutosave',
  'project:recent',
  'project:exportInterchange',
  'media:importDialog',
  'media:importPaths',
  'media:probe',
  'media:thumbnail',
  'media:waveform',
  'media:relink',
  'media:chooseRelink',
  'media:missing',
  'queue:list',
  'queue:add',
  'queue:action',
  'queue:reorder',
  'queue:setPriority',
  'queue:setConcurrency',
  'queue:openWindow',
  'queue:exportReport',
  'presets:list',
  'presets:save',
  'presets:delete',
  'presets:export',
  'presets:import',
  'presets:suggest',
  'watch:list',
  'watch:add',
  'watch:update',
  'watch:remove',
  'watch:logs',
  'watch:test',
  'system:profile',
  'system:scan',
  'system:benchmark',
  'system:testEncoder',
  'deps:status',
  'deps:download',
  'debug:logs',
  'debug:clientError',
  'debug:ipcStats',
  'debug:metrics',
  'debug:action',
  'debug:bundle',
  'window:control',
  'shell:reveal',
  'updater:check',
  'updater:install',
  'plugins:list',
  'plugins:install',
  'plugins:toggle'
] as const

export type IpcChannelName = (typeof IPC_CHANNEL_LIST)[number]

export const EVENT_NAME_LIST = [
  'queue:changed',
  'queue:progress',
  'queue:log',
  'scan:progress',
  'toast',
  'log',
  'metrics',
  'watch:log',
  'relink:request',
  'updater:status',
  'settings:changed',
  'media:proxy-ready'
] as const

export type EventName = (typeof EVENT_NAME_LIST)[number]
