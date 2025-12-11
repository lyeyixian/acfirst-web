import { describe, it, expect } from 'vitest'
import { formatSize } from '../formatter'

describe('formatSize', () => {
  it('formats size string correctly', () => {
    expect(formatSize('cm-60x60')).toBe('60 x 60 (cm)')
  })

  it('handles different units', () => {
    expect(formatSize('mm-120x80')).toBe('120 x 80 (mm)')
  })

  it('handles different dimensions', () => {
    expect(formatSize('in-24x12')).toBe('24 x 12 (in)')
  })
})