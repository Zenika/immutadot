import { parse } from './parse'
import { apply, read, write } from './path'

export const useRefs = Symbol('useRefs')

export function make(updater: (value: any, args: any[]) => any): (tmplChunks: TemplateStringsArray, ...tmplArgs: any[]) => (...args: any[]) => any {
  return (tmplChunks, ...tmplArgs) => {
    if (tmplChunks[0] === '') {
      const path = parse(tmplChunks.slice(1), tmplArgs.slice(1))

      return (...args: any[]) => {
        const accesses = read(path, tmplArgs[0])
        accesses[path.length].forEach((access) => { access.value = updater(access.value, args) })
        write(accesses)
        return accesses[0][0].value
      }
    }

    const path = parse(tmplChunks, tmplArgs)

    return (...args: any[]) => {
      const useRefsFn = (refs?: Set<any>) => {
        const fn = (root: any) => {
          const accesses = read(path, root)
          accesses[path.length].forEach((access) => { access.value = updater(access.value, args) })
          write(accesses, refs)
          return accesses[0][0].value
        }
        Object.defineProperty(fn, useRefs, { value: useRefsFn, enumerable: false })
        return fn
      }
      return useRefsFn()
    }
  }
}

export function make2(updater: (value: any, args: any[]) => any): (tmplChunks: TemplateStringsArray, ...tmplArgs: any[]) => (...args: any[]) => any {
  return (tmplChunks, ...tmplArgs) => {
    if (tmplChunks[0] === '') {
      const path = parse(tmplChunks.slice(1), tmplArgs.slice(1))
      return (...args: any[]) => apply(path, tmplArgs[0], updater, args)
    }

    const path = parse(tmplChunks, tmplArgs)

    return (...args: any[]) => (root: any) => apply(path, root, updater, args)
  }
}
