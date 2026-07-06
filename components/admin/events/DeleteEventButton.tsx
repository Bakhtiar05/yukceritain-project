"use client";

import React, { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DeleteEventButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteEvent(id);
      if (res.error) {
        toast({
          title: "Gagal menghapus",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Berhasil!",
          description: "Event telah berhasil dihapus.",
        });
        setOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menghapus event.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete event"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hapus Event?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Event akan dihapus secara permanen dari sistem beserta seluruh data pendaftarannya.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <button 
            type="button" 
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Batal
          </button>
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 min-w-[100px]"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ya, Hapus"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
