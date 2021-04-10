import { useRef } from 'react'
import { useMutation } from 'react-query'
import { fetcher } from '../queries'

const MsgInput = ({
  me,
  mutationQuery, // CREATE_MESSAGE or UPDATE_MESSAGE
  text = '',
  onUpdate = (...arg) => {},
  variables = {},
  autoFocus = false,
}) => {
  const { mutate } = useMutation(text => fetcher(mutationQuery, { text, userId: me.id, ...variables }), {
    onSuccess: onUpdate,
  })

  const textRef = useRef(null)

  const onSubmit = e => {
    e.preventDefault()
    const text = textRef.current.value
    mutate(text)
    textRef.current.value = ''
  }

  return (
    <form className="messages_input" onSubmit={onSubmit}>
      <textarea maxLength={140} ref={textRef} defaultValue={text} autoFocus={autoFocus} />
      <button type="submit">전송</button>
    </form>
  )
}

export default MsgInput
