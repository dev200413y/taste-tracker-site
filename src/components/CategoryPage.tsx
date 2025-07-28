import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MapPin, Clock, Star, Plus, Minus, User, ChevronDown, Store, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
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
  subcategory: string;
}

interface Subcategory {
  name: string;
  emoji: string;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const { addToCart, removeFromCart, items } = useCart();
  
  // Convert category slug to category name for API
  const categoryMap: {[key: string]: string} = {
    "paan-corner": "Paan Corner",
    "dairy-bread-eggs": "Dairy, Bread & Eggs", 
    "fruits-vegetables": "Fruits & Vegetables",
    "cold-drinks-juices": "Cold Drinks & Juices",
    "snacks-munchies": "Snacks & Munchies",
    "breakfast-instant": "Breakfast & Instant Food",
    "detergent-laundry": "Detergent & Laundry",
    "bakery-biscuits": "Bakery & Biscuits",
    "baby-care": "Baby Care",
    "atta-rice-dal": "Atta, Rice & Dal",
    "festive-corner": "Festive Corner", 
    "personal-care": "Personal Care",
    "cleaning-essential": "Cleaning Essential"
  };
  
  const categoryForAPI = categoryMap[categoryName || ""] || categoryName;
  const { products, loading } = useProducts(categoryForAPI);

  const handleSignOut = async () => {
    await signOut();
  };

