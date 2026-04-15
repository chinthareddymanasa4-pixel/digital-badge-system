import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { recipientsAPI, templatesAPI, credentialsAPI, formatApiError } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { 
  Certificate,
  User,
  FileText,
  CalendarBlank,
  CheckCircle,
  Spinner,
  ArrowRight
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function IssueCredentialPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [issuedCredential, setIssuedCredential] = useState(null);

  const [formData, setFormData] = useState({
    recipient_id: '',
    template_id: '',
    credential_title: '',
    issuer_name: '',
    expiry_date: null
  });

  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recipientsRes, templatesRes] = await Promise.all([
        recipientsAPI.list({}),
        templatesAPI.list({})
      ]);
      setRecipients(recipientsRes.data);
      setTemplates(templatesRes.data);
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientSelect = (recipientId) => {
    const recipient = recipients.find(r => r.id === recipientId);
    setSelectedRecipient(recipient);
    setFormData({ ...formData, recipient_id: recipientId });
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    setFormData({
      ...formData,
      template_id: templateId,
      credential_title: template?.title || '',
      issuer_name: template?.issuer_name || ''
    });
  };

  const handleIssue = async () => {
    setSubmitting(true);
    try {
      const response = await credentialsAPI.issue({
        recipient_id: formData.recipient_id,
        template_id: formData.template_id,
        credential_title: formData.credential_title || ,
        issuer_name: formData.issuer_name || undefined,
        expiry_date: formData.expiry_date?.toISOString() || undefined
      });
      setIssuedCredential(response.data);
      setStep(4);
      toast.success('Credential issued successfully!');
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedToStep2 = formData.recipient_id;
  const canProceedToStep3 = formData.template_id;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]" data-testid="loading">
          <Spinner className="w-8 h-8 text-[#5B21B6] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-8" data-testid="issue-credential-page">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Issue Credential</h1>
          <p className="text-[#52525B] mt-1">Issue a new certificate or badge to a recipient</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[#E2E8F0]" />
          {[
            { num: 1, label: 'Select Recipient', icon: User },
            { num: 2, label: 'Select Template', icon: FileText },
            { num: 3, label: 'Confirm Details', icon: Certificate },
            { num: 4, label: 'Complete', icon: CheckCircle }
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isComplete = step > s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? 'bg-[#5B21B6] text-white' : isComplete ? 'bg-[#059669] text-white' : 'bg-[#E2E8F0] text-[#52525B]'
                }`}>
                  {isComplete ? <CheckCircle className="w-5 h-5" weight="fill" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs mt-2 ${isActive ? 'text-[#5B21B6] font-semibold' : 'text-[#52525B]'}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {step === 1 && (
          <Card className="border-[#E2E8F0]" data-testid="step-1">
            <CardHeader>
              <CardTitle className="font-heading text-[#2A1B38]">Select Recipient</CardTitle>
              <CardDescription>Choose the person who will receive this credential</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient</Label>
                <Select value={formData.recipient_id} onValueChange={handleRecipientSelect}>
                  <SelectTrigger data-testid="select-recipient">
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipients.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.full_name} ({r.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRecipient && (
                <div className="p-4 bg-[#F8F9FA] rounded-sm space-y-2">
                  <p className="font-semibold text-[#2A1B38]">{selectedRecipient.full_name}</p>
                  <p className="text-sm text-[#52525B]">{selectedRecipient.email}</p>
                  {selectedRecipient.organization && (
                    <p className="text-sm text-[#52525B]">Organization: {selectedRecipient.organization}</p>
                  )}
                  {selectedRecipient.course_name && (
                    <p className="text-sm text-[#52525B]">Course: {selectedRecipient.course_name}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  data-testid="next-step-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-[#E2E8F0]" data-testid="step-2">
            <CardHeader>
              <CardTitle className="font-heading text-[#2A1B38]">Select Template</CardTitle>
              <CardDescription>Choose a certificate or badge template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={formData.template_id} onValueChange={handleTemplateSelect}>
                  <SelectTrigger data-testid="select-template">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.template_name} ({t.template_type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <div className="p-4 bg-[#F8F9FA] rounded-sm space-y-2">
                  <p className="font-semibold text-[#2A1B38]">{selectedTemplate.template_name}</p>
                  <p className="text-sm text-[#52525B]">Type: {selectedTemplate.template_type}</p>
                  <p className="text-sm text-[#52525B]">Title: {selectedTemplate.title}</p>
                  <p className="text-sm text-[#52525B]">Issuer: {selectedTemplate.issuer_name}</p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  data-testid="next-step-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-[#E2E8F0]" data-testid="step-3">
            <CardHeader>
              <CardTitle className="font-heading text-[#2A1B38]">Confirm Details</CardTitle>
              <CardDescription>Review and customize the credential details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="credential_title">Credential Title</Label>
                  <Input
                    id="credential_title"
                    value={formData.credential_title}
                    onChange={(e) => setFormData({ ...formData, credential_title: e.target.value })}
                    data-testid="input-credential-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issuer_name">Issuer Name</Label>
                  <Input
                    id="issuer_name"
                    value={formData.issuer_name}
                    onChange={(e) => setFormData({ ...formData, issuer_name: e.target.value })}
                    data-testid="input-issuer-name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Expiry Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal" data-testid="expiry-date-btn">
                      <CalendarBlank className="w-4 h-4 mr-2" />
                      {formData.expiry_date ? format(formData.expiry_date, 'PPP') : 'No expiry date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.expiry_date}
                      onSelect={(date) => setFormData({ ...formData, expiry_date: date })}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Summary */}
              <div className="p-4 bg-[#F8F9FA] rounded-sm space-y-3 mt-4">
                <h3 className="font-semibold text-[#2A1B38]">Summary</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-[#52525B]">Recipient:</p>
                  <p className="text-[#2A1B38]">{selectedRecipient?.full_name}</p>
                  <p className="text-[#52525B]">Template:</p>
                  <p className="text-[#2A1B38]">{selectedTemplate?.template_name}</p>
                  <p className="text-[#52525B]">Type:</p>
                  <p className="text-[#2A1B38] capitalize">{selectedTemplate?.template_type}</p>
                  <p className="text-[#52525B]">Title:</p>
                  <p className="text-[#2A1B38]">{formData.credential_title}</p>
                  <p className="text-[#52525B]">Issuer:</p>
                  <p className="text-[#2A1B38]">{formData.issuer_name}</p>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button
                  className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                  onClick={handleIssue}
                  disabled={submitting}
                  data-testid="issue-btn"
                >
                  {submitting ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : <Certificate className="w-4 h-4 mr-2" />}
                  Issue Credential
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && issuedCredential && (
          <Card className="border-[#E2E8F0] border-2 border-[#059669]" data-testid="step-4">
            <CardContent className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-[#059669]" weight="fill" />
              </div>
              <div>
                <h2 className="font-heading text-2xl text-[#2A1B38] mb-2">Credential Issued Successfully!</h2>
                <p className="text-[#52525B]">The credential has been generated and is ready for verification.</p>
              </div>

              <div className="p-4 bg-[#F8F9FA] rounded-sm text-left max-w-md mx-auto space-y-2">
                <p><span className="text-[#52525B]">Credential Code:</span> <span className="font-mono text-[#5B21B6]">{issuedCredential.credential_code}</span></p>
                <p><span className="text-[#52525B]">Recipient:</span> <span className="text-[#2A1B38]">{issuedCredential.recipient_name}</span></p>
                <p><span className="text-[#52525B]">Title:</span> <span className="text-[#2A1B38]">{issuedCredential.credential_title}</span></p>
                <p><span className="text-[#52525B]">Type:</span> <span className="text-[#2A1B38] capitalize">{issuedCredential.credential_type}</span></p>
              </div>

              {issuedCredential.pdf_file_path && (
                <a 
                  href={`${process.env.REACT_APP_BACKEND_URL}${issuedCredential.pdf_file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="outline" data-testid="download-pdf-btn">
                    Download Certificate PDF
                  </Button>
                </a>
              )}

              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={() => navigate('/admin/credentials')} data-testid="view-all-btn">
                  View All Credentials
                </Button>
                <Button 
                  className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      recipient_id: '',
                      template_id: '',
                      credential_title: '',
                      issuer_name: '',
                      expiry_date: null
                    });
                    setSelectedRecipient(null);
                    setSelectedTemplate(null);
                    setIssuedCredential(null);
                  }}
                  data-testid="issue-another-btn"
                >
                  Issue Another Credential
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
