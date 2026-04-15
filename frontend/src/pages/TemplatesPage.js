import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { templatesAPI, formatApiError } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Plus, 
  PencilSimple, 
  Trash, 
  Certificate,
  Seal,
  Spinner,
  Eye
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    template_name: '',
    template_type: 'certificate',
    issuer_name: '',
    title: '',
    description: '',
    signature_name: '',
    signature_title: '',
    background_color: '#FFFFFF',
    text_color: '#2A1B38',
    accent_color: '#5B21B6'
  });
  const [submitting, setSubmitting] = useState(false);

  const loadTemplates = useCallback(async () => {
    try {
      const params = activeTab !== 'all' ? { template_type: activeTab } : {};
      const response = await templatesAPI.list(params);
      setTemplates(response.data);
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const resetForm = () => {
    setFormData({
      template_name: '',
      template_type: 'certificate',
      issuer_name: '',
      title: '',
      description: '',
      signature_name: '',
      signature_title: '',
      background_color: '#FFFFFF',
      text_color: '#2A1B38',
      accent_color: '#5B21B6'
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (isEditing) {
        await templatesAPI.update(selectedTemplate.id, formData);
        toast.success('Template updated successfully');
      } else {
        await templatesAPI.create(formData);
        toast.success('Template created successfully');
      }
      setShowModal(false);
      resetForm();
      loadTemplates();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await templatesAPI.delete(selectedTemplate.id);
      toast.success('Template deleted successfully');
      setShowDeleteModal(false);
      loadTemplates();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (template) => {
    setSelectedTemplate(template);
    setFormData({
      template_name: template.template_name,
      template_type: template.template_type,
      issuer_name: template.issuer_name,
      title: template.title,
      description: template.description || '',
      signature_name: template.signature_name || '',
      signature_title: template.signature_title || '',
      background_color: template.background_color || '#FFFFFF',
      text_color: template.text_color || '#2A1B38',
      accent_color: template.accent_color || '#5B21B6'
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setShowModal(true);
  };

  const openDeleteModal = (template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  const openPreviewModal = (template) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="templates-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Templates</h1>
            <p className="text-[#52525B] mt-1">Manage certificate and badge templates</p>
          </div>
          <Button className="bg-[#5B21B6] hover:bg-[#4C1D95]" onClick={openCreateModal} data-testid="create-template-btn">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#F8F9FA]">
            <TabsTrigger value="all" data-testid="tab-all">All Templates</TabsTrigger>
            <TabsTrigger value="certificate" data-testid="tab-certificate">Certificates</TabsTrigger>
            <TabsTrigger value="badge" data-testid="tab-badge">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12" data-testid="loading">
                <Spinner className="w-8 h-8 text-[#5B21B6] animate-spin" />
              </div>
            ) : templates.length === 0 ? (
              <Card className="border-[#E2E8F0]">
                <CardContent className="text-center py-12">
                  <p className="text-[#52525B]">No templates found</p>
                  <Button className="mt-4 bg-[#5B21B6] hover:bg-[#4C1D95]" onClick={openCreateModal}>
                    Create your first template
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="templates-grid">
                {templates.map((template) => (
                  <Card key={template.id} className="border-[#E2E8F0] hover:shadow-md transition-shadow" data-testid={`template-${template.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${template.template_type === 'certificate' ? 'bg-[#5B21B6]/10' : 'bg-[#059669]/10'}`}>
                            {template.template_type === 'certificate' ? (
                              <Certificate className="w-5 h-5 text-[#5B21B6]" />
                            ) : (
                              <Seal className="w-5 h-5 text-[#059669]" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-[#2A1B38]">{template.template_name}</CardTitle>
                            <Badge variant="outline" className={`mt-1 ${template.template_type === 'certificate' ? 'border-[#5B21B6] text-[#5B21B6]' : 'border-[#059669] text-[#059669]'}`}>
                              {template.template_type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><span className="text-[#52525B]">Title:</span> <span className="text-[#2A1B38]">{template.title}</span></p>
                        <p><span className="text-[#52525B]">Issuer:</span> <span className="text-[#2A1B38]">{template.issuer_name}</span></p>
                        {template.signature_name && (
                          <p><span className="text-[#52525B]">Signature:</span> <span className="text-[#2A1B38]">{template.signature_name}</span></p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-[#E2E8F0]">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openPreviewModal(template)} data-testid={`preview-${template.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditModal(template)} data-testid={`edit-${template.id}`}>
                          <PencilSimple className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-[#E11D48] hover:text-[#E11D48]" onClick={() => openDeleteModal(template)} data-testid={`delete-${template.id}`}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Create/Edit Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto" data-testid="template-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">
                {isEditing ? 'Edit Template' : 'Create Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template_name">Template Name *</Label>
                <Input
                  id="template_name"
                  value={formData.template_name}
                  onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                  placeholder="e.g., Professional Certificate"
                  data-testid="input-template-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template_type">Template Type *</Label>
                <Select value={formData.template_type} onValueChange={(val) => setFormData({ ...formData, template_type: val })}>
                  <SelectTrigger data-testid="select-template-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Credential Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Certificate of Completion"
                  data-testid="input-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer_name">Issuer Name *</Label>
                <Input
                  id="issuer_name"
                  value={formData.issuer_name}
                  onChange={(e) => setFormData({ ...formData, issuer_name: e.target.value })}
                  placeholder="e.g., Tech University"
                  data-testid="input-issuer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description for the credential"
                  rows={3}
                  data-testid="input-description"
                />
              </div>
              {formData.template_type === 'certificate' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signature_name">Signature Name</Label>
                    <Input
                      id="signature_name"
                      value={formData.signature_name}
                      onChange={(e) => setFormData({ ...formData, signature_name: e.target.value })}
                      placeholder="e.g., Dr. James Wilson"
                      data-testid="input-signature-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signature_title">Signature Title</Label>
                    <Input
                      id="signature_title"
                      value={formData.signature_title}
                      onChange={(e) => setFormData({ ...formData, signature_title: e.target.value })}
                      placeholder="e.g., Dean of Studies"
                      data-testid="input-signature-title"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button
                className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                onClick={handleSave}
                disabled={submitting || !formData.template_name || !formData.title || !formData.issuer_name}
                data-testid="save-template-btn"
              >
                {submitting ? <Spinner className="w-4 h-4 animate-spin" /> : (isEditing ? 'Save Changes' : 'Create Template')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-md" data-testid="delete-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">Delete Template</DialogTitle>
            </DialogHeader>
            <p className="text-[#52525B] py-4">
              Are you sure you want to delete <strong>{selectedTemplate?.template_name}</strong>? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting} data-testid="confirm-delete-btn">
                {submitting ? <Spinner className="w-4 h-4 animate-spin" /> : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Modal */}
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="sm:max-w-2xl" data-testid="preview-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">Template Preview</DialogTitle>
            </DialogHeader>
            {selectedTemplate && (
              <div className="py-4">
                <div className="certificate-preview p-8 rounded-sm">
                  {selectedTemplate.template_type === 'certificate' ? (
                    <div className="text-center space-y-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#5B21B6]">Certificate of Completion</p>
                      <h2 className="font-certificate text-3xl text-[#2A1B38]">{selectedTemplate.title}</h2>
                      <p className="text-[#52525B]">This is to certify that</p>
                      <p className="font-certificate text-2xl text-[#2A1B38] border-b-2 border-[#5B21B6] pb-2 inline-block px-8">[Recipient Name]</p>
                      <p className="text-[#52525B]">{selectedTemplate.description || 'has successfully completed the requirements for the above certification program.'}</p>
                      <div className="pt-8">
                        <p className="text-sm text-[#52525B]">Issued by: {selectedTemplate.issuer_name}</p>
                        {selectedTemplate.signature_name && (
                          <div className="mt-8 pt-4 border-t border-[#E2E8F0] inline-block">
                            <p className="font-semibold text-[#2A1B38]">{selectedTemplate.signature_name}</p>
                            <p className="text-sm text-[#52525B]">{selectedTemplate.signature_title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-[#5B21B6] rounded-full flex items-center justify-center mx-auto">
                        <Seal className="w-12 h-12 text-white" weight="fill" />
                      </div>
                      <h2 className="font-heading text-2xl text-[#2A1B38]">{selectedTemplate.title}</h2>
                      <p className="text-[#52525B]">{selectedTemplate.description || 'Awarded for demonstrating proficiency in the skill area.'}</p>
                      <p className="text-sm text-[#52525B]">Issued by: {selectedTemplate.issuer_name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
