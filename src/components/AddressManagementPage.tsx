import { motion } from "motion/react";
import { ArrowLeft, MapPin, Plus, Home, Briefcase, Star, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useNotification } from "../hooks/useNotification";

interface AddressManagementPageProps {
  onNavigate: (page: string) => void;
}

interface Address {
  id: number;
  label: string;
  address: string;
  details: string;
  isDefault: boolean;
  icon: "home" | "work" | "other";
}

export function AddressManagementPage({ onNavigate }: AddressManagementPageProps) {
  const { showNotification } = useNotification();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      label: "Home",
      address: "Kolej Kediaman 12",
      details: "Block A, Room 305",
      isDefault: true,
      icon: "home",
    },
    {
      id: 2,
      label: "Faculty",
      address: "Faculty of Engineering",
      details: "Office 3-45",
      isDefault: false,
      icon: "work",
    },
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    address: "",
    details: "",
    icon: "other" as "home" | "work" | "other",
  });

  const getIcon = (iconType: "home" | "work" | "other") => {
    switch (iconType) {
      case "home":
        return <Home className="w-5 h-5" />;
      case "work":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      showNotification("error", "Please fill in required fields");
      return;
    }

    const address: Address = {
      id: Date.now(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setNewAddress({ label: "", address: "", details: "", icon: "other" });
    setShowAddDialog(false);
    showNotification("success", "Address added successfully!");
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    showNotification("success", "Default address updated!");
  };

  const handleDeleteAddress = (id: number) => {
    const addressToDelete = addresses.find((addr) => addr.id === id);
    if (addressToDelete?.isDefault && addresses.length > 1) {
      showNotification("error", "Please set another address as default first");
      return;
    }
    setAddresses(addresses.filter((addr) => addr.id !== id));
    showNotification("success", "Address deleted!");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white dark:bg-gray-900 pb-20 transition-colors duration-300"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] dark:bg-yellow-600 px-6 pt-12 pb-8 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate("profile")} className="text-gray-900 dark:text-white">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-gray-900 dark:text-white">My Addresses</h1>
          </div>
          <button
            onClick={() => setShowAddDialog(true)}
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-gray-900 dark:text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-6">
        {addresses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-2">No saved addresses</p>
            <p className="text-gray-500 dark:text-gray-500 mb-6">
              Add an address to get started
            </p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Address
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 p-4 transition-colors duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#FFD60A] dark:bg-yellow-600 rounded-full flex items-center justify-center text-gray-900 dark:text-white">
                    {getIcon(address.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-gray-900 dark:text-white">{address.label}</h3>
                      {address.isDefault && (
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs">Default</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 dark:text-gray-200 mb-1">
                      {address.address}
                    </p>
                    {address.details && (
                      <p className="text-gray-500 dark:text-gray-400">{address.details}</p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="text-[#FFD60A] dark:text-yellow-500 hover:underline"
                        >
                          Set as default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-red-600 dark:text-red-400 hover:underline ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-3xl border-2 border-gray-100 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Label *
              </label>
              <Input
                placeholder="e.g., Home, Work, Dorm"
                className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Address *
              </label>
              <Input
                placeholder="e.g., Kolej Kediaman 12"
                className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Additional Details
              </label>
              <Input
                placeholder="e.g., Block A, Room 305"
                className="rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={newAddress.details}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, details: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <div className="flex gap-2">
                {(["home", "work", "other"] as const).map((iconType) => (
                  <button
                    key={iconType}
                    type="button"
                    onClick={() => setNewAddress({ ...newAddress, icon: iconType })}
                    className={`flex-1 p-3 rounded-xl border-2 transition-colors ${
                      newAddress.icon === iconType
                        ? "border-[#FFD60A] dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {getIcon(iconType)}
                      <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                        {iconType}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => setShowAddDialog(false)}
                variant="outline"
                className="flex-1 rounded-xl dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAddress}
                className="flex-1 bg-[#FFD60A] hover:bg-[#FFC700] dark:bg-yellow-600 dark:hover:bg-yellow-700 text-gray-900 dark:text-white rounded-xl"
              >
                Add Address
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
