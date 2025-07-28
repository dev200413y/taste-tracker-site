import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addItemLocally, updateItemLocally } from '@/store/slices/cartSlice';
import { addNotification } from '@/store/slices/uiSlice';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = ({ product, className }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const cartItems = useAppSelector(state => state.cart.items);
  const cartItem = cartItems.find(item => item.product_id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    dispatch(addItemLocally({ product, quantity: 1 }));
    dispatch(addNotification({
      type: 'success',
      title: 'Added to cart',
      message: `${product.name} has been added to your cart`,
      duration: 3000,
    }));
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (cartItem) {
      dispatch(updateItemLocally({ id: cartItem.id, quantity: newQuantity }));
    }
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    dispatch(addNotification({
      type: isWishlisted ? 'info' : 'success',
      title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      message: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
      duration: 3000,
    }));
  };

  const discountPercentage = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];

  return (
    <Card className={cn("group hover:shadow-lg transition-all duration-200", className)}>
      <CardContent className="p-4">
        {/* Image */}
        <div className="relative aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
          <Link to={`/products/${product.id}`}>
            {primaryImage ? (
              <img
                src={primaryImage.url}
                alt={primaryImage.alt_text || product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                📦
              </div>
            )}
          </Link>
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
            onClick={handleToggleWishlist}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
              )} 
            />
          </Button>

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Stock Status */}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <Link to={`/products/${product.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {product.brand && (
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          )}

          {/* Rating */}
          {product.rating_average > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-muted-foreground">
                {product.rating_average.toFixed(1)} ({product.rating_count})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm">₹{product.price}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{product.compare_price}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          {product.stock_quantity > 0 && (
            <div className="pt-2">
              {quantity === 0 ? (
                <Button
                  onClick={handleAddToCart}
                  size="sm"
                  className="w-full"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              ) : (
                <div className="flex items-center justify-between border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium px-2">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateQuantity(quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};