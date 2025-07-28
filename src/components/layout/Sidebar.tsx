import { Link, useLocation } from 'react-router-dom';
import { X, Home, Package, ShoppingCart, User, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'Orders', href: '/orders', icon: Package },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: User },
];

export const Sidebar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const sidebarOpen = useAppSelector(state => state.ui.sidebarOpen);

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super-admin';

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        onClick={() => dispatch(setSidebarOpen(false))}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">QuickMart</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(setSidebarOpen(false))}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => dispatch(setSidebarOpen(false))}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <>
              <Separator className="my-4" />
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Admin
                </h3>
              </div>
              {adminNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    onClick={() => dispatch(setSidebarOpen(false))}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>
      </div>
    </>
  );
};