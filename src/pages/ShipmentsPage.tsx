
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getShipments, ShipmentStatus } from '@/services/api';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Search, Filter } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';

const ShipmentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await getShipments();
      return response.data;
    },
  });

  // Mock data for when API is not available
  const mockShipments = [
    { 
      id: 1, 
      trackingNumber: 'TRK12345', 
      status: 'PENDING' as ShipmentStatus, 
      estimatedDeliveryDate: '2023-07-25', 
      carrier: { name: 'FastShip' },
      originWarehouse: { name: 'Chicago Warehouse' },
      destinationWarehouse: { name: 'New York Warehouse' },
      totalWeight: 45.5 
    },
    { 
      id: 2, 
      trackingNumber: 'TRK12346', 
      status: 'IN_TRANSIT' as ShipmentStatus, 
      estimatedDeliveryDate: '2023-07-24', 
      carrier: { name: 'ExpressLogistics' },
      originWarehouse: { name: 'Los Angeles Warehouse' },
      destinationWarehouse: { name: 'Miami Warehouse' },
      totalWeight: 12.3 
    },
    { 
      id: 3, 
      trackingNumber: 'TRK12347', 
      status: 'DELIVERED' as ShipmentStatus, 
      actualDeliveryDate: '2023-07-22', 
      carrier: { name: 'Global Carriers' },
      originWarehouse: { name: 'Seattle Warehouse' },
      destinationWarehouse: { name: 'Boston Warehouse' },
      totalWeight: 5.2 
    },
    { 
      id: 4, 
      trackingNumber: 'TRK12348', 
      status: 'PICKED_UP' as ShipmentStatus, 
      estimatedDeliveryDate: '2023-07-26', 
      carrier: { name: 'FastShip' },
      originWarehouse: { name: 'Dallas Warehouse' },
      destinationWarehouse: { name: 'Chicago Warehouse' },
      totalWeight: 18.7 
    },
    { 
      id: 5, 
      trackingNumber: 'TRK12349', 
      status: 'DELIVERED' as ShipmentStatus, 
      actualDeliveryDate: '2023-07-21', 
      carrier: { name: 'ExpressLogistics' },
      originWarehouse: { name: 'Atlanta Warehouse' },
      destinationWarehouse: { name: 'San Francisco Warehouse' },
      totalWeight: 9.1 
    },
    { 
      id: 6, 
      trackingNumber: 'TRK12350', 
      status: 'IN_TRANSIT' as ShipmentStatus, 
      estimatedDeliveryDate: '2023-07-23', 
      carrier: { name: 'Global Carriers' },
      originWarehouse: { name: 'Portland Warehouse' },
      destinationWarehouse: { name: 'Phoenix Warehouse' },
      totalWeight: 3.4 
    },
    { 
      id: 7, 
      trackingNumber: 'TRK12351', 
      status: 'CANCELLED' as ShipmentStatus, 
      carrier: { name: 'FastShip' },
      originWarehouse: { name: 'Denver Warehouse' },
      destinationWarehouse: { name: 'Salt Lake City Warehouse' },
      totalWeight: 7.8 
    },
    { 
      id: 8, 
      trackingNumber: 'TRK12352', 
      status: 'PENDING' as ShipmentStatus, 
      estimatedDeliveryDate: '2023-07-27', 
      carrier: { name: 'ExpressLogistics' },
      originWarehouse: { name: 'Houston Warehouse' },
      destinationWarehouse: { name: 'New Orleans Warehouse' },
      totalWeight: 14.2 
    },
  ];

  const shipmentsData = shipments || mockShipments;

  // Filter the shipments
  const filteredShipments = shipmentsData.filter(shipment => {
    const matchesSearch = 
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.originWarehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destinationWarehouse.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (id: number) => {
    navigate(`/shipments/${id}`);
  };

  const handleCreateShipment = () => {
    navigate('/shipments/new');
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[calc(100vh-8rem)] flex justify-center items-center">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Error</p>
          <p>Failed to load shipments. Please try again later.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
            <p className="text-muted-foreground">Manage all your shipments</p>
          </div>
          <Button onClick={handleCreateShipment} className="bg-shipping-600 hover:bg-shipping-700">
            <Plus className="h-4 w-4 mr-2" />
            New Shipment
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead className="text-right">Weight (kg)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No shipments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((shipment) => (
                  <TableRow 
                    key={shipment.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(shipment.id!)}
                  >
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>
                      <StatusBadge status={shipment.status} />
                    </TableCell>
                    <TableCell>{shipment.carrier.name}</TableCell>
                    <TableCell>{shipment.originWarehouse.name}</TableCell>
                    <TableCell>{shipment.destinationWarehouse.name}</TableCell>
                    <TableCell>
                      {shipment.actualDeliveryDate ? 
                        new Date(shipment.actualDeliveryDate).toLocaleDateString() : 
                        shipment.estimatedDeliveryDate ? 
                          new Date(shipment.estimatedDeliveryDate).toLocaleDateString() : 
                          'N/A'}
                    </TableCell>
                    <TableCell className="text-right">{shipment.totalWeight.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ShipmentsPage;
