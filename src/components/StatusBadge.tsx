
import { ShipmentStatus } from '@/services/api';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ShipmentStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const statusConfig = {
    PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    PICKED_UP: "bg-blue-100 text-blue-800 border border-blue-200",
    IN_TRANSIT: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    DELIVERED: "bg-green-100 text-green-800 border border-green-200",
    CANCELLED: "bg-red-100 text-red-800 border border-red-200",
  };

  const statusText = {
    PENDING: "Pending",
    PICKED_UP: "Picked Up",
    IN_TRANSIT: "In Transit",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };

  return (
    <span className={cn(baseClasses, statusConfig[status], className)}>
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;
