/** __root.tsx - Root Route Layout **/

import { AppProviders } from '@/app/providers';
import { createRootRoute, Outlet } from '@tanstack/react-router';

const RootComponent = () => (
  <AppProviders>
    <Outlet />
  </AppProviders>
);

export const Route = createRootRoute({
  component: RootComponent,
});
