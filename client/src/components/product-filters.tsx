import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "skin-care", name: "Skin Care" },
  { id: "hair-care", name: "Hair Care" },
  { id: "makeup", name: "Makeup" },
  { id: "fragrance", name: "Fragrance" },
  { id: "sunscreen", name: "Sunscreen" },
  { id: "baby", name: "Baby Care" },
  { id: "vitamins", name: "Vitamins" },
  { id: "medicines", name: "Medicines" },
];

const brands = [
  { id: "cetaphil", name: "Cetaphil" },
  { id: "cerave", name: "CeraVe" },
  { id: "the-ordinary", name: "The Ordinary" },
  { id: "loreal", name: "L'Oreal" },
  { id: "jenpharm", name: "Jenpharm" },
  { id: "dove", name: "Dove" },
];

interface ProductFiltersProps {
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
  onClear: () => void;
}

function FilterContent({
  selectedCategories,
  selectedBrands,
  priceRange,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClear,
}: ProductFiltersProps) {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);

  const hasFilters = selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000;

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const toggleBrand = (brandId: string) => {
    if (selectedBrands.includes(brandId)) {
      onBrandChange(selectedBrands.filter((b) => b !== brandId));
    } else {
      onBrandChange([...selectedBrands, brandId]);
    }
  };

  return (
    <div className="space-y-4">
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="w-full justify-start" data-testid="button-clear-filters">
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}

      <Collapsible open={categoryOpen} onOpenChange={setCategoryOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Categories
          <ChevronDown className={`w-4 h-4 transition-transform ${categoryOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                data-testid={`filter-category-${category.id}`}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={brandOpen} onOpenChange={setBrandOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Brands
          <ChevronDown className={`w-4 h-4 transition-transform ${brandOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 pt-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrands.includes(brand.id)}
                onCheckedChange={() => toggleBrand(brand.id)}
                data-testid={`filter-brand-${brand.id}`}
              />
              <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium">
          Price Range
          <ChevronDown className={`w-4 h-4 transition-transform ${priceOpen ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 px-1">
          <Slider
            value={priceRange}
            min={0}
            max={50000}
            step={500}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="mb-4"
            data-testid="filter-price-slider"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Rs.{priceRange[0].toLocaleString()}</span>
            <span>Rs.{priceRange[1].toLocaleString()}</span>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  const activeFiltersCount = props.selectedCategories.length + props.selectedBrands.length + 
    (props.priceRange[0] > 0 || props.priceRange[1] < 50000 ? 1 : 0);

  return (
    <>
      <Card className="hidden lg:block sticky top-24">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FilterContent {...props} />
        </CardContent>
      </Card>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden" data-testid="button-mobile-filters">
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
