"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Target, Calendar, Zap, AlignLeft, Briefcase } from "lucide-react";
import { createGoal, updateGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { addDays, format, isBefore, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  goal?: any;
}

const CATEGORIES = ["WORK", "HEALTH", "MIND", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];

export function AddGoalModal({ isOpen, onClose, userId, goal }: AddGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "WORK",
    targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
    xpReward: 100,
  });

  const isEdit = !!goal;

  useEffect(() => {
    if (goal) {
      setData({
        title: goal.title,
        description: goal.description || "",
        category: goal.category,
        targetDate: format(new Date(goal.targetDate), "yyyy-MM-dd"),
        xpReward: goal.xpReward,
      });
    }
  }, [goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetDate = new Date(data.targetDate);
    const minDate = addDays(new Date(), 6);
    const maxDate = addDays(new Date(), 366);

    if (!isEdit && isBefore(targetDate, minDate)) {
      return toast.error("MINIMUM 7 DAY DURATION REQUIRED");
    }
    if (isAfter(targetDate, maxDate)) {
      return toast.error("MAXIMUM 365 DAY DURATION EXCEEDED");
    }

    setLoading(true);
    try {
      if (isEdit) {
        const res = await updateGoal(goal.id, {
          ...data,
          targetDate: new Date(data.targetDate),
        }, userId);
        if (res.success) {
          toast.success("PARAMETERS UPDATED");
          onClose();
        } else {
          toast.error(res.error || "UPDATE FAILURE");
        }
      } else {
        const res = await createGoal({
          ...data,
          targetDate: new Date(data.targetDate),
        }, userId);

        if (res.success) {
          toast.success("MISSION INITIALIZED");
          onClose();
          setData({
            title: "",
            description: "",
            category: "WORK",
            targetDate: format(addDays(new Date(), 90), "yyyy-MM-dd"),
            xpReward: 100,
          });
        } else {
          toast.error(res.error || "INITIALIZATION FAILURE");
        }
      }
    } catch (error) {
      toast.error("PROTOCOL ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] animate-in fade-in duration-200" />
        <Dialog.Content className={cn(
          "fixed z-[101] bg-black border border-[#1A1A1A] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col",
          "inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:h-auto md:rounded-md p-8"
        )}>
          
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-purple rounded-full" />
              <div>
                <Dialog.Title className="text-lg font-bold text-white uppercase tracking-tight">
                  {isEdit ? "Mod Protocol" : "New Objective"}
                </Dialog.Title>
                <p className="text-[10px] text-[#4B5563] font-bold uppercase tracking-widest mt-1">
                  {isEdit ? "Recalibrate mission parameters" : "Establish a new strategic target"}
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 hover:bg-white/5 rounded transition-all text-[#4B5563] active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Identifier</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2D2D3A]" />
                <input
                  type="text"
                  required
                  placeholder="Enter objective..."
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full h-11 bg-black border border-[#1A1A1A] rounded-md pl-11 pr-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-purple/50 transition-all placeholder:text-[#2D2D3A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Documentation</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-3.5 w-3.5 h-3.5 text-[#2D2D3A]" />
                <textarea
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  rows={2}
                  placeholder="Additional mission details..."
                  className="w-full bg-black border border-[#1A1A1A] rounded-md pl-11 pr-4 py-3 text-sm font-mono text-zinc-300 focus:outline-none focus:border-purple/50 transition-all resize-none placeholder:text-[#2D2D3A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Sector</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2D2D3A] pointer-events-none" />
                  <select
                    value={data.category}
                    onChange={(e) => setData({ ...data, category: e.target.value })}
                    className="w-full h-11 bg-black border border-[#1A1A1A] rounded-md pl-11 pr-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-purple/50 transition-all appearance-none cursor-pointer uppercase"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Neutralize By</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2D2D3A] pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={data.targetDate}
                    onChange={(e) => setData({ ...data, targetDate: e.target.value })}
                    className="w-full h-11 bg-black border border-[#1A1A1A] rounded-md pl-11 pr-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-purple/50 transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">XP Yield</label>
              <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-purple/50" />
                <input
                  type="number"
                  required
                  min={50}
                  max={1000}
                  step={50}
                  value={data.xpReward}
                  onChange={(e) => setData({ ...data, xpReward: parseInt(e.target.value) })}
                  className="w-full h-11 bg-black border border-[#1A1A1A] rounded-md pl-11 pr-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-purple/50 transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-purple text-white font-bold rounded-md transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-[11px]"
              >
                {loading ? "INITIALIZING..." : (isEdit ? "Sync Changes" : "Confirm Mission")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
