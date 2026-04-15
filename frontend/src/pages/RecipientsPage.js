import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { recipientsAPI, formatApiError } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { 
  Plus, 
  MagnifyingGlass, 
  PencilSimple, 
  Trash, 
  Upload, 
  Download,
  Spinner,
  X
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    department: '',
    course_name: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const loadRecipients = useCallback(async () => {
    try {
      const response = await recipientsAPI.list({ search: search || undefined });
      setRecipients(response.data);
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadRecipients();
    }, 300);
    return () => clearTimeout(debounce);
  }, [loadRecipients]);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      organization: '',
      department: '',
      course_name: ''
    });
  };

  const handleAdd = async () => {
    setSubmitting(true);
    try {
      await recipientsAPI.create(formData);
      toast.success('Recipient added successfully');
      setShowAddModal(false);
      resetForm();
      loadRecipients();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    setSubmitting(true);
    try {
      await recipientsAPI.update(selectedRecipient.id, formData);
      toast.success('Recipient updated successfully');
      setShowEditModal(false);
      resetForm();
      loadRecipients();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await recipientsAPI.delete(selectedRecipient.id);
      toast.success('Recipient deleted successfully');
      setShowDeleteModal(false);
      loadRecipients();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleImport = async (file) => {
    setSubmitting(true);
    try {
      const response = await recipientsAPI.importCSV(file);
      toast.success(`Imported ${response.data.imported} recipients, ${response.data.skipped} skipped`);
      setShowImportModal(false);
      loadRecipients();
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await recipientsAPI.exportCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'recipients.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Recipients exported successfully');
    } catch (error) {
      toast.error(formatApiError(error));
    }
  };

  const openEditModal = (recipient) => {
    setSelectedRecipient(recipient);
    setFormData({
      full_name: recipient.full_name,
      email: recipient.email,
      phone: recipient.phone || '',
      organization: recipient.organization || '',
      department: recipient.department || '',
      course_name: recipient.course_name || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (recipient) => {
    setSelectedRecipient(recipient);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="recipients-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Recipients</h1>
            <p className="text-[#52525B] mt-1">Manage credential recipients</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowImportModal(true)} data-testid="import-btn">
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline" onClick={handleExport} data-testid="export-btn">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[#5B21B6] hover:bg-[#4C1D95]" onClick={() => { resetForm(); setShowAddModal(true); }} data-testid="add-recipient-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Recipient
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
              <Input
                type="text"
                placeholder="Search by name, email, organization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border-[#E2E8F0]"
                data-testid="search-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-[#E2E8F0]">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12" data-testid="loading">
                <Spinner className="w-8 h-8 text-[#5B21B6] animate-spin" />
              </div>
            ) : recipients.length === 0 ? (
              <div className="text-center py-12" data-testid="no-recipients">
                <p className="text-[#52525B]">No recipients found</p>
              </div>
            ) : (
              <Table data-testid="recipients-table">
                <TableHeader>
                  <TableRow className="bg-[#F8F9FA]">
                    <TableHead className="font-semibold text-[#2A1B38]">Name</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Email</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Organization</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Course</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Created</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((recipient) => (
                    <TableRow key={recipient.id} className="hover:bg-[#F8F9FA]">
                      <TableCell className="font-medium text-[#2A1B38]">{recipient.full_name}</TableCell>
                      <TableCell className="text-[#52525B]">{recipient.email}</TableCell>
                      <TableCell className="text-[#52525B]">{recipient.organization || '-'}</TableCell>
                      <TableCell className="text-[#52525B]">{recipient.course_name || '-'}</TableCell>
                      <TableCell className="text-[#52525B]">{formatDate(recipient.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(recipient)} data-testid={`edit-${recipient.id}`}>
                            <PencilSimple className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-[#E11D48] hover:text-[#E11D48]" onClick={() => openDeleteModal(recipient)} data-testid={`delete-${recipient.id}`}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={showAddModal || showEditModal} onOpenChange={(open) => { if (!open) { setShowAddModal(false); setShowEditModal(false); } }}>
          <DialogContent className="sm:max-w-md" data-testid="recipient-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">
                {showAddModal ? 'Add Recipient' : 'Edit Recipient'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Smith"
                  data-testid="input-full-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  data-testid="input-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Tech University"
                  data-testid="input-organization"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Computer Science"
                  data-testid="input-department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course_name">Course Name</Label>
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  placeholder="Web Development"
                  data-testid="input-course"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                Cancel
              </Button>
              <Button
                className="bg-[#5B21B6] hover:bg-[#4C1D95]"
                onClick={showAddModal ? handleAdd : handleEdit}
                disabled={submitting || !formData.full_name || !formData.email}
                data-testid="save-recipient-btn"
              >
                {submitting ? <Spinner className="w-4 h-4 animate-spin" /> : (showAddModal ? 'Add Recipient' : 'Save Changes')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="sm:max-w-md" data-testid="delete-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">Delete Recipient</DialogTitle>
            </DialogHeader>
            <p className="text-[#52525B] py-4">
              Are you sure you want to delete <strong>{selectedRecipient?.full_name}</strong>? This action cannot be undone.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={submitting} data-testid="confirm-delete-btn">
                {submitting ? <Spinner className="w-4 h-4 animate-spin" /> : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Modal */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="sm:max-w-md" data-testid="import-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">Import Recipients from CSV</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-[#52525B] mb-4">
                Upload a CSV file with columns: full_name, email, phone, organization, department, course_name
              </p>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImport(e.target.files[0]);
                  }
                }}
                className="border-[#E2E8F0]"
                data-testid="csv-file-input"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
