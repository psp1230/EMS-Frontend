import type { RcFile } from "rc-upload/lib/interface"
import Clipboard from 'clipboard'

/**
 * @description: 日期時間格式化
 * @param {Date | number | string} time js的date類型、時間戳、格式化後的日期格式
 * @param {string} format 自定義時間格式，選填，默認為'{y}-{m}-{d} {h}:{i}:{s}'，星期為{a}
 * @param {boolean} isNeedZero 是否需要自動補零，默認true
 * @return {string} 默認格式 2018-09-01 10:55:00
 */
function formatDate(time?: Date | number | string, format = '{y}-{m}-{d} {h}:{i}:{s}', isNeedZero = true): string {
  time = time || new Date()
  // eslint-disable-next-line eqeqeq
  if (+time == time) {
    time = +time
  }
  let date
  if (typeof time === 'string') {
    time = time.replace(/-/g, '/')
    date = new Date(time)
  } else if (typeof time === 'number') {
    if (('' + Math.floor(time)).length === 10) time = time * 1000
    date = new Date(time)
  } else {
    date = time
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = (formatObj as any)[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (isNeedZero) {
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
    }
    return value || 0
  })
  return timeStr
}

/**
 * @description: 日期格式轉時間戳
 * @param {Date | string} date js的date類型、格式化後的日期格式 2019-05-24 14:22:17
 * @return {number} 1558678937000
 */
function getTimestamp(date?: Date | string): number {
  if (!date) {
    return +new Date()
  }
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
  }
  return +new Date(date)
}

/**
 * @description: 判斷是否是NaN
 * @param {any} val 任意資料型別的數據
 * @return {boolean}
 */
function judgeNaN(val: any): boolean {
  return typeof val === 'number' && !(val >= 0) && !(val <= 0)
}

/**
 * @description: 對象資料過濾（過濾後端無法識別的無效值：undefined, NaN, null）
 * @param {object} obj 對象資料
 * @return {object}
 */
function filterObject(obj: { [propName: string]: any; }): { [propName: string]: any; } {
  const isValid = (val: any) => {
    return val !== undefined && !judgeNaN(val) && val !== null
  }
  const newObj: any = {}
  Object.keys(obj).forEach((v) => {
    const val = obj[v]
    if (isValid(val)) {
      newObj[v] = val
    }
  })
  return newObj
}

/**
 * @description: 對象參數序列化（過濾undefined和NaN,自動encode）
 * @param {object} obj 對象參數
 * @return {string} a=1&b=2&c=3
 */
function objToUrlParams(obj: { [propName: string]: any; }): string {
  let str = ''
  Object.keys(obj).forEach((v) => {
    const val = obj[v]
    if (val !== undefined && !judgeNaN(val)) {
      str += `${encodeURIComponent(v)}=${encodeURIComponent(val)}&`
    }
  })
  return str.slice(0, -1)
}

/**
 * @description: 獲取地址參數
 * @param {string} url 指定地址，默認取當前頁地址
 * @return {string} { a: 1, b: 2, c: 3 }
 */
function getQueryObject(url?: string): { [propName: string]: any; } {
  url = url || window?.location.href || ''
  const questionIndex = url.lastIndexOf('?')
  const obj: { [propName: string]: any; } = {}
  if (questionIndex > 0) {
    const search = url.substring(questionIndex + 1)
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
      const name = decodeURIComponent($1)
      let val = decodeURIComponent($2)
      val = String(val)
      obj[name] = val
      return rs
    })
  }
  return obj
}

/**
 * @description: 創建唯一的字符串
 * @return {string} ojgdvbvaua40
 */
