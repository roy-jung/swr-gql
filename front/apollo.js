import { ApolloClient, InMemoryCache } from '@apollo/client'

const mergeItems = (a = [], b = []) => {
  return Array.from(new Set([...a, ...b].map(m => m.__ref))).map(r => ({ __ref: r }))
}

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          messages: {
            read(existing = []) {
              return existing
            },
            merge(existing = [], incoming = [], { args: { cursor }, readField }) {
              const extIndex = existing.findIndex(e => readField('id', e) === cursor)
              if (extIndex > -1) return mergeItems(existing, incoming)
              return mergeItems(incoming, existing)
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      // pollInterval: 5000,
    },
  },
})

export default client
