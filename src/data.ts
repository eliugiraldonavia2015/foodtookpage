import { User, Restaurant, Dish, RestaurantRequest } from './types';

export const usersData: (User | Restaurant)[] = [
  { 
    id: 'u1', 
    name: 'Restaurante El Buen Sabor', 
    email: 'contacto@buensabor.com', 
    status: 'active', 
    role: 'restaurant', 
    joinedDate: '2023-01-15', 
    phone: '+593 99 123 4567', 
    address: 'Av. Principal 123', 
    country: 'Ecuador', 
    province: 'Azuay', 
    ruc: '0101010101001',
    // Restaurant Metrics
    gmv: 12500,
    marginContribution: 18,
    conversionRate: 2.5,
    ordersFromStories: 15,
    adsSpend: 450,
    dependencyIndex: 45
  },
  { 
    id: 'u2', 
    name: 'Burger King Mock', 
    email: 'manager@bkmock.com', 
    status: 'active', 
    role: 'restaurant', 
    joinedDate: '2023-02-20', 
    phone: '+593 99 987 6543', 
    address: 'Mall del Sol', 
    country: 'Ecuador', 
    province: 'Guayas', 
    ruc: '0909090909001',
    // Restaurant Metrics
    gmv: 25400,
    marginContribution: 22,
    conversionRate: 3.8,
    ordersFromStories: 35,
    adsSpend: 1200,
    dependencyIndex: 20
  },
  { 
    id: 'u3', 
    name: 'Pizza Hut Mock', 
    email: 'admin@pizzahut.com', 
    status: 'inactive', 
    role: 'restaurant', 
    joinedDate: '2023-03-10', 
    phone: '+593 98 765 4321', 
    address: 'Centro Comercial', 
    country: 'Colombia', 
    province: 'Cundinamarca', 
    ruc: '111111111',
    // Restaurant Metrics
    gmv: 21500,
    marginContribution: 15,
    conversionRate: 2.9,
    ordersFromStories: 25,
    adsSpend: 800,
    dependencyIndex: 30
  },
  { 
    id: 'u4', 
    name: 'Sushi Express', 
    email: 'info@sushiexpress.com', 
    status: 'banned', 
    role: 'restaurant', 
    joinedDate: '2023-05-05', 
    phone: '+593 97 111 2222', 
    address: 'Plaza Lagos', 
    country: 'Colombia', 
    province: 'Antioquia', 
    ruc: '222222222',
    // Restaurant Metrics
    gmv: 18400,
    marginContribution: 25,
    conversionRate: 4.2,
    ordersFromStories: 50,
    adsSpend: 600,
    dependencyIndex: 15
  },
  // Sample Users (Staff/Admin/Regular) - adding metrics for them
  {
    id: 'u5',
    name: 'Juan Pérez',
    email: 'juan@user.com',
    status: 'active',
    role: 'staff', // Assuming 'staff' can act as a regular user for this context or just adding dummy user data
    staffRole: 'Ventas',
    joinedDate: '2023-06-12',
    country: 'Ecuador',
    province: 'Pichincha',
    // User Metrics
    ltv: 450,
    frequency: 4.5,
    engagementScore: 85,
    riskFlag: 'low'
  },
  {
    id: 'u6',
    name: 'Maria Garcia',
    email: 'maria@user.com',
    status: 'active',
    role: 'staff',
    staffRole: 'Servicio al cliente',
    joinedDate: '2023-07-20',
    country: 'Ecuador',
    province: 'Guayas',
    // User Metrics
    ltv: 120,
    frequency: 1.2,
    engagementScore: 40,
    riskFlag: 'medium'
  },
  {
    id: 'u7',
    name: 'Carlos Lopez',
    email: 'carlos@user.com',
    status: 'inactive',
    role: 'staff',
    staffRole: 'Legal',
    joinedDate: '2023-08-05',
    country: 'Colombia',
    province: 'Bogota',
    // User Metrics
    ltv: 50,
    frequency: 0.5,
    engagementScore: 20,
    riskFlag: 'high'
  }
];

