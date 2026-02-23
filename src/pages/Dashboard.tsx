import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Activity, ArrowUpRight, ArrowDownRight, 
  Zap, Calendar, TrendingUp, Users, ShoppingBag, 
  Clock, Star, MapPin, Smartphone, CreditCard, 
  UtensilsCrossed, Store, UserX, Bike, Wallet, Heart,
  Filter, ChevronDown, Check, Shield, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, ComposedChart, Legend,
  Funnel, FunnelChart, LabelList
} from 'recharts';
import { EcuadorMap } from '../components/EcuadorMap';
import { SmartTooltip } from '../components/SmartTooltip';
import { 
  userGrowthData, userRetentionData, restaurantGrowthData, 
  geoDistributionData, ordersTrendData, salesHourlyData, 
  funnelData, cancellationReasonsData, financialData,
  northStarKpis, marketplaceBalanceKpis, growthKpis, engagementKpis,
  socialKpis, operationsKpis, qualityKpis, supportKpis, financeKpis,
  socialEngagementData, socialConversionData, deliveryStageData,
  qualityIssuesData, supportVolumeData, paymentMethodsData,
  topRestaurantsData, topCategoriesData,
  revenueMixData, gmvMarginData, checkoutTimeData,
  viralityFunnelData, ltvCacData, topContentCreatorsData,
  costPerOrderWaterfallData, restaurantReliabilityData,
  geoKpis
} from '../data';

