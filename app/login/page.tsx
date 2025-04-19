'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Login failed');
    } else {
      // Role-based redirection
      if (data.user.role === 'STUDENT') {
        router.push('/student');
      } else if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else if (data.user.role === 'STAFF') {
        router.push('/staff');
      } else {
        router.push('/');
      }
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="pt-24 flex min-h-screen">
        {/* Left Side Content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
          <div className="p-12">
            <h2 className="text-4xl font-bold text-[#2E3192] mb-4">
              Welcome to SmecLabs
            </h2>
            <p className="text-[#606060] text-lg">
              Discover a wide range of courses, paths, and resources tailored to help you succeed.
              Enhance your skills and join our community of passionate learners.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex w-full lg:w-1/2 items-center justify-center px-4">
          <div className="p-8 rounded-lg shadow-2xl w-full max-w-md">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#2E3192] mb-2">Welcome Back</h1>
              <p className="text-[#606060]">Please sign in to continue</p>
            </div>

            {/* Display error if present */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[#606060] text-sm font-semibold mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#606060] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D] focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-[#606060] text-sm font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-[#606060] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A99D] focus:border-transparent transition-colors"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-[#0071BC] focus:ring-[#0071BC]" />
                  <label className="ml-2 text-sm text-[#606060]">Remember me</label>
                </div>
                <a href="#" className="text-sm text-[#00A99D] hover:text-[#0071BC]">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A99D] text-white py-2 rounded-lg hover:bg-[#0071BC] transition-colors font-semibold"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#606060]">
                Don&apos;t have an account?{' '}
                <a href="#" className="text-[#0071BC] hover:text-[#2E3192] font-semibold">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
