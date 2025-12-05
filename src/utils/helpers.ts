// Helper utility functions

// Get exact address from latitude and longitude using reverse geocoding
export const getExactAddress = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.address) {
      return {
        fullAddress: data.display_name || 'Unknown',
        city: data.address.city || data.address.town || data.address.village || 'Unknown',
        state: data.address.state || 'Unknown',
        country: data.address.country || 'Unknown',
        postcode: data.address.postcode || 'Unknown',
      };
    }
    
    return {
      fullAddress: 'Location not found',
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      postcode: 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching address:', error);
    return {
      fullAddress: 'Error fetching location',
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown',
      postcode: 'Unknown',
    };
  }
};

// Detect device type
export const getDeviceType = (): 'mobile' | 'desktop' => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  return isMobile ? 'mobile' : 'desktop';
};

