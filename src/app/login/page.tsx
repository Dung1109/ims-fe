"use client";

import { useEffect } from "react";

export default function LoginPage() {
    const url = "http://127.0.0.1:8080/user/login"

    useEffect(() => {
        console.log('onLoad')
        window.location.href = url
    }, [url]);

    return (
        <div>
            <h1>Redirecting to OAuth2 Server</h1>
        </div>
    );

};
