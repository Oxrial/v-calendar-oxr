// Type utils
import { isDate, has, some } from 'lodash-es'

// Type checkers
const getType = value => Object.prototype.toString.call(value).slice(8, -1)
export const _isDate = value => isDate(value) && !isNaN(value.getTime())
export const _isObject = value => getType(value) === 'Object'
// Object utils
export const _hasAny = (obj, props) => some(props, p => has(obj, p))
// Collection utils
