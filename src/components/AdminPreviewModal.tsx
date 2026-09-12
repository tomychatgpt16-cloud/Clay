import { useState } from 'react';
import { 
  X, 
  Shield, 
  FileText, 
  Layers, 
  DollarSign, 
  Building2, 
  Download, 
  Check, 
  ExternalLink,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react';
import { QuotationSubmission, StoneProduct } from '../types';
import { STONE_PRODUCTS, COMPANY_DETAILS } from '../data/stoneData';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotations: QuotationSubmission[];
  onUpdateQuoteStatus: (id: string, newStatus: QuotationSubmission['status']) => void;
}

export default function AdminPreviewModal({
  isOpen,
  onClose,
  quotations,
  onUpdateQuoteStatus
}: AdminPreviewModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'quotes' | 'products' | 'pricing' | 'company'>('quotes');
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuotationSubmission | null>(null);

  const exportQuotesJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `clays_stone_quotes_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div 
      id="admin-preview-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#171817]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl bg-[#252625] border border-[#3F403E] rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#171817] border-b border-[#3F403E]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#252625] border border-[#3F403E] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[#DDDAD3]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wider text-white">
                  CLAY’S ADMIN PORTAL ARCHITECTURE
                </span>
                <span className="text-[10px] bg-[#3F403E] text-[#F4F3F0] border border-[#8E8D89]/40 px-2 py-0.5 rounded-full font-mono">
                  FUTURE READY
                </span>
              </div>
              <span className="text-[11px] text-[#8E8D89] font-sans">
                Manage inquiries, products, pricing rules & architectural projects
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8D89] hover:text-white rounded-full cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-[#1C1D1C] border-b border-[#3F403E] overflow-x-auto">
          {[
            { id: 'quotes', label: `Quotation Requests (${quotations.length})`, icon: FileText },
            { id: 'products', label: 'Stone Catalog (10)', icon: Layers },
            { id: 'pricing', label: 'Pricing Matrix Config', icon: DollarSign },
            { id: 'company', label: 'Company Profile', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wider rounded-t-sm transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-white text-white bg-[#252625]'
                    : 'border-transparent text-[#8E8D89] hover:text-[#C8C7C3]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#252625]">
          
          {/* TAB 1: QUOTATION REQUESTS */}
          {activeTab === 'quotes' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-serif text-white font-medium">
                    Received Architectural Quotation Inquiries
                  </h3>
                  <p className="text-xs text-[#8E8D89]">
                    Real inquiries submitted through the online Stair & Sill Quotation Calculator.
                  </p>
                </div>

                {quotations.length > 0 && (
                  <button
                    onClick={exportQuotesJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171817] border border-[#3F403E] hover:border-[#8E8D89] text-xs text-[#F4F3F0] rounded-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#DDDAD3]" />
                    <span>Export Inquiries (JSON)</span>
                  </button>
                )}
              </div>

              {quotations.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[#3F403E] rounded-sm bg-[#171817]">
                  <FileText className="w-10 h-10 text-[#5C5B57] mx-auto mb-3" />
                  <p className="text-sm text-[#DDDAD3] font-medium">No quotation inquiries received yet.</p>
                  <p className="text-xs text-[#8E8D89] mt-1">
                    Fill in the Stair & Sill Quotation Calculator on the website to see real-time customer submissions appear here!
                  </p>
                </div>
              ) : (
                <div className="border border-[#3F403E] rounded-sm overflow-hidden bg-[#171817]">
                  <table className="w-full text-left text-xs text-[#C8C7C3]">
                    <thead className="bg-[#1E1F1E] text-[10px] uppercase font-bold tracking-wider text-[#8E8D89] border-b border-[#3F403E]">
                      <tr>
                        <th className="p-3">Ref ID / Date</th>
                        <th className="p-3">Client</th>
                        <th className="p-3">Stone & App</th>
                        <th className="p-3">Area (m²) / lm</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#3F403E]">
                      {quotations.map((q) => (
                        <tr key={q.id} className="hover:bg-[#1C1D1C]">
                          <td className="p-3">
                            <span className="font-mono text-white font-bold block">{q.id}</span>
                            <span className="text-[10px] text-[#8E8D89]">{q.createdAt}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-white font-medium block">{q.fullName}</span>
                            <span className="text-[11px] text-[#8E8D89]">{q.phoneNumber}</span>
                            {q.company && (
                              <span className="text-[10px] text-[#DDDAD3] block">{q.company}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-white block">{q.specificStone}</span>
                            <span className="text-[11px] text-[#8E8D89]">{q.application} ({q.preferredFinish})</span>
                          </td>
                          <td className="p-3 font-mono">
                            <span className="text-[#DDDAD3] font-bold block">{q.calculatedAreaM2} m²</span>
                            <span className="text-[#8E8D89] text-[10px]">{q.calculatedLinearM} lm</span>
                          </td>
                          <td className="p-3">
                            <select
                              value={q.status}
                              onChange={(e) => onUpdateQuoteStatus(q.id, e.target.value as any)}
                              className="bg-[#252625] border border-[#3F403E] text-xs text-[#F4F3F0] rounded px-2 py-1 focus:outline-none"
                            >
                              <option value="Pending Review">Pending Review</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Quoted">Quoted</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setSelectedQuoteDetail(q)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#DDDAD3] hover:underline cursor-pointer"
                            >
                              Full Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Single Quote Inspection Drawer */}
              {selectedQuoteDetail && (
                <div className="mt-6 p-5 rounded-sm bg-[#171817] border border-[#3F403E]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#3F403E]">
                    <span className="font-serif text-white font-bold">
                      Quotation Record: {selectedQuoteDetail.id}
                    </span>
                    <button
                      onClick={() => setSelectedQuoteDetail(null)}
                      className="text-[#8E8D89] hover:text-white text-xs cursor-pointer"
                    >
                      Close Details
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4">
                    <div>
                      <span className="text-[#8E8D89] block">Client Email</span>
                      <span className="text-white">{selectedQuoteDetail.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#8E8D89] block">Project Location</span>
                      <span className="text-white">{selectedQuoteDetail.projectLocation || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[#8E8D89] block">Total Quantities</span>
                      <span className="text-white font-mono font-bold">
                        {selectedQuoteDetail.totalAreaM2 || selectedQuoteDetail.calculatedAreaM2} m² 
                        {(selectedQuoteDetail.totalLinearM || selectedQuoteDetail.calculatedLinearM) ? ` | ${selectedQuoteDetail.totalLinearM || selectedQuoteDetail.calculatedLinearM} lm` : ''}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#8E8D89] block">Attachment</span>
                      <span className="text-[#DDDAD3]">{selectedQuoteDetail.attachmentName || 'None'}</span>
                    </div>
                  </div>

                  {/* Multi-application itemized breakdown if available */}
                  {selectedQuoteDetail.applications && selectedQuoteDetail.applications.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#3F403E]">
                      <span className="text-[#8E8D89] text-[11px] uppercase tracking-wider block mb-2 font-semibold">
                        Itemized Architectural Elements ({selectedQuoteDetail.applications.length}):
                      </span>
                      <div className="space-y-1.5">
                        {selectedQuoteDetail.applications.map((appItem, idx) => (
                          <div key={idx} className="p-2.5 rounded bg-[#1F201F] border border-[#333433] flex items-center justify-between text-xs">
                            <div>
                              <span className="font-semibold text-white mr-2">{appItem.label}</span>
                              <span className="text-[#8E8D89]">{appItem.detailsSummary}</span>
                              <span className="text-[10px] text-[#DDDAD3] block font-mono">Finish: {appItem.finish}</span>
                            </div>
                            <div className="text-right font-mono text-[#DDDAD3] shrink-0 ml-3">
                              <span className="font-bold">{appItem.calculatedAreaM2} m²</span>
                              {appItem.calculatedLinearM > 0 && (
                                <span className="text-[10px] text-[#8E8D89] block">{appItem.calculatedLinearM} lm</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-3 pt-2 border-t border-[#3F403E] text-xs">
                    <span className="text-[#8E8D89] block mb-1">Project Description & Notes</span>
                    <p className="text-[#C8C7C3] bg-[#1E1F1E] p-2.5 rounded border border-[#2F302F]">
                      {selectedQuoteDetail.projectDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STONE CATALOG ARCHITECTURE */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-serif text-white font-medium">Stone Products Catalog Management</h3>
                  <p className="text-xs text-[#8E8D89]">
                    Product schema supports adding, updating finishes, and assigning quarry regions.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Future-Ready Admin Feature: Adding custom stone products will integrate with backend database.')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#252625] font-bold text-xs rounded-sm cursor-pointer hover:bg-[#F4F3F0]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Stone</span>
                </button>
              </div>

              <div className="space-y-3">
                {STONE_PRODUCTS.map((prod) => (
                  <div key={prod.id} className="p-4 rounded-sm bg-[#171817] border border-[#3F403E] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={prod.imageUrl} alt={prod.name} className="w-14 h-14 object-cover rounded border border-[#3F403E]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-serif font-bold text-white">{prod.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#252625] text-[#DDDAD3] border border-[#3F403E]">
                            {prod.stoneType}
                          </span>
                        </div>
                        <p className="text-xs text-[#8E8D89] mt-0.5">{prod.originRegion}</p>
                        <div className="flex gap-1 mt-1.5">
                          {prod.finishOptions.map(f => (
                            <span key={f} className="text-[10px] text-[#C8C7C3] bg-[#252625] px-1.5 py-0.5 rounded border border-[#3F403E]">
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Edit ${prod.name}: Configured in future admin update.`)}
                        className="p-2 text-[#8E8D89] hover:text-white bg-[#252625] rounded border border-[#3F403E] cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PRICING MATRIX CONFIGURATION */}
          {activeTab === 'pricing' && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-serif text-white font-medium">Dynamic Pricing Engine Configuration</h3>
                <p className="text-xs text-[#8E8D89]">
                  Configure base rates per square meter (m²) and linear meter (lm) finishing rules.
                </p>
              </div>

              <div className="p-5 rounded-sm bg-[#171817] border border-[#3F403E] space-y-4">
                <div className="p-3 bg-[#1E1F1E] border border-[#3F403E] rounded text-xs text-[#C8C7C3]">
                  <span className="font-bold text-[#DDDAD3] block mb-1">Administrative Safety Policy:</span>
                  Public prices are hidden on the client-side quotation calculator per specification:
                  <span className="italic block mt-1 text-[#F4F3F0]">
                    “Do not automatically show fixed selling prices unless an administrator has configured them. Quotation will be confirmed by Clay’s Granite and Marble Manufacturing.”
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#252625] border border-[#3F403E] rounded">
                    <span className="text-[#8E8D89] block mb-1">Granite Slab Base (ETB / m²)</span>
                    <input type="text" defaultValue="Quote on Inquiry" className="w-full bg-[#171817] border border-[#3F403E] px-3 py-1.5 rounded text-white font-mono" />
                  </div>
                  <div className="p-3 bg-[#252625] border border-[#3F403E] rounded">
                    <span className="text-[#8E8D89] block mb-1">Marble Slab Base (ETB / m²)</span>
                    <input type="text" defaultValue="Quote on Inquiry" className="w-full bg-[#171817] border border-[#3F403E] px-3 py-1.5 rounded text-white font-mono" />
                  </div>
                  <div className="p-3 bg-[#252625] border border-[#3F403E] rounded">
                    <span className="text-[#8E8D89] block mb-1">Bullnose Edge Profile (ETB / lm)</span>
                    <input type="text" defaultValue="Quote on Inquiry" className="w-full bg-[#171817] border border-[#3F403E] px-3 py-1.5 rounded text-white font-mono" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPANY PROFILE */}
          {activeTab === 'company' && (
            <div>
              <div className="mb-4">
                <h3 className="text-base font-serif text-white font-medium">Company Information & Showroom Contacts</h3>
                <p className="text-xs text-[#8E8D89]">
                  Update public contact lines, headquarters address, and official emails.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#171817] border border-[#3F403E] rounded">
                  <span className="text-[#8E8D89] uppercase tracking-wider text-[10px] block mb-1">Company Name</span>
                  <span className="text-white font-bold">{COMPANY_DETAILS.name}</span>
                </div>
                <div className="p-4 bg-[#171817] border border-[#3F403E] rounded">
                  <span className="text-[#8E8D89] uppercase tracking-wider text-[10px] block mb-1">Headquarters</span>
                  <span className="text-white">{COMPANY_DETAILS.location}</span>
                </div>
                <div className="p-4 bg-[#171817] border border-[#3F403E] rounded">
                  <span className="text-[#8E8D89] uppercase tracking-wider text-[10px] block mb-1">Primary Phones</span>
                  <span className="text-white font-mono">{COMPANY_DETAILS.phones.join(' / ')}</span>
                </div>
                <div className="p-4 bg-[#171817] border border-[#3F403E] rounded">
                  <span className="text-[#8E8D89] uppercase tracking-wider text-[10px] block mb-1">Inquiries Email</span>
                  <span className="text-white font-mono">{COMPANY_DETAILS.email}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#171817] border-t border-[#3F403E] flex justify-between items-center text-xs text-[#8E8D89]">
          <span>Clay’s Architectural Stone Management System</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#252625] text-[#C8C7C3] hover:text-white rounded border border-[#3F403E] cursor-pointer"
          >
            Close Admin Preview
          </button>
        </div>
      </div>
    </div>
  );
}
