import { useMutation, useQueryClient } from 'react-query'
import { DELETE_MESSAGE, UPDATE_MESSAGE } from '../graphql/message.gql'
import MsgInput from './MsgInput'
import { fetcher, QueryKeys } from '../queries'
import { convertMsgListFromFlat, findTargetIndex, getNewData, mergeMsgs } from '../util'

const textParser = text => text.split('\n').map((l, i) => <p key={i}>{l}</p>)
const MsgItem = ({ me, id, text, user: { nickname, id: userId }, editing, startEdit, doneEdit }) => {
  const client = useQueryClient()

  const { mutate } = useMutation(() => fetcher(DELETE_MESSAGE, { id, userId: me.id }), {
    onSuccess: ({ deleteMessage }) => {
      client.setQueryData(QueryKeys.MESSAGES, old => {
        const newFlatList = mergeMsgs(old.pages).filter(m => m.id !== deleteMessage)
        const newList = convertMsgListFromFlat(newFlatList, old.pages.length)
        return {
          pageParams: [...old.pageParams],
          pages: newList,
        }
      })
    },
  })

  const onUpdate = ({ updateMessage }) => {
    client.setQueryData(QueryKeys.MESSAGES, old => {
      const { pageIndex, msgIndex } = findTargetIndex(old, updateMessage.id)
      const newData = getNewData(old)
      if (pageIndex > -1 && msgIndex > -1) {
        newData.pages[pageIndex].messages[msgIndex] = updateMessage
      }
      return newData
    })
    doneEdit()
  }

  const onDelete = e => {
    e.stopPropagation()
    mutate()
  }

  if (editing)
    return (
      <li className="messages__item">
        <MsgInput
          me={me}
          mutationQuery={UPDATE_MESSAGE}
          text={text}
          onUpdate={onUpdate}
          variables={{ id }}
          autoFocus={true}
        />
        <button onClick={doneEdit}>취소</button>
      </li>
    )
  return (
    <li className="messages__item">
      <h3>{nickname}</h3>
      {textParser(text)}
      {userId === me.id && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button> <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  )
}

export default MsgItem
