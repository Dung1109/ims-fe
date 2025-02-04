"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Offer {
    offerId: number;
    status: string;
    notes: string;
    candidateName: string;
    candidateEmail: string;
    approvedBy: string;
    department: string;
}

export default function Page() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchOffers();
    }, [page]);

    const fetchOffers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `http://localhost:8080/api/offers?page=${page}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const data = await response.json();
            setOffers(data.content);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError("An error occurred while fetching users");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        setPage((prevPage) => Math.max(0, prevPage - 1));
    };

    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handleShowOffer = (id: number) => {
        router.push(`/offer/details?id=${id}`);
    };

    const handleShowUpdate = (id: number) => {
        router.push(`/offer/edit?id=${id}`);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            setError(null);
            const confirmed = confirm(
                "Are you sure you want to delete this offer?"
            );
            if (!confirmed) return;
            await fetch(`http://localhost:8080/api/offers/${id}`, {
                method: "DELETE",
            });

            await fetchOffers();
            toast({
                title: "Success",
                description: "Offer deleted successfully.",
                duration: 3000,
            });

            if (offers.length === 1 && page > 0) {
                setPage((prevPage) => prevPage - 1); // Giảm trang nếu còn trang nhưng không có ứng viên
            }
        } catch (err) {
            setError("Failed to delete products");
            toast({
                title: "Error",
                description: "Failed to delete offer.",
                variant: "destructive",
                duration: 3000,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                Loading...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Search and Filter */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                </div>
                <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="waiting">
                            Waiting for interview
                        </SelectItem>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="interviewed">Interviewed</SelectItem>
                        <SelectItem value="offered">Offered</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="rejected">Offer rejected</SelectItem>
                        <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                </Select>
                <Button className="bg-primary text-primary-foreground">
                    Search
                </Button>
                <div className="flex-1" />
                <Link href="/offer/create" passHref>
                    <Button className="bg-primary text-primary-foreground">
                        Add new
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Candidate Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Approved By</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Notes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {offers.map((offer) => (
                            <TableRow key={offer.offerId}>
                                <TableCell>{offer.candidateName}</TableCell>
                                <TableCell>{offer.candidateEmail}</TableCell>
                                <TableCell>{offer.approvedBy}</TableCell>
                                <TableCell>{offer.department}</TableCell>
                                <TableCell>{offer.notes}</TableCell>
                                <TableCell>{offer.status}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleShowOffer(offer.offerId)
                                        }
                                    >
                                        <svg
                                            className=" h-4 w-4"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleShowUpdate(offer.offerId)
                                        }
                                    >
                                        <svg
                                            className=" h-4 w-4"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        </svg>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() =>
                                            handleDelete(offer.offerId)
                                        }
                                    >
                                        <svg
                                            className=" h-4 w-4"
                                            fill="none"
                                            height="24"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            width="24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M3 6h18" />
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        </svg>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-end gap-4 text-sm">
                <div>{`${page + 1}/${totalPages} pages`}</div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handlePrevPage}
                        disabled={page === 0}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
                    >
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </Button>
                </div>
            </div>
            <Toaster />
        </div>
    );
}
