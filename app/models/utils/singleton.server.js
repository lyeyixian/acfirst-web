export function singleton(name, func) {
  global.__singletons ??= {}
  global.__singletons[name] ??= func()
  return global.__singletons[name]
}
