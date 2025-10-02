import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative";
  iconBgColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = "positive",
  iconBgColor = "bg-primary/10"
}: StatCardProps) {
  return (
    <Card className="stat-card" data-testid={`card-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${iconBgColor} rounded-lg`}>
            <Icon className="text-primary text-2xl w-6 h-6" />
          </div>
          {change && (
            <span className={`badge ${changeType === "positive" ? "badge-success" : "badge-danger"}`}>
              <span className="text-xs mr-1">
                {changeType === "positive" ? "↗" : "↘"}
              </span>
              {change}
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-1" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-label`}>
          {title}
        </p>
        <h3 className="text-3xl font-bold text-foreground" data-testid={`text-${title.toLowerCase().replace(/\s+/g, '-')}-value`}>
          {value}
        </h3>
      </CardContent>
    </Card>
  );
}
