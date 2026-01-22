import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShoppingBag, MessageCircle, Check, ArrowRight, Zap, Smartphone, 
  Truck, CreditCard, Instagram, ChevronRight, Info, Layout, 
  Search, Bot, Mail, Menu, X, Globe, Lock, Plus, Save, 
  Trash2, TrendingUp, Code, Edit2, DollarSign, BarChart3, 
  LogOut, AlertCircle
} from 'lucide-react';
import { supabase, isConfigured } from './lib/supabase';

// --- INITIAL DATA (Fallback if Supabase is not connected) ---
const INITIAL_PRICING_PLANS = [
  { id: 'starter', name: 'Starter', price: 6999, description: 'Perfect for small boutiques starting out.', features: ['Shopify Store Setup', 'COD + UPI Payments', 'Delivery Integration', 'Up to 35 Products', 'Mobile Responsive'], recommended: false },
  { id: 'advanced', name: 'Advanced', price: 8499, description: 'The standard for growing clothing brands.', features: ['Everything in Starter', 'Unlimited Products', 'Checkout Customisation', 'Custom Sections', 'Variant Support', 'Basic SEO'], recommended: true },
  { id: 'premium', name: 'Premium', price: 9999, description: 'Full-service automation and support.', features: ['Everything in Advanced', 'AI Chatbot Integration', '3 Months Support', 'Monthly Updates', 'Priority Response'], recommended: false },
  { id: 'custom', name: 'Custom', price: 0, isCustom: true, description: 'Enterprise grade scaling.', features: ['Fully custom requirements', 'Brand Identity', 'Photography (Optional)', 'Marketing Setup'], recommended: false }
];

const INITIAL_DEMOS = [
  { id: 1, name: 'Urban Streetwear', category: 'Streetwear', theme: 'Impact', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'The Silk Route', category: 'Boutique', theme: 'Prestige', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Retro Thrift', category: 'Thrift Store', theme: 'Impulse', image: 'https://images.unsplash.com/photo-1470309638588-299298b02c6a?auto=format&fit=crop&w=800&q=80' }
];

const ADD_ONS = [
  { id: 'checkout', name: 'Custom Checkout Page', price: 1499, allowedFor: ['starter'], description: 'High-converting one-page checkout UI.' }
];

const JOURNEY_MILESTONES = [
  { year: '2023', title: 'The Realisation', description: 'Noticed amazing Indian clothing brands losing sales in Instagram DMs due to lack of trust and automation.', icon: <Instagram size={20} className="text-pink-500" /> },
  { year: 'Early 2024', title: 'The Prototype', description: 'Manually built the first "Starterkart" stack for a local thrift store. Their conversion rate doubled in week one.', icon: <Code size={20} className="text-blue-500" /> },
  { year: 'Mid 2024', title: 'No More Freelancing', description: 'Shifted from hourly freelance work to a productized service. Fixed price, fixed delivery, zero surprises.', icon: <Zap size={20} className="text-yellow-500" /> },
  { year: '2025', title: 'Scaling Trust', description: 'Helped 40+ brands process ₹1Cr+ in GMV. Solved the "Trust Issue" with verified COD workflows.', icon: <TrendingUp size={20} className="text-green-500" /> },
  { year: '2026', title: 'The Ecosystem', description: 'Building proprietary apps to automate returns and sizing for Indian bodies. The future is automated.', icon: <Bot size={20} className="text-purple-500" /> }
];

// --- SHARED UI COMPONENTS ---

const ShopifyLogo3D = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
      <feOffset dx="2" dy="6" result="offsetblur" />
      <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
      <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <path d="M65 25C65 25 61 8 50 8C39 8 35 25 35 25" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 35L25 90H75L80 35H20Z" fill="#95BF47" filter="url(#dropShadow)" />
    <path d="M20 35L40 45L25 90" fill="#5E8E3E" opacity="0.2" />
    <path d="M55 38C55 38 45 38 45 52C45 66 60 70 60 80C60 88 50 90 50 90" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Toast = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-[100]">
    <Check size={20} className="text-green-400" />
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:text-gray-300"><X size={16} /></button>
  </div>
);

