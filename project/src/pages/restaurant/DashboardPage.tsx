import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useDropzone } from 'react-dropzone';
import { HexColorPicker } from 'react-colorful';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Store, 
  Image as ImageIcon,
  Palette,
  Clock,
  MapPin,
  Phone,
  Mail,
  Link as LinkIcon,
  Save,
  AlertCircle,
  Plus,
  Trash2,
  DollarSign,
  Menu
} from 'lucide-react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: File | null;
  imagePreview: string;
  addons: Addon[];
  isAvailable: boolean;
}

interface Addon {
  id: string;
  name: string;
  options: AddonOption[];
  required: boolean;
  multiple: boolean;
  min?: number;
  max?: number;
}

interface AddonOption {
  id: string;
  name: string;
  price: number;
}

export const RestaurantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customize');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    name: '',
    description: '',
    logo: null as File | null,
    logoPreview: '',
    primaryColor: '#FF4B4B',
    secondaryColor: '#1E293B',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    subdomain: '',
    openingHours: {
      monday: { open: '09:00', close: '18:00', isOpen: true },
      tuesday: { open: '09:00', close: '18:00', isOpen: true },
      wednesday: { open: '09:00', close: '18:00', isOpen: true },
      thursday: { open: '09:00', close: '18:00', isOpen: true },
      friday: { open: '09:00', close: '18:00', isOpen: true },
      saturday: { open: '10:00', close: '15:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false },
    },
    categories: [
      { id: '1', name: 'Entradas', order: 1 },
      { id: '2', name: 'Pratos Principais', order: 2 },
      { id: '3', name: 'Bebidas', order: 3 },
      { id: '4', name: 'Sobremesas', order: 4 }
    ],
    deliverySettings: {
      minOrderValue: 0,
      deliveryFee: 0,
      deliveryTime: '30-45',
      deliveryArea: '',
      acceptsPickup: true,
      acceptsDelivery: true
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: '',
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    image: null,
    imagePreview: '',
    addons: [],
    isAvailable: true
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSettings(prev => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880,
    multiple: false
  });

  const handleSave = async () => {
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

      await api.patch('/restaurants/settings', formData);
      toast.success('Configurações salvas com sucesso!');
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'Erro ao salvar as configurações');
      toast.error('Erro ao salvar as configurações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMenuItem = () => {
    if (!selectedCategory) {
      toast.error('Selecione uma categoria');
      return;
    }

    const item: MenuItem = {
      ...newMenuItem,
      id: Date.now().toString(),
      categoryId: selectedCategory
    };

    setMenuItems([...menuItems, item]);
    setNewMenuItem({
      id: '',
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      image: null,
      imagePreview: '',
      addons: [],
      isAvailable: true
    });
  };

  const handleAddAddon = (menuItemId: string) => {
    const newAddon: Addon = {
      id: Date.now().toString(),
      name: '',
      options: [],
      required: false,
      multiple: false
    };

    setMenuItems(menuItems.map(item => 
      item.id === menuItemId 
        ? { ...item, addons: [...item.addons, newAddon] }
        : item
    ));
  };

  const handleAddAddonOption = (menuItemId: string, addonId: string) => {
    const newOption: AddonOption = {
      id: Date.now().toString(),
      name: '',
      price: 0
    };

    setMenuItems(menuItems.map(item => 
      item.id === menuItemId 
        ? {
            ...item,
            addons: item.addons.map(addon =>
              addon.id === addonId
                ? { ...addon, options: [...addon.options, newOption] }
                : addon
            )
          }
        : item
    ));
  };

  const getMenuUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${settings.subdomain}`;
  };

  const renderMenuItemsSection = () => (
    <Card className="lg:col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center">
            <Menu className="mr-2" size={20} />
            Itens do Cardápio
          </h2>
          <Button
            variant="primary"
            onClick={() => handleAddMenuItem()}
            leftIcon={<Plus size={18} />}
          >
            Adicionar Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <select
            className="w-full rounded-md border-gray-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Selecione uma categoria</option>
            {settings.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="space-y-6">
            {menuItems
              .filter(item => item.categoryId === selectedCategory)
              .map(item => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Nome do Item"
                        value={item.name}
                        onChange={(e) => setMenuItems(items =>
                          items.map(i =>
                            i.id === item.id
                              ? { ...i, name: e.target.value }
                              : i
                          )
                        )}
                        fullWidth
                      />
                    </div>
                    <div>
                      <Input
                        label="Preço"
                        type="number"
                        value={item.price}
                        onChange={(e) => setMenuItems(items =>
                          items.map(i =>
                            i.id === item.id
                              ? { ...i, price: parseFloat(e.target.value) }
                              : i
                          )
                        )}
                        leftIcon={<DollarSign size={18} />}
                        fullWidth
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <ReactQuill
                      value={item.description}
                      onChange={(value) => setMenuItems(items =>
                        items.map(i =>
                          i.id === item.id
                            ? { ...i, description: value }
                            : i
                        )
                      )}
                      className="h-32 mb-12"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem do Item
                    </label>
                    <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4">
                      <input {...getInputProps()} />
                      {item.imagePreview ? (
                        <img
                          src={item.imagePreview}
                          alt={item.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <div className="text-center">
                          <ImageIcon size={32} className="mx-auto text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">
                            Arraste uma imagem ou clique para selecionar
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Adicionais</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAddon(item.id)}
                        leftIcon={<Plus size={16} />}
                      >
                        Adicionar Grupo
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {item.addons.map(addon => (
                        <div key={addon.id} className="border rounded p-4">
                          <Input
                            label="Nome do Grupo"
                            value={addon.name}
                            onChange={(e) => setMenuItems(items =>
                              items.map(i =>
                                i.id === item.id
                                  ? {
                                      ...i,
                                      addons: i.addons.map(a =>
                                        a.id === addon.id
                                          ? { ...a, name: e.target.value }
                                          : a
                                      )
                                    }
                                  : i
                              )
                            )}
                            fullWidth
                          />

                          <div className="mt-2 space-x-4">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={addon.required}
                                onChange={(e) => setMenuItems(items =>
                                  items.map(i =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          addons: i.addons.map(a =>
                                            a.id === addon.id
                                              ? { ...a, required: e.target.checked }
                                              : a
                                          )
                                        }
                                      : i
                                  )
                                )}
                                className="rounded border-gray-300 text-red-600"
                              />
                              <span className="ml-2 text-sm">Obrigatório</span>
                            </label>

                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                checked={addon.multiple}
                                onChange={(e) => setMenuItems(items =>
                                  items.map(i =>
                                    i.id === item.id
                                      ? {
                                          ...i,
                                          addons: i.addons.map(a =>
                                            a.id === addon.id
                                              ? { ...a, multiple: e.target.checked }
                                              : a
                                          )
                                        }
                                      : i
                                  )
                                )}
                                className="rounded border-gray-300 text-red-600"
                              />
                              <span className="ml-2 text-sm">Múltipla Escolha</span>
                            </label>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="text-sm font-medium">Opções</h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAddAddonOption(item.id, addon.id)}
                                leftIcon={<Plus size={16} />}
                              >
                                Adicionar Opção
                              </Button>
                            </div>

                            <div className="space-y-2">
                              {addon.options.map(option => (
                                <div key={option.id} className="flex space-x-2">
                                  <Input
                                    placeholder="Nome da opção"
                                    value={option.name}
                                    onChange={(e) => setMenuItems(items =>
                                      items.map(i =>
                                        i.id === item.id
                                          ? {
                                              ...i,
                                              addons: i.addons.map(a =>
                                                a.id === addon.id
                                                  ? {
                                                      ...a,
                                                      options: a.options.map(o =>
                                                        o.id === option.id
                                                          ? { ...o, name: e.target.value }
                                                          : o
                                                      )
                                                    }
                                                  : a
                                              )
                                            }
                                          : i
                                      )
                                    )}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Preço"
                                    value={option.price}
                                    onChange={(e) => setMenuItems(items =>
                                      items.map(i =>
                                        i.id === item.id
                                          ? {
                                              ...i,
                                              addons: i.addons.map(a =>
                                                a.id === addon.id
                                                  ? {
                                                      ...a,
                                                      options: a.options.map(o =>
                                                        o.id === option.id
                                                          ? { ...o, price: parseFloat(e.target.value) }
                                                          : o
                                                      )
                                                    }
                                                  : a
                                              )
                                            }
                                          : i
                                      )
                                    )}
                                    leftIcon={<DollarSign size={16} />}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMenuItems(items =>
                                      items.map(i =>
                                        i.id === item.id
                                          ? {
                                              ...i,
                                              addons: i.addons.map(a =>
                                                a.id === addon.id
                                                  ? {
                                                      ...a,
                                                      options: a.options.filter(o => o.id !== option.id)
                                                    }
                                                  : a
                                              )
                                            }
                                          : i
                                      )
                                    )}
                                    leftIcon={<Trash2 size={16} />}
                                  >
                                    Remover
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setMenuItems(items =>
                              items.map(i =>
                                i.id === item.id
                                  ? {
                                      ...i,
                                      addons: i.addons.filter(a => a.id !== addon.id)
                                    }
                                  : i
                              )
                            )}
                            leftIcon={<Trash2 size={16} />}
                            className="mt-4"
                          >
                            Remover Grupo
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={(e) => setMenuItems(items =>
                          items.map(i =>
                            i.id === item.id
                              ? { ...i, isAvailable: e.target.checked }
                              : i
                          )
                        )}
                        className="rounded border-gray-300 text-red-600"
                      />
                      <span className="ml-2">Disponível</span>
                    </label>

                    <Button
                      variant="outline"
                      onClick={() => setMenuItems(items => items.filter(i => i.id !== item.id))}
                      leftIcon={<Trash2 size={18} />}
                    >
                      Remover Item
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personalizar Site</h1>
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={isLoading}
            leftIcon={<Save size={18} />}
          >
            Salvar Alterações
          </Button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
            <AlertCircle className="text-red-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Store className="mr-2" size={20} />
                Informações Básicas
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Nome do Restaurante"
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Restaurante Sabor & Arte"
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    rows={3}
                    placeholder="Descreva seu restaurante em poucas palavras..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Telefone"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(00) 0000-0000"
                    leftIcon={<Phone size={18} />}
                  />

                  <Input
                    label="WhatsApp"
                    value={settings.whatsapp}
                    onChange={(e) => setSettings(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="(00) 00000-0000"
                    leftIcon={<Phone size={18} />}
                  />

                  <Input
                    label="E-mail"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contato@seurestaurante.com"
                    leftIcon={<Mail size={18} />}
                  />

                  <Input
                    label="Endereço"
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Rua, número, bairro"
                    leftIcon={<MapPin size={18} />}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo Upload */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <ImageIcon className="mr-2" size={20} />
                Logo do Restaurante
              </h2>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
              >
                <input {...getInputProps()} />
                
                {settings.logoPreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={settings.logoPreview} 
                      alt="Logo preview" 
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                    <p className="text-sm text-gray-500">Clique ou arraste para trocar</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon size={48} className="text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      Arraste sua logo aqui ou clique para selecionar
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG até 5MB
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Theme Colors */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Palette className="mr-2" size={20} />
                Cores do Tema
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Principal
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
                    Cor Secundária
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <Clock className="mr-2" size={20} />
                Horário de Funcionamento
              </h2>
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
                        className="rounded border-gray-300 text-red-600 mr-2"
                      />
                      Aberto
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
                        <span>até</span>
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

          {/* Menu Categories */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-bold">Categorias do Cardápio</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settings.categories.map((category, index) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Input
                      value={category.name}
                      onChange={(e) => {
                        const newCategories = [...settings.categories];
                        newCategories[index] = { ...category, name: e.target.value };
                        setSettings(prev => ({ ...prev, categories: newCategories }));
                      }}
                      placeholder="Nome da categoria"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newCategories = settings.categories.filter(c => c.id !== category.id);
                        setSettings(prev => ({ ...prev, categories: newCategories }));
                      }}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
           <Input
  label="Tempo de Entrega (minutos)"
  value={settings.deliverySettings.deliveryTime}
  onChange={(e) => setSettings(prev => ({
    ...prev,
    deliverySettings: {
      ...prev.deliverySettings,
      deliveryTime: e.target.value
    }
  }))}
  placeholder="30"
/>

                <div className="col-span-2 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.deliverySettings.acceptsDelivery}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        deliverySettings: {
                          ...prev.deliverySettings,
                          acceptsDelivery: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-red-600"
                    />
                    <span>Aceita Delivery</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.deliverySettings.acceptsPickup}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        deliverySettings: {
                          ...prev.deliverySettings,
                          acceptsPickup: e.target.checked
                        }
                      }))}
                      className="rounded border-gray-300 text-red-600"
                    />
                    <span>Aceita Retirada</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Menu URL */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <h2 className="text-lg font-bold flex items-center">
                <LinkIcon className="mr-2" size={20} />
                Link do seu Cardápio Digital
              </h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Input
                  value={getMenuUrl()}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(getMenuUrl());
                    toast.success('Link copiado!');
                  }}
                >
                  Copiar Link
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Compartilhe este link com seus clientes para que eles acessem seu cardápio digital
              </p>
            </CardContent>
          </Card>

          {/* Menu Items Section */}
          {renderMenuItemsSection()}
        </div>
      </div>
    </div>
  );
};