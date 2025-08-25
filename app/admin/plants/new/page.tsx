'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PlantForm } from '@/components/admin/PlantForm';
import { PlantFormData } from '@/lib/plant-form-schema';
import toast, { Toaster } from 'react-hot-toast';

export default function NewPlantPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_token');
    if (!token) router.replace('/admin/login');
  }, [router]);

  const handleSubmit = (data: PlantFormData) => {
    const createPlant = async () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('admin_token')
          : null;
      if (!token) return toast.error('Not authenticated');
      const res = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) return toast.error(body?.error || 'Failed to create');
      toast.success('Plant created successfully!');
      router.push('/admin');
    };

    createPlant();
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PlantForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
