'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, User, Mail, Lock, KeyRound } from 'lucide-react';
import { useAppContext } from '@/lib/context/AppContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const Profile = () => {
  const { userProfile, setUserProfile } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showUpiPin, setShowUpiPin] = useState(false);

  // Password update state
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // UPI PIN update state
  const [showUpiPinDialog, setShowUpiPinDialog] = useState(false);
  const [upiPinForm, setUpiPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });
  const [upiPinError, setUpiPinError] = useState('');

  // Profile form state
  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || '',
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleUpdatePassword = async () => {
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.currentPassword !== userProfile.password) {
      setPasswordError('Current password is incorrect');
      return;
    }

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
      const updatedProfile = {
        ...userProfile,
        password: passwordForm.newPassword
      };
      setUserProfile(updatedProfile);
      setMessage('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordDialog(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setPasswordError('Failed to update password');
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUpiPin = async () => {
    setUpiPinError('');

    if (!upiPinForm.currentPin || !upiPinForm.newPin || !upiPinForm.confirmPin) {
      setUpiPinError('All fields are required');
      return;
    }

    if (upiPinForm.currentPin !== userProfile.upiPin) {
      setUpiPinError('Current UPI PIN is incorrect');
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
      const updatedProfile = {
        ...userProfile,
        upiPin: upiPinForm.newPin
      };
      setUserProfile(updatedProfile);
      setMessage('UPI PIN updated successfully!');
      setUpiPinForm({
        currentPin: '',
        newPin: '',
        confirmPin: ''
      });
      setShowUpiPinDialog(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setUpiPinError('Failed to update UPI PIN');
      console.error('Error updating UPI PIN:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.fullName.trim()) {
      setMessage('Name is required');
      return;
    }

    try {
      setLoading(true);
      const updatedProfile = {
        ...userProfile,
        fullName: formData.fullName
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

  if (loading && !userProfile) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="profile px-4 lg:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and security settings</p>
        </div>

        {message && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your basic profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Password Settings
              </CardTitle>
              <CardDescription>
                Update your account password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <Button variant="outline" className="w-full" onClick={() => setShowPasswordDialog(true)}>
                  Change Password
                </Button>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and new password
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="showPassword" className="cursor-pointer">Show password</Label>
                    </div>
                    {passwordError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowPasswordDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleUpdatePassword} disabled={loading} className="flex-1">
                        {loading ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* UPI PIN Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                UPI PIN Settings
              </CardTitle>
              <CardDescription>
                Update your 4-digit UPI PIN for transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={showUpiPinDialog} onOpenChange={setShowUpiPinDialog}>
                <Button variant="outline" className="w-full" onClick={() => setShowUpiPinDialog(true)}>
                  Change UPI PIN
                </Button>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change UPI PIN</DialogTitle>
                    <DialogDescription>
                      Enter your current UPI PIN and new 4-digit UPI PIN
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPin">Current UPI PIN</Label>
                      <div className="relative">
                        <Input
                          id="currentPin"
                          type={showUpiPin ? 'text' : 'password'}
                          value={upiPinForm.currentPin}
                          onChange={(e) => setUpiPinForm({ ...upiPinForm, currentPin: e.target.value })}
                          placeholder="Enter current UPI PIN"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPin">New UPI PIN (4 digits)</Label>
                      <div className="relative">
                        <Input
                          id="newPin"
                          type={showUpiPin ? 'text' : 'password'}
                          value={upiPinForm.newPin}
                          onChange={(e) => setUpiPinForm({ ...upiPinForm, newPin: e.target.value.slice(0, 4) })}
                          placeholder="Enter new UPI PIN"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPin">Confirm UPI PIN</Label>
                      <div className="relative">
                        <Input
                          id="confirmPin"
                          type={showUpiPin ? 'text' : 'password'}
                          value={upiPinForm.confirmPin}
                          onChange={(e) => setUpiPinForm({ ...upiPinForm, confirmPin: e.target.value.slice(0, 4) })}
                          placeholder="Confirm new UPI PIN"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        id="showPin"
                        type="checkbox"
                        checked={showUpiPin}
                        onChange={(e) => setShowUpiPin(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label htmlFor="showPin" className="cursor-pointer">Show PIN</Label>
                    </div>
                    {upiPinError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{upiPinError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => setShowUpiPinDialog(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateUpiPin} disabled={loading} className="flex-1">
                        {loading ? 'Updating...' : 'Update'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Security Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>• Never share your password or UPI PIN with anyone</p>
              <p>• Use a strong password with at least 6 characters</p>
              <p>• Change your password regularly for better security</p>
              <p>• Your UPI PIN is required for all transactions</p>
              <p>• Always verify transaction details before confirming</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a cloud storage service
      // For now, we'll just use a placeholder
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePhoto: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // In a real implementation, you'd call an API to update the user
      // For now, we'll just show a success message
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const completionPercentage = calculateProfileCompletion();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and security settings</p>
      </div>

      {/* Profile Completion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Profile Completion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completion Status</span>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
            {completionPercentage === 100 ? (
              <p className="text-green-600 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Your profile is 100% complete!
              </p>
            ) : (
              <p className="text-orange-600 text-sm">
                Complete your profile to unlock all features
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Photo */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
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
              <p className="text-sm text-gray-600">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="panNumber">PAN Number</Label>
            <Input
              id="panNumber"
              value={formData.panNumber}
              onChange={(e) => handleInputChange('panNumber', e.target.value)}
              placeholder="AAAAA9999A"
              maxLength={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="address1">Address Line 1</Label>
            <Textarea
              id="address1"
              value={formData.address1}
              onChange={(e) => handleInputChange('address1', e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Enter your state"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Enter postal code"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="upiPin">UPI PIN</Label>
            <div className="relative">
              <Input
                id="upiPin"
                type={showUpiPin ? "text" : "password"}
                value={formData.upiPin}
                onChange={(e) => handleInputChange('upiPin', e.target.value)}
                placeholder="Enter 4-digit UPI PIN"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowUpiPin(!showUpiPin)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showUpiPin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="tpin">TPIN (Transaction PIN)</Label>
            <div className="relative">
              <Input
                id="tpin"
                type={showTpin ? "text" : "password"}
                value={formData.tpin}
                onChange={(e) => handleInputChange('tpin', e.target.value)}
                placeholder="Enter 4-digit TPIN"
                maxLength={4}
              />
              <button
                type="button"
                onClick={() => setShowTpin(!showTpin)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showTpin ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success/Error Message */}
      {message && (
        <Alert className={`mb-8 ${message.includes('Error') ? 'border-red-500' : 'border-green-500'}`}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
