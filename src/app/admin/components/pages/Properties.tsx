import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye, Filter, Grid, List } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

export const Properties: React.FC = () => {
  const { setCurrentPage, showToast, setSelectedProperty } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        if (data.success) setProperties(data.properties);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || property.propertyType === filterType;
    const matchesStatus = !filterStatus || property.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (id?: string) => {
    const property = properties.find(p => p._id === id);
    setSelectedProperty(property || null);
    setCurrentPage('property-form');
    showToast('Opening property editor...', 'info');
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(props => props.filter(p => p._id !== id));
        showToast('Property deleted successfully', 'success');
      } else {
        showToast(data.message || 'Failed to delete property', 'error');
      }
    } catch {
      showToast('Failed to delete property', 'error');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Residential', label: 'Residential' },
    { value: 'Commercial', label: 'Commercial' },
    { value: 'Land', label: 'Land' },
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Appartment', label: 'Appartment' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Penthouse', label: 'Penthouse' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Under Construction', label: 'Under Construction' },
    { value: 'Upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Properties</h1>
          <p className="text-gray-400">Manage your real estate properties</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => { setSelectedProperty(null); setCurrentPage('property-form'); }}
        >
          Add Property
        </Button>
      </div>
      <Card className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1"
            />
            <Select
              options={propertyTypeOptions}
              value={filterType}
              onChange={setFilterType}
              placeholder="Filter by type"
            />
            <Select
              options={statusOptions}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="Filter by status"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              icon={Grid}
              onClick={() => setViewMode('grid')}
            >{''}</Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              icon={List}
              onClick={() => setViewMode('list')}
            >{''}</Button>
          </div>
        </div>
      </Card>
      <Card>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No properties found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Property</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Price Range</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        {property.gallery && property.gallery[0]?.url ? (
                          <img
                            src={property.gallery[0].url}
                            alt={property.gallery[0].name || property.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                        )}
                        <div>
                          <p className="font-medium text-white">{property.name}</p>
                          <p className="text-sm text-gray-400">{property.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="info" size="sm">
                        {property.propertyType}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{property.status}</td>
                    <td className="py-4 px-4">{property.priceRange}</td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEdit(property._id)}>{''}</Button>
                      <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDelete(property._id)}>{''}</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};