export const dishesData: Dish[] = [
  { 
    id: 'd1', 
    name: 'Hamburguesa Clásica', 
    price: 5.99, 
    category: 'Hamburguesas', 
    restaurantId: 'u2', 
    restaurantName: 'Burger King Mock',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80',
    description: 'Carne de res a la parrilla con lechuga, tomate y queso.',
    status: 'active'
  },
  { 
    id: 'd2', 
    name: 'Pizza Pepperoni', 
    price: 12.50, 
    category: 'Pizza', 
    restaurantId: 'u3', 
    restaurantName: 'Pizza Hut Mock',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=100&q=80',
    description: 'Masa tradicional con salsa de tomate, queso mozzarella y pepperoni.',
    status: 'inactive'
  },
  { 
    id: 'd3', 
    name: 'Encebollado Mixto', 
    price: 4.50, 
    category: 'Sopas', 
    restaurantId: 'u1', 
    restaurantName: 'Restaurante El Buen Sabor',
    image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=100&q=80',
    description: 'Sopa de pescado con yuca, cebolla y especias.',
    status: 'active'
  },
  { 
    id: 'd4', 
    name: 'California Roll', 
    price: 8.99, 
    category: 'Sushi', 
    restaurantId: 'u4', 
    restaurantName: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=100&q=80',
    description: 'Rollo de sushi con cangrejo, aguacate y pepino.',
    status: 'active'
  },
  // Pending Dishes
  {
    id: 'd6',
    name: 'Tacos al Pastor',
    price: 3.50,
    category: 'Mexicana',
    restaurantId: 'u1',
    restaurantName: 'Restaurante El Buen Sabor',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=100&q=80',
    description: 'Tres tacos de cerdo marinado con piña y cilantro.',
    status: 'pending',
    submittedAt: '2023-10-25T14:30:00Z'
  },
  {
    id: 'd7',
    name: 'Lasaña de Carne',
    price: 9.00,
    category: 'Pastas',
    restaurantId: 'u3',
    restaurantName: 'Pizza Hut Mock',
    image: 'https://images.unsplash.com/photo-1574868291534-18430db83fca?auto=format&fit=crop&w=100&q=80',
    description: 'Capas de pasta con carne molida, salsa bechamel y queso.',
    status: 'pending',
    submittedAt: '2023-10-26T09:15:00Z'
  }
];

export const restaurantRequestsData: RestaurantRequest[] = [
  {
    id: 'req1',
    restaurantName: 'Tacos & Tequila',
    ownerName: 'Carlos Ruiz',
    email: 'carlos@tacos.com',
    phone: '+593 99 555 6666',
    address: 'Calle Larga 456',
    country: 'Ecuador',
    province: 'Azuay',
    submittedAt: '2023-10-24T11:00:00Z',
    status: 'pending'
  },
  {
    id: 'req2',
    restaurantName: 'Wok & Roll',
    ownerName: 'Ana Lee',
    email: 'ana@woknroll.com',
    phone: '+593 98 444 3333',
    address: 'Av. Las Américas 789',
    country: 'Ecuador',
    province: 'Guayas',
    submittedAt: '2023-10-23T16:45:00Z',
    status: 'second_attempt'
  },
  {
    id: 'req3',
    restaurantName: 'Arepas de la Abuela',
    ownerName: 'Maria Gonzalez',
    email: 'maria@arepas.co',
    phone: '+57 300 123 4567',
    address: 'Cra 7 #123-45',
    country: 'Colombia',
    province: 'Cundinamarca',
    submittedAt: '2023-10-27T09:30:00Z',
    status: 'pending'
  },
  {
    id: 'req4',
    restaurantName: 'Bandeja Paisa Express',
    ownerName: 'Juan Perez',
    email: 'juan@paisa.co',
    phone: '+57 310 987 6543',
    address: 'Cl 10 #20-30',
    country: 'Colombia',
    province: 'Antioquia',
    submittedAt: '2023-10-27T14:15:00Z',
    status: 'rejected'
  }
];

// --- DASHBOARD METRICS DATA ---

// 1. User Metrics (Demand)
export const userGrowthData = [
  { name: 'Ene', total: 1200, new: 150, active: 850 },
  { name: 'Feb', total: 1450, new: 250, active: 1100 },
  { name: 'Mar', total: 1800, new: 350, active: 1400 },
  { name: 'Abr', total: 2200, new: 400, active: 1750 },
  { name: 'May', total: 2700, new: 500, active: 2100 },
  { name: 'Jun', total: 3300, new: 600, active: 2600 },
];

export const userRetentionData = [
  { month: 'Ene', retention: 100 },
  { month: 'Feb', retention: 85 },
  { month: 'Mar', retention: 75 },
  { month: 'Abr', retention: 68 },
  { month: 'May', retention: 64 },
  { month: 'Jun', retention: 60 },
];

