import { ArrowLeftIcon, Check, Coins } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion'
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';

export const plans = [
    {
        key: "free",
        name: "Free Plan",
        price: 0,
        credits: 10,
        description: "Get started with our free plan",
        features: [
            "Basic website generation",
            "Limited templates",
            "Community support"
        ],
        isPopular: false,
        button: "Get Started"
    },
    {
        key: "pro",
        name: "Pro Plan",
        price: 499,
        credits: 500,
        description: "Take your business to the next level with our pro plan",
        features: [
            "Advanced website generation",
            "Premium templates",
            "Priority support",
            "High-speed processing",
            "Custom domain support"
        ],
        isPopular: true,
        button: "Upgrade to pro"
    },
    {
        key: "enterprise",
        name: "Enterprise Plan",
        price: 999,
        credits: 1000,
        description: "Scale your business with our enterprise plan",
        features: [
            "Unlimited website generation",
            "All premium features",
            "Dedicated support",
            "API access",
            "Custom integrations"
        ],
        isPopular: false,
        button: "Contact sales"
    }
];

const Pricing = () => {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.user);
    const [loading, setLoading] = useState(null);
    const handleBy = async (planKey) => {
        if (!userData) {
            navigate("/")
            return;
        }

        if (planKey === "free") {
            navigate("/dashboard")
            return;
        }
        setLoading(planKey);
        try {
            const result = await axios.post(`${serverUrl}/api/billing`, { planType: planKey }, { withCredentials: true });
            console.log(result);
            setLoading(null);

            window.location.href = result.data.sessionUrl;
        } catch (error) {
            console.error(error);
            setLoading(null);
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24'>
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-[125px]' />
                <div className='absolute bottom-0 right-0 w-100 h-100 bg-purple-600/20  rounded-full blur-[120px]' />
                <button className='relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate("/")}><ArrowLeftIcon size={18} className='color-white' />Back</button>
            </div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className='relative z-10 max-w-4xl mx-auto text-center mb-14'>
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Simple transparent pricing</h1>
                <p className='text-lg text-zinc-400'>Buy credits once . Build anytime .</p>
            </motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {plans.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} whileHover={{ y: 14, scale: 1.03 }} className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all ${p.isPopular ? "border-indigo-500 bg-linear-to-b from bg-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30" : "border-white/10 bg-white/5 hover: border-indigo-400 hover:bg-white/10"}`}>
                        {p.isPopular && (
                            <span className="absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500">Most popular</span>
                        )}
                        <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                        <p className='text-zinc-400 text-sm mb-6'></p>
                        <div className='flex items-end gap-1 mb-4'>
                            <span className='text-4xl font-bold'>₹{p.price}</span>
                            <span className='text-sm text-zinc-400'>/one time</span>
                        </div>
                        <div className='flex items-center gap-2 mb-8'>
                            <Coins size={18} className='text-yellow-400' />
                            <span className='font-semibold'>{p.credits} Credits</span>
                        </div>
                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li key={f} className='flex items-center gap-2 text-sm text-zinc-300'>< Check size={18} className='text-green-400' /> {f}</li>
                            ))}
                        </ul>
                        <motion.button whileTap={{ scale: 0.96 }} disabled={loading} onClick={() => handleBy(p.key)} className={`w-full py-3 rounded-xl font-semibold transition ${p.isPopular ? "bg-indigo-500 hover:bg-indigo-600" : "bg-white/10 hover:bg-white/20"} disabled:opacity-60 `}>{loading === p.key ? "Redirecting..." : p.button}</motion.button>
                    </motion.div>
                ))}
            </div>

        </div>
    )
}

export default Pricing