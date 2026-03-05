import axios from 'axios'

export const serverApiClient = axios.create({
  headers: { accept: 'application/json' },
})
