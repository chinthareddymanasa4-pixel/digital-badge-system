import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Seal, Eye, EyeSlash, ArrowLeft } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6" data-testid="login-page">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#52525B] hover:text-[#2A1B38] mb-8 transition-colors"
          data-testid="back-to-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        <Card className="border-[#E2E8F0] shadow-sm" data-testid="login-card">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-[#5B21B6] rounded-sm flex items-center justify-center">
                <Seal className="w-8 h-8 text-white" weight="fill" />
              </div>
            </div>
            <CardTitle className="font-heading text-2xl text-[#2A1B38]">Admin Login</CardTitle>
            <CardDescription className="text-[#52525B]">
              Sign in to access the credential management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#2A1B38]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-[#E2E8F0] focus:ring-[#5B21B6]"
                  data-testid="email-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2A1B38]">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-[#E2E8F0] focus:ring-[#5B21B6] pr-10"
                    data-testid="password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#2A1B38]"
                    data-testid="toggle-password"
                  >
                    {showPassword ? <EyeSlash className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#5B21B6] hover:bg-[#4C1D95] text-white"
                disabled={loading}
                data-testid="login-submit"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
              <p className="text-center text-sm text-[#52525B]">
                Need to verify a credential?{' '}
                <Link to="/verify" className="text-[#5B21B6] hover:underline" data-testid="verify-link">
                  Verify here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
