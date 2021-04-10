import { useRef } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from '../swrUtils'

const MsgInput = ({ mutationQuery, text = '', variables = [], onUpdate, autoFocus = false }) => {
  const {
    query: { userId },
  } = useRouter()

  const textRef = useRef(null)
  const onSubmit = async e => {
    e.preventDefault()
    const text = textRef.current.value
    const res = await fetcher(mutationQuery, 'userId', userId, 'text', text, ...variables)
    textRef.current.value = ''
    onUpdate && onUpdate(res)
  }

  return (
    <form className="messages_input" onSubmit={onSubmit}>
      <textarea maxLength={140} ref={textRef} defaultValue={text} autoFocus={autoFocus} />
      <button type="submit">전송</button>
    </form>
  )
}

export default MsgInput
