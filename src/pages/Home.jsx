import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Login from '../components/Login'
import { useDispatch, useSelector } from 'react-redux'
import { Coins } from 'lucide-react'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'





const Home = () => {
    const highlight = [
        "AI Generated Code",
        "Fully Responsive Layout",
        "Production Ready Output",
    ]

    const [openLogin, setOpenLogin] = useState(false);
    const { userData } = useSelector((state) => state.user);
    // console.log(userData.avatar);

    const [openProfile, setOpenProfile] = useState(false);
    const [website, setWebsites] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
            dispatch(setUserData(null))
            setOpenProfile(false)

        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (userData) return;
        const handelGetAllWebsites = async () => {

            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true });
                setWebsites(result.data || []);

            } catch (error) {
                console.error(error);

            }
        }
        handelGetAllWebsites();
    }, [userData])

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>
            <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'>

                <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>

                    <div className='text-lg font-semibold'>
                        Yash AI
                    </div>
                    <div className='flex items-center gap-5'>

                        <div className='hidden md:inline text-sm text-zinc-400  hover:text-white cursor-pointer' onClick={() => navigate("/pricing")}>Pricing</div>

                        {userData && <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition' onClick={() => navigate("/pricing")}>
                            <Coins size={14} className='text-yellow-400' />
                            <span className='text-zinc-300'>Credits</span>
                            <span>{userData.credits}</span>
                            <span className='font-semibold'>+</span>
                        </div>}

                        {!userData ? <button className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm' onClick={() => setOpenLogin(true)}>
                            Get Started
                        </button> :
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img className='w-9 h-9 rounded-full border border-white/20 object-cover' src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}`}
                                        alt="avatar" referrerPolicy='no-referrer' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <>
                                            <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} className='absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'>

                                                <div className='px-4 py-3 border-b border-white/10'>
                                                    <p className='text-sm font-medium truncate'>{userData?.name}</p>
                                                    <p className='text-xs font-zinc-500 truncate'>{userData?.email}</p>
                                                </div>

                                                <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 test-sm border-b border-white/10 hover:bg-white/5'>
                                                    <Coins size={14} className='text-yellow-400' />
                                                    <span className='text-zinc-300'>Credits</span>
                                                    <span>{userData.credits}</span>
                                                    <span className='font-semibold'>+</span>
                                                </button>

                                                <button className='w-full px-4 py-3 text-left text-sm hover:bg-white/5' onClick={() => navigate('/dashboard')}>Dashboard</button>
                                                <button className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5' onClick={handleLogOut}>Logout</button>

                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>}

                    </div>

                </div>

            </motion.div>

            <section className='pt-44 pb-32 px-6 text-center'>

                <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='text-5xl md:text-7xl font-bold tracking-tight'>
                    Build Stunning <br></br> <span className='bg-linear-to-r  from-purple-400 to-blue-400 bg-clip-text text-transparent '>AI Apps & Web in Minutes</span>
                </motion.h1>

                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg'>
                    Describe your Idea and let AI Generate a Stunning App & Web in Minutes
                </motion.p>

                <button className='mt-12 px-10 py-4 rounded-xl bg-white text-black font-semibold hover:scale-105 transition' onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}>{userData ? "Go to dashboard" : "Get Started"}</button>

            </section>

            {!userData && <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {highlight.map((highlight, i) => (
                        <motion.div initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} key={i} className='rounded-2xl bg-white/5 border-white/10 p-8'>
                            <h1 className='text-xl font-semibold mb-3'>{highlight}</h1>
                            <p className='text-sm text-zinc-400'>GenWeb Ai builds real websites - clean code, fully responsive, and production-ready.</p>

                        </motion.div>
                    ))}
                </div>
            </section>}



            {userData && website?.length > 0 && (
                <section className='max-w-7xl mx-auto px-6 pb-32'>
                    <h3 className='text-2xl font-semibold mb-6'>Your Websites</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {website.slice(0, 3).map((w, i) => (
                            <motion.div key={w._id} whileHover={{ y: -6 }} onClick={() => navigate(`/editor/${w._id}`)} className='cursor-pointer rounded-2xl bg.white/5  border border-white/10 overflow-hidden'>
                                <div className='h-40 bg-black'>
                                    <iframe srcDoc={w.latestCode} className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white' />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-base font-semibold line-clamp-2 truncate'>{w.title}</h3>
                                    <p className='text-xs text-zinc-400'>Last Update {" "} {new Date(w.updatedAt).toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            <footer className='border-t border-white/10 p-10 text-center text-sm text-zinc-500'>
                &copy; {new Date().getFullYear()} Yash AI
            </footer>

            {openLogin && <Login open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>

    )
}

export default Home