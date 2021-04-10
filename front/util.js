const LIMIT = 15

const findTargetIndex = (data, id) => {
  let msgIndex = -1
  const pageIndex = data.pages.findIndex(({ messages }) => {
    const index = messages.findIndex(msg => msg.id === id)
    if (index > -1) {
      msgIndex = index
      return true
    }
  })
  return { pageIndex, msgIndex }
}

const mergeMsgs = data => data.flatMap(d => d.messages)

const convertMsgListFromFlat = (flatList, originalLength) => {
  const newList = flatList.reduce((res, c, i) => {
    const index = Math.floor(i / LIMIT)
    if (!res[index]) res[index] = { messages: [] }
    res[index].messages.push(c)
    return res
  }, [])
  if (originalLength < newList.length) newList.length = originalLength
  return newList
}

const getNewData = data => ({
  pageParams: [...data.pageParams],
  pages: data.pages.map(({ messages }) => ({ messages: [...messages] })),
})

export { LIMIT, findTargetIndex, mergeMsgs, convertMsgListFromFlat, getNewData }
