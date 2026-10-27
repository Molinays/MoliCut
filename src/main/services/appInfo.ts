/** Mutable runtime fact: which acceleration backend the scan selected. */
class BackendInfo {
  private current = 'software'
  private selectedBy: 'auto' | 'manual' = 'auto'

  set(backend: string, selectedBy: 'auto' | 'manual' = 'auto'): void {
    this.current = backend
    this.selectedBy = selectedBy
  }

  get(): { backend: string; selectedBy: 'auto' | 'manual' } {
    return { backend: this.current, selectedBy: this.selectedBy }
  }

  reset(): void {
    this.current = 'software'
    this.selectedBy = 'auto'
  }
}

export const backendInfo = new BackendInfo()

/** Runtime fact set once at boot when the previous session did not shut down cleanly. */
class RecoveryState {
  private recovered = false

  set(recovered: boolean): void {
    this.recovered = recovered
  }

  get(): boolean {
    return this.recovered
  }
}

export const recoveryState = new RecoveryState()
