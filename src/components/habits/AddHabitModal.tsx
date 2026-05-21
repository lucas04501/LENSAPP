"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Plus, Sparkles, Save } from "lucide-react";
import { createHabit, updateHabit } from "@/lib/actions/habits";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../gamification/AchievementToast";
import { cn } from "@/lib/utils";

interface AddHabitModalProps {
  userId: string;
  habit?: any;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export function AddHabitModal({ userId, habit, trigger, onSuccess }: AddHabitModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    icon: "target",
    category: "HEALTH" as any,
    targetDays: [1, 2, 3, 4, 5, 6, 7],
    targetCount: 1,
    xpReward: 10,
    color: "#7C3AED",
  });

  const isEdit = !!habit;

  useEffect(() => {
    if (habit) {
      setData({
        title: habit.title,
        icon: habit.icon || "target",
        category: habit.category,
        targetDays: habit.targetDays || [1, 2, 3, 4, 5, 6, 7],
        targetCount: habit.targetCount || 1,
        xpReward: habit.xpReward || 10,
        color: habit.color || "#7C3AED",
      });
    }
  }, [habit]);

  const categories = ["HEALTH", "MIND", "WORK", "SOCIAL", "FINANCE", "CREATIVE", "OTHER"];
  const days = [
    { label: "S", val: 1 }, { label: "T", val: 2 }, { label: "Q", val: 3 },
    { label: "Q", val: 4 }, { label: "S", val: 5 }, { label: "S", val: 6 }, { label: "D", val: 7 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        const res = await updateHabit(habit.id, userId, data);
        if (res.success) {
          toast.success("Objective updated");
          setOpen(false);
          onSuccess?.();
        } else {
          toast.error(res.error || "Update failure");
        }
      } else {
        const res = await createHabit(data, userId);
        if (res.success) {
          toast.success("Objective initialized");
          res.unlockedAchievements?.forEach(showAchievementToast);
          setOpen(false);
          setData({ ...data, title: "" });
          onSuccess?.();
        } else {
          toast.error(res.error || "Initialization failure");
        }
      }
    } catch (error) {
      toast.error("Process error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setData(prev => ({
      ...prev,
      targetDays: prev.targetDays.includes(day)
        ? prev.targetDays.filter(d => d !== day)
        : [...prev.targetDays, day]
    }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger || (
          <button className="w-full flex items-center gap-2 h-10 px-4 rounded-md border border-[#1A1A1A] border-dashed text-[#4B5563] hover:border-purple/50 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest mt-6">
            <Plus className="w-3.5 h-3.5" />
            Append New Objective
          </button>
        )}
      </Dialog.Trigger>
      
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
                  {isEdit ? "Adjust parameters for peak efficiency" : "Initialize a new neural pathway"}
                </p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 hover:bg-white/5 rounded transition-all text-[#4B5563] active:scale-95">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 flex-1">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Routine Identifier</label>
              <input
                type="text"
                required
                placeholder="Enter objective name..."
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                className="w-full h-11 bg-black border border-[#1A1A1A] rounded-md px-5 text-sm font-mono text-zinc-300 placeholder:text-[#2D2D3A] focus:outline-none focus:border-purple/50 transition-all"
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Cycle Frequency</label>
              <div className="flex justify-between gap-2">
                {days.map((day) => (
                  <button
                    key={day.val}
                    type="button"
                    onClick={() => toggleDay(day.val)}
                    className={cn(
                      "flex-1 h-9 rounded-sm text-[10px] font-bold transition-all border flex items-center justify-center uppercase",
                      data.targetDays.includes(day.val)
                        ? "bg-purple text-white border-purple"
                        : "bg-black text-[#4B5563] border-[#1A1A1A] hover:border-purple/30"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest ml-1">Classification</label>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setData({ ...data, category: cat })}
                    className={cn(
                      "h-9 px-3 rounded-sm text-[9px] font-bold transition-all border uppercase tracking-widest",
                      data.category === cat
                        ? "bg-white/5 text-white border-white/20"
                        : "bg-black text-[#4B5563] border-[#1A1A1A] hover:border-white/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !data.title}
                className="w-full h-11 bg-purple text-white font-bold rounded-md transition-all active:scale-[0.98] disabled:opacity-30 uppercase tracking-[0.2em] text-[11px]"
              >
                {loading ? "Syncing..." : (isEdit ? "Update Parameters" : "Commit Protocol")}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
