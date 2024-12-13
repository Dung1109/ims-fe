"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, Pencil } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserinfoResponseDTO {
    username: string;
    enabled: boolean;
    authority: string;
    fullName: string;
    picture: string;
    email: string;
    emailVerified: boolean;
    gender: string;
    birthdate: string;
    phoneNumber: string;
    phoneNumberVerified: boolean;
    address: string;
    position: string;
    department: string;
    note: string;
    updatedAt: string;
    createdAt: string;
}

async function fetchUsers(page: number, size: number, search: string, role: string): Promise<{ content: UserinfoResponseDTO[], totalPages: number }> {
    const res = await fetch(`http://127.0.0.1:8080/resource-server/users?pageNo=${page}&pageSize=${size}&filterBy=${search}&filterRole=${role}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }

    return res.json();
}

export default function Page() {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("");

    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['users', currentPage, searchQuery, selectedRole],
        queryFn: () => fetchUsers(currentPage, itemsPerPage, searchQuery, selectedRole)
    });

    const users = data?.content || [];
    const totalPages = data?.totalPages || 0;

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset to first page when searching
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        setCurrentPage(0); // Reset to first page when changing role
    };

    return (
        <div className="bg-gray-50/30">
            <div className="pl-6 pt-2">
                <h1 className="text-xl font-semibold">User Management</h1>
            </div>

            <main className="p-6">
                <div className="rounded-lg bg-white border shadow-sm">
                    <div className="p-6">
                        <h2 className="text-lg font-medium mb-6">User list</h2>
                        <div className="flex gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                    className="pl-10"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                            <Select
                                value={selectedRole}
                                onValueChange={handleRoleChange}
                            >
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">
                                        All Roles
                                    </SelectItem>
                                    <SelectItem value="ROLE_ADMIN">
                                        Admin
                                    </SelectItem>
                                    <SelectItem value="ROLE_USER">
                                        User
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : isError ? (
                            <div className="text-center py-4 text-red-500">
                                Error fetching users
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Action
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user: UserinfoResponseDTO) => (
                                        <TableRow key={user.email}>
                                            <TableCell>
                                                {user.fullName}
                                            </TableCell>
                                            <TableCell>
                                                {user.username}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.phoneNumber}
                                            </TableCell>
                                            <TableCell>
                                                {user.position}
                                            </TableCell>
                                            <TableCell>
                                                {user.department}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        user.enabled
                                                            ? "bg-green-50 text-green-700"
                                                            : "bg-red-50 text-red-700"
                                                    }`}
                                                >
                                                    {user.enabled
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/user/${user.username}`}>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/user/${user.username}/edit`}>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div>
                                {currentPage * itemsPerPage + 1}-
                                {Math.min((currentPage + 1) * itemsPerPage, data?.content?.length || 0)}{" "}
                                of {data?.content?.length || 0} rows
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}