"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ChevronRight } from 'lucide-react';
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Candidate {
  fullName: string;
  email: string;
  gender: "male" | "female" | "other";
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  currentPosition: string;
  skills: string[];
  yearsOfExperience?: number;
  highestLevel: "high_school" | "bachelors" | "masters" | "phd";
  recruiterOwner: string;
  note?: string;
  status: "open" | "banned";
  cvAttachment: string;
}

export default function CandidatePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await fetch(`http://localhost:8089/candidate-resource-server/candidate/${params.id}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch candidate");
        }

        const data = await response.json();
        setCandidate(data);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [params.id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!candidate) {
    return <div className="p-6">Candidate not found</div>;
  }

  return (

  <div>

    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-6 px-6">
      <Link href="/candidate" className="hover:text-foreground">
        Candidate List
      </Link>
      <ChevronRight className="h-4 w-4"/>
      <span>View Candidate</span>
      </div>

      <div className="bg-white rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold">I. Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">Full name</label>
            <p className="mt-1">{candidate.fullName}</p>
          </div>

          <div>
            <label className="font-medium">Email</label>
            <p className="mt-1">{candidate.email}</p>
          </div>

          <div>
            <label className="font-medium">Date of Birth</label>
            <p className="mt-1">{format(new Date(candidate.dateOfBirth), "PPP")}</p>
          </div>

          <div>
            <label className="font-medium">Phone number</label>
            <p className="mt-1">{candidate.phoneNumber}</p>
          </div>

          <div>
            <label className="font-medium">Address</label>
            <p className="mt-1">{candidate.address}</p>
          </div>

          <div>
            <label className="font-medium">Gender</label>
            <p className="mt-1 capitalize">{candidate.gender}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg pt-0 pb-6 px-6 space-y-6">
        <h2 className="text-xl font-semibold">II. Professional Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium">CV attachment : {candidate.cvAttachment}</label>
            <p className="mt-1">
              <a 
                href={candidate.cvAttachment} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View CV
              </a>
            </p>
          </div>

          <div>
            <label className="font-medium">Current position</label>
            <p className="mt-1">{candidate.currentPosition}</p>
          </div>

          <div>
            <label className="font-medium">Skills</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {candidate.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium">Recruiter owner</label>
            <p className="mt-1">{candidate.recruiterOwner}</p>
          </div>

          <div>
            <label className="font-medium">Note</label>
            <p className="mt-1">{candidate.note || "N/A"}</p>
          </div>

          <div>
            <label className="font-medium">Status</label>
            <p className="mt-1 capitalize">{candidate.status}</p>
          </div>

          <div>
            <label className="font-medium">Years of Experience</label>
            <p className="mt-1">{candidate.yearsOfExperience || "N/A"}</p>
          </div>

          <div>
            <label className="font-medium">Highest level</label>
            <p className="mt-1 capitalize">{candidate.highestLevel.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-6">
        <Button 
          onClick={() => router.push(`/candidate/${params.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/candidate")}
        >
          Back to List
        </Button>
      </div>
    </div>
  );
}