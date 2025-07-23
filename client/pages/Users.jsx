import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This page will contain user management functionality including:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>• View all users</li>
              <li>• Add new users</li>
              <li>• Edit user profiles</li>
              <li>• Manage user permissions</li>
              <li>• User activity tracking</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
