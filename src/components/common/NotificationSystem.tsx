import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { removeNotification } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const NotificationSystem = () => {
  const notifications = useAppSelector(state => state.ui.notifications);
  const dispatch = useAppDispatch();

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map(notification => (
        <Card
          key={notification.id}
          className={cn(
            "p-4 shadow-lg border-l-4 animate-in slide-in-from-right",
            {
              'border-l-green-500 bg-green-50 dark:bg-green-950': notification.type === 'success',
              'border-l-red-500 bg-red-50 dark:bg-red-950': notification.type === 'error',
              'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950': notification.type === 'warning',
              'border-l-blue-500 bg-blue-50 dark:bg-blue-950': notification.type === 'info',
            }
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              {notification.message && (
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-2"
              onClick={() => dispatch(removeNotification(notification.id))}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};