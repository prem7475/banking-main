'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera, CheckCircle, User, Mail, MapPin, CreditCard, Lock } from 'lucide-react';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    city: '',
    state: '',
    postalCode: '',
    dateOfBirth: '',
    panNumber: '',
    upiPin: '',
    tpin: '',
    profilePhoto: '',
  });

  // PIN visibility states
  const [showUpiPin, setShowUpiPin] = useState(false);
  const [showTpin, setShowTpin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const loggedInUser = await getLoggedInUser();
        if (!loggedInUser) {
          router.push('/sign-in');
          return;
        }
        setUser(loggedInUser);
        setFormData({
          firstName: loggedInUser.firstName || '',
          lastName: loggedInUser.lastName || '',
          email: loggedInUser.email || '',
          address1: loggedInUser.address1 || '',
          city: loggedInUser.city || '',
          state: loggedInUser.state || '',
          postalCode: loggedInUser.postalCode || '',
          dateOfBirth: loggedInUser.dateOfBirth || '',
          panNumber: loggedInUser.panNumber || '',
          upiPin: loggedInUser.upiPin || '',
          tpin: loggedInUser.tpin || '',
          profilePhoto: loggedInUser.profilePhoto || '',
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const calculateProfileCompletion = () => {
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.address1,
      formData.city,
      formData.state,
      formData.postalCode,
      formData.dateOfBirth,
      formData.panNumber,
      formData.upiPin,
      formData.tpin,
      formData.profilePhoto,
    ];

    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
