import { request } from 'graphql-request'

const baseUrl = 'http://localhost:8000/graphql'

const getVariablesFromArray = variableArr => {
  const variables = {}
  for (let i = 0; i < variableArr.length; i += 2) {
    variables[variableArr[i]] = variableArr[i + 1]
  }
  return variables
}
const fetcher = (query, ...variableArr) => {
  const variables = getVariablesFromArray(variableArr)
  return request(baseUrl, query, variables)
}

export { fetcher, getVariablesFromArray }
