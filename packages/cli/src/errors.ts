import process from 'node:process'
import { consola } from 'consola'

export class PrettyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    }
    else {
      this.stack = new Error(message).stack
    }
  }
}

export function handleError(error: unknown): void {
  if (error instanceof PrettyError) {
    consola.error(error.message)
  }
  else {
    console.error(error)
  }

  process.exitCode = 1
}
