import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Upload, Check, ChevronDown, FileText, MapPin, User, Mail, Phone, Building, CreditCard, Bike, Smartphone, Download, CheckCircle, Store, ArrowRight, Map, Locate, Search, X, HelpCircle, Car } from 'lucide-react';
import PasswordInput from '../components/PasswordInput';
import { Footer } from '../components/Footer';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { Save } from 'lucide-react';

interface RiderRegistrationProps {
  onBack: () => void;
  initialData?: any;
}

const COUNTRY_PREFIXES = [
  { code: '+593', flag: '🇪🇨' },
  { code: '+57', flag: '🇨🇴' },
  { code: '+51', flag: '🇵🇪' },
  { code: '+52', flag: '🇲🇽' },
];

const DOCUMENTS = [
  { id: 'identity', label: 'Cédula de Identidad', required: true },
  { id: 'license', label: 'Licencia de Conducir', required: true }, // Conditional based on vehicle? Let's make it generic for now or dynamic
  { id: 'matricula', label: 'Matrícula del Vehículo', required: true },
  { id: 'antecedentes', label: 'Récord Policial', required: true },
];

const ProgressSavedScreen = ({ name, onContinue, onLogout }: { name: string, onContinue: () => void, onLogout: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto min-h-screen"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative"
      >
        <Save size={48} className="text-green-600" />
      </motion.div>

      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        ¡Progreso Guardado, {name.split(' ')[0]}!
      </h2>
      
      <p className="text-xl text-slate-600 mb-8 leading-relaxed">
        Tus datos han sido almacenados correctamente. <br/>
        Esperamos verte de nuevo pronto para completar tu registro.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 w-full text-left">
        <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <HelpCircle size={18} className="text-orange-500" />
          ¿Necesitas ayuda?
        </h4>
        <p className="text-slate-600 text-sm mb-2">
          Si tienes problemas para completar tu registro, contáctanos:
        </p>
        <ul className="text-sm text-slate-700 space-y-1 ml-6 list-disc">
          <li>Soporte: <strong>soporte@foodtook.com</strong></li>
          <li>WhatsApp: <strong>+593 99 999 9999</strong></li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button 
          onClick={onContinue}
          className="px-8 py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Seguir Editando
        </button>
        
        <button 
          onClick={onLogout}
          className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          Cerrar Sesión
          <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
};

const DraftSavedScreen = ({ name, onContinue }: { name: string, onContinue: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto min-h-screen"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 relative"
      >
        <Save size={48} className="text-green-600" />
      </motion.div>

      <h2 className="text-3xl font-bold text-slate-900 mb-4">
        ¡Hola de nuevo, {name.split(' ')[0]}!
      </h2>
      
      <p className="text-xl text-slate-600 mb-8 leading-relaxed">
        Tu progreso está seguro con nosotros. <br/>
        Hemos recuperado tu información para que continúes exactamente donde te quedaste.
      </p>

      <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 w-full text-left">
        <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600" />
          Estado del Registro
        </h4>
        <p className="text-green-700 text-sm">
          Tus datos básicos y vehículo están guardados. Puedes revisarlos o continuar con la documentación.
        </p>
      </div>

      <button 
        onClick={onContinue}
        className="px-8 py-4 bg-green-600 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:bg-green-700 hover:shadow-green-500/40 transition-all active:scale-95 flex items-center gap-2"
      >
        Continuar Registro
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
};

const SuccessScreen = ({ onFinish, email, title, message }: { onFinish: () => void, email: string, title?: React.ReactNode, message?: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-32 h-32 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_20px_60px_-10px_rgba(16,185,129,0.5)] mb-8 relative"
      >
        <Check size={64} strokeWidth={4} className="text-white drop-shadow-md" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-white rounded-full opacity-20"
        />
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
      >
        {title || (
          <>
            ¡Bienvenido al equipo! <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Estás listo para rodar.</span>
          </>
        )}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xl text-slate-600 mb-8 leading-relaxed"
      >
        {message || (
          <>
            Tu registro ha sido recibido. Revisaremos tus documentos y te contactaremos en <span className="font-bold text-slate-800">24 horas</span> a <span className="font-bold text-slate-800">{email}</span> para activar tu cuenta.
          </>
        )}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-50 border border-slate-200 rounded-3xl p-8 w-full shadow-lg relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center gap-2">
            <Smartphone className="text-green-500" />
            Descarga FoodTook Riders
          </h3>
          <p className="text-slate-500 mb-8">
            Para empezar a recibir pedidos, necesitas la app de repartidores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm">
                <Download size={16} />
                App Store
             </button>
             <button className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm">
                <Download size={16} />
                Google Play
             </button>
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={onFinish}
        className="mt-12 text-slate-500 hover:text-green-500 font-medium flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </motion.button>
    </motion.div>
  );
};

const AddressSearchModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (address: string) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar dirección (calle, ciudad...)" 
            className="flex-1 outline-none text-slate-900 placeholder:text-slate-400 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium text-sm ml-2"
          >
            Cancelar
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Buscando...
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((item) => (
                <li key={item.place_id}>
                  <button 
                    className="w-full text-left p-4 hover:bg-slate-50 border-b border-slate-50 flex items-start gap-3 transition-colors"
                    onClick={() => onSelect(item.display_name)}
                  >
                    <MapPin size={18} className="text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-700 font-medium leading-snug">{item.display_name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query && !isLoading ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No se encontraron resultados para "{query}"
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              Escribe una dirección y presiona Enter
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const hasScroll = document.documentElement.scrollHeight > window.innerHeight + 50;
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setIsVisible(hasScroll && !scrolledToBottom);
    };

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    const interval = setInterval(checkScroll, 1000);
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="bg-slate-900/90 backdrop-blur-md text-white pl-4 pr-3 py-2.5 rounded-full shadow-xl shadow-slate-900/20 flex items-center gap-2 text-xs font-bold animate-bounce border border-slate-700/50">
            <span>Desliza para ver más</span>
            <ChevronDown size={16} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export function RiderRegistration({ onBack, initialData }: RiderRegistrationProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Sanear datos iniciales de forma robusta
  const safeInitialData = initialData || {};

  const [formData, setFormData] = useState({
    firstName: safeInitialData.firstName || '',
    lastName: safeInitialData.lastName || '',
    idNumber: safeInitialData.idNumber || '', // Cedula
    email: safeInitialData.email || '',
    password: safeInitialData.password || '',
    confirmPassword: safeInitialData.password || '',
    phonePrefix: safeInitialData.phonePrefix || '+593',
    phoneNumber: safeInitialData.phoneNumber || '',
    city: safeInitialData.city || '',
    address: safeInitialData.address || '',
    addressOwner: safeInitialData.addressOwner || 'self',
    vehicleType: safeInitialData.vehicle?.type || 'motorcycle',
    plate: safeInitialData.vehicle?.plate || '',
    files: {} as Record<string, File | null>
  });

  const [step, setStep] = useState(() => initialData ? 1 : 0); // 0 = Choice, 1 = Personal, 2 = Vehicle, 3 = Docs
  const [showWelcomeBack, setShowWelcomeBack] = useState(!!initialData);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isHelpRequested, setIsHelpRequested] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, isSuccess, isDraftSaved]);

  if (showWelcomeBack && initialData) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-500 selection:text-white relative overflow-y-auto">
        <DraftSavedScreen 
          name={initialData.firstName || 'Rider'} 
          onContinue={() => {
            setShowWelcomeBack(false);
            setStep(1); 
          }} 
        />
      </div>
    );
  }

  const handleFileChange = (docId: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      files: { ...prev.files, [docId]: file }
    }));
  };

  const handleSaveDraft = async () => {
    if (!formData.email || !formData.password) {
      alert("Necesitas ingresar un email y contraseña para guardar tu progreso.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Crear usuario en Auth (o loguear si ya existe)
      let user;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        user = userCredential.user;
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
           // Intentar login silencioso o pedir login
           const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
           user = userCredential.user;
        } else {
           throw authError;
        }
      }

      if (!user) throw new Error("No se pudo autenticar al usuario");

      // 2. Guardar borrador en Firestore usando el UID del usuario
      const draftRef = doc(db, "rider_requests", user.uid);
      
      // Subir archivos si hay nuevos
      const fileUrls: Record<string, string> = {};
      for (const [key, file] of Object.entries(formData.files)) {
        if (file) {
          const fileRef = ref(storage, `rider-documents/${user.uid}/${key}_${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(fileRef);
          fileUrls[`${key}Url`] = downloadURL;
        }
      }

      // Preparar datos para guardar
      const dataToSave = {
        id: user.uid,
        status: 'draft',
        lastUpdated: serverTimestamp(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        email: formData.email,
        password: formData.password,
        phonePrefix: formData.phonePrefix,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        address: formData.address,
        addressOwner: formData.addressOwner,
        vehicle: {
          type: formData.vehicleType,
          plate: formData.plate,
        },
        savedDocuments: fileUrls
      };

      await setDoc(draftRef, dataToSave, { merge: true });

      // No cerramos sesión aquí automáticamente
      setIsDraftSaved(true);
    } catch (error: any) {
      console.error("Error guardando borrador:", error);
      alert("Error al guardar: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada por este navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          
          setFormData(prev => ({
            ...prev,
            address: data.display_name || `Lat: ${latitude}, Long: ${longitude}`
          }));
        } catch (error) {
          console.error('Error getting address:', error);
          alert('Error obteniendo la dirección. Por favor ingrésala manualmente.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert('Error obteniendo ubicación: ' + error.message);
      }
    );
  };

  const handleSubmit = async () => {
    try {
      setIsSuccess(false); // Reset success state
      
      // 1. Create reference for ID
      const newRiderRef = doc(collection(db, "rider_requests"));
      const requestId = newRiderRef.id;

      // 2. Upload files to Storage
      const fileUrls: Record<string, string> = {};
      
      for (const [key, file] of Object.entries(formData.files)) {
        if (file) {
          const fileRef = ref(storage, `rider-documents/${requestId}/${key}_${file.name}`);
          await uploadBytes(fileRef, file);
          const downloadURL = await getDownloadURL(fileRef);
          fileUrls[`${key}Url`] = downloadURL;
        }
      }

      // 3. Save to Firestore "rider_requests" collection
      await setDoc(newRiderRef, {
        id: requestId,
        status: 'pending',
        submittedAt: serverTimestamp(),
        
        // Datos Personales
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        
        // Contacto
        email: formData.email,
        phone: `${formData.phonePrefix} ${formData.phoneNumber}`,
        
        // Ubicación
        city: formData.city,
        address: formData.address,
        addressOwner: formData.addressOwner,
        
        // Vehículo
        vehicle: {
          type: formData.vehicleType,
          plate: formData.plate,
        },
        
        // Archivos
        documents: fileUrls,
        
        // Metadatos adicionales
        role: 'rider',
        platform: 'web',
        appVersion: '1.0.0'
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error registering rider:", error);
      let errorMsg = "Ocurrió un error al registrarse.";
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = "El correo electrónico ya está registrado.";
      } else if (error.code === 'auth/weak-password') {
        errorMsg = "La contraseña es muy débil.";
      }
      alert(errorMsg); 
    }
  };

  const handleRequestHelp = () => {
    setIsHelpRequested(true);
    setIsSuccess(true);
  };

  const nextStep = () => {
    if (step === 1) {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setErrors(prev => ({...prev, confirmPassword: 'Las contraseñas no coinciden'}));
        return;
      }
      setErrors(prev => ({...prev, confirmPassword: ''}));
    }
    setStep(s => Math.min(s + 1, 3));
  };
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (isDraftSaved) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-500 selection:text-white relative overflow-y-auto">
         <ProgressSavedScreen 
           name={formData.firstName} 
           onContinue={() => {
             setIsDraftSaved(false);
             setStep(step); // Mantiene el paso actual
           }} 
           onLogout={async () => {
              try {
                await signOut(auth);
                window.location.reload(); // Recargar para asegurar que el estado se limpie completamente y vuelva al inicio
              } catch (error) {
                console.error("Error signing out", error);
              }
           }}
         />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-green-500 selection:text-white relative overflow-y-auto">
         <SuccessScreen 
           onFinish={onBack} 
           email={formData.email || 'tu correo'} 
           title={isHelpRequested ? (
             <>
               ¡Ya casi estás! <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">Te ayudaremos a terminar.</span>
             </>
           ) : undefined}
           message={isHelpRequested ? (
             <>
               Hemos recibido tu solicitud de ayuda. Nos comunicaremos contigo en breve al número y correo registrados para <span className="font-bold text-slate-800">asistirte personalmente</span> en este paso y completar tu registro.
             </>
           ) : undefined}
         />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-green-500 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full bg-white/80 backdrop-blur-md border-b border-slate-100/50 rounded-b-2xl md:rounded-none md:bg-transparent md:backdrop-blur-none md:border-none transition-all">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <span className="text-white font-bold text-xl">FT</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Registro Rider</span>
        </div>
        
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-slate-600 hover:text-green-500 hover:bg-green-500/5 transition-all"
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Volver</span>
        </button>
      </nav>

      <div className="fixed top-4 right-4 z-[60] flex gap-2">
         <button 
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium bg-white/90 backdrop-blur text-slate-600 hover:text-green-500 hover:bg-white shadow-lg border border-slate-100 transition-all"
            disabled={isSaving}
          >
            <Save size={18} />
            <span className="hidden sm:inline">{isSaving ? 'Guardando...' : 'Guardar Progreso'}</span>
          </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-3xl mx-auto w-full px-6 pt-24 pb-20 flex flex-col justify-center">
        
        {/* Progress Bar - Only show if step > 0 */}
        {step > 0 && (
          <div className="mb-10">
            <div className="flex justify-between text-sm font-medium text-slate-500 mb-3">
              <span className={step >= 1 ? 'text-green-500' : ''}>Datos Personales</span>
              <span className={step >= 2 ? 'text-green-500' : ''}>Vehículo</span>
              <span className={step >= 3 ? 'text-green-500' : ''}>Documentos</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${step * 33.33}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {step === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* App Option (Recommended) */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 right-0 bg-white text-green-600 text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm z-10">
                RECOMENDADO
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Smartphone size={32} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">Descargar App Rider</h3>
                <p className="text-green-100 mb-8 flex-1">
                  La forma más rápida. Sube tus documentos con la cámara y empieza a recibir pedidos en minutos.
                </p>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm flex items-center justify-center gap-4">
                    <div className="w-20 h-20 bg-white rounded-lg p-1">
                       <div className="w-full h-full bg-slate-900 rounded flex items-center justify-center">
                          <Store size={24} className="text-white" />
                       </div>
                    </div>
                    <div className="text-left">
                       <p className="font-bold text-sm mb-1">Escanear QR</p>
                       <p className="text-xs text-green-100">iOS & Android</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-black/20 hover:bg-black/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <Download size={14} /> App Store
                    </button>
                    <button className="flex-1 py-2.5 bg-black/20 hover:bg-black/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2">
                      <Download size={14} /> Play Store
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Web Option */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group hover:border-green-200 transition-colors duration-300">
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-6 text-slate-600 group-hover:bg-green-50 group-hover:text-green-500 transition-colors">
                  <FileText size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Registro Web</h3>
                <p className="text-slate-500 mb-8 flex-1">
                  Completa el formulario desde tu computadora. Necesitarás tener fotos de tus documentos listas.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <span>Datos personales</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle size={16} className="text-green-500 shrink-0" />
                    <span>Información del vehículo</span>
                  </div>
                  
                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-4 mt-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    Llenar Formulario
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Datos Personales</h2>
                  <p className="text-slate-500">Cuéntanos sobre ti para crear tu perfil.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nombres</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                        placeholder="Juan"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Apellidos</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                        placeholder="Pérez"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Cédula de Identidad</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        value={formData.idNumber}
                        onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                        placeholder="1712345678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                        placeholder="juan@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <PasswordInput
                        label="Contraseña"
                        value={formData.password}
                        onChange={(val) => setFormData({...formData, password: val})}
                        showStrengthMeter={true}
                    />
                  </div>

                  <div className="space-y-2">
                    <PasswordInput
                        label="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={(val) => {
                          setFormData({...formData, confirmPassword: val});
                          if (errors.confirmPassword) setErrors(prev => ({...prev, confirmPassword: ''}));
                        }}
                        placeholder="••••••••"
                        error={errors.confirmPassword}
                        success={formData.password.length > 0 && formData.password === formData.confirmPassword}
                        successMessage="Las contraseñas coinciden"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Teléfono Móvil</label>
                    <div className="flex gap-3">
                      <div className="relative w-32 shrink-0">
                        <select 
                          value={formData.phonePrefix}
                          onChange={(e) => setFormData({...formData, phonePrefix: e.target.value})}
                          className="w-full pl-4 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                        >
                          {COUNTRY_PREFIXES.map(p => (
                            <option key={p.code} value={p.code}>{p.flag} {p.code}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="tel" 
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                          placeholder="99 999 9999"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Dirección de Domicilio</label>
                    <div className="flex gap-2 mb-2">
                        <button 
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                        onClick={() => setIsMapOpen(true)}
                        >
                        <Map size={14} />
                        Usar Mapa
                        </button>
                        <button 
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
                        onClick={handleCurrentLocation}
                        disabled={isLocating}
                        >
                        {isLocating ? (
                            <div className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Locate size={14} />
                        )}
                        {isLocating ? 'Obteniendo...' : 'Ubicación Actual'}
                        </button>
                    </div>
                    <textarea 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium min-h-[100px] resize-none mb-4"
                        placeholder="Dirección completa"
                    />

                    {/* Address Ownership & Utility Bill */}
                    <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Foto de Planilla de Servicios Básicos</label>
                        <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.files['utility_bill'] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                              {formData.files['utility_bill'] ? <Check size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 font-medium">Luz, agua o teléfono</p>
                              <p className="text-[10px] text-slate-400">
                                {formData.files['utility_bill'] ? formData.files['utility_bill']?.name : 'Requerido'}
                              </p>
                            </div>
                          </div>
                          <label className="cursor-pointer">
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf,.jpg,.png,.jpeg"
                              onChange={(e) => handleFileChange('utility_bill', e.target.files?.[0] || null)}
                            />
                            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-green-500 hover:text-green-500 transition-all flex items-center gap-1.5">
                              <Upload size={14} />
                              <span>Subir</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-slate-200">
                        <label className="text-sm font-bold text-slate-700">¿El domicilio es propio?</label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addressOwner"
                              checked={formData.addressOwner === 'self'}
                              onChange={() => setFormData({...formData, addressOwner: 'self'})}
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm text-slate-600 font-medium">Sí, está a mi nombre</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" 
                              name="addressOwner"
                              checked={formData.addressOwner === 'other'}
                              onChange={() => setFormData({...formData, addressOwner: 'other'})}
                              className="w-4 h-4 text-green-500 focus:ring-green-500"
                            />
                            <span className="text-sm text-slate-600 font-medium">No, es de otra persona</span>
                          </label>
                        </div>

                        {formData.addressOwner === 'other' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="pt-2"
                          >
                            <label className="text-sm font-bold text-slate-700 mb-2 block">Cédula del Titular (Planilla)</label>
                            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.files['owner_id'] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                  {formData.files['owner_id'] ? <Check size={20} /> : <User size={20} />}
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 font-medium">Cédula del dueño de casa</p>
                                  <p className="text-[10px] text-slate-400">
                                    {formData.files['owner_id'] ? formData.files['owner_id']?.name : 'Requerido'}
                                  </p>
                                </div>
                              </div>
                              <label className="cursor-pointer">
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept=".pdf,.jpg,.png,.jpeg"
                                  onChange={(e) => handleFileChange('owner_id', e.target.files?.[0] || null)}
                                />
                                <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-green-500 hover:text-green-500 transition-all flex items-center gap-1.5">
                                  <Upload size={14} />
                                  <span>Subir</span>
                                </div>
                              </label>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button 
                    onClick={nextStep}
                    className="w-full md:w-auto px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:bg-green-600 hover:shadow-green-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowLeft className="rotate-180" size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Tu Vehículo</h2>
                  <p className="text-slate-500">¿Con qué vehículo realizarás las entregas?</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                        { id: 'motorcycle', label: 'Moto', icon: <Bike size={24} /> },
                        { id: 'bicycle', label: 'Bicicleta', icon: <Bike size={24} /> }, // Using Bike for both for now or differentiate
                        { id: 'car', label: 'Auto', icon: <Car size={24} /> }
                    ].map((type) => (
                        <div 
                            key={type.id}
                            onClick={() => setFormData({...formData, vehicleType: type.id as any})}
                            className={`cursor-pointer rounded-2xl p-4 border-2 flex flex-col items-center gap-2 transition-all ${formData.vehicleType === type.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-green-200'}`}
                        >
                            {type.icon}
                            <span className="font-bold text-sm">{type.label}</span>
                        </div>
                    ))}
                </div>

                {formData.vehicleType !== 'bicycle' && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Placa del Vehículo</label>
                            <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                value={formData.plate}
                                onChange={(e) => setFormData({...formData, plate: e.target.value.toUpperCase()})}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium uppercase"
                                placeholder="ABC-1234"
                            />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <label className="text-sm font-bold text-slate-700 mb-2 block">Foto de la Placa</label>
                          <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.files['plate_photo'] ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                {formData.files['plate_photo'] ? <Check size={20} /> : <Car size={20} />}
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-medium">Foto clara y legible</p>
                                <p className="text-[10px] text-slate-400">
                                  {formData.files['plate_photo'] ? formData.files['plate_photo']?.name : 'Requerido'}
                                </p>
                              </div>
                            </div>
                            <label className="cursor-pointer">
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.png,.jpeg"
                                onChange={(e) => handleFileChange('plate_photo', e.target.files?.[0] || null)}
                              />
                              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-green-500 hover:text-green-500 transition-all flex items-center gap-1.5">
                                <Upload size={14} />
                                <span>Subir</span>
                              </div>
                            </label>
                          </div>
                        </div>
                    </div>
                )}

                <div className="pt-6 flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                  <button 
                    onClick={prevStep}
                    className="w-full md:w-auto px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                  >
                    Atrás
                  </button>
                  <button 
                    onClick={nextStep}
                    className="w-full md:w-auto px-8 py-4 bg-green-500 text-white font-bold rounded-2xl shadow-xl shadow-green-500/30 hover:bg-green-600 hover:shadow-green-500/40 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Continuar
                    <ArrowLeft className="rotate-180" size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Documentación</h2>
                  <p className="text-slate-500">Sube fotos claras de tus documentos.</p>
                </div>

                <div className="space-y-4">
                  {DOCUMENTS.map((doc) => {
                    // Skip license/matricula if bicycle
                    if (formData.vehicleType === 'bicycle' && (doc.id === 'license' || doc.id === 'matricula')) return null;
                    
                    return (
                        <div key={doc.id} className="p-4 border border-slate-200 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.files[doc.id] ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'}`}>
                                {formData.files[doc.id] ? <Check size={20} /> : <FileText size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{doc.label}</h4>
                                <p className="text-xs text-slate-500">
                                {formData.files[doc.id] ? formData.files[doc.id]?.name : (doc.required ? 'Requerido' : 'Opcional')}
                                </p>
                            </div>
                            </div>
                            <label className="cursor-pointer">
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.png,.jpeg"
                                onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] || null)}
                            />
                            <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-green-500 hover:text-green-500 transition-all flex items-center gap-2 shadow-sm">
                                <Upload size={14} />
                                <span>{formData.files[doc.id] ? 'Cambiar' : 'Subir'}</span>
                            </div>
                            </label>
                        </div>
                        </div>
                    );
                  })}
                </div>

                <div className="pt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 bg-white transition-all checked:border-green-500 checked:bg-green-500 hover:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/20"
                      />
                      <Check size={16} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
                    </div>
                    <label htmlFor="terms" className="cursor-pointer text-sm text-slate-600 select-none">
                      Acepto los <a href="#" className="font-bold text-green-600 hover:underline">términos y condiciones</a> y la política de privacidad.
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                    <button 
                      onClick={prevStep}
                      className="w-full md:w-auto px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                      Atrás
                    </button>
                    <button 
                      onClick={handleSubmit}
                      disabled={!termsAccepted}
                      className={`w-full md:w-auto px-8 py-4 font-bold rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${termsAccepted ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/40' : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                    >
                      <Check size={20} />
                      Enviar Solicitud
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleRequestHelp}
                    className="w-full py-3 text-slate-400 hover:text-blue-500 font-medium text-sm transition-colors flex items-center justify-center gap-2 hover:bg-blue-50 rounded-xl"
                  >
                    <HelpCircle size={16} />
                    Solicito ayuda para este paso
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}
      </main>

      <ScrollIndicator />

      <AddressSearchModal 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        onSelect={(address) => {
          setFormData(prev => ({ ...prev, address }));
          setIsMapOpen(false);
        }} 
      />
      <Footer />
    </div>
  );
}