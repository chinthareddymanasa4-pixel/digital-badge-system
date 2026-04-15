import React from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { 
  Gear,
  Database,
  Key,
  Globe,
  Info
} from '@phosphor-icons/react';

export default function SettingsPage() {
  const envVars = [
    { name: 'DATABASE_URL', description: 'MongoDB connection string', example: 'mongodb://localhost:27017/credentials_db' },
    { name: 'SECRET_KEY', description: 'JWT secret key for token signing', example: 'your-super-secret-key-64-chars' },
    { name: 'FRONTEND_URL', description: 'Frontend URL for verification links', example: 'https://your-domain.com' },
    { name: 'ADMIN_EMAIL', description: 'Default admin email', example: 'admin@example.com' },
    { name: 'ADMIN_PASSWORD', description: 'Default admin password', example: 'admin123' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl" data-testid="settings-page">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Settings</h1>
          <p className="text-[#52525B] mt-1">System configuration and environment variables</p>
        </div>

        {/* System Info */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center">
                <Info className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <div>
                <CardTitle className="font-heading text-[#2A1B38]">System Information</CardTitle>
                <CardDescription>Current system configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#F8F9FA] rounded-sm">
                <p className="text-xs text-[#52525B] uppercase tracking-wide">Frontend URL</p>
                <p className="text-[#2A1B38] font-mono text-sm mt-1">{process.env.REACT_APP_BACKEND_URL || 'Not configured'}</p>
              </div>
              <div className="p-4 bg-[#F8F9FA] rounded-sm">
                <p className="text-xs text-[#52525B] uppercase tracking-wide">Environment</p>
                <p className="text-[#2A1B38] font-mono text-sm mt-1">{process.env.NODE_ENV || 'development'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environment Variables Documentation */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center">
                <Gear className="w-5 h-5 text-[#5B21B6]" />
              </div>
              <div>
                <CardTitle className="font-heading text-[#2A1B38]">Environment Variables</CardTitle>
                <CardDescription>Required configuration for local deployment</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-sm">
                <p className="text-sm text-[#92400E]">
                  <strong>Note:</strong> Environment variables should be configured in the <code className="bg-white px-1 py-0.5 rounded">.env</code> file in your backend directory. Never commit sensitive credentials to version control.
                </p>
              </div>

              <div className="space-y-4">
                {envVars.map((envVar, index) => (
                  <div key={index} className="border border-[#E2E8F0] rounded-sm p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#F8F9FA] rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        {envVar.name.includes('DATABASE') ? <Database className="w-4 h-4 text-[#5B21B6]" /> : 
                         envVar.name.includes('KEY') || envVar.name.includes('SECRET') ? <Key className="w-4 h-4 text-[#5B21B6]" /> :
                         <Globe className="w-4 h-4 text-[#5B21B6]" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-mono text-sm font-semibold text-[#2A1B38]">{envVar.name}</p>
                        <p className="text-sm text-[#52525B] mt-1">{envVar.description}</p>
                        <div className="mt-2">
                          <p className="text-xs text-[#52525B]">Example:</p>
                          <code className="text-xs bg-[#F8F9FA] px-2 py-1 rounded text-[#5B21B6] block mt-1">{envVar.example}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Local Setup Instructions */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <CardTitle className="font-heading text-[#2A1B38]">Local Setup Instructions</CardTitle>
            <CardDescription>Steps to run this application locally</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#2A1B38] mb-2">1. Backend Setup</h3>
                <div className="bg-[#2A1B38] text-white p-4 rounded-sm font-mono text-sm space-y-2">
                  <p className="text-[#52525B]"># Navigate to backend directory</p>
                  <p>cd backend</p>
                  <p className="text-[#52525B]"># Create virtual environment</p>
                  <p>python -m venv venv</p>
                  <p className="text-[#52525B]"># Activate virtual environment</p>
                  <p>source venv/bin/activate  # Linux/Mac</p>
                  <p>venv\Scripts\activate  # Windows</p>
                  <p className="text-[#52525B]"># Install dependencies</p>
                  <p>pip install -r requirements.txt</p>
                  <p className="text-[#52525B]"># Create .env file with required variables</p>
                  <p>cp .env.example .env</p>
                  <p className="text-[#52525B]"># Start the server</p>
                  <p>uvicorn server:app --reload --port 8001</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-[#2A1B38] mb-2">2. Frontend Setup</h3>
                <div className="bg-[#2A1B38] text-white p-4 rounded-sm font-mono text-sm space-y-2">
                  <p className="text-[#52525B]"># Navigate to frontend directory</p>
                  <p>cd frontend</p>
                  <p className="text-[#52525B]"># Install dependencies</p>
                  <p>npm install</p>
                  <p className="text-[#52525B]"># Create .env file</p>
                  <p>echo "REACT_APP_BACKEND_URL=http://localhost:8001" {'>'} .env</p>
                  <p className="text-[#52525B]"># Start development server</p>
                  <p>npm start</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-[#2A1B38] mb-2">3. Database Setup</h3>
                <p className="text-[#52525B] text-sm mb-2">
                  This application uses MongoDB. Make sure MongoDB is running locally or use a cloud-hosted instance.
                </p>
                <div className="bg-[#2A1B38] text-white p-4 rounded-sm font-mono text-sm">
                  <p className="text-[#52525B]"># Start MongoDB locally (if using local installation)</p>
                  <p>mongod --dbpath /path/to/data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
