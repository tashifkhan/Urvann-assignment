import Image from 'next/image';
import Link from 'next/link';
import { Plant } from '@/types/plant';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { getCategoryColor } from '@/lib/categories';

interface PlantCardProps {
  plant: Plant;
}

export function PlantCard({ plant }: PlantCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link href={`/plants/${plant.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={plant.imageUrl}
            alt={plant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {plant.featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="bg-green-600">
                Featured
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2">
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
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-green-600 transition-colors">
            {plant.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {plant.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
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
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex justify-between items-center w-full">
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(plant.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {plant.createdAt.toLocaleDateString()}
            </span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