  const categoryData: {[key: string]: {title: string, emoji: string, subcategories: Subcategory[], products: Product[]}} = {
    "paan-corner": {
      title: "Paan Corner",
      emoji: "🍃",
      subcategories: [
        { name: "Traditional Paan", emoji: "🍃" },
        { name: "Modern Flavors", emoji: "🎨" },
        { name: "Special Varieties", emoji: "⭐" }
      ],
      products: [
        { id: 1, name: "Meetha Paan", price: 15, unit: "1 piece", image: "🍃", inStock: true, rating: 4.2, subcategory: "Traditional Paan" },
        { id: 2, name: "Banarasi Paan", price: 25, originalPrice: 30, unit: "1 piece", image: "🍃", discount: "17% OFF", inStock: true, rating: 4.5, subcategory: "Traditional Paan" },
        { id: 3, name: "Chocolate Paan", price: 20, unit: "1 piece", image: "🍃", inStock: true, rating: 4.0, subcategory: "Modern Flavors" },
        { id: 4, name: "Ice Paan", price: 18, unit: "1 piece", image: "🍃", inStock: false, rating: 4.3, subcategory: "Modern Flavors" },
        { id: 5, name: "Gulkand Paan", price: 22, unit: "1 piece", image: "🍃", inStock: true, rating: 4.1, subcategory: "Special Varieties" },
        { id: 6, name: "Zarda Paan", price: 35, originalPrice: 40, unit: "1 piece", image: "🍃", discount: "12% OFF", inStock: true, rating: 4.4, subcategory: "Special Varieties" }
      ]
    },
    "dairy-bread-eggs": {
      title: "Dairy, Bread & Eggs",
      emoji: "🥛",
      subcategories: [
        { name: "Milk & Dairy", emoji: "🥛" },
        { name: "Bread & Bakery", emoji: "🍞" },
        { name: "Eggs", emoji: "🥚" }
      ],
      products: [
        { id: 7, name: "Amul Fresh Milk", price: 28, unit: "500ml", image: "🥛", inStock: true, rating: 4.3, brand: "Amul", subcategory: "Milk & Dairy" },
        { id: 8, name: "Brown Bread", price: 35, unit: "400g", image: "🍞", inStock: true, rating: 4.1, brand: "Harvest Gold", subcategory: "Bread & Bakery" },
        { id: 9, name: "Farm Fresh Eggs", price: 72, unit: "12 pieces", image: "🥚", inStock: true, rating: 4.5, subcategory: "Eggs" },
        { id: 10, name: "Paneer", price: 90, originalPrice: 100, unit: "200g", image: "🧀", discount: "10% OFF", inStock: true, rating: 4.2, brand: "Mother Dairy", subcategory: "Milk & Dairy" },
        { id: 11, name: "Greek Yogurt", price: 45, unit: "200g", image: "🥛", inStock: true, rating: 4.4, brand: "Epigamia", subcategory: "Milk & Dairy" },
        { id: 12, name: "Butter", price: 55, unit: "100g", image: "🧈", inStock: true, rating: 4.0, brand: "Amul", subcategory: "Milk & Dairy" }
      ]
    },
    "fruits-vegetables": {
      title: "Fruits & Vegetables",
      emoji: "🥬",
      subcategories: [
        { name: "Fresh Fruits", emoji: "🍎" },
        { name: "Vegetables", emoji: "🥬" },
        { name: "Leafy Greens", emoji: "🥬" }
      ],
      products: [
        { id: 13, name: "Fresh Bananas", price: 40, unit: "1kg", image: "🍌", inStock: true, rating: 4.2, subcategory: "Fresh Fruits" },
        { id: 14, name: "Red Apples", price: 120, originalPrice: 140, unit: "1kg", image: "🍎", discount: "14% OFF", inStock: true, rating: 4.4, subcategory: "Fresh Fruits" },
        { id: 15, name: "Fresh Spinach", price: 25, unit: "250g", image: "🥬", inStock: true, rating: 4.1, subcategory: "Leafy Greens" },
        { id: 16, name: "Tomatoes", price: 35, unit: "500g", image: "🍅", inStock: true, rating: 4.0, subcategory: "Vegetables" },
        { id: 17, name: "Carrots", price: 30, unit: "500g", image: "🥕", inStock: true, rating: 4.3, subcategory: "Vegetables" },
        { id: 18, name: "Green Capsicum", price: 45, unit: "250g", image: "🫑", inStock: false, rating: 4.2, subcategory: "Vegetables" }
      ]
    },
    "baby-care": {
      title: "Baby Care",
      emoji: "👶",
      subcategories: [
        { name: "Diapers & Wipes", emoji: "👶" },
        { name: "Baby Food", emoji: "🍼" },
        { name: "Bath & Care", emoji: "🧴" }
      ],
      products: [
        { id: 19, name: "Pampers Diapers", price: 899, originalPrice: 999, unit: "72 pieces", image: "👶", discount: "10% OFF", inStock: true, rating: 4.5, brand: "Pampers", subcategory: "Diapers & Wipes" },
        { id: 20, name: "Johnson's Baby Oil", price: 145, unit: "200ml", image: "🍼", inStock: true, rating: 4.3, brand: "Johnson's", subcategory: "Bath & Care" },
        { id: 21, name: "Cerelac", price: 285, unit: "300g", image: "🥣", inStock: true, rating: 4.4, brand: "Nestle", subcategory: "Baby Food" },
        { id: 22, name: "Baby Wipes", price: 99, unit: "80 pieces", image: "🧻", inStock: true, rating: 4.2, brand: "Huggies", subcategory: "Diapers & Wipes" },
        { id: 23, name: "Baby Powder", price: 89, unit: "100g", image: "🍼", inStock: true, rating: 4.1, brand: "Johnson's", subcategory: "Bath & Care" },
        { id: 24, name: "Baby Shampoo", price: 125, unit: "200ml", image: "🧴", inStock: false, rating: 4.3, brand: "Sebamed", subcategory: "Bath & Care" }
      ]
    },
    "personal-care": {
      title: "Personal Care",
      emoji: "🧴",
      subcategories: [
        { name: "Hair Care", emoji: "💇" },
        { name: "Oral Care", emoji: "🦷" },
        { name: "Body Care", emoji: "🧴" }
      ],
      products: [
        { id: 25, name: "Head & Shoulders Shampoo", price: 175, unit: "340ml", image: "🧴", inStock: true, rating: 4.2, brand: "Head & Shoulders", subcategory: "Hair Care" },
        { id: 26, name: "Colgate Toothpaste", price: 45, originalPrice: 50, unit: "100g", image: "🦷", discount: "10% OFF", inStock: true, rating: 4.4, brand: "Colgate", subcategory: "Oral Care" },
        { id: 27, name: "Dove Soap", price: 35, unit: "75g", image: "🧼", inStock: true, rating: 4.3, brand: "Dove", subcategory: "Body Care" },
        { id: 28, name: "Gillette Razor", price: 285, unit: "1 piece", image: "🪒", inStock: true, rating: 4.1, brand: "Gillette", subcategory: "Body Care" },
        { id: 29, name: "Nivea Body Lotion", price: 199, unit: "200ml", image: "🧴", inStock: true, rating: 4.0, brand: "Nivea", subcategory: "Body Care" },
        { id: 30, name: "Dettol Hand Wash", price: 65, unit: "200ml", image: "🧼", inStock: true, rating: 4.5, brand: "Dettol", subcategory: "Body Care" }
      ]
    },
    "cleaning-essential": {
      title: "Cleaning Essential",
      emoji: "🧽",
      subcategories: [
        { name: "Detergents", emoji: "🧺" },
        { name: "Cleaners", emoji: "🧽" },
        { name: "Accessories", emoji: "🧽" }
      ],
      products: [
        { id: 31, name: "Harpic Toilet Cleaner", price: 89, unit: "500ml", image: "🧽", inStock: true, rating: 4.3, brand: "Harpic", subcategory: "Cleaners" },
        { id: 32, name: "Vim Dishwash", price: 45, originalPrice: 50, unit: "250ml", image: "🧽", discount: "10% OFF", inStock: true, rating: 4.2, brand: "Vim", subcategory: "Cleaners" },
        { id: 33, name: "Colin Glass Cleaner", price: 75, unit: "250ml", image: "🧽", inStock: true, rating: 4.1, brand: "Colin", subcategory: "Cleaners" },
        { id: 34, name: "Surf Excel", price: 125, unit: "500g", image: "🧺", inStock: true, rating: 4.4, brand: "Surf Excel", subcategory: "Detergents" },
        { id: 35, name: "Lizol Floor Cleaner", price: 99, unit: "500ml", image: "🧽", inStock: false, rating: 4.0, brand: "Lizol", subcategory: "Cleaners" },
        { id: 36, name: "Scotch Brite Scrubber", price: 25, unit: "1 piece", image: "🧽", inStock: true, rating: 4.2, brand: "3M", subcategory: "Accessories" }
      ]
    },
    "detergent-laundry": {
      title: "Detergent & Laundry",
      emoji: "🧺",
      subcategories: [
        { name: "Detergent Powder", emoji: "📦" },
        { name: "Liquid Detergent", emoji: "🧴" },
        { name: "Fabric Care", emoji: "👕" }
      ],
      products: [
        { id: 101, name: "Ariel Detergent Powder", price: 320, originalPrice: 360, unit: "2kg", image: "📦", discount: "11% OFF", inStock: true, rating: 4.4, brand: "Ariel", subcategory: "Detergent Powder" },
        { id: 102, name: "Tide Plus", price: 280, unit: "1.5kg", image: "📦", inStock: true, rating: 4.2, brand: "Tide", subcategory: "Detergent Powder" },
        { id: 103, name: "Surf Excel Liquid", price: 185, unit: "1L", image: "🧴", inStock: true, rating: 4.3, brand: "Surf Excel", subcategory: "Liquid Detergent" },
        { id: 104, name: "Comfort Fabric Softener", price: 145, unit: "800ml", image: "🧴", inStock: true, rating: 4.1, brand: "Comfort", subcategory: "Fabric Care" },
        { id: 105, name: "Vanish Stain Remover", price: 120, originalPrice: 140, unit: "450g", image: "🧴", discount: "14% OFF", inStock: true, rating: 4.0, brand: "Vanish", subcategory: "Fabric Care" }
      ]
    },
    "festive-corner": {
      title: "Festive Corner",
      emoji: "🎉",
      subcategories: [
        { name: "Decorations", emoji: "🎨" },
        { name: "Sweets & Gifts", emoji: "🍬" },
        { name: "Party Supplies", emoji: "🎈" }
      ],
      products: [
        { id: 201, name: "LED String Lights", price: 450, originalPrice: 550, unit: "10m", image: "💡", discount: "18% OFF", inStock: true, rating: 4.3, subcategory: "Decorations" },
        { id: 202, name: "Diwali Rangoli Stencils", price: 180, unit: "Set of 6", image: "🎨", inStock: true, rating: 4.1, subcategory: "Decorations" },
        { id: 203, name: "Mixed Dry Fruits", price: 650, unit: "500g", image: "🥜", inStock: true, rating: 4.5, subcategory: "Sweets & Gifts" },
        { id: 204, name: "Chocolate Gift Box", price: 320, unit: "250g", image: "🍫", inStock: true, rating: 4.2, brand: "Cadbury", subcategory: "Sweets & Gifts" },
        { id: 205, name: "Paper Plates", price: 85, unit: "50 pieces", image: "🍽️", inStock: true, rating: 4.0, subcategory: "Party Supplies" }
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

  const getCartQuantity = (productId: string) => {
    const cartItem = items.find(item => item.id === parseInt(productId));
    return cartItem ? cartItem.quantity : 0;
  };

  // Use real products from database
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
                variant="outline" 
                size="sm"
                onClick={() => navigate("/seller")}
              >
                <Store className="w-4 h-4 mr-2" />
                Seller Portal
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
            <h1 className="text-3xl font-bold">{categoryForAPI}</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${filteredProducts.length} products available`}
            </p>
          </div>
        </div>

        {/* Search only for real products */}

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
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="w-16 h-16 bg-muted rounded mx-auto mb-3"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-2"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const cartQuantity = getCartQuantity(product.id);
              const handleProductAddToCart = () => {
                addToCart({
                  id: parseInt(product.id),
                  name: product.name,
                  price: product.price,
                  image: product.image_url || "📦",
                  unit: "piece",
                  brand: product.category
                });
              };
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="w-16 h-16 mb-3 mx-auto bg-muted rounded-lg flex items-center justify-center text-2xl">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        "📦"
                      )}
                    </div>
                    
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    
                    <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
                    
                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm">₹{product.price}</span>
                    </div>

                    {product.stock_quantity === 0 ? (
                      <Button disabled className="w-full" size="sm">
                        Out of Stock
                      </Button>
                    ) : cartQuantity > 0 ? (
                      <div className="flex items-center justify-between border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(parseInt(product.id))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium">{cartQuantity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleProductAddToCart}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleProductAddToCart}
                        className="w-full" 
                        size="sm"
                      >
                        Add
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;