// 2. Restaurant Metrics (Supply)
export const restaurantGrowthData = [
  { name: 'Ene', total: 45, new: 5, active: 40 },
  { name: 'Feb', total: 52, new: 7, active: 48 },
  { name: 'Mar', total: 60, new: 8, active: 55 },
  { name: 'Abr', total: 72, new: 12, active: 65 },
  { name: 'May', total: 85, new: 13, active: 78 },
  { name: 'Jun', total: 98, new: 13, active: 90 },
];

export const geoKpis = {
  activeCities: '8',
  marketPenetration: '12.4%', // New Metric
  topZoneProfitability: '22% (Pichincha)', // New Metric
  expansionProjection: '3 Ciudades (2025)', // New Metric
  avgTicketByZone: '$24.50'
};

export const geoDistributionData = [
  { name: 'Pichincha', x: 40, y: 70, users: 4500, restaurants: 120, orders: 15400, gmv: 345000, margin: 22, density: 85, penetration: 15 },
  { name: 'Guayas', x: 30, y: 50, users: 3800, restaurants: 95, orders: 12300, gmv: 280000, margin: 18, density: 75, penetration: 12 },
  { name: 'Azuay', x: 45, y: 30, users: 1200, restaurants: 45, orders: 4500, gmv: 110000, margin: 24, density: 45, penetration: 8 },
  { name: 'Manabí', x: 20, y: 60, users: 800, restaurants: 30, orders: 2800, gmv: 65000, margin: 15, density: 30, penetration: 5 },
  { name: 'Loja', x: 42, y: 15, users: 400, restaurants: 15, orders: 1200, gmv: 28000, margin: 20, density: 25, penetration: 4 },
];

// 3. Orders & Sales
export const ordersTrendData = [
  { name: 'Lun', orders: 420, revenue: 8400, avgTicket: 20 },
  { name: 'Mar', orders: 380, revenue: 7600, avgTicket: 20 },
  { name: 'Mie', orders: 450, revenue: 9000, avgTicket: 20 },
  { name: 'Jue', orders: 520, revenue: 10400, avgTicket: 20 },
  { name: 'Vie', orders: 850, revenue: 18700, avgTicket: 22 },
  { name: 'Sab', orders: 980, revenue: 21560, avgTicket: 22 },
  { name: 'Dom', orders: 900, revenue: 19800, avgTicket: 22 },
];

export const salesHourlyData = [
  { hour: '10am', sales: 1200 },
  { hour: '11am', sales: 2500 },
  { hour: '12pm', sales: 8500 },
  { hour: '1pm', sales: 12400 },
  { hour: '2pm', sales: 9800 },
  { hour: '3pm', sales: 4500 },
  { hour: '6pm', sales: 6500 },
  { hour: '7pm', sales: 11200 },
  { hour: '8pm', sales: 14500 },
  { hour: '9pm', sales: 10500 },
];

// 4. Conversion Funnel
export const funnelData = [
  { stage: 'Visitas App', value: 15000, fill: '#8884d8' },
  { stage: 'Ver Menú', value: 12000, fill: '#83a6ed' },
  { stage: 'Agregar Carrito', value: 8000, fill: '#8dd1e1' },
  { stage: 'Checkout', value: 6500, fill: '#82ca9d' },
  { stage: 'Pedido Completado', value: 5800, fill: '#a4de6c' },
];

// 5. Cancellations
export const cancellationReasonsData = [
  { name: 'Demora Restaurante', value: 45 },
  { name: 'No hay Repartidor', value: 25 },
  { name: 'Cliente Canceló', value: 20 },
  { name: 'Producto Agotado', value: 10 },
];

// 6. Delivery
export const deliveryMetrics = {
  avgTime: '28 min',
  onTimeRate: '94%',
  avgCost: '$1.50',
  satisfaction: 4.8
};

// 7. Financials
export const financialData = [
  { name: 'Ene', revenue: 45000, cost: 30000, profit: 15000 },
  { name: 'Feb', revenue: 52000, cost: 34000, profit: 18000 },
  { name: 'Mar', revenue: 61000, cost: 38000, profit: 23000 },
  { name: 'Abr', revenue: 58000, cost: 37000, profit: 21000 },
  { name: 'May', revenue: 75000, cost: 45000, profit: 30000 },
  { name: 'Jun', revenue: 84000, cost: 50000, profit: 34000 },
];

