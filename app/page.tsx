'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PlantGrid } from '@/components/plants/PlantGrid';
import { PlantPagination } from '@/components/plants/PlantPagination';
import { Plant } from '@/types/plant';
import { SortOption } from '@/types/plant';
import {
  filterPlantsByCategory,
  searchPlants,
  sortPlants,
  paginateResults,
} from '@/lib/plant-utils';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [allPlants, setAllPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      const res = await fetch('/api/plants');
      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {
        // if server returns non-JSON, show toast and continue with empty list
        console.error('Failed to parse /api/plants response', e);
        data = {};
      }
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
      setAllPlants(items);
      setLoading(false);
    };
    fetchPlants();
  }, []);

  const filteredAndSortedPlants = useMemo(() => {
    let plants = allPlants;

    // Apply search filter
    plants = searchPlants(plants, searchTerm);

    // Apply category filter
    plants = filterPlantsByCategory(plants, selectedCategory);

    // Apply sorting
    plants = sortPlants(plants, sortBy);

    return plants;
  }, [searchTerm, selectedCategory, sortBy, allPlants]);

  const paginatedResults = useMemo(() => {
    return paginateResults(filteredAndSortedPlants, currentPage, 12);
  }, [filteredAndSortedPlants, currentPage]);

  // Reset to page 1 when filters change
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Our Plant Collection
            </h1>
            <p className="text-lg text-gray-600">
              Discover beautiful plants to transform your space
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {loading ? (
                <span>Loading plants…</span>
              ) : (
                <span>
                  Showing {paginatedResults.items.length} of{' '}
                  {paginatedResults.totalItems} plants
                </span>
              )}
            </div>
          </div>

          <PlantGrid plants={paginatedResults.items} loading={loading} />

          <PlantPagination
            currentPage={currentPage}
            totalPages={paginatedResults.totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}
