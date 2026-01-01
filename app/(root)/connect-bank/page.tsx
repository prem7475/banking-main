'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle, Building2, ShieldCheck } from 'lucide-react';

const ConnectBank = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');

  // MOCK DATA: List of supported banks
  const banks = [
    { id: 'chase', name: 'Chase Bank', logo: '/icons/chase.svg' }, // Ensure you have placeholders or remove logo logic if icons missing
    { id: 'boa', name: 'Bank of America', logo: '/icons/boa.svg' },
    { id: 'wells', name: 'Wells Fargo', logo: '/icons/wells.svg' },
    { id: 'citi', name: 'Citibank', logo: '/icons/citi.svg' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '/icons/hdfc.svg' },
  ];

  const handleConnect = async () => {
    if (!selectedBank) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }, 1500);
  };

  return (
    <section className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Connect Bank Account</CardTitle>
          <CardDescription className="text-center">
            Link your primary bank account to start managing your finances.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Feature List */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Secure Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Instant Verification</span>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Select your Bank
            </label>
            <Select onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Select a bank..." />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {banks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Success Message */}
          {success && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your {banks.find(b => b.id === selectedBank)?.name} account has been connected. Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleConnect} 
            disabled={loading || !selectedBank || success}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Account'
            )}
          </Button>

          <p className="px-8 text-center text-xs text-gray-500">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default ConnectBank;