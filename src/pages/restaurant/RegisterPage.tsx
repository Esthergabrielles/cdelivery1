import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Store, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    subdomain: '',
    logo: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.logo) {
      newErrors.logo = 'Please upload a restaurant logo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const formDataWithLogo = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'logo') {
          formDataWithLogo.append(key, formData[key as keyof typeof formData]);
        }
      });

      if (formData.logo) {
        formDataWithLogo.append('logo', formData.logo);
      }

      await api.post('/restaurants/register', formDataWithLogo);
      navigate('/login', { 
        state: { message: 'Registration successful! Please log in to continue.' }
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFD1DC] via-[#FFB6B6] to-[#FFFAFA] animate-gradient-bg backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-lg rounded-xl border border-gray-200 bg-white transition-all duration-300 ease-in-out transform hover:scale-105">
        {/* Espaço para o Logo */}
        <div className="py-10 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-500 rounded-full flex items-center justify-center">
            <Store className="w-12 h-12 text-white" />
          </div>
        </div>

        <CardHeader className="text-center border-b pb-6">
          <h1 className="text-4xl font-semibold text-gray-800">Register Your Restaurant</h1>
          <p className="text-gray-600 mt-2 text-lg">Create your restaurant's online presence with ease</p>
        </CardHeader>
        
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
              <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Restaurant Name"
              name="name"
              placeholder="Your Restaurant Name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              leftIcon={<Store size={18} className="text-gray-400" />}
              fullWidth
              className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="restaurant@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail size={18} className="text-gray-400" />}
              fullWidth
              className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                leftIcon={<Lock size={18} className="text-gray-400" />}
                fullWidth
                className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                leftIcon={<Lock size={18} className="text-gray-400" />}
                fullWidth
                className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
              />
            </div>
            
            <Input
              label="Phone Number"
              name="phone"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              leftIcon={<Phone size={18} className="text-gray-400" />}
              fullWidth
              className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
            />
            
            <Input
              label="Address"
              name="address"
              placeholder="Restaurant Address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
              leftIcon={<MapPin size={18} className="text-gray-400" />}
              fullWidth
              className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
            />
            
            <Input
              label="Subdomain"
              name="subdomain"
              placeholder="your-restaurant"
              value={formData.subdomain}
              onChange={handleChange}
              error={errors.subdomain}
              hint="This will be your restaurant's URL: your-restaurant.domain.com"
              fullWidth
              className="transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
            />
            
            <div className="mb-4">
              <label htmlFor="logo" className="block text-gray-600 text-sm mb-2">Restaurant Logo</label>
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full border border-gray-300 rounded-lg p-2 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-red-600"
              />
              {errors.logo && <span className="text-sm text-red-600">{errors.logo}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-6 bg-red-600 hover:bg-red-700 transition-all duration-300 ease-out transform hover:scale-105"
            >
              Register Restaurant
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="text-center border-t pt-4">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to="/login" className="text-red-600 hover:text-red-800 transition-all duration-200">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
