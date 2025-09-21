import { useMemo } from 'react'
import { useRoutes } from 'react-router-dom'
import Fn from './fn'
import type { RouterWaiterPropsType } from '@/RouterWaiter/types'

function RouterWaiter(
  {
    routes,
    onRouteBefore,
    loading,
  }: RouterWaiterPropsType
) {
  const fn = useMemo(() => new Fn({
    routes,
    onRouteBefore,
    loading,
  }), [routes, onRouteBefore, loading])
  const reactRoutes = fn.transformRoutes()
  const elements = useRoutes(reactRoutes)

  return elements
}

export default RouterWaiter
