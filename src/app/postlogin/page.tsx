"use client";

import {useContext, useEffect, useState} from "react";
import {useLocalStorage} from "@/hooks/useLocalStorage";
import {AuthContext} from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface UsernameResponseModel {
    username: string,
}


function PostLoginPage() {
    const [authenticated, setAuthenticated] = useLocalStorage('authenticated', false);
    const [username, setUsername] = useLocalStorage('username', '');


    const [loaded, setLoaded] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const loadUsername = async () => {
            const response = await fetch('http://127.0.0.1:8080/user/username', {
                method: 'GET',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "http://127.0.0.1:3000",
                }
            })
            const json = await response.json() as UsernameResponseModel
            if(response.ok) {
                const _username = json.username
                const _authenticated = _username !== null && _username.length > 0

                setUsername(_username)
                setAuthenticated(_authenticated)

                setLoaded(true)
                router.push('/')
            } else {
                setLoaded(false)
                router.push('/login')
            }
        } 
            loadUsername()
        


    }, [])
    

    return (
        <div>
            
        </div>
    );
}

export default PostLoginPage;
