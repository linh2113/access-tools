import axios, { AxiosError, AxiosInstance } from 'axios'

class Http {
   instance: AxiosInstance

   constructor() {
      this.instance = axios.create({
         baseURL: 'http://localhost:5000/api',
         timeout: 10_000,
         headers: {
            'Content-Type': 'application/json'
         }
      })

      // Interceptor to add Authorization header before the server receives the request
      this.instance.interceptors.request.use(
         (config) => {
            return config
         },
         (error) => {
            return Promise.reject(error)
         }
      )

      // Interceptor to handle responses before they are returned to the client
      this.instance.interceptors.response.use(
         (response) => {
            return response
         },
         (error: AxiosError) => {
            return Promise.reject(error)
         }
      )
   }
}

const http = new Http().instance
export default http
