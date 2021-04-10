import { useMutation } from '@apollo/client'
import { GET_MESSAGES, DELETE_MESSAGE, UPDATE_MESSAGE } from '../graphql/message.gql'
import MsgInput from '../components/MsgInput'
import { useRouter } from 'next/dist/client/router'

const textParser = text => text.split('\n').map((l, i) => <p key={i}>{l}</p>)
const MsgItem = ({ id, text, user: { nickname, id: userId }, editing, startEdit, doneEdit }) => {
  const {
    query: { userId: myId },
  } = useRouter()
  const [deleteMessage] = useMutation(DELETE_MESSAGE)
  const onDelete = e => {
    e.stopPropagation()
    deleteMessage({
      variables: { id, userId: myId },
      update: cache => {
        const res = cache.readQuery({ query: GET_MESSAGES })
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { messages: res.messages.filter(m => m.id !== id) },
        })
      },
    })
  }

  if (editing)
    return (
      <li className="messages__item">
        <MsgInput
          mutationQuery={UPDATE_MESSAGE}
          mutationTarget="updateMessage"
          text={text}
          doneEdit={doneEdit}
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
      {userId === myId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button> <button onClick={onDelete}>삭제</button>
        </div>
      )}
    </li>
  )
}

export default MsgItem
