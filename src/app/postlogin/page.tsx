'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../hooks/useAuthStore';

export default function PostLoginPage() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUsername = useAuthStore((state) => state.setUsername);
  const router = useRouter();
  console.log('PostLoginPage');
  

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
        .then(response => {
            return response
        })
        .catch(error => {
            console.log(error)
            router.push('/login')
        })
        
        
        const json = await response?.json();
        if(response?.ok) {
            const _username = json.username
            const _authenticated = _username !== null && _username.length > 0

            setUsername(_username)
            setAuthenticated(_authenticated)

            router.push('/')
        } else {
            router.push('/login')
        }
    }

    loadUsername()
  }, []);

  return <div>Loading...</div>;
}
