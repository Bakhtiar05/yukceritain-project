"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";

export default function DeleteEventButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteEvent(id);
      if (res.error) {
        alert("Failed to delete event: " + res.error);
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete event"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
