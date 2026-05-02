import { useEffect, useRef, useState } from "react";
import { X, QrCode } from "lucide-react";
import QrScanner from "qr-scanner";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export default function QRCodeScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        onScan(result.data);
        scanner?.destroy();
        onClose();
      },
      {
        onDecodeError: (error) => {
          // Silently ignore decode errors - it's normal when camera is scanning
        },
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    setScanner(qrScanner);
    setIsLoading(false);

    qrScanner.start().catch((err) => {
      setError("Camera not available. Please check permissions.");
      console.error("Camera error:", err);
    });

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [onScan, onClose]);

  const handleClose = () => {
    if (scanner) {
      scanner.destroy();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-green-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            <span className="font-semibold">Scan Payment QR Code</span>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera View */}
        <div className="aspect-square bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading camera...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="text-white text-center p-4">
                <p className="text-red-400 mb-2">⚠️ Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ display: isLoading || error ? "none" : "block" }}
          />

          {/* Scanning guides */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-primary rounded-lg"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-dark-bg px-6 py-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Position the QR code within the frame to scan
          </p>
        </div>
      </div>
    </div>
  );
}
