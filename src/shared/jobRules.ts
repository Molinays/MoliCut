/** Queue retry policy (pure, shared with tests and UI). */

export function isTransientError(message: string): boolean {
  return /file lock|text file busy|resource busy|ebusy|eagain|temporarily|gpu.*(busy|occup)|device.*(busy|in use)|cannot open|sharing violation|lock/i.test(
    message
  )
}

export function nextAttemptDelay(attempts: number): number {
  return Math.min(300, 5 * 2 ** Math.max(0, attempts - 1))
}
