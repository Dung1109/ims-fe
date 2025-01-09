"use client";

import { useQuery } from "@tanstack/react-query";
import { CandidateForm } from "@/components/candidate-form";

export default function CandidateEditPage({ params }: { params: { id: string } }) {
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['candidate', params.id],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8080/candidate-resource-server/candidate/${params.id}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error('Failed to fetch candidate');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-destructive">Failed to load candidate data</div>
      </div>
    );
  }

  return <CandidateForm initialData={initialData} isEditing />;
}