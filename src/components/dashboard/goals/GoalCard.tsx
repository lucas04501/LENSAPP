"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { 
  Trash2, Edit3, Check
} from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { updateProgress, deleteGoal } from "@/lib/actions/goals";
import { toast } from "react-hot-toast";
import { showAchievementToast } from "../../gamification/AchievementToast";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AddGoalModal } from "./AddGoalModal";

interface GoalCardProps {
  goal: any;
  userId: string;
}

export function GoalCard({ goal, userId }: GoalCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const daysLeft = differenceInDays(new Date(goal.targetDate), new Date());
  const isOverdue = daysLeft < 0 && !goal.isCompleted;

  const handleUpdateProgress = (val: number) => {
    startTransition(async () => {
      const res = await updateProgress(goal.id, val, userId);
      if (res.success) {
        if (val === 100 && !goal.isCompleted) {
          toast.success("MISSION COMPLETE // +XP");
          res.unlockedAchievements?.forEach(showAchievementToast);
        } else {
          toast.success(`DATA SYNCED: ${val}%`);
        }
      } else {
        toast.error("DATA SYNC FAILURE");
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("TERMINATE THIS MISSION PROTOCOL?")) return;
    const res = await deleteGoal(goal.id, userId);
    if (res.success) {
      toast.success("MISSION ABORTED");
    } else {
      toast.error("TERMINATION FAILURE");
    }
  };

  return (
    <div className={cn(
      "grid grid-cols-12 gap-4 px-4 py-5 bg-black/20 border border-[#1A1A1A] backdrop-blur-sm items-center group transition-all hover:border-purple-500/50",
      goal.isCompleted && "opacity-40"
    )}>
      {/* Status Dot */}
      <div className="col-span-1 flex justify-center">
        {!goal.isCompleted ? (
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse" />
        ) : (
          <div className="w-4 h-4 rounded-sm bg-purple-600 flex items-center justify-center">
            <Check className="w-3 h-3 text-white" strokeWidth={4} />
          </div>
        )}
      </div>

      {/* Objective Params */}
      <div className="col-span-6 space-y-2">
        <h3 className={cn(
          "text-[13px] font-semibold tracking-tight transition-all",
          goal.isCompleted ? "line-through text-[#4B5563]" : "text-zinc-200"
        )}>
          {goal.title.toUpperCase()}
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-[9px] font-mono text-[#2D2D3A] uppercase tracking-widest">{goal.category}</span>
          <div className="h-[2px] flex-1 max-w-[150px] bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600/50" 
              style={{ width: `${goal.progress}%` }} 
            />
          </div>
          <span className="text-[9px] font-mono text-purple">{goal.progress}%</span>
        </div>
      </div>

      {/* Deadline */}
      <div className="col-span-2 flex flex-col items-center justify-center">
        <span className={cn(
          "text-[11px] font-mono font-semibold",
          isOverdue ? "text-red-500" : "text-zinc-400"
        )}>
          {goal.isCompleted ? "NEUTRALIZED" : format(new Date(goal.targetDate), "dd.MM.yy")}
        </span>
        {!goal.isCompleted && (
          <span className="text-[8px] font-mono text-[#2D2D3A] uppercase mt-1">
            {daysLeft} CYCLES REMAINING
          </span>
        )}
      </div>

      {/* Reward */}
      <div className="col-span-2 flex justify-center">
        <span className="text-[10px] font-mono font-bold text-purple-400/80 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
          +{goal.xpReward} XP
        </span>
      </div>

      {/* Ops */}
      <div className="col-span-1 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1.5 rounded hover:bg-white/5 text-[#4B5563] hover:text-white transition-all">
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="min-w-[140px] bg-black border border-[#1A1A1A] rounded-md p-1 shadow-2xl z-[100]">
              {!goal.isCompleted && (
                <>
                  <DropdownMenu.Item onSelect={() => handleUpdateProgress(goal.progress + 10)} className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-[#111] outline-none cursor-pointer uppercase tracking-widest">
                    Update +10%
                  </DropdownMenu.Item>
                  <DropdownMenu.Item onSelect={() => handleUpdateProgress(100)} className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-purple-400 hover:text-white hover:bg-[#111] outline-none cursor-pointer uppercase tracking-widest">
                    Complete Mission
                  </DropdownMenu.Item>
                  <div className="h-[1px] bg-[#1A1A1A] my-1" />
                </>
              )}
              <DropdownMenu.Item onSelect={() => setIsEditOpen(true)} className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-[#6B7280] hover:text-white hover:bg-[#111] outline-none cursor-pointer uppercase tracking-widest">
                Edit Parameters
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={handleDelete} className="flex items-center gap-2 px-3 py-2 rounded text-[10px] font-bold text-red-500/70 hover:text-red-500 hover:bg-red-500/5 outline-none cursor-pointer uppercase tracking-widest">
                Abort Protocol
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <AddGoalModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        userId={userId} 
        goal={goal} 
      />
    </div>
  );
}
