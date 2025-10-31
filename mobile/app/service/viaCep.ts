import Axios from "axios"

import Toast from "react-native-toast-message"

const api = Axios.create({
  baseURL: process.env.VIA_CEP_API_URL || "https://viacep.com.br/ws",
  timeout: Number(process.env.API_TIMEOUT) || 10000,
})

api.interceptors.request.use(
  (config) => {
    console.log("Enviando requisição para:", config.url)
    return config
  },
  (error) => {
    console.log("Erro ao enviar requisição:", error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response.data)
    return response
  },
  (error) => {
    console.log("Erro na resposta da API:", error)
    return Promise.reject(error)
  }
)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (!error.response) {
      console.log("Erro ao conectar na API:", error.message)
      Toast.show({
        type: "error",
        text1: "Erro",
        text2:
          "Não foi possível se conectar ao servidor. Verifique sua conexão com a internet.",
      })
    }
    return Promise.reject(error)
  }
)

export default api
