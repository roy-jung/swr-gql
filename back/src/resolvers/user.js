module.exports = {
  Query: {
    user: (parent, { id }, { models }) => {
      return models.users[id]
    },
  },
}
