import React, { useState } from "react";
import {
  Layers,
  Plus,
  AlertTriangle,
  Scissors,
  Truck,
  TrendingDown,
  Search,
  Filter,
  Trash2,
  Calendar,
  CheckCircle2,
  X,
  Package,
  ArrowDownRight,
  Info,
  DollarSign
} from "lucide-react";
import { StockItem, StockWasteLog, Account } from "../types";
import { ConfirmDeleteModal } from "./modals/ConfirmDeleteModal";

interface StockManagementViewProps {
  stockItems?: StockItem[];
  wasteLogs?: StockWasteLog[];
  accounts?: Account[];
  currency: string;
  onAddStockItem: (data: {
    stone_type: string;
    batch_no?: string;
    unit: string;
    initial_quantity: number;
    purchase_cost: number;
    transport_cost?: number;
    cutting_cost?: number;
    handling_cost?: number;
    other_expenses?: number;
    purchase_date: string;
    supplier_name?: string;
    supplier_phone?: string;
    account_id?: string;
    location?: string;
    notes?: string;
  }) => Promise<void>;
  onLogWaste: (
    stockId: string,
    data: {
      quantity: number;
      reason: string;
      date?: string;
      notes?: string;
    }
  ) => Promise<void>;
  onDeleteStockItem: (id: string) => Promise<void>;
}

