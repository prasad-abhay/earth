import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Building,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MapPin,
  Globe,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CitiesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewCityDialogOpen, setIsViewCityDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filteredStates, setFilteredStates] = useState([]);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [newCity, setNewCity] = useState({
    name: "",
    code: "",
    stateId: "",
    countryId: "",
  });

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.countryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCity = async () => {
    if (newCity.name && newCity.code && newCity.stateId && newCity.countryId) {
      const selectedState = states.find(
        (s) => s.id?.toString() === newCity.stateId?.toString(),
      );
      const selectedCountry = countries.find(
        (c) => c.id?.toString() === newCity.countryId?.toString(),
      );

      try {
        const cityToAdd = {
          name: newCity.name,
          code: newCity.code.toUpperCase(),
          stateName: selectedState?.name,
          stateId: newCity.stateId,
          countryName: selectedCountry?.name,
          countryId: newCity.countryId,
          createdBy: user.name,
          createdDate: new Date().toISOString().split("T")[0],
        };

        console.log("cityToAdd:", cityToAdd);

        const res = await fetch("http://localhost:3000/api/city", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cityToAdd),
        });

        if (!res.ok) throw new Error("Failed to add city");

        const savedCity = await res.json();

        console.log(savedCity);

        setCities([...cities, savedCity]);
        setNewCity({ name: "", code: "", stateId: "", countryId: "" });
        setIsAddDialogOpen(false);
        alert("City added successfully!");
      } catch (error) {
        console.error("Error adding city:", error);
        alert("Error adding city.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleEditCity = async () => {
    if (
      selectedCity &&
      newCity.name &&
      newCity.code &&
      newCity.stateId &&
      newCity.countryId
    ) {
      const selectedState = states.find(
        (s) => s.id?.toString() === newCity.stateId?.toString(),
      );
      const selectedCountry = countries.find(
        (c) => c.id?.toString() === newCity.countryId?.toString(),
      );

      try {
        const response = await fetch(
          `http://localhost:3000/api/city/${selectedCity.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newCity.name,
              code: newCity.code.toUpperCase(),
              countryId: newCity.countryId,
              countryName: selectedCountry?.name,
              stateId: newCity.stateId,
              stateName: selectedState?.name,
            }),
          },
        );

        if (!response.ok) throw new Error("Failed to update City");

        const updatedCity = await response.json();

        setCities((prev) =>
          prev.map((city) =>
            city.id === selectedCity.id
              ? {
                  ...city,
                  name: newCity.name,
                  code: newCity.code.toUpperCase(),
                  stateId: newCity.stateId,
                  stateName: selectedState?.name || "Unknown",
                  countryId: newCity.countryId,
                  countryName: selectedCountry?.name || "Unknown",
                }
              : city,
          ),
        );

        setNewCity({ name: "", code: "", stateId: "", countryId: "" });
        setSelectedCity(null);
        setIsEditDialogOpen(false);
        alert("City updated successfully!");
      } catch (error) {
        console.error("Error updating city:", error);
        alert("Error updating city.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDeleteCity = async (cityId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this city?",
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/city/${cityId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete city");

      setCities((prevCities) =>
        prevCities.filter((city) => city.id !== cityId),
      );
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Error deleting city.");
    }
  };

  const openEditDialog = (city) => {
    setSelectedCity(city);
    setNewCity({
      name: city.name,
      code: city.code,
      stateId: city.stateId,
      countryId: city.countryId,
    });
    setIsEditDialogOpen(true);
  };

  const openViewCityDialog = (city) => {
    setSelectedCity(city);
    setIsViewCityDialogOpen(true);
  };

  // fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/city");
        const data = await res.json();
        console.log("fetch cities", data);
        const formatted = (data.cities || data).map((city) => {
          return {
            id: city._id,
            name: city.name,
            code: city.code,
            stateName: city.stateName,
            countryName: city.countryName,
            createdBy: city.createdBy,
            createdDate: city.createdDate,
          };
        });
        setCities(formatted);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchCities();
  }, []);

  // fetch states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/state");
        const data = await res.json();
        console.log("fetch states", data);
        const formatted = (data.states || data).map((state) => {
          return {
            id: state._id,
            name: state.name,
            code: state.code,
            countryId: state.countryId,
            countryName: state.countryName,
            createdBy: state.createdBy,
            createdDate: state.createdDate,
          };
        });
        setStates(formatted);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStates();
  }, []);

  // fetch country
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/country");
        const data = await res.json();

        console.log("fetch countries", data);
        const formattedCountries = (data.countries || data).map((country) => ({
          id: country._id,
          name: country.name,
          code: country.code,
        }));
        setCountries(formattedCountries);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
  }, []);

  // filter states
  useEffect(() => {
    if (newCity.countryId) {
      const selectedCountry = countries.find((c) => c.id === newCity.countryId);

      const filtered = states.filter(
        (state) => state.countryName === selectedCountry?.name,
      );

      setFilteredStates(filtered);
      setNewCity((prev) => ({ ...prev, stateId: "" }));
    } else {
      setFilteredStates([]);
    }
  }, [newCity.countryId, states]);

  // Check if current user is admin
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cities Management
              </h1>
              <p className="text-gray-600">View cities information</p>
            </div>
          </div>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only administrators can add, edit, or delete cities. You can only
              view the existing cities.
            </AlertDescription>
          </Alert>

          {/* Read-only view for non-admin users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search cities by name, code, state, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredCities.length} cities
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>All Cities (Read Only)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>City Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCities.map((city, index) => (
                    <TableRow key={city.id || city.name + city.code}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{city.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{city.stateName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{city.countryName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{city.createdBy}</TableCell>
                      <TableCell>{city.createdDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredCities.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No cities found matching your search.
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
            <Building className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Cities Management
              </h1>
              <p className="text-gray-600">
                Manage cities, add new ones, and update existing information
              </p>
            </div>
          </div>

          {/* add city dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New City</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cityName">City Name</Label>
                  <Input
                    id="cityName"
                    value={newCity.name}
                    onChange={(e) =>
                      setNewCity({ ...newCity, name: e.target.value })
                    }
                    placeholder="Enter city name"
                  />
                </div>
                <div>
                  <Label htmlFor="cityCode">City Code</Label>
                  <Input
                    id="cityCode"
                    value={newCity.code}
                    onChange={(e) =>
                      setNewCity({ ...newCity, code: e.target.value })
                    }
                    placeholder="Enter city code (e.g., LA, NYC)"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Belongs to Country</Label>
                  <Select
                    value={newCity.countryId}
                    onValueChange={(value) =>
                      setNewCity({ ...newCity, countryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          key={country.id}
                          value={country.id.toString()}
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4" />
                            <span>
                              {country.name} ({country.code})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="state">Belongs to State</Label>
                  <Select
                    value={newCity.stateId}
                    onValueChange={(value) =>
                      setNewCity({ ...newCity, stateId: value })
                    }
                    disabled={!newCity.countryId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStates.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {state.name} ({state.code})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!newCity.countryId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a country first
                    </p>
                  )}
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
                  <Button onClick={handleAddCity}>Add City</Button>
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
                  placeholder="Search cities by name, code, state, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredCities.length} cities
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Cities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>All Cities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.No</TableHead>
                  <TableHead>City Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.map((city,index) => (
                  <TableRow key={city.id || city.name + city.code}>
                    <TableCell className="font-medium">{index + 1}.</TableCell>
                    <TableCell className="font-medium">{city.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{city.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{city.stateName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span>{city.countryName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{city.createdBy}</TableCell>
                    <TableCell>{city.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewCityDialog(city)}
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(city)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCity(city.id)}
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

            {filteredCities.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No cities found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit City</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCityName">City Name</Label>
                <Input
                  id="editCityName"
                  value={newCity.name}
                  onChange={(e) =>
                    setNewCity({ ...newCity, name: e.target.value })
                  }
                  placeholder="Enter city name"
                />
              </div>
              <div>
                <Label htmlFor="editCityCode">City Code</Label>
                <Input
                  id="editCityCode"
                  value={newCity.code}
                  onChange={(e) =>
                    setNewCity({ ...newCity, code: e.target.value })
                  }
                  placeholder="Enter city code"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="editCountry">Belongs to Country</Label>
                <Select
                  value={newCity.countryId}
                  onValueChange={(value) =>
                    setNewCity({ ...newCity, countryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem
                        key={country.id}
                        value={country.id.toString()}
                      >
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>
                            {country.name} ({country.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editState">Belongs to State</Label>
                <Select
                  value={newCity.stateId}
                  onValueChange={(value) =>
                    setNewCity({ ...newCity, stateId: value })
                  }
                  disabled={!newCity.countryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredStates.map((state) => (
                      <SelectItem key={state.id} value={state.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {state.name} ({state.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedCity(null);
                    setNewCity({
                      name: "",
                      code: "",
                      stateId: "",
                      countryId: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditCity}>Update City</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* view dialog */}
        <Dialog
          open={isViewCityDialogOpen}
          onOpenChange={setIsViewCityDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>City Details</DialogTitle>
            </DialogHeader>
            {selectedCity && (
              <div className="space-y-4">
                <div>
                  <Label>City Name</Label>
                  <p className="text-gray-800">{selectedCity.name}</p>
                </div>
                <div>
                  <Label>City Code</Label>
                  <p className="text-gray-800">{selectedCity.code}</p>
                </div>
                <div>
                  <Label>State</Label>
                  <p className="text-gray-800">{selectedCity.stateName}</p>
                </div>
                <div>
                  <Label>Country</Label>
                  <p className="text-gray-800">{selectedCity.countryName}</p>
                </div>
                <div>
                  <Label>Added By</Label>
                  <p className="text-gray-800">{selectedCity.createdBy}</p>
                </div>
                <div>
                  <Label>Date Added</Label>
                  <p className="text-gray-800">{selectedCity.createdDate}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewCityDialogOpen(false)}
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
