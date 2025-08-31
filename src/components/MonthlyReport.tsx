import { Transaction } from '@/types/transaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Calendar, Search } from 'lucide-react';

interface MonthlyReportProps {
  transactions: Transaction[];
}

export const MonthlyReport = ({ transactions }: MonthlyReportProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // --- Ambil daftar bulan dari transaksi ---
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(transaction => {
      const monthKey = new Date(transaction.date).toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
      months.add(monthKey);
    });
    return Array.from(months).sort((a, b) => {
      const dateA = new Date(a + ' 01');
      const dateB = new Date(b + ' 01');
      return dateB.getTime() - dateA.getTime();
    });
  }, [transactions]);

  // --- Set default bulan ke bulan terbaru ---
  useMemo(() => {
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  // --- Filter transaksi sesuai bulan, tipe, dan pencarian ---
  const monthlyTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.date).toLocaleDateString('id-ID', { 
        month: 'long', 
        year: 'numeric' 
      });
      return transactionMonth === selectedMonth;
    });

    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, selectedMonth, filterType, searchTerm]);

  // --- Format ke Rupiah ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (availableMonths.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-elevated">
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Belum ada data transaksi untuk laporan bulanan
          </p>
        </CardContent>
      </Card>
    );
  }

};
