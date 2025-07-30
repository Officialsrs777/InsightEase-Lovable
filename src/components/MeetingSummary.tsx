import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Share, Clock } from "lucide-react";
import type { Meeting } from "@/pages/Index";

interface MeetingSummaryProps {
  meeting: Meeting;
}

export const MeetingSummary = ({ meeting }: MeetingSummaryProps) => {
  const handleExport = () => {
    const content = `
Meeting: ${meeting.title}
Date: ${new Date(meeting.timestamp).toLocaleDateString()}

SUMMARY:
${meeting.summary || 'Processing...'}

TRANSCRIPT:
${meeting.transcript}

TASKS:
${meeting.tasks?.map(task => 
  `- ${task.description} (Priority: ${task.priority})${task.assignee ? ` - Assigned to: ${task.assignee}` : ''}`
).join('\n') || 'No tasks extracted yet'}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meeting.title.replace(/[^a-z0-9]/gi, '_')}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Meeting Summary</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(meeting.status)}>
              {meeting.status}
            </Badge>
          </div>
        </div>

        {/* Meeting Info */}
        <div className="space-y-2">
          <h3 className="font-medium text-lg">{meeting.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {new Date(meeting.timestamp).toLocaleString()}
          </div>
        </div>

        {/* Summary Content */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">AI-Generated Summary</h4>
            {meeting.status === 'processing' ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Generating summary...
              </div>
            ) : meeting.summary ? (
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{meeting.summary}</p>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                No summary available
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Key Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {meeting.tasks?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Tasks Extracted</div>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {meeting.transcript.split(' ').length}
                </div>
                <div className="text-xs text-muted-foreground">Words Processed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {meeting.status === 'completed' && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};