import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Seal, 
  ShieldCheck, 
  Certificate, 
  QrCode, 
  ArrowRight,
  CheckCircle,
  Lightning,
  Lock,
  Globe
} from '@phosphor-icons/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function LandingPage() {
  const [verifyCode, setVerifyCode] = React.useState('');

  const features = [
    {
      icon: Certificate,
      title: 'Digital Certificates',
      description: 'Create professional PDF certificates with custom templates and branding.'
    },
    {
      icon: Seal,
      title: 'Digital Badges',
      description: 'Issue verifiable digital badges for achievements and skills.'
    },
    {
      icon: QrCode,
      title: 'QR Code Verification',
      description: 'Each credential includes a unique QR code for instant verification.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Verifiable',
      description: 'All credentials are stored securely and can be verified publicly.'
    },
    {
      icon: Lightning,
      title: 'Instant Issuance',
      description: 'Issue credentials to recipients instantly with automated generation.'
    },
    {
      icon: Globe,
      title: 'Public Verification',
      description: 'Anyone can verify credential authenticity without login.'
    }
  ];

  const steps = [
    { number: '01', title: 'Create Template', description: 'Design certificate or badge templates with your branding.' },
    { number: '02', title: 'Add Recipients', description: 'Import recipients manually or via CSV upload.' },
    { number: '03', title: 'Issue Credentials', description: 'Generate unique credentials with QR codes and PDFs.' },
    { number: '04', title: 'Verify Anytime', description: 'Recipients and employers can verify credentials instantly.' }
  ];

  return (
    <div className="min-h-screen bg-white" data-testid="landing-page">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#5B21B6] rounded-sm flex items-center justify-center">
              <Seal className="w-6 h-6 text-white" weight="fill" />
            </div>
            <span className="font-heading font-bold text-[#2A1B38] text-xl">Badge & Cert</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/verify" data-testid="verify-link">
              <Button variant="ghost" className="text-[#52525B] hover:text-[#5B21B6] hover:bg-[#F1F5F9]">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Verify Credential
              </Button>
            </Link>
            <Link to="/login" data-testid="login-link">
              <button 
                className="inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium bg-[#5B21B6] text-white transition-all duration-200"
                style={{ backgroundColor: '#5B21B6' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2A1B38'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5B21B6'}
              >
                Admin Login
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1624213012413-fda54df1810f?crop=entropy&cs=srgb&fm=jpg&q=85)' }}
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80 mb-4">
              Digital Credential Management
            </p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-6">
              Issue & Verify Digital Badges and Certificates
            </h1>
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-xl">
              A complete solution for institutions to create, issue, manage, and verify digital credentials securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" data-testid="get-started-btn">
                <Button size="lg" className="bg-white text-[#5B21B6] hover:bg-gray-100 hover:shadow-lg px-8 transition-all duration-200">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/verify" data-testid="verify-now-btn">
                <Button size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#5B21B6] px-8 transition-all duration-200">
                  Verify a Credential
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Verify Section */}
      <section className="py-16 bg-[#F8F9FA]" data-testid="quick-verify-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2A1B38] tracking-tight mb-4">
              Quick Verification
            </h2>
            <p className="text-[#52525B] mb-6">
              Enter a credential code below to verify its authenticity
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (verifyCode.trim()) {
                  window.location.href = `/verify/${verifyCode.trim()}`;
                }
              }}
              className="flex gap-3"
            >
              <Input
                type="text"
                placeholder="Enter credential code (e.g., CRED-XXXXXXXX-YYYYMMDD)"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="flex-1"
                data-testid="quick-verify-input"
              />
              <Button type="submit" className="bg-[#5B21B6] hover:bg-[#4C1D95]" data-testid="quick-verify-btn">
                Verify
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5B21B6] mb-4">Features</p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A1B38] tracking-tight">
              Everything You Need
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-[#E2E8F0] p-6 rounded-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  data-testid={`feature-card-${index}`}
                >
                  <div className="w-12 h-12 bg-[#5B21B6]/10 rounded-sm flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#5B21B6]" weight="duotone" />
                  </div>
                  <h3 className="font-heading font-semibold text-[#2A1B38] text-lg mb-2">{feature.title}</h3>
                  <p className="text-[#52525B] text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#2A1B38]" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[#5B21B6] mb-4">Process</p>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center" data-testid={`step-${index}`}>
                <div className="text-5xl font-heading font-bold text-[#5B21B6] mb-4">{step.number}</div>
                <h3 className="font-heading font-semibold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24" data-testid="trust-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#5B21B6] mb-4">Security</p>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A1B38] tracking-tight mb-6">
                Trusted Credential Verification
              </h2>
              <p className="text-[#52525B] leading-relaxed mb-8">
                Every credential issued through our system is uniquely coded and can be verified instantly by anyone. Our verification system ensures authenticity and prevents fraud.
              </p>
              <ul className="space-y-4">
                {[
                  'Unique credential codes for each certificate',
                  'QR code scanning for instant verification',
                  'Public verification without login required',
                  'Complete audit trail of all verifications'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#059669]" weight="fill" />
                    <span className="text-[#2A1B38]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1758270703662-b7d58bf0a8a2?crop=entropy&cs=srgb&fm=jpg&q=85"
                alt="Graduates celebrating"
                className="rounded-sm shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-sm shadow-lg border border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#059669]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2A1B38] text-sm">Secure & Verified</p>
                    <p className="text-xs text-[#52525B]">100% Authentic</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#F8F9FA]" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A1B38] tracking-tight mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-[#52525B] max-w-xl mx-auto mb-8">
            Start issuing digital badges and certificates for your organization today.
          </p>
          <Link to="/login" data-testid="cta-login-btn">
            <Button size="lg" className="bg-[#5B21B6] hover:bg-[#4C1D95] px-8">
              Access Admin Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A1B38] py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5B21B6] rounded-sm flex items-center justify-center">
                <Seal className="w-6 h-6 text-white" weight="fill" />
              </div>
              <span className="font-heading font-bold text-white text-xl">Badge & Cert</span>
            </div>
            <p className="text-white/60 text-sm">
              Digital Badge and Certification Management System
            </p>
            <div className="flex gap-6">
              <Link to="/verify" className="text-white/60 hover:text-white text-sm transition-colors">
                Verify Credential
              </Link>
              <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
