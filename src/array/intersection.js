import _intersection from 'lodash/intersection'
import { convert } from '../util/convert'

/**
 * Replaces by an array of unique values that are included in th former array and all given arrays.
 * @function
 * @memberof array
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {...Array} [arrays] The arrays to inspect.
 * @return {Object} Returns the updated object.
 * @example intersection({ nested: { prop: [1, 2] } }, 'nested.prop', [2, 3]) // => { nested: { prop: [2] } }
 * @see {@link https://lodash.com/docs#intersection|lodash.intersection} for more information.
 * @since 0.3.0
 */
const intersection = convert(_intersection)
export { intersection, intersection as default }