'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PLANT_CATEGORIES } from '@/lib/categories';
import { SortOption } from '@/types/plant';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showCount: number;
  onShowChange: (n: number) => void;
}

export function Header({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showCount,
  onShowChange,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold text-green-800">Urvann</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {PLANT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value: SortOption) => onSortChange(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name-az">Name A-Z</SelectItem>
                <SelectItem value="name-za">Name Z-A</SelectItem>
                <SelectItem value="price-low">Price Low</SelectItem>
                <SelectItem value="price-high">Price High</SelectItem>
                <SelectItem value="id-asc">ID Asc</SelectItem>
                <SelectItem value="id-desc">ID Desc</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={String(showCount)}
              onValueChange={v => onShowChange(Number(v))}
            >
              <SelectTrigger className="w-[92px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Show 6</SelectItem>
                <SelectItem value="12">Show 12</SelectItem>
                <SelectItem value="24">Show 24</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/admin">Admin</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plants..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex space-x-2">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {PLANT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: SortOption) => onSortChange(value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name-az">Name A-Z</SelectItem>
                  <SelectItem value="name-za">Name Z-A</SelectItem>
                  <SelectItem value="price-low">Price Low</SelectItem>
                  <SelectItem value="price-high">Price High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" variant="outline" asChild>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
