"use client";
import { CreditCard, Layers, TrendingUp, Zap } from "lucide-react";
import { toNaira } from "@/utils/format";

interface QuickStatsProps {
  totalCards: number;
  virtualCards: number;
  monthlySpend: number;
  savedThisMonth: number;
}

export default function QuickStats({
  totalCards,
  virtualCards,
  monthlySpend,
  savedThisMonth,
}: QuickStatsProps) {
  const stats = [
    {
      label: "Physical Cards",
      value: String(totalCards),
      icon: CreditCard,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Subscription Cards",
      value: String(virtualCards),
      icon: Layers,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "This Month",
      value: toNaira(monthlySpend),
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Saved (Smart)",
      value: toNaira(savedThisMonth),
      icon: Zap,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-2xl border p-4">
          <div
            className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}
          >
            <Icon size={18} />
          </div>
          <p className="text-xl font-bold text-[#1A1A2E] truncate">{value}</p>
          <p className="text-gray-500 text-xs mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}
