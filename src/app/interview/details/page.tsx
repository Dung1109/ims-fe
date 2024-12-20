"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "@/components/ui/button";
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

export default function DetailsInterview() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
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
        setFormData((prev) => ({
            ...prev,
            scheduleStart: date || new Date(),
        }));
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setScheduleEnd(date);
        setFormData((prev) => ({
            ...prev,
            scheduleEnd: date || new Date(),
        }));
    };

    const fetchJobData = async (interviewId: string) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/interviews/${interviewId}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch candidate data");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching candidate data:", error);
            return null;
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
        const loadData = async () => {
            await fetchUser().then((r) => console.log(r));
            if (id) {
                const interviewData = await fetchJobData(id);
                if (interviewData) {
                    setFormData(interviewData);
                    setScheduleStart(
                        interviewData.scheduleStart
                            ? new Date(interviewData.scheduleStart)
                            : new Date()
                    );
                    setScheduleEnd(
                        interviewData.scheduleEnd
                            ? new Date(interviewData.scheduleEnd)
                            : new Date()
                    );
                }
            }
        };
        loadData();
    }, [id]);
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
                    <span>Interview details</span>
                </div>
            </div>

            <form className="space-y-8 bg-[#f8f9fc] p-6 rounded-lg">
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
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="job">
                                Job <span className="text-red-500">*</span>
                            </Label>
                            {jobs.length > 0 && (
                                <Select
                                    onValueChange={(value) =>
                                        handleSelectChange("jobId", value)
                                    }
                                    value={
                                        formData.jobId
                                            ? String(formData.jobId)
                                            : "default"
                                    }
                                    disabled
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
                            )}
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
                                value={
                                    formData.candidateId
                                        ? String(formData.candidateId)
                                        : undefined
                                }
                                disabled
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
                                value={
                                    formData.userId
                                        ? String(formData.userId)
                                        : undefined
                                }
                                disabled
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
                                    disabled
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
                                disabled
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
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4">
                    <Button
                        type="button"
                        className="w-24"
                        onClick={() =>
                            router.push(
                                `/interview/edit?id=${formData?.interviewId}`
                            )
                        }
                    >
                        Edit
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
        </div>
    );
}
