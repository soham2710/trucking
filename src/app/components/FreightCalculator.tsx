'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/app/components/ui/dialog';

const FreightForm = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [canCloseDialog, setCanCloseDialog] = useState(false); // Manage dialog closure
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{
    quantity: 1,
    packagingType: 'pallet',
    length: '',
    width: '',
    height: '',
    weight: '',
    freightClass: '',
  }]);

  const equipmentTypes = ['Drayage', 'Flatbed', 'Van', 'Reefer', 'Step Deck', 'Sprinter Van', 'Box Truck'];
  const packagingTypes = ['Pallet', 'Box', 'Crate', 'Drum', 'Bundle', 'Roll'];

  const [formData, setFormData] = useState({
    // Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',

    // Existing Fields
    shippingType: 'ltl',
    items: items,
    equipmentType: '',
    weight: '',
    declaredValue: '',
    pickupLocation: {
      zipCode: '',
      pickupDate: '',
      isResidential: false,
      needsLiftgate: false,
      limitedAccess: false,
    },
    deliveryLocation: {
      zipCode: '',
      isResidential: false,
      needsLiftgate: false,
      limitedAccess: false,
    }
  });

  const addItem = () => {
    const newItems = [...items, {
      quantity: 1,
      packagingType: 'pallet',
      length: '',
      width: '',
      height: '',
      weight: '',
      freightClass: '',
    }];
    setItems(newItems);
    setFormData({...formData, items: newItems});
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showDialog) {
      setCanCloseDialog(false); // Disable close initially
      timer = setTimeout(() => {
        setCanCloseDialog(true); // Enable close after 10 minutes
      }, 600000); // 10 minutes in milliseconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format pickup date properly
      const pickupDate = formData.pickupLocation.pickupDate 
        ? new Date(formData.pickupLocation.pickupDate).toISOString().split('T')[0]
        : null;

      const leadData = {
        // Contact information
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.companyName,

        type: formData.shippingType,
        details: {
          items: formData.shippingType === 'ltl' ? formData.items : undefined,
          equipmentType: formData.shippingType === 'ftl' ? formData.equipmentType : undefined,
          weight: formData.weight || undefined,
          declaredValue: formData.declaredValue || undefined,
          pickupLocation: {
            ...formData.pickupLocation,
            pickupDate // Use formatted date
          },
          deliveryLocation: formData.deliveryLocation
        }
      };

      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to submit form');
      }

      setShowDialog(true);
      setCanCloseDialog(false); // Ensure close is disabled when dialog opens

      // Trigger Google Ads Conversion without redirect
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          'send_to': 'AW-16818747005/mqKZCNyxiIEaEP3s5tM-',
          'value': 1.0,
          'currency': 'USD',
          // Removed 'event_callback' to prevent redirect
        });
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        shippingType: 'ltl',
        items: [{
          quantity: 1,
          packagingType: 'pallet',
          length: '',
          width: '',
          height: '',
          weight: '',
          freightClass: '',
        }],
        equipmentType: '',
        weight: '',
        declaredValue: '',
        pickupLocation: {
          zipCode: '',
          pickupDate: '',
          isResidential: false,
          needsLiftgate: false,
          limitedAccess: false,
        },
        deliveryLocation: {
          zipCode: '',
          isResidential: false,
          needsLiftgate: false,
          limitedAccess: false,
        }
      });
      setItems([{
        quantity: 1,
        packagingType: 'pallet',
        length: '',
        width: '',
        height: '',
        weight: '',
        freightClass: '',
      }]);

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error submitting form:', error.message);
        alert(error.message);
      } else {
        console.error('Unknown error:', error);
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  function updateFormData(key: string, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = {...newItems[index], [field]: value};
    setItems(newItems);
    setFormData(prev => ({...prev, items: newItems}));
  };

  const updatePickupLocation = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      pickupLocation: {...prev.pickupLocation, [field]: value}
    }));
  };

  const updateDeliveryLocation = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      deliveryLocation: {...prev.deliveryLocation, [field]: value}
    }));
  };

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Freight Quote Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Information Section */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName"
                  type="text" 
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName"
                  type="text" 
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input 
                  id="phone"
                  type="tel" 
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input 
                  id="companyName"
                  type="text" 
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                />
              </div>
            </div>

            {/* Shipping Type Selection */}
            <div className="space-y-2">
              <Label>Shipping Option</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ltl"
                    name="shipping-type"
                    value="ltl"
                    checked={formData.shippingType === 'ltl'}
                    onChange={(e) => updateFormData('shippingType', e.target.value)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="ltl">LTL (Less-Than-Truckload)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="ftl"
                    name="shipping-type"
                    value="ftl"
                    checked={formData.shippingType === 'ftl'}
                    onChange={(e) => updateFormData('shippingType', e.target.value)}
                    className="text-blue-600"
                  />
                  <Label htmlFor="ftl">Full Truckload</Label>
                </div>
              </div>
            </div>

            {/* FTL Specific Fields */}
            {formData.shippingType === 'ftl' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Equipment Type</Label>
                    <Select 
                      onValueChange={(value) => updateFormData('equipmentType', value)}
                      value={formData.equipmentType}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map((type) => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Weight (lbs)</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter weight"
                      value={formData.weight}
                      onChange={(e) => updateFormData('weight', e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Declared Value (in $)</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter declared value"
                    value={formData.declaredValue}
                    onChange={(e) => updateFormData('declaredValue', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* LTL Specific Fields */}
            {formData.shippingType === 'ltl' && (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input 
                          type="number" 
                          min={1} 
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Package Type</Label>
                        <Select 
                          onValueChange={(value) => updateItem(index, 'packagingType', value)}
                          value={item.packagingType}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {packagingTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (lbs)</Label>
                        <Input 
                          type="number" 
                          placeholder="Weight"
                          value={item.weight}
                          onChange={(e) => updateItem(index, 'weight', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Freight Class</Label>
                        <Select 
                          onValueChange={(value) => updateItem(index, 'freightClass', value)}
                          value={item.freightClass}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {[50, 55, 60, 65, 70, 77.5, 85, 92.5, 100, 110, 125, 150, 175, 200, 250, 300, 400, 500].map((cls) => (
                              <SelectItem key={cls} value={cls.toString()}>{cls}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Length (in)</Label>
                        <Input 
                          type="number" 
                          placeholder="Length"
                          value={item.length}
                          onChange={(e) => updateItem(index, 'length', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width (in)</Label>
                        <Input 
                          type="number" 
                          placeholder="Width"
                          value={item.width}
                          onChange={(e) => updateItem(index, 'width', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (in)</Label>
                        <Input 
                          type="number" 
                          placeholder="Height"
                          value={item.height}
                          onChange={(e) => updateItem(index, 'height', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  onClick={addItem} 
                  className="mt-4 bg-secondary hover:bg-secondary/80"
                >
                  + Add Another Item
                </Button>
              </div>
            )}

            {/* Common Fields for Both Types */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Pickup Location</h3>
                <div className="space-y-2">
                  <Label htmlFor="pickupZipCode">ZIP Code</Label>
                  <Input 
                    id="pickupZipCode"
                    type="text" 
                    placeholder="Enter ZIP code"
                    value={formData.pickupLocation.zipCode}
                    onChange={(e) => updatePickupLocation('zipCode', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input 
                    id="pickupDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.pickupLocation.pickupDate}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : null;
                      updatePickupLocation('pickupDate', date ? date.toISOString().split('T')[0] : '');
                    }}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Additional Services</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="residential-pickup"
                        checked={formData.pickupLocation.isResidential}
                        onCheckedChange={(checked) => updatePickupLocation('isResidential', checked)}
                      />
                      <label htmlFor="residential-pickup">Residential Area</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="liftgate-pickup"
                        checked={formData.pickupLocation.needsLiftgate}
                        onCheckedChange={(checked) => updatePickupLocation('needsLiftgate', checked)}
                      />
                      <label htmlFor="liftgate-pickup">Lift Gate Required</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="limited-pickup"
                        checked={formData.pickupLocation.limitedAccess}
                        onCheckedChange={(checked) => updatePickupLocation('limitedAccess', checked)}
                      />
                      <label htmlFor="limited-pickup">Limited Access Area</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Delivery Location</h3>
                <div className="space-y-2">
                  <Label htmlFor="deliveryZipCode">ZIP Code</Label>
                  <Input 
                    id="deliveryZipCode"
                    type="text" 
                    placeholder="Enter ZIP code"
                    value={formData.deliveryLocation.zipCode}
                    onChange={(e) => updateDeliveryLocation('zipCode', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Additional Services</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="residential-delivery"
                        checked={formData.deliveryLocation.isResidential}
                        onCheckedChange={(checked) => updateDeliveryLocation('isResidential', checked)}
                      />
                      <label htmlFor="residential-delivery">Residential Area</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="liftgate-delivery"
                        checked={formData.deliveryLocation.needsLiftgate}
                        onCheckedChange={(checked) => updateDeliveryLocation('needsLiftgate', checked)}
                      />
                      <label htmlFor="liftgate-delivery">Lift Gate Required</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="limited-delivery"
                        checked={formData.deliveryLocation.limitedAccess}
                        onCheckedChange={(checked) => updateDeliveryLocation('limitedAccess', checked)}
                      />
                      <label htmlFor="limited-delivery">Limited Access Area</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={loading}
              >
                {loading ? 'Getting Quote...' : 'Get Quote'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Thank You Dialog */}
      <Dialog 
        open={showDialog} 
        onOpenChange={(open) => {
          if (!open) return; // Prevent closing by clicking outside or pressing Esc
          if (canCloseDialog) {
            setShowDialog(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Thank You!</DialogTitle>
            <DialogDescription className="text-center pt-4 text-lg">
              We&apos;ve received your quote request and our team will contact you shortly with competitive rates tailored to your shipping needs.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <DialogClose asChild>
              <Button 
                className={`bg-blue-600 hover:bg-blue-700 text-white px-8 ${!canCloseDialog ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => {
                  if (canCloseDialog) {
                    setShowDialog(false);
                  }
                }}
                disabled={!canCloseDialog}
              >
                Close
              </Button>
            </DialogClose>
          </div>
          {!canCloseDialog && (
            <p className="text-center text-sm text-gray-500 mt-4">
              You can close this dialog after 10 minutes.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FreightForm;
