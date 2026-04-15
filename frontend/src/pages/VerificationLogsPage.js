import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../components/AdminLayout';
import { logsAPI, formatApiError } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Spinner,
  CheckCircle,
  XCircle,
  Warning
} from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resultFilter, setResultFilter] = useState('all');

  const loadLogs = useCallback(async () => {
    try {
      const params = {
        result: resultFilter !== 'all' ? resultFilter : undefined
      };
      const response = await logsAPI.list(params);
      setLogs(response.data);
    } catch (error) {
      toast.error(formatApiError(error));
    } finally {
      setLoading(false);
    }
  }, [resultFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getResultIcon = (result) => {
    switch (result) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-[#059669]" weight="fill" />;
      case 'revoked':
        return <XCircle className="w-4 h-4 text-[#E11D48]" weight="fill" />;
      case 'expired':
        return <Warning className="w-4 h-4 text-[#F59E0B]" weight="fill" />;
      default:
        return <XCircle className="w-4 h-4 text-[#52525B]" weight="fill" />;
    }
  };

  const getResultBadgeColor = (result) => {
    switch (result) {
      case 'valid':
        return 'bg-[#D1FAE5] text-[#059669]';
      case 'revoked':
        return 'bg-[#FFE4E6] text-[#E11D48]';
      case 'expired':
        return 'bg-[#FEF3C7] text-[#D97706]';
      default:
        return 'bg-[#F3F4F6] text-[#52525B]';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6" data-testid="verification-logs-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2A1B38] tracking-tight">Verification Logs</h1>
            <p className="text-[#52525B] mt-1">Track all credential verification attempts</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="w-48" data-testid="result-filter">
                  <SelectValue placeholder="Filter by result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="not_found">Not Found</SelectItem>
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
            ) : logs.length === 0 ? (
              <div className="text-center py-12" data-testid="no-logs">
                <p className="text-[#52525B]">No verification logs found</p>
              </div>
            ) : (
              <Table data-testid="logs-table">
                <TableHeader>
                  <TableRow className="bg-[#F8F9FA]">
                    <TableHead className="font-semibold text-[#2A1B38]">Credential Code</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Checked At</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">Result</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">IP Address</TableHead>
                    <TableHead className="font-semibold text-[#2A1B38]">User Agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-[#F8F9FA]">
                      <TableCell className="font-mono text-sm text-[#5B21B6]">{log.credential_code}</TableCell>
                      <TableCell className="text-[#52525B]">{formatDate(log.checked_at)}</TableCell>
                      <TableCell>
                        <Badge className={getResultBadgeColor(log.result)}>
                          <span className="flex items-center gap-1">
                            {getResultIcon(log.result)}
                            {log.result}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#52525B] font-mono text-sm">{log.ip_address || 'N/A'}</TableCell>
                      <TableCell className="text-[#52525B] text-xs max-w-xs truncate" title={log.user_agent}>
                        {log.user_agent ? (log.user_agent.length > 50 ? log.user_agent.substring(0, 50) + '...' : log.user_agent) : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
