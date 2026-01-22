import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShoppingBag, MessageCircle, Check, ArrowRight, Zap, Smartphone, 
  Truck, CreditCard, Instagram, ChevronRight, Info, Layout, 
  Search, Bot, Mail, Menu, X, Globe, Lock, Plus, Save, 
  Trash2, TrendingUp, Code, Edit2, DollarSign, BarChart3, 
  LogOut, AlertCircle
} from 'lucide-react';
import { supabase, isConfigured } from './lib/supabase';

// --- INITIAL DATA (Fallback) ---
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
  { year: '2023', title: 'The Realisation', description: 'Noticed amazing Indian clothing brands losing sales in Instagram DMs due to lack of trust.', icon: <Instagram size={20} className="text-pink-500" /> },
  { year: 'Early 2024', title: 'The Prototype', description: 'Manually built the first "Starterkart" stack. Conversion rates doubled in week one.', icon: <Code size={20} className="text-blue-500" /> },
  { year: 'Mid 2024', title: 'Productized Service', description: 'Shifted from freelance to fixed-price product. Zero surprises for clients.', icon: <Zap size={20} className="text-yellow-500" /> },
  { year: '2025', title: 'Scaling Trust', description: 'Helped 40+ brands process ₹1Cr+ in GMV with verified COD workflows.', icon: <TrendingUp size={20} className="text-green-500" /> },
  { year: '2026', title: 'The Ecosystem', description: 'Building proprietary apps for sizing and returns. The future is automated.', icon: <Bot size={20} className="text-purple-500" /> }
];

// --- COMPONENTS ---

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

// --- ADMIN DASHBOARD ---

