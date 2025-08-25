'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Plant } from '@/types/plant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getCategoryColor } from '@/lib/categories';
import { formatINR } from '@/lib/format';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  const [plants, setPlants] = useState<Plant[]>([]);

  useEffect(() => {
    const fetchPlants = async () => {
      const res = await fetch('/api/plants');
      const data = await res.json();
      const items = (data.items || []).map((it: any) => ({
        id: it.id || (it._id ? String(it._id) : ''),
        name: it.name || '',
        price: Number(it.price || 0),
        categories: Array.isArray(it.categories)
          ? it.categories
          : it.categories
            ? [it.categories]
            : [],
        stock: typeof it.stock === 'number' ? it.stock : Number(it.stock || 0),
        imageUrl: it.imageUrl || it.image || '',
        description: it.description || '',
        careTips: it.careTips || '',
        createdAt: it.createdAt ? new Date(it.createdAt) : new Date(),
        featured: Boolean(it.featured),
      }));
      setPlants(items);
    };
    fetchPlants();
  }, []);

  const handleDeletePlant = async (plantId: string) => {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('admin_token')
        : null;
    if (!token) return toast.error('Not authenticated');
    const res = await fetch(`/api/plants/${plantId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return toast.error('Failed to delete');
    setPlants(plants.filter(plant => plant.id !== plantId));
    toast.success('Plant deleted successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Store
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                Plant Management
              </h1>
              <p className="text-gray-600 mt-2">Manage your plant inventory</p>
            </div>
            <Link href="/admin/plants/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Plant
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plants.map(plant => (
                <TableRow key={plant.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/plants/${plant.id}`}
                      className="hover:text-green-600 transition-colors"
                    >
                      {plant.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {formatINR(plant.price, { maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {plant.categories.slice(0, 2).map(category => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className={`text-xs ${getCategoryColor(category)}`}
                        >
                          {category}
                        </Badge>
                      ))}
                      {plant.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{plant.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{plant.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={plant.stock > 0 ? 'default' : 'destructive'}
                      className={
                        plant.stock > 0
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : ''
                      }
                    >
                      {plant.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/plants/${plant.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Plant</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{plant.name}"?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePlant(plant.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {plants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-semibold mb-2">No plants found</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first plant
            </p>
            <Link href="/admin/plants/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Plant
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
