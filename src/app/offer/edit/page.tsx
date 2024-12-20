"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";

interface User {
    userId: number;
    userName: string;
}

interface Candidate {
    fullName: string;
    candidateId: number;
}

interface interview {
    title: string;
    interviewId: number;
}

interface offer {
    offerId: number;
    status: string;
    notes: string;
    interviewId: number;
    candidateId: number;
    userId: number;
    department: string;
    position: string;
    contractType: string;
    level: string;
    contractPeriodStart: Date;
    contractPeriodEnd: Date;
    dueDate: Date;
    baseSalary: number;
}

export default function CreateJob() {
    const router = useRouter();
    const [contractPeriodStart, setContractPeriodStart] = useState(new Date());
    const [contractPeriodEnd, setContractPeriodEnd] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [users, setUsers] = useState<User[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [interviews, setInterviews] = useState<interview[]>([]);
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [formData, setFormData] = useState<offer>({
        offerId: 0,
        status: "Pending",
        notes: "",
        interviewId: 0,
        candidateId: 0,
        userId: 0,
        department: "",
        position: "",
        contractType: "",
        level: "",
        contractPeriodStart: new Date(),
        contractPeriodEnd: new Date(),
        dueDate: new Date(),
        baseSalary: 0,
    });

    const { toast } = useToast();

    // Hàm xử lý thay đổi input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTextAreaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleContractPeriodStartChange = (date: Date | null) => {
        setContractPeriodStart(date || new Date());
        setFormData((prev) => ({
            ...prev,
            contractPeriodStart: date || new Date(),
        }));
    };

    const handleContractPeriodEndChange = (date: Date | null) => {
        setContractPeriodEnd(date || new Date());
        setFormData((prev) => ({
            ...prev,
            contractPeriodEnd: date || new Date(),
        }));
    };

    const handleDueDate = (date: Date | null) => {
        setDueDate(date || new Date());
        setFormData((prev) => ({
            ...prev,
            dueDate: date || new Date(),
        }));
    };

    const fetchUser = async () => {
        const responseUsers = await fetch(`http://localhost:8080/api/users`);
        const responseCandidates = await fetch(
            `http://localhost:8080/api/candidates`
        );
        const responseJobs = await fetch(
            `http://localhost:8080/api/interviews`
        );
        if (!responseUsers.ok || !responseCandidates.ok) {
            throw new Error("Failed to fetch users");
        }
        const dataUsers = await responseUsers.json();
        const dataCandidates = await responseCandidates.json();
        const dataInterviews = await responseJobs.json();
        setUsers(dataUsers.content);
        setCandidates(dataCandidates.content);
        setInterviews(dataInterviews.content);
    };

    const fetchOfferData = async (offerId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/offers/${offerId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch offer data");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching offer data:", error);
            return null;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchUser();
            if (id) {
                const offerData = await fetchOfferData(id);
                if (offerData) {
                    setFormData({
                        offerId: offerData.offerId || 0,
                        status: offerData.status || "",
                        notes: offerData.notes || "",
                        interviewId: offerData.interviewId || 0,
                        candidateId: offerData.candidateId || 0,
                        userId: offerData.userId || 0,
                        department: offerData.department || "",
                        position: offerData.position || "",
                        contractType: offerData.contractType || "",
                        level: offerData.level || "",
                        contractPeriodStart: offerData.contractPeriodStart
                            ? new Date(offerData.contractPeriodStart)
                            : new Date(),
                        contractPeriodEnd: offerData.contractPeriodEnd
                            ? new Date(offerData.contractPeriodEnd)
                            : new Date(),
                        dueDate: offerData.dueDate
                            ? new Date(offerData.dueDate)
                            : new Date(),
                        baseSalary: offerData.baseSalary || 0,
                    });
                    setContractPeriodStart(
                        offerData.contractPeriodStart
                            ? new Date(offerData.contractPeriodStart)
                            : new Date()
                    );
                    setContractPeriodEnd(
                        offerData.contractPeriodEnd
                            ? new Date(offerData.contractPeriodEnd)
                            : new Date()
                    );
                    setDueDate(
                        offerData.dueDate
                            ? new Date(offerData.dueDate)
                            : new Date()
                    );
                }
            }
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const jobData = {
                ...formData,
                contractPeriodStart: formData.contractPeriodStart
                    ? formData.contractPeriodStart.toISOString()
                    : null,
                contractPeriodEnd: formData.contractPeriodEnd
                    ? formData.contractPeriodEnd.toISOString()
                    : null,
                dueDate: formData.dueDate
                    ? formData.dueDate.toISOString()
                    : null,
            };

            const response = await fetch(
                `http://localhost:8080/api/offers/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(jobData),
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Offer updated successfully!",
                    duration: 3000,
                });
            } else {
                const errorData = await response.text();
                throw new Error(errorData);
            }
        } catch (error) {
            console.error("Error updating offer:", error);
            toast({
                title: "Error",
                description: "Failed to update offer. Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 text-lg">
                    <button
                        onClick={() => router.push("/offer")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Offer List
                    </button>
                    <span className="text-gray-400">›</span>
                    <span>Update offer</span>
                </div>
            </div>

            <form
                className="space-y-8 bg-[#f8f9fc] p-6 rounded-lg"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="candidate">
                                Candidate{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("candidateId", value)
                                }
                                value={String(formData.candidateId)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Candidate name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" disabled>
                                        Select candidate
                                    </SelectItem>
                                    {candidates.map((candidate) => (
                                        <SelectItem
                                            key={candidate.candidateId}
                                            value={String(
                                                candidate.candidateId
                                            )}
                                        >
                                            {candidate.fullName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contractType">
                                Contract type{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("contractType", value)
                                }
                                value={formData.contractType}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a type of contract" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="permanent">
                                        Permanent
                                    </SelectItem>
                                    <SelectItem value="fixed-term">
                                        Fixed-term
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="position">
                                Position <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("position", value)
                                }
                                value={formData.position}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a position... ex. Backend developer, ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="backend">
                                        Backend Developer
                                    </SelectItem>
                                    <SelectItem value="frontend">
                                        Frontend Developer
                                    </SelectItem>
                                    <SelectItem value="fullstack">
                                        Fullstack Developer
                                    </SelectItem>
                                    <SelectItem value="mobile">
                                        Mobile Developer
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">
                                Level <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("level", value)
                                }
                                value={formData.level}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="intern">
                                        Intern
                                    </SelectItem>
                                    <SelectItem value="fresher">
                                        Fresher
                                    </SelectItem>
                                    <SelectItem value="junior">
                                        Junior
                                    </SelectItem>
                                    <SelectItem value="senior">
                                        Senior
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="approver">
                                Approver <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("userId", value)
                                }
                                value={String(formData.userId)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select an approver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.userId}
                                            value={String(user.userId)}
                                        >
                                            {user.userName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="department">
                                Department{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("department", value)
                                }
                                value={formData.department}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="it">IT</SelectItem>
                                    <SelectItem value="finance">
                                        Finance
                                    </SelectItem>
                                    <SelectItem value="marketing">
                                        Marketing
                                    </SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interview">
                                Interview info
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("interviewId", value)
                                }
                                value={String(formData.interviewId)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Job name" />
                                </SelectTrigger>
                                <SelectContent>
                                    {interviews.map((interview) => (
                                        <SelectItem
                                            key={interview.interviewId}
                                            value={String(
                                                interview.interviewId
                                            )}
                                        >
                                            {interview.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="recruiter">
                                Recruiter Owner
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("userId", value)
                                }
                                value={String(formData.userId)}
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select an approver" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem
                                            key={user.userId}
                                            value={String(user.userId)}
                                        >
                                            {user.userName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contract">
                                Contract period{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <label
                                    htmlFor="startDate"
                                    className="text-gray-500"
                                >
                                    From
                                </label>
                                <DatePicker
                                    className="bg-white"
                                    showIcon
                                    selected={contractPeriodStart}
                                    onChange={handleContractPeriodStartChange}
                                    dateFormat="yyyy-MM-dd"
                                />
                                <label
                                    htmlFor="startDate"
                                    className="text-gray-500"
                                >
                                    To
                                </label>
                                <DatePicker
                                    className="bg-white"
                                    showIcon
                                    selected={contractPeriodEnd}
                                    onChange={handleContractPeriodEndChange}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">
                                Due date <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-4">
                                <DatePicker
                                    className="bg-white"
                                    showIcon
                                    selected={dueDate}
                                    onChange={handleDueDate}
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="baseSalary">Base salary</Label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    id="baseSalary"
                                    placeholder="Type a base salary..."
                                    className="bg-white"
                                    name="baseSalary"
                                    value={formData.baseSalary}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">
                                Notes <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                cols={70}
                                rows={5}
                                value={formData.notes}
                                onChange={handleTextAreaChange}
                                className="bg-white p-2"
                                name="notes"
                                placeholder="Type a description..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button type="submit" className="w-24">
                        Edit
                    </Button>
                    <Button
                        type="button"
                        className="w-24"
                        onClick={() => router.push("/offer")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
