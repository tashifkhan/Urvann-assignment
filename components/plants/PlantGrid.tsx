import { Plant } from '@/types/plant';
import { PlantCard } from './PlantCard';
import { PlantCardSkeleton } from './PlantCardSkeleton';

interface PlantGridProps {
  plants: Plant[];
  loading?: boolean;
}

export function PlantGrid({ plants, loading = false }: PlantGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <PlantCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-6xl mb-4">🌱</div>
        <h3 className="text-lg font-semibold mb-2">No plants found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {plants.map(plant => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </div>
  );
}