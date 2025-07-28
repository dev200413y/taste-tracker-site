import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Seller {
  id: string;
  user_id: string;
  business_name: string;
  business_address?: string;
  business_phone?: string;
  gst_number?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export const useSeller = () => {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSeller = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setSeller(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch seller profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeller();
  }, [user]);

  const createSeller = async (sellerData: {
    business_name: string;
    business_address?: string;
    business_phone?: string;
    gst_number?: string;
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a seller profile",
        variant: "destructive"
      });
      return { data: null, error: new Error('Not authenticated') };
    }

    try {
      const { data, error } = await supabase
        .from('sellers')
        .insert([{
          user_id: user.id,
          ...sellerData
        }])
        .select()
        .single();

      if (error) throw error;

      setSeller(data);
      toast({
        title: "Success",
        description: "Seller profile created successfully!"
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create seller profile",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  const updateSeller = async (updates: Partial<Omit<Seller, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!seller) return { data: null, error: new Error('No seller profile found') };

    try {
      const { data, error } = await supabase
        .from('sellers')
        .update(updates)
        .eq('id', seller.id)
        .select()
        .single();

      if (error) throw error;

      setSeller(data);
      toast({
        title: "Success",
        description: "Seller profile updated successfully!"
      });

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update seller profile",
        variant: "destructive"
      });
      return { data: null, error };
    }
  };

  return {
    seller,
    loading,
    createSeller,
    updateSeller,
    refetch: fetchSeller
  };
};