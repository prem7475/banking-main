'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, CheckCircle, User, Lock, KeyRound, Camera, MapPin, Mail } from 'lucide-react';
import { useAppContext } from '@/lib/context/AppContext';

const Profile = () => {
  const { userProfile, setUserProfile } = useAppContext();
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showUpiPin, setShowUpiPin] = useState(false);

  // Password Dialog State
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // UPI PIN Dialog State
  const [showUpiPinDialog, setShowUpiPinDialog] = useState(false);
  const [upiPinForm, setUpiPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [upiPinError, setUpiPinError] = useState('');

  // Main Profile Form Data
  // We initialize this with data from Context
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    dateOfBirth: '',
    profilePhoto: '',
    panNumber: ''
  });

  // Load user data into form when component mounts
  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullName || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        email: userProfile.email || '',
        address1: userProfile.address1 || '',
        city: userProfile.city || '',
        state: userProfile.state || '',
        postalCode: userProfile.postalCode || '',
        dateOfBirth: userProfile.dateOfBirth || '',
        profilePhoto: userProfile.profilePhoto || '',
        panNumber: userProfile.panNumber || ''
      });
    }
  }, [userProfile]);

  // Handle General Input Changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Photo Upload (Converts to Base64 for Mock App)
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          profilePhoto: result
        }));
        
        // Immediately update context for instant feedback
        setUserProfile({
            ...userProfile,
            profilePhoto: result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Logic: Update Password
  const handleUpdatePassword = async () => {
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    // Simple mock check
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUserProfile({ ...userProfile, password: passwordForm.newPassword });
      
      setMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordDialog(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setPasswordError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  // Logic: Update UPI PIN
  const handleUpdateUpiPin = async () => {
    setUpiPinError('');

    if (!upiPinForm.currentPin || !upiPinForm.newPin || !upiPinForm.confirmPin) {
      setUpiPinError('All fields are required');
      return;
    }
    if (upiPinForm.newPin.length !== 4 || !/^\d+$/.test(upiPinForm.newPin)) {
      setUpiPinError('UPI PIN must be exactly 4 digits');
      return;
    }
    if (upiPinForm.newPin !== upiPinForm.confirmPin) {
      setUpiPinError('New UPI PINs do not match');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUserProfile({ ...userProfile, upiPin: upiPinForm.newPin });

      setMessage('UPI PIN updated successfully!');
      setUpiPinForm({ currentPin: '', newPin: '', confirmPin: '' });
      setShowUpiPinDialog(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setUpiPinError('Failed to update UPI PIN');
    } finally {
      setLoading(false);
    }
  };

  // Logic: Save General Profile Info
  const handleSaveProfile = async () => {
    if (!formData.firstName.trim()) {
      setMessage('First Name is required');
      return;
    }

    try {
      setLoading(true);
      // Simulate API Delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedProfile = {
        ...userProfile,
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`
      };
      
      setUserProfile(updatedProfile);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return <div className="flex items-center justify-center min-h-screen">Loading Profile...</div>;
  }

  return (
    <div className="profile px-4 lg:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and security settings</p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.includes('Failed') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CheckCircle className={`h-4 w-4 ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`} />
            <AlertDescription className={message.includes('Failed') ? 'text-red-800' : 'text-green-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6">
          
          {/* 1. Profile Photo Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-100">
                    {formData.profilePhoto ? (
                      <Image
                        src={formData.profilePhoto}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Upload Profile Photo</h3>
                  <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                        id="panNumber"
                        value={formData.panNumber}
                        onChange={(e) => handleInputChange('panNumber', e.target.value)}
                        maxLength={10}
                        placeholder="ABCDE1234F"
                    />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Address Information Card */}
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Textarea 
                        id="address1"
                        value={formData.address1}
                        onChange={(e) => handleInputChange('address1', e.target.value)}
                        placeholder="Enter your street address"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                            id="state"
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Zip Code</Label>
                        <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={handleSaveProfile} disabled={loading} className="w-full md:w-auto">
                        {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                    </Button>
                </div>
            </CardContent>
          </Card>

          {/* 4. Security Settings (Dialogs) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Password
                </CardTitle>
                <CardDescription>Update your login password</CardDescription>
                </CardHeader>
                <CardContent>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                    <Button variant="outline" className="w-full" onClick={() => setShowPasswordDialog(true)}>
                    Change Password
                    </Button>
                    <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>Enter your current and new password.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Current Password</Label>
                            <Input 
                                type="password" 
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New Password</Label>
                            <Input 
                                type="password" 
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm Password</Label>
                            <Input 
                                type="password" 
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            />
                        </div>
                        {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                        <Button className="w-full" onClick={handleUpdatePassword} disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>
                </CardContent>
            </Card>

            {/* UPI PIN */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5" />
                    UPI PIN
                </CardTitle>
                <CardDescription>Update your 4-digit transaction PIN</CardDescription>
                </CardHeader>
                <CardContent>
                <Dialog open={showUpiPinDialog} onOpenChange={setShowUpiPinDialog}>
                    <Button variant="outline" className="w-full" onClick={() => setShowUpiPinDialog(true)}>
                    Change UPI PIN
                    </Button>
                    <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Change UPI PIN</DialogTitle>
                        <DialogDescription>Enter your current and new 4-digit PIN.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Current PIN</Label>
                            <Input 
                                type="password" 
                                maxLength={4}
                                value={upiPinForm.currentPin}
                                onChange={(e) => setUpiPinForm({...upiPinForm, currentPin: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>New PIN (4 digits)</Label>
                            <Input 
                                type="password" 
                                maxLength={4}
                                value={upiPinForm.newPin}
                                onChange={(e) => setUpiPinForm({...upiPinForm, newPin: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Confirm PIN</Label>
                            <Input 
                                type="password" 
                                maxLength={4}
                                value={upiPinForm.confirmPin}
                                onChange={(e) => setUpiPinForm({...upiPinForm, confirmPin: e.target.value})}
                            />
                        </div>
                        {upiPinError && <p className="text-red-500 text-sm">{upiPinError}</p>}
                        <Button className="w-full" onClick={handleUpdateUpiPin} disabled={loading}>
                            {loading ? 'Updating...' : 'Update PIN'}
                        </Button>
                    </div>
                    </DialogContent>
                </Dialog>
                </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;