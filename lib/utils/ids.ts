export function generateId(prefix: string = 'ord') {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${(crypto as any).randomUUID()}`
  }
  // Fallback
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}


