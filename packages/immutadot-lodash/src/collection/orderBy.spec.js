/* eslint-env jest */
import { immutaTest } from 'test.utils'
import { orderBy } from 'collection'
describe('OrderBy', () => {
  it('should sort array by name asc and age desc', () => {
    immutaTest({
      nested: {
        prop: [{
          name: 'Yvo',
          age: 2,
        },
        {
          name: 'Nico',
          age: 666,
        },
        {
          name: 'Nico',
          age: 30,
        },
        ],
      },
      other: {},
    }, ['nested.prop'], (input, path) => {
      const output = orderBy(input, path, [
        'name',
        'age',
      ], [
        'asc',
        'desc',
      ])
      expect(output).toEqual({
        nested: {
          prop: [{
            name: 'Nico',
            age: 666,
          },
          {
            name: 'Nico',
            age: 30,
          },
          {
            name: 'Yvo',
            age: 2,
          },
          ],
        },
        other: {},
      })
      return output
    })
  })
})
