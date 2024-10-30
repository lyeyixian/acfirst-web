import fs from 'fs/promises'

// because remix loader in dev mode will reload the module on every request
// this is done to retain the cache between requests
function singleton(name, func) {
  global.__singletons ??= {}
  global.__singletons[name] ??= func()
  return global.__singletons[name]
}

export const reviewCache = singleton('reviewCache', () => new Map())

export const writeJsonToFile = async (filename, json) => {
  try {
    const jsonStr = JSON.stringify(json, null, 2)
    await fs.writeFile(filename, jsonStr, 'utf8')
    console.log(`JSON wrote to ${filename}`)
  } catch (error) {
    console.log('Error writing JSON to file:', error)
  }
}

export const readJsonFromFile = async (filename) => {
  try {
    const data = await fs.readFile(filename, 'utf8')
    const jsonObject = JSON.parse(data)
    console.log('JSON data:', jsonObject)
    return jsonObject
  } catch (err) {
    console.log('Error reading JSON from file:', err)
    return null
  }
}
