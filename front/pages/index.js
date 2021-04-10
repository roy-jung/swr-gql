import { GET_USER } from '../graphql/user.gql'
import { GET_MESSAGES } from '../graphql/message.gql'
import MsgList from '../components/MsgList'
import { fetcher } from '../swrUtils'

const Home = ({ me, smsgs }) => <MsgList me={me} smsgs={smsgs} />

export const getServerSideProps = async ({ query: { userId } }) => {
  const [{ user }, { messages }] = await Promise.all([
    fetcher(GET_USER, 'id', userId),
    fetcher(GET_MESSAGES, 'limit', 15),
  ])
  return { props: { me: user, smsgs: messages } }
}

export default Home
