import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckSquare, Plus, Edit, Trash2, User, Calendar } from "lucide-react";
import type { Task } from "@/pages/Index";

interface TaskExtractionProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskExtraction = ({ tasks, onUpdateTask }: TaskExtractionProps) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        description: newTask.trim(),
        priority: 'medium',
        completed: false
      };
      onUpdateTask(task.id, task);
      setNewTask("");
      setShowAddTask(false);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Extracted Tasks</h2>
          </div>
          <Button
            onClick={() => setShowAddTask(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{tasks.length}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-3 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{pendingTasks.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        {/* Add New Task */}
        {showAddTask && (
          <div className="p-4 border border-dashed border-primary/50 rounded-lg space-y-3">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task description..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button onClick={handleAddTask} size="sm">Add</Button>
              <Button onClick={() => setShowAddTask(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {pendingTasks.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3">PENDING TASKS</h3>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    isEditing={editingTask === task.id}
                    onEdit={setEditingTask}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-3">COMPLETED TASKS</h3>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onUpdate={onUpdateTask}
                    isEditing={editingTask === task.id}
                    onEdit={setEditingTask}
                    getPriorityColor={getPriorityColor}
                  />
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks extracted yet</p>
              <p className="text-sm">Tasks will appear here after processing</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  isEditing: boolean;
  onEdit: (taskId: string | null) => void;
  getPriorityColor: (priority: string) => string;
}

const TaskItem = ({ task, onUpdate, isEditing, onEdit, getPriorityColor }: TaskItemProps) => {
  const [editDescription, setEditDescription] = useState(task.description);

  const handleSave = () => {
    onUpdate(task.id, { description: editDescription });
    onEdit(null);
  };

  const handleCancel = () => {
    setEditDescription(task.description);
    onEdit(null);
  };

  return (
    <div className={`p-4 border rounded-lg transition-all ${
      task.completed ? 'bg-secondary/30 border-secondary' : 'bg-background border-border'
    }`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onUpdate(task.id, { completed: !!checked })}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">Save</Button>
                <Button onClick={handleCancel} variant="outline" size="sm">Cancel</Button>
              </div>
            </div>
          ) : (
            <div className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              <p className="text-sm">{task.description}</p>
            </div>
          )}
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
            
            {task.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                {task.assignee}
              </div>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        
        {!task.completed && (
          <div className="flex gap-1">
            <Button
              onClick={() => onEdit(task.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};