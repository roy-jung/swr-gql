import { useEffect, useState, useRef } from 'react'
import { useInfiniteQuery, useQueryClient } from 'react-query'
import { CREATE_MESSAGE, GET_MESSAGES } from '../graphql/message.gql'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import MsgInput from './MsgInput'
import MsgItem from './MsgItem'
import { fetcher, QueryKeys } from '../queries'
import { LIMIT, convertMsgListFromFlat, mergeMsgs } from '../util'

const MsgList = ({ me, smsgs = [] }) => {
  const client = useQueryClient()
  const [editingMsgId, setEditingMsgId] = useState(null)
  const [msgs, setMsgs] = useState(smsgs || [])
  const fetchMoreEl = useRef(null)
  const intersecting = useInfiniteScroll(fetchMoreEl)

  const { data, error, isError, hasNextPage, fetchNextPage } = useInfiniteQuery(
    QueryKeys.MESSAGES,
    ({ pageParam = '' }) => {
      if (pageParam === false) return
      return fetcher(GET_MESSAGES, { cursor: pageParam, limit: LIMIT })
    },
    {
      initialData: {
        pageParams: [undefined],
        pages: [{ messages: smsgs }],
      },
      getNextPageParam: data => {
        if (!data?.messages?.length) return
        const nextParam = data.messages[data.messages.length - 1]?.id
        return nextParam
      },
    },
  )

  const doneEdit = () => setEditingMsgId(null)

  const onCreate = ({ createMessage }) => {
    client.setQueryData(QueryKeys.MESSAGES, old => {
      const newList = convertMsgListFromFlat([createMessage, ...mergeMsgs(old.pages)], old.pages.length)
      return {
        pageParams: [...old.pageParams],
        pages: newList,
      }
    })
  }

  useEffect(() => {
    if (!data?.pages) return
    const messages = mergeMsgs(data.pages)
    if (messages.length) setMsgs(messages)
  }, [data?.pages])

  useEffect(async () => {
    if (intersecting && hasNextPage) fetchNextPage()
  }, [intersecting, hasNextPage])

  if (isError) console.error(error)

  return (
    <>
      <MsgInput me={me} mutationQuery={CREATE_MESSAGE} onUpdate={onCreate} />
      <ul className="messages">
        {msgs.map(msg => (
          <MsgItem
            me={me}
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