const AdminDashboard = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [plans, setPlans] = useState([]);
  const [demos, setDemos] = useState([]);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (isConfigured && supabase) {
        const { data: p } = await supabase.from('plans').select('*').order('price', { ascending: true });
        const { data: d } = await supabase.from('demos').select('*');
        setPlans(p || INITIAL_PRICING_PLANS);
        setDemos(d || INITIAL_DEMOS);
      } else {
        setPlans(INITIAL_PRICING_PLANS);
        setDemos(INITIAL_DEMOS);
      }
    };
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSavePlan = async () => {
    if (isConfigured && supabase) {
      await supabase.from('plans').update({ 
        name: editForm.name, 
        price: editForm.price,
        description: editForm.description 
      }).eq('id', isEditing);
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
          <div><h2 className="font-bold text-lg">Starterkart</h2><span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold uppercase">Admin</span></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button onClick={() => setActiveTab('pricing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'pricing' ? 'bg-black text-white' : 'text-gray-500'}`}><DollarSign size={18} /> Pricing</button>
          <button onClick={() => setActiveTab('demos')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${activeTab === 'demos' ? 'bg-black text-white' : 'text-gray-500'}`}><Layout size={18} /> Portfolio</button>
        </nav>
        <div className="p-4 border-t"><button onClick={() => setPage('home')} className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500"><LogOut size={16} /> Exit</button></div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-2xl font-black mb-8 capitalize">{activeTab} Manager</h1>
        {activeTab === 'pricing' && (
          <div className="grid gap-4 max-w-4xl">
            {plans.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border shadow-sm">
                {isEditing === p.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input className="border p-2 rounded font-bold" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                      <input className="border p-2 rounded" type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: parseInt(e.target.value)})} />
                    </div>
                    <textarea className="w-full border p-2 rounded" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                    <div className="flex justify-end gap-2"><button onClick={() => setIsEditing(null)} className="px-3 py-1 text-xs font-bold bg-gray-100 rounded">Cancel</button><button onClick={handleSavePlan} className="px-3 py-1 text-xs font-bold bg-black text-white rounded">Save</button></div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div><h3 className="font-bold">{p.name}</h3><p className="text-sm text-gray-500">{p.description}</p><p className="font-mono mt-1 font-bold">₹{p.price}</p></div>
                    <button onClick={() => { setIsEditing(p.id); setEditForm(p); }} className="p-2 hover:bg-gray-100 rounded"><Edit2 size={18} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {activeTab === 'demos' && (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {demos.map((d, i) => (
              <div key={i} className="bg-white rounded-2xl border overflow-hidden"><img src={d.image} className="w-full h-40 object-cover" /><div className="p-4 font-bold">{d.name}</div></div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === 'dawar123') onLogin();
    else { setErr(true); setTimeout(() => setErr(false), 2000); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl border shadow-xl w-96">
        <h1 className="text-2xl font-black text-center mb-6">Staff Access</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="password" placeholder="dawar123" className="w-full border-2 p-3 rounded-xl outline-none focus:border-black" value={pw} onChange={e => setPw(e.target.value)} />
          <button className="w-full bg-black text-white p-3 rounded-xl font-bold">Unlock</button>
        </form>
        {err && <p className="text-red-500 text-center font-bold mt-4">Access Denied</p>}
      </div>
    </div>
  );
};

// --- WEBSITE COMPONENTS ---

const Navbar = ({ setPage }) => (
  <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-4 md:px-8 py-4 flex justify-between items-center transition-all">
    <div className="flex items-center gap-2 font-black text-xl cursor-pointer" onClick={() => setPage('home')}>
      <div className="bg-black text-white p-1.5 rounded-lg"><ShoppingBag size={20} /></div> Starterkart
    </div>
    <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
      <button onClick={() => setPage('home')} className="hover:text-black">Platform</button>
      <button onClick={() => setPage('demos')} className="hover:text-black">Work</button>
      <a href="#pricing" className="hover:text-black">Pricing</a>
    </div>
    <a href="https://wa.me/919818082449" className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all">Start Project</a>
  </nav>
);

const Calculator = ({ plans }) => {
  const [selected, setSelected] = useState(plans[1] || plans[0]);
  const [addons, setAddons] = useState([]);
  
  useEffect(() => { if (plans.length) setSelected(plans[1] || plans[0]); }, [plans]);
  if (!selected) return null;

  const total = (selected.price || 0) + addons.reduce((sum, id) => sum + (ADD_ONS.find(a => a.id === id)?.price || 0), 0);
  const discount = total >= 7999 ? Math.floor(total * 0.05) : 0;
  
  const toggleAddon = (id) => setAddons(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const handleWA = () => window.open(`https://wa.me/919818082449?text=${encodeURIComponent(`Quote: ${selected.name} Plan, Total: ₹${total - discount}`)}`, '_blank');

  return (
    <section className="py-24 bg-gray-50/50 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border shadow-xl overflow-hidden grid md:grid-cols-2">
        <div className="p-8 border-b md:border-r border-gray-100">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6">Configure Plan</h3>
          <div className="space-y-3">
            {plans.filter(p => !p.isCustom).map(p => (
              <button key={p.id} onClick={() => setSelected(p)} className={`w-full flex justify-between p-4 rounded-xl border-2 ${selected.id === p.id ? 'border-black bg-gray-50' : 'border-gray-100'}`}>
                <span className="font-bold">{p.name}</span><span>₹{p.price}</span>
              </button>
            ))}
          </div>
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mt-8 mb-6">Add-ons</h3>
          {ADD_ONS.map(a => {
            const disabled = a.allowedFor && !a.allowedFor.includes(selected.id);
            return (
              <button key={a.id} disabled={disabled} onClick={() => toggleAddon(a.id)} className={`w-full flex justify-between p-4 rounded-xl border-2 mb-2 text-left ${disabled ? 'opacity-50' : addons.includes(a.id) ? 'border-black' : 'border-gray-100'}`}>
                <div><span className="block font-bold">{a.name}</span>{disabled && <span className="text-[10px]">Not available</span>}</div><span>+₹{a.price}</span>
              </button>
            )
          })}
        </div>
        <div className="p-8 flex flex-col justify-between bg-gray-50/50">
          <div>
            <h3 className="font-bold text-lg mb-6">Estimate</h3>
            <div className="flex justify-between mb-2 text-sm"><span className="text-gray-500">{selected.name}</span><b>₹{selected.price}</b></div>
            {addons.map(id => <div key={id} className="flex justify-between mb-2 text-sm"><span className="text-gray-500">{ADD_ONS.find(a => a.id === id).name}</span><b>₹{ADD_ONS.find(a => a.id === id).price}</b></div>)}
            {discount > 0 && <div className="flex justify-between text-green-600 font-bold text-sm bg-green-50 p-2 rounded"><span>Discount</span><span>-₹{discount}</span></div>}
          </div>
          <div>
            <div className="flex justify-between items-end mb-6"><span className="text-xs font-bold uppercase text-gray-400">Total</span><span className="text-4xl font-black">₹{(total - discount).toLocaleString('en-IN')}</span></div>
            <button onClick={handleWA} className="w-full bg-black text-white py-4 rounded-xl font-bold flex justify-center gap-2 hover:bg-gray-800 transition-all"><MessageCircle /> WhatsApp Quote</button>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = ({ setPage }) => {
  const [plans, setPlans] = useState(INITIAL_PRICING_PLANS);
  useEffect(() => {
    if (isConfigured && supabase) supabase.from('plans').select('*').order('price').then(({ data }) => data && setPlans(data));
  }, []);

  return (
    <>
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold text-gray-600 mb-8 mx-auto"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Trusted by 40+ Brands</div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">The Shopify <br/><span className="text-gray-300">System for India.</span></h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Launch a high-end clothing store with pre-integrated COD, UPI & WhatsApp automation.</p>
        <div className="flex justify-center gap-4">
          <a href="https://wa.me/919818082449" className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform">Start Project</a>
        </div>
        <div className="absolute -bottom-20 right-0 w-64 md:w-80 animate-float opacity-80"><ShopifyLogo3D /></div>
      </section>

      <section className="py-24 bg-white px-4" id="pricing">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16"><h2 className="text-4xl font-black">Fixed Pricing.</h2></div>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map(p => (
              <div key={p.id} className={`p-8 rounded-[2rem] border flex flex-col ${p.recommended ? 'border-black shadow-xl ring-1 ring-black' : 'border-gray-200'}`}>
                {p.recommended && <div className="text-[10px] font-black uppercase tracking-widest bg-black text-white w-fit px-3 py-1 rounded-full mb-4">Bestseller</div>}
                <h3 className="text-2xl font-black">{p.name}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-6 h-10">{p.description}</p>
                <div className="text-4xl font-black mb-8">₹{p.price}</div>
                <div className="space-y-3 flex-1 mb-8">
                  {p.features?.map((f, i) => <div key={i} className="flex gap-3 text-sm font-medium text-gray-600"><Check size={16} /> {f}</div>)}
                </div>
                <a href="https://wa.me/919818082449" className="block text-center py-3 rounded-xl font-bold bg-gray-100 hover:bg-black hover:text-white transition-colors">Select Plan</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Calculator plans={plans} />

      <section className="py-24 bg-white px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20"><h2 className="text-4xl font-black">Our Journey</h2></div>
          <div className="space-y-12 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2"></div>
            {JOURNEY_MILESTONES.map((m, i) => (
              <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-auto pl-12 md:pl-0">
                  <div className={`bg-white p-6 rounded-2xl border shadow-lg relative ${i % 2 === 0 ? 'md:ml-12' : 'md:mr-12'}`}>
                    <div className="flex justify-between items-center mb-4"><span className="text-3xl font-black text-gray-200">{m.year}</span><div className="text-black">{m.icon}</div></div>
                    <h3 className="font-bold text-lg">{m.title}</h3>
                    <p className="text-gray-500 text-sm mt-2">{m.description}</p>
                  </div>
                </div>
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 text-center px-4">
        <h2 className="text-4xl font-black mb-12">The Brains Behind the Brand</h2>
        <div className="inline-block relative group">
          <div className="w-48 h-48 rounded-full bg-white p-2 shadow-2xl border-4 border-white overflow-hidden mx-auto mb-6 transition-transform group-hover:scale-105">
            <img src="https://ouch-cdn2.icons8.com/6Xy-J8Q0-1-5_3s2-6-1-8y3-4-1_3/rs:fit:368:368/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9wbmcvMzAv/ZWY5ZDI4MDctM2Qz/OC00ZGYxLThhYmIt/NDIxMDc0YmE0YzU2/LnBuZw.png" className="w-full h-full object-cover object-top bg-blue-50" />
          </div>
          <h3 className="text-3xl font-black">Dawar</h3>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-2">Founder & 
