import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"
import { API_BASEURL } from 'components/utils/constants'

const options = {
  ignoreHeaders: true
}
const client = applyCaseMiddleware(axios.create({
  baseURL: API_BASEURL + 'api/v1',
}), options)

export default client
