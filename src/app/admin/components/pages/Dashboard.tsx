import React, { useState, useEffect } from 'react';
import { TrendingUp, Building, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { Property } from '../../types';

export const Dashboard: React.FC = () => {
  const { setCurrentPage, setSelectedProperty } = useApp();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    monthlyViews: 0,
    revenue: 0,
    featuredProperties: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        const data = await response.json();
        
        if (data.success) {
          const fetchedProperties = data.properties;
          setProperties(fetchedProperties);
          
          // Calculate stats
          const totalProperties = fetchedProperties.length;
          const featuredProperties = fetchedProperties.filter((p: Property) => p.featured).length;
          
          // Calculate revenue (sum of all price ranges - simplified calculation)
          const revenue = fetchedProperties.reduce((total: number, property: Property) => {
            const priceStr = formatPriceRange(property.priceRange);
            if (typeof priceStr === 'string') {
              const numbers = priceStr.match(/[\d.]+/g);
              if (numbers && numbers.length > 0) {
                const avgPrice = parseFloat(numbers[0]);
                return total + (avgPrice || 0);
              }
            }
            return total;
          }, 0);
          
          // Calculate monthly views (simulated based on trending score)
          const monthlyViews = fetchedProperties.reduce((total: number, property: Property) => {
            return total + ((property.trendingScore || 1) * 1000);
          }, 0);
          
          setStats({
            totalProperties,
            monthlyViews,
            revenue,
            featuredProperties,
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  function formatPriceRange(priceRange: any): string {
    if (!priceRange || typeof priceRange === 'string') return priceRange || '';
    const from = priceRange.from?.value ? `${priceRange.from.value} ${priceRange.from.unit}` : '';
    const to = priceRange.to?.value ? `${priceRange.to.value} ${priceRange.to.unit}` : '';
    if (from && to) return `${from} to ${to}`;
    return from || to || '';
  }

  const dashboardStats = [
    {
      title: 'Total Properties',
      value: stats.totalProperties.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: Building,
      color: 'text-blue-500',
    },
    // Replace Monthly Views with Most Popular Location
    (() => {
      const locationCounts: Record<string, number> = {};
      properties.forEach(p => {
        if (p.location) locationCounts[p.location] = (locationCounts[p.location] || 0) + 1;
      });
      const mostPopularLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      return {
        title: 'Most Popular Location',
        value: mostPopularLocation,
        change: '',
        trend: 'up' as const,
      icon: Eye,
      color: 'text-purple-500',
      };
    })(),
    // Replace Revenue with Most Common Property Type
    (() => {
      const typeCounts: Record<string, number> = {};
      properties.forEach(p => {
        if (p.propertyType) typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
      });
      const mostCommonType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
      return {
        title: 'Most Common Property Type',
        value: mostCommonType,
        change: '',
        trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-red-500',
      };
    })(),
    {
      title: 'Featured Properties',
      value: stats.featuredProperties.toString(),
      change: '+5%',
      trend: 'up' as const,
      icon: Building,
      color: 'text-green-500',
    },
  ];

  const recentProperties = properties
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 5)
    .map((property) => ({
      id: property._id || '',
      name: property.name,
      type: property.propertyType,
      status: property.status,
      price: formatPriceRange(property.priceRange),
      views: (property.trendingScore || 1) * 1000,
      featured: property.featured,
    }));

  const handleAddNewProperty = () => {
    setSelectedProperty(null);
    setCurrentPage('property-form');
  };

  const handleViewAllProperties = () => {
    setCurrentPage('properties');
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-gray-700 rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-800 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Properties</h2>
            <Button variant="ghost" size="sm" onClick={handleViewAllProperties}>
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentProperties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No properties found. Add your first property to get started!</p>
              </div>
            ) : (
              recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-white mb-1">{property.name}</h3>
                  <div className="flex items-center space-x-4">
                    <Badge variant="info" size="sm">
                      {property.type}
                    </Badge>
                    <Badge
                      variant={property.status === 'Ready' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {property.status}
                    </Badge>
                      {property.featured && (
                        <Badge variant="success" size="sm">
                          Featured
                        </Badge>
                      )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{property.price}</p>
                    <p className="text-sm text-gray-400">{property.views.toLocaleString()} views</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-start" onClick={handleAddNewProperty}>
              <Building className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
            <Button variant="secondary" className="w-full justify-start" onClick={handleViewAllProperties}>
              <Eye className="h-4 w-4 mr-2" />
              View All Properties
            </Button>
          </div>
          
          {/* Additional Stats */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Property Distribution</h3>
            <div className="space-y-2">
              {['Residential', 'Commercial', 'Land', 'Luxury'].map((type) => {
                const count = properties.filter(p => p.propertyType === type).length;
                const percentage = properties.length > 0 ? ((count / properties.length) * 100).toFixed(1) : '0';
                return (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">{type}</span>
                    <span className="text-sm text-white">{count} ({percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};