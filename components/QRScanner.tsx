'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Upload, X } from 'lucide-react'
import { QRParser, UPIQRData } from './QRParser'

interface QRScannerProps {
  onScanResult: (data: UPIQRData) => void
  onClose: () => void
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanResult, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)
  const [scanMode, setScanMode] = useState<'camera' | 'upload'>('camera')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCameraScan = async () => {
    setIsScanning(true)
    try {
      const result = await QRParser.scanQRFromCamera()
      if (result) {
        onScanResult(result)
      }
    } catch (error) {
      console.error('Camera scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    try {
      const result = await QRParser.parseQRFromImage(file)
      if (result) {
        onScanResult(result)
      }
    } catch (error) {
      console.error('File upload scan failed:', error)
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="flex gap-2">
            <Button
              variant={scanMode === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('camera')}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Camera
            </Button>
            <Button
              variant={scanMode === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setScanMode('upload')}
              className="flex-1"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>

          {/* Scan Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {scanMode === 'camera' ? (
              <div className="space-y-4">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">
                  Position QR code within the camera frame
                </p>
                <Button
                  onClick={handleCameraScan}
                  disabled={isScanning}
                  className="w-full"
                >
                  {isScanning ? 'Scanning...' : 'Start Scanning'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload QR code image
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isScanning}
                    className="w-full"
                  >
                    {isScanning ? 'Processing...' : 'Choose File'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
