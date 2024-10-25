import { singleton } from './singleton.server'

export const reviewCache = singleton('reviewCache', () => new Map())
