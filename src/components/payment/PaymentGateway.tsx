import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fees?: string;
}

interface PaymentGatewayProps {
  amount: number;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('phonepe');
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const { toast } = useToast();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with PhonePe UPI',
      fees: 'No additional fees'
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay with any UPI app',
      fees: 'No additional fees'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, Mastercard, RuPay',
      fees: '2% processing fee'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Paytm, Google Pay, etc.',
      fees: 'No additional fees'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: <Clock className="w-5 h-5" />,
      description: 'Pay when you receive',
      fees: '₹20 handling charge'
    }
  ];

  const handlePayment = async () => {
    setProcessing(true);
    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (selectedMethod === 'phonepe') {
        // Simulate PhonePe payment
        const paymentData = {
          transactionId: `PHONEPE_${Date.now()}`,
          method: 'phonepe',
          amount: amount,
          status: 'success',
          timestamp: new Date().toISOString()
        };
        
        setPaymentStatus('success');
        onPaymentSuccess(paymentData);
        toast({
          title: "Payment Successful!",
          description: `Payment of ₹${amount} completed via PhonePe`
        });
      } else if (selectedMethod === 'cod') {
        // Handle Cash on Delivery
        const paymentData = {
          transactionId: `COD_${Date.now()}`,
          method: 'cod',
          amount: amount,
          status: 'pending',
          timestamp: new Date().toISOString()
        };
        
        setPaymentStatus('success');
        onPaymentSuccess(paymentData);
        toast({
          title: "Order Confirmed!",
          description: "Your order will be delivered. Pay on delivery."
        });
      } else {
        // Simulate other payment methods
        const paymentData = {
          transactionId: `${selectedMethod.toUpperCase()}_${Date.now()}`,
          method: selectedMethod,
          amount: amount,
          status: 'success',
          timestamp: new Date().toISOString()
        };
        
        setPaymentStatus('success');
        onPaymentSuccess(paymentData);
        toast({
          title: "Payment Successful!",
          description: `Payment of ₹${amount} completed`
        });
      }
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentError('Payment failed. Please try again.');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'processing':
        return <Clock className="w-8 h-8 text-yellow-500 animate-spin" />;
      case 'success':
        return <Check className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  if (paymentStatus === 'success') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Check className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your order has been confirmed and will be processed soon.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amount Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹0</span>
            </div>
            {selectedMethod === 'cod' && (
              <div className="flex justify-between">
                <span>Handling Charge</span>
                <span>₹20</span>
              </div>
            )}
            {selectedMethod === 'card' && (
              <div className="flex justify-between">
                <span>Processing Fee (2%)</span>
                <span>₹{Math.round(amount * 0.02)}</span>
              </div>
            )}
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>
                ₹{selectedMethod === 'cod' ? amount + 20 : 
                   selectedMethod === 'card' ? amount + Math.round(amount * 0.02) : 
                   amount}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center space-x-3 flex-1">
                    {method.icon}
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {method.fees}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Card Details (if card is selected) */}
      {selectedMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle>Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" />
              </div>
            </div>
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* UPI ID (if UPI is selected) */}
      {selectedMethod === 'upi' && (
        <Card>
          <CardHeader>
            <CardTitle>UPI Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input id="upiId" placeholder="username@upi" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pay Button */}
      <Button 
        onClick={handlePayment} 
        disabled={processing}
        className="w-full h-12 text-lg"
        size="lg"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        ) : (
          `Pay ₹${selectedMethod === 'cod' ? amount + 20 : 
                  selectedMethod === 'card' ? amount + Math.round(amount * 0.02) : 
                  amount}`
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-center text-sm text-muted-foreground">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p>Powered by GoLocal Payments</p>
      </div>
    </div>
  );
};