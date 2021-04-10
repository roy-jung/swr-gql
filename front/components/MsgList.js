import { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/client'
import { GET_MESSAGES } from '../graphql/message.gql'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import MsgItem from './MsgItem'

const LIMIT = 15

const MsgList = () => {
  const fetchMoreEl = useRef(null)
  const firstIntersecting = useRef(true)
  const { data, error, fetchMore } = useQuery(GET_MESSAGES, {
    variables: { limit: LIMIT },
  })
  const [intersecting, loadFinished, setLoadFinished] = useInfiniteScroll(fetchMoreEl)
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [msgs, setMsgs] = useState([])

  const doneEdit = () => setEditingMsgId(null)

  useEffect(() => {
    const messages = data?.messages
    if (messages.length) setMsgs(messages)
  }, [data?.messages])

  useEffect(async () => {
    if (intersecting && firstIntersecting.current) {
      firstIntersecting.current = false
      return
    }
    if (!intersecting || loadFinished) return

    const { id: cursor } = msgs[msgs.length - 1] || {}
    const { data: fetchMoreData } = await fetchMore({
      variables: { cursor, limit: LIMIT },
    })
    console.log('fetchMore')

    if (!fetchMoreData?.messages?.length || fetchMoreData.messages.length < LIMIT) setLoadFinished(true)
  }, [intersecting])

  if (error) console.error(error)

  return (
    <>
      <ul className="messages">
        {msgs.map(msg => (
          <MsgItem
            {...msg}
            key={msg.id}
            editing={editingMsgId === msg.id}
            startEdit={() => setEditingMsgId(msg.id)}
            doneEdit={doneEdit}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  )
}

export default MsgList
