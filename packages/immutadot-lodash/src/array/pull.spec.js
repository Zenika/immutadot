/* eslint-env jest */
import { immutaTest } from 'test.utils'
import { pull } from 'array'
describe('Pull', () => {
  it('should remove matching elements', () => {
    immutaTest({
      nested: {
        prop: [
          1,
          2,
          3,
          1,
          2,
          3,
        ],
      },
      other: {},
    }, ['nested.prop'], (input, path) => {
      const output = pull(input, path, 2)
      expect(output).toEqual({
        nested: {
          prop: [
            1,
            3,
            1,
            3,
          ],
        },
        other: {},
      })
      return output
    })
  })
  it('should remove several matching elements', () => {
    immutaTest({
      nested: {
        prop: [
          1,
          2,
          3,
          1,
          2,
          3,
        ],
      },
      other: {},
    }, ['nested.prop'], (input, path) => {
      const output = pull(input, path, 1, 3)
      expect(output).toEqual({
        nested: {
          prop: [
            2,
            2,
          ],
        },
        other: {},
      })
      return output
    })
  })
})
