import React, { useState, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Check, Zap, Lock, Code, Instagram, TrendingUp, Bot, Edit2 } from 'lucide-react';
import { supabase, isConfigured } from './lib/supabase';

const INITIAL_PLANS = [
  { id: 'starter', name: 'Starter', price: 6999, features: ['Shopify Setup', 'COD + UPI', '35 Products'] },
  { id: 'advanced', name: 'Advanced', price: 8499, features: ['Unlimited Products', 'SEO', 'Custom Sections'], recommended: true },
  { id: 'premium', name: 'Premium', price: 9999, features: ['AI Chatbot', '3 Months Support'] }
];

const JOURNEY = [
  { year: '2023', title: 'Start', desc: 'Identified Instagram DM gap.', icon: <Instagram size={20}/> },
  { year: '2024', title: 'Launch', desc: 'First boutique went live.', icon: <Zap size={20}/> }
];

export default function App() {
  const [page, setPage] = useState('home');
  const [plans, setPlans] = useState(INITIAL_PLANS);

  useEffect(() => {
    if (isConfigured && supabase) {
      supabase.from('plans').select('*').order('price').then(({ data }) => {
        if (data && data.length > 0) setPlans(data);
      });
    }
  }, []);

  if (page === 'admin') return <AdminLogin onLogin={() => setPage('dashboard')} />;
  if (page === 'dashboard') return <div className="p-20 text-center font-bold">Admin Dashboard Active <button onClick={() => setPage('home')} className="block mx-auto mt-4 underline">Logout</button></div>;

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50 px-6 py-4 flex justify-between items-center">
        <div className="font-black text-xl flex items-center gap-2"><ShoppingBag /> Starterkart</div>
        <div className="flex gap-4">
          <button onClick={() => setPage('home')} className="text-sm font-bold">Home</button>
          <button onClick={() => setPage('admin')} className="text-sm font-bold text-gray-400">Staff</button>
        </div>
      </nav>

      <main className="pt-32 text-center px-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">Dawar's <br/><span className="text-gray-300">Starterkart.</span></h1>
        <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10">Premium Shopify setups for Indian clothing brands.</p>
        <a href="https://wa.me/919818082449" className="bg-black text-white px-8 py-4 rounded-2xl font-bold inline-block">WhatsApp Inquiry</a>

        <section className="mt-32 max-w-6xl mx-auto grid md:grid-cols-3 gap-6 pb-20">
          {plans.map(p => (
            <div key={p.id} className={`p-8 rounded-3xl border text-left ${p.recommended ? 'border-black ring-1 ring-black' : 'border-gray-100'}`}>
              <h3 className="text-2xl font-black mb-2">{p.name}</h3>
              <p className="text-4xl font-black mb-6">₹{p.price}</p>
              <ul className="space-y-3 mb-8">
                {p.features?.map((f, i) => <li key={i} className="flex gap-2 text-sm text-gray-500 font-medium"><Check size={16} className="text-black"/> {f}</li>)}
              </ul>
              <button className="w-full py-3 bg-black text-white font-bold rounded-xl">Select</button>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-10 border-t text-center text-xs font-bold text-gray-300 uppercase tracking-widest">
        © 2026 Starterkart Digital
      </footer>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl border shadow-xl w-80">
        <h2 className="font-black text-center mb-6">Dawar Login</h2>
        <input type="password" placeholder="Password" className="w-full border-2 p-3 rounded-xl mb-4 outline-none focus:border-black" value={pw} onChange={e => setPw(e.target.value)} />
        <button onClick={() => pw === 'dawar123' ? onLogin() : alert('Wrong')} className="w-full bg-black text-white p-3 rounded-xl font-bold">Unlock</button>
      </div>
    </div>
  );
}

    
