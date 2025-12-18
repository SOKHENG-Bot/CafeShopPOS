import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenManager } from '@/features/auth'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    if (!tokenManager.getToken()) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/"!</div>
}
