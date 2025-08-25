export interface Plant {
  id: string;
  name: string;
  price: number;
  categories: string[];
  stock: number;
  imageUrl: string;
  description: string;
  careTips: string;
  createdAt: Date;
  featured?: boolean;
}

export type SortOption =
  | 'price-low'
  | 'price-high'
  | 'name-az'
  | 'name-za'
  | 'newest'
  | 'id-asc'
  | 'id-desc';

export interface SearchFilters {
  search: string;
  category: string;
  sortBy: SortOption;
}