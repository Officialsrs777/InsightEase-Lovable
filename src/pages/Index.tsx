import { useState } from "react";
import { TranscriptUpload } from "@/components/TranscriptUpload";
import { MeetingSummary } from "@/components/MeetingSummary";
import { TaskExtraction } from "@/components/TaskExtraction";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { useToast } from "@/hooks/use-toast";

export interface Meeting {
  id: string;
  title: string;
  transcript: string;
  summary?: string;
  tasks?: Task[];
  timestamp: string;
  status: 'processing' | 'completed' | 'error';
}

export interface Task {
  id: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  completed: boolean;
}

const Index = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleTranscriptUpload = async (transcript: string, title: string) => {
    const meeting: Meeting = {
      id: Date.now().toString(),
      title,
      transcript,
      timestamp: new Date().toISOString(),
      status: 'processing'
    };

    setMeetings(prev => [meeting, ...prev]);
    setCurrentMeeting(meeting);
    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const summary = await generateSummary(transcript);
      const tasks = await extractTasks(transcript);

      const updatedMeeting = {
        ...meeting,
        summary,
        tasks,
        status: 'completed' as const
      };

      setMeetings(prev => prev.map(m => m.id === meeting.id ? updatedMeeting : m));
      setCurrentMeeting(updatedMeeting);
      
      toast({
        title: "Processing Complete",
        description: "Meeting transcript has been analyzed successfully",
      });
    } catch (error) {
      const errorMeeting = { ...meeting, status: 'error' as const };
      setMeetings(prev => prev.map(m => m.id === meeting.id ? errorMeeting : m));
      setCurrentMeeting(errorMeeting);
      
      toast({
        title: "Processing Failed",
        description: "Failed to analyze the meeting transcript",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSummary = async (transcript: string): Promise<string> => {
    // Simulate AI summarization
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock summary generation
    const sentences = transcript.split('.').filter(s => s.trim().length > 0);
    const keyPoints = sentences.slice(0, 3).map(s => s.trim()).join('. ');
    return `Key Discussion Points: ${keyPoints}. The meeting covered important strategic decisions and next steps for the project.`;
  };

  const extractTasks = async (transcript: string): Promise<Task[]> => {
    // Simulate AI task extraction
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock task extraction
    const mockTasks: Task[] = [
      {
        id: Date.now().toString(),
        description: "Follow up on project timeline discussion",
        priority: 'high',
        completed: false
      },
      {
        id: (Date.now() + 1).toString(),
        description: "Prepare quarterly review presentation",
        priority: 'medium',
        completed: false
      },
      {
        id: (Date.now() + 2).toString(),
        description: "Schedule follow-up meeting with stakeholders",
        priority: 'low',
        completed: false
      }
    ];
    
    return mockTasks;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentMeeting) return;
    
    const updatedTasks = currentMeeting.tasks?.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    const updatedMeeting = { ...currentMeeting, tasks: updatedTasks };
    setCurrentMeeting(updatedMeeting);
    setMeetings(prev => prev.map(m => m.id === currentMeeting.id ? updatedMeeting : m));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            InsightEase
          </h1>
          <p className="text-muted-foreground">
            AI-powered meeting intelligence that automatically summarizes transcripts and extracts actionable tasks
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <TranscriptUpload 
              onUpload={handleTranscriptUpload}
              isProcessing={isProcessing}
            />
            
            {isProcessing && (
              <ProcessingStatus />
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {currentMeeting && (
              <>
                <MeetingSummary 
                  meeting={currentMeeting}
                />
                
                {currentMeeting.tasks && (
                  <TaskExtraction
                    tasks={currentMeeting.tasks}
                    onUpdateTask={updateTask}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Meeting History */}
        {meetings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Meetings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meetings.map(meeting => (
                <div
                  key={meeting.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => setCurrentMeeting(meeting)}
                >
                  <h3 className="font-medium truncate">{meeting.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(meeting.timestamp).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
