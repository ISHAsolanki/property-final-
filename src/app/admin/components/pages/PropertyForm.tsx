import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useApp } from '../../context/AppContext';
import { Property, GalleryItem, VideoItem } from '../../types';

function makePriceRange(from: string, to: string, unit: any): { from: string; to: string; unit: 'Lac' | 'Cr' } {
  let safeUnit: 'Lac' | 'Cr' = 'Lac';
  if (unit === 'Cr') safeUnit = 'Cr';
  return { from, to, unit: safeUnit };
}

const defaultForm: Property = {
  name: '',
  tagline: '',
  propertyType: '',
  location: '',
  priceRange: { from: { value: '', unit: 'Lac' }, to: { value: '', unit: 'Lac' } },
  builder: { developerName: '', websiteUrl: '' },
  keyHighlights: {
    reraApproved: false,
    possessionDate: '',
    unitConfiguration: '',
    carpetArea: { from: '', to: '', unit: 'sqft' },
    otherAmenities: [''],
    igbcGoldCertified: false,
  },
  gallery: [{ url: '', name: '', data: '' }],
  videos: [{ url: '', name: '' }],
  locationAdvantage: { address: '', addressUrl: '', advantages: [''] },
  featuredDevelopment: { text: '', images: [{ url: '', name: '', data: '' }] },
  otherProjects: [''],
  trendingScore: 1,
  featured: false,
  status: '',
};

