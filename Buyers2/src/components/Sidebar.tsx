import { Link } from 'react-router-dom';
import { Home, ShoppingBag, School, Info, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface SidebarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export default function Sidebar({ selectedCategories, onCategoryChange }: SidebarProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);

  const categories = [
    'Electronics',
    'Furniture',
    'Smart Home',
    'Wearables',
    'Gaming',
    'Audio',
    'Handmade Crafts',
    'Textiles',
    'Art',
    'Assistive Devices'
  ];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <aside className="w-64 bg-[#1e2875] text-white min-h-screen p-4 flex flex-col" role="navigation" aria-label="Main navigation">
      <nav className="space-y-2">
        <Link 
          to="/" 
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#2a3490] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Home page"
        >
          <Home size={20} aria-hidden="true" />
          <span>Home</span>
        </Link>

        <div className="mt-6">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center justify-between w-full px-4 py-3 rounded hover:bg-[#2a3490] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-expanded={isCategoryOpen}
            aria-label="Product categories menu"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} aria-hidden="true" />
              <span>Product Category</span>
            </div>
            {isCategoryOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
          </button>

          {isCategoryOpen && (
            <div className="mt-2 ml-4 space-y-2" role="group" aria-label="Product categories">
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-2 px-4 py-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                    aria-label={`Filter by ${category}`}
                  />
                  <Label
                    htmlFor={category}
                    className="cursor-pointer text-white hover:text-yellow-400 transition-colors"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Link 
          to="/schools" 
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#2a3490] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Schools and institutions"
        >
          <School size={20} aria-hidden="true" />
          <span>Schools & Institutions</span>
        </Link>

        <Link 
          to="/about" 
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#2a3490] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="About us"
        >
          <Info size={20} aria-hidden="true" />
          <span>About Us</span>
        </Link>

        <Link 
          to="/services" 
          className="flex items-center gap-3 px-4 py-3 rounded hover:bg-[#2a3490] transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Services"
        >
          <Settings size={20} aria-hidden="true" />
          <span>Services</span>
        </Link>
      </nav>
    </aside>
  );
}
