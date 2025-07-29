import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, CheckCircle, XCircle, Clock, Eye, MessageSquare, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockOrders = [
  {
    id: "ORD-2024-001",
    customer: { name: "John Doe", email: "john@example.com", phone: "+91 9876543210" },
    items: [
      { name: "iPhone 15 Pro", quantity: 1, price: 99999 },
      { name: "AirPods Pro", quantity: 1, price: 24900 }
    ],
    total: 124899,
    status: "pending",
    paymentStatus: "paid",
    shippingAddress: "123 Main St, Mumbai, Maharashtra 400001",
    orderDate: "2024-01-15T10:30:00Z",
    expectedDelivery: "2024-01-20",
    trackingNumber: ""
  },
  {
    id: "ORD-2024-002",
    customer: { name: "Jane Smith", email: "jane@example.com", phone: "+91 9876543211" },
    items: [
      { name: "Samsung Galaxy S24", quantity: 2, price: 89999 }
    ],
    total: 179998,
    status: "shipped",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Delhi, Delhi 110001",
    orderDate: "2024-01-14T14:20:00Z",
    expectedDelivery: "2024-01-19",
    trackingNumber: "1Z999AA1234567890"
  },
  {
    id: "ORD-2024-003",
    customer: { name: "Bob Johnson", email: "bob@example.com", phone: "+91 9876543212" },
    items: [
      { name: "MacBook Air M3", quantity: 1, price: 134999 }
    ],
    total: 134999,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "789 Pine St, Bangalore, Karnataka 560001",
    orderDate: "2024-01-10T09:15:00Z",
    expectedDelivery: "2024-01-15",
    trackingNumber: "1Z999BB1234567891"
  }
];

const statusOptions = [
  { value: "pending", label: "Pending", icon: Clock, color: "yellow" },
  { value: "confirmed", label: "Confirmed", icon: CheckCircle, color: "blue" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "purple" },
  { value: "delivered", label: "Delivered", icon: Package, color: "green" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "red" }
];

export const OrderManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    if (!statusConfig) return <Badge variant="secondary">{status}</Badge>;
    
    const Icon = statusConfig.icon;
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.shipped}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Manage and track customer orders</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search orders, customers, or emails..."
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
                <SelectItem value="all">All Orders</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.items.length} item(s)</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items[0].name}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{order.total.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                            <DialogDescription>Complete order information and management</DialogDescription>
                          </DialogHeader>
                          {selectedOrder && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Order Details</TabsTrigger>
                                <TabsTrigger value="customer">Customer Info</TabsTrigger>
                                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Order Items</h4>
                                    <div className="space-y-2">
                                      {selectedOrder.items.map((item: any, index: number) => (
                                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                                          <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                          </div>
                                          <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-4 p-2 bg-muted rounded">
                                      <div className="flex justify-between font-bold">
                                        <span>Total:</span>
                                        <span>₹{selectedOrder.total.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Order Status</h4>
                                    <div className="space-y-2">
                                      <Select 
                                        value={selectedOrder.status} 
                                        onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {statusOptions.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                              {status.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <div className="text-sm text-muted-foreground">
                                        <p>Order Date: {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                                        <p>Payment: {selectedOrder.paymentStatus}</p>
                                        {selectedOrder.expectedDelivery && (
                                          <p>Expected Delivery: {selectedOrder.expectedDelivery}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="customer" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Customer Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <p><strong>Name:</strong> {selectedOrder.customer.name}</p>
                                      <p><strong>Email:</strong> {selectedOrder.customer.email}</p>
                                      <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Communication</h4>
                                    <Button className="w-full mb-2">
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Send Message
                                    </Button>
                                  </div>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="shipping" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Shipping Address</h4>
                                    <p className="text-sm">{selectedOrder.shippingAddress}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Tracking</h4>
                                    {selectedOrder.trackingNumber ? (
                                      <div>
                                        <p className="text-sm"><strong>Tracking Number:</strong></p>
                                        <p className="font-mono text-sm">{selectedOrder.trackingNumber}</p>
                                      </div>
                                    ) : (
                                      <div>
                                        <Input placeholder="Enter tracking number" className="mb-2" />
                                        <Button size="sm">Add Tracking</Button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
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