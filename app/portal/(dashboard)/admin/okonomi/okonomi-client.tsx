"use client";

import { TrendingUp, TrendingDown, CreditCard, Users, Wallet } from "lucide-react";
import {
  MCTopbar,
  MCCard,
  MCCardHeader,
  MCCardTitle,
  MCCardBody,
  MCTable,
  MCTableHeader,
  MCTableBody,
  MCTableRow,
  MCTableHead,
  MCTableCell,
  MCBadge,
  useMCSidebar,
} from "@/components/portal/mission-control";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
}

interface FinanceData {
  mtdRevenue: number;
  mtdTransactions: number;
  lastMonthRevenue: number;
  activeSubscriptions: number;
  recentTransactions: Transaction[];
  revenueByService: { type: string; amount: number }[];
}

interface OkonomiClientProps {
  data: FinanceData;
}

export function OkonomiClient({ data }: OkonomiClientProps) {
  const { toggle } = useMCSidebar();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const revenueChange = data.lastMonthRevenue > 0
    ? ((data.mtdRevenue - data.lastMonthRevenue) / data.lastMonthRevenue) * 100
    : 0;

  const isPositiveChange = revenueChange >= 0;

  return (
    <>
      <MCTopbar
        title="Okonomi"
        subtitle="Finansiell oversikt"
        onMenuClick={toggle}
        notificationCount={0}
      />

      <div className="p-5 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MCCard>
            <MCCardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                    Omsetning MTD
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                    {formatCurrency(data.mtdRevenue)}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {isPositiveChange ? (
                      <TrendingUp className="w-3 h-3 text-[#34C759]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-[#FF3B30]" />
                    )}
                    <span
                      className={`text-[10px] ${
                        isPositiveChange ? "text-[#34C759]" : "text-[#FF3B30]"
                      }`}
                    >
                      {Math.abs(revenueChange).toFixed(1)}% vs forrige mnd
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-[#34C759]" />
                </div>
              </div>
            </MCCardBody>
          </MCCard>

          <MCCard>
            <MCCardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                    Transaksjoner
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                    {data.mtdTransactions}
                  </div>
                  <div className="text-[10px] text-[#86868B] mt-1">Denne maneden</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#007AFF]" />
                </div>
              </div>
            </MCCardBody>
          </MCCard>

          <MCCard>
            <MCCardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                    Aktive abonnementer
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                    {data.activeSubscriptions}
                  </div>
                  <div className="text-[10px] text-[#86868B] mt-1">
                    Coaching-pakker
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#8B5CF6]" />
                </div>
              </div>
            </MCCardBody>
          </MCCard>

          <MCCard>
            <MCCardBody>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[9px] font-medium text-[#86868B] uppercase tracking-[0.5px]">
                    Gj.snitt per transaksjon
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mt-1">
                    {data.mtdTransactions > 0
                      ? formatCurrency(data.mtdRevenue / data.mtdTransactions)
                      : formatCurrency(0)}
                  </div>
                  <div className="text-[10px] text-[#86868B] mt-1">MTD</div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
                </div>
              </div>
            </MCCardBody>
          </MCCard>
        </div>

        {/* Revenue by Service Type */}
        <MCCard>
          <MCCardHeader>
            <MCCardTitle>Omsetning per tjeneste</MCCardTitle>
          </MCCardHeader>
          <MCCardBody>
            <div className="space-y-3">
              {data.revenueByService.length > 0 ? (
                data.revenueByService.map((service) => {
                  const percentage =
                    data.mtdRevenue > 0
                      ? (service.amount / data.mtdRevenue) * 100
                      : 0;
                  return (
                    <div key={service.type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-medium text-[#1D1D1F]">
                          {service.type}
                        </span>
                        <span className="text-[11px] text-[#6E6E73]">
                          {formatCurrency(service.amount)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-[#E8E8ED] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1D1D1F] rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-[10px] text-[#86868B] text-center py-4">
                  Ingen transaksjoner denne maneden
                </div>
              )}
            </div>
          </MCCardBody>
        </MCCard>

        {/* Recent Transactions */}
        <MCCard>
          <MCCardHeader>
            <MCCardTitle>Siste transaksjoner</MCCardTitle>
          </MCCardHeader>
          <MCCardBody className="p-0">
            <MCTable>
              <MCTableHeader>
                <MCTableRow>
                  <MCTableHead>Kunde</MCTableHead>
                  <MCTableHead>Tjeneste</MCTableHead>
                  <MCTableHead>Belop</MCTableHead>
                  <MCTableHead>Status</MCTableHead>
                  <MCTableHead>Dato</MCTableHead>
                </MCTableRow>
              </MCTableHeader>
              <MCTableBody>
                {data.recentTransactions.length > 0 ? (
                  data.recentTransactions.map((tx) => (
                    <MCTableRow key={tx.id}>
                      <MCTableCell>
                        <div>
                          <div className="font-medium">{tx.customerName}</div>
                          <div className="text-[9px] text-[#86868B]">
                            {tx.customerEmail}
                          </div>
                        </div>
                      </MCTableCell>
                      <MCTableCell>{tx.serviceName}</MCTableCell>
                      <MCTableCell className="font-medium">
                        {formatCurrency(tx.amount)}
                      </MCTableCell>
                      <MCTableCell>
                        <MCBadge
                          variant={
                            tx.status === "COMPLETED"
                              ? "success"
                              : tx.status === "PENDING"
                              ? "warning"
                              : "error"
                          }
                        >
                          {tx.status === "COMPLETED"
                            ? "Fullfort"
                            : tx.status === "PENDING"
                            ? "Venter"
                            : tx.status}
                        </MCBadge>
                      </MCTableCell>
                      <MCTableCell className="text-[#86868B]">
                        {formatDate(tx.createdAt)}
                      </MCTableCell>
                    </MCTableRow>
                  ))
                ) : (
                  <MCTableRow>
                    <MCTableCell colSpan={5} className="text-center py-8 text-[#86868B]">
                      Ingen transaksjoner funnet
                    </MCTableCell>
                  </MCTableRow>
                )}
              </MCTableBody>
            </MCTable>
          </MCCardBody>
        </MCCard>
      </div>
    </>
  );
}
