import {
  index,
  prop,
} from 'path/consts'
import { isNil } from 'util/lang'
import { unsafeToPath } from 'path/toPath'

/**
* Gets the value at <code>path</code> of <code>obj</code>.
* @memberof core
* @param {*} obj The object.
* @param {string|Array} path The path of the property to get.
* @param {*} defaultValue The default value.
* @return {*} Returns the value or <code>defaultValue</code>.
* @example get({ nested: { prop: 'val' } }, 'nested.prop') // => 'val'
* @example get({ nested: { prop: 'val' } }, 'nested.unknown', 'default') // => 'default'
* @since 1.0.0
 */
export function get(obj, path, defaultValue) {
  function walkPath(curObj, remPath) {
    if (remPath.length === 0) return curObj === undefined ? defaultValue : curObj
    if (isNil(curObj)) return defaultValue
    const [[undefined, prop], ...pathRest] = remPath
    return walkPath(curObj[prop], pathRest)
  }
  const parsedPath = unsafeToPath(path)
  if (parsedPath.some(([propType]) => propType !== prop && propType !== index))
    throw TypeError('get supports only properties and array indexes in path')
  return walkPath(obj, parsedPath)
}
