'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../../hooks/useAuthStore';

export default function PostLoginPage() {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);
  const setUsername = useAuthStore((state) => state.setUsername);
  const setRole = useAuthStore((state) => state.setRole);
  const setDepartment = useAuthStore((state) => state.setDepartment);
  const router = useRouter();
  console.log('PostLoginPage');
  

  useEffect(() => {
    
    const loadUsername = async () => {
        const response = await fetch('http://127.0.0.1:8080/user/profile', {
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
            const _username = json.sub
            const _authenticated = _username !== null && _username.length > 0
            const _role = json.role
            const _department = json.department.toString().toUpperCase()

            setUsername(_username)
            setAuthenticated(_authenticated)
            setRole(_role)
            setDepartment(_department)
            

            router.push('/')
        } else {
            router.push('/login')
        }
    }

    loadUsername()
  }, []);

  return <div>Loading...</div>;
}
