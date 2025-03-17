
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      toast.error('Your session has expired. Please log in again.');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response) {
      // Handle other API errors
      const message = error.response.data?.message || 'An error occurred';
      toast.error(message);
    } else if (error.request) {
      // Handle network errors
      toast.error('Network error. Please check your connection.');
    } else {
      // Handle other errors
      toast.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

// Type definitions for API entities
export interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Carrier {
  id?: number;
  name: string;
  code: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  active: boolean;
}

export interface Warehouse {
  id?: number;
  name: string;
  code: string;
  address: Address;
  capacity: number;
  active: boolean;
}

export interface Package {
  id?: number;
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  isFragile: boolean;
  isHazardous: boolean;
  shipmentId?: number;
}

export type ShipmentStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface Shipment {
  id?: number;
  trackingNumber: string;
  status: ShipmentStatus;
  carrier: Carrier;
  originWarehouse: Warehouse;
  destinationWarehouse: Warehouse;
  deliveryAddress: Address;
  packages: Package[];
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  totalWeight: number;
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API functions for CRUD operations

// Addresses
export const getAddresses = () => api.get<Address[]>('/addresses');
export const getAddress = (id: number) => api.get<Address>(`/addresses/${id}`);
export const createAddress = (address: Address) => api.post<Address>('/addresses', address);
export const updateAddress = (id: number, address: Address) => api.put<Address>(`/addresses/${id}`, address);
export const deleteAddress = (id: number) => api.delete(`/addresses/${id}`);

// Carriers
export const getCarriers = () => api.get<Carrier[]>('/carriers');
export const getCarrier = (id: number) => api.get<Carrier>(`/carriers/${id}`);
export const createCarrier = (carrier: Carrier) => api.post<Carrier>('/carriers', carrier);
export const updateCarrier = (id: number, carrier: Carrier) => api.put<Carrier>(`/carriers/${id}`, carrier);
export const deleteCarrier = (id: number) => api.delete(`/carriers/${id}`);

// Warehouses
export const getWarehouses = () => api.get<Warehouse[]>('/warehouses');
export const getWarehouse = (id: number) => api.get<Warehouse>(`/warehouses/${id}`);
export const createWarehouse = (warehouse: Warehouse) => api.post<Warehouse>('/warehouses', warehouse);
export const updateWarehouse = (id: number, warehouse: Warehouse) => api.put<Warehouse>(`/warehouses/${id}`, warehouse);
export const deleteWarehouse = (id: number) => api.delete(`/warehouses/${id}`);

// Packages
export const getPackages = () => api.get<Package[]>('/packages');
export const getPackage = (id: number) => api.get<Package>(`/packages/${id}`);
export const createPackage = (pkg: Package) => api.post<Package>('/packages', pkg);
export const updatePackage = (id: number, pkg: Package) => api.put<Package>(`/packages/${id}`, pkg);
export const deletePackage = (id: number) => api.delete(`/packages/${id}`);

// Shipments
export const getShipments = () => api.get<Shipment[]>('/shipments');
export const getShipment = (id: number) => api.get<Shipment>(`/shipments/${id}`);
export const createShipment = (shipment: Shipment) => api.post<Shipment>('/shipments', shipment);
export const updateShipment = (id: number, shipment: Shipment) => api.put<Shipment>(`/shipments/${id}`, shipment);
export const deleteShipment = (id: number) => api.delete(`/shipments/${id}`);
export const updateShipmentStatus = (id: number, status: ShipmentStatus) => 
  api.patch<Shipment>(`/shipments/${id}/status`, { status });

export default api;
