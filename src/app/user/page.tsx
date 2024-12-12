"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

interface User {
    username: string;
    enabled: boolean;
    authority: string;
    full_name: string;
    email: string;
    phone_number: string;
    position: string;
    department: string;
}

async function getUsers(): Promise<User[]> {
    const res = await fetch("http://localhost:3001/users");
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");

    const {
        data: users,
        isLoading,
        isError,
    } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: getUsers,
    });

    // Filter users based on search and role
    const filteredUsers =
        users?.filter((user) => {
            const matchesSearch =
                user.full_name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole =
                selectedRole === "all" ? true : user.authority === selectedRole;
            return matchesSearch && matchesRole;
        }) || [];

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        setCurrentPage(1); // Reset to first page when changing role
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
                                    <SelectItem value="all">
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
                                    {currentUsers.map((user: User) => (
                                        <TableRow key={user.email}>
                                            <TableCell>
                                                {user.full_name}
                                            </TableCell>
                                            <TableCell>
                                                {user.username}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                {user.phone_number}
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
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div>
                                {indexOfFirstItem + 1}-
                                {Math.min(indexOfLastItem, users?.length || 0)}{" "}
                                of {users?.length || 0} rows
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
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
