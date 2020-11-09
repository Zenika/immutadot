import Parser from './parser'
import { NavigatorType } from './path'

export default function set(chunks: TemplateStringsArray, root: any): (v: any) => any {
  if (chunks.length > 2 || chunks[0] !== '') throw TypeError('not implemented')

  const path = [...new Parser(chunks[1])]

  const steps = Array(path.length + 1)
  steps[0] = root

  for (let i = 0; i < path.length; i++) {
    switch (path[i][0]) {
      case NavigatorType.Prop:
      case NavigatorType.Index:
        steps[i + 1] = steps[i]?.[path[i][1]]
        break
      default: throw TypeError('not implemented')
    }
  }

  return (v) => {
    steps[path.length] = v

    for (let i = path.length - 1; i >= 0; i--) {
      if (steps[i] === undefined || steps[i] === null || typeof steps[i] !== 'object') throw TypeError('not implemented')

      steps[i] = Array.isArray(steps[i]) ? [...steps[i]] : { ...steps[i] }

      steps[i][path[i][1]] = steps[i + 1]
    }

    return steps[0]
  }
}
