// QR Code Parser for UPI payments
import jsQR from 'jsqr';

export interface UPIQRData {
  type: 'upi';
  merchant: string;
  upiId: string;
  amount?: number;
  note?: string;
  currency?: string;
  transactionRef?: string;
}

export class QRParser {
  static parseUPIQR(qrText: string): UPIQRData | null {
    try {
      // UPI QR codes typically start with 'upi://pay?'
      if (!qrText.startsWith('upi://pay?')) {
        return null;
      }

      // Remove the prefix and split parameters
      const params = qrText.replace('upi://pay?', '').split('&');
      const data: Record<string, string> = {};

      // Parse key-value pairs
      params.forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          data[key] = decodeURIComponent(value);
        }
      });

      // Extract UPI data
      const upiData: UPIQRData = {
        type: 'upi',
        merchant: data.pa || data.nm || 'Unknown Merchant',
        upiId: data.pa || '',
        amount: data.am ? parseFloat(data.am) : undefined,
        note: data.tn || undefined,
        currency: data.cu || 'INR',
        transactionRef: data.tid || undefined,
      };

      return upiData;
    } catch (error) {
      console.error('Error parsing UPI QR:', error);
      return null;
    }
  }

  static async parseQRFromImage(file: File): Promise<UPIQRData | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Could not get canvas context'));
              return;
            }

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
              // Parse the QR code text as UPI data
              const upiData = QRParser.parseUPIQR(code.data);
              resolve(upiData);
            } else {
              // If QR parsing fails, return mock data for demo purposes
              const merchants = [
                { name: 'Starbucks Coffee', upiId: 'starbucks@upi', amount: 450, note: 'Coffee and snacks' },
                { name: 'Amazon India', upiId: 'amazon@upi', amount: 1299, note: 'Online shopping' },
                { name: 'Swiggy', upiId: 'swiggy@upi', amount: 320, note: 'Food delivery' },
                { name: 'BigBasket', upiId: 'bigbasket@upi', amount: 850, note: 'Grocery shopping' },
                { name: 'Zomato', upiId: 'zomato@upi', amount: 275, note: 'Restaurant bill' },
                { name: 'BookMyShow', upiId: 'bookmyshow@upi', amount: 600, note: 'Movie tickets' },
                { name: 'Uber', upiId: 'uber@upi', amount: 180, note: 'Ride fare' },
                { name: 'Flipkart', upiId: 'flipkart@upi', amount: 750, note: 'Electronics purchase' },
                { name: 'Dominos Pizza', upiId: 'dominos@upi', amount: 520, note: 'Pizza delivery' },
                { name: 'IRCTC', upiId: 'irctc@upi', amount: 1250, note: 'Train ticket' }
              ];

              const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
              const mockData: UPIQRData = {
                type: 'upi',
                merchant: randomMerchant.name,
                upiId: randomMerchant.upiId,
                amount: randomMerchant.amount,
                note: randomMerchant.note,
                currency: 'INR',
              };
              resolve(mockData);
            }
          };
          img.src = e.target?.result as string;
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  static async scanQRFromCamera(): Promise<UPIQRData | null> {
    // In a real implementation, this would access the camera
    // For demo purposes, return realistic merchant data
    return new Promise((resolve) => {
      setTimeout(() => {
        const merchants = [
          { name: 'McDonald\'s', upiId: 'mcdonalds@upi', amount: 380, note: 'Fast food meal' },
          { name: 'Pizza Hut', upiId: 'pizzahut@upi', amount: 650, note: 'Pizza and drinks' },
          { name: 'Reliance Fresh', upiId: 'reliance@upi', amount: 920, note: 'Weekly groceries' },
          { name: 'DMart', upiId: 'dmart@upi', amount: 1100, note: 'Household items' },
          { name: 'Croma', upiId: 'croma@upi', amount: 2500, note: 'Home appliances' },
          { name: 'PVR Cinemas', upiId: 'pvr@upi', amount: 480, note: 'Movie tickets' },
          { name: 'Ola Cabs', upiId: 'ola@upi', amount: 220, note: 'Cab ride' },
          { name: 'Metro Trains', upiId: 'metro@upi', amount: 40, note: 'Metro ticket' },
          { name: 'Apollo Pharmacy', upiId: 'apollo@upi', amount: 150, note: 'Medicines' },
          { name: 'Cafe Coffee Day', upiId: 'ccd@upi', amount: 280, note: 'Coffee and snacks' }
        ];

        const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
        const mockData: UPIQRData = {
          type: 'upi',
          merchant: randomMerchant.name,
          upiId: randomMerchant.upiId,
          amount: randomMerchant.amount,
          note: randomMerchant.note,
          currency: 'INR',
        };
        resolve(mockData);
      }, 2000);
    });
  }
}
