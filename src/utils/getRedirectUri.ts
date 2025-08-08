export const getRedirectUri = () => {
  // Check if running in Capacitor (mobile app)
  const isCapacitor = window.location.protocol === 'capacitor:';
  const isDeployed = window.location.hostname === 'thecodersourabh.github.io';

  if (isCapacitor) {
    return 'com.salvatore.app://callback';
  }
  
  if (isDeployed) {
    return 'https://thecodersourabh.github.io/TexWeb-dashboard/';
  }
  
  // For development, use fixed localhost URL that matches Auth0 config
  return 'http://localhost:5173/Texweb-dashboard/';
};

export const getLogoutUri = () => {
  const isDeployed = window.location.hostname === 'thecodersourabh.github.io';
  
  if (isDeployed) {
    return 'https://thecodersourabh.github.io/TexWeb-dashboard/#/';
  }
  
  // For development, use fixed localhost URL
  return 'http://localhost:5173/Texweb-dashboard/#/';
};
