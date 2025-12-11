// Mock dependencies before importing the module
import { vi } from 'vitest'

import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs/promises'
import { writeJsonToFile, readJsonFromFile, reviewCache } from '../../utils/cache.server'

vi.mock('fs/promises')

const mockFs = vi.mocked(fs)

describe('utils/cache.server', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFs.writeFile.mockReset()
    mockFs.readFile.mockReset()
    // Clear global singleton cache
    global.__singletons = {}
  })

  describe('writeJsonToFile', () => {
    it('writes JSON to file successfully', async () => {
      const testData = { key: 'value', number: 42 }
      const filename = '/test/file.json'

      await writeJsonToFile(filename, testData)

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        filename,
        JSON.stringify(testData, null, 2),
        'utf8'
      )
    })

    it('handles write errors gracefully', async () => {
      const testData = { key: 'value' }
      const filename = '/test/file.json'

      mockFs.writeFile.mockRejectedValue(new Error('Write failed'))

      // Should not throw, just log error
      await expect(writeJsonToFile(filename, testData)).resolves.toBeUndefined()
    })
  })

  describe('readJsonFromFile', () => {
    it('reads and parses JSON from file successfully', async () => {
      const testData = { key: 'value', number: 42 }
      const jsonString = JSON.stringify(testData)
      const filename = '/test/file.json'

      mockFs.readFile.mockResolvedValue(jsonString)

      const result = await readJsonFromFile(filename)

      expect(mockFs.readFile).toHaveBeenCalledWith(filename, 'utf8')
      expect(result).toEqual(testData)
    })

    it('returns null when file read fails', async () => {
      const filename = '/test/file.json'

      mockFs.readFile.mockRejectedValue(new Error('File not found'))

      const result = await readJsonFromFile(filename)

      expect(result).toBeNull()
    })

    it('returns null when JSON parsing fails', async () => {
      const invalidJson = '{ invalid json }'
      const filename = '/test/file.json'

      mockFs.readFile.mockResolvedValue(invalidJson)

      const result = await readJsonFromFile(filename)

      expect(result).toBeNull()
    })
  })

  describe('reviewCache singleton', () => {
    it('returns the same Map instance', () => {
      const cache1 = reviewCache
      const cache2 = reviewCache

      expect(cache1).toBe(cache2)
      expect(cache1).toBeInstanceOf(Map)
    })

    it('persists data across calls', () => {
      const cache = reviewCache
      cache.set('test', 'value')

      const sameCache = reviewCache
      expect(sameCache.get('test')).toBe('value')
    })
  })
})