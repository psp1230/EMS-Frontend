// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/**
 * @param {string} pathname 當前路由路徑
 * @param {object} meta 當前路由自定義meta字段
 * @return {string} 需要跳轉到其他頁時，就返回一个該頁的path路徑，或返回resolve該路徑的promise對象
 */

import type { OnRouteBeforeResType, MetaType } from "@/RouterWaiter/types"
import path from "path"

type RouterParams = {
  pathname: string,
  meta: MetaType
}


const onRouteBefore = async ({ pathname, meta }: RouterParams): Promise<OnRouteBeforeResType> => {
  // 動態修改頁面title
  if (meta.title !== undefined) {
    document.title = meta.title
  }

  // 登錄及權限判斷
  // if (meta.needLogin) { // 路由是否需要登錄
  //   if (token) { // 用戶是否已登錄
  //     try {
  //       await store.dispatch(getUserInfoAction())

  //       if (meta.permission) { // 是否需要權限判斷
  //         if (userInfo && Array.isArray(userInfo.permission)) {
  //           const permissionMaping = userInfo.permission.includes(meta.permission)
  //           if (!permissionMaping) {
  //             return `/403`
  //           }
  //         } else {
  //           return `/403`
  //         }
  //       }

  //       return pathname
  //     } catch (error) {
  //       return `/login`
  //     }
  //   } else {
  //     return `/login`
  //   }
  // }

  return pathname
}

export default onRouteBefore
