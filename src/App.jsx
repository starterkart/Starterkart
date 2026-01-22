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
  { year: '2023', title: 'The Realisation', description: 'Noticed Indian brands losing sales in Instagram DMs.', icon: <Instagram size={20} className="text-pink-500" /> },
  { year: 'Early 2024', title: 'The Prototype', description: 'Built the first "Starterkart" stack. Growth tripled.', icon: <Code size={20} className="text-blue-500" /> },
  { year: 'Mid 2024', title: 'Productized Service', description: 'Shifted to fixed-price models for boutique owners.', icon: <Zap size={20} className="text-yellow-500" /> },
  { year: '2025', title: 'Scaling Trust', description: 'Helped 40+ brands with automated COD workflows.', icon: <TrendingUp size={20} className="text-green-500" /> },
  { year: '2026', title: 'The Ecosystem', description: 'Building the next gen Shopify OS for India.', icon: <Bot size={20} className="text-purple-500" /> }
];

// --- COMPONENTS ---

const ShopifyLogo3D = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M65 25C65 25 61 8 50 8C39 8 35 25 35 25" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 35L25 90H75L80 35H20Z" fill="#95BF47" />
    <path d="M55 38C55 38 45 38 45 52C45 66 60 70 60 80C60 88 50 90 50 90" stroke="white" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

const AdminDashboard = ({ setPage }) => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [plans, setPlans] = useState([]);
  const [demos, setDemos] = useState([]);
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

  const handleSave = async () => {
    if (isConfigured && supabase) {
      await supabase.from('plans').update({ name: editForm.name, price: editForm.price }).eq('id', isEditing);
    }
    setPlans(plans.map(p => p.id === isEditing ? editForm : p));
    setIsEditing(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r p-6 flex flex-col h-screen sticky top-0">
        <div className="font-black text-xl mb-10">Starterkart Admin</div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setActiveTab('pricing')} className={`w-full text-left p-3 rounded-xl font-bold ${activeTab === 'pricing' ? 'bg-black text-white' : 'text-gray-500'}`}>Pricing</button>
          <button onClick={() => setActiveTab('demos')} className={`w-full text-left p-3 rounded-xl font-bold ${activeTab === 'demos' ? 'bg-black text-white' : 'text-gray-500'}`}>Portfolio</button>
        </nav>
        <button onClick={() => setPage('home')} className="p-3 text-gray-400 font-bold border-t">Logout</button>
      </aside>
      <main className="flex-1 p-10">
        {activeTab === 'pricing' && (
          <div className="grid gap-4">
            {plans.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-2xl border flex justify-between items-center">
                {isEditing === p.id ? (
                  <div className="flex gap-4 w-full">
                    <input className="border p-2 rounded flex-1" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                    <button onClick={handleSave} className="bg-black text-white px-4 rounded">Save</button>
                  </div>
                ) : (
                  <>
                    <div><h4 className="font-bold">{p.name}</h4><p className="text-sm">₹{p.price}</p></div>
                    <button onClick={() => { setIsEditing(p.id); setEditForm(p); }} className="text-gray-400"><Edit2 size={18} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const HomePage = () => {
  const [plans, setPlans] = useState(INITIAL_PRICING_PLANS);
  useEffect(() => {
    if (isConfigured && supabase) {
      supabase.from('plans').select('*').order('price', { ascending: true }).then(({ data }) => data && setPlans(data));
    }
  }, []);

  return (
    <div className="pt-20">
      <section className="text-center py-32 px-4 relative overflow-hidden">
        <h1 className="text-7xl font-black tracking-tighter mb-8 leading-none">The Shopify <br/><span className="text-gray-300">System for India.</span></h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10">Launch a professional boutique with COD & WhatsApp support.</p>
        <div className="flex justify-center items-center gap-6">
          <a href="https://wa.me/919818082449" className="bg-black text-white px-8 py-4 rounded-2xl font-bold">Start Now</a>
          <span className="font-bold text-gray-400">From ₹6,999</span>
        </div>
        <div className="absolute -bottom-10 right-0 w-64 md:w-96 animate-float opacity-50"><ShopifyLogo3D /></div>
      </section>

      <section className="py-24 bg-white px-4" id="pricing">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">
          {plans.map(p => (
            <div key={p.id} className={`p-8 rounded-3xl border transition-all ${p.recommended ? 'border-black ring-1 ring-black shadow-xl' : 'border-gray-100'}`}>
              <h3 className="text-2xl font-black mb-2">{p.name}</h3>
              <p className="text-4xl font-black mb-8">₹{p.price}</p>
              <ul className="space-y-3 mb-8 text-gray-500 text-sm font-medium">
                {p.features?.map((f, i) => <li key={i} className="flex gap-2"><Check size={16} className="text-black" /> {f}</li>)}
              </ul>
              <a href="https://wa.me/919818082449" className="block w-full text-center py-3 rounded-xl bg-black text-white font-bold">Get Quote</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  if (page === 'admin_dashboard' && isAdmin) return <AdminDashboard setPage={setPage} />;
  if (page === 'admin_login') return <AdminLogin onLogin={() => { setIsAdmin(true); setPage('admin_dashboard'); }} />;

  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-black selection:text-white">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-8 py-5 flex justify-between items-center">
        <div className="font-black text-xl flex items-center gap-2 cursor-pointer" onClick={() => setPage('home')}><ShoppingBag /> Starterkart</div>
        <div className="flex gap-6 items-center">
          <button onClick={() => setPage('home')} className="text-sm font-bold">Home</button>
          <button onClick={() => setPage('admin_login')} className="text-sm font-bold text-gray-400 hover:text-black">Staff</button>
          <a href="https://wa.me/919818082449" className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold">Contact</a>
        </div>
      </nav>
      {page === 'home' ? <HomePage /> : <div className="pt-40 text-center font-bold">Page coming soon</div>}
      <footer className="py-20 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest border-t">© 2026 Starterkart Digital</footer>
    </div>
  );
}

// Ensure login component is defined or simple fallback
const AdminLogin = ({ onLogin }) => {
  const [pw, setPw] = useState('');
  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-xs w-full bg-white p-8 rounded-3xl border shadow-xl">
        <h2 className="text-center font-black mb-6">Staff Access</h2>
        <input type="password" placeholder="dawar123" className="w-full border-2 p-3 rounded-xl mb-4 outline-none focus:border-black" value={pw} onChange={e => setPw(e.target.value)} />
        <button onClick={() => pw === 'dawar123' ? onLogin() : alert('Wrong password')} className="w-full bg-black text-white p-3 rounded-xl font-bold">Unlock</button>
      </div>
    </div>
  );
};

         
