import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, MapPin, Phone, Mail, User, Calendar, Search, Filter, AlertCircle, ChevronDown, Store, FileText, Eye, Download } from 'lucide-react';
import { restaurantRequestsData } from '../data';
import { RestaurantRequest } from '../types';
import { exportToCSV } from '../utils/csvExport';

const LOCATIONS = {
  'Ecuador': ['Pichincha', 'Guayas', 'Azuay', 'Manabí', 'Loja'],
  'Colombia': ['Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Bolívar']
};

const DOCUMENTS = [
  { name: 'RUC / Identificación Fiscal', type: 'PDF', size: '2.4 MB', status: 'verified', isEmpty: false },
  { name: 'Permiso de Funcionamiento', type: 'PDF', size: '1.1 MB', status: 'pending', isEmpty: false },
  { name: 'Cédula del Propietario', type: 'JPG', size: '4.5 MB', status: 'verified', isEmpty: false },
  { name: 'Menú Digital', type: 'PDF', size: '8.2 MB', status: 'pending', isEmpty: true },
  { name: 'Certificado Bancario', type: 'PDF', size: '1.5 MB', status: 'pending', isEmpty: false }
];

const statusStyles: Record<RestaurantRequest['status'], { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-amber-500/10 text-amber-200 border-amber-500/20' },
  second_attempt: { label: '2do intento', className: 'bg-orange-500/10 text-orange-200 border-orange-500/20' },
  rejected: { label: 'Cechazado', className: 'bg-rose-500/10 text-rose-200 border-rose-500/20' },
  approved: { label: 'Aprobado', className: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20' }
};

export function RestaurantRequests() {
  const [requests, setRequests] = useState<RestaurantRequest[]>(restaurantRequestsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  
  // Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RestaurantRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = (id: string, onDone?: () => void) => {
    // If called from the modal (onDone exists), close modal first then start animation
    if (onDone) {
      onDone();
      // Small delay to allow modal close animation to start/finish
      setTimeout(() => {
        setApprovingId(id);
        setTimeout(() => {
          setRequests((prev) => prev.filter((r) => r.id !== id));
          setApprovingId(null);
        }, 2000);
      }, 300);
    } else {
      // Direct approval from card
      setApprovingId(id);
      setTimeout(() => {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setApprovingId(null);
        onDone?.();
      }, 2000);
    }
  };

  const openRejectModal = (req: RestaurantRequest) => {
    setSelectedRequest(req);
    setRejectReason('');
    setIsRejecting(false);
    setIsRejectModalOpen(true);
  };

  const openDocsModal = (req: RestaurantRequest) => {
    setSelectedRequest(req);
    setIsDocsModalOpen(true);
    setSelectedDocs(DOCUMENTS.length ? [0] : []);
  };

  const handleReject = () => {
    if (!selectedRequest || isRejecting) return;
    setIsRejecting(true);
    
    // Simulate API call
    setTimeout(() => {
      const idToReject = selectedRequest.id;
      setIsRejecting(false);
      setIsRejectModalOpen(false);
      setRejectingId(idToReject);

      // Wait for animation to finish
      setTimeout(() => {
        setRequests((prev) => prev.filter((r) => r.id !== idToReject));
        setRejectingId(null);
        setSelectedRequest(null);
        setRejectReason('');
      }, 2000);
    }, 600);
  };

  const toggleDocSelection = (index: number) => {
    setSelectedDocs([index]);
  };

  const selectedDocNames = selectedDocs
    .map((index) => DOCUMENTS[index]?.name)
    .filter((name): name is string => Boolean(name));

  const filteredRequests = requests.filter((req: RestaurantRequest) => {
    const matchesSearch = 
      req.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = selectedCountry ? req.country === selectedCountry : true;
    const matchesProvince = selectedProvince ? req.province === selectedProvince : true;

    return matchesSearch && matchesCountry && matchesProvince;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-white tracking-tight">Solicitudes de Registro</h2>
          <p className="text-slate-400 font-medium mt-1">Nuevos restaurantes esperando aprobación</p>
        </div>
      </div>

      <div className="bg-slate-950/70 p-6 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-pink transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Buscar por nombre, dueño o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-brand-pink/30 text-white placeholder:text-slate-500 transition-all"
          />
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={() => exportToCSV(requests, 'restaurant_requests')}
            className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Exportar CSV"
          >
            <Download size={20} />
          </button>
          <div className="relative w-full md:w-48 group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedProvince(''); // Reset province when country changes
              }}
              className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/30 appearance-none cursor-pointer text-white"
            >
              <option value="">Todos los Países</option>
              {Object.keys(LOCATIONS).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>

          <div className="relative w-full md:w-48 group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              disabled={!selectedCountry}
              className="w-full pl-12 pr-10 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-brand-pink/30 appearance-none cursor-pointer disabled:opacity-50 text-white"
            >
              <option value="">Todas las Provincias</option>
              {selectedCountry && (LOCATIONS as any)[selectedCountry].map((province: string) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredRequests.length === 0 ? (
          <div className="col-span-full bg-slate-950/70 p-16 rounded-3xl text-center border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-slate-500" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sin resultados</h3>
            <p className="text-slate-400">No se encontraron solicitudes con los filtros actuales.</p>
          </div>
        ) : (
          filteredRequests.map((req, index) => {
            const statusMeta = statusStyles[req.status];
            return (
            <motion.div 
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden bg-slate-950/70 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.45)] border border-white/10 p-6 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white font-bold text-2xl shadow-[0_12px_30px_rgba(0,0,0,0.35)] border border-white/10">
                    {req.restaurantName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-brand-pink transition-colors">{req.restaurantName}</h3>
                    <div className="flex items-center text-sm text-slate-400 mt-1">
                      <Store size={14} className="mr-1" />
                      ID: #{req.id}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center self-start sm:self-center">
                  <button 
                    onClick={() => openDocsModal(req)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-200 rounded-lg text-xs font-bold border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
                  >
                    <FileText size={14} />
                    Ver Docs
                  </button>
                  <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-300 group/item p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <User size={18} className="mr-3 text-slate-500 group-hover/item:text-brand-pink transition-colors" />
                    <div>
                      <span className="block text-xs text-slate-500 font-medium">Propietario</span>
                      <span className="font-semibold text-white">{req.ownerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-300 group/item p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <Mail size={18} className="mr-3 text-slate-500 group-hover/item:text-brand-pink transition-colors" />
                    <div>
                      <span className="block text-xs text-slate-500 font-medium">Email</span>
                      <span className="font-semibold text-white">{req.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-300 group/item p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <Phone size={18} className="mr-3 text-slate-500 group-hover/item:text-brand-pink transition-colors" />
                    <div>
                      <span className="block text-xs text-slate-500 font-medium">Teléfono</span>
                      <span className="font-semibold text-white">{req.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-300 group/item p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <MapPin size={18} className="mr-3 text-slate-500 group-hover/item:text-brand-pink transition-colors" />
                    <div>
                      <span className="block text-xs text-slate-500 font-medium">Ubicación</span>
                      <span className="font-semibold text-white">{req.country}, {req.province}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-slate-300 group/item p-2 rounded-xl hover:bg-white/5 transition-colors">
                    <Calendar size={18} className="mr-3 text-slate-500 group-hover/item:text-brand-pink transition-colors" />
                    <div>
                      <span className="block text-xs text-slate-500 font-medium">Solicitado el</span>
                      <span className="font-semibold text-white">{new Date(req.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-white/10">
                <motion.button 
                  onClick={() => handleApprove(req.id)}
                  disabled={approvingId === req.id}
                  whileHover={{ y: -2, scale: 1.02, boxShadow: '0 12px 30px rgba(236,72,153,0.35)' }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="flex-1 bg-brand-pink text-white py-3 rounded-xl font-bold transition-colors shadow-[0_18px_40px_rgba(244,37,123,0.35)] flex items-center justify-center gap-2 disabled:opacity-80 disabled:cursor-wait"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {approvingId === req.id ? (
                      <motion.span
                        key="approved"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="flex items-center gap-2"
                      >
                        <motion.span
                          initial={{ rotate: -90, scale: 0.6 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20"
                        >
                          <Check size={16} strokeWidth={3} />
                        </motion.span>
                        Aprobado
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} strokeWidth={3} />
                        Aprobar
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <button 
                  onClick={() => openRejectModal(req)}
                  className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3 rounded-xl font-bold hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                  <X size={18} strokeWidth={3} />
                  Rechazar
                </button>
              </div>

              {/* Success Overlay */}
              <AnimatePresence>
                {approvingId === req.id && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(16,185,129,0.5)] mb-4"
                    >
                      <Check size={48} strokeWidth={4} className="text-white" />
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold text-white"
                    >
                      ¡Aprobado!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-emerald-200 font-medium mt-2"
                    >
                      Solicitud procesada con éxito
                    </motion.p>
                  </motion.div>
                )}
                {rejectingId === req.id && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(244,63,94,0.5)] mb-4"
                    >
                      <X size={48} strokeWidth={4} className="text-white" />
                    </motion.div>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold text-white"
                    >
                      ¡Rechazado!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-rose-200 font-medium mt-2"
                    >
                      Solicitud rechazada
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
          })
        )}
      </div>

      {isDocsModalOpen && selectedRequest && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-950/90 rounded-[32px] max-w-5xl w-full p-8 shadow-[0_40px_90px_rgba(0,0,0,0.7)] border border-white/10 max-h-[90vh] flex flex-col"
          >
            <div className="flex justify-between items-start mb-6 shrink-0">
              <div>
                <h3 className="text-2xl font-semibold text-white">Revisión de Documentación</h3>
                <p className="text-slate-400">Evaluando solicitud de <span className="text-brand-pink font-bold">{selectedRequest.restaurantName}</span></p>
              </div>
              <button 
                onClick={() => setIsDocsModalOpen(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="overflow-y-auto pr-2 space-y-4">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-brand-pink" />
                  Archivos Adjuntos
                </h4>
                {DOCUMENTS.map((doc, index) => {
                  const isSelected = selectedDocs.includes(index);
                  return (
                  <button
                    key={doc.name}
                    type="button"
                    onClick={() => toggleDocSelection(index)}
                    className={`w-full flex items-center justify-between p-4 border rounded-2xl transition-all ${isSelected ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'border-white/10 hover:bg-white/5'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${doc.type === 'PDF' ? 'bg-rose-500/15 text-rose-300' : 'bg-cyan-500/15 text-cyan-300'}`}>
                        {doc.type}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{doc.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.isEmpty ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-500/10 px-1.5 py-0.5 rounded-full">
                              <AlertCircle size={8} strokeWidth={4} /> Vacío
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">{doc.size}</span>
                          )}
                          {doc.status === 'verified' && !doc.isEmpty && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                              <Check size={8} strokeWidth={4} /> Verificado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'border-cyan-400 bg-cyan-500 text-white' : 'border-white/10 text-transparent'}`}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  </button>
                );
                })}
              </div>

              <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl p-1 flex flex-col h-full overflow-hidden border border-white/10">
                <div className="bg-slate-900/70 px-4 py-2 flex justify-between items-center rounded-t-xl shrink-0">
                  <span className="text-slate-300 text-xs font-mono">
                    {selectedDocNames.length === 0
                      ? 'Selecciona documentos'
                      : selectedDocNames.length === 1
                      ? selectedDocNames[0]
                      : `Documentos seleccionados (${selectedDocNames.length})`}
                  </span>
                  <div className="flex gap-2">
                    <button className="text-slate-400 hover:text-white"><Download size={16} /></button>
                    <button className="text-slate-400 hover:text-white"><Eye size={16} /></button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-900/40 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <FileText size={120} className="text-white" />
                  </div>
                  <div className="text-center">
                    {selectedDocs.length > 0 && DOCUMENTS[selectedDocs[0]].isEmpty ? (
                      <>
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                          <AlertCircle size={40} className="text-slate-500" />
                        </div>
                        <p className="text-slate-300 font-semibold mb-2">Documento no disponible</p>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">El usuario no ha subido este archivo o está pendiente de carga.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-slate-400 mb-4">Vista previa del documento</p>
                        {selectedDocNames.length > 1 && (
                          <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-xl">
                            {selectedDocNames.map((name) => (
                              <span key={name} className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/10">
                                {name}
                              </span>
                            ))}
                          </div>
                        )}
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-colors backdrop-blur-md border border-white/10">
                          Abrir en nueva pestaña
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <AlertCircle size={16} />
                <span>Revisa cuidadosamente antes de aprobar</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setIsDocsModalOpen(false);
                    openRejectModal(selectedRequest);
                  }}
                  className="px-6 py-3 border border-white/10 text-slate-300 rounded-xl font-bold hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20 transition-colors"
                >
                  Rechazar Solicitud
                </button>
                <motion.button 
                  onClick={() => {
                    handleApprove(selectedRequest.id, () => setIsDocsModalOpen(false));
                  }}
                  disabled={approvingId === selectedRequest.id}
                  whileHover={{ y: -2, scale: 1.02, boxShadow: '0 12px 30px rgba(236,72,153,0.35)' }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="px-6 py-3 bg-brand-pink text-white rounded-xl font-bold transition-colors shadow-[0_18px_40px_rgba(244,37,123,0.35)] disabled:opacity-80 disabled:cursor-wait"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {approvingId === selectedRequest.id ? (
                      <motion.span
                        key="approved"
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="flex items-center gap-2"
                      >
                        <motion.span
                          initial={{ rotate: -90, scale: 0.6 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20"
                        >
                          <Check size={16} strokeWidth={3} />
                        </motion.span>
                        Aprobado
                      </motion.span>
                    ) : (
                      <motion.span
                        key="default"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} strokeWidth={3} />
                        Aprobar Solicitud
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {isRejectModalOpen && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-slate-950/90 rounded-[32px] max-w-md w-full p-8 shadow-[0_40px_90px_rgba(0,0,0,0.7)] border border-white/10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="text-rose-300" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Rechazar Solicitud</h3>
                <p className="text-sm text-slate-400">Esta acción notificará al restaurante</p>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Motivo del rechazo
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-4 border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 outline-none min-h-[120px] resize-none text-sm bg-white/5 text-white placeholder:text-slate-500"
                placeholder="Explica por qué se rechaza esta solicitud..."
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1 py-3 px-4 border border-white/10 rounded-xl text-slate-300 font-bold hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <motion.button 
                onClick={handleReject}
                disabled={!rejectReason.trim() || isRejecting}
                whileHover={{ y: -2, scale: 1.02, boxShadow: '0 12px 30px rgba(239,68,68,0.35)' }}
                whileTap={{ scale: 0.98, y: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-400 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-[0_16px_40px_rgba(244,63,94,0.35)]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isRejecting ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        initial={{ rotate: -90, scale: 0.6 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20"
                      >
                        <Check size={16} strokeWidth={3} />
                      </motion.span>
                      Enviado
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      Confirmar Rechazo
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