const DrillDownModal = ({ isOpen, onClose, title, data }: { isOpen: boolean; onClose: () => void; title: string; data: any }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{title} - Detalles</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
             <p className="text-sm text-slate-400 mb-1">Selección:</p>
             <p className="text-lg font-semibold text-white">{data?.activePayload?.[0]?.payload?.name || data?.activePayload?.[0]?.payload?.month || data?.name || 'N/A'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
             {data?.activePayload?.map((entry: any, idx: number) => (
               <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5">
                 <p className="text-xs text-slate-400 mb-1 capitalize">{entry.name}</p>
                 <p className="text-base font-bold" style={{ color: entry.color }}>
                   {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                 </p>
               </div>
             ))}
             {!data?.activePayload && (
               <div className="col-span-2 p-3 text-center text-slate-400 text-sm">
                 Información detallada no disponible en esta vista simulada.
               </div>
             )}
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500 text-center">
              Esta es una vista simulada de "Drill-down". En producción, esto mostraría datos granulares filtrados por la selección.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, trend, subtext, color, index, tooltip }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: typeof index === 'number' ? index * 0.05 : 0 }}
    className="h-full"
  >
    <SmartTooltip content={tooltip} className="h-full">
      <div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-white/20 transition-all duration-300 relative overflow-hidden h-full">
        <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} to-transparent opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
        
        <div className="flex justify-between items-start mb-3 relative z-10">
          <div className={`p-2.5 rounded-xl ${color.replace('from-', 'bg-').replace('to-', 'text-').split(' ')[0]} bg-opacity-20 text-white`}>
            <Icon size={20} strokeWidth={2.5} className="text-white" />
          </div>
          {change && (
            <span className={`text-[10px] font-bold flex items-center px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
              {change}
            </span>
          )}
        </div>
        <div className="relative z-10">
          <h3 className="text-2xl font-semibold text-white tracking-tight mb-0.5">{value}</h3>
          <p className="text-xs font-medium text-slate-400">{title}</p>
          {subtext && <p className="text-[10px] text-slate-500 mt-0.5">{subtext}</p>}
        </div>
      </div>
    </SmartTooltip>
  </motion.div>
);

const GaugeCard = ({ title, value, subtext, index, tooltip }: any) => {
  const getColor = (val: number) => {
    if (val >= 80) return '#10B981'; // Emerald
    if (val >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };
  
  const color = getColor(value);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: typeof index === 'number' ? index * 0.05 : 0 }}
      className="h-full"
    >
      <SmartTooltip content={tooltip} className="h-full">
        <div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-white/20 transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center h-full">
          <div className="relative w-24 h-24 mb-2">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1F2937" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" 
                strokeDasharray={`${value * 2.51} 251.2`} 
                strokeDashoffset="0" 
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{value}</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[10px] text-slate-400 mt-1">{subtext}</p>
        </div>
      </SmartTooltip>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10 text-xs z-50">
        <p className="font-bold mb-2 text-gray-300 uppercase tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="font-bold font-mono text-white">
              {typeof entry.value === 'number' && entry.value > 1000 ? `$${entry.value}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const FilterDropdown = ({ label, options }: { label: string, options: string[] }) => (
  <div className="relative group">
    <button className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all min-w-[120px] justify-between">
      <span>{label}</span>
      <ChevronDown size={14} className="text-slate-500" />
    </button>
    {/* Dropdown content would go here */}
  </div>
);

const GlobalFilters = () => (
  <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-3 -mx-6 mb-6 flex items-center gap-4 overflow-x-auto no-scrollbar">
    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mr-2">
      <Filter size={14} />
      Filtros:
    </div>
    <FilterDropdown label="Últimos 30 días" options={['Hoy', 'Ayer', 'Últimos 7 días', 'Últimos 30 días', 'Este mes']} />
    <FilterDropdown label="Todas las Provincias" options={['Pichincha', 'Guayas', 'Azuay', 'Manabí']} />
    <FilterDropdown label="Todas las Zonas" options={['Norte', 'Centro', 'Sur', 'Valles']} />
    <FilterDropdown label="Todas las Categorías" options={['Comida Rápida', 'Pizzas', 'Asiática', 'Mexicana']} />
    <FilterDropdown label="Todos los Tipos" options={['Cadena', 'Independiente', 'Dark Kitchen']} />
    <FilterDropdown label="Modo: Total" options={['Total', 'Feed', 'Home', 'Stories']} />
  </div>
);

const GeneralSection = () => {
  const [drillDown, setDrillDown] = useState<{ isOpen: boolean; title: string; data: any }>({ isOpen: false, title: '', data: null });

  const handleChartClick = (title: string, data: any) => {
    if (data && data.activePayload) {
      setDrillDown({ isOpen: true, title, data });
    }
  };

  return (
  <div className="space-y-4">
    <AnimatePresence>
      {drillDown.isOpen && (
        <DrillDownModal 
          isOpen={drillDown.isOpen} 
          onClose={() => setDrillDown({ ...drillDown, isOpen: false })} 
          title={drillDown.title} 
          data={drillDown.data} 
        />
      )}
    </AnimatePresence>

    <GlobalFilters />
    
    {/* Row 1: Executive KPIs */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatCard 
        index={0} title="GMV Total" value={northStarKpis.gmv} change="+6.2%" trend="up" 
        icon={DollarSign} color="from-green-500" subtext="Últimos 30 días"
        tooltip="Valor Bruto de Mercancía (GMV). Mide el volumen total de ventas a través de la plataforma antes de deducciones. Indica la cuota de mercado."
      />
      <StatCard 
        index={1} title="Ingresos Netos" value={northStarKpis.netRevenue} change="+4.1%" trend="up" 
        icon={Wallet} color="from-pink-500" subtext="Después de comisiones"
        tooltip="Revenue Real (Net Revenue). Son los ingresos que quedan para la empresa tras pagar a restaurantes y cubrir promociones. Es el dinero real disponible para operar."
      />
      <StatCard 
        index={2} title="Pedidos" value={northStarKpis.completedOrders} change="+8.9%" trend="up" 
        icon={ShoppingBag} color="from-blue-500" subtext="Completados"
        tooltip="Órdenes Completadas. Total de transacciones exitosas entregadas al cliente. Es la métrica base de actividad operativa."
      />
      <StatCard 
        index={3} title="Margen Contrib." value={northStarKpis.contributionMargin} change="+0.8%" trend="up" 
        icon={TrendingUp} color="from-orange-500" subtext="Post-delivery"
        tooltip="Margen de Contribución por Pedido. Ganancia unitaria después de costos variables (delivery, pagos). Indica si cada pedido genera dinero o pérdidas."
      />
      <StatCard 
        index={4} title="Restaurantes" value={marketplaceBalanceKpis.activeRestaurants} change="+2.1%" trend="up" 
        icon={Store} color="from-emerald-500" subtext="Activos" 
        tooltip="Restaurantes Activos. Número de locales que recibieron pedidos en el periodo. Mide la salud y diversidad de la oferta disponible." 
      />
      <GaugeCard 
        index={5} title="Market Health" value={northStarKpis.marketplaceHealthScore} subtext="Score 0-100" 
        tooltip="Índice compuesto de salud del mercado (0-100). Combina satisfacción, tiempos de entrega y tasa de cancelación para una visión holística."
      />
    </div>

    {/* Row 2: Secondary Metrics */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard title="Orders / User" value={northStarKpis.avgOrdersPerUser} change="+0.2" trend="up" icon={Users} color="from-indigo-500" subtext="Activos" tooltip="Frecuencia de Compra. Promedio de pedidos por usuario activo. Clave para medir la lealtad y el hábito de consumo." />
      <StatCard title="Cost / Order" value={northStarKpis.costPerOrder} change="-0.1" trend="up" icon={DollarSign} color="from-rose-500" subtext="Promedio" tooltip="Costo por Orden (CPO). Gasto operativo promedio necesario para procesar un pedido. Reducirlo mejora directamente la rentabilidad." />
      <StatCard title="View-to-Order" value={northStarKpis.viewToOrderRate} change="+0.5%" trend="up" icon={Zap} color="from-yellow-500" subtext="Conversión" tooltip="Tasa de Conversión (View-to-Order). Porcentaje de usuarios que ven un menú y compran. Mide la efectividad del catálogo y la experiencia de usuario." />
      <StatCard title="% Feed Orders" value={northStarKpis.ordersFromFeed} change="+2.1%" trend="up" icon={Smartphone} color="from-purple-500" subtext="Canal Feed" tooltip="Pedidos desde Feed Social. Porcentaje de ventas impulsadas por el descubrimiento de contenido. Valida la estrategia de 'food porn' y social commerce." />
      <StatCard title="LTV / CAC" value={northStarKpis.ltvCacRatio} change="+0.1" trend="up" icon={Activity} color="from-cyan-500" subtext="Ratio" tooltip="Eficiencia de Crecimiento (LTV/CAC). Cuántas veces supera el valor del cliente a su costo de adquisición. >3 es saludable, >5 es muy rentable." />
    </div>

    {/* Charts Section */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Chart 1: Demanda y Revenue */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="xl:col-span-2 bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Demanda y Revenue</h3>
            <p className="text-xs text-slate-400">Pedidos completados vs ingresos</p>
          </div>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ordersTrendData} onClick={(data) => handleChartClick('Demanda y Revenue', data)}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F4257B" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#F4257B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} dy={5} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area yAxisId="left" type="monotone" dataKey="revenue" name="Ingresos" stroke="#F4257B" strokeWidth={2} fill="url(#colorRev)" />
              <Area yAxisId="right" type="monotone" dataKey="orders" name="Pedidos" stroke="#3B82F6" strokeWidth={2} fill="url(#colorOrd)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Chart 2: Picos de Demanda */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Picos de Demanda</h3>
          <p className="text-xs text-slate-400">Ventas por hora</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesHourlyData} layout="vertical" onClick={(data) => handleChartClick('Picos de Demanda', data)}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1F2937" />
              <XAxis type="number" hide />
              <YAxis dataKey="hour" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                {salesHourlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index > 6 ? '#F4257B' : '#3B82F6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* New Charts Row */}
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      {/* Chart 3: Revenue Mix */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Revenue Mix</h3>
          <p className="text-xs text-slate-400">Fuentes de ingreso mensual</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueMixData} stackOffset="sign" onClick={(data) => handleChartClick('Revenue Mix', data)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="commission" name="Comisión" stackId="a" fill="#3B82F6" />
              <Bar dataKey="delivery" name="Delivery" stackId="a" fill="#10B981" />
              <Bar dataKey="ads" name="Ads" stackId="a" fill="#F59E0B" />
              <Bar dataKey="other" name="Otros" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Chart 4: GMV vs Contribution Margin */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">GMV vs Margen</h3>
          <p className="text-xs text-slate-400">Relación volumen y rentabilidad</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={gmvMarginData} onClick={(data) => handleChartClick('GMV vs Margen', data)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="gmv" name="GMV" fill="#334155" radius={[4, 4, 0, 0]} barSize={20} />
              <Line yAxisId="right" type="monotone" dataKey="margin" name="Margen" stroke="#F4257B" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Chart 5: Time-to-Checkout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Time-to-Checkout</h3>
          <p className="text-xs text-slate-400">Segundos promedio</p>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={checkoutTimeData} onClick={(data) => handleChartClick('Time-to-Checkout', data)}>
              <defs>
                <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="seconds" name="Segundos" stroke="#10B981" strokeWidth={2} fill="url(#colorTime)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* Top Lists Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Restaurantes Top por GMV</h3>
            <p className="text-xs text-slate-400">Últimos 30 días</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Restaurante</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Valor Bruto de Mercancía. Total de ventas generadas por este restaurante antes de comisiones.">GMV</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Órdenes Completadas. Total de entregas exitosas realizadas por este restaurante.">Pedidos</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Calificación Promedio. Puntuación media dada por los usuarios tras finalizar el pedido (1-5 estrellas).">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {topRestaurantsData.map((restaurant) => (
                <tr key={restaurant.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-white" title="Restaurante con mayor contribución al GMV.">{restaurant.name}</td>
                  <td className="py-3 px-4 text-sm font-bold text-white" title="Valor bruto transaccionado del restaurante.">${restaurant.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-slate-300" title="Pedidos completados del restaurante.">{restaurant.orders}</td>
                  <td className="py-3 px-4 text-sm text-slate-300" title="Calificación promedio de clientes.">{restaurant.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Categorías Top por Demanda</h3>
            <p className="text-xs text-slate-400">Últimos 30 días</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Volumen de Pedidos. Cantidad total de transacciones en esta categoría culinaria.">Pedidos</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Ventas Totales. Dinero generado por esta categoría. Indica las preferencias de gasto del usuario.">GMV</th>
                <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Tendencia de Crecimiento. Variación porcentual de ventas comparado con el periodo anterior.">Crecimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {topCategoriesData.map((category) => (
                <tr key={category.name} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-white" title="Categoría con mayor demanda.">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-300" title="Pedidos completados en la categoría.">{category.sales.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm font-bold text-white" title="Valor bruto transaccionado en la categoría.">${category.revenue.toLocaleString()}</td>
                  <td className={`py-3 px-4 text-sm font-semibold ${category.growth.startsWith('-') ? 'text-rose-300' : 'text-emerald-300'}`} title="Variación vs período anterior.">{category.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </div>
);
};

const GrowthSection = () => {
  const [drillDown, setDrillDown] = useState<{ isOpen: boolean; title: string; data: any }>({ isOpen: false, title: '', data: null });

  const handleChartClick = (title: string, data: any) => {
    if (data && (data.activePayload || data.payload)) { // Support for different chart types
      setDrillDown({ isOpen: true, title, data });
    }
  };

  return (
  <div className="space-y-4">
    <AnimatePresence>
      {drillDown.isOpen && (
        <DrillDownModal 
          isOpen={drillDown.isOpen} 
          onClose={() => setDrillDown({ ...drillDown, isOpen: false })} 
          title={drillDown.title} 
          data={drillDown.data} 
        />
      )}
    </AnimatePresence>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Nuevos Usuarios" value={growthKpis.newUsers} change="+5.4%" trend="up" icon={Users} color="from-blue-500" subtext="Últimos 30 días" tooltip="Adquisición de Usuarios. Total de registros completados. Mide la efectividad del marketing para atraer tráfico nuevo." />
      <StatCard title="Activación (7d)" value={growthKpis.activationRate} change="+1.1%" trend="up" icon={Zap} color="from-yellow-500" subtext="Interact + Cart" tooltip="Tasa de Activación Temprana. % de nuevos usuarios que realizan una acción de valor (cart/like) en su primera semana. Predice quién se quedará." />
      <StatCard title="CAC" value={growthKpis.cac} change="-0.3%" trend="up" icon={DollarSign} color="from-orange-500" subtext="Promedio ponderado" tooltip="Costo de Adquisición de Cliente. Inversión promedio en marketing necesaria para conseguir un nuevo cliente pagador. Debe ser menor al LTV." />
      <StatCard title="Payback CAC" value={growthKpis.payback} change="-0.1m" trend="up" icon={Calendar} color="from-emerald-500" subtext="Meses" tooltip="Periodo de Recuperación. Meses necesarios para que el margen generado por un cliente cubra lo que costó adquirirlo. Menor es mejor." />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="DAU" value={engagementKpis.dau} change="+3.2%" trend="up" icon={Activity} color="from-purple-500" subtext="Usuarios diarios" tooltip="Usuarios Activos Diarios. Personas únicas que abren la app cada día. El pulso diario de la relevancia de tu producto." />
      <StatCard title="MAU" value={engagementKpis.mau} change="+2.1%" trend="up" icon={Users} color="from-blue-500" subtext="Usuarios mensuales" tooltip="Usuarios Activos Mensuales. Personas únicas que abren la app en el mes. Mide el alcance total y tamaño de la audiencia." />
      <StatCard title="Stickiness" value={engagementKpis.stickiness} change="+0.8%" trend="up" icon={TrendingUp} color="from-pink-500" subtext="DAU/MAU" tooltip="Adherencia (DAU/MAU). Qué tan 'pegajosa' es la app. Un 28% significa que los usuarios entran casi 9 días al mes." />
      <StatCard title="Viral Coeff (K)" value={growthKpis.viralCoefficient} change="+0.1" trend="up" icon={Smartphone} color="from-indigo-500" subtext="Invitaciones" tooltip="Coeficiente Viral (K-Factor). Promedio de nuevos usuarios que cada usuario existente trae consigo. Si K>1, creces gratis y exponencialmente." />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="LTV Cohorte" value={growthKpis.ltv} change="+5%" trend="up" icon={Wallet} color="from-teal-500" subtext="Lifetime Value" tooltip="Valor de Vida (LTV). Estimación de ganancia neta que dejará un cliente promedio durante toda su relación con la app." />
      <StatCard title="LTV / CAC" value={growthKpis.ltvCacRatio} change="+0.2" trend="up" icon={TrendingUp} color="from-cyan-500" subtext="Ratio Saludable > 3" tooltip="Eficiencia de Crecimiento (LTV/CAC). Cuántas veces supera el valor del cliente a su costo de adquisición. >3 es saludable, >5 es muy rentable." />
      <StatCard title="Orders / User" value={growthKpis.avgOrdersPerUser} change="+0.1" trend="up" icon={ShoppingBag} color="from-rose-500" subtext="Frecuencia" tooltip="Frecuencia de Compra. Promedio de pedidos por usuario activo. Clave para medir la lealtad y el hábito de consumo." />
      <StatCard title="Repeat Rate" value={growthKpis.repeatRate} change="+1.4%" trend="up" icon={Heart} color="from-red-500" subtext="Recompra" tooltip="Tasa de Recompra. % de clientes que compran más de una vez. Es el indicador #1 de que tu producto gusta y retiene." />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Crecimiento de Usuarios</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={userGrowthData} onClick={(data) => handleChartClick('Crecimiento de Usuarios', data)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="new" name="Nuevos" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={20} />
              <Line type="monotone" dataKey="active" name="Activos" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Retención (Cohortes)</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userRetentionData} onClick={(data) => handleChartClick('Retención (Cohortes)', data)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="retention" name="Retención %" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* Existing charts preserved */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">LTV vs CAC</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ltvCacData} onClick={(data) => handleChartClick('LTV vs CAC', data)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="ltv" name="LTV" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="cac" name="CAC" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Funnel de Viralidad</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart onClick={(data) => handleChartClick('Funnel de Viralidad', data)}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel data={viralityFunnelData} dataKey="value" nameKey="stage" isAnimationActive>
                <LabelList position="right" fill="#E2E8F0" stroke="none" dataKey="stage" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Embudo de Compra</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart onClick={(data) => handleChartClick('Embudo de Compra', data)}>
              <Tooltip content={<CustomTooltip />} />
              <Funnel data={funnelData} dataKey="value" nameKey="stage" isAnimationActive>
                <LabelList position="right" fill="#E2E8F0" stroke="none" dataKey="stage" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <h3 className="text-lg font-semibold text-white mb-4">Crecimiento de Oferta</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={restaurantGrowthData} onClick={(data) => handleChartClick('Crecimiento de Oferta', data)}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="new" name="Nuevos" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
            <Line type="monotone" dataKey="active" name="Activos" stroke="#3B82F6" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </div>
);
};

const SocialSection = () => (
  <div className="space-y-4">
    {/* Row 1: Primary Social KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Posts Creados" value={socialKpis.posts} change="+6.1%" trend="up" icon={Smartphone} color="from-purple-500" subtext="Contenido generado" tooltip="Generación de Contenido. Cantidad de fotos/videos subidos. Indica si los usuarios y restaurantes están creando valor para la plataforma." />
      <StatCard title="Conversión Social→Pedido" value={socialKpis.socialOrderRate} change="+0.6%" trend="up" icon={ShoppingBag} color="from-emerald-500" subtext="Pedidos atribuidos" tooltip="Atribución Social. % de pedidos generados directamente tras ver contenido. Demuestra el ROI del componente social." />
      <StatCard title="Avg Session Time" value={socialKpis.avgSessionTime} change="+12s" trend="up" icon={Clock} color="from-pink-500" subtext="Feed & Stories" tooltip="Tiempo de Sesión. Duración promedio de una sesión explorando contenido. Más tiempo = mayor 'Share of Mind'." />
      <StatCard title="Swipes per Session" value={socialKpis.swipesPerSession} change="+2" trend="up" icon={Activity} color="from-blue-500" subtext="Interacción Feed" tooltip="Intensidad de Uso. Número promedio de desplazamientos (swipes) por sesión. Mide qué tan adictivo es el feed." />
    </div>

    {/* Row 2: Secondary Engagement Metrics */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Stories per Session" value={socialKpis.storiesPerSession} change="+1.5" trend="up" icon={Zap} color="from-orange-500" subtext="Consumo Stories" tooltip="Consumo de Stories. Promedio de historias vistas por sesión. Indica el interés en contenido efímero." />
      <StatCard title="Scroll Depth" value={socialKpis.scrollDepth} change="+5%" trend="up" icon={ArrowDownRight} color="from-cyan-500" subtext="Profundidad Feed" tooltip="Profundidad de Scroll. % del feed que los usuarios recorren. Un valor alto indica contenido relevante al final." />
      <StatCard title="View Completion" value={socialKpis.viewCompletionRate} change="+3%" trend="up" icon={Check} color="from-indigo-500" subtext="Video completo" tooltip="Tasa de Completitud. % de videos vistos hasta el final. La mejor métrica de calidad de contenido." />
      <StatCard title="View-to-Order" value={socialKpis.viewToOrderRate} change="+0.2%" trend="up" icon={DollarSign} color="from-green-500" subtext="Conversión Directa" tooltip="Conversión por Vista. Probabilidad de que una vista se convierta en pedido inmediato." />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Social</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={socialEngagementData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="posts" name="Posts" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="interactions" name="Interacciones" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="socialOrders" name="Pedidos Social" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Embudo Social</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip content={<CustomTooltip />} />
              <Funnel data={socialConversionData} dataKey="value" nameKey="name" isAnimationActive>
                <LabelList position="right" fill="#E2E8F0" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* New Table: Top Content Creators */}
    <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Top Creadores de Contenido</h3>
          <p className="text-xs text-slate-400">Restaurantes con mayor impacto social</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Restaurante</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Vistas Totales. Suma de impresiones en feed y stories.">Views</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Pedidos Atribuidos. Órdenes generadas tras interacción social.">Orders</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Tasa de Conversión. % de Vistas que terminan en Compra.">Conversion</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Ingresos Generados. Revenue atribuido a social.">Revenue</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="% desde Stories. Porcentaje de ventas que vienen específicamente de Stories.">% Stories</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {topContentCreatorsData.map((creator) => (
              <tr key={creator.name} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-sm font-semibold text-white">{creator.name}</td>
                <td className="py-3 px-4 text-sm text-slate-300">{creator.views.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-slate-300">{creator.orders}</td>
                <td className="py-3 px-4 text-sm text-emerald-300 font-medium">{creator.conversion}</td>
                <td className="py-3 px-4 text-sm font-bold text-white">${creator.revenue.toLocaleString()}</td>
                <td className="py-3 px-4 text-sm text-purple-300">{creator.storiesPct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

const OperationsSection = () => (
  <div className="space-y-4">
    {/* Row 1: Primary Operations KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Tiempo Entrega" value={operationsKpis.avgDeliveryTime} trend="down" icon={Bike} color="from-blue-500" subtext="Promedio" tooltip="Tiempo Total de Entrega. Minutos desde que se pide hasta que se recibe. Es el factor más crítico para la satisfacción del cliente." />
      <StatCard title="On-Time" value={operationsKpis.onTimeRate} trend="up" icon={Clock} color="from-green-500" subtext="SLA cumplido" tooltip="Cumplimiento de Promesa (SLA). % de pedidos entregados dentro del tiempo estimado mostrado al cliente. Genera confianza." />
      <StatCard title="Asignación Repartidor" value={operationsKpis.assignmentTime} trend="down" icon={Zap} color="from-yellow-500" subtext="Promedio" tooltip="Velocidad de Asignación. Tiempo para encontrar repartidor. Si es alto, faltan repartidores; si es bajo, sobran (costo ineficiente)." />
      <StatCard title="Utilización Repartidor" value={operationsKpis.courierUtilization} trend="up" icon={Activity} color="from-purple-500" subtext="Tiempo activo" tooltip="Eficiencia de Flota. % del tiempo que los repartidores están ocupados con pedidos. Clave para la rentabilidad logística." />
    </div>

    {/* Row 2: Secondary Efficiency Metrics */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Cost per Order" value={operationsKpis.costPerOrder} change="-0.5%" trend="down" icon={DollarSign} color="from-rose-500" subtext="Costo Operativo" tooltip="Costo Unitario (CPO). Gasto promedio para procesar un pedido (logística, soporte, pagos). Reducirlo mejora el margen." />
      <StatCard title="Orders / km²" value={operationsKpis.ordersPerKm} change="+1.2" trend="up" icon={MapPin} color="from-cyan-500" subtext="Densidad Demanda" tooltip="Densidad de Pedidos. Volumen de órdenes por kilómetro cuadrado. Mayor densidad = rutas más cortas y eficientes." />
      <StatCard title="Couriers / km²" value={operationsKpis.couriersPerKm} change="+0.3" trend="up" icon={Users} color="from-orange-500" subtext="Densidad Oferta" tooltip="Densidad de Repartidores. Disponibilidad de flota por zona. Debe equilibrarse con la densidad de pedidos." />
      {/* Placeholder or another metric can go here, using Cancelled Orders as placeholder or leaving 3 */}
      <StatCard title="Motivos Cancelación" value="Top: Demora" trend="neutral" icon={UserX} color="from-red-500" subtext="Causa Principal" tooltip="Principal razón de pérdida de ventas. Atacar esto recupera ingresos directamente." />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Tiempos por Etapa</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveryStageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1F2937" />
              <XAxis type="number" hide />
              <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10 }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="minutes" name="Minutos" fill="#3B82F6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* New Waterfall Chart: Cost per Order */}
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Waterfall Cost per Order</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costPerOrderWaterfallData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              {/* Using a simple Bar chart to represent waterfall components side-by-side or stacked if preferred. 
                  For a true waterfall, we usually use transparent bars for offsets. 
                  Here, we show the breakdown components directly as requested. */}
              <Bar dataKey="value" name="Costo ($)" radius={[4, 4, 0, 0]}>
                {costPerOrderWaterfallData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <h3 className="text-lg font-semibold text-white mb-4">Motivos de Cancelación</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={cancellationReasonsData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                {cancellationReasonsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#EF4444', '#F59E0B', '#3B82F6', '#10B981'][index % 4]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#E2E8F0' }} />
            </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  </div>
);

const QualitySection = () => (
  <div className="space-y-4">
    {/* Row 1: Primary Quality KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Precisión Pedido" value={qualityKpis.orderAccuracy} change="+0.3%" trend="up" icon={Star} color="from-yellow-500" subtext="Pedidos sin error" tooltip="Exactitud (Order Accuracy). % de pedidos entregados perfectos (sin errores ni faltantes). Reduce reembolsos y pérdida de clientes." />
      <StatCard title="Reclamos" value={qualityKpis.complaintRate} change="-0.2%" trend="up" icon={UserX} color="from-red-500" subtext="Por 100 pedidos" tooltip="Tasa de Contacto (Contact Rate). % de pedidos que generan un ticket de soporte. Indica fricción en la experiencia del cliente." />
      <StatCard title="Reembolsos" value={qualityKpis.refundsRate} change="-0.1%" trend="up" icon={Wallet} color="from-green-500" subtext="Pedidos con ajuste" tooltip="Tasa de Devoluciones. % de ingresos devueltos por fallos. Afecta directamente al margen y alerta sobre problemas operativos graves." />
      <StatCard title="NPS Cliente" value={qualityKpis.nps} change="+2" trend="up" icon={Heart} color="from-pink-500" subtext="Últimos 30 días" tooltip="Net Promoter Score. Índice de lealtad (-100 a 100). Mide la probabilidad de recomendación boca a boca." />
    </div>

    {/* Row 2: Risk & Support Metrics */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Refund Impact" value={qualityKpis.refundImpact} change="+0.1%" trend="down" icon={DollarSign} color="from-rose-500" subtext="Impacto en Margen" tooltip="Erosión de Margen. Porcentaje directo de pérdida de beneficio debido a reembolsos y compensaciones." />
      <StatCard title="Reliability Score" value={qualityKpis.reliabilityScore} change="+0.2" trend="up" icon={Shield} color="from-cyan-500" subtext="Ranking General" tooltip="Índice de Confiabilidad. Puntuación agregada de la flota y restaurantes basada en cumplimiento y calidad." />
      <StatCard title="Fraud Flags" value={qualityKpis.fraudFlags} change="-2" trend="up" icon={Activity} color="from-orange-500" subtext="Alertas Activas" tooltip="Alertas de Fraude. Usuarios o transacciones sospechosas detectadas (abuso de cupones, multicuentas, etc)." />
      <StatCard title="Tickets Soporte" value={supportKpis.tickets} change="+4.2%" trend="up" icon={Clock} color="from-blue-500" subtext="Volumen Semanal" tooltip="Carga de Soporte. Número total de tickets generados. Ayuda a dimensionar el equipo de atención al cliente." />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Incidentes de Calidad</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={qualityIssuesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Casos" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Soporte Operativo</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={supportVolumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="tickets" name="Tickets" stroke="#EF4444" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="resolved" name="Resueltos" stroke="#10B981" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>

    {/* New Table: Restaurant Reliability Ranking */}
    <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Ranking de Confiabilidad (Restaurantes)</h3>
          <p className="text-xs text-slate-400">Top partners por calidad de servicio</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Restaurante</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Puntuación de Confiabilidad (0-5). Basada en tiempo, errores y cancelaciones.">Score</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Tasa de Incidentes. % de pedidos con algún problema reportado.">Issue Rate</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]" title="Tasa de Reembolsos. % de ingresos devueltos.">Refund Rate</th>
              <th className="text-left py-3 px-4 text-[11px] font-semibold text-slate-400 uppercase tracking-[0.2em]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {restaurantReliabilityData.map((restaurant) => (
              <tr key={restaurant.name} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-sm font-semibold text-white">{restaurant.name}</td>
                <td className="py-3 px-4 text-sm font-bold text-white">{restaurant.score}</td>
                <td className="py-3 px-4 text-sm text-slate-300">{restaurant.issueRate}</td>
                <td className="py-3 px-4 text-sm text-slate-300">{restaurant.refundRate}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    restaurant.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    restaurant.status === 'Good' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {restaurant.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  </div>
);

const FinanceSection = () => (
  <div className="space-y-4">
    {/* Row 1: Primary Finance KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Take Rate (Nominal)" value={financeKpis.takeRate} change="+0.3%" trend="up" icon={CreditCard} color="from-blue-500" subtext={`Efectivo: ${financeKpis.takeRateEffective}`} tooltip="Take Rate Nominal vs Efectivo. El nominal es la comisión pactada; el efectivo es lo que realmente queda tras descuentos y promos." />
      <StatCard title="Costo Promos" value={financeKpis.promoCost} change="+4.1%" trend="up" icon={Zap} color="from-pink-500" subtext="Últimos 30 días" tooltip="Inversión Promocional. Gasto en cupones y descuentos. Debe ser estratégico para adquirir/retener, no estructural." />
      <StatCard title="Costo Logístico" value={financeKpis.logisticsCost} change="-1.2%" trend="up" icon={Bike} color="from-orange-500" subtext="Delivery y soporte" tooltip="Costo Operativo de Entrega. Gasto total en delivery y soporte por pedido. Vital para controlar la rentabilidad unitaria." />
      <StatCard title="Margen Neto" value={financeKpis.netMargin} change="+0.4%" trend="up" icon={TrendingUp} color="from-emerald-500" subtext="Últimos 30 días" tooltip="Rentabilidad Final. Ganancia neta porcentual después de todos los costos. El indicador final de éxito financiero." />
    </div>

    {/* Row 2: Financial Health */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="EBITDA Snapshot" value={financeKpis.ebitda} change="+12%" trend="up" icon={Activity} color="from-green-500" subtext="Operativo" tooltip="EBITDA. Beneficio antes de intereses, impuestos, depreciaciones y amortizaciones. Mide la capacidad de generar caja operativa." />
      <StatCard title="Burn Rate" value={financeKpis.burnRate} change="-5%" trend="down" icon={DollarSign} color="from-red-500" subtext="Consumo mensual" tooltip="Burn Rate. Velocidad a la que la empresa gasta su capital disponible. Es crucial para calcular el Runway." />
      <StatCard title="Runway" value={financeKpis.runway} change="+2m" trend="up" icon={Clock} color="from-purple-500" subtext="Meses de vida" tooltip="Runway. Tiempo estimado que la empresa puede operar antes de quedarse sin efectivo, basado en el Burn Rate actual." />
      <StatCard title="ARPU" value={financeKpis.arpu} change="+1.2%" trend="up" icon={Users} color="from-cyan-500" subtext="Por Usuario" tooltip="Ingreso Promedio por Usuario (ARPU). Cuánto valor genera cada usuario activo. Clave para evaluar la monetización." />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Ingresos vs Costos</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name="Revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="cost" name="Costo" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={18} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <h3 className="text-lg font-semibold text-white mb-4">Métodos de Pago</h3>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={paymentMethodsData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={6} dataKey="value">
                {paymentMethodsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index % 4]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '10px', color: '#E2E8F0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  </div>
);

const GeoSection = () => {
  const [metric, setMetric] = useState('gmv'); // 'gmv', 'margin', 'density'

  const getMetricLabel = (m: string) => {
    switch(m) {
      case 'gmv': return 'GMV Total ($)';
      case 'margin': return 'Margen Contrib. (%)';
      case 'density': return 'Densidad (Ordenes/km²)';
      default: return '';
    }
  };

  const getMetricColor = (val: number, type: string) => {
    // Simple color scale logic
    if (type === 'gmv') return val > 200000 ? '#10B981' : val > 100000 ? '#F59E0B' : '#EF4444';
    if (type === 'margin') return val > 20 ? '#10B981' : val > 15 ? '#F59E0B' : '#EF4444';
    if (type === 'density') return val > 60 ? '#3B82F6' : val > 40 ? '#8B5CF6' : '#64748B';
    return '#CBD5E1';
  };

  return (
    <div className="space-y-4">
      {/* Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ciudades Activas" value={geoKpis.activeCities} change="+1" trend="up" icon={MapPin} color="from-blue-500" subtext="Cobertura Nacional" tooltip="Ciudades Activas. Número de mercados donde operamos actualmente." />
        <StatCard title="Market Penetration" value={geoKpis.marketPenetration} change="+1.5%" trend="up" icon={Users} color="from-purple-500" subtext="Hogares alcanzados" tooltip="Tasa de Penetración. % del mercado potencial total que ha realizado al menos un pedido." />
        <StatCard title="Top Profitability" value={geoKpis.topZoneProfitability} trend="up" icon={TrendingUp} color="from-green-500" subtext="Zona más rentable" tooltip="Zona Más Rentable. Región con el mejor margen de contribución. Modelo a replicar." />
        <StatCard title="Expansión (Proyección)" value={geoKpis.expansionProjection} trend="neutral" icon={ArrowUpRight} color="from-orange-500" subtext="Plan 2025" tooltip="Proyección de Expansión. Nuevos mercados planificados para el próximo año fiscal." />
      </div>

      <div className="bg-slate-950/70 p-5 rounded-[22px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Mapa de Calor Inteligente</h3>
            <p className="text-xs text-slate-400">Distribución geográfica por {getMetricLabel(metric)}</p>
          </div>
          <div className="flex gap-2">
            {['gmv', 'margin', 'density'].map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  metric === m 
                    ? 'bg-white text-slate-900' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {m === 'gmv' ? 'GMV' : m === 'margin' ? 'Margen' : 'Densidad'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[400px] w-full relative">
          <EcuadorMap data={geoDistributionData} metric={metric} />
        </div>
        
        <div className="flex justify-center gap-6 mt-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
             <span className="text-xs text-slate-400">Alto Desempeño</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-amber-500"></div>
             <span className="text-xs text-slate-400">Promedio</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <span className="text-xs text-slate-400">Atención</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export function Dashboard({ initialTab = 'overview' }: { initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        >
          {activeTab === 'overview' && <GeneralSection />}
          {activeTab === 'growth' && <GrowthSection />}
          {activeTab === 'social' && <SocialSection />}
          {activeTab === 'operations' && <OperationsSection />}
          {activeTab === 'quality' && <QualitySection />}
          {activeTab === 'finance' && <FinanceSection />}
          {activeTab === 'geo' && <GeoSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}