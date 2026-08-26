import { useAuth } from '../../context/AuthContext'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const earningsData = [
  { name: 'JAN', firstHalf: 40, topGross: 80 },
  { name: 'FEB', firstHalf: 45, topGross: 90 },
  { name: 'MAR', firstHalf: 110, topGross: 100 },
  { name: 'APR', firstHalf: 130, topGross: 140 },
  { name: 'MAY', firstHalf: 100, topGross: 180 },
  { name: 'JUN', firstHalf: 90, topGross: 130 },
  { name: 'JUL', firstHalf: 85, topGross: 80 },
  { name: 'AUG', firstHalf: 70, topGross: 70 },
  { name: 'SEP', firstHalf: 90, topGross: 100 },
  { name: 'OCT', firstHalf: 85, topGross: 95 },
  { name: 'NOV', firstHalf: 100, topGross: 110 },
  { name: 'DEC', firstHalf: 110, topGross: 120 },
]

const topCountries = [
  { flag: '🇦🇺', name: 'Australia', value: '34.48K' },
  { flag: '🇧🇪', name: 'Belgium', value: '24.12K' },
  { flag: '🇨🇦', name: 'Canada', value: '18.90K' },
  { flag: '🇨🇷', name: 'Costa Rica', value: '12.45K' },
  { flag: '🇦🇹', name: 'Austria', value: '8.21K' },
]

const topProducts = [
  { id: '01', name: 'Denim Jacket', category: "Men's Tops", stock: 'In Stock', sales: '1.43k', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&h=100&fit=crop' },
  { id: '02', name: 'Nike Air Max 97', category: "Men's Shoes", stock: 'Out of Stock', sales: '2.68k', img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=100&h=100&fit=crop' },
  { id: '03', name: 'Jordan Air', category: "Men's T-Shirt", stock: 'In Stock', sales: '1.43k', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl shadow-lg border-none text-center relative">
        {/* Little triangle pointer at the bottom */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45"></div>
        <p className="font-bold text-lg leading-tight">${payload[1].value}K</p>
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label} 2024</p>
      </div>
    )
  }
  return null
}

export default function AdminDashboard() {
  const { user } = useAuth()
  
  // Extract first name for greeting
  const firstName = user?.name ? user.name.split(' ')[0] : 'Admin'

  return (
    <div className="p-8 pb-20 w-full">
      
      {/* Header section */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-[32px] font-medium text-gray-900 dark:text-white tracking-tight leading-tight">
            Welcome Back, {firstName}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-[15px]">
            Here&apos;s what happening with your store today
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <Search size={22} strokeWidth={2} />
          </button>
          <button className="text-gray-400 hover:text-gray-700 transition-colors relative">
            <Bell size={22} strokeWidth={2} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div className="flex items-center gap-3 cursor-pointer pl-2">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${firstName}&background=f3f4f6&color=111827`} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="hidden sm:block text-sm">
              <p className="font-medium text-gray-900 dark:text-white leading-none">{firstName}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Card 1 */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <h3 className="text-[32px] font-medium text-gray-900 dark:text-white leading-none mb-2 tracking-tight">307.48K</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Customer</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-bold text-gray-900 dark:text-white">+30%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">This month</span>
            </div>
          </div>
          <svg className="absolute right-0 bottom-6 w-32 h-16" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,40 Q20,20 40,30 T80,10 T100,20" fill="none" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 2 */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <h3 className="text-[32px] font-medium text-gray-900 dark:text-white leading-none mb-2 tracking-tight">$30.58K</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-bold text-gray-900 dark:text-white">-15%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">This month</span>
            </div>
          </div>
          <svg className="absolute right-0 bottom-6 w-32 h-16" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,10 Q20,30 40,20 T80,40 T100,30" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Card 3 */}
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="relative z-10">
            <h3 className="text-[32px] font-medium text-gray-900 dark:text-white leading-none mb-2 tracking-tight">2.48K</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Deals</p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-bold text-gray-900 dark:text-white">+23%</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">This month</span>
            </div>
          </div>
          <svg className="absolute right-0 bottom-6 w-32 h-16" viewBox="0 0 100 50" preserveAspectRatio="none">
            <path d="M0,35 Q20,15 40,25 T80,5 T100,15" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Main Chart and Sidebar Area */}
      <div className="flex flex-col lg:flex-row gap-10 mb-12">
        {/* Earnings Chart */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Earnings</h2>
            <div className="flex gap-4 items-center text-sm font-medium text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ade80]"></span>
                First half
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-500"></span>
                Top Gross
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full glass-card rounded-2xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }}
                  domain={[0, 200]}
                  ticks={[0, 50, 100, 150, 200]}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="firstHalf" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#4ade80', stroke: '#fff', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="topGross" 
                  stroke="#64748b" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#1a1a1a', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Countries */}
        <div className="w-full lg:w-72">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-4">Top Countries</h2>
          <div className="mb-6">
            <span className="text-[32px] font-medium tracking-tight">34.48K</span>
          </div>
          
          <div className="space-y-5">
            {topCountries.map((country, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{country.name}</span>
                </div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{country.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top selling products table */}
      <div className="glass-panel rounded-3xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight mb-6">Top selling products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-200/50 dark:border-gray-700/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <th className="pb-4 font-medium">S/NO</th>
                <th className="pb-4 font-medium">Product Name</th>
                <th className="pb-4 font-medium">Category</th>
                <th className="pb-4 font-medium">Stock</th>
                <th className="pb-4 font-medium text-right pr-4">Total sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-200/30 dark:border-gray-700/30 group hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                  <td className="py-4 text-sm font-medium text-gray-500 dark:text-gray-400">{product.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-500 dark:text-gray-400">{product.category}</td>
                  <td className="py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      product.stock === 'In Stock' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-semibold text-gray-900 dark:text-white text-right pr-4">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  )
}
