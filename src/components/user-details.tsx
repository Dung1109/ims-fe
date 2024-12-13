"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface UserDetailsProps {
    data: {
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

export function UserDetails({ data }: UserDetailsProps) {
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Breadcrumb */}
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
                        <button className={`px-4 py-2 rounded-md text-sm ${
                            data.enabled 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700'
                        }`}>
                            {data.enabled ? 'De-activate user' : 'Activate user'}
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
                                data.enabled === true
                                    ? 'bg-green-50 text-green-700' 
                                    : 'bg-red-50 text-red-700'
                            }`}>
                                {data.enabled ? 'Active' : 'Inactive'}
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