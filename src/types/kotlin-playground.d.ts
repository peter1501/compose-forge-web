declare global {
  interface KotlinPlaygroundInstance {
    state: any
    nodes: any
    codemirror: {
      getValue: () => string
      setValue: (value: string) => void
      on: (event: string, handler: () => void) => void
    }
    execute: () => void
    getCode: () => string
  }

  interface Window {
    KotlinPlayground: {
      (selector: string | HTMLElement): void
      getInstance: (element: HTMLElement) => KotlinPlaygroundInstance | null
    }
  }
}

export {}