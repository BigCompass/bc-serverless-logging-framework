import { decircularize } from '../decircularize'

it('decircularizes an object that references itself', () => {
  const obj = { a: 1, b: 2, selfRef: {} }
  obj.selfRef = obj

  const result = decircularize(obj)
  expect(result).toEqual({
    a: 1,
    b: 2,
    selfRef: '[Circular ~]'
  })
})
