import React, { useState, useEffect } from 'react';
import { MapPin, Users, Building2, GraduationCap, ShoppingBag, Globe, TrendingUp, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import adminApi from '../../services/adminApi';

interface CountyData {
  name: string;
  sellers: number;
  students: number;
  teachers: number;
  schools: number;
  buyers: number;
  totalUsers: number;
}

interface CountryData {
  country: string;
  sellers: number;
  students: number;
  teachers: number;
  schools: number;
  buyers: number;
  totalUsers: number;
  flag: string;
}

export function AdminLocationsPage() {
  const [selectedCountry] = useState('Kenya');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counties, setCounties] = useState([
    { name: 'Nairobi', sellers: 245, students: 1240, teachers: 180, schools: 25, buyers: 890, totalUsers: 2580 },
    { name: 'Mombasa', sellers: 156, students: 680, teachers: 95, schools: 15, buyers: 450, totalUsers: 1396 },
    { name: 'Kisumu', sellers: 98, students: 520, teachers: 78, schools: 12, buyers: 320, totalUsers: 1028 },
    { name: 'Nakuru', sellers: 87, students: 445, teachers: 62, schools: 10, buyers: 280, totalUsers: 884 },
    { name: 'Machakos', sellers: 72, students: 380, teachers: 54, schools: 8, buyers: 210, totalUsers: 724 },
  ]);
  
  const [countries, setCountries] = useState([
    { country: 'Kenya', sellers: 2145, students: 12640, teachers: 1780, schools: 250, buyers: 8890, totalUsers: 25705, flag: '🇰🇪' },
    { country: 'Uganda', sellers: 856, students: 4580, teachers: 642, schools: 98, buyers: 3250, totalUsers: 9426, flag: '🇺🇬' },
  ]);

  // Load location data from API
  useEffect(() => {
    loadLocationData();
  }, []);

  const loadLocationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch location data from the API
      const locationData = await adminApi.getLocationAnalytics();
      setCounties(locationData.data.counties || counties);
      setCountries(locationData.data.countries || countries);
      
      // For now, if the API doesn't return data, we'll fallback to mock data
    } catch (err: any) {
      console.error('Error loading location data:', err);
      setError(err.message || 'Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  const filteredCounties = counties.filter(county =>
    county.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCounties = [...filteredCounties].sort((a, b) => {
    switch (selectedView) {
      case 'sellers':
        return b.sellers - a.sellers;
      case 'students':
        return b.students - a.students;
      case 'buyers':
        return b.buyers - a.buyers;
      default:
        return b.totalUsers - a.totalUsers;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Location Analytics</h1>
            <p className="text-gray-400 mt-1">Loading location data...</p>
          </div>
          <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700 opacity-50 cursor-not-allowed" disabled>
            <Globe className="h-4 w-4" />
            Export Map Data
          </button>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading location data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Location Analytics</h1>
            <p className="text-red-400 mt-1">Error: {error}</p>
          </div>
        </div>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">Failed to load location data. Please try again.</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md" 
              onClick={loadLocationData}
            >
              Retry
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Location Analytics</h1>
          <p className="text-gray-400 mt-1">Geographic distribution of users across countries and regions</p>
        </div>
        <button className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-700">
          <Globe className="h-4 w-4" />
          Export Map Data
        </button>
      </div>

      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList className="bg-gray-800 border border-gray-700">
          <TabsTrigger value="countries">Country Rankings</TabsTrigger>
          <TabsTrigger value="kenya">Kenya Counties</TabsTrigger>
        </TabsList>

        {/* Country Rankings Tab */}
        <TabsContent value="countries" className="space-y-4">
          <div className="grid gap-4">
            {countries.map((country, index) => (
              <Card key={country.country} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                      #{index + 1}
                    </div>
                    <span className="text-5xl">{country.flag}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{country.country}</h3>
                      <p className="text-sm text-gray-400">Total Users: {country.totalUsers.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-5 gap-6 flex-1">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">{country.sellers.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Sellers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{country.students.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Students</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">{country.teachers.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Teachers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-400">{country.schools.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Schools</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-pink-400">{country.buyers.toLocaleString()}</p>
                        <p className="text-xs text-gray-400 mt-1">Buyers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Kenya Counties Tab */}
        <TabsContent value="kenya" className="space-y-4">
          {/* Filters */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search counties..."
                    className="pl-10 bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedView('all')}
                    className={`px-3 py-1 rounded-md text-sm ${selectedView === 'all' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                  >
                    All Users
                  </button>
                  <button
                    onClick={() => setSelectedView('sellers')}
                    className={`px-3 py-1 rounded-md text-sm ${selectedView === 'sellers' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Sellers
                  </button>
                  <button
                    onClick={() => setSelectedView('students')}
                    className={`px-3 py-1 rounded-md text-sm ${selectedView === 'students' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Students
                  </button>
                  <button
                    onClick={() => setSelectedView('buyers')}
                    className={`px-3 py-1 rounded-md text-sm ${selectedView === 'buyers' ? 'bg-blue-600 text-white' : 'border border-gray-600 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Buyers
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Counties Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sortedCounties.map((county, index) => (
              <Card key={county.name} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{county.name}</CardTitle>
                        <p className="text-sm text-gray-400">{county.totalUsers} total users</p>
                      </div>
                    </div>
                    <MapPin className="h-5 w-5 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Sellers</p>
                      <p className="text-xl font-bold text-blue-400">{county.sellers}</p>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Students</p>
                      <p className="text-xl font-bold text-green-400">{county.students}</p>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Teachers</p>
                      <p className="text-xl font-bold text-purple-400">{county.teachers}</p>
                    </div>
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <p className="text-sm text-gray-400">Schools</p>
                      <p className="text-xl font-bold text-orange-400">{county.schools}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Buyers</span>
                      <span className="text-lg font-bold text-pink-400">{county.buyers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {sortedCounties.length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No counties found matching "{searchQuery}"</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
