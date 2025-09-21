// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * @Description: API請求基礎封裝
 */
import axios, { type AxiosRequestConfig, type Method } from 'axios'
import tools from '@/utils/tools'
import { toast } from "@/components/ui/use-toast"

interface ConfigMoreType {
  codeList?: number[];
}

interface ReqConfig extends AxiosRequestConfig, ConfigMoreType { }

// 創建axios實例
const service = axios.create()

// 定義額外配置
let configMore: ConfigMoreType

// const { userStore } = store

/**
   * 數據請求 配置項
   * @params {object} data 傳參數據
   * @params {boolean} codeList 可選，控制自行處理API響應異常的code码列表(resolve且不彈出toast)，默認為空陣列
   * ......
   */
function request(config: ReqConfig) {
  // 獲取額外配置參數
  const { codeList } = config
  configMore = {
    codeList: codeList || []
  }
  return service(config)
}

// 請求攔截
service.interceptors.request.use(
  (config) => {
    // 全局统一參數
    // const commonData = {
    //   token: userStore.token,
    // }

    // 超時
    config.timeout = config.timeout || 600000
    // baseURL
    config.baseURL = config.baseURL || ''
    // 請求方法
    config.method = (config.method?.toLowerCase() || 'get') as Method
    // 請求頭
    config.headers = config.headers || {}
    // 請求體
    config.responseType = config.responseType || 'json'
    // 請求參數
    if (config.method === 'post') {
      // post請求
      config.data = config.data || {}
      const contentType = (config.headers['Content-Type'] || '') as string
      if (contentType.includes('json')) {
        // json傳參
        // config.transformRequest = [(data) => data && JSON.stringify(tools.filterObject(data))]
      } else if (contentType.includes('urlencoded')) {
        // 表單傳參
        config.transformRequest = [(data) => data && tools.objToUrlParams(data)]
      } else if (contentType.includes('form-data')) {
        // form-data傳參
        config.transformRequest = [(data) => data]
      } else if (contentType.includes('text/event-stream')) {
        // event-stream傳參
        config.transformRequest = [(data) => data]

      }
    } else if (config.method === 'get') {
      // get請求
      config.params = { ...config.params }
      //  config.paramsSerializer = (data) => data && tools.objToUrlParams(data)
    }
    // 跨域時是否允許攜帶cookie
    config.withCredentials = !!config.withCredentials

    return config
  },
  err => {
    Promise.reject(err)
  }
)

// 響應攔截
service.interceptors.response.use(
  response => {
    const res = response.data;
    const headers = {
      contentLength: response.headers['content-length'],
      contentType: response.headers['content-type'],
    };
    const status = response.status;

    const pre = window.location.origin + import.meta.env.PUBLIC_URL;

    if (res.code > 2000 && res.code < 3000) {
      const axiosRes = { data: res, headers, status, response };
      return axiosRes;
    }

    if (res.errorCode === undefined) {
      const axiosRes = { data: res, headers, status, response };
      return axiosRes;
    }

    if (configMore.codeList && configMore.codeList.length > 0) {
      const myCodeList = configMore.codeList.map(v => v + '');
      if (myCodeList.includes(res.errorCode + '')) {
        const axiosRes = { data: res, headers, status };
        return axiosRes;
      }
    }

    if ([10, 11].includes(+res.errorCode)) {
      window.location.href = `${pre}/login?redirectUrl=${encodeURIComponent(window.location.href)}`;
      return;
    }

    // toast({
    //   variant: 'destructive',
    //   title: 'Error',
    //   description: res.errorText || 'Unexpected error occurred',
    //   duration: 3000,
    // });

    return Promise.reject(res);
  },
  async (err) => {

    // if (err.response) {
    //   const status = err.response.status;
    //   if (status === 400 && err.response.data.detail) {
    //     toast({
    //       variant: 'destructive',
    //       title: 'Error',
    //       description: err.response.data.detail.msg,
    //       duration: 3000,
    //     });
    //     return;
    //   }
    //   if (err.response.data && err.response.data.msg) {
    //     if (status === 403 || err.response.data.code === 401) {
    //       window.location.href = '/login'
    //       return;
    //     }
    //     toast({
    //       variant: 'destructive',
    //       title: 'Error',
    //       description: err.response.data.msg,
    //     });
    //   }
    // } else {
    //   toast({
    //     variant: 'destructive',
    //     title: 'Error',
    //     description: 'Network error. Please check your connection.',
    //     duration: 3000,
    //   });
    // }

    return Promise.reject(err);
  }
);

export default request
