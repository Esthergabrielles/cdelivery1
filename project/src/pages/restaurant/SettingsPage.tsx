import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';
import { Store, Image as ImageIcon, Palette, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    primaryColor: '#3B82F6',
    secondaryColor: '#14B8A6',
    logo: null as File | null,
    logoPreview: '',
    openingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '15:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSettings(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
    multiple: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const formData = new FormData();
      Object.entries(settings).forEach(([key, value]) => {
        if (key === 'logo' && value) {
          formData.append('logo', value);
        } else if (key !== 'logoPreview') {
          formData.append(key, JSON.stringify(value));
        }
      });
      
      await api.patch('/restaurants/settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSuccess('Settings updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Restaurant Settings</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/restaurant/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
            <span className="text-green-600 text-sm">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Store className="mr-2" size={20} />
                Basic Information
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Restaurant Name"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth
                />
                
                <Input
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
                
                <Input
                  label="Address"
                  value={settings.address}
                  onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                  fullWidth
                />
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <ImageIcon className="mr-2" size={20} />
                Restaurant Logo
              </h2>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                
                {settings.logoPreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={settings.logoPreview} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                    <p className="text-sm text-gray-500">Click or drag to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      Drag & drop your logo here, or click to select
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Palette className="mr-2" size={20} />
                Theme Colors
              </h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <HexColorPicker
                    color={settings.primaryColor}
                    onChange={(color) => setSettings(prev => ({ ...prev, primaryColor: color }))}
                  />
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secondary Color
                  </label>
                  <HexColorPicker
                    color={settings.secondaryColor}
                    onChange={(color) => setSettings(prev => ({ ...prev, secondaryColor: color }))}
                  />
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opening Hours */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-bold">Opening Hours</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.openingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                      <span className="capitalize">{day}</span>
                    </div>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hours.isOpen}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [day]: { ...hours, isOpen: e.target.checked }
                          }
                        }))}
                        className="rounded border-gray-300 text-blue-600 mr-2"
                      />
                      Open
                    </label>
                    
                    {hours.isOpen && (
                      <>
                        <Input
                          type="time"
                          value={hours.open}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            openingHours: {
                              ...prev.openingHours,
                              [day]: { ...hours, open: e.target.value }
                            }
                          }))}
                        />
                        <span>to</span>
                        <Input
                          type="time"
                          value={hours.close}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            openingHours: {
                              ...prev.openingHours,
                              [day]: { ...hours, close: e.target.value }
                            }
                          }))}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};