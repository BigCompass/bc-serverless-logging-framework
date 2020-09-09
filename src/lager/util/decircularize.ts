import stringify from 'json-stringify-safe'

export const decircularize = (obj: Object) => JSON.parse(stringify(obj))
