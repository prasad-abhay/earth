import { useState } from "react";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CountriesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewCountryDialogOpen, setIsViewCountryDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);

  const [newCountry, setNewCountry] = useState({
    name: "",
    code: "",
  });

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCountry = async () => {
    if (newCountry.name && newCountry.code) {
      try {
        const response = await fetch("http://localhost:3000/api/country", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newCountry.name,
            code: newCountry.code.toUpperCase(),
            addedBy: user._id,
            dateAdded: new Date().toISOString().split("T")[0],
          }),
        });

        if (!response.ok) throw new Error("Failed to add country");

        const savedCountry = await response.json();

        const formatted = {
          id: savedCountry._id,
          name: savedCountry.name,
          code: savedCountry.code,
          addedBy: user.name,
          dateAdded: new Date(savedCountry.createdAt)
            .toISOString()
            .split("T")[0],
        };

        setCountries((prev) => [...prev, formatted]);
        setNewCountry({ name: "", code: "" });
        setIsAddDialogOpen(false);
        alert("Country added successfully!");
      } catch (error) {
        console.error("Error adding country:", error);
        alert("Error adding country.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleEditCountry = async () => {
    if (selectedCountry && newCountry.name && newCountry.code) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/country/${selectedCountry.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newCountry.name,
              code: newCountry.code.toUpperCase(),
            }),
          },
        );

        if (!response.ok) throw new Error("Failed to update country");

        setCountries((prev) =>
          prev.map((c) =>
            c.id === selectedCountry.id
              ? {
                  ...c,
                  name: newCountry.name,
                  code: newCountry.code.toUpperCase(),
                }
              : c,
          ),
        );
        setNewCountry({ name: "", code: "" });
        setSelectedCountry(null);
        setIsEditDialogOpen(false);
        alert("Country updated successfully!");
      } catch (error) {
        console.error("Error updating country:", error);
        alert("Error updating country.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDeleteCountry = async (countryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Country?",
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/country/${countryId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete country");

      setCountries((prev) =>
        prev.filter((country) => country.id !== countryId),
      );
    } catch (error) {
      console.error("Error deleting country:", error);
      alert("Error deleting country.");
    }
  };

  const openEditDialog = (country) => {
    setSelectedCountry(country);
    setNewCountry({ name: country.name, code: country.code });
    setIsEditDialogOpen(true);
  };

  const openViewCountryDialog = (country) => {
    setSelectedCountry(country);
    setIsViewCountryDialogOpen(true);
  };

  // fetch country
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/country");
        const data = await response.json();
        console.log(data);
        const formatted = (data.countries || data).map((country) => {

          return {
            id: country._id,
            name: country.name,
            code: country.countryCode,
            addedBy:country.createdBy,
            dateAdded:country.createDate
          };
        });

        setCountries(formatted);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Check if current user is admin
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Countries Management
              </h1>
              <p className="text-gray-600">View countries information</p>
            </div>
          </div>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only administrators can add, edit, or delete countries. You can
              only view the existing countries.
            </AlertDescription>
          </Alert>

          {/* Read-only view for non-admin users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search countries by name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredCountries.length} countries
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>All Countries (Read Only)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell className="font-medium">
                        {country.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{country.code}</Badge>
                      </TableCell>
                      <TableCell>{country.addedBy}</TableCell>
                      <TableCell>{country.dateAdded}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredCountries.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No countries found matching your search.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Countries Management
              </h1>
              <p className="text-gray-600">
                Manage countries, add new ones, and update existing information
              </p>
            </div>
          </div>
          {/* add country dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Country
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Country</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="countryName">Country Name</Label>
                  <Input
                    id="countryName"
                    value={newCountry.name}
                    onChange={(e) =>
                      setNewCountry({ ...newCountry, name: e.target.value })
                    }
                    placeholder="Enter country name"
                  />
                </div>
                <div>
                  <Label htmlFor="countryCode">Country Code</Label>
                  <Input
                    id="countryCode"
                    value={newCountry.code}
                    onChange={(e) =>
                      setNewCountry({ ...newCountry, code: e.target.value })
                    }
                    placeholder="Enter country code (e.g., US, CA)"
                    maxLength={3}
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Added by: {user.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Date: {new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCountry}>Add Country</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search countries by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredCountries.length} countries
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Countries Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>All Countries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell className="font-medium">
                      {country.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{country.code}</Badge>
                    </TableCell>
                    <TableCell>{country.addedBy}</TableCell>
                    <TableCell>{country.dateAdded}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex item-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewCountryDialog(country)}
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(country)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCountry(country.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredCountries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No countries found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Country</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCountryName">Country Name</Label>
                <Input
                  id="editCountryName"
                  value={newCountry.name}
                  onChange={(e) =>
                    setNewCountry({ ...newCountry, name: e.target.value })
                  }
                  placeholder="Enter country name"
                />
              </div>
              <div>
                <Label htmlFor="editCountryCode">Country Code</Label>
                <Input
                  id="editCountryCode"
                  value={newCountry.code}
                  onChange={(e) =>
                    setNewCountry({ ...newCountry, code: e.target.value })
                  }
                  placeholder="Enter country code"
                  maxLength={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCountry(null);
                    setNewCountry({ name: "", code: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditCountry}>Update Country</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* view country dialog */}
        <Dialog
          open={isViewCountryDialogOpen}
          onOpenChange={setIsViewCountryDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Country Details</DialogTitle>
            </DialogHeader>
            {selectedCountry && (
              <div className="space-y-4">
                <div>
                  <Label>Country Name</Label>
                  <p className="text-gray-800">{selectedCountry.name}</p>
                </div>
                <div>
                  <Label>Country Code</Label>
                  <p className="text-gray-800">{selectedCountry.code}</p>
                </div>
                <div>
                  <Label>Added By</Label>
                  <p className="text-gray-800">{selectedCountry.addedBy}</p>
                </div>
                <div>
                  <Label>Date Added</Label>
                  <p className="text-gray-800">{selectedCountry.dateAdded}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewCountryDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
