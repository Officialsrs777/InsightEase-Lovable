import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, AlertCircle } from "lucide-react";

interface APIKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

export const APIKeyInput = ({ onApiKeySet, hasApiKey }: APIKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setShowKey(false);
    }
  };

  if (hasApiKey) {
    return (
      <Card className="p-4 bg-secondary/50 border-border/50">
        <div className="flex items-center gap-2 text-sm text-cyber-green">
          <Key className="w-4 h-4" />
          <span>Perplexity API Key configured</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-cyber-blue" />
          <h3 className="text-lg font-semibold">API Configuration</h3>
        </div>
        
        <Alert className="border-cyber-blue/50 bg-cyber-blue/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            This project is not connected to Supabase. Please enter your Perplexity API key to continue.
            You can get one from <a href="https://perplexity.ai" target="_blank" className="text-cyber-blue hover:underline">perplexity.ai</a>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apiKey" className="text-sm font-medium">
              Perplexity API Key
            </Label>
            <Input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pplx-xxxxxxxxxxxxxxxxxxxxx"
              className="mt-1 bg-terminal border-border/50 focus:border-cyber-blue"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showKey ? "Hide" : "Show"} API Key
            </Button>
            
            <Button 
              type="submit" 
              disabled={!apiKey.trim()}
              className="bg-gradient-primary hover:opacity-90"
            >
              Configure API
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};