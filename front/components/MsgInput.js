import { useRef } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/dist/client/router'
import { GET_MESSAGES } from '../graphql/message.gql'

const MsgInput = ({
  mutationQuery, // CREATE_MESSAGE or UPDATE_MESSAGE
  mutationTarget, // createMessage or updateMessage
  text = '',
  doneEdit = () => {},
  variables = {},
  autoFocus = false,
}) => {
  const {
    query: { userId },
  } = useRouter()
  const [mutate] = useMutation(mutationQuery)
  const textRef = useRef(null)

  const onSubmit = e => {
    e.preventDefault()
    const text = textRef.current.value
    mutate({
      variables: { ...variables, text, userId },
      update: (cache, { data }) => {
        if (!variables.id) {
          // createMessage
          cache.writeQuery({
            query: GET_MESSAGES,
            data: { messages: [data[mutationTarget]] },
          })
          return
        }

        // updateMessage
        const res = cache.readQuery({ query: GET_MESSAGES })
        const source = [...res.messages]
        const targetIndex = source.findIndex(m => m.id === variables.id)
        if (targetIndex < 0) return
        source[targetIndex] = data[mutationTarget]
        cache.writeQuery({
          query: GET_MESSAGES,
          data: { messages: source },
        })
      },
    })
    textRef.current.value = ''
    doneEdit()
  }

  return (
    <form className="messages_input" onSubmit={onSubmit}>
      <textarea maxLength={140} ref={textRef} defaultValue={text} autoFocus={autoFocus} />
      <button type="submit">전송</button>
    </form>
  )
}

export default MsgInput