export const kpiData = {
  users: { total: '125.4K', growth: '+12%', active: '45.2K' },
  restaurants: { total: '1,240', growth: '+5%', active: '1,100' },
  orders: { total: '85.4K', growth: '+24%', avgTicket: '$22.50' },
  revenue: { total: '$1.2M', growth: '+18%', margin: '22%' },
  cac: '$4.50',
  ltv: '$125.00',
  churn: '2.4%',
  nps: 72
};

export const northStarKpis = {
  gmv: '$3.8M',
  netRevenue: '$820K',
  completedOrders: '148.2K',
  contributionMargin: '18.4%',
  marketplaceHealthScore: 85,
  avgOrdersPerUser: '3.5',
  costPerOrder: '$4.20',
  viewToOrderRate: '12.8%',
  ordersFromFeed: '42%',
  ltvCacRatio: '3.8'
};

export const marketplaceBalanceKpis = {
  demandSupplyRatio: '1.6',
  coverage: '92%',
  menuAvailability: '88%',
  activeRestaurants: '1,120'
};

export const growthKpis = {
  newUsers: '24.5K',
  activationRate: '38%',
  cac: '$4.10',
  payback: '1.4m',
  ltv: '$125.00', // New Metric
  ltvCacRatio: '3.8', // New Metric
  avgOrdersPerUser: '3.5', // New Metric
  repeatRate: '41%', // New Metric
  viralCoefficient: '1.2' // New Metric
};

export const engagementKpis = {
  dau: '52.1K',
  mau: '186K',
  stickiness: '28%',
  repeatRate: '41%'
};

export const socialKpis = {
  // socialActive: '36.8K', // Removed
  posts: '12.4K',
  interactions: '148K',
  socialOrderRate: '9.6%',
  avgSessionTime: '4m 12s', // New Metric
  swipesPerSession: '18', // New Metric
  storiesPerSession: '12', // New Metric
  scrollDepth: '72%', // New Metric
  viewCompletionRate: '65%', // New Metric
  viewToOrderRate: '2.4%' // New Metric
};

export const topContentCreatorsData = [
  { name: 'Burger King Mock', views: 154000, orders: 1540, conversion: '1.0%', revenue: 25400, storiesPct: '45%' },
  { name: 'Sushi Express', views: 98000, orders: 980, conversion: '1.0%', revenue: 18400, storiesPct: '60%' },
  { name: 'Pizza Hut Mock', views: 125000, orders: 1250, conversion: '1.0%', revenue: 21500, storiesPct: '30%' },
  { name: 'El Buen Sabor', views: 85000, orders: 850, conversion: '1.0%', revenue: 12500, storiesPct: '25%' },
  { name: 'Wok & Roll', views: 72000, orders: 720, conversion: '1.0%', revenue: 10800, storiesPct: '40%' },
];

export const operationsKpis = {
  avgDeliveryTime: '27 min',
  onTimeRate: '93%',
  assignmentTime: '3.2 min',
  courierUtilization: '72%',
  costPerOrder: '$4.20', // New Metric
  ordersPerKm: '12.5', // New Metric (Orders per km²)
  couriersPerKm: '4.8' // New Metric (Couriers per km²)
};

export const costPerOrderWaterfallData = [
  { name: 'Base', value: 4.20, fill: 'transparent' }, // Placeholder for total if needed, or breakdown
  { name: 'Logística', value: 2.50, fill: '#3B82F6' },
  { name: 'Payment', value: 0.80, fill: '#10B981' },
  { name: 'Soporte', value: 0.50, fill: '#F59E0B' },
  { name: 'Promos', value: 0.30, fill: '#8B5CF6' },
  { name: 'Refund', value: 0.10, fill: '#EF4444' },
];

export const qualityKpis = {
  orderAccuracy: '96.2%',
  complaintRate: '1.8%',
  refundsRate: '0.9%',
  nps: '61',
  refundImpact: '-0.4%', // New Metric
  reliabilityScore: '4.8/5', // New Metric
  fraudFlags: '12' // New Metric (Active Alerts)
};

