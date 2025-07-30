import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface CLITerminalProps {
  onCommand: (command: string) => void;
  history: Array<{ type: 'command' | 'output' | 'error', content: string }>;
  isProcessing: boolean;
}

export const CLITerminal = ({ onCommand, history, isProcessing }: CLITerminalProps) => {
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onCommand(input.trim());
      setInput("");
    }
  };

  return (
    <Card className="bg-terminal p-0 border-border/50 shadow-glow overflow-hidden">
      <div className="bg-gradient-terminal p-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-cyber-green"></div>
          <span className="text-terminal-foreground text-sm font-mono ml-2">CLI Terminal</span>
        </div>
      </div>
      
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 bg-terminal font-mono text-sm"
      >
        {history.map((item, index) => (
          <div key={index} className="mb-1">
            {item.type === 'command' ? (
              <div className="text-cyber-blue">
                <span className="text-cyber-green">$</span> {item.content}
              </div>
            ) : item.type === 'error' ? (
              <div className="text-destructive">{item.content}</div>
            ) : (
              <div className="text-terminal-foreground whitespace-pre-wrap">{item.content}</div>
            )}
          </div>
        ))}
        
        {isProcessing && (
          <div className="text-cyber-blue animate-pulse">
            <span className="text-cyber-green">$</span> Processing...
            <span className="animate-blink">|</span>
          </div>
        )}
        
        {!isProcessing && (
          <form onSubmit={handleSubmit} className="flex items-center text-cyber-blue">
            <span className="text-cyber-green mr-1">$</span>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none p-0 text-cyber-blue focus:ring-0 focus:ring-offset-0 font-mono placeholder:text-muted-foreground"
              placeholder="Enter command..."
              autoFocus
            />
          </form>
        )}
      </div>
    </Card>
  );
};