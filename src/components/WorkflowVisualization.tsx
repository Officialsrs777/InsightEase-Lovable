import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Terminal, FileCode, Cloud, GitBranch } from "lucide-react";

interface WorkflowStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'idle' | 'processing' | 'completed' | 'error';
  description?: string;
}

interface WorkflowVisualizationProps {
  currentStep: string;
  steps: WorkflowStep[];
}

export const WorkflowVisualization = ({ currentStep, steps }: WorkflowVisualizationProps) => {
  const getStepStatus = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step?.status || 'idle';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-cyber-green';
      case 'processing': return 'bg-cyber-blue animate-pulse-glow';
      case 'error': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="secondary" className="bg-cyber-green/20 text-cyber-green border-cyber-green/50">Completed</Badge>;
      case 'processing': return <Badge variant="secondary" className="bg-cyber-blue/20 text-cyber-blue border-cyber-blue/50 animate-pulse">Processing</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-card border-border/50">
      <h3 className="text-lg font-semibold mb-6 text-cyber-blue">Workflow Pipeline</h3>
      
      <div className="space-y-6">
        {/* Step indicators */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${getStatusColor(step.status)}
                  ${step.status === 'processing' ? 'shadow-glow' : ''}
                  transition-all duration-300
                `}>
                  {step.icon}
                </div>
                <span className="text-xs mt-2 text-center max-w-16 text-muted-foreground">
                  {step.title}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-muted-foreground mx-4" />
              )}
            </div>
          ))}
        </div>

        {/* Current step details */}
        {currentStep && (
          <div className="mt-6 animate-slide-up">
            {steps.map(step => {
              if (step.id !== currentStep) return null;
              
              return (
                <Card key={step.id} className="p-4 bg-secondary/50 border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {step.icon}
                      <h4 className="font-medium">{step.title}</h4>
                    </div>
                    {getStatusBadge(step.status)}
                  </div>
                  {step.description && (
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};