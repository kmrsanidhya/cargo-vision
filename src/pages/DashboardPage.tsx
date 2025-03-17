
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getShipments, ShipmentStatus } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import AppLayout from '@/components/AppLayout';
import { Package, Truck, Check, AlertTriangle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  
  const { data: shipments, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const response = await getShipments();
      return response.data;
    },
  });

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
          <p>Failed to load dashboard data. Please try again later.</p>
        </div>
      </AppLayout>
    );
  }

  // If API is not available, use mock data
  const mockShipments = [
    { id: 1, trackingNumber: 'TRK12345', status: 'PENDING' as ShipmentStatus, estimatedDeliveryDate: '2023-07-25', totalWeight: 45.5 },
    { id: 2, trackingNumber: 'TRK12346', status: 'IN_TRANSIT' as ShipmentStatus, estimatedDeliveryDate: '2023-07-24', totalWeight: 12.3 },
    { id: 3, trackingNumber: 'TRK12347', status: 'DELIVERED' as ShipmentStatus, actualDeliveryDate: '2023-07-22', totalWeight: 5.2 },
    { id: 4, trackingNumber: 'TRK12348', status: 'PICKED_UP' as ShipmentStatus, estimatedDeliveryDate: '2023-07-26', totalWeight: 18.7 },
    { id: 5, trackingNumber: 'TRK12349', status: 'DELIVERED' as ShipmentStatus, actualDeliveryDate: '2023-07-21', totalWeight: 9.1 },
    { id: 6, trackingNumber: 'TRK12350', status: 'IN_TRANSIT' as ShipmentStatus, estimatedDeliveryDate: '2023-07-23', totalWeight: 3.4 },
    { id: 7, trackingNumber: 'TRK12351', status: 'CANCELLED' as ShipmentStatus, totalWeight: 7.8 },
    { id: 8, trackingNumber: 'TRK12352', status: 'PENDING' as ShipmentStatus, estimatedDeliveryDate: '2023-07-27', totalWeight: 14.2 },
  ];

  const shipmentsData = shipments || mockShipments;

  // Process data for metrics and charts
  const totalShipments = shipmentsData.length;
  const inTransitCount = shipmentsData.filter(s => s.status === 'IN_TRANSIT').length;
  const deliveredCount = shipmentsData.filter(s => s.status === 'DELIVERED').length;
  const pendingCount = shipmentsData.filter(s => s.status === 'PENDING').length;
  const totalWeight = shipmentsData.reduce((sum, s) => sum + s.totalWeight, 0);

  const statusCounts = [
    { name: 'Pending', value: pendingCount, color: '#f59e0b' },
    { name: 'Picked Up', value: shipmentsData.filter(s => s.status === 'PICKED_UP').length, color: '#3b82f6' },
    { name: 'In Transit', value: inTransitCount, color: '#6366f1' },
    { name: 'Delivered', value: deliveredCount, color: '#10b981' },
    { name: 'Cancelled', value: shipmentsData.filter(s => s.status === 'CANCELLED').length, color: '#ef4444' },
  ];

  // Weekly data for bar chart (mock data as we don't have real-time series data)
  const weeklyData = [
    { day: 'Mon', pending: 5, inTransit: 8, delivered: 3 },
    { day: 'Tue', pending: 3, inTransit: 10, delivered: 5 },
    { day: 'Wed', pending: 4, inTransit: 7, delivered: 8 },
    { day: 'Thu', pending: 2, inTransit: 9, delivered: 10 },
    { day: 'Fri', pending: 6, inTransit: 11, delivered: 7 },
    { day: 'Sat', pending: 4, inTransit: 8, delivered: 12 },
    { day: 'Sun', pending: 3, inTransit: 5, delivered: 9 },
  ];

  const handleShipmentClick = (id: number) => {
    navigate(`/shipments/${id}`);
  };

  return (
    <AppLayout>
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your shipping operations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShipments}</div>
              <p className="text-xs text-muted-foreground">Active shipments in the system</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransitCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((inTransitCount / totalShipments) * 100)}% of shipments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{deliveredCount}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((deliveredCount / totalShipments) * 100)}% of shipments
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWeight.toFixed(2)} kg</div>
              <p className="text-xs text-muted-foreground">Across all shipments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
            <TabsTrigger value="recent">Recent Shipments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Shipment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusCounts}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusCounts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Status Summary</CardTitle>
                  <CardDescription>Current shipment statuses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {statusCounts.map(status => (
                      <div key={status.name} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: status.color }} />
                        <div className="flex-1 font-medium">{status.name}</div>
                        <div className="text-muted-foreground">{status.value}</div>
                        <div className="ml-2 text-muted-foreground">
                          ({Math.round((status.value / totalShipments) * 100)}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Shipment Activity</CardTitle>
                <CardDescription>Number of shipments by status over the past week</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
                      <Bar dataKey="inTransit" name="In Transit" fill="#6366f1" />
                      <Bar dataKey="delivered" name="Delivered" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Shipments</CardTitle>
                <CardDescription>Latest shipment updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {shipmentsData.slice(0, 5).map((shipment) => (
                    <div 
                      key={shipment.id} 
                      className="flex items-center cursor-pointer hover:bg-gray-50 rounded-md p-2 transition-colors"
                      onClick={() => handleShipmentClick(shipment.id!)}
                    >
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-full bg-shipping-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-shipping-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{shipment.trackingNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {shipment.actualDeliveryDate ? 
                            `Delivered on ${new Date(shipment.actualDeliveryDate).toLocaleDateString()}` : 
                            shipment.estimatedDeliveryDate ? 
                              `Est. delivery: ${new Date(shipment.estimatedDeliveryDate).toLocaleDateString()}` : 
                              'No delivery date'}
                        </div>
                      </div>
                      <StatusBadge status={shipment.status} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
