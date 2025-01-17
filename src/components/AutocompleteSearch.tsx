import { useEffect, useRef } from "react";

interface AutocompleteSearchProps {
  onPlaceSelected: (location: google.maps.LatLngLiteral) => void;
}

export const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
  onPlaceSelected,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location!.lat(),
          lng: place.geometry.location!.lng(),
        };
        onPlaceSelected(location);
      }
    });
  }, [onPlaceSelected]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for a location..."
      className="w-full p-2"
    />
  );
};