export const PropertyForm: React.FC = () => {
  const { setCurrentPage, showToast, selectedProperty, setSelectedProperty } = useApp();
  const [formData, setFormData] = useState<Property>(selectedProperty || defaultForm);
  const [loading, setLoading] = useState(false);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [propertyCategories, setPropertyCategories] = useState<{ value: string; label: string }[]>([]);

  // Fetch all properties for the dropdown
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        if (data.success) {
          setAllProperties(data.properties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  // Fetch property categories
  useEffect(() => {
    fetch('/api/property-categories')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPropertyCategories(data.categories.map((cat: any) => ({ value: cat.name, label: cat.name })));
        }
      });
  }, []);

  // If selectedProperty changes (e.g. user clicks edit), update formData
  React.useEffect(() => {
    if (selectedProperty) {
      // If priceRange is a string (old data), try to parse it
      let priceRange = selectedProperty.priceRange;
      if (typeof priceRange === 'string') {
        // Try to extract numbers and unit
        const match = (priceRange as string).match(/([\d.]+)[^\d]+([\d.]+)?\s*(Lac|Cr)?/i);
        priceRange = {
          from: { value: match?.[1] || '', unit: (match?.[3] === 'Cr' ? 'Cr' : 'Lac') as 'Lac' | 'Cr' },
          to: { value: match?.[2] || '', unit: (match?.[3] === 'Cr' ? 'Cr' : 'Lac') as 'Lac' | 'Cr' },
        };
      } else if (!priceRange) {
        priceRange = { from: { value: '', unit: 'Lac' }, to: { value: '', unit: 'Lac' } };
      }
      // In React.useEffect for selectedProperty, ensure keyHighlights is always defined
      let keyHighlights = selectedProperty.keyHighlights || {
        reraApproved: false,
        possessionDate: '',
        unitConfiguration: '',
        carpetArea: { from: '', to: '', unit: 'sqft' },
        otherAmenities: [''],
        igbcGoldCertified: false,
      };
      let carpetArea = keyHighlights.carpetArea;
      if (typeof carpetArea === 'string') {
        // Try to extract numbers and unit
        const match = (carpetArea as string).match(/([\d.]+)[^\d]+([\d.]+)?\s*(sqft|sqmt|sqyd|acre|hectare)?/i);
        carpetArea = {
          from: match?.[1] || '',
          to: match?.[2] || '',
          unit: match?.[3] || 'sqft',
        };
      } else if (!carpetArea) {
        carpetArea = { from: '', to: '', unit: 'sqft' };
      }
      keyHighlights = { ...keyHighlights, carpetArea };
      setFormData({ ...selectedProperty, priceRange, keyHighlights });
    } else {
      setFormData(defaultForm);
    }
  }, [selectedProperty]);

  const handleChange = (field: keyof Property, value: any) => {
    if (field === 'priceRange') {
      setFormData(prev => {
        // Ensure from and to are always objects with value/unit
        let from = value.from ?? prev.priceRange.from ?? { value: '', unit: 'Lac' };
        let to = value.to ?? prev.priceRange.to ?? { value: '', unit: 'Lac' };
        // If from or to are strings, convert to object
        if (typeof from === 'string') from = { value: from, unit: 'Lac' };
        if (typeof to === 'string') to = { value: to, unit: 'Lac' };
        // Ensure unit is correct type
        if (typeof from.unit !== 'string' || (from.unit !== 'Lac' && from.unit !== 'Cr')) from.unit = 'Lac';
        if (typeof to.unit !== 'string' || (to.unit !== 'Lac' && to.unit !== 'Cr')) to.unit = 'Lac';
        return {
          ...prev,
          priceRange: { from, to },
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNestedChange = (section: keyof Property, field: string, value: any) => {
    setFormData(prev => {
      const sectionValue = prev[section] as any;
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: value },
      };
    });
  };

  const handleArrayChange = (section: keyof Property, field: string, index: number, value: string) => {
    setFormData(prev => {
      const sectionValue = typeof prev[section] === 'object' && prev[section] !== null ? prev[section] as any : {};
      const arr = Array.isArray(sectionValue[field]) ? [...sectionValue[field]] : [];
      arr[index] = value;
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: arr },
      };
    });
  };

  const handleArrayAdd = (section: keyof Property, field: string) => {
    setFormData(prev => {
      const sectionValue = typeof prev[section] === 'object' && prev[section] !== null ? prev[section] as any : {};
      const arr = Array.isArray(sectionValue[field]) ? [...sectionValue[field], ''] : [''];
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: arr },
      };
    });
  };

  const handleArrayRemove = (section: keyof Property, field: string, index: number) => {
    setFormData(prev => {
      const sectionValue = typeof prev[section] === 'object' && prev[section] !== null ? prev[section] as any : {};
      const arr = Array.isArray(sectionValue[field]) ? [...sectionValue[field]] : [];
      arr.splice(index, 1);
      return {
        ...prev,
        [section]: { ...sectionValue, [field]: arr },
      };
    });
  };

  const handleGalleryChange = (index: number, key: keyof GalleryItem, value: string) => {
    setFormData(prev => {
      const gallery = [...prev.gallery];
      gallery[index] = { ...gallery[index], [key]: value };
      return { ...prev, gallery };
    });
  };

  const handleGalleryAdd = () => {
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, { url: '', name: '', data: '' }] }));
  };

  const handleGalleryRemove = (index: number) => {
    setFormData(prev => {
      const gallery = [...prev.gallery];
      gallery.splice(index, 1);
      return { ...prev, gallery };
    });
  };

  const handleVideoChange = (index: number, key: keyof VideoItem, value: string) => {
    setFormData(prev => {
      const videos = [...prev.videos];
      videos[index] = { ...videos[index], [key]: value };
      return { ...prev, videos };
    });
  };

  const handleVideoAdd = () => {
    setFormData(prev => ({ ...prev, videos: [...prev.videos, { url: '', name: '' }] }));
  };

  const handleVideoRemove = (index: number) => {
    setFormData(prev => {
      const videos = [...prev.videos];
      videos.splice(index, 1);
      return { ...prev, videos };
    });
  };

  const handleOtherProjectsChange = (selectedProjectNames: string[]) => {
    setFormData(prev => ({ ...prev, otherProjects: selectedProjectNames }));
  };

  const handleOtherProjectsAdd = () => {
    setFormData(prev => ({ ...prev, otherProjects: [...prev.otherProjects, ''] }));
  };

  const handleOtherProjectsRemove = (index: number) => {
    setFormData(prev => {
      const otherProjects = [...prev.otherProjects];
      otherProjects.splice(index, 1);
      return { ...prev, otherProjects };
    });
  };

  const handleFeaturedDevImageChange = (index: number, key: keyof GalleryItem, value: string) => {
    setFormData(prev => {
      const images = [...prev.featuredDevelopment.images];
      images[index] = { ...images[index], [key]: value };
      return { ...prev, featuredDevelopment: { ...prev.featuredDevelopment, images } };
    });
  };

  const handleFeaturedDevImageAdd = () => {
    setFormData(prev => ({
      ...prev,
      featuredDevelopment: {
        ...prev.featuredDevelopment,
        images: [...prev.featuredDevelopment.images, { url: '', name: '', data: '' }],
      },
    }));
  };

  const handleFeaturedDevImageRemove = (index: number) => {
    setFormData(prev => {
      const images = [...prev.featuredDevelopment.images];
      images.splice(index, 1);
      return {
        ...prev,
        featuredDevelopment: { ...prev.featuredDevelopment, images },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Remove gallery items that have neither data nor url
      const cleanedGallery = formData.gallery.filter(img => (img.data && img.data !== '') || (img.url && img.url !== ''));
      const submitData = { ...formData, gallery: cleanedGallery };
      const isEdit = Boolean(formData._id);
      const res = await fetch('/api/properties', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Property saved successfully!', 'success');
        setCurrentPage('properties');
        setSelectedProperty(null); // Clear selected property after saving
      } else {
        showToast(data.message || 'Failed to save property', 'error');
      }
    } catch (err) {
      showToast('Failed to save property', 'error');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'Ready', label: 'Ready' },
    { value: 'Under Construction', label: 'Under Construction' },
    { value: 'Upcoming', label: 'Upcoming' },
  ];

  const unitNumbers = ['1', '2', '3', '4', '5', '6'];
  const unitTypes = ['BHK', 'RK', 'Studio'];

  return (
    <div className="p-8 overflow-hidden sticky top-0 bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => { setCurrentPage('properties'); setSelectedProperty(null); }}
          >{''}</Button>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{selectedProperty ? 'Edit Property' : 'Add Property'}</h1>
            <p className="text-gray-400">{selectedProperty ? 'Edit the property details' : 'Create a new property listing'}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Property name" value={formData.name} onChange={v => handleChange('name', v)} required />
            <Input label="Tagline" value={formData.tagline} onChange={v => handleChange('tagline', v)} />
            <Select label="Property type" options={propertyCategories} value={formData.propertyType} onChange={v => handleChange('propertyType', v)} required />
            <Input label="Area" value={formData.location} onChange={v => handleChange('location', v)} required />
            <div className="flex gap-2 items-end">
              <Input label="Price From" value={formData.priceRange.from.value} onChange={v => setFormData(prev => ({ ...prev, priceRange: { ...prev.priceRange, from: { ...prev.priceRange.from, value: v } } }))} required />
              <Select
                label="Unit"
                options={[
                  { value: 'Lac', label: 'Lac' },
                  { value: 'Cr', label: 'Cr' }
                ]}
                value={formData.priceRange.from.unit}
                onChange={v => setFormData(prev => ({ ...prev, priceRange: { ...prev.priceRange, from: { ...prev.priceRange.from, unit: v as 'Lac' | 'Cr' } } }))}
                required
                className="w-28"
              />
              <span className="text-white mb-2">to</span>
              <Input label="Price To" value={formData.priceRange.to.value} onChange={v => setFormData(prev => ({ ...prev, priceRange: { ...prev.priceRange, to: { ...prev.priceRange.to, value: v } } }))} required />
              <Select
                label="Unit"
                options={[
                  { value: 'Lac', label: 'Lac' },
                  { value: 'Cr', label: 'Cr' }
                ]}
                value={formData.priceRange.to.unit}
                onChange={v => setFormData(prev => ({ ...prev, priceRange: { ...prev.priceRange, to: { ...prev.priceRange.to, unit: v as 'Lac' | 'Cr' } } }))}
                required
                className="w-28"
              />
            </div>
          </div>
        </Card>
        {/* Section 2: Builder Information */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Builder Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Website url" value={formData.builder.websiteUrl} onChange={v => handleNestedChange('builder', 'websiteUrl', v)} />
          </div>
        </Card>
        {/* Section 3: Key Highlights */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Key Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={formData.keyHighlights?.reraApproved ?? false} onChange={e => handleNestedChange('keyHighlights', 'reraApproved', e.target.checked)} />
              <span className="text-sm text-gray-300">RERA Approved</span>
            </label>
            {formData.keyHighlights?.reraApproved && (
              <Input label="RERA Number" value={formData.keyHighlights?.reraNumber || ''} onChange={v => handleNestedChange('keyHighlights', 'reraNumber', v)} required />
            )}
            <Input label="Possession Date" type="date" value={formData.keyHighlights?.possessionDate || ''} onChange={v => handleNestedChange('keyHighlights', 'possessionDate', v)} />
            <div>
              <label className="block text-gray-300 mb-2">Unit Configuration</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {unitNumbers.map((num) => (
                  <div key={num} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!formData.keyHighlights?.unitConfiguration?.includes(num)}
                      onChange={e => {
                        let current = formData.keyHighlights?.unitConfiguration?.split(',').map(s => s.trim()).filter(Boolean) || [];
                        if (e.target.checked) {
                          current.push(num);
                        } else {
                          current = current.filter(val => val !== num);
                        }
                        handleNestedChange('keyHighlights', 'unitConfiguration', current.join(', '));
                      }}
                    />
                    <span className="text-gray-300">{num}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {unitTypes.map((type) => (
                  <div key={type} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={!!formData.keyHighlights?.unitConfiguration?.includes(type)}
                      onChange={e => {
                        let current = formData.keyHighlights?.unitConfiguration?.split(',').map(s => s.trim()).filter(Boolean) || [];
                        if (e.target.checked) {
                          current.push(type);
                        } else {
                          current = current.filter(val => val !== type);
                        }
                        handleNestedChange('keyHighlights', 'unitConfiguration', current.join(', '));
                      }}
                    />
                    <span className="text-gray-300">{type}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-end">
              <Input label="Carpet Area From" value={formData.keyHighlights?.carpetArea?.from || ''} onChange={v => setFormData(prev => ({ ...prev, keyHighlights: { ...prev.keyHighlights, carpetArea: { ...prev.keyHighlights?.carpetArea, from: v } } }))} required />
              <span className="text-white mb-2">to</span>
              <Input label="Carpet Area To" value={formData.keyHighlights?.carpetArea?.to || ''} onChange={v => setFormData(prev => ({ ...prev, keyHighlights: { ...prev.keyHighlights, carpetArea: { ...prev.keyHighlights?.carpetArea, to: v } } }))} required />
              <Select
                label="Unit"
                options={[
                  { value: 'sqft', label: 'sqft' },
                  { value: 'sqmt', label: 'sqmt' },
                  { value: 'sqyd', label: 'sqyd' },
                  { value: 'acre', label: 'acre' },
                  { value: 'hectare', label: 'hectare' }
                ]}
                value={formData.keyHighlights?.carpetArea?.unit || 'sqft'}
                onChange={v => setFormData(prev => ({ ...prev, keyHighlights: { ...prev.keyHighlights, carpetArea: { ...prev.keyHighlights?.carpetArea, unit: v } } }))}
                required
                className="w-28"
              />
            </div>
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={formData.keyHighlights?.igbcGoldCertified} onChange={e => handleNestedChange('keyHighlights', 'igbcGoldCertified', e.target.checked)} />
              <span className="text-sm text-gray-300">IGBC Gold certified</span>
            </label>
            {formData.keyHighlights?.igbcGoldCertified && (
              <Select
                label="IGBC Level"
                options={[
                  { value: 'Certified', label: 'Certified' },
                  { value: 'Silver', label: 'Silver' },
                  { value: 'Gold', label: 'Gold' },
                  { value: 'Platinum', label: 'Platinum' },
                ]}
                value={formData.keyHighlights?.igbcLevel || ''}
                onChange={v => handleNestedChange('keyHighlights', 'igbcLevel', v)}
                required
              />
            )}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Other amenities</h3>
            {formData.keyHighlights?.otherAmenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center space-x-3 mb-2">
                <Input placeholder="Amenity" value={amenity} onChange={v => handleArrayChange('keyHighlights', 'otherAmenities', idx, v)} />
                <Button variant="ghost" size="sm" icon={X} onClick={() => handleArrayRemove('keyHighlights', 'otherAmenities', idx)}>{''}</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={Plus} onClick={() => handleArrayAdd('keyHighlights', 'otherAmenities')}>{''}</Button>
          </div>
        </Card>
        {/* Section 4: Gallery */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Gallery</h2>
          {formData.gallery.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2">
              {/* File upload for new images */}
              <input
                type="file"
                accept="image/*"
                style={{ color: 'white' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = reader.result as string;
                      setFormData(prev => {
                        const gallery = [...prev.gallery];
                        gallery[idx] = { ...gallery[idx], data: base64, url: '', name: gallery[idx].name };
                        return { ...prev, gallery };
                      });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {/* Show preview if base64 or url exists */}
              {item.data ? (
                <img src={item.data} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : item.url ? (
                <img src={item.url} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : null}
              <Input placeholder="Name" value={item.name} onChange={v => handleGalleryChange(idx, 'name', v)} />
              {/* For backward compatibility, allow editing url if present */}
              {item.url && !item.data && (
                <Input placeholder="Image URL" value={item.url} onChange={v => handleGalleryChange(idx, 'url', v)} />
              )}
              <Button variant="ghost" size="sm" icon={X} onClick={() => handleGalleryRemove(idx)}>{''}</Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" icon={Plus} onClick={handleGalleryAdd}>{''}</Button>
        </Card>
        {/* Section 5: Video */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Video</h2>
          {formData.videos.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2">
              <Input placeholder="Video URL" value={item.url} onChange={v => handleVideoChange(idx, 'url', v)} />
              <Input placeholder="Name" value={item.name} onChange={v => handleVideoChange(idx, 'name', v)} />
              <Button variant="ghost" size="sm" icon={X} onClick={() => handleVideoRemove(idx)}>{''}</Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" icon={Plus} onClick={handleVideoAdd}>{''}</Button>
        </Card>
        {/* Section 6: Location and Proximity Highlights */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Location and Proximity Highlights</h2>
          <Input label="Address" value={formData.locationAdvantage.address} onChange={v => handleNestedChange('locationAdvantage', 'address', v)} />
          <Input label="Address url" value={formData.locationAdvantage.addressUrl} onChange={v => handleNestedChange('locationAdvantage', 'addressUrl', v)} />
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Advantages</h3>
            {formData.locationAdvantage.advantages.map((adv, idx) => (
              <div key={idx} className="flex items-center space-x-3 mb-2">
                <Input placeholder="Advantage" value={adv} onChange={v => handleArrayChange('locationAdvantage', 'advantages', idx, v)} />
                <Button variant="ghost" size="sm" icon={X} onClick={() => handleArrayRemove('locationAdvantage', 'advantages', idx)}>{''}</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={Plus} onClick={() => handleArrayAdd('locationAdvantage', 'advantages')}>{''}</Button>
          </div>
        </Card>
        {/* Section 7: Featured Development */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Featured Development</h2>
          <Input label="Text" value={formData.featuredDevelopment.text} onChange={v => handleNestedChange('featuredDevelopment', 'text', v)} />
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Images</h3>
            {formData.featuredDevelopment.images.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-3 mb-2">
                {/* File upload for new images */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ color: 'white' }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64 = reader.result as string;
                        setFormData(prev => {
                          const images = [...prev.featuredDevelopment.images];
                          images[idx] = { ...images[idx], data: base64, url: '', name: images[idx].name };
                          return { ...prev, featuredDevelopment: { ...prev.featuredDevelopment, images } };
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {/* Show preview if base64 or url exists */}
                {item.data ? (
                  <img src={item.data} alt="Preview" className="w-16 h-16 object-cover rounded" />
                ) : item.url ? (
                  <img src={item.url} alt="Preview" className="w-16 h-16 object-cover rounded" />
                ) : null}
                <Input placeholder="Name" value={item.name || ""} onChange={v => handleFeaturedDevImageChange(idx, 'name', v)} />
                {/* For backward compatibility, allow editing url if present */}
                {item.url && !item.data && (
                  <Input placeholder="Image URL" value={item.url || ""} onChange={v => handleFeaturedDevImageChange(idx, 'url', v)} />
                )}
                <Button variant="ghost" size="sm" icon={X} onClick={() => handleFeaturedDevImageRemove(idx)}>{''}</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={Plus} onClick={handleFeaturedDevImageAdd}>{''}</Button>
          </div>
        </Card>
        {/* Section 8: Other Projects of The Stolen Group */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Other Projects</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select 
                label="Property Type" 
                options={[
                  { value: '', label: 'Select property type' },
                  { value: 'Residential', label: 'Residential' },
                  { value: 'Commercial', label: 'Commercial' },
                  { value: 'Land', label: 'Land' },
                  { value: 'Luxury', label: 'Luxury' }
                ]} 
                value={formData.propertyType} 
                onChange={v => handleChange('propertyType', v)} 
              />
              <Select 
                label="Property" 
                options={[
                  { value: '', label: 'Select property type first' },
                  ...allProperties
                    .filter(property => 
                      property.propertyType === formData.propertyType && 
                      property._id !== formData._id
                    )
                    .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically by name
                    .map(property => ({
                      value: property.name,
                      label: `${property.name} - ${property.location}`
                    }))
                ]} 
                value="" 
                onChange={v => {
                  if (v && !formData.otherProjects.includes(v)) {
                    handleOtherProjectsChange([...formData.otherProjects, v]);
                  }
                }} 
              />
            </div>
            
            {formData.otherProjects.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Selected Projects:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.otherProjects.filter(Boolean).map((projectName, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      {projectName}
                      <button
                        type="button"
                        onClick={() => handleOtherProjectsChange(formData.otherProjects.filter((_, i) => i !== index))}
                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-red-400 hover:bg-red-200 hover:text-red-500 focus:outline-none focus:bg-red-200 focus:text-red-500"
                      >
                        <span className="sr-only">Remove</span>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
        {/* Section 9: Trending Score */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Trending Score</h2>
          <Input label="Trending Score (1-10)" type="number" value={formData.trendingScore.toString()} onChange={v => handleChange('trendingScore', parseInt(v) || 1)} helperText="Enter a value between 1 and 10" />
        </Card>
        {/* Section 10: Featured */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Featured</h2>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={formData.featured} onChange={e => handleChange('featured', e.target.checked)} />
            <span className="text-sm text-gray-300">Featured</span>
          </label>
        </Card>
        {/* Section 11: Status */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Status</h2>
          <Select label="Status" options={statusOptions} value={formData.status} onChange={v => handleChange('status', v)} required />
        </Card>
        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Button variant="secondary" onClick={() => { setCurrentPage('properties'); setSelectedProperty(null); }}>{'Cancel'}</Button>
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Saving...' : (selectedProperty ? 'Update Property' : 'Save Property')}</Button>
        </div>
      </form>
    </div>
  );
};