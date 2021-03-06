import { omitBy as _omitBy } from 'lodash'
import { apply } from 'immutadot/core'

/**
 * Replaces by an object omitting properties that <code>predicate</code> doesn't return truthy for.
 * @function
 * @memberof object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {function} [predicate={@link https://lodash.com/docs#identity|lodash.identity}] The function invoked per property.
 * @return {Object} Returns the updated object.
 * @example omitBy({ nested: { a: 1, b: 2, c: 3 } }, 'nested', v => v === 2) // => { nested: { a:1, c: 3 } }
 * @see {@link https://lodash.com/docs#omitBy|lodash.omitBy} for more information.
 * @since 1.0.0
 */
const omitBy = apply(_omitBy, { arity: 1 })

export { omitBy }
