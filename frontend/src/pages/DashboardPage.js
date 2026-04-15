import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { dashboardAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Users, 
  FileText, 
  Certificate, 
  ShieldCheck, 
  Warning,
  ArrowRight,
  Spinner
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statCards = [
    { label: 'Total Recipients', value: stats?.total_recipients || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Templates', value: stats?.total_templates || 0, icon: FileText, color: 'bg-purple-500' },
    { label: 'Issued Credentials', value: stats?.total_issued || 0, icon: Certificate, color: 'bg-green-500' },
    { label: 'Verified Count', value: stats?.total_verified || 0, icon: ShieldCheck, color: 'bg-cyan-500' },
    { label: 'Revoked', value: stats?.total_revoked || 0, icon: Warning, color: 'bg-red-500' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]" data-testid="dashboard-loading">
          <Spinner className="w-8 h-8 text-[#5B21B6] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8" data-testid="dashboard-page">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Dashboard</h1>
          <p className="text-[#52525B] mt-1">Overview of your credential management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6" data-testid="stats-grid">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-[#E2E8F0] hover:shadow-md transition-shadow" data-testid={`stat-card-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-[#52525B]">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#2A1B38] mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${stat.color} rounded-sm flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" weight="fill" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-testid="quick-actions">
          <Link to="/admin/recipients">
            <Card className="border-[#E2E8F0] hover:border-[#5B21B6] hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#5B21B6]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1B38]">Manage Recipients</p>
                    <p className="text-sm text-[#52525B]">Add, edit, or import recipients</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#52525B] group-hover:text-[#5B21B6] transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/templates">
            <Card className="border-[#E2E8F0] hover:border-[#5B21B6] hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#5B21B6]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1B38]">Manage Templates</p>
                    <p className="text-sm text-[#52525B]">Create certificate & badge templates</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#52525B] group-hover:text-[#5B21B6] transition-colors" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/issue">
            <Card className="border-[#E2E8F0] hover:border-[#5B21B6] hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="pt-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center">
                    <Certificate className="w-6 h-6 text-[#5B21B6]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1B38]">Issue Credential</p>
                    <p className="text-sm text-[#52525B]">Issue new certificates or badges</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#52525B] group-hover:text-[#5B21B6] transition-colors" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Credentials */}
          <Card className="border-[#E2E8F0]" data-testid="recent-credentials">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg text-[#2A1B38]">Recent Credentials</CardTitle>
              <Link to="/admin/credentials" className="text-sm text-[#5B21B6] hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {stats?.recent_credentials?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_credentials.map((cred, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
                      <div>
                        <p className="font-medium text-[#2A1B38]">{cred.recipient_name}</p>
                        <p className="text-sm text-[#52525B]">{cred.credential_title}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={cred.status === 'active' ? 'default' : 'destructive'} className={cred.status === 'active' ? 'bg-[#D1FAE5] text-[#059669]' : ''}>
                          {cred.status}
                        </Badge>
                        <p className="text-xs text-[#52525B] mt-1">{formatDate(cred.issue_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#52525B] py-8">No credentials issued yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Verifications */}
          <Card className="border-[#E2E8F0]" data-testid="recent-verifications">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg text-[#2A1B38]">Recent Verifications</CardTitle>
              <Link to="/admin/logs" className="text-sm text-[#5B21B6] hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {stats?.recent_verifications?.length > 0 ? (
                <div className="space-y-4">
                  {stats.recent_verifications.map((log, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#E2E8F0] last:border-0">
                      <div>
                        <p className="font-mono text-sm text-[#2A1B38]">{log.credential_code}</p>
                        <p className="text-xs text-[#52525B]">{formatDate(log.checked_at)}</p>
                      </div>
                      <Badge 
                        variant={log.result === 'valid' ? 'default' : 'destructive'}
                        className={log.result === 'valid' ? 'bg-[#D1FAE5] text-[#059669]' : ''}
                      >
                        {log.result}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#52525B] py-8">No verification attempts yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
