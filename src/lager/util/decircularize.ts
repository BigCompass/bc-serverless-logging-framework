import { parse, stringify } from 'flatted'

export const decircularize = (obj: Object) => parse(stringify(obj))
