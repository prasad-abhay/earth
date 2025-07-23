import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Users,
  Shield,
  Globe,
  MapPin,
  Building,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    id: "admin",
    label: "Admin",
    icon: Shield,
    href: "/dashboard/admin",
  },
  {
    id: "country",
    label: "Countries",
    icon: Globe,
    href: "/dashboard/countries",
  },
  {
    id: "state",
    label: "States",
    icon: MapPin,
    href: "/dashboard/states",
  },
  {
    id: "city",
    label: "Cities",
    icon: Building,
    href: "/dashboard/cities",
  },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!user) return null;

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Earth </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-8 w-8 p-0"
          >
            {sidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems
            .filter((item) => {
              // Show admin-only items only to admins
              if (item.id === "admin") {
                return user.role === "admin";
              }
              return true;
            })
            .map((item) => {
              const IconComponent = item.icon;
              const isGeographicItem = ["country", "state", "city"].includes(
                item.id,
              );

              return (
                <div key={item.id} className="relative">
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 group",
                      !sidebarOpen && "justify-center",
                    )}
                  >
                    <IconComponent className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                    {sidebarOpen && (
                      <>
                        <span className="font-medium flex-1">
                          {item.label}
                          {isGeographicItem && user.role !== "admin" && (
                            <span className="text-xs block text-gray-500">
                              View only
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </a>
                </div>
              );
            })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
            <Badge
              variant={user.role === "admin" ? "default" : "secondary"}
              className={cn(
                user.role === "admin"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-blue-100 text-blue-800",
              )}
            >
              {user.role === "admin" ? "Admin" : "User"}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4 " />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
