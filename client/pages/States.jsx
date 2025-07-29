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
  MapPin,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  Globe,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StatesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isViewStateDialogOpen, setIsViewStateDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedState, setSelectedState] = useState(null);

  const countries = [
    { id: 1, name: "United States", code: "US" },
    { id: 2, name: "Canada", code: "CA" },
    { id: 3, name: "United Kingdom", code: "GB" },
    { id: 4, name: "France", code: "FR" },
    { id: 5, name: "Germany", code: "DE" },
  ];

  const [states, setStates] = useState([]);

  // fetch
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/state");
        const data = await res.json();
        setStates(data);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };

    fetchStates();
  }, []);

  const [newState, setNewState] = useState({
    name: "",
    code: "",
    countryId: "",
  });

  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.countryName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddState = () => {
    if (newState.name && newState.code && newState.countryId) {
      const selectedCountry = countries.find(
        (c) => c.id === parseInt(newState.countryId),
      );
      const now = new Date();
      const state = {
        id: states.length + 1,
        name: newState.name,
        code: newState.code.toUpperCase(),
        countryId: parseInt(newState.countryId),
        countryName: selectedCountry.name,
        addedBy: user.name,
        dateAdded: now.toISOString().split("T")[0],
      };
      setStates([...states, state]);
      setNewState({ name: "", code: "", countryId: "" });
      setIsAddDialogOpen(false);
      alert("User added successfully!");
    } else {
      alert("Please fill in all required fields.");
    }
  };

  // const handleEditState = async () => {
  //   if (selectedState && newState.name && newState.code && newState.countryId) {
  //     const selectedCountry = countries.find(
  //       (c) => c.id === parseInt(newState.countryId),
  //     );

  //     const updatedState = {
  //       ...selectedState,
  //       name: newState.name,
  //       code: newState.code.toUpperCase(),
  //       countryName: selectedCountry.name,
  //     };

  //     try {
  //       const res = await fetch(
  //         `http://localhost:3000/api/state/${selectedState.id}`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(updatedState),
  //         },
  //       );

  //       if (res.ok) {
  //         setStates(
  //           states.map((state) =>
  //             state.id === selectedState.id ? updatedState : state,
  //           ),
  //         );
  //         setNewState({ name: "", code: "", countryId: "" });
  //         setSelectedState(null);
  //         setIsEditDialogOpen(false);
  //         alert("State updated successfully!");
  //       } else {
  //         const errorData = await res.json();
  //         alert(`Failed to update state: ${errorData.message}`);
  //       }
  //     } catch (err) {
  //       console.error("Error updating state:", err);
  //       alert("An error occurred while updating the state.");
  //     }
  //   } else {
  //     alert("Please fill in all required fields.");
  //   }
  // };

  const handleEditState = async () => {
    if (selectedState && newState.name && newState.code && newState.countryId) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/state/:${selectedState.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: newState.name,
              code: newState.code.toUpperCase(),
              countryId: parseInt(newState.countryId),
            }),
          },
        );

        if (!response.ok) throw new Error("Failed to update state");

        // Update local state list
        setStates((prev) =>
          prev.map((s) =>
            s.id === selectedState.id
              ? {
                  ...s,
                  name: newState.name,
                  code: newState.code.toUpperCase(),
                  countryId: parseInt(newState.countryId),
                }
              : s,
          ),
        );

        setNewState({ name: "", code: "", countryId: "" });
        setSelectedState(null);
        setIsEditDialogOpen(false);
        alert("State updated successfully!");
      } catch (error) {
        console.error("Error updating state:", error);
        alert("Error updating state.");
      }
    } else {
      alert("Please fill in all required fields.");
    }
  };

  const handleDeleteState = (stateId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this State?",
    );
    if (confirmed) {
      setStates(states.filter((state) => state.id !== stateId));
    }
  };

  const openEditDialog = (state) => {
    console.log("Opening edit dialog for:", state); // Add this line
    setSelectedState(state);
    setNewState({
      name: state.name,
      code: state.code,
    });
    setIsEditDialogOpen(true);
  };

  const openViewStateDialog = (state) => {
    setSelectedState(state);
    setIsViewStateDialogOpen(true);
  };

  // Check if current user is admin
  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                States Management
              </h1>
              <p className="text-gray-600">
                View states and provinces information
              </p>
            </div>
          </div>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Only administrators can add, edit, or delete states. You can only
              view the existing states.
            </AlertDescription>
          </Alert>

          {/* Read-only view for non-admin users */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search states by name, code, or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredStates.length} states
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>All States (Read Only)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Added By</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStates.map((state) => (
                    <TableRow key={state.id}>
                      <TableCell className="font-medium">
                        {state.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{state.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{state.countryName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{state.addedBy}</TableCell>
                      <TableCell>{state.dateAdded}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredStates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No states found matching your search.
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
            <MapPin className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                States Management
              </h1>
              <p className="text-gray-600">
                Manage states and provinces, add new ones, and update existing
                information
              </p>
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="h-4 w-4 mr-2" />
                Add State
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New State</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="stateName">State Name</Label>
                  <Input
                    id="stateName"
                    value={newState.name}
                    onChange={(e) =>
                      setNewState({ ...newState, name: e.target.value })
                    }
                    placeholder="Enter state name"
                  />
                </div>
                <div>
                  <Label htmlFor="stateCode">State Code</Label>
                  <Input
                    id="stateCode"
                    value={newState.code}
                    onChange={(e) =>
                      setNewState({ ...newState, code: e.target.value })
                    }
                    placeholder="Enter state code (e.g., CA, TX)"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Belongs to Country</Label>
                  <Select
                    value={newState.countryId}
                    onValueChange={(value) =>
                      setNewState({ ...newState, countryId: value })
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
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Button onClick={handleAddState}>Add State</Button>
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
                  placeholder="Search states by name, code, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Badge variant="secondary" className="px-3 py-1">
                {filteredStates.length} states
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* States Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>All States</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStates.map((state) => (
                  <TableRow key={state._id}>
                    <TableCell className="font-medium">{state.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{state.code}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span>{state.countryName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{state.addedBy}</TableCell>
                    <TableCell>{state.dateAdded}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openViewStateDialog(state)}
                          title="View"
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(state)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteState(state.id)}
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

            {filteredStates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No states found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent aria-describedby="edit-state-description">
            <DialogHeader>
              <DialogTitle>Edit State</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editStateName">State Name</Label>
                <Input
                  id="editStateName"
                  value={newState.name}
                  onChange={(e) =>
                    setNewState({ ...newState, name: e.target.value })
                  }
                  placeholder="Enter state name"
                />
              </div>
              <div>
                <Label htmlFor="editStateCode">State Code</Label>
                <Input
                  id="editStateCode"
                  value={newState.code}
                  onChange={(e) =>
                    setNewState({ ...newState, code: e.target.value })
                  }
                  placeholder="Enter state code"
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="editCountry">Belongs to Country</Label>
                <Select
                  value={newState.countryId}
                  onValueChange={(value) =>
                    setNewState({ ...newState, countryId: value })
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
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedState(null);
                    setNewState({ name: "", code: "", countryId: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditState}>Update State</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* view state dialog */}
        <Dialog
          open={isViewStateDialogOpen}
          onOpenChange={setIsViewStateDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>State Details</DialogTitle>
            </DialogHeader>
            {selectedState && (
              <div className="space-y-4">
                <div>
                  <Label>State Name</Label>
                  <p className="text-gray-800">{selectedState.name}</p>
                </div>
                <div>
                  <Label>State Code</Label>
                  <p className="text-gray-800">{selectedState.code}</p>
                </div>
                <div>
                  <Label>Country</Label>
                  <p className="text-gray-800">{selectedState.countryName}</p>
                </div>
                <div>
                  <Label>Added By</Label>
                  <p className="text-gray-800">{selectedState.addedBy}</p>
                </div>
                <div>
                  <Label>Date Added</Label>
                  <p className="text-gray-800">{selectedState.dateAdded}</p>
                </div>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewStateDialogOpen(false)}
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
