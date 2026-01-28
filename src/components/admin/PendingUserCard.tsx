import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_approved: boolean;
  created_at: string;
  email?: string;
}

interface PendingUserCardProps {
  profile: UserProfile;
  processingId: string | null;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onClick: () => void;
}

const PendingUserCard = ({ 
  profile, 
  processingId, 
  onApprove, 
  onReject,
  onClick 
}: PendingUserCardProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
    >
      <div 
        className="flex items-center gap-3 cursor-pointer flex-1"
        onClick={onClick}
      >
        {profile.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt="" 
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">
              {(profile.display_name || "U")[0].toUpperCase()}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium hover:underline">
            {profile.display_name || "Sem nome"}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(profile.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onReject(profile.user_id);
          }}
          disabled={processingId === profile.user_id}
        >
          {processingId === profile.user_id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <X className="w-4 h-4 mr-1" />
              Rejeitar
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onApprove(profile.user_id);
          }}
          disabled={processingId === profile.user_id}
        >
          {processingId === profile.user_id ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4 mr-1" />
              Aprovar
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PendingUserCard;
