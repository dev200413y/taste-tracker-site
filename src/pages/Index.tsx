import { useState } from "react";
import { Search, MapPin, Clock, Star, ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Vegetables", emoji: "🥬", items: "500+ items" },
    { name: "Fruits", emoji: "🍎", items: "200+ items" },
    { name: "Dairy", emoji: "🥛", items: "150+ items" },
    { name: "Snacks", emoji: "🍿", items: "300+ items" },
    { name: "Beverages", emoji: "🥤", items: "100+ items" },
    { name: "Household", emoji: "🧽", items: "250+ items" },
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
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">QuickMart</h1>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" />
              <span>Delivery in 10 mins</span>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search for groceries, stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background text-foreground"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 mb-6">
          <h2 className="text-3xl font-bold mb-2">Groceries in 10 minutes</h2>
          <p className="text-lg opacity-90">From your local kirana to your doorstep</p>
        </div>

        {/* Categories */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Shop by Category</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.emoji}</div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.items}</p>
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