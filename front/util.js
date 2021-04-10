export const findTargetIndex = (data, id) => {
  let msgIndex = -1
  const pageIndex = data.findIndex(({ messages: target }) => {
    const index = target.findIndex(msg => msg.id === id)
    if (index > -1) {
      msgIndex = index
      return true
    }
  })
  return { pageIndex, msgIndex }
}

export const getNewData = data => data.map(({ messages }) => ({ messages: [...messages] }))
