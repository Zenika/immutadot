/* eslint-env jest */
import { apply } from './apply'
import { immutaTest } from 'test.utils'

describe('Apply', () => {

  const _inc = (v, i = 1) => {
    let r = Number(v)
    if (Number.isNaN(r)) r = 0
    return r + i
  }

  const inc = (obj, path, ...args) => apply(obj, path, (obj, prop) => { obj[prop] = _inc(obj[prop], ...args) })

  it('should inc in all an array', () => {
    immutaTest(input => {
      const output = inc(input, 'nested.prop[:].val', 2)
      expect(output).toEqual({
        nested: {
          prop: [
            { val: 6 },
            { val: -6 },
            { val: 2 },
            { val: 2 },
          ],
        },
      })
      return output
    }, {
      nested: {
        prop: [
          { val: 4 },
          { val: -8 },
          { val: 'a' },
          {},
        ],
      },
    }, 'nested.prop')
  })
})
