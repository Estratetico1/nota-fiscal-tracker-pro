
import React from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FinancialSummary } from "@/components/financial/FinancialSummary";
import { FinancialFilters } from "@/components/financial/FinancialFilters";
import { FinancialInvoiceTable } from "@/components/financial/FinancialInvoiceTable";
import { useFinancialData } from "@/hooks/useFinancialData";

const Financial = () => {
  const navigate = useNavigate();
  const { 
    isLoading, 
    filteredInvoices, 
    summaryMetrics,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    filterDueDate,
    setFilterDueDate,
    handleSendPaymentReminder,
    handleSendAllReminders,
    handleApplyFilters
  } = useFinancialData();

  const handleGoToConfig = () => {
    navigate("/settings");
  };

  const handleGoToRouting = () => {
    navigate("/invoice-routing");
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleGoToConfig}>
              Configurações
            </Button>
            <Button variant="outline" onClick={handleGoToRouting}>
              Roteirização
            </Button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <FinancialSummary
          totalPending={summaryMetrics.totalPending}
          pendingCount={summaryMetrics.pendingCount}
          totalPaid={summaryMetrics.totalPaid}
          paidCount={summaryMetrics.paidCount}
          totalOverdue={summaryMetrics.totalOverdue}
          overdueCount={summaryMetrics.overdueCount}
          onSendAllReminders={handleSendAllReminders}
        />
        
        {/* Filters and Search */}
        <FinancialFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dueDate={filterDueDate}
          onDueDateChange={setFilterDueDate}
          onApplyFilters={handleApplyFilters}
        />
        
        {/* Invoices Table */}
        {isLoading ? (
          <div className="py-10 text-center">Carregando faturas...</div>
        ) : (
          <FinancialInvoiceTable
            invoices={filteredInvoices}
            onSendPaymentReminder={handleSendPaymentReminder}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Financial;
