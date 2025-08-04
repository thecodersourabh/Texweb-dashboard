import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Home, 
  Building2, 
  Briefcase,
  Edit, 
  Trash,
  X,
  Navigation,
  Loader2
} from 'lucide-react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  IonCheckbox,
  IonToast,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonLoading,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';

interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export const Addresses = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false,
    latitude: undefined,
    longitude: undefined
  });
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      pincode: '10001',
      phone: '123-456-7890',
      isDefault: true,
      latitude: 40.7128,
      longitude: -74.0060
    }
  ]);

  const getAddressIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'office':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const handleDelete = (id: string) => {
    setAddressToDelete(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    setAddresses(addresses.filter(address => address.id !== addressToDelete));
    setShowDeleteAlert(false);
    setAddressToDelete('');
    setToastMessage('Address deleted successfully');
    setShowToast(true);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id
    })));
    setToastMessage('Default address updated');
    setShowToast(true);
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check for Indian mobile number patterns
    // Valid patterns: 10 digits starting with 6-9, or 11 digits starting with 0, or 12-13 digits starting with +91
    if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
      return true; // Standard 10-digit mobile
    }
    if (cleanPhone.length === 11 && /^0[6-9]/.test(cleanPhone)) {
      return true; // 11-digit with leading 0
    }
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91') && /^91[6-9]/.test(cleanPhone)) {
      return true; // 12-digit with country code 91
    }
    if (cleanPhone.length === 13 && cleanPhone.startsWith('091')) {
      return true; // 13-digit with 091
    }
    
    return false;
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    
    try {
      // Use Capacitor's native geolocation service for better accuracy and permissions handling
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
      });

      const { latitude, longitude } = position.coords;
      
      try {
        // Use BigDataCloud API - free, no API key required, very accurate for PIN codes
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        let data = null;
        if (response.ok) {
          data = await response.json();
          console.log('BigDataCloud data received:', data);
          console.log('Available fields:', Object.keys(data || {}));
        }
        
        // If BigDataCloud doesn't provide sufficient data, try OpenStreetMap Nominatim as backup
        if (!data || (!data.locality && !data.city && !data.postcode && !data.principalSubdivision)) {
          console.log('Trying OpenStreetMap Nominatim as backup...');
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (nominatimResponse.ok) {
            const nominatimData = await nominatimResponse.json();
            console.log('Nominatim data received:', nominatimData);
            
            // Transform Nominatim data to match our expected format
            if (nominatimData.address) {
              data = {
                ...data,
                city: nominatimData.address.city || nominatimData.address.town || nominatimData.address.village || nominatimData.address.municipality,
                locality: nominatimData.address.suburb || nominatimData.address.neighbourhood || nominatimData.address.hamlet,
                postcode: nominatimData.address.postcode,
                principalSubdivision: nominatimData.address.state || nominatimData.address.province,
                countrySecondarySubdivision: nominatimData.address.state_district || nominatimData.address.county,
                // Additional mappings
                town: nominatimData.address.town,
                village: nominatimData.address.village,
                municipality: nominatimData.address.municipality,
                district: nominatimData.address.district,
                state: nominatimData.address.state,
                province: nominatimData.address.province,
                region: nominatimData.address.region
              };
              console.log('Merged data with Nominatim:', data);
            }
          }
        }
        
        // Make condition more flexible - check if we have any useful data
        if (data && (data.locality || data.city || data.postcode || data.principalSubdivision)) {
          // Extract city with multiple fallback options
          let city = '';
          const cityFields = [
            data.city,
            data.locality,
            data.localityInfo?.administrative?.[2]?.name,
            data.localityInfo?.administrative?.[1]?.name,
            data.principalSubdivisionCode,
            data.countrySubdivision,
            // Additional fallback fields
            data.town,
            data.village,
            data.municipality,
            data.district
          ];
          
          // Get the first valid city (non-numeric, meaningful length, not a PIN code)
          city = cityFields.find(field => 
            field && 
            typeof field === 'string' && 
            field.length > 2 && 
            field.length < 50 && // Reasonable max length for city names
            !/^\d+$/.test(field) && // Not purely numeric
            !/^\d{5,6}$/.test(field) // Not a PIN code
          ) || '';
          
          // Extract PIN code with comprehensive fallback options - check all possible fields
          let pincode = '';
          const pincodeFields = [
            data.postcode,
            data.postalCode,
            data.zipcode,  
            data.zip,
            data.postal_code,
            data.postalCodeNumber,
            data.postCode,
            // Additional fields that might contain postal codes
            data.zipCode,
            data.postalcode,
            data.pin,
            data.pincode
          ];
          
          // Also check administrative levels for postal codes (sometimes stored there)
          if (data.localityInfo?.administrative) {
            data.localityInfo.administrative.forEach((admin: { name?: string }) => {
              if (admin.name && /^\d{5,6}$/.test(admin.name)) {
                pincodeFields.push(admin.name);
              }
            });
          }
          
          // Get the first valid pincode (numeric and 5-6 digits)
          pincode = pincodeFields.find(field => 
            field && 
            field.toString().length >= 5 && 
            /^\d{5,6}$/.test(field.toString())
          ) || '';
          
          // Extract state with multiple fallback options first (needed for PIN code fallback)
          let state = '';
          const stateFields = [
            data.principalSubdivision,
            data.countrySecondarySubdivision,
            data.localityInfo?.administrative?.[0]?.name,
            data.principalSubdivisionCode,
            // Additional fallback fields
            data.state,
            data.province,
            data.region,
            data.adminLevel1
          ];
          
          // Get the first valid state (non-numeric, meaningful length, not a PIN code)
          state = stateFields.find(field => 
            field && 
            typeof field === 'string' && 
            field.length > 2 && 
            field.length < 50 && // Reasonable max length for state names
            !/^\d+$/.test(field) && // Not purely numeric
            !/^\d{5,6}$/.test(field) // Not a PIN code
          ) || '';
          
          // If still no pincode found, try additional fallback strategies
          if (!pincode && city && state) {
            console.log('PIN code not found in geocoding data, trying additional strategies...');
            
            // Try a more specific Nominatim query with higher zoom level for PIN code
            try {
              const detailedNominatimResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1&extratags=1`
              );
              
              if (detailedNominatimResponse.ok) {
                const detailedData = await detailedNominatimResponse.json();
                console.log('Detailed Nominatim data for PIN code:', detailedData);
                
                if (detailedData.address && detailedData.address.postcode) {
                  pincode = detailedData.address.postcode;
                  console.log('Found PIN code from detailed Nominatim:', pincode);
                }
              }
            } catch (error) {
              console.error('Detailed Nominatim fallback failed:', error);
            }
            
            // If still no PIN code, try a geocoding search by city name
            if (!pincode) {
              try {
                const searchResponse = await fetch(
                  `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city + ', ' + state + ', India')}&addressdetails=1&limit=1`
                );
                
                if (searchResponse.ok) {
                  const searchData = await searchResponse.json();
                  console.log('Nominatim search data for PIN code:', searchData);
                  
                  if (searchData.length > 0 && searchData[0].address && searchData[0].address.postcode) {
                    pincode = searchData[0].address.postcode;
                    console.log('Found PIN code from Nominatim search:', pincode);
                  }
                }
              } catch (error) {
                console.error('Nominatim search fallback failed:', error);
              }
            }
          }
          
         // Update form data with location and address details (excluding street address auto-fill)
          setFormData(prev => ({
            ...prev,
            latitude: latitude,
            longitude: longitude,
            city: city || prev.city || '',
            state: state || prev.state || '',
            pincode: pincode || prev.pincode || ''
          }));
          
          setToastMessage('Location detected successfully!');
          setShowToast(true);
          
          console.log('Updated address data:', {
            coordinates: { latitude, longitude },
            city,
            state,
            pincode
          });
          
        } else {
          handleLocationSelect(latitude, longitude);
          setToastMessage('Location detected but address details not found. Please fill manually.');
          setShowToast(true);
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        handleLocationSelect(latitude, longitude);
        setToastMessage('Location detected but address lookup failed. Please fill manually.');
        setShowToast(true);
      }
      
    } catch (error: unknown) {
      console.error('Geolocation error:', error);
      let errorMessage = 'Unable to retrieve your location.';
      
      if (error instanceof Error) {
        if (error.message?.includes('permission')) {
          errorMessage = 'Location access denied. Please enable location permissions in your device settings.';
        } else if (error.message?.includes('unavailable')) {
          errorMessage = 'Location service is unavailable.';
        } else if (error.message?.includes('timeout')) {
          errorMessage = 'Location request timed out. Please try again.';
        }
      }
      
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically get location when modal opens
  const openAddModal = () => {
    setIsAddModalOpen(true);
    // Auto-get location for new addresses only
    if (!editingAddress) {
      setTimeout(getCurrentLocation, 500); // Small delay to ensure modal is open
    }
  };

  const cleanupForm = () => {
    setIsAddModalOpen(false);
    setEditingAddress(null);
    setFormData({
      type: 'home',
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      isDefault: false,
      latitude: undefined,
      longitude: undefined
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate phone number
      if (!validatePhoneNumber(formData.phone || '')) {
        setToastMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
        setShowToast(true);
        setIsLoading(false);
        return;
      }
      
      const newAddress = {
        ...formData,
        id: editingAddress ? editingAddress.id : Math.random().toString(36).substr(2, 9),
      } as Address;

      if (editingAddress) {
        // Editing existing address
        setAddresses(addresses.map(addr => {
          if (addr.id === editingAddress.id) {
            return {
              ...newAddress,
              isDefault: editingAddress.isDefault || newAddress.isDefault
            };
          }
          // If the new address is set as default, unset others
          return newAddress.isDefault ? { ...addr, isDefault: false } : addr;
        }));
        setToastMessage('Address updated successfully');
      } else {
        // Adding new address
        if (newAddress.isDefault) {
          setAddresses(addresses.map(addr => ({ ...addr, isDefault: false })).concat(newAddress));
        } else {
          // If this is the first address, make it default
          if (addresses.length === 0) {
            newAddress.isDefault = true;
          }
          setAddresses([...addresses, newAddress]);
        }
        setToastMessage('Address added successfully');
      }

      setShowToast(true);
      cleanupForm();
    } catch {
      setToastMessage('Failed to save address. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Saved Addresses</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={(e) => {
          // Refresh addresses if needed
          setTimeout(() => e.detail.complete(), 2000);
        }}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20">
            <MapPin className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
            <p className="text-center text-gray-500 mb-6 px-4">
              Add a new address to save it for future purchases
            </p>
            <IonButton 
              fill="solid" 
              color="primary" 
              onClick={openAddModal}
              className="px-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Address
            </IonButton>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {addresses.map((address) => (
                <IonCol key={address.id} size="12" sizeMd="6">
                  <IonCard>
                    <IonCardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="text-gray-600">
                            {getAddressIcon(address.type)}
                          </div>
                          <IonCardTitle className="text-base">{address.name}</IonCardTitle>
                        </div>
                        {address.isDefault && (
                          <IonBadge color="primary">Default</IonBadge>
                        )}
                      </div>
                    </IonCardHeader>
                    
                    <IonCardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 break-words">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.city}, {address.state} {address.pincode}</p>
                        <p className="text-sm text-gray-600">📞 {address.phone}</p>
                        {address.latitude && address.longitude && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Navigation className="h-3 w-3" />
                            <span>
                              {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <IonButton 
                          size="small" 
                          fill="outline" 
                          onClick={() => {
                            setEditingAddress(address);
                            setFormData(address);
                            setIsAddModalOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </IonButton>
                        
                        {!address.isDefault && (
                          <>
                            <IonButton 
                              size="small" 
                              fill="outline" 
                              color="danger"
                              onClick={() => handleDelete(address.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Delete
                            </IonButton>
                            
                            <IonButton 
                              size="small" 
                              fill="clear" 
                              color="primary"
                              onClick={() => handleSetDefault(address.id)}
                            >
                              <MapPin className="h-4 w-4 mr-1" />
                              Set Default
                            </IonButton>
                          </>
                        )}
                      </div>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}

        {/* Floating Action Button */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={openAddModal} color="primary">
            <Plus className="h-6 w-6" />
          </IonFabButton>
        </IonFab>

        {/* Add/Edit Address Modal */}
        <IonModal isOpen={isAddModalOpen || !!editingAddress} onDidDismiss={cleanupForm}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</IonTitle>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={cleanupForm}
              >
                <X className="h-6 w-6" />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <form onSubmit={handleSubmit} className="p-4">
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Full Name *</IonLabel>
                  <IonInput
                    value={formData.name || ''}
                    onIonInput={(e) => setFormData({ ...formData, name: e.detail.value! })}
                    placeholder="Enter your full name"
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Phone Number *</IonLabel>
                  <IonInput
                    type="tel"
                    value={formData.phone || ''}
                    onIonInput={(e) => {
                      const cleanPhone = e.detail.value!.replace(/\D/g, '').slice(0, 13);
                      setFormData({ ...formData, phone: cleanPhone });
                    }}
                    placeholder="Enter 10-digit mobile number"
                    required
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Address Type *</IonLabel>
                  <IonSelect
                    value={formData.type || 'home'}
                    onIonChange={(e) => setFormData({ ...formData, type: e.detail.value })}
                  >
                    <IonSelectOption value="home">Home</IonSelectOption>
                    <IonSelectOption value="office">Office</IonSelectOption>
                    <IonSelectOption value="other">Other</IonSelectOption>
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Street Address *</IonLabel>
                  <IonTextarea
                    value={formData.address || ''}
                    onIonInput={(e) => setFormData({ ...formData, address: e.detail.value! })}
                    placeholder="Enter your complete street address"
                    rows={3}
                    required
                  />
                </IonItem>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <IonItem>
                    <IonLabel position="stacked">City *</IonLabel>
                    <IonInput
                      value={formData.city || ''}
                      onIonInput={(e) => setFormData({ ...formData, city: e.detail.value! })}
                      placeholder="Enter city"
                      required
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">State *</IonLabel>
                    <IonInput
                      value={formData.state || ''}
                      onIonInput={(e) => setFormData({ ...formData, state: e.detail.value! })}
                      placeholder="Enter state"
                      required
                    />
                  </IonItem>
                </div>

                <IonItem>
                  <IonLabel position="stacked">PIN Code *</IonLabel>
                  <IonInput
                    type="number"
                    value={formData.pincode || ''}
                    onIonInput={(e) => setFormData({ ...formData, pincode: e.detail.value! })}
                    placeholder="Enter 6-digit PIN code"
                    maxlength={6}
                    required
                  />
                </IonItem>

                {/* Location Services */}
                <IonItem>
                  <div className="w-full py-4">
                    <IonButton 
                      expand="block" 
                      fill="outline" 
                      onClick={getCurrentLocation}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <Navigation className="h-4 w-4 mr-2" />
                          Use Current Location
                        </>
                      )}
                    </IonButton>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      This will auto-fill city, state, and PIN code
                    </p>
                  </div>
                </IonItem>

                {!editingAddress?.isDefault && (
                  <IonItem>
                    <IonCheckbox
                      checked={formData.isDefault || false}
                      onIonChange={(e) => setFormData({ ...formData, isDefault: e.detail.checked })}
                    />
                    <IonLabel className="ml-3">Set as default address</IonLabel>
                  </IonItem>
                )}
              </IonList>

              <div className="flex flex-col space-y-3 mt-6 px-4 pb-4">
                <IonButton 
                  type="submit" 
                  expand="block"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingAddress ? 'Save Changes' : 'Add Address'
                  )}
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  fill="outline" 
                  onClick={cleanupForm}
                  disabled={isLoading}
                >
                  Cancel
                </IonButton>
              </div>
            </form>
          </IonContent>
        </IonModal>

        {/* Toast for notifications */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
        />

        {/* Delete confirmation alert */}
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Delete Address"
          message="Are you sure you want to delete this address? This action cannot be undone."
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setShowDeleteAlert(false)
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: confirmDelete
            }
          ]}
        />

        {/* Loading overlay */}
        <IonLoading isOpen={isLoading && !showToast} message="Please wait..." />
      </IonContent>
    </IonPage>
  );
};
