const gql = require('apollo-server-express').gql

const messageSchema = gql`
  extend type Query {
    messages(cursor: ID!, limit: Int): [Message!]!
    message(id: ID!): Message!
  }
  extend type Mutation {
    createMessage(text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userId: ID!): ID!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
  }
  type Message {
    id: ID!
    text: String!
    user: User!
    timestamp: String!
  }
`

module.exports = messageSchema
