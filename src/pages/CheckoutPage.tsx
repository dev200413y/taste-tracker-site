import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, CreditCard, Truck, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

interface Address {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  pincode: string;
  city: string;
  state: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { toast } = useToast();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    pincode: "",
    city: "",
    state: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = getTotalPrice();
  const deliveryFee = totalAmount > 199 ? 0 : 25;
  const finalAmount = totalAmount + deliveryFee;

  const handleAddressSubmit = () => {
    if (!address.name || !address.phone || !address.addressLine1 || !address.pincode) {
      toast({
        title: "Incomplete Address",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      const orderItems = items.map(item => ({
        product_id: String(item.id), // Convert to string for database
        quantity: item.quantity,
        unit_price: item.price
      }));

      const { data, error } = await createOrder({
        total_amount: finalAmount,
        delivery_address: `${address.name}, ${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.state} ${address.pincode}`,
        items: orderItems
      });

      if (error) {
        throw error;
      }

      setCurrentStep(3);
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been confirmed and will be delivered soon.",
      });
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && currentStep !== 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-4">Add some items to proceed with checkout</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-2xl font-bold text-primary">GoLocal</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                1
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                3
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={address.name}
                        onChange={(e) => setAddress({...address, name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={address.phone}
                        onChange={(e) => setAddress({...address, phone: e.target.value})}
                        placeholder="Enter phone number"
                        type="tel"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input
                      id="address1"
                      value={address.addressLine1}
                      onChange={(e) => setAddress({...address, addressLine1: e.target.value})}
                      placeholder="House/Flat No., Building Name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input
                      id="address2"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({...address, addressLine2: e.target.value})}
                      placeholder="Street, Area, Locality"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input
                        id="landmark"
                        value={address.landmark}
                        onChange={(e) => setAddress({...address, landmark: e.target.value})}
                        placeholder="Nearby landmark"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({...address, pincode: e.target.value})}
                        placeholder="Enter pincode"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({...address, city: e.target.value})}
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={address.state}
                        onChange={(e) => setAddress({...address, state: e.target.value})}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleAddressSubmit} className="w-full">
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Address Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Delivery Address
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                        Change
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p className="font-medium">{address.name}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-muted-foreground">Phone: {address.phone}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-3 border rounded">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">💰</div>
                            <div>
                              <p className="font-medium">Cash on Delivery</p>
                              <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">📱</div>
                            <div>
                              <p className="font-medium">UPI Payment</p>
                              <p className="text-sm text-muted-foreground">Pay using GooglePay, PhonePe, Paytm</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">💳</div>
                            <div>
                              <p className="font-medium">Credit/Debit Card</p>
                              <p className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</p>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    
                    <Button 
                      onClick={handlePayment} 
                      className="w-full mt-6" 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : `Place Order ₹${finalAmount}`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                  <p className="text-muted-foreground mb-6">
                    Your order will be delivered to your address within 15-20 minutes
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span>Order ID:</span>
                      <span className="font-mono font-medium">QM{Date.now()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span>Estimated Delivery:</span>
                      <span className="font-medium">{new Date(Date.now() + 20*60*1000).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button onClick={() => navigate("/")} className="w-full">
                      Continue Shopping
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                      Track Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                      <p className="font-medium">₹{item.quantity * item.price}</p>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                  </div>
                  {deliveryFee === 0 && (
                    <p className="text-xs text-green-600">Free delivery on orders above ₹199</p>
                  )}
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{finalAmount}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Truck className="w-4 h-4" />
                  <span>Delivery in 15-20 minutes</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;