/* eslint-env jest */

import { List, Record } from 'immutable'

import immer, { setAutoFreeze } from 'immer'
import immerES5, { setAutoFreeze as setAutoFreezeES5 } from 'immer/es5'

import { createBenchmark } from './benchmark'

import { set } from 'immutadot/core'

describe('Update todos list', () => {
  const listSize = 100000
  const modifySize = 10000

  // Prepare base state
  const baseState = []
  for (let i = 0; i < listSize; i++) {
    baseState.push({
      todo: `todo_${i}`,
      done: false,
      someThingCompletelyIrrelevant: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    })
  }

  // Prepare immutalbe state
  const todoRecord = Record({
    todo: '',
    done: false,
    someThingCompletelyIrrelevant: [],
  })
  const immutableState = List(baseState.map(todo => todoRecord(todo)))

  // Disable immer auto freeze
  setAutoFreeze(false)
  setAutoFreezeES5(false)

  const randomStart = () => Math.floor(Math.random() * 90000)

  const benchmark = createBenchmark(
    'Update todos list',
    (key, result) => {
      if (key === 'immutable') return
      let trues = 0, falses = 0
      result.forEach(todo => todo.done ? trues++ : falses++)
      expect(trues).toBe(modifySize)
      expect(falses).toBe(listSize - modifySize)
    },
  )

  it('ES2015', () => {
    benchmark('es2015', 'ES2015 destructuring', () => {
      const start = randomStart(), end = start + modifySize
      return baseState
        .slice(0, start)
        .concat(
          baseState.slice(start, end)
            .map(todo => ({
              ...todo,
              done: true,
            })),
          baseState.slice(end),
        )
    })
  })

  it('immutable w/o conversion', () => {
    benchmark('immutable', 'immutable 3.8.2 (w/o conversion to plain JS objects)', () => {
      const start = randomStart(), end = start + modifySize
      immutableState.withMutations(state => {
        for (let i = start; i < end; i++) state.setIn([i, 'done'], true)
      })
    })
  })

  it('immutable w/ conversion', () => {
    benchmark('immutable-toJS', 'immutable 3.8.2 (w/ conversion to plain JS objects)', () => {
      const start = randomStart(), end = start + modifySize
      return immutableState.withMutations(state => {
        for (let i = start; i < end; i++) state.setIn([i, 'done'], true)
      }).toJS()
    })
  })

  it('immer proxy', () => {
    benchmark('immer-proxy', 'immer 0.6.0 (proxy implementation w/o autofreeze)', () => {
      const start = randomStart(), end = start + modifySize
      return immer(baseState, draft => {
        for (let i = start; i < end; i++) draft[i].done = true
      })
    })
  })

  it('immer ES5', () => {
    benchmark('immer-es5', 'immer 0.6.0 (ES5 implementation w/o autofreeze)', () => {
      const start = randomStart(), end = start + modifySize
      return immerES5(baseState, draft => {
        for (let i = start; i < end; i++) draft[i].done = true
      })
    })
  })

  it('immutad●t', () => {
    benchmark('immutadot', 'immutad●t 1.0.0-rc.7', () => {
      const start = randomStart(), end = start + modifySize
      return set(baseState, `[${start}:${end}].done`, true)
    })
  })

  afterAll(benchmark.log)
})
