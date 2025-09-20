'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Database,
  Eye,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SchemaVisualization } from '@/components/schema/SchemaVisualization';

export function DashboardPreview() {
  const { leagueInfo, schemas, files, processingResults } = useOnboardingStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'data' | 'schemas' | 'insights'>('overview');

  const generateDashboardStats = () => {
    const totalRecords = processingResults.reduce((sum, result) => {
      return sum + (result.extractedData?.length || 0);
    }, 0);

    const totalFields = schemas.reduce((sum, schema) => {
      return sum + countSchemaFields(schema);
    }, 0);

    const dataQuality = Math.round(
      (processingResults.filter(r => r.success).length / Math.max(1, processingResults.length)) * 100
    );

    const complexity = Math.min(100, Math.round((totalFields / 10) * 20 + (schemas.length * 15)));

    return {
      totalFiles: files.length,
      totalRecords,
      totalFields,
      dataQuality,
      complexity,
      integrationReadiness: Math.round((dataQuality + (100 - complexity / 2)) / 2),
    };
  };

  const countSchemaFields = (schema: any): number => {
    if (schema.type === 'object' && schema.properties) {
      return Object.keys(schema.properties).length +
        Object.values(schema.properties).reduce((sum: number, prop: any) => sum + countSchemaFields(prop), 0);
    }
    if (schema.type === 'array' && schema.items) {
      return countSchemaFields(schema.items);
    }
    return 1;
  };

  const stats = generateDashboardStats();

  const getDataTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};

    schemas.forEach(schema => {
      const collectTypes = (node: any) => {
        if (node.type === 'object' && node.properties) {
          Object.values(node.properties).forEach((prop: any) => {
            distribution[prop.type] = (distribution[prop.type] || 0) + 1;
            collectTypes(prop);
          });
        } else if (node.type === 'array' && node.items) {
          collectTypes(node.items);
        }
      };
      collectTypes(schema);
    });

    return distribution;
  };

  const dataTypes = getDataTypeDistribution();

  const generateRecommendations = () => {
    const recommendations = [];

    if (stats.dataQuality < 80) {
      recommendations.push('Consider improving data quality by validating field formats');
    }

    if (stats.complexity > 70) {
      recommendations.push('Complex data structure detected - consider data normalization');
    }

    if (stats.totalRecords > 10000) {
      recommendations.push('Large dataset - implement pagination for better performance');
    }

    if (!schemas.some(s => s.name.toLowerCase().includes('player'))) {
      recommendations.push('Consider adding player/participant data for comprehensive analytics');
    }

    recommendations.push('Data structure is compatible with our analytics platform');
    return recommendations;
  };

  const recommendations = generateRecommendations();

  const handleLaunchDashboard = () => {
    // In a real app, this would redirect to the actual dashboard
    window.open('/dashboard', '_blank');
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        activeTab === tab
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary hover:bg-secondary/80'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            League Dashboard Preview
          </CardTitle>
          <CardDescription>
            Preview your personalized league analytics dashboard
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton tab="overview" label="Overview" icon={Eye} />
        <TabButton tab="data" label="Data Summary" icon={Database} />
        <TabButton tab="schemas" label="Schema Details" icon={FileText} />
        <TabButton tab="insights" label="Insights" icon={TrendingUp} />
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* League Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {leagueInfo?.name}
                </CardTitle>
                <CardDescription>
                  {leagueInfo?.sport} • {leagueInfo?.tier} • Est. {leagueInfo?.established}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>{leagueInfo?.location.city}, {leagueInfo?.location.country}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{leagueInfo?.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{leagueInfo?.contactName}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{leagueInfo?.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Data Files</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalRecords.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Records</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalFields}</div>
                  <div className="text-sm text-muted-foreground">Data Fields</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.dataQuality}%</div>
                  <div className="text-sm text-muted-foreground">Data Quality</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.complexity}%</div>
                  <div className="text-sm text-muted-foreground">Complexity</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-teal-600">{stats.integrationReadiness}%</div>
                  <div className="text-sm text-muted-foreground">Ready</div>
                </CardContent>
              </Card>
            </div>

            {/* Integration Readiness */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Readiness</CardTitle>
                <CardDescription>How ready your data is for our analytics platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Data Quality</span>
                      <span>{stats.dataQuality}%</span>
                    </div>
                    <Progress value={stats.dataQuality} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Schema Compatibility</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Integration Readiness</span>
                      <span>{stats.integrationReadiness}%</span>
                    </div>
                    <Progress value={stats.integrationReadiness} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6">
            {/* Data Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Data Type Distribution</CardTitle>
                <CardDescription>Breakdown of field types in your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(dataTypes).map(([type, count]) => (
                    <div key={type} className="text-center p-3 bg-secondary rounded-lg">
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-muted-foreground capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Files Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Files Summary</CardTitle>
                <CardDescription>Overview of uploaded and processed files</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file, index) => {
                    const result = processingResults[index];
                    return (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {result?.extractedData?.length || 0} records • {file.type.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                            result?.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {result?.success ? 'Processed' : 'Failed'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'schemas' && (
          <div className="space-y-6">
            {schemas.map((schema) => (
              <SchemaVisualization key={schema.id} schema={schema} />
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>AI-powered insights and suggestions for your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-blue-900">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>What happens after onboarding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <h4 className="font-medium">Dashboard Access</h4>
                      <p className="text-sm text-muted-foreground">Get immediate access to your personalized dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <h4 className="font-medium">Data Integration</h4>
                      <p className="text-sm text-muted-foreground">Your data will be integrated into our analytics platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <h4 className="font-medium">Analytics & Insights</h4>
                      <p className="text-sm text-muted-foreground">Start receiving AI-powered insights and analytics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setActiveTab('overview')}>
          Back to Overview
        </Button>

        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </Button>

          <Button onClick={handleLaunchDashboard} size="lg">
            <ExternalLink className="h-4 w-4 mr-2" />
            Launch Dashboard
          </Button>
        </div>
      </div>
    </motion.div>
  );
}