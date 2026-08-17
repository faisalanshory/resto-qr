"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { getCustomerSessionId, clearCustomerSessionId } from "@/lib/session";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SessionSync({ tableId }: { tableId: string }) {
  const router = useRouter();

  // Poll the server for the table's active session
  const { data, error } = useSWR(`/api/tables/${tableId}/session`, fetcher, {
    refreshInterval: 10000,
  });

  useEffect(() => {
    if (data) {
      const localSessionId = getCustomerSessionId();
      const lastServerSession = sessionStorage.getItem("last-server-session");
      
      // Case 1: Server has a session, and it's different from our local session.
      // This means another device claimed the table, or the admin set it. We should adopt it.
      if (data.activeSessionId && data.activeSessionId !== localSessionId) {
        localStorage.setItem("qr-resto-session", data.activeSessionId);
        sessionStorage.setItem("last-server-session", data.activeSessionId);
        
        // Force a hard reload so all cart/order states reset to the new session
        window.location.reload();
      } 
      
      // Case 2: Server has NO session, but we have a local session.
      else if (data.activeSessionId === null) {
        if (lastServerSession === localSessionId) {
          // We were previously synced with the server, but now the server says null.
          // This means the Admin has explicitly CLEARED the table!
          clearCustomerSessionId();
          sessionStorage.removeItem("last-server-session");
          window.location.reload(); // Force full reload to regenerate a new fresh session ID
        } else {
          // We are a new session that hasn't been synced to the server yet, 
          // AND the table is currently empty on the server. Claim the table!
          fetch(`/api/tables/${tableId}/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newSessionId: localSessionId }),
          }).then(() => {
             sessionStorage.setItem("last-server-session", localSessionId);
          }).catch(console.error);
        }
      }
      
      // Case 3: Server and local are perfectly in sync. Just keep track of it.
      else if (data.activeSessionId === localSessionId) {
        sessionStorage.setItem("last-server-session", localSessionId);
      }
    }
  }, [data, tableId, router]);

  return null;
}
