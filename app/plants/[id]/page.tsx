import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Leaf as Leaf2, Droplets, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Plant } from '@/types/plant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCategoryColor } from '@/lib/categories';
import { formatINR } from '@/lib/format';

interface PlantDetailPageProps {
  params: {
    id: string;
  };
}

export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  let plantRaw: any | null = null;
  try {
    const res = await fetch(`/api/plants/${params.id}`, { cache: 'no-store' });
    if (!res.ok) return notFound();
    plantRaw = await res.json();
  } catch (e) {
    console.error('[plants/[id]/page] fetch error', (e as any)?.message || e);
    return notFound();
  }
  // Normalize fields returned from the API to avoid runtime exceptions
  const plant: Plant = {
    id: plantRaw?.id || String(plantRaw?._id || ''),
    name: plantRaw?.name || '',
    price: Number(plantRaw?.price ?? 0),
    categories: Array.isArray(plantRaw?.categories)
      ? plantRaw.categories
      : plantRaw?.categories
        ? [plantRaw.categories]
        : [],
    stock:
      typeof plantRaw?.stock === 'number'
        ? plantRaw.stock
        : Number(plantRaw?.stock ?? 0),
    imageUrl: plantRaw?.imageUrl || plantRaw?.image || '',
    description: plantRaw?.description || '',
    careTips: plantRaw?.careTips || '',
    createdAt: plantRaw?.createdAt ? new Date(plantRaw.createdAt) : new Date(),
    featured: Boolean(plantRaw?.featured),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plants
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Plant Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-white shadow-lg">
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {plant.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-600">Featured</Badge>
              </div>
            )}
          </div>

          {/* Plant Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {plant.name}
              </h1>
              <p className="text-xl text-green-600 font-semibold mb-4">
                {formatINR(plant.price, { maximumFractionDigits: 2 })}
              </p>

              <div className="flex items-center mb-4">
                <Badge
                  variant={plant.stock > 0 ? 'default' : 'destructive'}
                  className={
                    plant.stock > 0
                      ? 'bg-green-100 text-green-800 border-green-200'
                      : ''
                  }
                >
                  {plant.stock > 0 ? `${plant.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {plant.categories.map(category => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className={getCategoryColor(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">About This Plant</h2>
              <p className="text-gray-700 leading-relaxed">
                {plant.description}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf2 className="h-5 w-5 text-green-600" />
                  Care Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{plant.careTips}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Light Requirements</p>
                <p className="text-xs text-gray-500">Varies by plant</p>
              </Card>
              <Card className="text-center p-4">
                <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Watering</p>
                <p className="text-xs text-gray-500">See care tips</p>
              </Card>
              <Card className="text-center p-4">
                <Leaf2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">Difficulty</p>
                <p className="text-xs text-gray-500">
                  {plant.categories.includes('Low Maintenance')
                    ? 'Easy'
                    : 'Moderate'}
                </p>
              </Card>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Added on{' '}
                {plant.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
