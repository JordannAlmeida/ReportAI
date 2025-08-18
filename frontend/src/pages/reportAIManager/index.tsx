import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Dropdown } from '../../components/ui/Dropdown';
import { Pagination } from '../../components/ui/Pagination';
import { useReports } from '../../hooks/useReports';
import type { Report } from '../../types/reportAI';

interface ReportFormData {
  template: string;
  user_mail: string;
}

interface ReportFormData {
  template: string;
  user_mail: string;
}

export default function ReportAIManager() {
  const { t } = useTranslation();
  const {
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
  } = useReports();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<ReportFormData>({ template: '', user_mail: '' });
  const [filterForm, setFilterForm] = useState({ id: '', user_mail: '' });
  const [isFiltering, setIsFiltering] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsPageVisible(true), 100);
  }, []);

  const handleFilter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (filterForm.id.trim()) {
      setIsFiltering(true);
      await filterReports({
        id: parseInt(filterForm.id),
        user_mail: filterForm.user_mail.trim() || undefined,
        page: 1,
        page_size: pagination.pageSize
      });
    } else {
      setIsFiltering(false);
      await fetchReports({ page: 1, page_size: pagination.pageSize });
    }
  };

  const handleClearFilter = () => {
    setFilterForm({ id: '', user_mail: '' });
    setIsFiltering(false);
    fetchReports({ page: 1, page_size: pagination.pageSize });
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createReport(formData.template, formData.user_mail);
      setIsCreateModalOpen(false);
      setFormData({ template: '', user_mail: '' });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleEditReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReport) return;

    try {
      await updateReport(editingReport.id, formData.template);
      setIsEditModalOpen(false);
      setEditingReport(null);
      setFormData({ template: '', user_mail: '' });
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const openEditModal = (report: Report) => {
    setEditingReport(report);
    setFormData({ template: report.template, user_mail: report.user_mail });
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = async (report: Report) => {
    await toggleReportStatus(report.id, !report.active);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div
          className="mb-8 opacity-0"
          style={{
            animation: isPageVisible ? 'slideInDown 0.6s ease-out forwards' : 'none'
          }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('reports.manager.title')}</h1>
          <p className="text-gray-600">{t('reports.manager.subtitle')}</p>
        </div>

        {/* Filters and Actions */}
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 opacity-0 transform transition-all duration-500 hover:shadow-lg"
          style={{
            animation: isPageVisible ? 'slideInUp 0.6s ease-out 0.2s forwards' : 'none'
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            {/* Filter Form */}
            <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1 transform hover:scale-105 transition-all duration-200">
                <Input
                  label={t('reports.manager.filters.reportId')}
                  type="number"
                  placeholder={t('reports.manager.filters.reportIdPlaceholder')}
                  value={filterForm.id}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, id: e.target.value }))}
                />
              </div>
              <div className="flex-1 transform hover:scale-105 transition-all duration-200">
                <Input
                  label={t('reports.manager.filters.userEmail')}
                  type="email"
                  placeholder={t('reports.manager.filters.userEmailPlaceholder')}
                  value={filterForm.user_mail}
                  onChange={(e) => setFilterForm(prev => ({ ...prev, user_mail: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  variant="outline"
                  isLoading={loading}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('reports.manager.filters.searchButton')}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClearFilter}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  {t('reports.manager.filters.clearButton')}
                </Button>
              </div>
            </form>

            {/* Create Button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="whitespace-nowrap transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('reports.manager.create.title')}
            </Button>
          </div>

          {/* Filter Status */}
          {isFiltering && (
            <div
              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md opacity-0"
              style={{ animation: 'slideInLeft 0.5s ease-out forwards' }}
            >
              <div className="flex items-center justify-between">
                <span className="text-blue-800 text-sm">
                  {t('reports.manager.filters.filteringBy')}
                  {filterForm.id && `${t('reports.manager.filters.id')} ${filterForm.id}`}
                  {filterForm.id && filterForm.user_mail && ', '}
                  {filterForm.user_mail && `${t('reports.manager.filters.email')} ${filterForm.user_mail}`}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilter}
                  className="transform hover:scale-110 transition-all duration-200"
                >
                  {t('reports.manager.filters.clearFilters')}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 opacity-0"
            style={{ animation: 'slideInLeft 0.5s ease-out forwards, shake 0.5s ease-in-out 0.5s' }}
          >
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Reports Table */}
        <div
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden opacity-0 transform transition-all duration-500 hover:shadow-lg"
          style={{
            animation: isPageVisible ? 'slideInUp 0.6s ease-out 0.4s forwards' : 'none'
          }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t('reports.manager.title')}</h2>
          </div>

          {loading && reports.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
              <span className="ml-3 text-gray-600 animate-pulse">{t('reports.manager.table.loading')}</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center animate-fadeIn">
                <svg className="mx-auto h-12 w-12 text-gray-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('reports.manager.noReports')}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isFiltering ? t('reports.manager.noReportsFilter') : ''} {t('reports.manager.noReportsDesc')}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.id')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.template')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.userEmail')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.status')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.created')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.updated')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('reports.manager.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reports.map((report, index) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transform hover:scale-[1.01] transition-all duration-200 opacity-0 animate-fadeInUp"
                        style={{
                          animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="animate-pulse hover:animate-none">#{report.id}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate hover:max-w-none hover:whitespace-normal transition-all duration-300" title={report.template}>
                            {report.template}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.user_mail}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transform hover:scale-110 transition-all duration-200 ${report.active
                            ? 'bg-green-100 text-green-800 animate-pulse'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {report.active ? t('reports.manager.status.active') : t('reports.manager.status.inactive')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(report.create_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(report.update_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Dropdown
                            trigger={
                              <Button
                                variant="secondary"
                                size="sm"
                                className="transform hover:scale-110 hover:rotate-90 transition-all duration-200"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </Button>
                            }
                            items={[
                              {
                                label: t('reports.manager.actions.edit'),
                                onClick: () => openEditModal(report)
                              },
                              {
                                label: report.active ? t('reports.manager.actions.deactivate') : t('reports.manager.actions.activate'),
                                onClick: () => handleToggleStatus(report),
                                variant: report.active ? 'danger' : 'default'
                              }
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div
                className="opacity-0"
                style={{ animation: 'fadeInUp 0.5s ease-out 0.6s forwards' }}
              >
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                  onPageChange={changePage}
                  onPageSizeChange={changePageSize}
                />
              </div>
            </div>
          )}
        </div>

        {/* Create Report Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setFormData({ template: '', user_mail: '' });
          }}
          title={t('reports.manager.create.title')}
        >
          <div
            className="opacity-0"
            style={{ animation: isCreateModalOpen ? 'slideInUp 0.3s ease-out forwards' : 'none' }}
          >
            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="transform hover:scale-105 transition-all duration-200">
                <Textarea
                  label={t('reports.manager.create.template')}
                  placeholder={t('reports.manager.create.templatePlaceholder')}
                  value={formData.template}
                  onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  rows={10}
                  className="font-mono text-sm"
                  required
                />
              </div>
              <div className="transform hover:scale-105 transition-all duration-200">
                <Input
                  label={t('reports.manager.create.userEmail')}
                  type="email"
                  placeholder={t('reports.manager.create.userEmailPlaceholder')}
                  value={formData.user_mail}
                  onChange={(e) => setFormData(prev => ({ ...prev, user_mail: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setFormData({ template: '', user_mail: '' });
                  }}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  {t('reports.manager.create.cancel')}
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('reports.manager.create.creating')}
                    </>
                  ) : (
                    t('reports.manager.create.submit')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

        {/* Edit Report Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingReport(null);
            setFormData({ template: '', user_mail: '' });
          }}
          title={t('reports.manager.edit.title')}
        >
          <div
            className="opacity-0"
            style={{ animation: isEditModalOpen ? 'slideInUp 0.3s ease-out forwards' : 'none' }}
          >
            <form onSubmit={handleEditReport} className="space-y-4">
              <div className="transform hover:scale-105 transition-all duration-200">
                <Textarea
                  label={t('reports.manager.edit.template')}
                  placeholder={t('reports.manager.edit.templatePlaceholder')}
                  value={formData.template}
                  onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                  rows={10}
                  className="font-mono text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingReport(null);
                    setFormData({ template: '', user_mail: '' });
                  }}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  {t('reports.manager.edit.cancel')}
                </Button>
                <Button
                  type="submit"
                  isLoading={loading}
                  className="transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('reports.manager.edit.updating')}
                    </>
                  ) : (
                    t('reports.manager.edit.submit')
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>

      {/* Custom Keyframe Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(5px);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out forwards;
          }
        `
      }} />
    </div>
  );
}