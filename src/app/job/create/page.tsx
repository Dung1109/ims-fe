"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Autocomplete, TextField } from "@mui/material";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const skillsObject = [
    { code: "java", label: "Java" },
    { code: "flutter", label: "Flutter" },
    { code: "nodejs", label: "NodeJS" },
    { code: "system design", label: "System design" },
    { code: "react", label: "React" },
    { code: "angular", label: "Angular" },
    { code: "python", label: "Python" },
    { code: "c++", label: "C++" },
    { code: "c#", label: "C#" },
    { code: "php", label: "PHP" },
    { code: "javaScript", label: "JavaScript" },
    { code: "typeScript", label: "TypeScript" },
];

const benefitsObject = [
    { code: "health", label: "Health" },
    { code: "dental", label: "Dental" },
    { code: "vision", label: "Vision" },
    { code: "insurance", label: "Insurance" },
    { code: "retirement", label: "Retirement" },
    { code: "pension", label: "Pension" },
    { code: "other", label: "Other" },
];

const levelObject = [
    { code: "entry", label: "Entry" },
    { code: "mid", label: "Mid" },
    { code: "senior", label: "Senior" },
];

interface job {
    title: string;
    startDate: Date;
    endDate: Date;
    level: string[];
    requiredSkills: string[];
    benefits: string[];
    description: string;
    workingAddress: string;
    salaryRangeFrom: number;
    salaryRangeTo: number;
}

export default function CreateJob() {
    const router = useRouter();
    const [multipleSkills, setMultipleSkills] = useState([]);
    const [multipleBenefits, setMultipleBenefits] = useState([]);
    const [multipleLevel, setMultipleLevel] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [formData, setFormData] = useState<job>({
        title: "",
        startDate: new Date(),
        endDate: new Date(),
        level: multipleLevel,
        requiredSkills: multipleSkills,
        benefits: multipleBenefits,
        description: "",
        workingAddress: "",
        salaryRangeFrom: 0,
        salaryRangeTo: 0,
    });

    const { toast } = useToast();

    const handleMultipleChangeSkills = (event: any, value: any) => {
        const selectedSkills = value.map((option: any) => option.code);
        setMultipleSkills(selectedSkills);
        setFormData((prev) => ({
            ...prev,
            requiredSkills: selectedSkills,
        }));
    };

    const handleMultipleChangeBenefits = (event: any, value: any) => {
        const selectedBenefits = value.map((option: any) => option.code);
        setMultipleBenefits(selectedBenefits);
        setFormData((prev) => ({
            ...prev,
            benefits: selectedBenefits,
        }));
    };

    const handleMultipleChangeLevel = (event: any, value: any) => {
        const selectedLevel = value.map((option: any) => option.code);
        setMultipleLevel(selectedLevel);
        setFormData((prev) => ({
            ...prev,
            level: selectedLevel,
        }));
    };

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

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date || new Date());
        setFormData((prev) => ({
            ...prev,
            startDate: date || new Date(),
        }));
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date || new Date());
        setFormData((prev) => ({
            ...prev,
            endDate: date || new Date(),
        }));
    };

    // Hàm xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    startDate: formData.startDate
                        ? format(formData.startDate, "yyyy-MM-dd")
                        : null,
                    endDate: formData.endDate
                        ? format(formData.endDate, "yyyy-MM-dd")
                        : null,
                    requiredSkills: multipleSkills,
                    level: multipleLevel,
                    benefits: multipleBenefits,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Job created successfully!",
                    duration: 3000,
                });
            } else {
                throw new Error("Failed to create job");
            }
        } catch (error) {
            console.error("Error creating job:", error);
            toast({
                title: "Error",
                description: "Failed to create job. Please try again.",
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
                        onClick={() => router.push("/job")}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Job List
                    </button>
                    <span className="text-gray-400">›</span>
                    <span>Create Job</span>
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
                                Job title{" "}
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
                            <Label htmlFor="requiredSkills">
                                Skills <span className="text-red-500">*</span>
                            </Label>
                            <Autocomplete
                                multiple
                                options={skillsObject}
                                getOptionLabel={(option) => option.label}
                                value={skillsObject.filter((requiredSkills) =>
                                    multipleSkills.includes(requiredSkills.code)
                                )}
                                onChange={handleMultipleChangeSkills}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose skills"
                                        variant="outlined"
                                        className="bg-white"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Start date</Label>
                            <DatePicker
                                className="bg-white"
                                showIcon
                                selected={startDate}
                                onChange={handleStartDateChange}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">End date</Label>
                            <DatePicker
                                className="bg-white"
                                showIcon
                                selected={endDate}
                                onChange={handleEndDateChange}
                                dateFormat="yyyy-MM-dd"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salaryRangeFrom">
                                Salary range
                            </Label>
                            <div className="flex gap-4">
                                <Input
                                    type="number"
                                    id="salaryFrom"
                                    placeholder="From"
                                    className="bg-white"
                                    name="salaryRangeFrom"
                                    value={formData.salaryRangeFrom}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    type="number"
                                    id="salaryTo"
                                    placeholder="To"
                                    className="bg-white"
                                    name="salaryRangeTo"
                                    value={formData.salaryRangeTo}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="benefits">
                                Benefits <span className="text-red-500">*</span>
                            </Label>
                            <Autocomplete
                                multiple
                                options={benefitsObject}
                                getOptionLabel={(option) => option.label}
                                value={benefitsObject.filter((benefit) =>
                                    multipleBenefits.includes(benefit.code)
                                )}
                                onChange={handleMultipleChangeBenefits}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose benefits"
                                        variant="outlined"
                                        className="bg-white"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="workingAddress">
                                Working address{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Type a working address..."
                                className="bg-white"
                                name="workingAddress"
                                value={formData.workingAddress}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">
                                Level <span className="text-red-500">*</span>
                            </Label>
                            <Autocomplete
                                multiple
                                options={levelObject}
                                getOptionLabel={(option) => option.label}
                                value={levelObject.filter((level) =>
                                    multipleLevel.includes(level.code)
                                )}
                                onChange={handleMultipleChangeLevel}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Choose level"
                                        variant="outlined"
                                        className="bg-white"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <textarea
                                cols={50}
                                rows={5}
                                value={formData.description}
                                onChange={handleTextAreaChange}
                                className="bg-white p-2"
                                name="description"
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
                        onClick={() => router.push("/job")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
            <Toaster />
        </div>
    );
}
