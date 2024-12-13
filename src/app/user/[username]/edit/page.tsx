"use client";

import { useQuery } from "@tanstack/react-query";
import { UserForm } from "@/components/user-form";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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

    const response = await res.json();

    const data = {
        ...response, 
        role: response.authority.replace('ROLE_', '').toLowerCase(),
        dob: response.birthdate
    };

    console.log(data);
    return data;
}

export default function EditUserPage() {
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

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/user" className="hover:text-foreground">
                        User List
                    </Link>
                    
                    <ChevronRight className="h-4 w-4" />
                    <span>Edit user</span>
                </div>

                <UserForm initialData={user} isEditing={true} />
            </div>
        </div>
    );
}

