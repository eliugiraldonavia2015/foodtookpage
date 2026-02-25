import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { StaffLogin } from './pages/StaffLogin';
import { UserAuth } from './pages/UserAuth';
import { RiderLandingPage } from './pages/RiderLandingPage';
import { RiderRegistration } from './pages/RiderRegistration';
import { RestaurantLandingPage } from './pages/RestaurantLandingPage';
import { RestaurantRegistration } from './pages/RestaurantRegistration';
import { UsersList } from './pages/Users';
import { DishesList } from './pages/Dishes';
import { DishRequests } from './pages/DishRequests';
import { RestaurantRequests } from './pages/RestaurantRequests';
import { Dashboard } from './pages/Dashboard';
import { WelcomePage } from './pages/WelcomePage';
import { User, Tab, Restaurant } from './types';
import { Bell, Search, Settings, Download, Menu } from 'lucide-react';
import { exportToCSV } from './utils/csvExport';
import { 
  northStarKpis, growthKpis, engagementKpis, socialKpis, 
  operationsKpis, qualityKpis, financeKpis, geoKpis,
  usersData 
} from './data';
import { StaffDashboard } from './pages/StaffDashboard';
import { auth, db, dbAdmin } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'none' | 'user' | 'admin' | 'staff' | 'rider' | 'restaurant' | 'rider-registration' | 'restaurant-registration' | 'rider-login' | 'restaurant-login' | 'restaurant-registration-resume' | 'rider-registration-resume'>('none');
  const [resumeData, setResumeData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('command-center');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [users, setUsers] = useState<(User | Restaurant)[]>(usersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Monitor auth state
  useEffect(() => {
    // Si la ruta cambia, podemos resetear authMode si es necesario, 
    // pero la lógica centralizada ya se encarga de la mayoría de casos.
    if (location.pathname === '/asdtyucvb') {
      setAuthMode('admin');
    } else if (location.pathname === '/staff') {
      setAuthMode('staff');
    }
  }, [location.pathname]);

  // ELIMINADO: useEffect que forzaba recarga de usuario. 
  // Ya no es necesario porque el flujo centralizado carga lo correcto desde el principio.

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Verificar SIEMPRE primero si es un restaurante con registro pendiente (Borrador)
        // Esto tiene prioridad sobre cualquier otro rol
        try {
          // Verificar PRIMERO si es un restaurante con registro pendiente (Borrador)
          const draftDoc = await getDoc(doc(db, "restaurant_requests", firebaseUser.uid));
          if (draftDoc.exists() && draftDoc.data().status === 'draft') {
            console.log("Detectado borrador de restaurante. Redirigiendo a registro...");
            setResumeData(draftDoc.data());
            setAuthMode('restaurant-registration-resume');
            setIsLoading(false);
            return; // Detener flujo aquí, no cargar usuario normal
          }

          // Verificar SEGUNDO si es un rider con registro pendiente (Borrador)
          const riderDraftDoc = await getDoc(doc(db, "rider_requests", firebaseUser.uid));
          if (riderDraftDoc.exists() && riderDraftDoc.data().status === 'draft') {
            console.log("Detectado borrador de rider. Redirigiendo a registro...");
            setResumeData(riderDraftDoc.data());
            setAuthMode('rider-registration-resume');
            setIsLoading(false);
            return; // Detener flujo aquí
          }
        } catch (error) {
          console.error("Error verificando borrador:", error);
        }

        try {
          console.log("Usuario autenticado:", firebaseUser.email);
          
          // LÓGICA DE PRIORIDAD DE BÚSQUEDA
          // 1. Si estamos en ruta de Admin (/asdtyucvb), buscar PRIMERO en 'mandar'
          if (location.pathname === '/asdtyucvb') {
             console.log("Ruta Admin detectada. Buscando en colección 'mandar'...");
             const adminQuery = query(collection(dbAdmin, "mandar"), where("email", "==", firebaseUser.email));
             const adminSnapshot = await getDocs(adminQuery);

             if (!adminSnapshot.empty) {
                const adminData = adminSnapshot.docs[0].data();
                console.log("Usuario encontrado en Mandar (Admin):", adminData);
                setUser({
                   id: firebaseUser.uid,
                   email: firebaseUser.email || '',
                   role: 'admin',
                   name: adminData.name || 'Admin',
                   status: (adminData.state as User['status']) || 'active',
                   joinedDate: new Date().toISOString()
                } as User);
                setIsLoading(false);
                return; // Encontrado y configurado, salimos.
             }
          }

          // 2. Si estamos en ruta de Staff (/staff), buscar PRIMERO en 'staff'
          if (location.pathname === '/staff') {
             console.log("Ruta Staff detectada. Buscando en colección 'staff'...");
             const staffQuery = query(collection(dbAdmin, "staff"), where("email", "==", firebaseUser.email));
             const staffSnapshot = await getDocs(staffQuery);

             if (!staffSnapshot.empty) {
                const staffData = staffSnapshot.docs[0].data();
                console.log("Usuario encontrado en Staff:", staffData);
                setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  role: staffData.role === 'admin' ? 'admin' : 'staff', 
                  staffRole: staffData.role,
                  name: staffData.name || 'Staff Member',
                  status: (staffData.state as User['status']) || 'active',
                  joinedDate: new Date().toISOString()
                } as User);
                setIsLoading(false);
                return; // Encontrado y configurado, salimos.
             }
          }

          // 3. Búsqueda General (Fallback para otras rutas o si no se encontró arriba)
          // Intentar 'users' (Usuarios normales/Restaurantes/Riders)
          console.log("Búsqueda estándar en 'users'...");
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          
          if (userDoc.exists()) {
            console.log("Datos de usuario encontrados en Firestore (users)");
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: (userData.role as User['role']) || 'user',
              name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : (userData.name || 'Usuario'),
              status: (userData.status as User['status']) || 'active',
              joinedDate: userData.createdAt || new Date().toISOString()
            } as User);
          } else {
             // Si no está en 'users', hacemos un último intento en 'staff' y 'mandar' por si acaso entraron por ruta equivocada
             // pero tienen credenciales válidas.
             console.log("No encontrado en 'users'. Buscando en 'staff' como fallback...");
             const staffQuery = query(collection(dbAdmin, "staff"), where("email", "==", firebaseUser.email));
             const staffSnapshot = await getDocs(staffQuery);

             if (!staffSnapshot.empty) {
                const staffData = staffSnapshot.docs[0].data();
                setUser({
                  id: firebaseUser.uid,
                  email: firebaseUser.email || '',
                  role: staffData.role === 'admin' ? 'admin' : 'staff', 
                  staffRole: staffData.role,
                  name: staffData.name || 'Staff Member',
                  status: (staffData.state as User['status']) || 'active',
                  joinedDate: new Date().toISOString()
                } as User);
             } else {
                console.log("No encontrado en 'staff'. Buscando en 'mandar' como fallback...");
                const adminQuery = query(collection(dbAdmin, "mandar"), where("email", "==", firebaseUser.email));
                const adminSnapshot = await getDocs(adminQuery);

                if (!adminSnapshot.empty) {
                   const adminData = adminSnapshot.docs[0].data();
                   setUser({
                      id: firebaseUser.uid,
                      email: firebaseUser.email || '',
                      role: 'admin',
                      name: adminData.name || 'Admin',
                      status: (adminData.state as User['status']) || 'active',
                      joinedDate: new Date().toISOString()
                   } as User);
                } else {
                   console.warn("Usuario autenticado pero NO encontrado en ninguna colección");
                   // Usuario fantasma (Auth sí, DB no)
                   setUser({
                     id: firebaseUser.uid,
                     email: firebaseUser.email || '',
                     role: 'user',
                     name: firebaseUser.displayName || 'Usuario',
                     status: 'active',
                     joinedDate: new Date().toISOString()
                   });
                }
             }
          }
        } catch (error) {
          console.error("Error fetching user profile from Firestore:", error);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: 'user',
            name: firebaseUser.displayName || 'Usuario (Error)',
            status: 'active',
            joinedDate: new Date().toISOString()
          });
        }
      } else {
        console.log("No hay usuario autenticado");
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [location.pathname]); // Añadido location.pathname para re-ejecutar si cambia la ruta (importante para la lógica de prioridad)

  useEffect(() => {
    setSearchTerm('');
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthMode('none');
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-pink"></div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'admin') {
      return <Login onLogin={() => {}} onBack={() => {
        setAuthMode('none');
        navigate('/');
      }} variant="admin" />;
    }
    if (authMode === 'staff') {
      return <StaffLogin onLogin={() => {}} onBack={() => {
        setAuthMode('none');
        navigate('/');
      }} />;
    }
    if (authMode === 'user') {
      return <UserAuth onLogin={() => {}} onBack={() => setAuthMode('none')} />;
    }
    if (authMode === 'rider') {
      return <RiderLandingPage onBack={() => setAuthMode('none')} onRegisterClick={() => setAuthMode('rider-registration')} onLoginClick={() => setAuthMode('rider-login')} />;
    }
    if (authMode === 'rider-registration') {
      return <RiderRegistration onBack={() => setAuthMode('rider')} />;
    }
    if (authMode === 'rider-login') {
      return <UserAuth 
        onLogin={() => {
          setAuthMode('rider');
        }} 
        onBack={() => setAuthMode('rider')} 
        variant="rider" 
        onResumeRegistration={(data) => {
          setResumeData(data);
          setAuthMode('rider-registration-resume');
        }}
      />;
    }
    
    if (authMode === 'rider-registration-resume') {
        return <RiderRegistration onBack={() => setAuthMode('rider')} initialData={resumeData} />;
    }

    if (authMode === 'restaurant') {
      return <RestaurantLandingPage onBack={() => setAuthMode('none')} onLoginClick={() => setAuthMode('restaurant-login')} />;
    }
    if (authMode === 'restaurant-registration') {
        return <RestaurantRegistration onBack={() => setAuthMode('restaurant')} />;
    }
    if (authMode === 'restaurant-login') {
      return <UserAuth 
        onLogin={() => {
          // Login normal si no hay borrador
          setAuthMode('restaurant');
        }} 
        onBack={() => setAuthMode('restaurant')} 
        variant="restaurant" 
        onResumeRegistration={(data) => {
          // Pasamos los datos al componente de registro
          setResumeData(data);
          setAuthMode('restaurant-registration-resume');
        }}
      />;
    }
    
    if (authMode === 'restaurant-registration-resume') {
        return <RestaurantRegistration onBack={() => setAuthMode('restaurant')} initialData={resumeData} />;
    }
    
    return (
      <LandingPage 
        onUserLoginClick={() => setAuthMode('user')} 
        onRiderClick={() => setAuthMode('rider')}
        onRestaurantClick={() => setAuthMode('restaurant')}
      />
    );
  }

  // If user is logged in, show dashboard ONLY if admin. 
  // Otherwise show Welcome Page.
  if (user.role === 'staff') {
    return <StaffDashboard name={user.name} role={user.staffRole || user.role} email={user.email} state={user.status} onLogout={handleLogout} />;
  }

  if (user.role !== 'admin') {
    return <WelcomePage user={user} onLogout={handleLogout} />;
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
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }}
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
      
      <main className={`flex-1 px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 ${!isModalOpen ? 'md:ml-64' : ''}`}>
        <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-slate-950/70 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f2937,transparent_55%)] opacity-80"></div>
          <div className="relative z-10 px-4 sm:px-4 py-4">
            <header className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center mb-5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden"
                >
                  <Menu size={24} />
                </button>
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{getPageTitle()}</h2>
                  <p className="text-sm text-slate-400">Panel de control administrativo</p>
                </div>
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
