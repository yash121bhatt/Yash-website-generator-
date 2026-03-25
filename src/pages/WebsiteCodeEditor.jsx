import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { Code2, MessageSquare, Monitor, Rocket, Send, XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Editor from '@monaco-editor/react';


const WebsiteCodeEditor = () => {
    const { id } = useParams()
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinKingIndex, setThinKingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const iframeRef = useRef(null)

    const thinkingSteps = [
        "Understanding your request...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing update...",
    ]

    const handleUpdateCode = async () => {
        if (!prompt) return;
        setUpdateLoading(true)
        const text = prompt
        setPrompt("");
        setMessages((m) => [...m, { role: "user", content: prompt }])
        try {
            const result = await axios.post(`${serverUrl}/api/website/update/${id}`, { prompt: text }, { withCredentials: true });
            console.log(result);
            setUpdateLoading(false);
            setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
            setCode(result.data.code);
        } catch (error) {
            console.error(error);
            setUpdateLoading(false);
        }
    };


    const handelDeploy = async () => {
        console.log("function deploy");

        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true });
            console.log(result);

            window.open(`${result.data.url}`, "_blank");

        } catch (error) {
            console.error(error);
            setError(error.response.data.message);
        }
    }

    useEffect(() => {
        if (!updateLoading) return;
        const interval = setInterval(() => {
            setThinKingIndex((prevIndex) => (prevIndex + 1) % thinkingSteps.length);
        }, 1000);

        return () => clearInterval(interval);
    }, [updateLoading])

    useEffect(() => {
        console.log('chaking.........');

        const handelWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, { withCredentials: true });
                setWebsite(result.data);
                setCode(result.data.latestCode);
                setMessages(result.data.conversation);

            } catch (error) {
                console.error(error);
                setError(error.response.data.message);
            }
        }
        handelWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return; {
            const blob = new Blob([code], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            iframeRef.current.src = url;
            return () => URL.revokeObjectURL(url);
        }
    }, [code])


    if (error) {
        return (<div className='h-screen flex items-center justify-center bg-black text-red-500'>{error}</div>)
    }

    if (!website) {
        return (<div className='h-screen flex items-center justify-center bg-black text-white'>
            Loading..........
        </div>)
    }

    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden lg:flex w-[380px] flex-col border-r border-white/10 bg-black/80'>
                <Header />

                {/* Chat Part */}

                <>
                    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                        {messages.map((item, index) => (
                            <div key={index} className={`max-w-[85%] ${item.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${item.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}>{item.content}</div>
                            </div>
                        ))}

                        {updateLoading &&
                            <div className='max-w-[85%] mr-auto'>
                                <div className='px-4 py-2.5 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinKingIndex]}</div>
                            </div>
                        }

                    </div>
                    <div className='p-3 border-t border-white/10'>
                        <div className='flex gap-2'>
                            <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl  px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                            <button className='px-4 py-3  rounded-2xl bg-white text-black text-sm font-semibold' disabled={updateLoading} onClick={handleUpdateCode}><Send size={14} /></button>
                        </div>
                    </div>
                </>
            </aside>


            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-sm text-zinc-400'>Live Preview</span>
                    <div className='flex gap-2'>
                        {website.deployed ? "" : <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to bg-purple-500 text-sm font-semibold hover:scale-105 transition' onClick={handelDeploy}><Rocket size={14} />Deploy</button>}

                        <button className='p-2 lg:hidden' onClick={() => setShowChat(true)}><MessageSquare size={18} /></button>
                        <button className='p-2' onClick={() => setShowCode(true)}><Code2 size={18} /></button>
                        <button className='p-2' onClick={() => setShowFullPreview(true)}><Monitor size={18} /></button>
                    </div>
                </div>




                <iframe ref={iframeRef} className='flex-1 w-full bg-white' sandbox='allow-scripts allow-same-origin allow-forms' />
            </div>

            <AnimatePresence>
                {showChat &&
                    <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} className='fixed inset-0 z-[9999] bg-black flex flex-col'>
                        <Header onclose={() => setShowChat(false)} />
                        <>
                            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                                {messages.map((item, index) => (
                                    <div key={index} className={`max-w-[85%] ${item.role === "user" ? "ml-auto" : "mr-auto"}`}>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${item.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}>{item.content}</div>
                                    </div>
                                ))}

                                {updateLoading &&
                                    <div className='max-w-[85%] mr-auto'>
                                        <div className='px-4 py-2.5 rounded-2xl text-sm bg-white/5 border border-white/10 text-zinc-400 italic'>{thinkingSteps[thinKingIndex]}</div>
                                    </div>
                                }

                            </div>
                            <div className='p-3 border-t border-white/10'>
                                <div className='flex gap-2'>
                                    <input placeholder='Describe Changes...' className='flex-1 resize-none rounded-2xl  px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none' onChange={(e) => setPrompt(e.target.value)} value={prompt} />
                                    <button className='px-4 py-3  rounded-2xl bg-white text-black text-sm font-semibold' disabled={updateLoading} onClick={handleUpdateCode}><Send size={14} /></button>
                                </div>
                            </div>
                        </>
                    </motion.div>
                }
            </AnimatePresence>

            <AnimatePresence>
                {showCode &&
                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999] bg-[#1e1e1e1] flex flex-col' >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
                            <span className='text-sm font-medium'>index.html</span>
                            <button onClick={() => setShowCode(false)}><XIcon size={18} /></button>
                        </div>
                        <Editor
                            theme='vs-dark'
                            language='html'
                            value={code}
                            onChange={(v) => setCode(v)}
                        />
                    </motion.div>
                }
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview &&
                    <motion.div className='fixed inset-0 z-[9999] bg-black'>
                        <iframe className='w-full h-full bg-white' srcDoc={code} sandbox='allow-scripts allow-same-origin allow-forms' />
                        <button className='absolute top-4 right-6 p-2 bg-black/70 rounded-full' onClick={() => setShowFullPreview(false)}><XIcon size={18} /></button>
                    </motion.div>
                }
            </AnimatePresence>

        </div>
    )

    function Header({ onclose }) {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website.title}</span>
                {onclose && <button onClick={onclose}><XIcon size={18} className='color-white' /></button>}
            </div>
        )
    }


}



export default WebsiteCodeEditor