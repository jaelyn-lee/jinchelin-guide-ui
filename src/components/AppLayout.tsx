import { Outlet } from 'react-router-dom'
import { TabBar } from './TabBar'

export function AppLayout() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  )
}