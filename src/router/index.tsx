import { lazy } from "react";
import type { RoutesTypeNew } from "@/RouterWaiter/types";

const Layout = lazy(() => import("@/components/Layout"));
const Home = () => import("../views/Home");
const Error404 = () => import("../views/ErrorPage/404");
const Error403 = () => import("../views/ErrorPage/403");
const Login = () => import("../views/Login");
const CustomerInfo = () => import("../views/customer-info");
const Scope3Settings = () => import("../views/scope3");
const EmissionSettings = () => import("../views/emission");
const EmissionSourceSettings = () => import("../views/emission-sources");


const routes: RoutesTypeNew = [
  {
    path: "/",
    redirect: "/home", // redirect，要重定向的路由路徑
    meta: {
      redirect: true,
    },
  },
  {
    path: "/",
    element: <Layout />,
    meta: {
      title: "主頁面框架",
      needLogin: true
    },
    children: [
      {
        path: "/home",
        component: Home,
        meta: {
          title: "首頁",
          needLogin: true
        }
      },
      {
        path: "/customer-info",
        component: CustomerInfo,
        meta: {
          title: "公司資訊",
          needLogin: true
        }
      },
      {
        path: "/scope3",
        component: Scope3Settings,
        meta: {
          title: "範疇3設定",
          needLogin: true
        }
      },
      {
        path: "/emission",
        component: EmissionSettings,
        meta: {
          title: "區域&排放係數設定",
          needLogin: true
        }
      },
      {
        path: "/emission-sources",
        component: EmissionSourceSettings,
        meta: {
          title: "排放源鑑別設定",
          needLogin: true
        }
      }
    ]
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登入",
      needLogin: false
    },
  },
  {
    path: "/404",
    component: Error404,
    meta: {
      title: "404",
      needLogin: false,
    }
  },
  {
    path: "/403",
    component: Error403,
    meta: {
      title: "403",
      needLogin: false,
    }
  },
  {
    path: "*",
    redirect: "/404",
  }
];

export default routes;