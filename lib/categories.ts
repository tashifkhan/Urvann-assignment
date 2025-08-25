export const PLANT_CATEGORIES = [
  'Indoor',
  'Outdoor', 
  'Succulent',
  'Air Purifying',
  'Home Decor',
  'Flowering',
  'Low Maintenance',
  'Tropical',
  'Herbs',
  'Cacti'
] as const;

export type PlantCategory = typeof PLANT_CATEGORIES[number];

export const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Indoor': 'bg-green-100 text-green-800',
    'Outdoor': 'bg-blue-100 text-blue-800',
    'Succulent': 'bg-purple-100 text-purple-800',
    'Air Purifying': 'bg-teal-100 text-teal-800',
    'Home Decor': 'bg-pink-100 text-pink-800',
    'Flowering': 'bg-rose-100 text-rose-800',
    'Low Maintenance': 'bg-amber-100 text-amber-800',
    'Tropical': 'bg-emerald-100 text-emerald-800',
    'Herbs': 'bg-lime-100 text-lime-800',
    'Cacti': 'bg-orange-100 text-orange-800',
  };
  return colorMap[category] || 'bg-gray-100 text-gray-800';
};