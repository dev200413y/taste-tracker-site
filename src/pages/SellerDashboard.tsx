import { useState } from "react";
import { Plus, Package, TrendingUp, DollarSign, Eye, Edit2, Trash2, Upload, ArrowLeft, BarChart3, ShoppingCart, Percent, Settings, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsDashboard } from "@/components/seller/AnalyticsDashboard";
import { InventoryManagement } from "@/components/seller/InventoryManagement";
import { DiscountManagement } from "@/components/seller/DiscountManagement";
import { OrderManagement } from "@/components/seller/OrderManagement";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Basmati Rice",
      category: "atta-rice-dal",
      price: 450,
      originalPrice: 500,
      stock: 25,
      image: "/placeholder.svg",
      status: "active",
      sales: 45
    },
    {
      id: 2,
      name: "Fresh Milk 1L",
      category: "dairy-bread-eggs",
      price: 65,
      originalPrice: 70,
      stock: 100,
      image: "/placeholder.svg",
      status: "active",
      sales: 120
    },
    {
      id: 3,
      name: "Brown Bread",
      category: "bakery-biscuits",
      price: 40,
      originalPrice: 45,
      stock: 0,
      image: "/placeholder.svg",
      status: "out-of-stock",
      sales: 80
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "",
    description: "",
    image: ""
  });

  const categories = [
    { value: "paan-corner", label: "Paan Corner" },
    { value: "dairy-bread-eggs", label: "Dairy, Bread & Eggs" },
    { value: "fruits-vegetables", label: "Fruits & Vegetables" },
    { value: "cold-drinks-juices", label: "Cold Drinks & Juices" },
    { value: "snacks-munchies", label: "Snacks & Munchies" },
    { value: "breakfast-instant", label: "Breakfast & Instant Food" },
    { value: "detergent-laundry", label: "Detergent & Laundry" },
    { value: "bakery-biscuits", label: "Bakery & Biscuits" },
    { value: "baby-care", label: "Baby Care" },
    { value: "atta-rice-dal", label: "Atta, Rice & Dal" },
    { value: "festive-corner", label: "Festive Corner" },
    { value: "personal-care", label: "Personal Care" },
    { value: "cleaning-essential", label: "Cleaning Essential" }
  ];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const product = {
      id: products.length + 1,
      name: newProduct.name,
      category: newProduct.category,
      price: parseInt(newProduct.price),
      originalPrice: parseInt(newProduct.originalPrice) || parseInt(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      image: "/placeholder.svg",
      status: parseInt(newProduct.stock) > 0 ? "active" : "out-of-stock",
      sales: 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      stock: "",
      description: "",
      image: ""
    });

    toast({
      title: "Success",
      description: "Product added successfully!"
    });
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Success",
      description: "Product deleted successfully!"
    });
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const totalRevenue = products.reduce((sum, p) => sum + (p.sales * p.price), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Seller Dashboard</h1>
                <p className="text-muted-foreground">Manage your products and sales</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Fill in the details to add a new product to your store.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select 
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="₹0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                        placeholder="₹0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Product description..."
                    />
                  </div>
                  <Button onClick={handleAddProduct} className="w-full">
                    Add Product
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: TrendingUp },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "products", label: "Products", icon: Package },
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "discounts", label: "Discounts", icon: Percent },
            { id: "customers", label: "Customers", icon: Users },
            { id: "settings", label: "Settings", icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "border-primary text-primary" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {activeProducts} active
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSales}</div>
                  <p className="text-xs text-muted-foreground">
                    Units sold
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Total earnings
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{totalProducts > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / totalProducts) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average product price
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Your latest added products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {categories.find(c => c.value === product.category)?.label}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{product.price}</p>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && <AnalyticsDashboard />}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>Manage your product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              {product.originalPrice > product.price && (
                                <p className="text-sm text-muted-foreground">
                                  <span className="line-through">₹{product.originalPrice}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {categories.find(c => c.value === product.category)?.label}
                        </TableCell>
                        <TableCell>₹{product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && <OrderManagement />}

        {/* Inventory Tab */}
        {activeTab === "inventory" && <InventoryManagement />}

        {/* Discounts Tab */}
        {activeTab === "discounts" && <DiscountManagement />}

        {/* Customers Tab */}
        {activeTab === "customers" && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>Manage your customer relationships and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,247</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Repeat Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">423</div>
                    <p className="text-xs text-muted-foreground">34% of total</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Customer LTV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹8,540</div>
                    <p className="text-xs text-muted-foreground">Average lifetime value</p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground">Customer management features coming soon...</p>
            </CardContent>
          </Card>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>Configure your store preferences and policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" placeholder="Your Store Name" />
                  </div>
                  <div>
                    <Label htmlFor="store-email">Store Email</Label>
                    <Input id="store-email" type="email" placeholder="store@example.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="store-description">Store Description</Label>
                  <Textarea id="store-description" placeholder="Describe your store..." />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment methods and payout preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bank-account">Bank Account Number</Label>
                    <Input id="bank-account" placeholder="Account number" />
                  </div>
                  <div>
                    <Label htmlFor="ifsc">IFSC Code</Label>
                    <Input id="ifsc" placeholder="IFSC code" />
                  </div>
                  <div>
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" placeholder="yourname@upi" />
                  </div>
                  <Button>Update Payment Settings</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>Configure shipping zones and rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shipping-from">Ship From Address</Label>
                    <Textarea id="shipping-from" placeholder="Your warehouse/store address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="local-shipping">Local Shipping Rate (₹)</Label>
                      <Input id="local-shipping" type="number" placeholder="50" />
                    </div>
                    <div>
                      <Label htmlFor="national-shipping">National Shipping Rate (₹)</Label>
                      <Input id="national-shipping" type="number" placeholder="100" />
                    </div>
                  </div>
                  <Button>Update Shipping Settings</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;