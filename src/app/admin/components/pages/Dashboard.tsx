import React from 'react';
import { TrendingUp, Building, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Properties',
      value: '147',
      change: '+12%',
      trend: 'up',
      icon: Building,
      color: 'text-blue-500',
    },
    {
      title: 'Monthly Views',
      value: '89,432',
      change: '+23%',
      trend: 'up',
      icon: Eye,
      color: 'text-purple-500',
    },
    {
      title: 'Revenue',
      value: '₹12.5L',
      change: '-2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-red-500',
    },
  ];

  const recentProperties = [
    {
      id: 1,
      name: 'Skyline Residences',
      type: 'Apartment',
      status: 'Under Construction',
      price: '₹1.2 - 2.5 Cr',
      views: 1234,
    },
    {
      id: 2,
      name: 'Green Valley Villas',
      type: 'Villa',
      status: 'Ready',
      price: '₹3.5 - 6.2 Cr',
      views: 892,
    },
    {
      id: 3,
      name: 'Metro Heights',
      type: 'Apartment',
      status: 'Upcoming',
      price: '₹85L - 1.8 Cr',
      views: 567,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
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
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentProperties.map((property) => (
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
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{property.price}</p>
                  <p className="text-sm text-gray-400">{property.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Button variant="primary" className="w-full justify-start">
              <Building className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};