export const restaurantReliabilityData = [
  { name: 'Sushi Express', score: 4.9, issueRate: '0.2%', refundRate: '0.1%', status: 'Excellent' },
  { name: 'Burger King Mock', score: 4.8, issueRate: '0.5%', refundRate: '0.3%', status: 'Good' },
  { name: 'Wok & Roll', score: 4.7, issueRate: '0.8%', refundRate: '0.4%', status: 'Good' },
  { name: 'Pizza Hut Mock', score: 4.6, issueRate: '1.2%', refundRate: '0.6%', status: 'Warning' },
  { name: 'El Buen Sabor', score: 4.5, issueRate: '1.5%', refundRate: '0.8%', status: 'Warning' },
];

export const supportKpis = {
  tickets: '3.2K',
  avgResolution: '2.6 h',
  firstResponse: '12 min',
  csat: '4.6'
};

export const financeKpis = {
  takeRate: '18.2%',
  takeRateEffective: '14.1%', // New Metric (Post-promo)
  promoCost: '$210K',
  logisticsCost: '$420K',
  netMargin: '9.4%',
  ebitda: '$145K', // New Metric
  burnRate: '$55K/mo', // New Metric
  runway: '18 months', // New Metric
  arpu: '$15.40' // New Metric
};

export const socialEngagementData = [
  { name: 'Lun', posts: 1200, interactions: 15000, socialOrders: 420 },
  { name: 'Mar', posts: 1350, interactions: 17500, socialOrders: 480 },
  { name: 'Mie', posts: 1480, interactions: 19200, socialOrders: 520 },
  { name: 'Jue', posts: 1700, interactions: 21000, socialOrders: 610 },
  { name: 'Vie', posts: 2100, interactions: 26000, socialOrders: 780 },
  { name: 'Sab', posts: 2400, interactions: 29500, socialOrders: 860 },
  { name: 'Dom', posts: 1950, interactions: 23000, socialOrders: 690 },
];

export const socialConversionData = [
  { name: 'Vistas', value: 22000, fill: '#FBCFE8' },
  { name: 'Interacción', value: 14800, fill: '#F9A8D4' },
  { name: 'Compartidos', value: 6200, fill: '#F472B6' },
  { name: 'Carrito', value: 4200, fill: '#EC4899' },
  { name: 'Pedido', value: 2100, fill: '#DB2777' },
];

export const deliveryStageData = [
  { stage: 'Asignación', minutes: 3.2 },
  { stage: 'Espera restaurante', minutes: 8.4 },
  { stage: 'En ruta', minutes: 11.6 },
  { stage: 'Entrega', minutes: 3.8 },
];

export const qualityIssuesData = [
  { name: 'Faltantes', value: 38 },
  { name: 'Frío', value: 24 },
  { name: 'Retraso', value: 22 },
  { name: 'Dirección', value: 10 },
  { name: 'Otros', value: 6 },
];

export const supportVolumeData = [
  { name: 'Lun', tickets: 420, resolved: 380 },
  { name: 'Mar', tickets: 460, resolved: 410 },
  { name: 'Mie', tickets: 500, resolved: 460 },
  { name: 'Jue', tickets: 520, resolved: 470 },
  { name: 'Vie', tickets: 610, resolved: 540 },
  { name: 'Sab', tickets: 680, resolved: 600 },
  { name: 'Dom', tickets: 540, resolved: 500 },
];

export const paymentMethodsData = [
  { name: 'Tarjeta', value: 62 },
  { name: 'Wallet', value: 18 },
  { name: 'Efectivo', value: 12 },
  { name: 'Transferencia', value: 8 },
];

export const topCategoriesData = [
  { name: 'Comida Rápida', sales: 4520, revenue: 68500, growth: '+15%' },
  { name: 'Pizzas', sales: 3840, revenue: 54700, growth: '+12%' },
  { name: 'Asiática', sales: 2950, revenue: 42100, growth: '+22%' },
  { name: 'Mexicana', sales: 2100, revenue: 28400, growth: '+8%' },
  { name: 'Postres', sales: 1850, revenue: 15200, growth: '+18%' },
];

export const topRestaurantsData = [
  { name: 'Burger King Mock', orders: 1540, revenue: 25400, rating: 4.8 },
  { name: 'Pizza Hut Mock', orders: 1250, revenue: 21500, rating: 4.6 },
  { name: 'Sushi Express', orders: 980, revenue: 18400, rating: 4.9 },
  { name: 'El Buen Sabor', orders: 850, revenue: 12500, rating: 4.5 },
  { name: 'Wok & Roll', orders: 720, revenue: 10800, rating: 4.7 },
];

