import { useEffect, useState, useRef } from 'react'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import MsgInput from './MsgInput'
import MsgItem from './MsgItem'
import { useSWRInfinite } from 'swr'
import { fetcher } from '../swrUtils'
import { CREATE_MESSAGE, GET_MESSAGES } from '../graphql/message.gql'

const LIMIT = 15
const mergeMsgs = data => data.flatMap(d => d.messages)

const MsgList = ({ me, smsgs = [] }) => {
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [msgs, setMsgs] = useState(smsgs || [])
  const fetchMoreEl = useRef(null)
  const [intersecting, loadFinished, setLoadFinished] = useInfiniteScroll(fetchMoreEl)

  const getKey = (pageIndex, prevData) => {
    const prevMsgs = prevData?.messages || []
    if (prevMsgs && prevMsgs.length > 0 && prevMsgs.length < LIMIT) {
      setLoadFinished(true)
      return null
    }
    const cursor = prevMsgs[prevMsgs.length - 1]?.id || ''
    return [GET_MESSAGES, 'cursor', cursor, 'limit', LIMIT]
  }

  const { data, error, mutate, size, setSize } = useSWRInfinite(getKey, fetcher, {
    // revalidateAll: true,
  })

  const onCreate = ({ createMessage }) =>
    mutate(data => {
      const newData = [...data]
      newData[0].messages.unshift(createMessage)
      setMsgs(mergeMsgs(newData))
      return newData
    }, false)

  const doneEdit = () => setEditingMsgId(null)

  useEffect(() => {
    if (data?.length) setMsgs(mergeMsgs(data))
  }, [data])

  useEffect(() => {
    if (!loadFinished && intersecting) setSize(size + 1)
  }, [intersecting, loadFinished])

  if (error) console.error(error)

  return (
    <>
      <MsgInput mutationQuery={CREATE_MESSAGE} onUpdate={onCreate} />
      <ul className="messages">
        {msgs.map(msg => (
          <MsgItem
            {...msg}
            key={msg.id}
            editing={editingMsgId === msg.id}
            startEdit={() => setEditingMsgId(msg.id)}
            mutate={mutate}
            doneEdit={doneEdit}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  )
}

export default MsgList
