import { useState, useEffect } from "react";
import { CLITerminal } from "@/components/CLITerminal";
import { WorkflowVisualization } from "@/components/WorkflowVisualization";
import { APIKeyInput } from "@/components/APIKeyInput";
import { GitHubActions } from "@/components/GitHubActions";
import { useToast } from "@/hooks/use-toast";
import { Terminal, FileCode, Cloud, GitBranch } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'command' | 'output' | 'error', content: string }>>([
    { type: 'output', content: 'Automation Pipeline v1.0.0' },
    { type: 'output', content: 'Type "help" to see available commands.' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    status: 'idle' | 'processing' | 'completed' | 'error';
  }>>([
    { id: 'cli', title: 'User CLI', icon: <Terminal className="w-6 h-6 text-foreground" />, status: 'idle' },
    { id: 'python', title: 'Python Script', icon: <FileCode className="w-6 h-6 text-foreground" />, status: 'idle' },
    { id: 'perplexity', title: 'Perplexity API', icon: <Cloud className="w-6 h-6 text-foreground" />, status: 'idle' },
    { id: 'github', title: 'GitHub Actions', icon: <GitBranch className="w-6 h-6 text-foreground" />, status: 'idle' },
  ]);
  const [gitHubRuns, setGitHubRuns] = useState<Array<{
    id: string;
    name: string;
    status: 'success' | 'failure' | 'pending' | 'running';
    timestamp: string;
    branch: string;
    commit: string;
  }>>([]);

  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: 'idle' | 'processing' | 'completed' | 'error') => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const simulateWorkflow = async (command: string) => {
    setIsProcessing(true);
    setCurrentStep('cli');
    updateStepStatus('cli', 'processing');

    // CLI Step
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStepStatus('cli', 'completed');
    setTerminalHistory(prev => [...prev, { type: 'output', content: '✓ Command processed' }]);

    // Python Script Step
    setCurrentStep('python');
    updateStepStatus('python', 'processing');
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStepStatus('python', 'completed');
    setTerminalHistory(prev => [...prev, { type: 'output', content: '✓ Python script executed' }]);

    // Perplexity API Step
    setCurrentStep('perplexity');
    updateStepStatus('perplexity', 'processing');
    
    if (apiKey) {
      try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
              {
                role: 'system',
                content: 'Be precise and concise. Respond as if you are processing a CLI automation command.'
              },
              {
                role: 'user',
                content: `Process this automation command: ${command}`
              }
            ],
            temperature: 0.2,
            top_p: 0.9,
            max_tokens: 200,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0]?.message?.content || 'AI processing completed';
          updateStepStatus('perplexity', 'completed');
          setTerminalHistory(prev => [...prev, { type: 'output', content: `✓ AI Response: ${aiResponse}` }]);
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        updateStepStatus('perplexity', 'error');
        setTerminalHistory(prev => [...prev, { type: 'error', content: '✗ Perplexity API error' }]);
      }
    } else {
      updateStepStatus('perplexity', 'completed');
      setTerminalHistory(prev => [...prev, { type: 'output', content: '✓ Perplexity API simulation completed' }]);
    }

    // GitHub Actions Step
    setCurrentStep('github');
    updateStepStatus('github', 'processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRun = {
      id: Date.now().toString(),
      name: 'Automation Pipeline',
      status: 'success' as const,
      timestamp: new Date().toLocaleTimeString(),
      branch: 'main',
      commit: Math.random().toString(36).substring(7)
    };
    
    setGitHubRuns(prev => [newRun, ...prev.slice(0, 4)]);
    updateStepStatus('github', 'completed');
    setTerminalHistory(prev => [...prev, { type: 'output', content: '✓ GitHub Actions workflow completed' }]);

    setCurrentStep('');
    setIsProcessing(false);
    
    toast({
      title: "Workflow Completed",
      description: "All pipeline steps executed successfully",
    });
  };

  const handleCommand = async (command: string) => {
    setTerminalHistory(prev => [...prev, { type: 'command', content: command }]);

    if (command.toLowerCase() === 'help') {
      setTerminalHistory(prev => [...prev, { 
        type: 'output', 
        content: `Available commands:
  help          - Show this help message
  run [task]    - Execute automation pipeline
  status        - Show workflow status
  clear         - Clear terminal history`
      }]);
      return;
    }

    if (command.toLowerCase() === 'clear') {
      setTerminalHistory([
        { type: 'output', content: 'Automation Pipeline v1.0.0' },
        { type: 'output', content: 'Type "help" to see available commands.' },
      ]);
      return;
    }

    if (command.toLowerCase() === 'status') {
      const activeSteps = workflowSteps.filter(step => step.status === 'processing').length;
      setTerminalHistory(prev => [...prev, { 
        type: 'output', 
        content: `Workflow Status: ${activeSteps > 0 ? 'Running' : 'Idle'}
Recent runs: ${gitHubRuns.length}
API configured: ${apiKey ? 'Yes' : 'No'}`
      }]);
      return;
    }

    if (command.toLowerCase().startsWith('run')) {
      await simulateWorkflow(command);
      return;
    }

    setTerminalHistory(prev => [...prev, { 
      type: 'error', 
      content: `Command not found: ${command}. Type "help" for available commands.`
    }]);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Automation Pipeline
          </h1>
          <p className="text-muted-foreground">
            CLI → Python Script → Perplexity Sonar API → GitHub Actions CI
          </p>
        </div>

        {/* API Configuration */}
        <APIKeyInput 
          onApiKeySet={setApiKey} 
          hasApiKey={!!apiKey}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <CLITerminal
              onCommand={handleCommand}
              history={terminalHistory}
              isProcessing={isProcessing}
            />
            
            <WorkflowVisualization
              currentStep={currentStep}
              steps={workflowSteps}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <GitHubActions
              workflowRuns={gitHubRuns}
              isActive={currentStep === 'github'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
