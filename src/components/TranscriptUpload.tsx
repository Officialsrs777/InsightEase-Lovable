import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, Mic } from "lucide-react";

interface TranscriptUploadProps {
  onUpload: (transcript: string, title: string) => void;
  isProcessing: boolean;
}

export const TranscriptUpload = ({ onUpload, isProcessing }: TranscriptUploadProps) => {
  const [transcript, setTranscript] = useState("");
  const [title, setTitle] = useState("");
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim() && title.trim()) {
      onUpload(transcript.trim(), title.trim());
      setTranscript("");
      setTitle("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setTranscript(content);
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Upload Meeting Transcript</h2>
        </div>

        {/* Upload Method Selection */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === 'paste' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('paste')}
            className="flex items-center gap-2"
          >
            <Mic className="w-4 h-4" />
            Paste Text
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'file' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('file')}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Team Standup - Jan 15, 2024"
              required
            />
          </div>

          {uploadMethod === 'paste' ? (
            <div>
              <Label htmlFor="transcript">Meeting Transcript</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste your meeting transcript here..."
                className="min-h-48 resize-none"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Paste the full transcript from your meeting recording or notes
              </p>
            </div>
          ) : (
            <div>
              <Label htmlFor="file">Upload Transcript File</Label>
              <div className="mt-1">
                <input
                  id="file"
                  type="file"
                  accept=".txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upload a .txt, .doc, or .docx file containing your meeting transcript
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={!transcript.trim() || !title.trim() || isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Analyze Meeting
              </>
            )}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">What InsightEase will do:</h4>
          <ul className="space-y-1 text-xs">
            <li>• Generate an intelligent summary of key discussion points</li>
            <li>• Extract actionable tasks and decisions made</li>
            <li>• Identify participants and their contributions</li>
            <li>• Categorize tasks by priority and assignee</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};