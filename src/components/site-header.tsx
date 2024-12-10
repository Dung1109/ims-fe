"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CircleUserRound } from "lucide-react";

interface Csrf {
  headerName: string;
  parameterName: string;
  token: string;
}

export function SiteHeader() {
  const [csrf, setCsrf] = useState<Csrf>({
    parameterName: "",
    headerName: "",
    token: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCsrf = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/csrf", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Origin: "http://127.0.0.1:3000",
          },
        });

        if (response.ok) {
          const json = await response.json();
          setCsrf(json);
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    loadCsrf();
  }, []);

  async function handleLogout() {
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `http://127.0.0.1:8080/logout?_csrf=${csrf.token}`;
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    } catch (error) {
      console.error("Error logging out:", error);
      router.push("/login");
    }
  }

  return (
    <header className="flex h-14 items-center justify-end border-b bg-background px-6 w-full">
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <div>
            hoaank 
          </div>
          <div className="text-muted-foreground">HR Department</div>
        </div>
        <CircleUserRound />
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost">Logout</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Out</DialogTitle>
              <DialogDescription>
                Are you sure you want to log out?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
