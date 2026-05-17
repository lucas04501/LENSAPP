'use client';

import { useState } from "react";
import { Download, FileText, Table, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ExportData() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setLoading(format);
    try {
      const response = await fetch(`/api/export?format=${format}`);
      if (!response.ok) throw new Error("Falha na exportação");

      if (format === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lens-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // For PDF (HTML), open in new tab for printing
        const html = await response.text();
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(html);
          win.document.close();
        }
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Erro ao exportar dados. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="glass rounded-[2rem] border border-white/5 p-6 sm:p-8 bg-[#050505]">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center">
          <Download className="w-6 h-6 text-purple" />
        </div>
        <div>
          <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Exportar seus dados</h3>
          <p className="text-sm text-text-muted mt-1">Baixe seu histórico completo para backup ou análise externa.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport('csv')}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-2 border border-white/5 hover:border-purple/30 transition-all group"
        >
          {loading === 'csv' ? (
            <Loader2 className="w-5 h-5 text-purple animate-spin" />
          ) : (
            <Table className="w-5 h-5 text-text-muted group-hover:text-purple transition-colors" />
          )}
          <div className="text-left">
            <span className="block text-sm font-bold text-white uppercase tracking-widest">Exportar CSV</span>
            <span className="block text-[10px] text-text-muted uppercase">Planilhas (Excel, Sheets)</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleExport('pdf')}
          disabled={!!loading}
          className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-2 border border-white/5 hover:border-red/30 transition-all group"
        >
          {loading === 'pdf' ? (
            <Loader2 className="w-5 h-5 text-red animate-spin" />
          ) : (
            <FileText className="w-5 h-5 text-text-muted group-hover:text-red transition-colors" />
          )}
          <div className="text-left">
            <span className="block text-sm font-bold text-white uppercase tracking-widest">Exportar PDF</span>
            <span className="block text-[10px] text-text-muted uppercase">Relatório para Impressão</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
