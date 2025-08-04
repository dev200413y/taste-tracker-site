import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Star,
  MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DeliveryTracking {
  id: string;
  order_id: string;
  status: string;
  location: string;
  notes: string;
  timestamp: string;
}

interface OrderTrackingProps {
  orderId: string;
  orderStatus: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  orderStatus,
  trackingNumber,
  estimatedDelivery
}) => {
  const [trackingData, setTrackingData] = useState<DeliveryTracking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrackingData();
  }, [orderId]);

  const fetchTrackingData = async () => {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .eq('order_id', orderId)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setTrackingData(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tracking data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'out_for_delivery': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return <Clock className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'out_for_delivery':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const trackingSteps = [
    { id: 'order_placed', label: 'Order Placed', completed: true },
    { id: 'confirmed', label: 'Confirmed', completed: ['confirmed', 'preparing', 'out_for_delivery', 'delivered'].includes(orderStatus) },
    { id: 'preparing', label: 'Preparing', completed: ['preparing', 'out_for_delivery', 'delivered'].includes(orderStatus) },
    { id: 'out_for_delivery', label: 'Out for Delivery', completed: ['out_for_delivery', 'delivered'].includes(orderStatus) },
    { id: 'delivered', label: 'Delivered', completed: orderStatus === 'delivered' }
  ];

  return (
    <div className="space-y-6">
      {/* Order Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(orderStatus)}
              Order Status
            </CardTitle>
            <Badge className={getStatusColor(orderStatus)}>
              {orderStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trackingNumber && (
              <div>
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-mono">{trackingNumber}</p>
              </div>
            )}
            {estimatedDelivery && (
              <div>
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p>{new Date(estimatedDelivery).toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  {step.completed && step.id === orderStatus && (
                    <p className="text-sm text-primary">Current Status</p>
                  )}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`w-px h-8 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tracking */}
      {trackingData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tracking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingData.map((track, index) => (
                <div key={track.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/30">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{track.status.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(track.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {track.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {track.location}
                      </p>
                    )}
                    {track.notes && (
                      <p className="text-sm mt-1">{track.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {orderStatus === 'delivered' && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Rate Order
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Contact Support
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Reorder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Contact */}
      {orderStatus === 'out_for_delivery' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delivery Partner</p>
                <p className="text-sm text-muted-foreground">Your order is on the way</p>
              </div>
              <Button size="sm" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};