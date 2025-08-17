import { useState, useEffect } from 'react';
import { ReportApi } from '../lib/api';
import type { Report, PaginatedReports, FilterReportParams, ListReportsParams } from '../types/reportAI';

interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const minifyHTML = (html: string): string => {
  return html
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .replace(/>\s+</g, '><')        // Remove spaces between tags
    .replace(/\n/g, '')             // Remove line breaks
    .replace(/\t/g, '')             // Remove tabs
    .trim();                        // Remove leading/trailing spaces
};

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (params?: ListReportsParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportApi.listReports(params);
      setReports(data.reports);
      setPagination({
        page: data.page,
        pageSize: data.page_size,
        totalCount: data.total_count,
        totalPages: data.total_pages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const filterReports = async (params: FilterReportParams) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ReportApi.filterReports(params);
      setReports(data.reports);
      setPagination({
        page: data.page,
        pageSize: data.page_size,
        totalCount: data.total_count,
        totalPages: data.total_pages
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter reports');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (template: string, userMail: string) => {
    try {
      setLoading(true);
      setError(null);
      const newReport = await ReportApi.createReport({ template: minifyHTML(template), user_mail: userMail });
      await fetchReports({ page: pagination.page, page_size: pagination.pageSize });
      return newReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (id: number, template: string) => {
    try {
      setLoading(true);
      setError(null);
      const updatedReport = await ReportApi.updateReport({ id: id, template: minifyHTML(template) });
      setReports(prev => prev.map(report => 
        report.id === id ? updatedReport : report
      ));
      return updatedReport;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update report';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleReportStatus = async (id: number, active: boolean) => {
    try {
      setLoading(true);
      setError(null);
      await ReportApi.turnOnOffReport({ id, active });
      setReports(prev => prev.map(report => 
        report.id === id ? { ...report, active } : report
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle report status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const changePage = (page: number) => {
    fetchReports({ page, page_size: pagination.pageSize });
  };

  const changePageSize = (pageSize: number) => {
    fetchReports({ page: 1, page_size: pageSize });
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    pagination,
    loading,
    error,
    fetchReports,
    filterReports,
    createReport,
    updateReport,
    toggleReportStatus,
    changePage,
    changePageSize
  };
}