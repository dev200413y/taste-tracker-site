import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MapPin, Clock, Star, ShoppingCart, Plus, Minus, User, ChevronDown, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import Cart from "@/components/Cart";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  discount?: string;
  rating?: number;
  inStock: boolean;
  brand?: string;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, removeFromCart, items } = useCart();

  const categoryData: {[key: string]: {title: string, emoji: string, products: Product[]}} = {
    "paan-corner": {
      title: "Paan Corner",
      emoji: "🍃",
      products: [
        { id: 1, name: "Meetha Paan", price: 15, unit: "1 piece", image: "🍃", inStock: true, rating: 4.2 },
        { id: 2, name: "Banarasi Paan", price: 25, originalPrice: 30, unit: "1 piece", image: "🍃", discount: "17% OFF", inStock: true, rating: 4.5 },
        { id: 3, name: "Chocolate Paan", price: 20, unit: "1 piece", image: "🍃", inStock: true, rating: 4.0 },
        { id: 4, name: "Ice Paan", price: 18, unit: "1 piece", image: "🍃", inStock: false, rating: 4.3 },
        { id: 5, name: "Gulkand Paan", price: 22, unit: "1 piece", image: "🍃", inStock: true, rating: 4.1 },
        { id: 6, name: "Zarda Paan", price: 35, originalPrice: 40, unit: "1 piece", image: "🍃", discount: "12% OFF", inStock: true, rating: 4.4 }
      ]
    },
    "dairy-bread-eggs": {
      title: "Dairy, Bread & Eggs",
      emoji: "🥛",
      products: [
        { id: 7, name: "Amul Fresh Milk", price: 28, unit: "500ml", image: "🥛", inStock: true, rating: 4.3, brand: "Amul" },
        { id: 8, name: "Brown Bread", price: 35, unit: "400g", image: "🍞", inStock: true, rating: 4.1, brand: "Harvest Gold" },
        { id: 9, name: "Farm Fresh Eggs", price: 72, unit: "12 pieces", image: "🥚", inStock: true, rating: 4.5 },
        { id: 10, name: "Paneer", price: 90, originalPrice: 100, unit: "200g", image: "🧀", discount: "10% OFF", inStock: true, rating: 4.2, brand: "Mother Dairy" },
        { id: 11, name: "Greek Yogurt", price: 45, unit: "200g", image: "🥛", inStock: true, rating: 4.4, brand: "Epigamia" },
        { id: 12, name: "Butter", price: 55, unit: "100g", image: "🧈", inStock: true, rating: 4.0, brand: "Amul" }
      ]
    },
    "fruits-vegetables": {
      title: "Fruits & Vegetables",
      emoji: "🥬",
      products: [
        { id: 13, name: "Fresh Bananas", price: 40, unit: "1kg", image: "🍌", inStock: true, rating: 4.2 },
        { id: 14, name: "Red Apples", price: 120, originalPrice: 140, unit: "1kg", image: "🍎", discount: "14% OFF", inStock: true, rating: 4.4 },
        { id: 15, name: "Fresh Spinach", price: 25, unit: "250g", image: "🥬", inStock: true, rating: 4.1 },
        { id: 16, name: "Tomatoes", price: 35, unit: "500g", image: "🍅", inStock: true, rating: 4.0 },
        { id: 17, name: "Carrots", price: 30, unit: "500g", image: "🥕", inStock: true, rating: 4.3 },
        { id: 18, name: "Green Capsicum", price: 45, unit: "250g", image: "🫑", inStock: false, rating: 4.2 }
      ]
    },
    "baby-care": {
      title: "Baby Care",
      emoji: "👶",
      products: [
        { id: 19, name: "Pampers Diapers", price: 899, originalPrice: 999, unit: "72 pieces", image: "👶", discount: "10% OFF", inStock: true, rating: 4.5, brand: "Pampers" },
        { id: 20, name: "Johnson's Baby Oil", price: 145, unit: "200ml", image: "🍼", inStock: true, rating: 4.3, brand: "Johnson's" },
        { id: 21, name: "Cerelac", price: 285, unit: "300g", image: "🥣", inStock: true, rating: 4.4, brand: "Nestle" },
        { id: 22, name: "Baby Wipes", price: 99, unit: "80 pieces", image: "🧻", inStock: true, rating: 4.2, brand: "Huggies" },
        { id: 23, name: "Baby Powder", price: 89, unit: "100g", image: "🍼", inStock: true, rating: 4.1, brand: "Johnson's" },
        { id: 24, name: "Baby Shampoo", price: 125, unit: "200ml", image: "🧴", inStock: false, rating: 4.3, brand: "Sebamed" }
      ]
    },
    "personal-care": {
      title: "Personal Care",
      emoji: "🧴",
      products: [
        { id: 25, name: "Head & Shoulders Shampoo", price: 175, unit: "340ml", image: "🧴", inStock: true, rating: 4.2, brand: "Head & Shoulders" },
        { id: 26, name: "Colgate Toothpaste", price: 45, originalPrice: 50, unit: "100g", image: "🦷", discount: "10% OFF", inStock: true, rating: 4.4, brand: "Colgate" },
        { id: 27, name: "Dove Soap", price: 35, unit: "75g", image: "🧼", inStock: true, rating: 4.3, brand: "Dove" },
        { id: 28, name: "Gillette Razor", price: 285, unit: "1 piece", image: "🪒", inStock: true, rating: 4.1, brand: "Gillette" },
        { id: 29, name: "Nivea Body Lotion", price: 199, unit: "200ml", image: "🧴", inStock: true, rating: 4.0, brand: "Nivea" },
        { id: 30, name: "Dettol Hand Wash", price: 65, unit: "200ml", image: "🧼", inStock: true, rating: 4.5, brand: "Dettol" }
      ]
    },
    "cleaning-essential": {
      title: "Cleaning Essential",
      emoji: "🧽",
      products: [
        { id: 31, name: "Harpic Toilet Cleaner", price: 89, unit: "500ml", image: "🧽", inStock: true, rating: 4.3, brand: "Harpic" },
        { id: 32, name: "Vim Dishwash", price: 45, originalPrice: 50, unit: "250ml", image: "🧽", discount: "10% OFF", inStock: true, rating: 4.2, brand: "Vim" },
        { id: 33, name: "Colin Glass Cleaner", price: 75, unit: "250ml", image: "🧽", inStock: true, rating: 4.1, brand: "Colin" },
        { id: 34, name: "Surf Excel", price: 125, unit: "500g", image: "🧺", inStock: true, rating: 4.4, brand: "Surf Excel" },
        { id: 35, name: "Lizol Floor Cleaner", price: 99, unit: "500ml", image: "🧽", inStock: false, rating: 4.0, brand: "Lizol" },
        { id: 36, name: "Scotch Brite Scrubber", price: 25, unit: "1 piece", image: "🧽", inStock: true, rating: 4.2, brand: "3M" }
      ]
    }
  };

  const currentCategory = categoryData[categoryName || ""];
  
  if (!currentCategory) {
    return <div>Category not found</div>;
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      brand: product.brand
    });
  };

  const getCartQuantity = (productId: number) => {
    const cartItem = items.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredProducts = currentCategory.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary">QuickMart</h1>
            </div>

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

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
              
              <Button variant="outline" size="sm">
                <Store className="w-4 h-4 mr-2" />
                Become a Seller
              </Button>
              
              <Cart />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4">
        {/* Category Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">{currentCategory.emoji}</div>
          <div>
            <h1 className="text-3xl font-bold">{currentCategory.title}</h1>
            <p className="text-muted-foreground">{filteredProducts.length} products available</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="text-4xl mb-3 text-center">{product.image}</div>
                
                {product.discount && (
                  <Badge variant="destructive" className="mb-2 text-xs">
                    {product.discount}
                  </Badge>
                )}
                
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                
                {product.brand && (
                  <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                )}
                
                <p className="text-xs text-muted-foreground mb-2">{product.unit}</p>
                
                {product.rating && (
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{product.rating}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-sm">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through ml-1">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {!product.inStock ? (
                  <Button disabled className="w-full" size="sm">
                    Out of Stock
                  </Button>
                ) : getCartQuantity(product.id) > 0 ? (
                  <div className="flex items-center justify-between border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium">{getCartQuantity(product.id)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full" 
                    size="sm"
                  >
                    Add
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;