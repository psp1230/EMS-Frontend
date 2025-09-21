import React, { type JSX } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import Guard from './guard'
import type { RouterWaiterPropsType, MetaType, FunctionalImportType } from '@/RouterWaiter/types'

export default class Fn {
  routes
  onRouteBefore
  loading
  loadedComponents: { [key: string]: JSX.Element } = {}

  constructor(option: RouterWaiterPropsType) {
    this.routes = option.routes || []
    this.onRouteBefore = option.onRouteBefore
    this.loading = option.loading || (<div>Loading...</div>)
  }

  /**
   * @description: 路由配置列表數據轉換
   * @param {string} redirect 要重定向的路由路徑
   * @param {function} component 函數形式import懶加載组件
   * @param {object} meta 自定義字段
   */
  transformRoutes(routeList = this.routes) {
    const list: RouteObject[] = []
    routeList.forEach(route => {
      const obj = { ...route }
      if (obj.path === undefined) {
        return
      }
      if (obj.redirect) {
        obj.element = <Navigate to={obj.redirect} replace={true} />
      } else if (obj.component) {
        obj.element = this.lazyLoad(obj.component, obj.meta || {})
      }
      delete obj.redirect
      delete obj.component
      delete obj.meta
      if (obj.children) {
        obj.children = this.transformRoutes(obj.children)
      }
      list.push(obj);
    })
    return list
  }

  /**
   * @description: 路由懶加載
   */
  lazyLoad(importFn: FunctionalImportType, meta: MetaType) {
    const fnToString = importFn.toString()

    if (!this.loadedComponents[fnToString]) {
      const Element = React.lazy(importFn)
      const lazyElement = (
        <React.Suspense>
          <Element _meta={meta} />
        </React.Suspense>
      )

      const GuardElement = <Guard
        element={lazyElement}
        meta={meta}
        onRouteBefore={this.onRouteBefore}
      />

      this.loadedComponents[fnToString] = GuardElement

      return GuardElement
    }

    return this.loadedComponents[fnToString]
  }
}