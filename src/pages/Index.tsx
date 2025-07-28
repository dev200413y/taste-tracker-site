import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Star, ShoppingCart, Plus, User, ChevronDown, Store, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import Cart from "@/components/Cart";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
  };

  const categories = [
    { name: "Paan Corner", emoji: "🍃", items: "50+ items", color: "bg-green-500", slug: "paan-corner" },
    { name: "Dairy, Bread & Eggs", emoji: "🥛", items: "200+ items", color: "bg-blue-500", slug: "dairy-bread-eggs" },
    { name: "Fruits & Vegetables", emoji: "🥬", items: "500+ items", color: "bg-green-600", slug: "fruits-vegetables" },
    { name: "Cold Drinks & Juices", emoji: "🥤", items: "150+ items", color: "bg-orange-500", slug: "cold-drinks-juices" },
    { name: "Snacks & Munchies", emoji: "🍿", items: "300+ items", color: "bg-yellow-500", slug: "snacks-munchies" },
    { name: "Breakfast & Instant Food", emoji: "🥣", items: "180+ items", color: "bg-red-500", slug: "breakfast-instant" },
    { name: "Detergent & Laundry", emoji: "🧺", items: "120+ items", color: "bg-blue-600", slug: "detergent-laundry" },
    { name: "Bakery & Biscuits", emoji: "🍪", items: "140+ items", color: "bg-amber-500", slug: "bakery-biscuits" },
    { name: "Baby Care", emoji: "👶", items: "90+ items", color: "bg-pink-400", slug: "baby-care" },
    { name: "Atta, Rice & Dal", emoji: "🌾", items: "100+ items", color: "bg-yellow-600", slug: "atta-rice-dal" },
    { name: "Festive Corner", emoji: "🎉", items: "80+ items", color: "bg-purple-500", slug: "festive-corner" },
    { name: "Personal Care", emoji: "🧴", items: "200+ items", color: "bg-indigo-500", slug: "personal-care" },
    { name: "Cleaning Essential", emoji: "🧽", items: "150+ items", color: "bg-teal-500", slug: "cleaning-essential" },
  ];

  const promoCards = [
    {
      id: 1,
      title: "Paan corner",
      subtitle: "Your favourite paan shop is now online",
      buttonText: "Shop Now",
      bgColor: "bg-gradient-fresh",
      textColor: "text-white",
      categorySlug: "paan-corner"
    },
    {
      id: 2,
      title: "Baby Care at your doorstep!",
      subtitle: "Diapers, baby food, toys & more",
      buttonText: "Order Now",
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
      textColor: "text-white",
      categorySlug: "baby-care"
    },
    {
      id: 3,
      title: "Personal Care Essentials",
      subtitle: "Shampoo, soap, toothpaste & more",
      buttonText: "Shop Now",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      textColor: "text-white",
      categorySlug: "personal-care"
    },
    {
      id: 4,
      title: "Cleaning Essentials",
      subtitle: "Floor cleaners, disinfectants & more",
      buttonText: "Order Now",
      bgColor: "bg-gradient-to-br from-teal-400 to-green-500",
      textColor: "text-white",
      categorySlug: "cleaning-essential"
    }
  ];

  const stores = [
    // Removed stores section as requested
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">QuickMart</h1>
            </div>

            {/* Center Section - Delivery Info */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 text-primary" />
                <span>Delivery in 9 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-muted px-3 py-2 rounded-md cursor-pointer hover:bg-muted/80">
                <MapPin className="w-4 h-4" />
                <span>PC3R+2M7, 5 Number Bhatta Road</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Right Section - Search, Login, Seller Portal */}
            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search 'chocolate'"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/seller")}
                className="flex items-center gap-2"
              >
                <Store className="w-4 h-4" />
                Seller Portal
              </Button>
              
              <Cart />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search 'chocolate'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {/* Promotional Banners */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {promoCards.map((card) => (
            <Card 
              key={card.id} 
              className={`${card.bgColor} ${card.textColor} hover:scale-105 transition-transform cursor-pointer overflow-hidden`}
              onClick={() => navigate(`/category/${card.categorySlug}`)}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm opacity-90 mb-4">{card.subtitle}</p>
                <Button variant="secondary" size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.name} 
                className="hover:shadow-md transition-all hover:scale-105 cursor-pointer border-0 shadow-sm"
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-3">{category.emoji}</div>
                  <h4 className="font-medium text-sm mb-1 leading-tight">{category.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {category.items}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;