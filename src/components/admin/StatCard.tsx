import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?: string;
}

const StatCard = ({ title, value, icon: Icon, iconColor = "text-blue-600", bgColor = "bg-blue-50" }: StatCardProps) => {
    return (
        <Card className="shadow-sm border-gray-100">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">{title}</p>
                        <p className="text-2xl font-bold text-white">{value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${bgColor}`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatCard;
