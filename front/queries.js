import { request } from 'graphql-request'

const baseUrl = 'http://localhost:8000/graphql'

export const fetcher = (query, variables) => request(baseUrl, query, variables)

export const QueryKeys = {
  MESSAGES: 'messages',
  USER: 'user',
}

export const queryOptions = {
  refetchOnMount: true,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  staleTime: 1000,
}
