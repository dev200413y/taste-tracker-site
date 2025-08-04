-- Add delivery tracking and payment status to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS actual_delivery TIMESTAMP WITH TIME ZONE;

-- Create delivery tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'order_placed',
  location TEXT,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on delivery_tracking
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for delivery_tracking
CREATE POLICY "Users can view tracking for their orders" ON delivery_tracking
FOR SELECT USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

-- Sellers can update tracking for their products' orders
CREATE POLICY "Sellers can manage delivery tracking" ON delivery_tracking
FOR ALL USING (
  order_id IN (
    SELECT DISTINCT o.id 
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN sellers s ON p.seller_id = s.id
    WHERE s.user_id = auth.uid()
  )
);

-- Create discounts table for seller discount management
CREATE TABLE IF NOT EXISTS discounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  min_order_amount NUMERIC DEFAULT 0,
  max_discount_amount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on discounts
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Create policies for discounts
CREATE POLICY "Sellers can manage their discounts" ON discounts
FOR ALL USING (
  seller_id IN (
    SELECT id FROM sellers WHERE user_id = auth.uid()
  )
);

-- Users can view active discounts
CREATE POLICY "Users can view active discounts" ON discounts
FOR SELECT USING (is_active = true AND valid_until > now());

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their notifications" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for discounts
CREATE TRIGGER update_discounts_updated_at
    BEFORE UPDATE ON discounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();