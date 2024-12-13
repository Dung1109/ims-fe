"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { UserDetails } from "@/components/user-details";

async function fetchUserByUsername(username: string) {
    const res = await fetch(`http://127.0.0.1:8080/resource-server/users/${username}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch user");
    }

    return res.json();
}

export default function UserPage() {
    const params = useParams();
    const username = params.username as string;

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user', username],
        queryFn: () => fetchUserByUsername(username),
    });

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (isError) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">Error loading user data</div>;
    }

    return <UserDetails data={user} />;
}