// --- ADMIN COMPONENTS ---

const AdminDashboard = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [plans, setPlans] = useState([]);
  const [demos, setDemos] = useState([]);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (isConfigured && supabase) {
      const { data: plansData } = await supabase.from('plans').select('*').order('price', { ascending: true });
      const { data: demosData } = await supabase.from('demos').select('*');
      setPlans(plansData || INITIAL_PRICING_PLANS);
      setDemos(demosData || INITIAL_DEMOS);
    } else {
      setPlans(INITIAL_PRICING_PLANS);
      setDemos(INITIAL_DEMOS);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditPlan = (plan) => {
    setIsEditing(plan.id);
    setEditForm({ ...plan });
  };

  const handleSavePlan = async () => {
    if (isConfigured && supabase) {
      const { error } = await supabase.from('plans').update({
        name: editForm.name,
        price: editForm.price,
        description: editForm.description
      }).eq('id', isEditing);
      
      if (error) {
        showToast('Error saving to Database');
        return;
      }
    }
    
    setPlans(plans.map(p => p.id === isEditing ? editForm : p));
    setIsEditing(null);
    showToast('Plan updated successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 h-auto md:h-screen sticky top-0 z-30 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-black text-white p-1.5 rounded-lg"><ShoppingBag size={20} /></div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Starterkart</h2>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'pricing' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <DollarSign size={18} /> Pricing & Plans
          </button>
          <button onClick={() => setActiveTab('demos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'demos' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Layout size={18} /> Demo Gallery
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => setPage('home')} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 hover:text-black transition-colors">
            <LogOut size={16} /> Exit to Website
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-black capitalize tracking-tight">{activeTab} Management</h1>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isConfigured ? 'text-green-600 bg-green-50 border-green-100' : 'text-orange-600 bg-orange-50 border-orange-100'}`}>
            {isConfigured ? 'Live Supabase' : 'Local Demo Mode'}
          </span>
        </header>

        <div className="max-w-4xl">
          {activeTab === 'pricing' && (
            <div className="grid gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group">
                  {isEditing === plan.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                         <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="border p-2 rounded-lg text-sm font-bold outline-none focus:border-black" />
                         <input type="number" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})} className="border p-2 rounded-lg text-sm outline-none focus:border-black" />
                      </div>
                      <textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className="w-full border p-2 rounded-lg text-sm outline-none focus:border-black" rows="2" />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => setIsEditing(null)} className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Cancel</button>
                        <button onClick={handleSavePlan} className="px-4 py-2 text-xs font-bold bg-black text-white rounded-lg">Update DB</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                          {plan.recommended && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold uppercase">Featured</span>}
                        </div>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                        <div className="mt-2 text-sm font-mono font-bold">₹{plan.price.toLocaleString('en-IN')}</div>
                      </div>
                      <button onClick={() => handleEditPlan(plan)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors"><Edit2 size={18} /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'demos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demos.map((demo, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <img src={demo.image} className="w-full aspect-video object-cover" />
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold">{demo.name}</h4>
                      <p className="text-xs text-gray-500">{demo.category} • {demo.theme}</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
          )}
        </div>
      </main>
    </div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password === 'dawar123') {
        onLogin();
      } else {
        setError(true);
        setLoading(false);
        setTimeout(() => setError(false), 2000);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="bg-black text-white p-4 rounded-2xl shadow-lg"><Lock size={32} /></div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-2 font-medium">Starterkart Project Configuration</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="password"
            className={`w-full px-4 py-4 rounded-xl border-2 transition-all outline-none text-lg ${error ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-gray-50 focus:border-black focus:bg-white'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (dawar123)"
          />
          <button 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Unlock Admin Panel'}
          </button>
        </form>
        {error && <p className="text-center text-red-500 text-sm font-bold mt-4 animate-bounce">Access Denied</p>}
      </div>
    </div>
  );
};

// --- WEBSITE COMPONENTS ---

const Navbar = ({ activePage, setPage }) => {
  return (
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}>
            <div className="bg-black text-white p-1.5 rounded-lg"><ShoppingBag size={20} /></div>
            <span className="font-black text-xl tracking-tight">Starterkart</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => setPage('home')} className={`text-sm font-bold ${activePage === 'home' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Platform</button>
            <button onClick={() => setPage('demos')} className={`text-sm font-bold ${activePage === 'demos' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Work</button>
            <a href="#pricing" className="text-sm font-bold text-gray-400 hover:text-black">Pricing</a>
            <a href="https://wa.me/919818082449" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all">Start Project</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Calculator = ({ plans = INITIAL_PRICING_PLANS }) => {
  const safePlans = Array.isArray(plans) && plans.length > 0 ? plans : INITIAL_PRICING_PLANS;
  const [selectedPlan, setSelectedPlan] = useState(safePlans[1] || safePlans[0]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  useEffect(() => {
    if(safePlans.length > 0 && !selectedPlan) setSelectedPlan(safePlans[1] || safePlans[0]);
  }, [safePlans]);

  if (!selectedPlan) return null;

  const subtotal = useMemo(() => {
    let total = selectedPlan?.price || 0;
    selectedAddOns.forEach(id => { const addon = ADD_ONS.find(a => a.id === id); if (addon) total += addon.price; });
    return total;
  }, [selectedPlan, selectedAddOns]);

  const discount = useMemo(() => subtotal >= 7999 ? Math.floor(subtotal * 0.05) : 0, [subtotal]);
  const finalTotal = subtotal - discount;

  const toggleAddOn = (id) => {
    if (selectedAddOns.includes(id)) setSelectedAddOns(selectedAddOns.filter(item => item !== id));
    else setSelectedAddOns([...selectedAddOns, id]);
  };

  const handleWhatsApp = () => {
    const addonsText = selectedAddOns.length > 0 ? ` + ${selectedAddOns.map(id => ADD_ONS.find(a => a.id === id).name).join(', ')}` : '';
    const message = `Starterkart Quote — ${selectedPlan?.name} Plan${addonsText}, Total: ₹${finalTotal.toLocaleString('en-IN')}.`;
    window.open(`https://wa.me/919818082449?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-24 bg-gray-50/50" id="calculator">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tight text-gray-900">Instant Estimate</h2>
          <p className="mt-4 text-lg text-gray-500">No hidden costs. Productized service pricing.</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid md:grid-cols-12">
          <div className="md:col-span-7 p-8 md:p-10 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="mb-10">
              <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Select Tier</label>
              <div className="space-y-3">
                {safePlans.filter(p => !p.isCustom).map(plan => (
                  <button key={plan.id} onClick={() => setSelectedPlan(plan)} className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 text-left transition-all duration-200 ${selectedPlan?.id === plan.id ? 'border-black bg-gray-50 ring-1 ring-black/5' : 'border-gray-100 hover:border-gray-300'}`}>
                    <div><span className="block font-bold text-base">{plan.name}</span><span className="text-xs text-gray-500 mt-1 block">{plan.description}</span></div>
                    <span className="font-bold text-sm bg-white px-3 py-1 rounded border border-gray-100 shadow-sm">₹{plan.price.toLocaleString('en-IN')}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Add-ons</label>
              <div className="space-y-3">
                {ADD_ONS.map(addon => {
                  const isDisabled = addon.allowedFor && !addon.allowedFor.includes(selectedPlan?.id);
                  return (
                    <button key={addon.id} disabled={isDisabled} onClick={() => toggleAddOn(addon.id)} className={`w-full flex justify-between items-center p-5 rounded-2xl border-2 text-left transition-all ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed bg-gray-50 border-transparent' : selectedAddOns.includes(addon.id) ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}>
                      <div><span className="block font-bold">{addon.name}</span>{isDisabled && <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded mt-1 inline-block">Included in Advanced</span>}</div>
                      <span className="font-medium text-sm text-gray-500">+₹{addon.price.toLocaleString('en-IN')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="md:col-span-5 p-8 md:p-10 bg-gray-50 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold mb-8">Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm py-2 border-b border-gray-200 border-dashed"><span className="font-medium text-g
