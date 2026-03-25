import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'

const LiveSite = () => {
    const { id } = useParams();
    const [html, setHtml] = useState("")
    const [error, setError] = useState("")
    useEffect(() => {
        const handelWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`, { withCredentials: true })
                setHtml(result.data.latestCode)
            } catch (error) {
                console.error(error);
                setError("site not found !")
            }
        }
        handelWebsite();
    }, [id])

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>{error}</div>
        )
    }

    return (
        <iframe title='live-site' srcDoc={html} className='w-screen h-screen border-none' sandbox='allow-scripts allow-same-origin allow-forms' />
    )
}

export default LiveSite