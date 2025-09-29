'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userEmail?: string;
}

export default function DeleteAccountModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userEmail 
}: DeleteAccountModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const expectedText = 'DELETE';
  const isConfirmed = confirmationText === expectedText;

  const handleConfirm = async () => {
    if (!isConfirmed) return;
    
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return; // Prevent closing while deleting
    setConfirmationText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-800 bg-gray-900/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-red-900/50 border border-red-700/50">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Delete Account
          </CardTitle>
          <CardDescription className="text-gray-400">
            This action cannot be undone. All your data will be permanently deleted.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Warning Information */}
          <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-200">
                <p className="font-medium mb-2">This will permanently delete:</p>
                <ul className="space-y-1 text-red-300">
                  <li>• Your profile and account information</li>
                  <li>• All creator profiles and Instagram data</li>
                  <li>• Your content and preferences</li>
                  <li>• All associated data and settings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* User Email Display */}
          {userEmail && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-400 mb-1">Account to be deleted:</p>
              <p className="text-white font-medium">{userEmail}</p>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white">
              To confirm, type <span className="text-red-400 font-bold">DELETE</span> below:
            </label>
            <Input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
              disabled={isDeleting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isConfirmed || isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
