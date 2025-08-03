import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Globe,
  MapPin,
  Building,
  BarChart3,
  ChevronRight,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      id: "users",
      title: "Manage Users",
      description: "Add, edit, or remove users",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      hoverColor: "hover:bg-blue-50",
      route: "/dashboard/admin",
      adminOnly: true,
    },
    {
      id: "countries",
      title: "Countries",
      description:
        user?.role === "admin" ? "Manage country data" : "View country data",
      icon: Globe,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      hoverColor: "hover:bg-green-50",
      route: "/dashboard/countries",
      adminOnly: false,
    },
    {
      id: "states",
      title: "States",
      description:
        user?.role === "admin"
          ? "Manage state information"
          : "View state information",
      icon: MapPin,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      hoverColor: "hover:bg-orange-50",
      route: "/dashboard/states",
      adminOnly: false,
    },
    {
      id: "cities",
      title: "Cities",
      description:
        user?.role === "admin"
          ? "Manage city information"
          : "View city information",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      hoverColor: "hover:bg-blue-50",
      route: "/dashboard/cities",
      adminOnly: false,
    },
  ];

  if (!user) return null;

  const handleQuickActionClick = (route) => {
    window.location.href = route;
  };

  // Filter quick actions based on user role
  const availableQuickActions = quickActions.filter(
    (action) => !action.adminOnly || user.role === "admin",
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user.name.split(" ")[0]}!
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Quick Actions */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableQuickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={`w-full p-4 h-auto text-left justify-start ${action.hoverColor} ${action.borderColor} transition-colors`}
                    onClick={() => handleQuickActionClick(action.route)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className={`p-2 rounded-lg ${action.bgColor}`}>
                        <IconComponent className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
