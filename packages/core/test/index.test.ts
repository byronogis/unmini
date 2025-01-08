import { describe, expect, it } from 'vitest'
import { sum } from '../src'

describe('sum', () => {
  it('should add two positive numbers correctly', () => {
    expect(sum(1, 2)).toBe(3)
    expect(sum(10, 20)).toBe(30)
  })

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5)
    expect(sum(5, 0)).toBe(5)
    expect(sum(0, 0)).toBe(0)
  })

  it('should add negative numbers correctly', () => {
    expect(sum(-1, -2)).toBe(-3)
    expect(sum(-1, 1)).toBe(0)
  })

  it('should handle decimal numbers correctly', () => {
    expect(sum(0.1, 0.2)).toBe(0.3)
    expect(sum(0.1, 0.7)).toBe(0.8)
    expect(sum(1.5, 2.7)).toBe(4.2)
  })
})

describe('example validation', () => {
  it('should match basic usage examples', () => {
    expect(sum(2, 3)).toBe(5)
  })

  it('should match large number examples', () => {
    expect(sum(1000, 2000)).toBe(3000)
  })

  it('should match decimal examples', () => {
    expect(sum(0.1, 0.2)).toBe(0.3)
    expect(sum(1.5, 2.7)).toBe(4.2)
  })

  it('should match negative number examples', () => {
    expect(sum(-5, 3)).toBe(-2)
    expect(sum(-2, -3)).toBe(-5)
  })
})
