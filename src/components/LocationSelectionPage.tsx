import { motion } from "motion/react";
import { ArrowLeft, MapPin, Navigation, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

interface LocationSelectionPageProps {
  onNavigate: (page: string) => void;
  onSelectLocation: (location: string) => void;
  currentLocation: string;
}

const umLocations = [
  { id: 1, name: "Kolej Kediaman 1", distance: "2.3 km", isNearest: false },
  { id: 2, name: "Kolej Kediaman 12", distance: "0.5 km", isNearest: true },
  { id: 3, name: "Faculty of Engineering", distance: "1.2 km", isNearest: false },
  { id: 4, name: "Faculty of Science", distance: "1.8 km", isNearest: false },
  { id: 5, name: "Academy of Islamic Studies", distance: "2.1 km", isNearest: false },
  { id: 6, name: "Dewan Siswa", distance: "1.5 km", isNearest: false },
  { id: 7, name: "KK12 Food Court", distance: "0.6 km", isNearest: false },
  { id: 8, name: "Central Library", distance: "1.9 km", isNearest: false },
];

export function LocationSelectionPage({
  onNavigate,
  onSelectLocation,
  currentLocation,
}: LocationSelectionPageProps) {
  const { updateUser } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [showWarning, setShowWarning] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const nearestLocation = umLocations.find((loc) => loc.isNearest);

  const handleDetectLocation = () => {
    setDetectingLocation(true);
    setTimeout(() => {
      if (nearestLocation) {
        setSelectedLocation(nearestLocation.name);
        setShowWarning(false);
      }
      setDetectingLocation(false);
    }, 2000);
  };

  const handleSelectLocation = (location: string) => {
    setSelectedLocation(location);
    const isNearest = umLocations.find((loc) => loc.name === location)?.isNearest;
    setShowWarning(!isNearest);
  };

  const handleConfirm = () => {
    onSelectLocation(selectedLocation);
    updateUser({ defaultLocation: selectedLocation });
    onNavigate("home");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pb-20"
    >
      {/* Header */}
      <div className="bg-[#FFD60A] px-6 pt-12 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate("home")} className="text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-gray-900">Delivery Location</h1>
        </div>
      </div>

      {/* Google Map Mock */}
      <div className="w-full h-64 relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15935.364919425766!2d101.65274!3d3.12179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sUniversity%20of%20Malaya!5e0!3m2!1sen!2smy!4v1234567890"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
        {/* Current Location Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 bg-[#FFD60A] rounded-full flex items-center justify-center shadow-lg"
          >
            <MapPin className="w-6 h-6 text-gray-900" />
          </motion.div>
        </div>
      </div>

      {/* Detect Location Button */}
      <div className="px-6 mt-6">
        <Button
          onClick={handleDetectLocation}
          disabled={detectingLocation}
          className="w-full h-14 bg-white border-2 border-[#FFD60A] text-gray-900 hover:bg-[#FFF9E6] rounded-xl mb-6"
        >
          <Navigation className="w-5 h-5 mr-2" />
          {detectingLocation ? "Detecting..." : "Use Current Location"}
        </Button>

        {/* Warning Message */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-4 flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-900 mb-1">Not your current location</p>
              <p className="text-orange-700">
                You've selected a location different from your detected location. Delivery time may vary.
              </p>
            </div>
          </motion.div>
        )}

        {/* Location List */}
        <h2 className="text-gray-900 mb-4">Select Location</h2>
        <div className="space-y-3">
          {umLocations.map((location, index) => (
            <motion.button
              key={location.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectLocation(location.name)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                selectedLocation === location.name
                  ? "border-[#FFD60A] bg-[#FFF9E6]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedLocation === location.name
                        ? "bg-[#FFD60A]"
                        : "bg-gray-100"
                    }`}
                  >
                    <MapPin
                      className={`w-5 h-5 ${
                        selectedLocation === location.name
                          ? "text-gray-900"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-gray-900 flex items-center gap-2">
                      {location.name}
                      {location.isNearest && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">
                          Nearest
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600">{location.distance} away</p>
                  </div>
                </div>
                {selectedLocation === location.name && (
                  <div className="w-6 h-6 bg-[#FFD60A] rounded-full flex items-center justify-center">
                    <span className="text-gray-900">✓</span>
                  </div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 p-6">
        <div className="max-w-[430px] mx-auto">
          <Button
            onClick={handleConfirm}
            className="w-full h-14 bg-[#FFD60A] hover:bg-[#FFC700] text-gray-900 rounded-xl"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