export const StockManagementView: React.FC<StockManagementViewProps> = ({
  stockItems = [],
  wasteLogs = [],
  accounts = [],
  currency,
  onAddStockItem,
  onLogWaste,
  onDeleteStockItem
}) => {
  const safeStockItems = stockItems || [];
  const safeWasteLogs = wasteLogs || [];
  const safeAccounts = accounts || [];

  const [activeTab, setActiveTab] = useState<"inventory" | "waste">("inventory");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [selectedStockForWaste, setSelectedStockForWaste] = useState<StockItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StockItem | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stock Form State
  const [stoneType, setStoneType] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [unit, setUnit] = useState<"ton" | "sqm" | "linear_meter" | "piece">("ton");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [transportCost, setTransportCost] = useState("");
  const [cuttingCost, setCuttingCost] = useState("");
  const [handlingCost, setHandlingCost] = useState("");
  const [otherExpenses, setOtherExpenses] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [supplierName, setSupplierName] = useState("");
  const [supplierPhone, setSupplierPhone] = useState("");
  const [accountId, setAccountId] = useState(accounts?.[0]?.id || "");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // Waste Form State
  const [wasteQty, setWasteQty] = useState("");
  const [wasteReason, setWasteReason] = useState("Cutting Fracture / Blade Breakage");
  const [wasteDate, setWasteDate] = useState(new Date().toISOString().split("T")[0]);
  const [wasteNotes, setWasteNotes] = useState("");

  const formatMoney = (amount: number) => {
    return (
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount) + ` ${currency}`
    );
  };

  // Automated breakdown calculation for Add Form
  const numQty = parseFloat(initialQuantity) || 0;
  const numPurchase = parseFloat(purchaseCost) || 0;
  const numTransport = parseFloat(transportCost) || 0;
  const numCutting = parseFloat(cuttingCost) || 0;
  const numHandling = parseFloat(handlingCost) || 0;
  const numOther = parseFloat(otherExpenses) || 0;
  const calculatedTotalCost =
    numPurchase + numTransport + numCutting + numHandling + numOther;
  const calculatedUnitCost =
    numQty > 0 ? calculatedTotalCost / numQty : 0;

  const openAddModal = () => {
    setStoneType("");
    setBatchNo(`BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
    setUnit("ton");
    setInitialQuantity("");
    setPurchaseCost("");
    setTransportCost("");
    setCuttingCost("");
    setHandlingCost("");
    setOtherExpenses("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setSupplierName("");
    setSupplierPhone("");
    setAccountId(accounts?.[0]?.id || "");
    setLocation("Factory Yard A");
    setNotes("");
    setError(null);
    setIsAddModalOpen(true);
  };

  const openWasteModal = (item: StockItem) => {
    setSelectedStockForWaste(item);
    setWasteQty("");
    setWasteReason("Cutting Fracture / Blade Breakage");
    setWasteDate(new Date().toISOString().split("T")[0]);
    setWasteNotes("");
    setError(null);
    setIsWasteModalOpen(true);
  };

  const handleAddStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stoneType.trim()) {
      setError("Stone type is required.");
      return;
    }
    if (numQty <= 0) {
      setError("Please enter an initial quantity greater than zero.");
      return;
    }
    if (calculatedTotalCost <= 0) {
      setError("Total stone cost must be greater than zero.");
      return;
    }

    try {
      setLoading(true);
      await onAddStockItem({
        stone_type: stoneType.trim(),
        batch_no: batchNo.trim() || undefined,
        unit,
        initial_quantity: numQty,
        purchase_cost: numPurchase,
        transport_cost: numTransport,
        cutting_cost: numCutting,
        handling_cost: numHandling,
        other_expenses: numOther,
        purchase_date: purchaseDate,
        supplier_name: supplierName.trim() || undefined,
        supplier_phone: supplierPhone.trim() || undefined,
        account_id: accountId || undefined,
        location: location.trim() || undefined,
        notes: notes.trim() || undefined
      });
      setIsAddModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to register stock batch");
    } finally {
      setLoading(false);
    }
  };

  const handleWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedStockForWaste) return;
    const qty = parseFloat(wasteQty);
    if (isNaN(qty) || qty <= 0) {
      setError("Please specify a valid waste quantity greater than 0.");
      return;
    }
    if (qty > selectedStockForWaste.available_quantity) {
      setError(
        `Waste quantity cannot exceed current available stock (${selectedStockForWaste.available_quantity} ${selectedStockForWaste.unit}).`
      );
      return;
    }

    try {
      setLoading(true);
      await onLogWaste(selectedStockForWaste.id, {
        quantity: qty,
        reason: wasteReason,
        date: wasteDate,
        notes: wasteNotes.trim() || undefined
      });
      setIsWasteModalOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to log waste quantity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (item: StockItem) => {
    setDeleteTarget(item);
  };

  // KPIs
  const totalSellableValuation = safeStockItems.reduce(
    (sum, item) => sum + (item.current_valuation || 0),
    0
  );
  const totalWasteLoss = safeStockItems.reduce(
    (sum, item) => sum + (item.waste_valuation || 0),
    0
  );
  const totalTonsAvailable = safeStockItems
    .filter((s) => s.unit === "ton")
    .reduce((sum, s) => sum + s.available_quantity, 0);
  const totalSqmAvailable = safeStockItems
    .filter((s) => s.unit === "sqm")
    .reduce((sum, s) => sum + s.available_quantity, 0);

  const filteredItems = safeStockItems.filter((item) => {
    const matchesSearch =
      item.stone_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.batch_no && item.batch_no.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.supplier_name && item.supplier_name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesUnit = unitFilter === "all" || item.unit === unitFilter;
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            Raw Materials & Finished Slabs
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
            Stone Stock & Inventory Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Log stone varieties, track per-unit costs with transportation and cutting
            breakdowns, and isolate production waste.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-new-stock"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-xs transition-colors text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            New Stock Intake
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available Inventory Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatMoney(totalSellableValuation)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
            Pure Sellable Stock (Zero Waste)
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available Tonnage</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalTonsAvailable.toLocaleString()} <span className="text-sm font-normal text-slate-500">Tons</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Raw Quarry Blocks & Boulders</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Available Slabs / Tiles</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalSqmAvailable.toLocaleString()} <span className="text-sm font-normal text-slate-500">m²</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Cut, Polished & Dimensioned</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Production Waste Loss</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-700">
            {formatMoney(totalWasteLoss)}
          </div>
          <div className="text-xs text-rose-600/90 mt-1 font-medium">
            Excluded from Active Inventory
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("inventory")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
            activeTab === "inventory"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Stock Inventory ({stockItems.length})
        </button>
        <button
          onClick={() => setActiveTab("waste")}
          className={`pb-3 px-4 text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
            activeTab === "waste"
              ? "text-rose-600 border-b-2 border-rose-600"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Waste & Scrap Records ({wasteLogs.length})
        </button>
      </div>

      {activeTab === "inventory" ? (
        /* Inventory Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Stone Batches Ledger
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {filteredItems.length} listed
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white text-slate-700"
              >
                <option value="all">All Units</option>
                <option value="ton">Tons</option>
                <option value="sqm">Square Meters (m²)</option>
                <option value="linear_meter">Linear Meters</option>
                <option value="piece">Pieces</option>
              </select>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search stone variety, batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Package className="w-12 h-12 mx-auto text-slate-300 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-700">No stone stock items found</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Record your first batch of marble or granite with purchase, transportation,
                and cutting expenses.
              </p>
              <button
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add First Stock Batch
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Stone Variety / Batch</th>
                    <th className="py-3.5 px-4">Intake Date</th>
                    <th className="py-3.5 px-4 text-right">Available Stock</th>
                    <th className="py-3.5 px-4 text-right">Sold / Waste</th>
                    <th className="py-3.5 px-4 text-right">Cost Per Unit</th>
                    <th className="py-3.5 px-4 text-right">Expenses Breakdown</th>
                    <th className="py-3.5 px-4 text-right">Sellable Value</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredItems.map((item) => {
                    const isDepleted = item.available_quantity <= 0;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isDepleted ? "opacity-60 bg-slate-50/30" : ""
                        }`}
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {item.stone_type.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-2">
                                {item.stone_type}
                                {isDepleted && (
                                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                    Depleted
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                                <span>{item.batch_no || "No batch"}</span>
                                {item.location && (
                                  <>
                                    <span>•</span>
                                    <span>{item.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {item.purchase_date}
                          </div>
                          {item.supplier_name && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {item.supplier_name}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="text-base font-bold text-slate-900">
                            {item.available_quantity.toLocaleString()}{" "}
                            <span className="text-xs font-normal text-slate-500">
                              {item.unit}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            of {item.initial_quantity.toLocaleString()} initial
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap text-xs">
                          <div className="text-emerald-700 font-medium">
                            {item.quantity_sold.toLocaleString()} {item.unit} sold
                          </div>
                          {item.waste_quantity > 0 ? (
                            <div className="text-rose-600 font-semibold flex items-center justify-end gap-1 mt-0.5">
                              <AlertTriangle className="w-3 h-3 inline" />
                              {item.waste_quantity.toLocaleString()} {item.unit} waste
                            </div>
                          ) : (
                            <div className="text-slate-400 text-[11px]">0 waste</div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="font-semibold text-slate-900">
                            {formatMoney(item.cost_per_unit)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            per {item.unit}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap text-xs">
                          <div className="font-medium text-slate-800">
                            Total: {formatMoney(item.total_cost)}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1.5 mt-0.5">
                            <span title="Purchase Cost">
                              P: {formatMoney(item.purchase_cost)}
                            </span>
                            <span>•</span>
                            <span title="Transport Cost">
                              T: {formatMoney(item.transport_cost)}
                            </span>
                            <span>•</span>
                            <span title="Cutting & Slicing Cost">
                              C: {formatMoney(item.cutting_cost)}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="font-bold text-indigo-900">
                            {formatMoney(item.current_valuation || 0)}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Available × Cost
                          </div>
                        </td>

                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openWasteModal(item)}
                              disabled={isDepleted}
                              title="Log Waste / Defective Cuts"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                            >
                              <Scissors className="w-3.5 h-3.5" />
                              Log Waste
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              title="Delete Stock Batch"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Waste Logs Ledger */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Production Waste & Defect Write-Off Ledger
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All damaged, cracked, or edge-trimmed stone materials logged here are
                strictly excluded from inventory asset valuation.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
              Total Waste Loss: {formatMoney(totalWasteLoss)}
            </span>
          </div>

          {wasteLogs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-400 mb-3 stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-700">
                No waste or defective stone recorded
              </p>
              <p className="text-xs text-slate-400 mt-1">
                When stone blocks fracture or cutting scrap occurs, log them here to deduct
                from sellable inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/75 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Date</th>
                    <th className="py-3.5 px-4">Stone Variety</th>
                    <th className="py-3.5 px-4 text-right">Discarded Quantity</th>
                    <th className="py-3.5 px-4">Reason / Defect Classification</th>
                    <th className="py-3.5 px-4 text-right">Estimated Financial Loss</th>
                    <th className="py-3.5 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {safeWasteLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {log.date}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {log.stone_type}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-rose-700">
                        {log.quantity.toLocaleString()} {log.unit}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100/70 text-rose-800">
                          {log.reason}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap font-bold text-rose-700">
                        {formatMoney(log.estimated_loss)}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500">
                        {log.notes || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Stock Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Record New Stone Stock Batch
                  </h3>
                  <p className="text-xs text-slate-500">
                    Break down stone purchase, transport, and cutting expenses.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              {/* Stone Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stone Type / Material Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Absolute Black Granite, Carrara Marble, Basalt"
                    value={stoneType}
                    onChange={(e) => setStoneType(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch / Lot No
                  </label>
                  <input
                    type="text"
                    placeholder="BATCH-2026-001"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Measurement Unit *
                  </label>
                  <select
                    value={unit}
                    onChange={(e: any) => setUnit(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="ton">Ton (Raw Quarry Blocks)</option>
                    <option value="sqm">m² (Slabs / Sliced Tiles)</option>
                    <option value="linear_meter">Linear Meter (Curbstones/Steps)</option>
                    <option value="piece">Piece (Monuments/Sinks)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Received *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={initialQuantity}
                    onChange={(e) => setInitialQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Purchase Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Expenses Breakdown ({currency})</span>
                  <span className="text-indigo-600 font-semibold normal-case">
                    Direct Landing & Processing Costs
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Raw Stone Purchase Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={purchaseCost}
                      onChange={(e) => setPurchaseCost(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                      <Truck className="w-3 h-3 text-slate-400" />
                      Transport / Freight
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transportCost}
                      onChange={(e) => setTransportCost(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                      <Scissors className="w-3 h-3 text-slate-400" />
                      Cutting / Gangsaw Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={cuttingCost}
                      onChange={(e) => setCuttingCost(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Handling / Crane Crane
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={handlingCost}
                      onChange={(e) => setHandlingCost(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Other Direct Expenses
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={otherExpenses}
                      onChange={(e) => setOtherExpenses(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                    />
                  </div>

                  {/* Calculated summary pill */}
                  <div className="bg-indigo-600 text-white p-2.5 rounded-xl flex flex-col justify-center">
                    <div className="text-[10px] uppercase font-semibold text-indigo-200">
                      Calculated Cost / {unit}
                    </div>
                    <div className="text-sm font-bold truncate">
                      {formatMoney(calculatedUnitCost)}
                    </div>
                    <div className="text-[10px] text-indigo-200">
                      Total: {formatMoney(calculatedTotalCost)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier & Yard Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quarry / Supplier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Babile Quarry PLC"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Supplier Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+251 91 123 4567"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Account
                  </label>
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="">None (Accrued / On Credit)</option>
                    {safeAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.current_balance} {acc.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yard Location / Storage Bay
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yard 1 - Gangsaw Bay 3"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Recording Batch..." : "Record Stone Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Waste / Defect Modal */}
      {isWasteModalOpen && selectedStockForWaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Log Production Waste / Scrap
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedStockForWaste.stone_type} ({selectedStockForWaste.batch_no || "Batch"})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsWasteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWasteSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {error}
                </div>
              )}

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Inventory Protection:</span> Any
                  quantity logged as waste is immediately deducted from sellable stock and
                  isolated as a scrap expense loss so it is never counted as inventory.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waste Quantity ({selectedStockForWaste.unit}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    max={selectedStockForWaste.available_quantity}
                    value={wasteQty}
                    onChange={(e) => setWasteQty(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold text-rose-700"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Max: {selectedStockForWaste.available_quantity} {selectedStockForWaste.unit}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Defect / Trim *
                  </label>
                  <input
                    type="date"
                    required
                    value={wasteDate}
                    onChange={(e) => setWasteDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Waste / Defect *
                </label>
                <select
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 bg-white"
                >
                  <option value="Cutting Fracture / Blade Breakage">
                    Cutting Fracture / Blade Breakage
                  </option>
                  <option value="Transit Quarry Fracture">Transit Quarry Fracture</option>
                  <option value="Natural Fissure / Vein Crack">
                    Natural Fissure / Vein Crack
                  </option>
                  <option value="Edge Trim / Offcut Scrap">Edge Trim / Offcut Scrap</option>
                  <option value="Polishing Scratch / Surface Defect">
                    Polishing Scratch / Surface Defect
                  </option>
                  <option value="Other Damage">Other Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Block developed fissure during multi-blade cutting"
                  value={wasteNotes}
                  onChange={(e) => setWasteNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Financial Write-off preview */}
              {parseFloat(wasteQty) > 0 && (
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-rose-700 font-medium">Estimated Scrap Write-off:</span>
                  <span className="font-bold text-rose-800">
                    {formatMoney(
                      parseFloat(wasteQty) * selectedStockForWaste.cost_per_unit
                    )}
                  </span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsWasteModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "Logging Waste..." : "Confirm & Deduct from Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Stone Stock Item"
        itemName={deleteTarget ? `${deleteTarget.stone_type} (${deleteTarget.batch_no || "Lot"})` : undefined}
        description={
          deleteTarget?.quantity_sold && deleteTarget.quantity_sold > 0
            ? `Cannot delete "${deleteTarget.stone_type}" because ${deleteTarget.quantity_sold} ${deleteTarget.unit} has already been sold. Please reverse/delete the associated sale records first before deleting this batch.`
            : deleteTarget
            ? `Are you sure you want to permanently delete "${deleteTarget.stone_type}" (Batch: ${deleteTarget.batch_no || "N/A"}, Available: ${deleteTarget.available_quantity} ${deleteTarget.unit})? This will remove all associated cost valuations.`
            : undefined
        }
        confirmButtonText="Delete Stock Item"
        onConfirm={async () => {
          if (deleteTarget) {
            if (deleteTarget.quantity_sold > 0) {
              throw new Error(`Cannot delete this stock batch because ${deleteTarget.quantity_sold} ${deleteTarget.unit} has already been sold. Please reverse the sales first.`);
            }
            await onDeleteStockItem(deleteTarget.id);
          }
        }}
      />
    </div>
  );
};
