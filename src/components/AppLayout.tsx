
import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  Warehouse, 
  MapPin, 
  Users, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
}

const AppSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navigationItems = [
    { 
      title: "Dashboard", 
      path: "/dashboard", 
      icon: LayoutDashboard 
    },
    { 
      title: "Shipments", 
      path: "/shipments", 
      icon: Truck 
    },
    { 
      title: "Packages", 
      path: "/packages", 
      icon: Package 
    },
    { 
      title: "Carriers", 
      path: "/carriers", 
      icon: Users 
    },
    { 
      title: "Warehouses", 
      path: "/warehouses", 
      icon: Warehouse 
    },
    { 
      title: "Addresses", 
      path: "/addresses", 
      icon: MapPin 
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Package className="h-6 w-6 text-shipping-600" />
        <span className="font-bold text-lg">CargoVision</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button 
          variant="outline" 
          onClick={logout} 
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

// Custom sidebar trigger component that handles the render function
const CustomSidebarTrigger = () => {
  const { state } = useSidebar();
  
  return (
    <SidebarTrigger>
      <Button variant="ghost" size="icon">
        {state.open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </SidebarTrigger>
  );
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1">
          <header className="h-14 border-b flex items-center px-4 sticky top-0 bg-background z-10">
            <CustomSidebarTrigger />
          </header>
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