function createUniqueString(): string {
  const timestamp = +new Date() + ''
  const randomNum = (1 + Math.random()) * 65536 + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @description: 函數防抖
 * @param {function} fn 函數
 * @param {number} t 等待時間（毫秒）
 * @return {function}
 */
function debounce(fn: any, t?: number): any {
  let timeId: any
  let delay = t || 500
  return function (this: any, ...args: any) {
    if (timeId) {
      clearTimeout(timeId)
    }
    timeId = setTimeout(() => {
      timeId = null
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * @description: 函數節流
 * @param {function} fn 函數
 * @param {number} t 間隔時間（毫秒）
 * @return {function}
 */
function throttle(fn: any, t?: number): any {
  let timeId: any
  let firstTime = true
  let interval = t || 500
  return function (this: any, ...args: any) {
    if (firstTime) {
      fn.apply(this, args)
      firstTime = false
      return
    }
    if (timeId) {
      return
    }
    timeId = setTimeout(() => {
      clearTimeout(timeId)
      timeId = null
      fn.apply(this, args)
    }, interval)
  }
}

/**
 * @description: 獲取資料類型
 * @param {any} data 資料
 * @return {string} 'array'
 */
function getDataType(data: any): string {
  const str = Object.prototype.toString.call(data)
  return (str.match(/\s(\w*)\]/) as any)[1].toLowerCase()
}

/**
 * @description: 數字千分化
 * @param {number} num 數字
 * @return {string} 10,000
 */
function toThousands(num: number): string {
  return (+num || 0).toString().replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * @description: 字串超出長度用...表示
 * @param {string} str 字串
 * @param {number} maxLen 最大長度
 * @return {string}
 */
function omitText(str: string, maxLen: number): string {
  if (!str) {
    return ''
  }
  maxLen = maxLen || str.length
  if (str.length > maxLen) {
    str = str.slice(0, maxLen) + '...'
  }
  return str
}

/**
 * @description: 判斷是否支持 storage 存儲（區分無痕模式）
 * @return {boolean}
 */
function isStorageSupported(): boolean {
  const testKey = 'testIsStorageSupported'
  const storage = window.sessionStorage
  try {
    storage.setItem(testKey, 'testValue')
    storage.removeItem(testKey)
    return true
  } catch (error) {
    return false
  }
}

/**
 * @description: 自訂的 setInterval 函數（使用 setTimeout 代替實現，性能更佳）
 * @param {function} fn 回調函數
 * @param {number} delay 延遲，毫秒
 * @return {object} timer 調用 timer.clear() 可以清除該定時器
 */
function setMyInterval(fn: any, delay: number): { clear: () => void } {
  let timeId: any = null
  const intervalFn = () => {
    timeId = setTimeout(() => {
      intervalFn()
      fn.call(window)
    }, delay)
  }
  intervalFn()

  const timer = {
    clear: () => {
      clearTimeout(timeId)
    },
  }
  return timer
}

/**
  * @description: 數字轉換小數
  * @param {number} number 原始數字
  * @param {number} numth 可選，保留幾位小數，默認2
  * @param {string} type 可選，多出的小數位處理方式，(默認)floor捨棄，round四捨五入
  * @return {string} 0.00
  */
function toDecimal(number: number, saveNum = 2, type = 'floor'): string {
  number = +number || 0
  saveNum = +saveNum
  if (saveNum <= 0) {
    return (Math as any)[type](number)
  }
  const multiple = Math.pow(10, saveNum)
  const intNum = (Math as any)[type](number * multiple) / multiple
  let strNum = intNum.toString()
  let index = strNum.indexOf('.')
  if (index < 0) {
    index = strNum.length
    if (saveNum > 0) {
      strNum += '.'
    }
  }
  while (strNum.length <= index + saveNum) {
    strNum += '0'
  }
  return strNum
}

/**
 * @description: 數字存儲大小格式化
 * @param {number} num 存儲大小 單位：Byte
 * @param {number} digits 保留幾位小數，默認2
 * @return {string} 2MB
 */
function formatStorage(num: number, digits = 2): string {
  digits = digits || 2
  if (num < 1024) {
    return num + 'B'
  }
  const si = [
    { value: Math.pow(1024, 6), symbol: 'E' },
    { value: Math.pow(1024, 5), symbol: 'P' },
    { value: Math.pow(1024, 4), symbol: 'T' },
    { value: Math.pow(1024, 3), symbol: 'G' },
    { value: Math.pow(1024, 2), symbol: 'M' },
    { value: Math.pow(1024, 1), symbol: 'K' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') +
        si[i].symbol + 'B'
    }
  }
  return ''
}

/**
 * @description: 版本號比較
 * @param {string} v1 第一个版本號
 * @param {string} v2 第二个版本號
 * @return {number} 1大於 0等於 -1小於
 */
function compareVersion(v1: string, v2: string): number {
  const arr1 = v1.split('.')
  const arr2 = v2.split('.')
  const len = Math.max(arr1.length, arr2.length)
  while (arr1.length < len) {
    arr1.push('0')
  }
  while (arr2.length < len) {
    arr2.push('0')
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(arr1[i])
    const num2 = parseInt(arr2[i])
    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }
  return 0
}

/**
 * @description: 手機號隱藏中間四位，用****表示
 * @param {number|string} mobile 手機號
 * @return {string}
 */
function hidePhoneNum(mobile: number | string): string {
  mobile = mobile + '';
  const arr = mobile.split('');
  arr.splice(3, 4, '****');
  return arr.join('');
}

/**
 * @description: 將檔案轉換為base64編碼
 * @param {File} file 檔案對象
 * @return {Promise<string>} base64編碼
 */
function fileToBase64(file: File | RcFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const res = (reader.result as string).split(',')[1]
      resolve(res)
    }
    reader.onerror = error => reject(error)
  })
}

/**
 * @description: 將base64編碼轉換為檔案
 * @param {string} base64 base64編碼
 * @return {Promise<File>} 檔案對象
 */
function base64ToFile(base64: string) {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const suffix = mime.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const filename = `${Date.now()}.${suffix}`
  return new File([u8arr], filename, { type: mime })
}

/**
 * @description: 檔案下載
 * @param {string} file 檔案對象
 * @param {string} filename 檔案名稱
 * @return {void}
 */
function fileDownload(file: BlobPart, name: string) {
  const blob = new Blob([file])
  const reader = new FileReader()
  reader.readAsDataURL(blob)
  reader.onload = function (e) {
    var a = document.createElement('a')
    a.download = name
    a.href = e.target!.result?.toString()!
    a.click()
    a.remove()
  }
}


/**
  * @Description: 複製文字到剪貼板
  * @param {any} text 要複製的文字
  * @return {promise} 返回一個promise物件
  */

function clipboard(text: any): Promise<any> {
  text = text || ''
  return new Promise((resolve, reject) => {
    const element = document.createElement('div')
    const clipboard = new Clipboard(element, {
      text: () => text
    })
    clipboard.on('success', (res) => {
      clipboard.destroy()
      resolve(res)
    })
    clipboard.on('error', (err) => {
      clipboard.destroy()
      reject(err)
    })
      ; (clipboard as any).onClick({ currentTarget: element })
  })
}

//將"2025-01-21T12:29:50.498149"去找尋他的月份
function getMonth(date: string) {
  let month = new Date(date).getMonth() + 1;
  return month;
}


export default {
  // 日期時間格式化
  formatDate,
  // 日期格式轉時間戳
  getTimestamp,
  // 判斷是否是NaN
  judgeNaN,
  // 物件資料過濾
  filterObject,
  // 物件參數序列化
  objToUrlParams,
  // 獲取地址參數
  getQueryObject,
  // 創建唯一的字串
  createUniqueString,
  // 函數防抖
  debounce,
  // 函數節流
  throttle,
  // 獲取資料類型
  getDataType,
  // 數字千分化
  toThousands,
  // 字串超出長度用...表示
  omitText,
  // 判斷是否支持 storage 存儲
  isStorageSupported,
  // 自訂的 setInterval 函數
  setMyInterval,
  // 數字小數位格式化
  toDecimal,
  // 數字儲存大小格式化
  formatStorage,
  // 版本號比較
  compareVersion,
  // 手機號隱藏中間四位
  hidePhoneNum,
  // 將檔案轉換為base64編碼
  fileToBase64,
  // 將base64編碼轉換為檔案
  base64ToFile,
  // 檔案下載
  fileDownload,
  // 複製文字到剪貼板
  clipboard,
  //月份
  getMonth,
};