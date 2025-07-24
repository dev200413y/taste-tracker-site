import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Star, ShoppingCart, Plus, User, ChevronDown, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

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
      textColor: "text-white"
    },
    {
      id: 2,
      title: "Baby Care at your doorstep!",
      subtitle: "Diapers, baby food, toys & more",
      buttonText: "Order Now",
      bgColor: "bg-gradient-to-br from-pink-400 to-rose-500",
      textColor: "text-white"
    },
    {
      id: 3,
      title: "Festive Corner",
      subtitle: "Decorations, gifts, sweets & more",
      buttonText: "Shop Now",
      bgColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      textColor: "text-white"
    },
    {
      id: 4,
      title: "Cleaning Essentials",
      subtitle: "Floor cleaners, disinfectants & more",
      buttonText: "Order Now",
      bgColor: "bg-gradient-to-br from-teal-400 to-green-500",
      textColor: "text-white"
    }
  ];

  const stores = [
    {
      id: 1,
      name: "Fresh Mart Grocery",
      rating: 4.3,
      deliveryTime: "12-15 mins",
      distance: "0.5 km",
      type: "Grocery Store",
      image: "🏪",
      discount: "20% OFF",
      items: ["Vegetables", "Fruits", "Dairy", "Snacks"]
    },
    {
      id: 2,
      name: "Sharma Kirana Store",
      rating: 4.1,
      deliveryTime: "8-12 mins",
      distance: "0.3 km",
      type: "Kirana Store",
      image: "🏬",
      discount: "15% OFF",
      items: ["Grocery", "Household", "Personal Care"]
    },
    {
      id: 3,
      name: "Green Valley Organic",
      rating: 4.5,
      deliveryTime: "15-20 mins",
      distance: "1.2 km",
      type: "Organic Store",
      image: "🌱",
      discount: "10% OFF",
      items: ["Organic", "Fresh Produce", "Health"]
    }
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
              
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              
              <Button variant="outline" size="sm">
                <Store className="w-4 h-4 mr-2" />
                Become a Seller
              </Button>
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
            <Card key={card.id} className={`${card.bgColor} ${card.textColor} hover:scale-105 transition-transform cursor-pointer overflow-hidden`}>
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

        {/* Stores Near You */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Stores Near You</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Card key={store.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{store.image}</div>
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {store.discount}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{store.name}</CardTitle>
                  <CardDescription>{store.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{store.deliveryTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{store.distance}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {store.items.map((item) => (
                      <span key={item} className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Browse Store
                  </Button>
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