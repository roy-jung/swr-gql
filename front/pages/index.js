import client from '../apollo'
import { CREATE_MESSAGE } from '../graphql/message.gql'
import { GET_USER } from '../graphql/user.gql'
import MsgInput from '../components/MsgInput'
import MsgList from '../components/MsgList'

const Home = () => {
  return (
    <>
      <MsgInput mutationQuery={CREATE_MESSAGE} mutationTarget="createMessage" />
      <MsgList />
    </>
  )
}

export const getServerSideProps = async ({ query: { userId } }) => {
  const {
    data: { user },
  } = await client.query({ query: GET_USER, variables: { id: userId } })
  const initialState = client.cache.extract()
  return {
    props: {
      initialState,
      me: user,
    },
  }
}

export default Home
