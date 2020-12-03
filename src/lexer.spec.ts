import Lexer from './lexer'
import { TokenType } from './token'

describe('Lexer', () => {
  it('should tokenize special characters', () => {
    expect([...new Lexer('.?.[:]-')]).toEqual([
      [TokenType.Dot, undefined, 0],
      [TokenType.OptDot, undefined, 1],
      [TokenType.LBracket, undefined, 3],
      [TokenType.Colon, undefined, 4],
      [TokenType.RBracket, undefined, 5],
      [TokenType.Minus, undefined, 6],
    ])
  })

  it('should tokenize identifiers', () => {
    expect([...new Lexer('foo _bar')]).toEqual([
      [TokenType.Identifier, 'foo', 0],
      [TokenType.Identifier, '_bar', 4],
    ])
  })

  it('should tokenize integer literals', () => {
    expect([...new Lexer('123 456 -789 0')]).toEqual([
      [TokenType.Integer, 123, 0],
      [TokenType.Integer, 456, 4],
      [TokenType.Minus, undefined, 8],
      [TokenType.Integer, 789, 9],
      [TokenType.Integer, 0, 13],
    ])

    expect([...new Lexer('0b0 0B101110 0b00000010')]).toEqual([
      [TokenType.Integer, 0b0, 0],
      [TokenType.Integer, 0B101110, 4],
      [TokenType.Integer, 0b00000010, 13],
    ])

    expect([...new Lexer('0o0 0O12345670 0o007')]).toEqual([
      [TokenType.Integer, 0o0, 0],
      [TokenType.Integer, 0O12345670, 4],
      [TokenType.Integer, 0o007, 15],
    ])

    expect([...new Lexer('0x0 0Xdada 0x0123ABCDEF')]).toEqual([
      [TokenType.Integer, 0x0, 0],
      [TokenType.Integer, 0Xdada, 4],
      [TokenType.Integer, 0x0123ABCDEF, 11],
    ])
  })

  it('should tokenize string literals', () => {
    expect([...new Lexer('"double quoted \'test\'" \'simple quoted "test"\' "double \\"escaped\\" \\"\\"" \'simple \\\'escaped\\\' \\\\\'')]).toEqual([
      [TokenType.String, "double quoted 'test'", 0],
      [TokenType.String, 'simple quoted "test"', 23],
      [TokenType.String, 'double "escaped" ""', 46],
      [TokenType.String, "simple 'escaped' \\", 72],
    ])
  })

  it('should return no token for empty string', () => {
    expect([...new Lexer('')]).toEqual([])
  })

  // FIXME test illegals
})
