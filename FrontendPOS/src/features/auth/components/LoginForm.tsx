/** LoginForm.tsx - Login Form Component **/

import { useState } from 'react';
import { useLogin } from '@/features/auth';
import { Lock, LogIn, User } from 'lucide-react';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: loginForm, isPending, error } = useLogin();

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    loginForm({ username, password });
  };

  return (
    <div className="min-h-screen bg-[#1d224f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#3d416d] rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#fac604] mb-2">
              Welcome Back
            </h1>
            <p className="text-white">Sign in to access your POS dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-white" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setUsername(event.target.value)}
                  className="w-full text-white pl-10 pr-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-white" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>
                  ): void => setPassword(event.target.value)}
                  className="w-full pl-10 text-white pr-4 py-3 border border-gray-300 rounded-lg transition-colors"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                <span className="font-medium">Login failed.</span> Please check
                your credentials and try again.
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#6974e1] text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
