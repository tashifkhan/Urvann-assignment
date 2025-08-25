import { Plant, SortOption } from '@/types/plant';

export const filterPlantsByCategory = (plants: Plant[], category: string): Plant[] => {
  if (!category || category === 'all') return plants;
  return plants.filter(plant => 
    plant.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  );
};

export const searchPlants = (plants: Plant[], searchTerm: string): Plant[] => {
  if (!searchTerm.trim()) return plants;
  
  const term = searchTerm.toLowerCase();
  return plants.filter(plant =>
    plant.name.toLowerCase().includes(term) ||
    plant.description.toLowerCase().includes(term) ||
    plant.categories.some(cat => cat.toLowerCase().includes(term))
  );
};

export const sortPlants = (plants: Plant[], sortBy: SortOption): Plant[] => {
  const sorted = [...plants];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-az':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-za':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    default:
      return sorted;
  }
};

export const paginateResults = <T>(items: T[], page: number, itemsPerPage: number = 12) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage: page,
    totalItems: items.length,
    hasNextPage: endIndex < items.length,
    hasPrevPage: page > 1,
  };
};