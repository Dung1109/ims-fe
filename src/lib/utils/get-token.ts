"use client";

export async function getCsrfToken() {
  const response = await fetch("http://127.0.0.1:8080/resource-server/csrf", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data.csrfToken;
}
