export const fastFind = (array, key, id) => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i][key] === id) {
      return array[i]
    }
  }
  return undefined
}

export const fastFilter = (array, fn) => {
  const final = []
  for (let i = 0; i < array.length; i += 1) {
    if (fn(array[i])) {
      final.push(array[i])
    }
  }
  return final
}
