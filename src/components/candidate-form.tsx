"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarIcon, ChevronRight, Loader2, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as z from "zod";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

const positions = [
  "Backend Developer",
  "Business Analyst",
  "Tester",
  "HR",
  "Project manager",
  "Not available",
];

const skills = [
  "Java",
  "Flutter",
  "NodeJS",
  "System Design",
  "React",
  "Python",
  "AWS",
];

// const recruiters = ["John Doe", "Jane Smith", "Bob Johnson"];

const candidateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
    return arg;
  }, z.date().max(new Date(), "Date of Birth must be in the past")),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  cvAttachment: z.instanceof(File).optional(),
  cvAttachmentName: z.string().optional(),
  currentPosition: z.string().min(1, "Current position is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  yearsOfExperience: z.number().min(0).optional(),
  highestLevel: z.enum(["high_school", "bachelors", "masters", "phd"]),
  recruiterOwner: z.string().min(1, "Recruiter owner is required"),
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
  status: z.enum(["open", "banned"]).default("open"),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Partial<CandidateFormData>;
  isEditing?: boolean;
}

export function CandidateForm({
  initialData,
  isEditing = false,
}: CandidateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [showInput, setShowInput] = useState(false);

  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      skills: [],
      status: "open",
      highestLevel: undefined,
      ...initialData,
    },
  });

  useEffect(() => {
    const data = fetch("http://127.0.0.1:8080/resource-server/recruiter", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      //   .then((data) => data.recruiters)
      .then((data) => {
        setRecruiters(data);
      });

    console.log("data: ", data);

    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        const value = initialData[key as keyof CandidateFormData];
        if (key === "dateOfBirth" && value) {
          form.setValue(key, new Date(value));
        } else {
          form.setValue(key as keyof CandidateFormData, value);
        }
      });
    }
  }, [initialData, form]);

  const mutation = useMutation({
    mutationFn: async (data: CandidateFormData) => {
      const formData = new FormData();

      if (data.cvAttachment) {
        formData.append("cvAttachment", data.cvAttachment);

        const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => data.token);

        const response = await fetch(
          "http://127.0.0.1:8080/candidate-resource-server/candidate/upload",
          {
            method: "POST",
            body: formData,
            credentials: "include",
            headers: {
              "X-XSRF-Token": csrfToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload file");
        }

        const fileUploaded = await response.json();
        console.log("fileUploaded: ", fileUploaded);

        data = {
          ...data,
          cvAttachment: fileUploaded.fileUrl as unknown as File,
          cvAttachmentName: fileUploaded.fileName,
        };
      }

      const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => data.token);

      const endpoint = isEditing
        ? `http://127.0.0.1:8080/candidate-resource-server/candidate/${initialData?.id}`
        : "http://127.0.0.1:8080/candidate-resource-server/candidate/add";

      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error(
          isEditing
            ? "Failed to update candidate"
            : "Failed to create candidate"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: isEditing
          ? "Candidate updated successfully"
          : "Candidate created successfully",
        action: (
          <ToastAction altText="Go to candidates">Go to candidates</ToastAction>
        ),
      });
      router.push("/candidate");
    },
    onError: () => {
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update candidate"
          : "Failed to create candidate",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CandidateFormData) => {
    mutation.mutate(data);
  };

  const handleCancel = () => {
    router.push("/candidate");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-6 px-6">
          <Link href="/candidate" className="hover:text-foreground">
            Candidate List
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>{isEditing ? "Edit" : "Create"} Candidate</span>
        </div>

        <div className="bg-white rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold">I. Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Type a name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type an email..."
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>D.O.B *</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "DD/MM/YYYY"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Type a number..."
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="Type an address..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg pt-0 pb-6 px-6 space-y-6">
          <h2 className="text-xl font-semibold">
            II. Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cvAttachment"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>CV attachment {!isEditing && "*"}</FormLabel>
                  <FormControl>
                    {initialData?.cvAttachmentName && !showInput ? (
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          className="p-0 h-auto font-normal"
                          onClick={() => setShowInput(true)}
                        >
                          <Paperclip className="mr-2" />
                          <span>{initialData.cvAttachmentName}</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                              setShowInput(false);
                            }
                          }}
                          {...field}
                        />
                        <Paperclip className="ml-2" />
                      </div>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current position *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      if (!field.value.includes(value)) {
                        field.onChange([...field.value, value]);
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skills..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => {
                          field.onChange(
                            field.value.filter((s) => s !== skill)
                          );
                        }}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruiterOwner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruiter owner *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recruiter..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recruiters.map((recruiter) => (
                        <SelectItem
                          key={recruiter.username}
                          value={recruiter.username}
                        >
                          {recruiter.fullName} ({recruiter.username})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="N/A"
                      {...field}
                      maxLength={500}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="banned">Banned</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Type a number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="highestLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highest level *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select highest level..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high_school">High school</SelectItem>
                      <SelectItem value="bachelors">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="masters">Master Degree</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing ? "Update" : "Submit"}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
