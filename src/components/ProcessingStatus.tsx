import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, FileText, CheckSquare, Sparkles } from "lucide-react";

export const ProcessingStatus = () => {
  const steps = [
    { id: 'upload', title: 'Transcript Received', icon: FileText, completed: true },
    { id: 'analyze', title: 'AI Analysis', icon: Brain, completed: false, active: true },
    { id: 'summarize', title: 'Generating Summary', icon: Sparkles, completed: false },
    { id: 'extract', title: 'Extracting Tasks', icon: CheckSquare, completed: false },
  ];

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Processing Meeting</h3>
          <p className="text-sm text-muted-foreground">
            Our AI is analyzing your transcript to extract insights
          </p>
        </div>

        <div className="space-y-4">
          <Progress value={25} className="h-2" />
          
          <div className="space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    step.active 
                      ? 'bg-primary/10 border border-primary/20' 
                      : step.completed 
                        ? 'bg-secondary/50' 
                        : 'bg-secondary/20'
                  }`}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${step.completed 
                      ? 'bg-green-500 text-white' 
                      : step.active 
                        ? 'bg-primary text-primary-foreground animate-pulse' 
                        : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      step.active ? 'text-primary' : step.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                    {step.active && (
                      <div className="text-xs text-muted-foreground">
                        Processing...
                      </div>
                    )}
                  </div>
                  
                  {step.active && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                  )}
                  
                  {step.completed && (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This usually takes 30-60 seconds depending on transcript length
          </p>
        </div>
      </div>
    </Card>
  );
};