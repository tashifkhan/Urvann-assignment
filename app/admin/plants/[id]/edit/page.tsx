'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlantForm } from '@/components/admin/PlantForm';
import { PlantFormData } from '@/lib/plant-form-schema';
import toast, { Toaster } from 'react-hot-toast';
import { Plant } from '@/types/plant';

interface EditPlantPageProps {
  params: {
    id: string;
  };
}

export default function EditPlantPage({ params }: EditPlantPageProps) {
  const router = useRouter();
  const [plant, setPlant] = useState<Plant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
      return;
    }

    const fetchPlant = async () => {
      const res = await fetch(`/api/plants/${params.id}`);
      if (!res.ok) {
        toast.error('Plant not found');
        router.push('/admin');
        return;
      }
      const data = await res.json();
      // convert createdAt to Date if present
      if (data.createdAt) data.createdAt = new Date(data.createdAt);
      setPlant(data);
      setLoading(false);
    };

    fetchPlant();
  }, [params.id, router]);

  const handleSubmit = (data: PlantFormData) => {
    const updatePlant = async () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('admin_token')
          : null;
      if (!token) return toast.error('Not authenticated');
      const res = await fetch(`/api/plants/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (!res.ok) return toast.error(body?.error || 'Failed to update');
      toast.success('Plant updated successfully!');
      router.push('/admin');
    };

    updatePlant();
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  if (!plant) return <div className="p-8">Plant not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PlantForm
          plant={plant}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
