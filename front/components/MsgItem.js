import { UPDATE_MESSAGE, DELETE_MESSAGE } from '../graphql/message.gql'
import MsgInput from '../components/MsgInput'
import { fetcher } from '../swrUtils'
import { useRouter } from 'next/dist/client/router'
import { findTargetIndex, getNewData } from '../util'

const textParser = text => text.split('\n').map((l, i) => <p key={i}>{l}</p>)
const MsgItem = ({ id, text, user: { nickname, id: userId }, editing, startEdit, mutate, doneEdit }) => {
  const {
    query: { userId: myId },
  } = useRouter()

  const onUpdate = ({ updateMessage }) =>
    mutate(data => {
      const { pageIndex, msgIndex } = findTargetIndex(data, id)
      if (pageIndex < 0 || msgIndex < 0) return data
      const newData = getNewData(data)
      newData[pageIndex].messages[msgIndex].text = updateMessage.text
      doneEdit()
      return newData
    }, false)

  const onDelete = async e => {
    e.stopPropagation()
    const { deleteMessage } = await fetcher(DELETE_MESSAGE, 'id', id, 'userId', myId)
    mutate(data => {
      const { pageIndex, msgIndex } = findTargetIndex(data, deleteMessage)
      if (pageIndex < 0 || msgIndex < 0) return data
      const newData = getNewData(data)
      newData[pageIndex].messages = newData[pageIndex].messages.filter((_, i) => i !== msgIndex)
      return newData
    }, false)
  }

  if (editing)
    return (
      <li className="messages__item">
        <MsgInput mutationQuery={UPDATE_MESSAGE} text={text} variables={['id', id]} onUpdate={onUpdate} />
        <button onClick={doneEdit}>취소</button>
      </li>
    )
  return (
    <li className="messages__item">
      <h3>{nickname}</h3>
      {textParser(text)}
      {userId === myId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button> <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  )
}

export default MsgItem
