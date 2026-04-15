import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { verificationAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Seal, 
  ShieldCheck, 
  ShieldWarning, 
  ArrowLeft, 
  MagnifyingGlass,
  CalendarBlank,
  User,
  Buildings,
  Certificate,
  Spinner,
  CheckCircle,
  XCircle,
  Warning
} from '@phosphor-icons/react';

export default function VerifyPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [searchCode, setSearchCode] = useState(code || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (code) {
      handleVerify(code);
    }
  }, [code]);

  const handleVerify = async (credentialCode) => {
    if (!credentialCode.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await verificationAPI.verify(credentialCode.trim());
      setResult(response.data);
    } catch (error) {
      setResult({
        valid: false,
        message: 'An error occurred while verifying the credential. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchCode.trim()) {
      navigate(`/verify/${searchCode.trim()}`);
      handleVerify(searchCode.trim());
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white" data-testid="verify-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#5B21B6] rounded-sm flex items-center justify-center">
              <Seal className="w-6 h-6 text-white" weight="fill" />
            </div>
            <span className="font-heading font-bold text-[#2A1B38] text-xl">Badge & Cert</span>
          </Link>
          <Link to="/login" data-testid="login-link">
            <Button variant="outline" className="border-[#E2E8F0]">
              Admin Login
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#52525B] hover:text-[#2A1B38] mb-8 transition-colors"
          data-testid="back-to-home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Search Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[#5B21B6]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-[#5B21B6]" weight="duotone" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#2A1B38] tracking-tight mb-4">
            Verify Credential
          </h1>
          <p className="text-[#52525B] max-w-lg mx-auto mb-8">
            Enter the credential code to verify its authenticity. You can find the code on the certificate or badge.
          </p>

          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <Input
                  type="text"
                  placeholder="Enter credential code (e.g., CRED-XXXXXXXX-YYYYMMDD)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="pl-10 border-[#E2E8F0]"
                  data-testid="verify-input"
                />
              </div>
              <Button 
                type="submit" 
                className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                disabled={loading}
                data-testid="verify-submit"
              >
                {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </form>
        </div>

        {/* Result Section */}
        {loading && (
          <div className="text-center py-12" data-testid="loading-state">
            <Spinner className="w-12 h-12 text-[#5B21B6] animate-spin mx-auto mb-4" />
            <p className="text-[#52525B]">Verifying credential...</p>
          </div>
        )}

        {!loading && searched && result && (
          <div className="animate-fade-in" data-testid="verification-result">
            {result.valid ? (
              <Card className="border-2 border-[#059669] bg-[#D1FAE5]/20" data-testid="valid-credential">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-[#059669] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-white" weight="fill" />
                  </div>
                  <CardTitle className="font-heading text-2xl text-[#059669]">
                    Credential Verified
                  </CardTitle>
                  <p className="text-[#52525B]">{result.message}</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-sm border border-[#E2E8F0] p-6 space-y-6">
                    {/* Certificate Preview Header */}
                    <div className="text-center border-b border-[#E2E8F0] pb-6">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#5B21B6] mb-2">
                        {result.credential_type === 'certificate' ? 'Certificate' : 'Badge'}
                      </p>
                      <h3 className="font-certificate text-2xl text-[#2A1B38] font-semibold">
                        {result.credential_title}
                      </h3>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#F8F9FA] rounded-sm flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[#5B21B6]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#52525B] uppercase tracking-wide">Recipient</p>
                          <p className="font-semibold text-[#2A1B38]">{result.recipient_name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#F8F9FA] rounded-sm flex items-center justify-center flex-shrink-0">
                          <Buildings className="w-5 h-5 text-[#5B21B6]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#52525B] uppercase tracking-wide">Issuer</p>
                          <p className="font-semibold text-[#2A1B38]">{result.issuer_name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#F8F9FA] rounded-sm flex items-center justify-center flex-shrink-0">
                          <CalendarBlank className="w-5 h-5 text-[#5B21B6]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#52525B] uppercase tracking-wide">Issue Date</p>
                          <p className="font-semibold text-[#2A1B38]">{formatDate(result.issue_date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#F8F9FA] rounded-sm flex items-center justify-center flex-shrink-0">
                          <Certificate className="w-5 h-5 text-[#5B21B6]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#52525B] uppercase tracking-wide">Credential Code</p>
                          <p className="font-mono text-sm text-[#2A1B38]">{result.credential_code}</p>
                        </div>
                      </div>
                    </div>

                    {result.expiry_date && (
                      <div className="pt-4 border-t border-[#E2E8F0]">
                        <p className="text-sm text-[#52525B]">
                          <span className="font-medium">Expiry Date:</span> {formatDate(result.expiry_date)}
                        </p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-center pt-4">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D1FAE5] text-[#059669] rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" weight="fill" />
                        Active & Valid
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card 
                className={`border-2 ${result.status === 'revoked' ? 'border-[#E11D48] bg-[#FFE4E6]/20' : 'border-[#F59E0B] bg-[#FEF3C7]/20'}`}
                data-testid="invalid-credential"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 ${result.status === 'revoked' ? 'bg-[#E11D48]' : 'bg-[#F59E0B]'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    {result.status === 'revoked' ? (
                      <XCircle className="w-10 h-10 text-white" weight="fill" />
                    ) : (
                      <Warning className="w-10 h-10 text-white" weight="fill" />
                    )}
                  </div>
                  <CardTitle className={`font-heading text-2xl ${result.status === 'revoked' ? 'text-[#E11D48]' : 'text-[#F59E0B]'}`}>
                    {result.status === 'revoked' ? 'Credential Revoked' : result.status === 'expired' ? 'Credential Expired' : 'Credential Not Found'}
                  </CardTitle>
                  <p className="text-[#52525B]">{result.message}</p>
                </CardHeader>
                
                {result.credential_code && (
                  <CardContent>
                    <div className="bg-white rounded-sm border border-[#E2E8F0] p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[#52525B]">Credential Code</p>
                          <p className="font-mono text-[#2A1B38]">{result.credential_code}</p>
                        </div>
                        {result.recipient_name && (
                          <div>
                            <p className="text-[#52525B]">Recipient</p>
                            <p className="text-[#2A1B38]">{result.recipient_name}</p>
                          </div>
                        )}
                        {result.credential_title && (
                          <div>
                            <p className="text-[#52525B]">Title</p>
                            <p className="text-[#2A1B38]">{result.credential_title}</p>
                          </div>
                        )}
                        {result.issuer_name && (
                          <div>
                            <p className="text-[#52525B]">Issuer</p>
                            <p className="text-[#2A1B38]">{result.issuer_name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Info Section */}
        {!searched && (
          <div className="mt-12 grid md:grid-cols-3 gap-6" data-testid="info-cards">
            <div className="text-center p-6 bg-[#F8F9FA] rounded-sm">
              <Certificate className="w-8 h-8 text-[#5B21B6] mx-auto mb-3" weight="duotone" />
              <h3 className="font-heading font-semibold text-[#2A1B38] mb-2">Find Your Code</h3>
              <p className="text-sm text-[#52525B]">The credential code is located on your certificate or badge document.</p>
            </div>
            <div className="text-center p-6 bg-[#F8F9FA] rounded-sm">
              <MagnifyingGlass className="w-8 h-8 text-[#5B21B6] mx-auto mb-3" weight="duotone" />
              <h3 className="font-heading font-semibold text-[#2A1B38] mb-2">Enter the Code</h3>
              <p className="text-sm text-[#52525B]">Type or paste the credential code in the search field above.</p>
            </div>
            <div className="text-center p-6 bg-[#F8F9FA] rounded-sm">
              <ShieldCheck className="w-8 h-8 text-[#5B21B6] mx-auto mb-3" weight="duotone" />
              <h3 className="font-heading font-semibold text-[#2A1B38] mb-2">Instant Results</h3>
              <p className="text-sm text-[#52525B]">Get immediate verification status and credential details.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
