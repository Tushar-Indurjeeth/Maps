import { useState, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { AutocompleteSearch } from "./components/AutocompleteSearch";

const mapContainerStyle = { width: "100%", height: "100vh" };
const center = { lat: -26.136172, lng: 28.066629 };

type Library = "places" | "marker" | "geometry";
const LIBRARIES: Library[] = ["places", "marker", "geometry"];

const App = () => {
  const [, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Function to fetch location details using Geocoding API
  const fetchLocationDetails = async (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latLng = { lat, lng };

    return new Promise<string>((resolve, reject) => {
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results![0]) {
          resolve(results![0].formatted_address); // Return the first result's address
        } else {
          reject("No address found.");
        }
      });
    });
  };

  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (event.latLng && mapRef.current) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(location);

      // Fetch location details
      try {
        const address = await fetchLocationDetails(location.lat, location.lng);
        const infoContent = `
        <div class="p-4 max-w-xs rounded-lg bg-white shadow-md border border-gray-200">
            <p class="text-xl font-semibold text-blue-500">Location Details</p>
            <p class="text-sm text-gray-600 mt-2">Coordinates: 
              <span class="font-mono text-gray-800">(${location.lat.toFixed(
                4
              )}, ${location.lng.toFixed(4)})</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">Address:</p> 
            <p class="font-medium text-gray-800">${address}</p>
          </div>`;

        // Add marker and InfoWindow
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapRef.current,
        });

        // Create or update InfoWindow
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapRef.current, marker);
      } catch (error) {
        console.error("Error fetching location details:", error);
      }
    }
  };

  const handlePlaceSelected = async (location: google.maps.LatLngLiteral) => {
    setSelectedLocation(location);

    if (mapRef.current) {
      mapRef.current.panTo(location);

      // Fetch location details
      try {
        const address = await fetchLocationDetails(location.lat, location.lng);
        const infoContent = `
        <div class="p-4 max-w-xs rounded-lg bg-white shadow-md border border-gray-200">
            <p class="text-xl font-semibold text-blue-500">Place Details</p>
            <p class="text-sm text-gray-600 mt-2">Coordinates: 
              <span class="font-mono text-gray-800">(${location.lat.toFixed(
                4
              )}, ${location.lng.toFixed(4)})</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">Address:</p> 
            <p class="font-medium text-gray-800">${address}</p>
        </div>`;

        // Add marker and InfoWindow
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: location,
          map: mapRef.current,
        });

        // Create or update InfoWindow
        if (!infoWindowRef.current) {
          infoWindowRef.current = new google.maps.InfoWindow();
        }
        infoWindowRef.current.setContent(infoContent);
        infoWindowRef.current.open(mapRef.current, marker);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
    >
      <AutocompleteSearch onPlaceSelected={handlePlaceSelected} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={(map) => {
          mapRef.current = map;
        }}
        onClick={handleMapClick}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAPS_KEY,
        }}
      />
    </LoadScript>
  );
};

export default App;
