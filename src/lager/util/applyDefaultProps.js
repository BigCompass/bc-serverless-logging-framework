module.exports = (log, props) => {
  if (props) {
    for (let [propName, prop] of Object.entries(props)) {
      // Apply default props
      if (log[propName] === undefined) {
        if (typeof prop === 'function') {
          log[propName] = prop(log)
        } else {
          log[propName] = prop
        }
      }
    }
  }
}