export const recentActivityData = [
  { id: 1, user: 'Juan Pérez', action: 'Realizó un pedido', target: 'Burger King Mock', time: 'Hace 5 min', amount: '$24.50' },
  { id: 2, user: 'Restaurante El Buen Sabor', action: 'Actualizó menú', target: 'Agregó 3 platos', time: 'Hace 15 min', amount: '' },
  { id: 3, user: 'Maria García', action: 'Registró nuevo usuario', target: 'App Cliente', time: 'Hace 32 min', amount: '' },
  { id: 4, user: 'Soporte', action: 'Resolvió ticket', target: '#4521', time: 'Hace 1 hora', amount: '' },
  { id: 5, user: 'Carlos Ruiz', action: 'Solicitud de restaurante', target: 'Tacos & Tequila', time: 'Hace 2 horas', amount: '' },
];

export const ordersByLocationData = [
  { restaurant: 'Burger King Mock', orders: 450, country: 'Ecuador', province: 'Guayas', city: 'Guayaquil', revenue: 5400, growth: '+12%' },
  { restaurant: 'Pizza Hut Mock', orders: 380, country: 'Colombia', province: 'Cundinamarca', city: 'Bogotá', revenue: 4200, growth: '+8%' },
  { restaurant: 'El Buen Sabor', orders: 320, country: 'Ecuador', province: 'Azuay', city: 'Cuenca', revenue: 3500, growth: '+15%' },
  { restaurant: 'Sushi Express', orders: 290, country: 'Colombia', province: 'Antioquia', city: 'Medellín', revenue: 3800, growth: '+5%' },
  { restaurant: 'Wok & Roll', orders: 210, country: 'Ecuador', province: 'Pichincha', city: 'Quito', revenue: 2800, growth: '-2%' },
  { restaurant: 'Tacos & Tequila', orders: 180, country: 'Mexico', province: 'CDMX', city: 'Ciudad de México', revenue: 2100, growth: '+20%' },
  { restaurant: 'Arepas de la Abuela', orders: 150, country: 'Colombia', province: 'Cundinamarca', city: 'Bogotá', revenue: 1200, growth: '+10%' },
  { restaurant: 'Bandeja Paisa Express', orders: 120, country: 'Colombia', province: 'Antioquia', city: 'Medellín', revenue: 1800, growth: '+5%' },
];

// New Chart Data for Command Center
export const revenueMixData = [
  { month: 'Ene', commission: 45000, delivery: 25000, ads: 5000, other: 1000 },
  { month: 'Feb', commission: 52000, delivery: 28000, ads: 6000, other: 1500 },
  { month: 'Mar', commission: 61000, delivery: 32000, ads: 8000, other: 2000 },
  { month: 'Abr', commission: 58000, delivery: 31000, ads: 7500, other: 1800 },
  { month: 'May', commission: 75000, delivery: 40000, ads: 12000, other: 2500 },
  { month: 'Jun', commission: 84000, delivery: 45000, ads: 15000, other: 3000 },
];

export const gmvMarginData = [
  { month: 'Ene', gmv: 250000, margin: 45000 },
  { month: 'Feb', gmv: 290000, margin: 53000 },
  { month: 'Mar', gmv: 340000, margin: 62000 },
  { month: 'Abr', gmv: 320000, margin: 59000 },
  { month: 'May', gmv: 420000, margin: 78000 },
  { month: 'Jun', gmv: 480000, margin: 89000 },
];

export const checkoutTimeData = [
  { month: 'Ene', seconds: 120 },
  { month: 'Feb', seconds: 115 },
  { month: 'Mar', seconds: 110 },
  { month: 'Abr', seconds: 105 },
  { month: 'May', seconds: 98 },
  { month: 'Jun', seconds: 95 },
];

// New Chart Data for Growth Screen
export const viralityFunnelData = [
  { stage: 'Share', value: 15000, fill: '#8B5CF6' },
  { stage: 'Click', value: 8500, fill: '#A78BFA' },
  { stage: 'Registro', value: 3200, fill: '#C4B5FD' },
  { stage: 'Pedido', value: 1800, fill: '#DDD6FE' },
];

export const ltvCacData = [
  { month: 'Ene', ltv: 120, cac: 45 },
  { month: 'Feb', ltv: 125, cac: 42 },
  { month: 'Mar', ltv: 135, cac: 40 },
  { month: 'Abr', ltv: 140, cac: 38 },
  { month: 'May', ltv: 150, cac: 35 },
  { month: 'Jun', ltv: 165, cac: 32 },
];
