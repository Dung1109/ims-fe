"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { getCsrfToken } from "@/lib/utils/get-token";
import { useState } from "react";

interface UserDetailsProps {
    data: {
        username: string;
        fullName: string;
        email: string;
        dob?: string;
        phoneNumber?: string;
        role?: string;
        address?: string;
        gender?: string;
        department?: string;
        note?: string;
        enabled?: boolean;
    };
}

async function updateUserStatus(username: string, status: string) {
    try {
        const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json()).then((data) => data.token);

        const response = await fetch(
            `http://127.0.0.1:8080/resource-server/users/update-status/${username}?status=${status}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-Token": csrfToken,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update user status");
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
    }
}

export function UserDetails({ data }: UserDetailsProps) {
    const { toast } = useToast();
    const [isUpdating, setIsUpdating] = useState(false);
    const [enabled, setEnabled] = useState(data.enabled);

    const handleStatusUpdate = async () => {
        setIsUpdating(true);
        try {
            const newStatus = enabled ? "inactive" : "active";
            const result = await updateUserStatus(data.username, newStatus);
            
            if (result.success) {
                setEnabled(!enabled);
                toast({
                    title: "Success",
                    description: `User ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.error || "Failed to update user status",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An error occurred while updating user status",
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                <Link href="/user" className="hover:text-foreground">
                    User List
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span>User Details</span>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold">User Details</h1>
                        <button 
                            onClick={handleStatusUpdate}
                            disabled={isUpdating}
                            className={`px-4 py-2 rounded-md text-sm ${
                                enabled 
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                            } transition-colors ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isUpdating 
                                ? 'Updating...' 
                                : enabled 
                                    ? 'De-activate user' 
                                    : 'Activate user'
                            }
                        </button>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Full name</div>
                            <div>{data.fullName}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Email</div>
                            <div>{data.email}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">D.O.B</div>
                            <div>{data.dob || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Address</div>
                            <div>{data.address || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Phone number</div>
                            <div>{data.phoneNumber || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Gender</div>
                            <div>{data.gender || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Role</div>
                            <div>{data.role || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Department</div>
                            <div>{data.department || "N/A"}</div>
                        </div>

                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Status</div>
                            <div className={`inline-flex px-2 py-1 rounded-full text-sm ${
                                enabled
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {enabled ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="text-sm text-muted-foreground mb-1">Note</div>
                        <div>{data.note || "N/A"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
} 