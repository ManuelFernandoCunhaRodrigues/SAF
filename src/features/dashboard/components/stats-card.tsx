import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

type StatsCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50",
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
          >
            <Icon size={20} className={iconColor} />
          </div>
        </div>
        <p className="text-2xl font-bold text-zinc-800">{value}</p>
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
