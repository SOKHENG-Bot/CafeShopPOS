/** Login Page Route (/login) **/

import { LoginForm } from '@/features/auth/components/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

const LoginPage = () => {
  return <LoginForm />;
};

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
