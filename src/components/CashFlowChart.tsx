import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { TrendingUp, Calendar, Info } from "lucide-react";
import { Transaction, EnvironmentType } from "../types";

interface CashFlowChartProps {
  transactions: Transaction[];
  currency?: string;
  scope?: "personal" | "company" | "overview";
}

type Timeframe = "7d" | "30d" | "90d" | "1y";

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  transactions = [],
  currency = "ETB",
  scope = "overview",
}) => {
  const safeTransactions = transactions || [];
  const [timeframe, setTimeframe] = useState<Timeframe>("30d");

  // Generate chart data based on timeframe & scope
  const chartData = useMemo(() => {
    const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
    const now = new Date();
    const result: Array<{
      date: string;
      label: string;
      income: number;
      expense: number;
      net: number;
    }> = [];

    // Filter by scope
    const scopedTxs = safeTransactions.filter((t) => {
      if (scope === "personal") return t.environment === "personal";
      if (scope === "company") return t.environment === "company";
      return true;
    });

    if (timeframe === "1y") {
      // Monthly buckets
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = d.toLocaleDateString(undefined, { month: "short" });

        let inc = 0;
        let exp = 0;
        scopedTxs.forEach((t) => {
          if (t.date.startsWith(yMonth)) {
            if (t.type === "income" || t.type === "deposit") inc += t.amount;
            if (t.type === "expense" || t.type === "withdrawal") exp += t.amount;
          }
        });

        result.push({
          date: yMonth,
          label,
          income: inc,
          expense: exp,
          net: inc - exp,
        });
      }
    } else {
      // Daily or interval buckets
      const intervalDays = timeframe === "90d" ? 5 : 1;
      const bucketCount = Math.floor(days / intervalDays);

      for (let i = bucketCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i * intervalDays);
        const dateStr = d.toISOString().split("T")[0];
        const label = intervalDays === 1
          ? d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;

        let inc = 0;
        let exp = 0;

        scopedTxs.forEach((t) => {
          // If intervalDays > 1, check window
          if (intervalDays === 1) {
            if (t.date === dateStr) {
              if (t.type === "income" || t.type === "deposit") inc += t.amount;
              if (t.type === "expense" || t.type === "withdrawal") exp += t.amount;
            }
          } else {
            const txTime = new Date(t.date).getTime();
            const startWindow = d.getTime() - intervalDays * 86400000;
            if (txTime > startWindow && txTime <= d.getTime()) {
              if (t.type === "income" || t.type === "deposit") inc += t.amount;
              if (t.type === "expense" || t.type === "withdrawal") exp += t.amount;
            }
          }
        });

        result.push({
          date: dateStr,
          label,
          income: inc,
          expense: exp,
          net: inc - exp,
        });
      }
    }

    return result;
  }, [transactions, timeframe, scope]);

  const hasActivity = useMemo(() => {
    return chartData.some((d) => d.income > 0 || d.expense > 0);
  }, [chartData]);

  const totals = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    chartData.forEach((d) => {
      totalIncome += d.income;
      totalExpense += d.expense;
    });
    return {
      income: totalIncome,
      expense: totalExpense,
      net: totalIncome - totalExpense,
    };
  }, [chartData]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Cash Flow Activity</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
              {scope.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operating income, expenses, and net cash flow trajectory
          </p>
        </div>

        {/* Timeframe selector (7 Days, 30 Days, 90 Days, 1 Year) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setTimeframe("7d")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              timeframe === "7d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeframe("30d")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              timeframe === "30d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe("90d")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              timeframe === "90d" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeframe("1y")}
            className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
              timeframe === "1y" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            1 Year
          </button>
        </div>
      </div>

      {/* Mini Stat Summary for Selected Timeframe */}
      <div className="grid grid-cols-3 gap-3 mb-5 text-xs">
        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
          <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Total Income</span>
          <span className="text-base font-bold text-emerald-700 mt-0.5 block">
            +{totals.income.toLocaleString()} {currency}
          </span>
        </div>
        <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl">
          <span className="text-[10px] text-rose-800 uppercase font-semibold block">Total Expenses</span>
          <span className="text-base font-bold text-rose-700 mt-0.5 block">
            -{totals.expense.toLocaleString()} {currency}
          </span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
          <span className="text-[10px] text-slate-600 uppercase font-semibold block">Net Cash Flow</span>
          <span className={`text-base font-bold mt-0.5 block ${
            totals.net >= 0 ? "text-slate-900" : "text-rose-600"
          }`}>
            {totals.net >= 0 ? "+" : ""}{totals.net.toLocaleString()} {currency}
          </span>
        </div>
      </div>

      {/* Chart Canvas or Zero-State */}
      {!hasActivity ? (
        <div className="h-64 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mb-2.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-semibold text-slate-700">No cash flow activity recorded yet</h4>
          <p className="text-[11px] text-slate-400 max-w-sm mt-1">
            Data will automatically appear here once you record your first income, expense, deposit, or withdrawal.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#e2e8f0" }}
                tickLine={false}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val)}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-slate-300 border-b border-slate-800 pb-1">{label}</p>
                        <p className="text-emerald-400">Income: +{Number(payload[0]?.value || 0).toLocaleString()} {currency}</p>
                        <p className="text-rose-400">Expense: -{Number(payload[1]?.value || 0).toLocaleString()} {currency}</p>
                        <p className="text-slate-200 font-bold pt-1 border-t border-slate-800">
                          Net: {(Number(payload[0]?.value || 0) - Number(payload[1]?.value || 0)).toLocaleString()} {currency}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: 11, paddingBottom: 8 }}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
