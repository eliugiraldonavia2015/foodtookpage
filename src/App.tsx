import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { UserAuth } from './pages/UserAuth';
import { RiderLandingPage } from './pages/RiderLandingPage';
import { RiderRegistration } from './pages/RiderRegistration';
import { RestaurantLandingPage } from './pages/RestaurantLandingPage';
import { UsersList } from './pages/Users';
import { DishesList } from './pages/Dishes';
import { DishRequests } from './pages/DishRequests';
import { RestaurantRequests } from './pages/RestaurantRequests';
import { Dashboard } from './pages/Dashboard';
import { User, Tab, Restaurant } from './types';
import { Bell, Search, Settings, Download } from 'lucide-react';
import { exportToCSV } from './utils/csvExport';
import { 
  northStarKpis, growthKpis, engagementKpis, socialKpis, 
  operationsKpis, qualityKpis, financeKpis, geoKpis,
  usersData 
} from './data';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'none' | 'user' | 'admin' | 'rider' | 'restaurant' | 'rider-registration'>('none');
  const [activeTab, setActiveTab] = useState<Tab>('command-center');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [users, setUsers] = useState<(User | Restaurant)[]>(usersData);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('foodtook_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  const handleLogin = (email: string) => {
    const newUser: User = {
      id: 'admin',
      name: 'Admin User',
      email: email,
      status: 'active',
      role: 'admin',
      joinedDate: new Date().toISOString()
    };
    localStorage.setItem('foodtook_admin_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('foodtook_admin_user');
    setUser(null);
    setAuthMode('none');
  };

  const handleToggleBan = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newStatus = user.status === 'banned' ? 'active' : 'banned';
        return { ...user, status: newStatus as any };
      }
      return user;
    }));
  };

  const handleAddUser = (newUser: User | Restaurant) => {
    setUsers([newUser, ...users]);
  };

  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = `export_${activeTab}_${new Date().toISOString().split('T')[0]}`;

    switch (activeTab) {
      case 'command-center': dataToExport = [northStarKpis]; break;
      case 'growth': dataToExport = [growthKpis]; break;
      case 'attention-content': dataToExport = [socialKpis]; break;
      case 'operations': dataToExport = [operationsKpis]; break;
      case 'quality-risk': dataToExport = [qualityKpis]; break;
      case 'financial-control': dataToExport = [financeKpis]; break;
      case 'geography-intelligence': dataToExport = [geoKpis]; break;
      case 'users-restaurants': 
        dataToExport = users.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        break;
      default: console.log('Export not configured for this tab via global header'); return;
    }

    if (dataToExport.length > 0) {
      exportToCSV(dataToExport, filename);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'command-center': return <Dashboard initialTab="overview" />;
      case 'growth': return <Dashboard initialTab="growth" />;
      case 'attention-content': return <Dashboard initialTab="social" />;
      case 'operations': return <Dashboard initialTab="operations" />;
      case 'quality-risk': return <Dashboard initialTab="quality" />;
      case 'financial-control': return <Dashboard initialTab="finance" />;
      case 'geography-intelligence': return <Dashboard initialTab="geo" />;
      case 'users-restaurants': return <UsersList 
        onViewDishes={(restaurantId) => {
          setSelectedRestaurantId(restaurantId);
          setActiveTab('content-product-governance');
        }} 
        users={users}
        searchTerm={searchTerm}
        onToggleBan={handleToggleBan}
        onAddUser={handleAddUser}
        onModalStateChange={setIsModalOpen}
      />;
      case 'content-product-governance': return <DishesList initialRestaurantId={selectedRestaurantId} />;
      case 'dish-requests': return <DishRequests />;
      case 'restaurant-requests': return <RestaurantRequests />;
      default: return <Dashboard initialTab="overview" />;
    }
  };

  if (!user) {
    if (authMode === 'admin') {
      return <Login onLogin={handleLogin} onBack={() => setAuthMode('none')} />;
    }
    if (authMode === 'user') {
      return <UserAuth onLogin={() => setAuthMode('none')} onBack={() => setAuthMode('none')} />;
    }
    if (authMode === 'rider') {
      return <RiderLandingPage onBack={() => setAuthMode('none')} onRegisterClick={() => setAuthMode('rider-registration')} />;
    }
    if (authMode === 'rider-registration') {
      return <RiderRegistration onBack={() => setAuthMode('rider')} />;
    }
    if (authMode === 'restaurant') {
      return <RestaurantLandingPage onBack={() => setAuthMode('none')} />;
    }
    return (
      <LandingPage 
        onAdminClick={() => setAuthMode('admin')} 
        onUserLoginClick={() => setAuthMode('user')} 
        onRiderClick={() => setAuthMode('rider')}
        onRestaurantClick={() => setAuthMode('restaurant')}
      />
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'command-center': return 'Command Center';
      case 'growth': return 'Growth';
      case 'attention-content': return 'Attention & Content';
      case 'operations': return 'Operations';
      case 'quality-risk': return 'Quality & Risk';
      case 'financial-control': return 'Financial Control';
      case 'geography-intelligence': return 'Geography Intelligence';
      case 'users-restaurants': return 'Users & Restaurants';
      case 'content-product-governance': return 'Content & Product Governance';
      case 'dish-requests': return 'Dish Requests';
      case 'restaurant-requests': return 'Restaurant Requests';
      default: return 'Dashboard';
    }
  };

  const showExportButton = ['command-center', 'growth', 'attention-content', 'operations', 'quality-risk', 'financial-control', 'geography-intelligence', 'users-restaurants'].includes(activeTab);

  return (
    <div className="min-h-screen flex text-slate-100 overflow-x-hidden">
      <div className={`transition-all duration-300 ${isModalOpen ? '-ml-72 opacity-0 pointer-events-none' : ''}`}>
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={handleLogout} 
        />
      </div>
      
      <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${!isModalOpen ? 'md:ml-64' : ''}`}>
        <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-950/70 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,transparent_55%)] opacity-80"></div>
          <div className="relative z-10 px-4 sm:px-4 py-4">
            <header className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center mb-5">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">{getPageTitle()}</h2>
                <p className="text-sm text-slate-400">Panel de control administrativo</p>
              </div>

              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center gap-2 w-full max-w-md">
                  <div className="relative group flex-1">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-500 group-focus-within:text-brand-pink transition-colors" />
                     </div>
                     <input 
                        type="text" 
                        placeholder="Buscar..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink/30 focus:border-brand-pink/50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:border-white/20 text-slate-100 placeholder:text-slate-500"
                     />
                  </div>
                  {showExportButton && (
                    <button 
                      onClick={handleExport}
                      className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      title="Exportar CSV"
                    >
                      <Download size={20} />
                    </button>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
                  </button>
                  <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-colors">
                    <Settings size={20} />
                  </button>
                  
                  <div className="h-8 w-px bg-white/10 mx-1"></div>

                  <div className="flex items-center gap-2 pl-1">
                    <div className="text-right hidden xl:block">
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs font-medium text-slate-400">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
                    </div>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-brand-pink via-fuchsia-500 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(244,37,123,0.45)] cursor-pointer hover:scale-105 transition-transform">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
