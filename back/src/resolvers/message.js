const { v4: uuidv4 } = require('uuid')
const writeModel = require('./writeModel')

const messageResolvers = {
  Query: {
    messages: (parent, { cursor = '', limit }, { models }) => {
      const messageIds = Object.keys(models.messages).reverse()
      const fromIndex = messageIds.indexOf(cursor) + 1
      return messageIds.slice(fromIndex, fromIndex + limit).map(id => models.messages[id])
    },
    message: (parent, { id }, { models }) => {
      return models.messages[id]
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { models }) => {
      const id = uuidv4()
      const message = {
        id,
        text,
        userId,
        timestamp: String(Date.now()),
      }
      models.messages[id] = message
      writeModel('message', models.messages)
      return message
    },
    deleteMessage: (parent, { id, userId }, { models }) => {
      const { [id]: message, ...otherMessages } = models.messages

      if (!message || message.userId !== userId) {
        return null
      }
      models.messages = otherMessages
      writeModel('message', models.messages)
      return id
    },
    updateMessage: (parent, { id, text, userId }, { models }) => {
      const { [id]: message } = models.messages
      if (message.userId !== userId) return null
      models.messages[id].text = text
      writeModel('message', models.messages)
      return message
    },
  },
  Message: {
    user: (message, args, { models }) => models.users[message.userId],
  },
}

module.exports = messageResolvers
