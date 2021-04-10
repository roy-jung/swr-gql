const gql = require('apollo-server-express').gql

const userSchema = gql`
  extend type Query {
    user(id: ID!): User
  }
  type User {
    id: ID!
    nickname: String!
  }
`

module.exports = userSchema
