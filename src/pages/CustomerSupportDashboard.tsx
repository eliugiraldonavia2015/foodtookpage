import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, 
  Menu, 
  Bell, 
  User, 
  MessageSquare, 
  Users, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  Send,
  Paperclip,
  MoreVertical,
  Store,
  X
} from 'lucide-react';
import { SupportTicket } from '../types';
import { supportTicketsData, usersData } from '../data';
import { UsersList } from './Users';

interface CustomerSupportDashboardProps {
  name: string;
  email: string;
  onLogout: () => void;
  state?: string;
  role?: string;
}

type Tab = 'tickets' | 'users';
type TicketFilter = 'all' | 'open' | 'in_progress' | 'resolved';

export function CustomerSupportDashboard({ name, email, onLogout, state = 'active', role = 'Customer Support' }: CustomerSupportDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tickets');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>(supportTicketsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketFilter, setTicketFilter] = useState<TicketFilter>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // User List State Reuse
  const [users, setUsers] = useState(usersData);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = ticketFilter === 'all' || ticket.status === ticketFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'in_progress': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'resolved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'closed': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getTypeIcon = (type: SupportTicket['type']) => {
    switch (type) {
      case 'client': return <User size={14} className="text-blue-400" />;
      case 'restaurant': return <Store size={14} className="text-orange-400" />; // Store icon needs import
      case 'rider': return <Clock size={14} className="text-purple-400" />; // Just using Clock as placeholder or need Bike icon
      default: return <User size={14} />;
    }
  };

  const handleSendMessage = () => {
    if (!selectedTicket || !replyText.trim()) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      sender: 'support' as const,
      senderName: name,
      content: replyText,
      timestamp: new Date().toISOString()
    };

    const updatedTickets = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          messages: [...(t.messages || []), newMessage],
          status: 'in_progress' as const,
          lastUpdate: new Date().toISOString()
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id) || null);
    setReplyText('');
  };

  const renderTicketsView = () => (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Ticket List */}
      <div className={`${selectedTicket ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden`}>
        <div className="p-4 border-b border-white/5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Buscar tickets..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-pink/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['all', 'open', 'in_progress', 'resolved'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTicketFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  ticketFilter === filter 
                    ? 'bg-brand-pink text-white' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter === 'all' ? 'Todos' : filter === 'in_progress' ? 'En Proceso' : filter === 'resolved' ? 'Resueltos' : 'Abiertos'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredTickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedTicket?.id === ticket.id
                  ? 'bg-brand-pink/10 border-brand-pink/30 shadow-[0_0_15px_rgba(244,37,123,0.1)]'
                  : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(ticket.lastUpdate).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-white text-sm mb-1 truncate">{ticket.subject}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-3">{ticket.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 border border-white/10">
                    {ticket.userName.charAt(0)}
                  </div>
                  <span className="text-xs text-slate-400 truncate max-w-[100px]">{ticket.userName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-lg bg-slate-800 text-slate-300">
                  {getTypeIcon(ticket.type)}
                  <span className="capitalize">{ticket.type}</span>
                </div>
              </div>
            </button>
          ))}
          
          {filteredTickets.length === 0 && (
             <div className="text-center py-10">
                <p className="text-slate-500 text-sm">No se encontraron tickets</p>
             </div>
          )}
        </div>
      </div>

      {/* Ticket Detail / Chat */}
      <div className={`${selectedTicket ? 'flex' : 'hidden lg:flex'} flex-col flex-1 bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden relative`}>
        {selectedTicket ? (
          <>
            {/* Detail Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-start bg-slate-900/80 backdrop-blur-md">
              <div className="flex items-start gap-4">
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                >
                  <ChevronRight className="rotate-180" size={20} />
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">{selectedTicket.subject}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle size={14} className={selectedTicket.priority === 'high' || selectedTicket.priority === 'urgent' ? 'text-rose-500' : 'text-slate-500'} />
                      <span className="capitalize">{selectedTicket.priority} Priority</span>
                    </span>
                    <span>•</span>
                    <span>ID: {selectedTicket.id}</span>
                    <span>•</span>
                    <span>{selectedTicket.category}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <MoreVertical size={20} />
                 </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/30">
              {/* Original Description */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 shrink-0">
                  {selectedTicket.userName.charAt(0)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-white">{selectedTicket.userName}</span>
                    <span className="text-xs text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-white/5 text-slate-300 text-sm leading-relaxed">
                    {selectedTicket.description}
                  </div>
                </div>
              </div>

              {/* Thread */}
              {selectedTicket.messages?.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.sender === 'support' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                    msg.sender === 'support' ? 'bg-brand-pink' : 'bg-slate-800 border border-white/10 text-slate-400'
                  }`}>
                    {msg.sender === 'support' ? 'YO' : msg.senderName.charAt(0)}
                  </div>
                  <div className={`flex-1 space-y-2 ${msg.sender === 'support' ? 'text-right' : ''}`}>
                    <div className={`flex items-baseline gap-2 ${msg.sender === 'support' ? 'justify-end' : ''}`}>
                      <span className="font-bold text-white">{msg.senderName}</span>
                      <span className="text-xs text-slate-500">{new Date(msg.timestamp).toLocaleString()}</span>
                    </div>
                    <div className={`inline-block p-4 rounded-2xl border text-sm leading-relaxed text-left ${
                      msg.sender === 'support' 
                        ? 'bg-brand-pink/10 border-brand-pink/20 text-white rounded-tr-none' 
                        : 'bg-slate-800/50 border-white/5 text-slate-300 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Area */}
            <div className="p-4 bg-slate-900 border-t border-white/5">
              <div className="relative">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe una respuesta..."
                  className="w-full pl-4 pr-12 py-4 bg-slate-800/50 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-pink/50 resize-none h-24"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <Paperclip size={18} />
                  </button>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!replyText.trim()}
                    className="p-2 bg-brand-pink text-white rounded-lg hover:bg-brand-pink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Selecciona un ticket</h3>
            <p className="text-slate-400 max-w-xs">
              Elige un ticket de la lista para ver los detalles y responder a la solicitud.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-brand-pink selection:text-white flex overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-xl">CS</span>
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block">FoodTook</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Customer Support</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => {
                setActiveTab('tickets');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'tickets' 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-4 border-indigo-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <MessageSquare size={20} className={activeTab === 'tickets' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">Tickets de Soporte</span>
              {tickets.filter(t => t.status === 'open').length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {tickets.filter(t => t.status === 'open').length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('users');
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-indigo-500/20 to-transparent text-white border-l-4 border-indigo-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={20} className={activeTab === 'users' ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'} />
              <span className="font-medium">Usuarios</span>
            </button>
          </nav>

          {/* User Profile & Logout */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
            <div className="px-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10 shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-white truncate">{name}</p>
                  <p className="text-xs text-slate-500 truncate">{email}</p>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-3 space-y-2 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Rol</span>
                  <span className="text-indigo-400 font-bold">{role}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estado</span>
                  <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${state === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${state === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span className="capitalize">{state}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-950 relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              <Menu size={24} />
            </button>
            <span className="font-bold text-white">Support</span>
          </div>
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {activeTab === 'tickets' ? 'Bandeja de Entrada' : 'Directorio de Usuarios'}
                </h1>
                <p className="text-slate-400 mt-1">
                  {activeTab === 'tickets' ? 'Gestiona y resuelve las incidencias de la plataforma' : 'Consulta información de clientes, restaurantes y riders'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  En línea
                </div>
                <button className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950"></span>
                </button>
              </div>
            </div>

            {/* Dynamic Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'tickets' ? renderTicketsView() : (
                <UsersList 
                   users={users} 
                   searchTerm={userSearchTerm}
                   onToggleBan={() => {}} 
                   onAddUser={() => {}} 
                   onViewDishes={() => {}}
                />
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
