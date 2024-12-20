"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface User {
    userId: number;
    userName: string;
}

interface Candidate {
    fullName: string;
    candidateId: number;
}

interface job {
    title: string;
    jobId: number;
}

interface interview {
    title: string;
    candidateId: number;
    userId: number;
    jobId: number;
    scheduleStart: Date;
    scheduleEnd: Date;
    notes: string;
    meetingLink: string;
    location: string;
}

export default function CreateJob() {
    const router = useRouter();
    const [scheduleStart, setScheduleStart] = useState<Date | undefined>(
        undefined
    );
    const [scheduleEnd, setScheduleEnd] = useState<Date | undefined>(undefined);
    const [users, setUsers] = useState<User[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [jobs, setJobs] = useState<job[]>([]);
    const [formData, setFormData] = useState<interview>({
        title: "",
        candidateId: 0,
        userId: 0,
        jobId: 0,
        scheduleStart: new Date(),
        scheduleEnd: new Date(),
        notes: "",
        meetingLink: "",
        location: "",
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

    const handleStartDateChange = (date: Date | undefined) => {
        setScheduleStart(date);
        if (date) {
            setFormData((prev) => ({
                ...prev,
                scheduleStart: date,
            }));
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setScheduleEnd(date);
        if (date) {
            setFormData((prev) => ({
                ...prev,
                scheduleEnd: date,
            }));
        }
    };

    const fetchUser = async () => {
        const responseUsers = await fetch(`http://localhost:8080/api/users`);
        const responseCandidates = await fetch(
            `http://localhost:8080/api/candidates`
        );
        const responseJobs = await fetch(`http://localhost:8080/api/jobs`);
        if (!responseUsers.ok || !responseCandidates.ok) {
            throw new Error("Failed to fetch users");
        }
        const dataUsers = await responseUsers.json();
        const dataCandidates = await responseCandidates.json();
        const dataJobs = await responseJobs.json();
        setUsers(dataUsers.content);
        setCandidates(dataCandidates.content);
        setJobs(dataJobs.content);
    };

    useEffect(() => {
        fetchUser().then((r) => console.log(r));
    }, []);

    // Hàm xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/api/interviews",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        scheduleStart: formData.scheduleStart
                            ? formData.scheduleStart.toISOString()
                            : null,
                        scheduleEnd: formData.scheduleEnd
                            ? formData.scheduleEnd.toISOString()
                            : null,
                    }),
                }
            );

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Interview created successfully!",
                    duration: 3000,
                });
            } else {
                throw new Error("Failed to create job");
            }
        } catch (error) {
            console.error("Error creating job:", error);
            toast({
                title: "Error",
                description: "Failed to create interview. Please try again.",
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
                        onClick={() => router.push("/interview")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Interview List
                    </button>
                    <span className="text-gray-400">›</span>
                    <span>Create Interview</span>
                </div>
            </div>

            <form
                className="space-y-8 bg-[#f8f9fc] p-6 rounded-lg"
                onSubmit={handleSubmit}
            >
                <div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Schedule title{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Type a name..."
                                className="bg-white"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="job">
                                Job <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("jobId", value)
                                }
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Job name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" disabled>
                                        Select job
                                    </SelectItem>
                                    {jobs.map((job) => (
                                        <SelectItem
                                            key={job.jobId}
                                            value={String(job.jobId)}
                                        >
                                            {job.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="candidate">
                                Candidate{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("candidateId", value)
                                }
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
                            <Label htmlFor="recruiter">
                                Recruiter{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) =>
                                    handleSelectChange("userId", value)
                                }
                            >
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Recruiter name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" disabled>
                                        Select interviewer
                                    </SelectItem>
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
                            <Label htmlFor="dob">Schedule start date</Label>
                            <DateTimePicker
                                date={scheduleStart}
                                setDate={handleStartDateChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">End date</Label>
                            <DateTimePicker
                                date={scheduleEnd}
                                setDate={handleEndDateChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="flex gap-4">
                                <Input
                                    type="text"
                                    id="location"
                                    placeholder="Type a location..."
                                    className="bg-white"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="meetingLink">
                                Meeting link{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Type a meeting link..."
                                className="bg-white"
                                name="meetingLink"
                                value={formData.meetingLink}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">
                                Notes <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                cols={50}
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
                        Submit
                    </Button>
                    <Button
                        type="button"
                        className="w-24"
                        onClick={() => router.push("/interview")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
