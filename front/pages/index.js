import { GET_MESSAGES } from '../graphql/message.gql'
import { GET_USER } from '../graphql/user.gql'
import MsgList from '../components/MsgList'
import { fetcher } from '../queries'
import { LIMIT } from '../util'

const Home = ({ me, smsgs }) => <MsgList me={me} smsgs={smsgs} />

export const getServerSideProps = async ({ query: { userId } }) => {
  const [{ user }, { messages }] = await Promise.all([
    userId && fetcher(GET_USER, { id: userId }),
    fetcher(GET_MESSAGES, { limit: LIMIT }),
  ])
  return { props: { me: user, smsgs: messages } }
}

export default Home
