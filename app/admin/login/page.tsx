'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLogin() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_token');
    if (token) router.replace('/admin');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        // non-JSON or empty response
        data = null;
      }
      if (!res.ok)
        throw new Error(data?.error || res.statusText || 'Login failed');
      localStorage.setItem('admin_token', data.token);
      toast.success('Logged in');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <div className="mb-4">
          <label className="block text-sm mb-1">User ID</label>
          <Input value={id} onChange={e => setId(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>
      </form>
      <Toaster position="bottom-right" />
    </div>
  );
}
