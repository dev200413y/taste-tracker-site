import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Percent, Plus, Edit2, Trash2, Calendar, Users, Tag, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockDiscounts = [
  {
    id: 1,
    name: "Summer Sale 2024",
    code: "SUMMER2024",
    type: "percentage",
    value: 25,
    minOrderValue: 1000,
    maxDiscount: 500,
    usageLimit: 100,
    usedCount: 23,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    isActive: true,
    applicableProducts: "All",
    description: "Summer discount for all products"
  },
  {
    id: 2,
    name: "First Time Buyer",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minOrderValue: 500,
    maxDiscount: 200,
    usageLimit: 1000,
    usedCount: 156,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    applicableProducts: "Electronics",
    description: "Welcome discount for new customers"
  },
  {
    id: 3,
    name: "Bulk Order Discount",
    code: "BULK50",
    type: "fixed",
    value: 500,
    minOrderValue: 5000,
    maxDiscount: 500,
    usageLimit: 50,
    usedCount: 12,
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: false,
    applicableProducts: "All",
    description: "Fixed discount for bulk orders"
  }
];

export const DiscountManagement = () => {
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any>(null);
  
  const [newDiscount, setNewDiscount] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: "",
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
    isActive: true,
    applicableProducts: "All",
    description: ""
  });

  const generateDiscountCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNewDiscount({ ...newDiscount, code });
  };

  const handleCreateDiscount = () => {
    if (!newDiscount.name || !newDiscount.code || !newDiscount.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const discount = {
      id: discounts.length + 1,
      ...newDiscount,
      value: parseFloat(newDiscount.value),
      minOrderValue: parseFloat(newDiscount.minOrderValue) || 0,
      maxDiscount: parseFloat(newDiscount.maxDiscount) || 0,
      usageLimit: parseInt(newDiscount.usageLimit) || 0,
      usedCount: 0
    };

    setDiscounts([...discounts, discount]);
    setNewDiscount({
      name: "",
      code: "",
      type: "percentage",
      value: "",
      minOrderValue: "",
      maxDiscount: "",
      usageLimit: "",
      startDate: "",
      endDate: "",
      isActive: true,
      applicableProducts: "All",
      description: ""
    });
    setDialogOpen(false);

    toast({
      title: "Success",
      description: "Discount created successfully!"
    });
  };

  const toggleDiscountStatus = (id: number) => {
    setDiscounts(discounts.map(discount => 
      discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
    ));
    
    toast({
      title: "Success",
      description: "Discount status updated!"
    });
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `Discount code "${code}" copied to clipboard`
    });
  };

  const deleteDiscount = (id: number) => {
    setDiscounts(discounts.filter(discount => discount.id !== id));
    toast({
      title: "Success",
      description: "Discount deleted successfully!"
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.filter(d => d.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discounts.reduce((sum, d) => sum + d.usedCount, 0)}</div>
            <p className="text-xs text-muted-foreground">Times used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discounts.length > 0 ? Math.round(discounts.reduce((sum, d) => sum + d.value, 0) / discounts.length) : 0}
              {discounts.some(d => d.type === 'percentage') ? '%' : '₹'}
            </div>
            <p className="text-xs text-muted-foreground">Average value</p>
          </CardContent>
        </Card>
      </div>

      {/* Discount Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Discount Codes</CardTitle>
              <CardDescription>Create and manage discount codes for your customers</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Discount</DialogTitle>
                  <DialogDescription>Set up a new discount code for your customers</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="discount-name">Discount Name *</Label>
                      <Input
                        id="discount-name"
                        value={newDiscount.name}
                        onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                        placeholder="e.g., Summer Sale 2024"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount-code">Discount Code *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="discount-code"
                          value={newDiscount.code}
                          onChange={(e) => setNewDiscount({...newDiscount, code: e.target.value.toUpperCase()})}
                          placeholder="e.g., SUMMER2024"
                        />
                        <Button type="button" variant="outline" onClick={generateDiscountCode}>
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="discount-type">Type *</Label>
                      <Select value={newDiscount.type} onValueChange={(value) => setNewDiscount({...newDiscount, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="discount-value">
                        Value * {newDiscount.type === 'percentage' ? '(%)' : '(₹)'}
                      </Label>
                      <Input
                        id="discount-value"
                        type="number"
                        value={newDiscount.value}
                        onChange={(e) => setNewDiscount({...newDiscount, value: e.target.value})}
                        placeholder={newDiscount.type === 'percentage' ? "25" : "500"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="usage-limit">Usage Limit</Label>
                      <Input
                        id="usage-limit"
                        type="number"
                        value={newDiscount.usageLimit}
                        onChange={(e) => setNewDiscount({...newDiscount, usageLimit: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min-order">Min Order Value (₹)</Label>
                      <Input
                        id="min-order"
                        type="number"
                        value={newDiscount.minOrderValue}
                        onChange={(e) => setNewDiscount({...newDiscount, minOrderValue: e.target.value})}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-discount">Max Discount (₹)</Label>
                      <Input
                        id="max-discount"
                        type="number"
                        value={newDiscount.maxDiscount}
                        onChange={(e) => setNewDiscount({...newDiscount, maxDiscount: e.target.value})}
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <Input
                        id="start-date"
                        type="date"
                        value={newDiscount.startDate}
                        onChange={(e) => setNewDiscount({...newDiscount, startDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <Input
                        id="end-date"
                        type="date"
                        value={newDiscount.endDate}
                        onChange={(e) => setNewDiscount({...newDiscount, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="applicable-products">Applicable Products</Label>
                    <Select value={newDiscount.applicableProducts} onValueChange={(value) => setNewDiscount({...newDiscount, applicableProducts: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Products</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newDiscount.description}
                      onChange={(e) => setNewDiscount({...newDiscount, description: e.target.value})}
                      placeholder="Describe this discount..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is-active"
                      checked={newDiscount.isActive}
                      onCheckedChange={(checked) => setNewDiscount({...newDiscount, isActive: checked})}
                    />
                    <Label htmlFor="is-active">Active immediately</Label>
                  </div>

                  <Button onClick={handleCreateDiscount} className="w-full">
                    Create Discount
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{discount.name}</p>
                      <p className="text-sm text-muted-foreground">{discount.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{discount.code}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyDiscountCode(discount.code)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {discount.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                    {discount.maxDiscount > 0 && discount.type === 'percentage' && (
                      <p className="text-xs text-muted-foreground">Max: ₹{discount.maxDiscount}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{discount.usedCount}</p>
                      {discount.usageLimit > 0 && (
                        <p className="text-xs text-muted-foreground">/ {discount.usageLimit}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{discount.startDate}</p>
                      <p className="text-muted-foreground">to {discount.endDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={discount.isActive ? "default" : "secondary"}>
                        {discount.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Switch
                        checked={discount.isActive}
                        onCheckedChange={() => toggleDiscountStatus(discount.id)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteDiscount(discount.id)}
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
  );
};