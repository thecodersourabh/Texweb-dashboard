import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface SimpleLocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
  className?: string;
}

export const SimpleLocationPicker: React.FC<SimpleLocationPickerProps> = ({
  onLocationSelect,
  initialPosition,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(
    initialPosition || null
  );
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates([latitude, longitude]);
        onLocationSelect(latitude, longitude);
        setIsLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setError(errorMessage);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Location</h4>
          <p className="text-xs text-gray-500">
            Get your current location for more accurate delivery
          </p>
        </div>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isLoading ? 'Getting Location...' : 'Get Current Location'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {coordinates && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Location captured successfully!
              </p>
              <p className="text-xs text-green-600">
                Coordinates: {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>* Location permission is required to use this feature</p>
        <p>* Your location will be used for delivery purposes only</p>
      </div>
    </div>
  );
};
