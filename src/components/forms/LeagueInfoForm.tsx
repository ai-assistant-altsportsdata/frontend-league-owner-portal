'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, Globe, Mail, MapPin, Trophy, Users, Zap } from 'lucide-react';
import { LeagueInfo } from '@/types/league';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, generateId } from '@/lib/utils';

const SPORTS_OPTIONS = [
  'Basketball', 'Football', 'Soccer', 'Baseball', 'Hockey', 'Tennis',
  'Volleyball', 'Rugby', 'Cricket', 'Lacrosse', 'Wrestling', 'Track & Field',
  'Swimming', 'Golf', 'Racing', 'Esports', 'Other'
];

const TIER_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Top-tier competitive leagues' },
  { value: 'semi-professional', label: 'Semi-Professional', description: 'Regional competitive leagues' },
  { value: 'amateur', label: 'Amateur', description: 'Community and recreational leagues' },
  { value: 'youth', label: 'Youth', description: 'Youth and junior leagues' },
];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
  'France', 'Spain', 'Italy', 'Netherlands', 'Japan', 'Brazil', 'Other'
];

export function LeagueInfoForm() {
  const { leagueInfo, setLeagueInfo, setCurrentStep, completeStep } = useOnboardingStore();
  const [formData, setFormData] = useState<Partial<LeagueInfo>>(
    leagueInfo || {
      id: generateId(),
      name: '',
      sport: '',
      established: '',
      description: '',
      website: '',
      contactEmail: '',
      contactName: '',
      tier: 'amateur',
      location: {
        country: '',
        region: '',
        city: '',
      },
    }
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'League name is required';
    }

    if (!formData.sport?.trim()) {
      newErrors.sport = 'Sport is required';
    }

    if (!formData.contactEmail?.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.contactName?.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.location?.country?.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const leagueData: LeagueInfo = {
      ...formData,
      id: formData.id || generateId(),
      name: formData.name!,
      sport: formData.sport!,
      established: formData.established || new Date().getFullYear().toString(),
      description: formData.description || '',
      website: formData.website || '',
      contactEmail: formData.contactEmail!,
      contactName: formData.contactName!,
      tier: formData.tier as LeagueInfo['tier'] || 'amateur',
      location: {
        country: formData.location?.country || '',
        region: formData.location?.region || '',
        city: formData.location?.city || '',
      },
    };

    setLeagueInfo(leagueData);
    completeStep(0);
    setCurrentStep(1);
  };

  const updateFormData = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const autoFillTestData = () => {
    const testData = {
      id: generateId(),
      name: 'Metro Basketball League',
      sport: 'Basketball',
      established: '2020',
      description: 'A competitive amateur basketball league serving the metropolitan area with teams from various neighborhoods.',
      website: 'https://metrobasketball.com',
      contactEmail: 'admin@metrobasketball.com',
      contactName: 'John Smith',
      tier: 'amateur',
      location: {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
      },
    };

    setFormData(testData as any);
    setErrors({}); // Clear any existing errors
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                League Information
              </CardTitle>
              <CardDescription>
                Tell us about your league to get started with data onboarding
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={autoFillTestData}
              className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700"
            >
              <Zap className="h-4 w-4" />
              Auto-Fill Test Data
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    League Name *
                  </label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="e.g., Metro Basketball League"
                    className={cn(errors.name && 'border-red-500')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sport *
                  </label>
                  <select
                    value={formData.sport || ''}
                    onChange={(e) => updateFormData('sport', e.target.value)}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      errors.sport && 'border-red-500'
                    )}
                  >
                    <option value="">Select a sport</option>
                    {SPORTS_OPTIONS.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                  {errors.sport && (
                    <p className="text-red-500 text-xs mt-1">{errors.sport}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Established Year
                  </label>
                  <Input
                    type="number"
                    value={formData.established || ''}
                    onChange={(e) => updateFormData('established', e.target.value)}
                    placeholder="2020"
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    League Tier
                  </label>
                  <select
                    value={formData.tier || 'amateur'}
                    onChange={(e) => updateFormData('tier', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {TIER_OPTIONS.map((tier) => (
                      <option key={tier.value} value={tier.value}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Brief description of your league..."
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://yourleague.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact Information
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Name *
                  </label>
                  <Input
                    value={formData.contactName || ''}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    placeholder="John Smith"
                    className={cn(errors.contactName && 'border-red-500')}
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.contactEmail || ''}
                      onChange={(e) => updateFormData('contactEmail', e.target.value)}
                      placeholder="contact@yourleague.com"
                      className={cn('pl-10', errors.contactEmail && 'border-red-500')}
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country *
                  </label>
                  <select
                    value={formData.location?.country || ''}
                    onChange={(e) => updateFormData('location.country', e.target.value)}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      errors.country && 'border-red-500'
                    )}
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    State/Region
                  </label>
                  <Input
                    value={formData.location?.region || ''}
                    onChange={(e) => updateFormData('location.region', e.target.value)}
                    placeholder="California"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <Input
                    value={formData.location?.city || ''}
                    onChange={(e) => updateFormData('location.city', e.target.value)}
                    placeholder="San Francisco"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" className="min-w-32">
                Continue to File Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}