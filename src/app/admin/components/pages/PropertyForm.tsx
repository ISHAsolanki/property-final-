import React, { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { useApp } from '../../context/AppContext';
import { Property, GalleryItem, VideoItem } from '../../types';

const defaultForm: Property = {
  name: '',
  tagline: '',
  propertyType: '',
  location: '',
  priceRange: '',
  builder: { developerName: '', websiteUrl: '' },
  keyHighlights: {
    reraApproved: false,
    possessionDate: '',
    unitConfiguration: '',
    carpetArea: '',
    otherAmenities: [''],
    igbcGoldCertified: false,
  },
  gallery: [{ url: '', name: '', data: '' }],
  videos: [{ url: '', name: '' }],
  locationAdvantage: { addressUrl: '', advantages: [''] },
  featuredDevelopment: { text: '', images: [''] },
  otherProjects: [''],
  trendingScore: 1,
  featured: false,
  status: '',
};

export const PropertyForm: React.FC = () => {
  const { setCurrentPage, showToast, selectedProperty, setSelectedProperty } = useApp();
  const [formData, setFormData] = useState<Property>(selectedProperty || defaultForm);
  const [loading, setLoading] = useState(false);

  // If selectedProperty changes (e.g. user clicks edit), update formData
  React.useEffect(() => {
    if (selectedProperty) {
      setFormData(selectedProperty);
    } else {
      setFormData(defaultForm);
    }
  }, [selectedProperty]);

  const handleChange = (field: keyof Property, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section: keyof Property, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
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

  const handleOtherProjectsChange = (index: number, value: string) => {
    setFormData(prev => {
      const otherProjects = [...prev.otherProjects];
      otherProjects[index] = value;
      return { ...prev, otherProjects };
    });
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

  const handleFeaturedDevImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const images = [...prev.featuredDevelopment.images];
      images[index] = value;
      return { ...prev, featuredDevelopment: { ...prev.featuredDevelopment, images } };
    });
  };

  const handleFeaturedDevImageAdd = () => {
    setFormData(prev => ({
      ...prev,
      featuredDevelopment: {
        ...prev.featuredDevelopment,
        images: [...prev.featuredDevelopment.images, ''],
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

  const propertyTypeOptions = [
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Appartment', label: 'Appartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Penthouse', label: 'Penthouse' },
  ];

  const statusOptions = [
    { value: 'Ready', label: 'Ready' },
    { value: 'Under Construction', label: 'Under Construction' },
    { value: 'Upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="p-8">
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
            <Select label="Property type" options={propertyTypeOptions} value={formData.propertyType} onChange={v => handleChange('propertyType', v)} required />
            <Input label="Location (area)" value={formData.location} onChange={v => handleChange('location', v)} required />
            <Input label="Price Range" value={formData.priceRange} onChange={v => handleChange('priceRange', v)} />
          </div>
        </Card>
        {/* Section 2: Builder Information */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Builder Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Developer name" value={formData.builder.developerName} onChange={v => handleNestedChange('builder', 'developerName', v)} required />
            <Input label="Website url" value={formData.builder.websiteUrl} onChange={v => handleNestedChange('builder', 'websiteUrl', v)} />
          </div>
        </Card>
        {/* Section 3: Key Highlights */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Key Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={formData.keyHighlights.reraApproved} onChange={e => handleNestedChange('keyHighlights', 'reraApproved', e.target.checked)} />
              <span className="text-sm text-gray-300">RERA Approved</span>
            </label>
            <Input label="Possession Date" value={formData.keyHighlights.possessionDate} onChange={v => handleNestedChange('keyHighlights', 'possessionDate', v)} />
            <Input label="Unit Configuration" value={formData.keyHighlights.unitConfiguration} onChange={v => handleNestedChange('keyHighlights', 'unitConfiguration', v)} />
            <Input label="Carpet area" value={formData.keyHighlights.carpetArea} onChange={v => handleNestedChange('keyHighlights', 'carpetArea', v)} />
            <label className="flex items-center space-x-3">
              <input type="checkbox" checked={formData.keyHighlights.igbcGoldCertified} onChange={e => handleNestedChange('keyHighlights', 'igbcGoldCertified', e.target.checked)} />
              <span className="text-sm text-gray-300">IGBC Gold certified</span>
            </label>
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Other amenities</h3>
            {formData.keyHighlights.otherAmenities.map((amenity, idx) => (
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
        {/* Section 6: Location and Advantage */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Location and Advantage</h2>
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
            {formData.featuredDevelopment.images.map((img, idx) => (
              <div key={idx} className="flex items-center space-x-3 mb-2">
                <Input placeholder="Image URL" value={img} onChange={v => handleFeaturedDevImageChange(idx, v)} />
                <Button variant="ghost" size="sm" icon={X} onClick={() => handleFeaturedDevImageRemove(idx)}>{''}</Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" icon={Plus} onClick={handleFeaturedDevImageAdd}>{''}</Button>
          </div>
        </Card>
        {/* Section 8: Other Projects of The Stolen Group */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Other Projects of The Stolen Group</h2>
          {formData.otherProjects.map((proj, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2">
              <Input placeholder="Project Name" value={proj} onChange={v => handleOtherProjectsChange(idx, v)} />
              <Button variant="ghost" size="sm" icon={X} onClick={() => handleOtherProjectsRemove(idx)}>{''}</Button>
            </div>
          ))}
          <Button variant="ghost" size="sm" icon={Plus} onClick={handleOtherProjectsAdd}>{''}</Button>
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