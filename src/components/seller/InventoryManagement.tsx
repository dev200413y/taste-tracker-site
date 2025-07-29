import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Package, Plus, Edit2, Trash2, Upload, Download, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockInventory = [
  { id: 1, name: "iPhone 15 Pro", sku: "IP15P-128", category: "Electronics", price: 99999, stock: 25, reorderLevel: 10, status: "In Stock", lastUpdated: "2024-01-15" },
  { id: 2, name: "Samsung Galaxy S24", sku: "SGS24-256", category: "Electronics", price: 89999, stock: 5, reorderLevel: 10, status: "Low Stock", lastUpdated: "2024-01-14" },
  { id: 3, name: "MacBook Air M3", sku: "MBA-M3-512", category: "Electronics", price: 134999, stock: 0, reorderLevel: 5, status: "Out of Stock", lastUpdated: "2024-01-13" },
  { id: 4, name: "AirPods Pro", sku: "APP-2ND", category: "Accessories", price: 24900, stock: 45, reorderLevel: 15, status: "In Stock", lastUpdated: "2024-01-16" },
];

export const InventoryManagement = () => {
  const { toast } = useToast();
  const [inventory, setInventory] = useState(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [bulkUpdateDialogOpen, setBulkUpdateDialogOpen] = useState(false);
  const [stockAdjustment, setStockAdjustment] = useState({ productId: "", adjustment: "", reason: "" });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status.toLowerCase().replace(" ", "-") === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = inventory.filter(item => item.stock <= item.reorderLevel && item.stock > 0);
  const outOfStockItems = inventory.filter(item => item.stock === 0);

  const handleStockAdjustment = () => {
    const productIndex = inventory.findIndex(item => item.id.toString() === stockAdjustment.productId);
    if (productIndex !== -1) {
      const updatedInventory = [...inventory];
      const currentStock = updatedInventory[productIndex].stock;
      const adjustment = parseInt(stockAdjustment.adjustment);
      const newStock = Math.max(0, currentStock + adjustment);
      
      updatedInventory[productIndex].stock = newStock;
      updatedInventory[productIndex].status = newStock === 0 ? "Out of Stock" : 
                                             newStock <= updatedInventory[productIndex].reorderLevel ? "Low Stock" : "In Stock";
      updatedInventory[productIndex].lastUpdated = new Date().toISOString().split('T')[0];
      
      setInventory(updatedInventory);
      setStockAdjustment({ productId: "", adjustment: "", reason: "" });
      
      toast({
        title: "Stock Updated",
        description: `Stock adjusted by ${adjustment} units. Reason: ${stockAdjustment.reason}`
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "In Stock": return "default";
      case "Low Stock": return "secondary";
      case "Out of Stock": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">Low Stock Alert</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800">{lowStockItems.length}</div>
            <p className="text-xs text-yellow-600">Products need restocking</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Out of Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{outOfStockItems.length}</div>
            <p className="text-xs text-red-600">Products unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Actions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and manage your product inventory</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={bulkUpdateDialogOpen} onOpenChange={setBulkUpdateDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Adjust Stock
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stock Adjustment</DialogTitle>
                    <DialogDescription>Adjust inventory levels for products</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="product">Select Product</Label>
                      <Select value={stockAdjustment.productId} onValueChange={(value) => setStockAdjustment({...stockAdjustment, productId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventory.map((item) => (
                            <SelectItem key={item.id} value={item.id.toString()}>
                              {item.name} (Current: {item.stock})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="adjustment">Adjustment (+/-)</Label>
                      <Input
                        id="adjustment"
                        type="number"
                        value={stockAdjustment.adjustment}
                        onChange={(e) => setStockAdjustment({...stockAdjustment, adjustment: e.target.value})}
                        placeholder="e.g., +10 or -5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Input
                        id="reason"
                        value={stockAdjustment.reason}
                        onChange={(e) => setStockAdjustment({...stockAdjustment, reason: e.target.value})}
                        placeholder="e.g., Restock, Damaged, Sold"
                      />
                    </div>
                    <Button onClick={handleStockAdjustment} className="w-full">
                      Update Stock
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inventory Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹{item.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={item.stock <= item.reorderLevel ? "text-red-600 font-bold" : ""}>
                      {item.stock}
                    </span>
                  </TableCell>
                  <TableCell>{item.reorderLevel}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
  );
};