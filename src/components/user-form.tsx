"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { userSchema, type UserFormValues } from "@/lib/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCsrfToken } from "@/lib/utils/get-token";

async function addUser(formData: FormData) {
  const data = Object.fromEntries(formData);
  try {

    const csrfToken = await fetch("http://127.0.0.1:8080/csrf", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json()).then((data) => data.token);


    const response = await fetch(
      "http://127.0.0.1:8080/resource-server/users/add",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-Token": csrfToken,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    return { success: true, message: "User added successfully" };
  } catch (error) {
    return { success: false, message: "Failed to add user" };
  }
}

interface UserFormProps {
    initialData?: UserFormValues;
    readOnly?: boolean;
}

export function UserForm({ initialData, readOnly = false }: UserFormProps) {
    const { toast } = useToast();

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData || {
            fullName: "",
            email: "",
            dob: undefined,
            phoneNumber: "",
            role: "",
            address: "",
            gender: "",
            department: "",
            note: "",
            status: "active",
        },
    });

    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                const value = initialData[key as keyof UserFormValues];
                if (key === 'dob' && value) {
                    form.setValue(key, new Date(value));
                } else {
                    form.setValue(key as keyof UserFormValues, value);
                }
            });
        }
    }, [initialData, form]);

    const onSubmit = async (data: UserFormValues) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        const result = await addUser(formData);
        if (result.success) {
            toast({
                title: "Success",
                description: result.message,
            });
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.message,
            });
        }
    };

    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center gap-2">
                <h1 className="text-xl font-semibold">User Details</h1>
                <span className="text-muted-foreground">
                    {readOnly ? "View user" : "Edit user"}
                </span>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Full name <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Type a name..." 
                                            {...field} 
                                            disabled={readOnly}
                                        />
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
                                    <FormLabel>
                                        Email <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Type an email..." {...field} disabled={readOnly} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>D.O.B</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className={`w-full justify-start text-left font-normal ${
                                                        !field.value && "text-muted-foreground"
                                                    }`}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>DD/MM/YYYY</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => field.onChange(date)}
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
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Type a number..." {...field} disabled={readOnly} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Role <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={readOnly}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="recruiter">Recruiter</SelectItem>
                                            <SelectItem value="interviewer">Interviewer</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Type an address..." {...field} disabled={readOnly} />
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
                                    <FormLabel>
                                        Gender <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={readOnly}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Department <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={readOnly}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a department" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="it">IT</SelectItem>
                                            <SelectItem value="hr">HR</SelectItem>
                                            <SelectItem value="finance">Finance</SelectItem>
                                            <SelectItem value="communication">Communication</SelectItem>
                                            <SelectItem value="marketing">Marketing</SelectItem>
                                            <SelectItem value="accounting">Accounting</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="N/A..."
                                        className="min-h-[100px] resize-none"
                                        {...field}
                                        disabled={readOnly}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!readOnly && (
                        <div className="flex gap-4">
                            <Button type="submit">Submit</Button>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}

