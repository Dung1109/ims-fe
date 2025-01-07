"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { useToast } from "../../hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Candidate {
    id: string;
    name: string;
    email: string;
    phoneNo: string;
    currentPosition: string;
    ownerHR: string;
    status: string;
    createdAt: string;
}

const statusOrder = [
    "Waiting for interview",
    "Waiting for approval",
    "Waiting for response",
    "Open",
    "Passed Interview",
    "Approved Offer",
    "Rejected Offer",
    "Accepted offer",
    "Declined offer",
    "Cancelled offer",
    "Failed interview",
    "Cancelled interview",
    "Banned",
];

const initialCandidates: Candidate[] = [
    {
        id: "1",
        name: "Nguyễn Khắc Hoàn",
        email: "hoannk@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm1",
        status: "Waiting for interview",
        createdAt: "2023-06-01T10:00:00Z",
    },
    {
        id: "2",
        name: "Nguyễn Minh Lương",
        email: "luongmn@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm8",
        status: "Open",
        createdAt: "2023-06-02T11:00:00Z",
    },
    {
        id: "3",
        name: "Nguyễn Văn Đại",
        email: "dainv@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm2",
        status: "Open",
        createdAt: "2023-06-03T12:00:00Z",
    },
    {
        id: "4",
        name: "Nguyễn Minh Hoàn",
        email: "hoanmn@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm2",
        status: "Waiting for interview",
        createdAt: "2023-06-04T13:00:00Z",
    },
    {
        id: "5",
        name: "Nguyễn Khắc Đại",
        email: "daink@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm4",
        status: "Passed Interview",
        createdAt: "2023-06-05T14:00:00Z",
    },
    {
        id: "6",
        name: "Nguyễn Văn Lương",
        email: "luongnv@gmail.com",
        phoneNo: "012345678",
        currentPosition: "Developer",
        ownerHR: "anhhm4",
        status: "Interviewed",
        createdAt: "2023-06-06T15:00:00Z",
    },
    {
        id: "7",
        name: "Quách Trang",
        email: "trangq@gmail.com",
        phoneNo: "012345678",
        currentPosition: "BA",
        ownerHR: "anhhm5",
        status: "Offered",
        createdAt: "2023-06-07T16:00:00Z",
    },
    {
        id: "8",
        name: "Lê Trang",
        email: "tranl@gmail.com",
        phoneNo: "012345678",
        currentPosition: "BA",
        ownerHR: "anhhm5",
        status: "Failed interview",
        createdAt: "2023-06-08T17:00:00Z",
    },
    {
        id: "9",
        name: "Huyền Trang",
        email: "trangh@gmail.com",
        phoneNo: "012345678",
        currentPosition: "BA",
        ownerHR: "anhhm5",
        status: "Declined offer",
        createdAt: "2023-06-09T18:00:00Z",
    },
    {
        id: "10",
        name: "Nguyễn Quang",
        email: "quangn@gmail.com",
        phoneNo: "012345678",
        currentPosition: "BA",
        ownerHR: "anhhm5",
        status: "Banned",
        createdAt: "2023-06-10T19:00:00Z",
    },
];

export default function CandidateList() {
    const [search, setSearch] = useState("");
    const [csrfToken, setCsrfToken] = useState("");
    const [status, setStatus] = useState("all");
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState<"recruiter" | "manager" | "admin" | "interviewer">("recruiter");
    const { toast } = useToast();

    useEffect(() => {
        fetchCandidates();
    }, [search, status]);

    const fetchCandidates = async () => {
        try {
            const queryParams = new URLSearchParams({
                pageNo: "0",
                pageSize: "100",
                filterBy: search,
                status: status === "all" ? "" : status
            });

            const response = await fetch(
                `http://127.0.0.1:8080/candidate-resource-server/candidate?${queryParams}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch candidates");
            }

            const data = await response.json();
            setCandidates(data.candidates.map((candidate: any) => ({
                id: candidate.id.toString(),
                fullName: candidate.fullName,
                email: candidate.email,
                phoneNumber: candidate.phoneNumber,
                currentPosition: candidate.currentPosition,
                recruiterOwner: candidate.recruiterOwner,
                status: candidate.status,
                createdAt: candidate.createdAt || new Date().toISOString(),
            })));
        } catch (error) {
            console.error("Error fetching candidates:", error);
            toast({
                title: "Error",
                description: "Failed to fetch candidates",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {

            const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json()).then((data) => data.token);

            const response = await fetch(
                `http://127.0.0.1:8080/candidate-resource-server/candidate/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: {
                        "X-XSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete candidate");
            }

            toast({
                title: "Success",
                description: "Candidate deleted successfully",
            });

            // Refresh the candidate list
            fetchCandidates();
        } catch (error) {
            console.error("Error deleting candidate:", error);
            toast({
                title: "Error",
                description: "Failed to delete candidate",
                variant: "destructive",
            });
        }
    };

    const handleSearch = () => {
        fetchCandidates();
    };

    const filteredCandidates = candidates
        .sort((a, b) => {
            const statusComparison =
                statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
            if (statusComparison !== 0) return statusComparison;
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Candidate</h1>
                    <h2 className="text-lg text-muted-foreground">
                        Candidate list
                    </h2>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <Input
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {statusOrder.map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleSearch}>Search</Button>
                {(userRole === "recruiter" ||
                    userRole === "manager" ||
                    userRole === "admin") && (
                    <Button asChild className="ml-auto">
                        <Link href="/candidate/add">
                            <Plus className="mr-2 h-4 w-4" /> Add new candidate
                        </Link>
                    </Button>
                )}
            </div>

            <div className="border rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="text-left p-4 font-medium">
                                    Name
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Email
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Phone No.
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Current Position
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Owner HR
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Status
                                </th>
                                <th className="text-left p-4 font-medium">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className="border-t">
                                    <td className="p-4">{candidate.fullName}</td>
                                    <td className="p-4">{candidate.email}</td>
                                    <td className="p-4">{candidate.phoneNumber}</td>
                                    <td className="p-4">
                                        {candidate.currentPosition}
                                    </td>
                                    <td className="p-4">{candidate.recruiterOwner}</td>
                                    <td className="p-4">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-full text-sm ${
                                                candidate.status === "Banned"
                                                    ? "bg-red-100 text-red-800"
                                                    : candidate.status ===
                                                      "Open"
                                                    ? "bg-green-100 text-green-800"
                                                    : candidate.status ===
                                                      "Failed interview"
                                                    ? "bg-red-100 text-red-800"
                                                    : candidate.status ===
                                                      "Declined offer"
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {candidate.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link
                                                    href={`/candidate/${candidate.id}`}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            {(userRole === "recruiter" ||
                                                userRole === "manager" ||
                                                userRole === "admin") && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/candidate/${candidate.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDelete(
                                                                candidate.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                    <span className="text-sm text-muted-foreground">
                        Showing {filteredCandidates.length} of{" "}
                        {candidates.length} candidates
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
