export type Path = Navigator[]

export type Navigator = PropNavigator | IndexNavigator | SliceNavigator

export type PropNavigator = [NavigatorType.Prop, string | symbol]
export type IndexNavigator = [NavigatorType.Index, number]
export type SliceNavigator = [NavigatorType.Slice, number, number]

export const enum NavigatorType {
  Root,
  Prop,
  Index,
  Slice,
}

export type Access = RootAccess | PropAccess | IndexAccess

export type RootAccess = { type: NavigatorType.Root, parent: undefined, key: undefined, value: any }
export type PropAccess = { type: NavigatorType.Prop, parent: Access, key: string | symbol, value: any }
export type IndexAccess = { type: NavigatorType.Index, parent: Access, key: number, value: any }

export function read(path: Navigator[], root: any): Access[][] {
  const accesses: Access[][] = Array(path.length + 1)

  accesses[0] = [{ type: NavigatorType.Root, parent: undefined, key: undefined, value: root }]

  for (let i = 0; i < path.length; i++) {
    const step = path[i]

    switch (step[0]) {
      case NavigatorType.Prop:
        accesses[i + 1] = accesses[i].map((parent) => ({
          type: NavigatorType.Prop,
          parent,
          key: step[1],
          value: parent.value?.[step[1]],
        }))
        break
      case NavigatorType.Index:
        accesses[i + 1] = accesses[i].map((parent) => ({
          type: NavigatorType.Index,
          parent,
          key: step[1],
          value: parent.value?.[step[1]],
        }))
        break
      case NavigatorType.Slice:
        accesses[i + 1] = accesses[i].flatMap((parent) => {
          const [start, end] = resolveSlice(parent.value, step[1], step[2])
          return slice(parent.value, start, end).map<IndexAccess>((value, index) => ({
            type: NavigatorType.Index,
            parent,
            key: start + index,
            value,
          }))
        })
        break
      default: throw TypeError('not implemented')
    }
  }

  return accesses
}

function slice(value: any, start: number, end: number): any[] {
  return value.slice(start, end)
}

function resolveSlice(value: any, start: number, end: number): [number, number] {
  return [resolveSliceStart(value, start), resolveSliceEnd(value, end)]
}

function resolveSliceStart(value: any, start: number) {
  if (start === undefined || start === null) return 0
  if (start >= 0) return start
  if (!value || !('length' in value)) return 0
  return value.length + start // FIXME check is positive integer
}

function resolveSliceEnd(value: any, end: number) {
  if (end === undefined || end === null) return value.length ?? 0
  if (end >= 0) return end
  if (!value || !('length' in value)) return 0
  return value.length + end // FIXME check is positive integer
}

export function write(accesses: Access[][], refs = new Set()) {
  for (let i = accesses.length - 1; i > 0; i--) {
    for (const { type, parent, key, value } of accesses[i]) {
      if (!refs.has(parent.value)) refs.add(parent.value = copy(parent.value, type))
      parent.value[key] = value
    }
  }
}

function copy(value: any, accessType: NavigatorType) {
  if (value === undefined || value === null) {
    switch (accessType) {
      case NavigatorType.Prop: return {}
      case NavigatorType.Index: return []
      default: throw TypeError('not implemented')
    }
  }

  if (typeof value !== 'object') throw TypeError('not implemented')

  return Array.isArray(value) ? [...value] : { ...value }
}
