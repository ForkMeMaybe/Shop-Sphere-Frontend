import { useState, useEffect } from "react";
import { ChevronDown, X, Filter, SlidersHorizontal } from "lucide-react";
import { fetchCollections } from "../api";

const ProductFilters = ({ onFilterChange, filters, clearFilters }) => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  
  // Sort options
  const sortOptions = [
    { value: "", label: "Default" },
    { value: "unit_price", label: "Price: Low to High" },
    { value: "-unit_price", label: "Price: High to Low" },
    { value: "last_update", label: "Oldest First" },
    { value: "-last_update", label: "Newest First" },
  ];

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const collectionsData = await fetchCollections();
        // console.log("Collections data:", collectionsData);
        setCollections(collectionsData);
      } catch (error) {
        console.error("Error loading collections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCollections();
  }, []);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    Object.entries(tempFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Mobile filter toggle */}
      <div className="lg:hidden py-4 px-6 flex justify-between items-center border-b border-gray-100">
        <h3 className="text-lg font-medium text-gray-800">Filters</h3>
        <button 
          onClick={toggleFilters}
          className="flex items-center gap-2 text-indigo-600"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{isFilterOpen ? "Hide Filters" : "Show Filters"}</span>
        </button>
      </div>

      {/* Filter content - hidden on mobile unless toggled */}
      <div className={`${isFilterOpen ? "block" : "hidden"} lg:block p-6 space-y-6`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:flex-wrap gap-6">
          {/* Collection Filter */}
          <div className="w-full lg:w-auto">
            <label htmlFor="collection" className="block text-sm font-medium text-gray-700 mb-1">
              Collection
            </label>
            <div className="relative">
              <select
                id="collection"
                name="collectionId"
                value={tempFilters.collectionId || ""}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-8 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none"
                disabled={isLoading}
              >
                <option value="">All Collections</option>
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Min Price
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                min="0"
                placeholder="Min ₹"
                value={tempFilters.minPrice || ""}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Max Price
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                min="0"
                placeholder="Max ₹"
                value={tempFilters.maxPrice || ""}
                onChange={handleInputChange}
                className="block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="w-full lg:w-auto">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                id="sortBy"
                name="sortBy"
                value={tempFilters.sortBy || ""}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-8 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="w-full lg:w-auto self-end flex gap-2">
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.collectionId && collections.find(c => c.id.toString() === filters.collectionId.toString()) && (
            <div className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm flex items-center gap-1">
              Collection: {collections.find(c => c.id.toString() === filters.collectionId.toString()).title}
              <X 
                className="w-4 h-4 cursor-pointer" 
                onClick={() => onFilterChange('collectionId', '')}
              />
            </div>
          )}
          {filters.minPrice && (
            <div className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm flex items-center gap-1">
              Min Price: ₹{filters.minPrice}
              <X 
                className="w-4 h-4 cursor-pointer" 
                onClick={() => onFilterChange('minPrice', '')}
              />
            </div>
          )}
          {filters.maxPrice && (
            <div className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm flex items-center gap-1">
              Max Price: ₹{filters.maxPrice}
              <X 
                className="w-4 h-4 cursor-pointer" 
                onClick={() => onFilterChange('maxPrice', '')}
              />
            </div>
          )}
          {filters.sortBy && (
            <div className="bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full text-sm flex items-center gap-1">
              Sort: {sortOptions.find(o => o.value === filters.sortBy).label}
              <X 
                className="w-4 h-4 cursor-pointer" 
                onClick={() => onFilterChange('sortBy', '')}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
