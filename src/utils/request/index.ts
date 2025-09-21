// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * @Description: 通用API請求封裝
 */
import axios from './axios'
// import store from '@/store'

// const { userStore } = store
// const tenantPath = location.pathname.split(/([^\/$]+)/g)[1]

/**
  * 請求攔截 config配置項
  * @params {string} url API名
  * @params {object} data 傳參數據
  * @params {string} method 可選，請求方式，默認
  * @params {boolean} codeList 可選，控制自行處理API響應異常的code碼列表，默認為空陣列
  */
function request(apiUrl: string, { method, params, host, data, codeList, headers, baseURL, withCredentials, responseType, signal, onDownloadProgress, onUploadProgress }: any = {}) {
  // 默認值
  method = method || 'GET'
  codeList = codeList || []
  baseURL = baseURL || undefined
  headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'authorization': 'Bearer ' + 'gr5rhrhdtrhrhwrjttjgrgwehthrsthh',
    ...headers,
  }
  // withCredentials = withCredentials === undefined ? true : !!withCredentials
  withCredentials = false

  responseType = responseType || 'json'

  // url
  let url = ''
  // console.log(import.meta.env.VITE_NODE_ENV)
  if (import.meta.env.VITE_NODE_ENV === 'development') {
    // 開發伺服器
    baseURL = baseURL ? baseURL : import.meta.env.VITE_API_URL || ''
    url = apiUrl
  } else if (import.meta.env.VITE_NODE_ENV === 'uat') {
    // 測試伺服器
    // console.log(baseURL)
    baseURL = baseURL ? baseURL : import.meta.env.VITE_API_URL || ''
    url = apiUrl
  } else {
    //生產伺服器
    baseURL = baseURL ? baseURL : import.meta.env.VITE_API_URL || ''
    url = apiUrl
  }

  // 返回promise
  return new Promise((resolve: (value: any) => void, reject) => {
    axios({
      url,
      params,
      data,
      method,
      codeList,
      headers,
      baseURL,
      withCredentials,
      responseType,
      signal,
      onDownloadProgress,
      onUploadProgress,
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export default request
