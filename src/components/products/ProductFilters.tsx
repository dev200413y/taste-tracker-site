import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setFilters, clearFilters } from '@/store/slices/productSlice';
import type { ProductFilter } from '@/types';

interface ProductFiltersProps {
  className?: string;
}

export const ProductFilters = ({ className }: ProductFiltersProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.products.filters);
  const categories = useAppSelector(state => state.products.categories);
  
  const [priceRange, setPriceRange] = useState([
    filters.minPrice || 0,
    filters.maxPrice || 1000
  ]);

  const brands = [
    'Amul', 'Nestle', 'Britannia', 'Parle', 'ITC', 'Hindustan Unilever',
    'Dabur', 'Patanjali', 'Tata', 'Godrej', 'Marico', 'Emami'
  ];

  const handleFilterChange = (key: keyof ProductFilter, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
    dispatch(setFilters({ 
      minPrice: value[0], 
      maxPrice: value[1] 
    }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPriceRange([0, 1000]);
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length - 4; // Exclude page, limit, sortBy, sortOrder

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-medium">Categories</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category === category.id}
                  onCheckedChange={(checked) =>
                    handleFilterChange('category', checked ? category.id : undefined)
                  }
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Price Range */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-medium">Price Range</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-3">
            <Slider
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Brands */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-medium">Brands</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brand === brand}
                  onCheckedChange={(checked) =>
                    handleFilterChange('brand', checked ? brand : undefined)
                  }
                />
                <Label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {brand}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Rating */}
        <Collapsible>
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="font-medium">Rating</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) =>
                    handleFilterChange('rating', checked ? rating : undefined)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="text-sm font-normal cursor-pointer flex items-center space-x-1"
                >
                  <span>{rating}+ Stars</span>
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* Availability */}
        <div className="space-y-2">
          <h3 className="font-medium">Availability</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={filters.inStock === true}
              onCheckedChange={(checked) =>
                handleFilterChange('inStock', checked ? true : undefined)
              }
            />
            <Label htmlFor="in-stock" className="text-sm font-normal cursor-pointer">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured === true}
              onCheckedChange={(checked) =>
                handleFilterChange('featured', checked ? true : undefined)
              }
            />
            <Label htmlFor="featured" className="text-sm font-normal cursor-pointer">
              Featured Products
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};