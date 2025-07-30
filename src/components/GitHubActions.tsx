import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, CheckCircle, XCircle, Clock, Play } from "lucide-react";

interface GitHubActionsProps {
  workflowRuns: Array<{
    id: string;
    name: string;
    status: 'success' | 'failure' | 'pending' | 'running';
    timestamp: string;
    branch: string;
    commit: string;
  }>;
  isActive: boolean;
}

export const GitHubActions = ({ workflowRuns, isActive }: GitHubActionsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-cyber-green" />;
      case 'failure': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'running': return <Play className="w-4 h-4 text-cyber-blue animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return <Badge className="bg-cyber-green/20 text-cyber-green border-cyber-green/50">Success</Badge>;
      case 'failure': return <Badge variant="destructive">Failed</Badge>;
      case 'running': return <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50 animate-pulse">Running</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className={`p-6 bg-card border-border/50 ${isActive ? 'shadow-glow' : ''} transition-all duration-300`}>
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-5 h-5 text-cyber-blue" />
        <h3 className="text-lg font-semibold">GitHub Actions CI</h3>
        {isActive && <Badge className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50 animate-pulse">Active</Badge>}
      </div>

      <div className="space-y-3">
        {workflowRuns.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No workflow runs yet</p>
            <p className="text-sm">Trigger a command to start CI pipeline</p>
          </div>
        ) : (
          workflowRuns.map((run) => (
            <div
              key={run.id}
              className="flex items-center justify-between p-3 bg-secondary/30 rounded-md border border-border/50"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(run.status)}
                <div>
                  <div className="font-medium text-sm">{run.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {run.branch} • {run.commit} • {run.timestamp}
                  </div>
                </div>
              </div>
              {getStatusBadge(run.status)}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};