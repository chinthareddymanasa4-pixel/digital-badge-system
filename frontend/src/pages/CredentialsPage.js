import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { credentialsAPI, formatApiError } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  MagnifyingGlass, 
  Download,
  Eye,
  Prohibit,
  CheckCircle,
  Spinner,
  QrCode,
  FilePdf
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadCredentials = useCallback(async () => {
    try {
      const params = {
        search: search || undefined,
        credential_type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      const response = await credentialsAPI.list(params);
      setCredentials(response.data);
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      loadCredentials();
    }, 300);
    return () => clearTimeout(debounce);
  }, [loadCredentials]);

  const handleRevoke = async (credential) => {
    setActionLoading(true);
    try {
      await credentialsAPI.revoke(credential.id);
      toast.success('Credential revoked successfully');
      loadCredentials();
      if (showDetailModal) {
        setSelectedCredential({ ...credential, status: 'revoked' });
      }
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async (credential) => {
    setActionLoading(true);
    try {
      await credentialsAPI.activate(credential.id);
      toast.success('Credential activated successfully');
      loadCredentials();
      if (showDetailModal) {
        setSelectedCredential({ ...credential, status: 'active' });
      }
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await credentialsAPI.exportCSV();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'credentials.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Credentials exported successfully');
    } catch (error) {
      toast.error(formatApiError(error));
    }
  };

  const openDetailModal = (credential) => {
    setSelectedCredential(credential);
    setShowDetailModal(true);
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
      <div className="space-y-6" data-testid="credentials-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Issued Credentials</h1>
            <p className="text-[#52525B] mt-1">View and manage all issued credentials</p>
          </div>
          <Button variant="outline" onClick={handleExport} data-testid="export-btn">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#52525B]" />
                <Input
                  type="text"
                  placeholder="Search by code, recipient, title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-[#E2E8F0]"
                  data-testid="search-input"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40" data-testid="type-filter">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="badge">Badge</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                </SelectContent>
              </Select>
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
            ) : credentials.length === 0 ? (
              <div className="text-center py-12" data-testid="no-credentials">
                <p className="text-[#52525B]">No credentials found</p>
              </div>
            ) : (
              <Table data-testid="credentials-table">
                <TableHeader>
                  <TableRow className="bg-[#F8F9FA]">
                    <TableHead className="font-semibold text-[#2A1B38]">Code</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Recipient</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Title</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Type</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Issue Date</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Status</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((credential) => (
                    <TableRow key={credential.id} className="hover:bg-[#F8F9FA]">
                      <TableCell className="font-mono text-sm text-[#5B21B6]">{credential.credential_code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[#2A1B38]">{credential.recipient_name}</p>
                          <p className="text-xs text-[#52525B]">{credential.recipient_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#2A1B38]">{credential.credential_title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={credential.credential_type === 'certificate' ? 'border-[#5B21B6] text-[#5B21B6]' : 'border-[#059669] text-[#059669]'}>
                          {credential.credential_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#52525B]">{formatDate(credential.issue_date)}</TableCell>
                      <TableCell>
                        <Badge className={credential.status === 'active' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FFE4E6] text-[#E11D48]'}>
                          {credential.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDetailModal(credential)} data-testid={`view-${credential.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {credential.status === 'active' ? (
                            <Button variant="ghost" size="sm" className="text-[#E11D48] hover:text-[#E11D48]" onClick={() => handleRevoke(credential)} data-testid={`revoke-${credential.id}`}>
                              <Prohibit className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-[#059669] hover:text-[#059669]" onClick={() => handleActivate(credential)} data-testid={`activate-${credential.id}`}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="sm:max-w-lg" data-testid="detail-modal">
            <DialogHeader>
              <DialogTitle className="font-heading text-[#2A1B38]">Credential Details</DialogTitle>
            </DialogHeader>
            {selectedCredential && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Badge className={selectedCredential.status === 'active' ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-[#FFE4E6] text-[#E11D48]'}>
                    {selectedCredential.status}
                  </Badge>
                  <Badge variant="outline" className={selectedCredential.credential_type === 'certificate' ? 'border-[#5B21B6] text-[#5B21B6]' : 'border-[#059669] text-[#059669]'}>
                    {selectedCredential.credential_type}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#52525B] uppercase tracking-wide">Credential Code</p>
                    <p className="font-mono text-lg text-[#5B21B6]">{selectedCredential.credential_code}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#52525B] uppercase tracking-wide">Recipient</p>
                      <p className="text-[#2A1B38] font-medium">{selectedCredential.recipient_name}</p>
                      <p className="text-sm text-[#52525B]">{selectedCredential.recipient_email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#52525B] uppercase tracking-wide">Issuer</p>
                      <p className="text-[#2A1B38]">{selectedCredential.issuer_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#52525B] uppercase tracking-wide">Title</p>
                    <p className="text-[#2A1B38]">{selectedCredential.credential_title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#52525B] uppercase tracking-wide">Issue Date</p>
                      <p className="text-[#2A1B38]">{formatDate(selectedCredential.issue_date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#52525B] uppercase tracking-wide">Expiry Date</p>
                      <p className="text-[#2A1B38]">{selectedCredential.expiry_date ? formatDate(selectedCredential.expiry_date) : 'No expiry'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#E2E8F0]">
                  {selectedCredential.qr_code_path && (
                    <a 
                      href={`${process.env.REACT_APP_BACKEND_URL}${selectedCredential.qr_code_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <QrCode className="w-4 h-4 mr-2" />
                        View QR
                      </Button>
                    </a>
                  )}
                  {selectedCredential.pdf_file_path && (
                    <a 
                      href={`${process.env.REACT_APP_BACKEND_URL}${selectedCredential.pdf_file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <FilePdf className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              {selectedCredential?.status === 'active' ? (
                <Button 
                  variant="destructive" 
                  onClick={() => handleRevoke(selectedCredential)}
                  disabled={actionLoading}
                  data-testid="modal-revoke-btn"
                >
                  {actionLoading ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : <Prohibit className="w-4 h-4 mr-2" />}
                  Revoke Credential
                </Button>
              ) : (
                <Button 
                  className="bg-[#059669] hover:bg-[#047857]"
                  onClick={() => handleActivate(selectedCredential)}
                  disabled={actionLoading}
                  data-testid="modal-activate-btn"
                >
                  {actionLoading ? <Spinner className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  Activate Credential
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
