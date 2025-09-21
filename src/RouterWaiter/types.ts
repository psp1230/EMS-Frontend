/// <reference types="vite/client" />
import type { JSX } from 'react';
import type { RouteObject } from 'react-router-dom';

interface MetaType {
  [propName: string]: any;
}

interface FunctionalImportType {
  (): any;
}

type ReactElementType = JSX.Element

type RoutesItemType = Omit<RouteObject, 'children'> & {
  name?: string;
  component?: FunctionalImportType;
  redirect?: string;
  meta?: MetaType;
  index?: any;
  children?: RoutesItemType[];
}

export interface RoutesItemTypeNew extends RoutesItemType {
  path: string;
  url?: string;
}

export declare type RoutesTypeNew = RoutesItemTypeNew[]

// interface RoutesItemType extends RouteObject {
//   redirect?: string;
//   component?: FunctionalImportType;
//   meta?: MetaType;
//   children?: RoutesItemType[];
// }

type RoutesType = RoutesItemType[]

type OnRouteBeforeResType = string | void

interface OnRouteBeforeType {
  (payload: {
    pathname: string;
    meta: MetaType;
  }): OnRouteBeforeResType | Promise<OnRouteBeforeResType>;
}

interface RouterWaiterPropsType {
  routes: RoutesType;
  onRouteBefore?: OnRouteBeforeType;
  loading?: ReactElementType;
}

interface RouterWaiterType {
  (payload: RouterWaiterPropsType): JSX.Element;
}

export type {
  MetaType, // 路由meta字段類型
  FunctionalImportType, // 懶加載函數式導入組件的類型
  ReactElementType, // react組件實例元素類型
  RoutesItemType, // 路由配屬數組項類型
  RoutesType, // 路由配置數組類型
  OnRouteBeforeResType, // 路由攔截函數（實際有效使用的）返回值類型
  OnRouteBeforeType, // 路由攔截函數類型
  RouterWaiterPropsType, // RouterWaiter主組件props類型
  RouterWaiterType, // RouterWaiter主組件類型
}

declare const RouterWaiter: RouterWaiterType

export default RouterWaiter