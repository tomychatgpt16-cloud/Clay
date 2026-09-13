import React, { useState } from "react";
import {
  ShoppingBag,
  Plus,
  TrendingUp,
  DollarSign,
  Phone,
  User,
  Calendar,
  Layers,
  Search,
  Trash2,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Printer
} from "lucide-react";
import { Sale, StockItem, Account } from "../types";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface SalesManagementViewProps {
  sales?: Sale[];
  stockItems?: StockItem[];
  accounts?: Account[];
  currency: string;
  onAddSale: (data: {
    customer_name: string;
    customer_phone?: string;
    stock_id?: string;
    stone_type: string;
    unit: string;
    quantity_sold: number;
    selling_price_per_unit: number;
    sale_date: string;
    payment_method: string;
    payment_status?: "paid" | "partial" | "unpaid";
    account_id?: string;
    notes?: string;
  }) => Promise<void>;
  onDeleteSale: (id: string) => Promise<void>;
}

export const SalesManagementView: React.FC<SalesManagementViewProps> = ({
  sales = [],
  stockItems = [],
  accounts = [],
  currency,
  onAddSale,
  onDeleteSale
}) => {
  const safeSales = sales || [];
  const safeStockItems = stockItems || [];
  const safeAccounts = accounts || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Sale | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedStockId, setSelectedStockId] = useState("");
  const [stoneType, setStoneType] = useState("");
  const [unit, setUnit] = useState("sqm");
  const [quantitySold, setQuantitySold] = useState("");
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "partial" | "unpaid">("paid");
  const [accountId, setAccountId] = useState(safeAccounts?.[0]?.id || "");
  const [notes, setNotes] = useState("");

  const formatMoney = (amount: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount) + ` ${currency}`
    );
  };

  const selectedStock = safeStockItems.find((s) => s.id === selectedStockId);

  const handleStockSelect = (stockId: string) => {
    setSelectedStockId(stockId);
    const item = safeStockItems.find((s) => s.id === stockId);
    if (item) {
      setStoneType(item.stone_type);
      setUnit(item.unit);
      // Pre-suggest a markup price
      const suggestedPrice = Math.round(item.cost_per_unit * 1.35 * 100) / 100;
      if (!sellingPricePerUnit || parseFloat(sellingPricePerUnit) === 0) {
        setSellingPricePerUnit(suggestedPrice.toString());
      }
    }
  };

  const openAddModal = () => {
    setCustomerName("");
    setCustomerPhone("");
    const defaultStock = safeStockItems.find((s) => s.available_quantity > 0) || safeStockItems?.[0];
    if (defaultStock) {
      setSelectedStockId(defaultStock.id);
      setStoneType(defaultStock.stone_type);
      setUnit(defaultStock.unit);
      setSellingPricePerUnit(
        (Math.round(defaultStock.cost_per_unit * 1.35 * 100) / 100).toString()
      );
    } else {
      setSelectedStockId("");
      setStoneType("");
      setUnit("sqm");
      setSellingPricePerUnit("");
    }
    setQuantitySold("");
    setSaleDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod("Bank Transfer");
    setPaymentStatus("paid");
    setAccountId(safeAccounts?.[0]?.id || "");
    setNotes("");
    setError(null);
    setIsModalOpen(true);
  };

  // Calculation previews
  const numQty = parseFloat(quantitySold) || 0;
  const numPrice = parseFloat(sellingPricePerUnit) || 0;
  const computedRevenue = numQty * numPrice;
  const unitCost = selectedStock ? selectedStock.cost_per_unit : 0;
  const computedCOGS = numQty * unitCost;
  const computedGrossProfit = computedRevenue - computedCOGS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim()) {
      setError("Customer name is required.");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Customer phone number is required.");
      return;
    }
    if (!stoneType.trim()) {
      setError("Stone type is required.");
      return;
    }
    if (numQty <= 0) {
      setError("Quantity sold must be greater than zero.");
      return;
    }
    if (selectedStock && numQty > selectedStock.available_quantity) {
      setError(
        `Quantity sold (${numQty} ${unit}) exceeds available stock in batch (${selectedStock.available_quantity} ${unit}).`
      );
      return;
    }
    if (numPrice <= 0) {
      setError("Selling price must be greater than zero.");
      return;
    }

    try {
      setLoading(true);
      await onAddSale({
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        stock_id: selectedStockId || undefined,
        stone_type: stoneType.trim(),
        unit,
        quantity_sold: numQty,
        selling_price_per_unit: numPrice,
        sale_date: saleDate,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        account_id: accountId || undefined,
        notes: notes.trim() || undefined
      });
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to record sale");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (sale: Sale) => {
    setDeleteTarget(sale);
  };

  // KPIs
  const totalSalesRevenue = safeSales.reduce((sum, s) => sum + s.total_revenue, 0);
  const totalGrossProfit = safeSales.reduce((sum, s) => sum + (s.gross_profit || 0), 0);
  const totalSoldQuantity = safeSales.reduce((sum, s) => sum + s.quantity_sold, 0);
  const avgOrderValue = safeSales.length > 0 ? totalSalesRevenue / safeSales.length : 0;

  const filteredSales = safeSales.filter((s) => {
    return (
      s.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.customer_phone && s.customer_phone.includes(searchQuery)) ||
      s.stone_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.invoice_no.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            Revenue & Order Fulfillment
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Stone Sales & Customer Invoicing
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Log sales with customer phone numbers, automatically calculate gross revenue,
            and instantly deduct sold stones from active inventory.
          </p>
        </div>

        <button
          id="btn-record-sale"
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          Record New Sale
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Sales Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(totalSalesRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            {sales.length} Invoices Issued
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Gross Profit Generated</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {formatMoney(totalGrossProfit)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {totalSalesRevenue > 0
              ? `${((totalGrossProfit / totalSalesRevenue) * 100).toFixed(1)}% Gross Margin`
              : "0% Margin"}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Quantity Sold</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalSoldQuantity.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">Delivered Stones & Slabs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Average Invoice Value</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(avgOrderValue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Per Completed Order</div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Sales Ledger & Invoices
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {filteredSales.length} orders
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, stone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-700">No sales orders logged yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Record sales transactions with customer phone numbers and sold quantities to
              track stone turnover and gross profit.
            </p>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Record First Sale
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Invoice & Customer</th>
                  <th className="py-3.5 px-4">Sale Date</th>
                  <th className="py-3.5 px-4">Stone Type</th>
                  <th className="py-3.5 px-4 text-right">Quantity Sold</th>
                  <th className="py-3.5 px-4 text-right">Selling Price</th>
                  <th className="py-3.5 px-4 text-right">Total Revenue</th>
                  <th className="py-3.5 px-4 text-right">Gross Profit</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {sale.customer_name.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                            {sale.customer_name}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="font-mono">{sale.invoice_no}</span>
                            {sale.customer_phone && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-slate-500">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  {sale.customer_phone}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {sale.sale_date}
                      </div>
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-800">
                      {sale.stone_type}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-slate-900">
                      {sale.quantity_sold.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        {sale.unit}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap text-slate-700">
                      {formatMoney(sale.selling_price_per_unit)}
                      <div className="text-[10px] text-slate-400">/{sale.unit}</div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-emerald-700">
                      {formatMoney(sale.total_revenue)}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="font-semibold text-slate-900">
                        {formatMoney(sale.gross_profit || 0)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        COGS: {formatMoney(sale.total_cogs || 0)}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          sale.payment_status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : sale.payment_status === "partial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                            : "bg-rose-50 text-rose-700 border border-rose-200/50"
                        }`}
                      >
                        {sale.payment_status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(sale)}
                          title="View Invoice Receipt"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale)}
                          title="Reverse Sale & Restore Stock"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Record Stone Sale & Dispatch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Captures customer contact, price, and deducts inventory.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              {/* Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Girma Construction"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+251 91 234 5678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Stock Batch Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Stock Batch to Deduct From
                </label>
                <select
                  value={selectedStockId}
                  onChange={(e) => handleStockSelect(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="">Manual Stone Entry (No Stock Link)</option>
                  {safeStockItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.stone_type} ({item.batch_no || "Batch"}) — Available:{" "}
                      {item.available_quantity} {item.unit} (Cost: {formatMoney(item.cost_per_unit)}
                      /{item.unit})
                    </option>
                  ))}
                </select>
                {selectedStock && (
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    Available in selected batch: {selectedStock.available_quantity}{" "}
                    {selectedStock.unit} | Direct cost: {formatMoney(selectedStock.cost_per_unit)}
                    /{selectedStock.unit}
                  </p>
                )}
              </div>

              {/* Stone Type & Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stone Variety *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Absolute Black Granite"
                    value={stoneType}
                    onChange={(e) => setStoneType(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="sqm">m²</option>
                    <option value="ton">Ton</option>
                    <option value="linear_meter">Linear M</option>
                    <option value="piece">Piece</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Sold ({unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={quantitySold}
                    onChange={(e) => setQuantitySold(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price / {unit} ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={sellingPricePerUnit}
                    onChange={(e) => setSellingPricePerUnit(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                  />
                </div>
              </div>

              {/* Live Revenue & Profit Pill */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Total Sale Revenue
                  </div>
                  <div className="text-xl font-bold text-emerald-900">
                    {formatMoney(computedRevenue)}
                  </div>
                </div>
                {selectedStock && (
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Est. Gross Profit
                    </div>
                    <div className="text-sm font-bold text-emerald-700">
                      {formatMoney(computedGrossProfit)}
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Payment Details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sale Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Credit / Receivable">On Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e: any) => setPaymentStatus(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deposit to Company Account
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="">None (Accrued Only)</option>
                  {safeAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.current_balance} {acc.currency})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes / Site Delivery Address
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Delivered to Bole Michael Residential Project Site"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing Sale..." : "Log Sale & Deduct Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Receipt Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="text-xs uppercase font-bold text-slate-400">
                  Sale Receipt
                </div>
                <div className="font-bold text-slate-900 font-mono">
                  {selectedInvoice.invoice_no}
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="font-bold text-slate-900">
                    Clay’s Granite & Marble Manufacturing
                  </div>
                  <div className="text-xs text-slate-500">
                    Stone Fabrication & Sales Division
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedInvoice.payment_status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Customer</div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedInvoice.customer_name}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {selectedInvoice.customer_phone || "No phone"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold uppercase">Date & Method</div>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {selectedInvoice.sale_date}
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    {selectedInvoice.payment_method}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-700">
                  <span>{selectedInvoice.stone_type}</span>
                  <span>
                    {selectedInvoice.quantity_sold} {selectedInvoice.unit} @{" "}
                    {formatMoney(selectedInvoice.selling_price_per_unit)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between font-bold text-sm text-slate-900">
                  <span>Total Revenue:</span>
                  <span className="text-emerald-700">
                    {formatMoney(selectedInvoice.total_revenue)}
                  </span>
                </div>
              </div>

              {selectedInvoice.notes && (
                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-700">Notes:</span>{" "}
                  {selectedInvoice.notes}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Reverse Sale Invoice"
        itemName={deleteTarget ? `${deleteTarget.invoice_no} (${deleteTarget.customer_name})` : undefined}
        description={
          deleteTarget
            ? `Are you sure you want to reverse sale invoice ${deleteTarget.invoice_no} for "${deleteTarget.customer_name}"? The sold inventory of ${deleteTarget.quantity_sold} ${deleteTarget.unit} ${deleteTarget.stone_type} will be restored to warehouse stock and associated revenue transactions removed.`
            : undefined
        }
        confirmButtonText="Reverse Sale"
        onConfirm={async () => {
          if (deleteTarget) {
            await onDeleteSale(deleteTarget.id);
          }
        }}
      />
    </div>
  );
};
