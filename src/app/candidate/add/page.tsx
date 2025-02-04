"use client";
// import "@/static/controll_pressed.js";
// import "@/static/style_input.css"
import { useForm, Controller } from "react-hook-form";
import React, {useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {CalendarIcon, ChevronRight, Loader2, Option, Paperclip} from 'lucide-react';
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import * as z from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/hooks/useAuthStore";
const positions = [
  "Backend Developer",
  "Business Analyst", 
  "Tester",
  "HR",
  "Project manager",
  "Not available"
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
let recruiters = ["John Doe", "Jane Smith", "Bob Johnson"];

const candidateSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg)
    return arg
  }, z.date().max(new Date(), "Date of Birth must be in the past")),  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  cvAttachment: z.instanceof(File).refine((file) => file.size <= 25000000, `Max file size is 25MB.`),
  currentPosition: z.string().min(1, "Current position is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  yearsOfExperience: z.number().min(0).optional(),
  highestLevel: z.enum(["high_school", "bachelors", "masters", "phd"]),
  recruiterOwner: z.string().min(1, "Recruiter owner is required") && z.enum(recruiters) ,
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
  status: z.enum(["open", "banned"]).default("open"),
});

type CandidateFormData = z.infer<typeof candidateSchema>;

export default function CandidateForm() {
        const { username } = useAuthStore();

  const router = useRouter();
  const { toast } = useToast()
  const form = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      skills: [],
      status: undefined,
      highestLevel: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CandidateFormData) => {
      const formData = new FormData();
      
      // Append all fields according to the backend's @RequestParam expectations
      formData.append('cvAttachment', data.cvAttachment);


      // Append candidate as JSON to FormData
      // formData.append('candidate', JSON.stringify(candidate));

      const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
      }).then((res) => res.json()).then((data) => data.token);

      const response = await fetch("http://localhost:8089/candidate-resource-server/candidate/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          "X-XSRF-Token": csrfToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const fileUrl = await response.text();

            // Create candidate object with all fields except cvAttachment
            const candidate = {
              fullName: data.fullName,
              email: data.email,
              gender: data.gender,
              dateOfBirth: format(new Date(data.dateOfBirth), 'yyyy-MM-dd'),
              address: data.address,
              phoneNumber: data.phoneNumber,
              currentPosition: data.currentPosition,
              skills: data.skills,
              yearsOfExperience: data.yearsOfExperience,
              highestLevel: data.highestLevel,
              recruiterOwner: data.recruiterOwner,
              note: data.note,
              status: data.status,
              cvAttachment: fileUrl
            };

      const addResponse = await fetch("http://localhost:8089/candidate-resource-server/candidate/add", {
        method: "POST",
        body: JSON.stringify(candidate),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
      });

      if (!addResponse.ok) {
        throw new Error("Failed to create candidate");
      }
      return addResponse.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Candidate created successfully",
        action: <ToastAction altText="Go to candidates">Go to candidates</ToastAction>,
      });
      router.push("/candidate");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create candidate",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CandidateFormData) => {
    if (data.cvAttachment) {
      mutation.mutate(data);
    } else {
      console.error("CV attachment is missing");
    }
  };
  const [skillMap ,setskillMap] = useState([]);

  const assignMe = () => {
    // In a real application, you would get the current user's information

      if(!recruiters.includes(username))
          recruiters.push(username);
      form.setValue("recruiterOwner", username);
      document.getElementById('recruiterID').value = username;

  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground pt-6 px-6">
          <Link href="/candidate" className="hover:text-foreground">
            Candidate List
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Create Candidate</span>
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
                            ? format(new Date(field.value), "PPP")
                            : "DD/MM/YYYY"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

        <div className="bg-white rounded-lg pt-0 pb-6 px-6  space-y-6">
          <h2 className="text-xl font-semibold">
            II. Professional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cvAttachment"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>CV attachment *</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        {...field}
                      />
                      <Paperclip className="ml-2" />
                    </div>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                      <Input
                      type="text"
                      list="skills"
                      placeholder={"Select skills"}
                      onChange={(x)=>{

                          if(skills.includes(x.target.value)&& !field.value.includes(x.target.value))
                              field.onChange([...field.value, x.target.value]);
                      }}>

                      </Input>
                      <datalist id="skills">
                          {skills.map((x) => (
                              <option key={x} value={x}>
                                  {x}
                              </option>
                          ))}
                      </datalist>
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
                      <FormMessage/>
                  </FormItem>
              )}
            />

              <FormField
                  control={form.control}
                  name="recruiterOwner"
                  render={({field}) => (
                      <FormItem>
                          <FormLabel>Recruiter owner *</FormLabel>
                          <div className="flex items-center space-x-2">

                       <Input
                           id="recruiterID"
                           type="text"
                           list="myDatalist"
                           placeholder={"Select a recruiter owner"}
                           onChange={(x)=>{
                                field.onChange(x);
                           }}>

                       </Input>
                      <datalist id="myDatalist">
                          {recruiters.map((x)=> (
                              <option value={x} key={x}>
                                  {x}
                              </option>
                          ))}
                      </datalist>
                              <Button type="button" variant="outline" onClick={assignMe}>
                          Assign me
                      </Button>
                  </div>
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
                    <Textarea placeholder="N/A" {...field} maxLength={500} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select highest level..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="high_school">High school</SelectItem>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
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
            Submit
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/candidate")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}

