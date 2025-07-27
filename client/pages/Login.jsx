import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, User, Mail, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password, selectedRole);
    if (!success) {
      setError("Invalid credentials. Please try again.");
    }
  };

  const roleOptions = [
    {
      value: "user",
      label: "User",
      description: "Standard user access",
      icon: User,
      color: "bg-blue-500",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Administrative access",
      icon: Shield,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Earth Management System
          </h2>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <CardTitle className="text-xl font-semibold text-center">
              Sign in to your account
            </CardTitle>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Select your role
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        "relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105",
                        selectedRole === role.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-gray-300",
                      )}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div
                          className={cn(
                            "p-2 rounded-lg text-white",
                            role.color,
                          )}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">{role.label}</p>
                          <p className="text-xs text-gray-500">
                            {role.description}
                          </p>
                        </div>
                      </div>
                      {selectedRole === role.value && (
                        <Badge className="absolute -top-2 -right-2 bg-blue-500">
                          ✓
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardHeader>

          {/* credentials field */}
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 h-11"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
            <div className="demo text-center">
              <p>Demo: Enter any Email and Password to login</p> 
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
