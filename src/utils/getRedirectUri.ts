export const getRedirectUri = () => {
  const isDeployed = window.location.hostname === 'thecodersourabh.github.io';
  
  if (isDeployed) {
    return 'https://thecodersourabh.github.io/TexWeb-dashboard/';
  }
  
  // For development, use fixed localhost URL that matches Auth0 config
  return 'http://localhost:5174/Texweb-dashboard/';
};

export const getLogoutUri = () => {
  const isDeployed = window.location.hostname === 'thecodersourabh.github.io';
  
  if (isDeployed) {
    return 'https://thecodersourabh.github.io/TexWeb-dashboard/#/';
  }
  
  // For development, use fixed localhost URL
  return 'http://localhost:5174/Texweb-dashboard/#/';
};
