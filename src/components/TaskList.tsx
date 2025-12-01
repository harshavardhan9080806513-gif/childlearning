import { useState, useEffect } from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase, Child, LearningTask, ChildProgress } from '../lib/supabase';

type TaskListProps = {
  selectedChild: Child | null;
};

export default function TaskList({ selectedChild }: TaskListProps) {
  const [tasks, setTasks] = useState<LearningTask[]>([]);
  const [progress, setProgress] = useState<ChildProgress[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [showReward, setShowReward] = useState<string | null>(null);

  const developmentAreas = [
    { value: 'all', label: 'All Areas', color: 'bg-gray-500' },
    { value: 'cognitive', label: 'Cognitive', color: 'bg-blue-500' },
    { value: 'motor', label: 'Physical', color: 'bg-green-500' },
    { value: 'social', label: 'Social', color: 'bg-pink-500' },
    { value: 'creative', label: 'Creative', color: 'bg-purple-500' },
    { value: 'language', label: 'Language', color: 'bg-orange-500' },
  ];

  useEffect(() => {
    if (selectedChild) {
      loadTasks();
      loadProgress();
    }
  }, [selectedChild]);

  async function loadTasks() {
    if (!selectedChild) return;

    const { data } = await supabase
      .from('learning_tasks')
      .select('*')
      .lte('min_age', selectedChild.age)
      .gte('max_age', selectedChild.age)
      .order('title');

    if (data) {
      setTasks(data);
    }
  }

  async function loadProgress() {
    if (!selectedChild) return;

    const { data } = await supabase
      .from('child_progress')
      .select('*')
      .eq('child_id', selectedChild.id);

    if (data) {
      setProgress(data);
    }
  }

  async function handleCompleteTask(task: LearningTask) {
    if (!selectedChild) return;

    const { data } = await supabase
      .from('child_progress')
      .insert([{
        child_id: selectedChild.id,
        task_id: task.id
      }])
      .select()
      .single();

    if (data) {
      setProgress([...progress, data]);
      setShowReward(task.reward_message);
      setTimeout(() => setShowReward(null), 4000);
    }
  }

  function isTaskCompleted(taskId: string) {
    return progress.some(p => p.task_id === taskId);
  }

  function getTaskCompletionCount(taskId: string) {
    return progress.filter(p => p.task_id === taskId).length;
  }

  const filteredTasks = selectedArea === 'all'
    ? tasks
    : tasks.filter(t => t.development_area === selectedArea);

  function getIconComponent(iconName: string) {
    const IconComponent = (Icons as any)[iconName] || Icons.BookOpen;
    return IconComponent;
  }

  const areaStats = developmentAreas.slice(1).map(area => {
    const areaTasks = tasks.filter(t => t.development_area === area.value);
    const completed = areaTasks.filter(t => isTaskCompleted(t.id)).length;
    return {
      ...area,
      total: areaTasks.length,
      completed
    };
  });

  if (!selectedChild) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg">Please select or add a child to see learning tasks</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showReward && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg p-6 shadow-lg animate-bounce">
          <p className="text-2xl font-bold text-center">{showReward}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Development Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {areaStats.map(area => (
            <div key={area.value} className="text-center">
              <div className={`${area.color} text-white rounded-lg p-3 mb-2`}>
                <div className="text-2xl font-bold">{area.completed}</div>
                <div className="text-xs">of {area.total}</div>
              </div>
              <div className="text-sm font-medium text-gray-700">{area.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {developmentAreas.map(area => (
            <button
              key={area.value}
              onClick={() => setSelectedArea(area.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedArea === area.value
                  ? `${area.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const IconComponent = getIconComponent(task.icon);
            const completionCount = getTaskCompletionCount(task.id);
            const isCompleted = isTaskCompleted(task.id);

            return (
              <div
                key={task.id}
                className={`border-2 rounded-lg p-4 transition-all ${
                  isCompleted
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-green-200' : 'bg-blue-100'
                  }`}>
                    <IconComponent size={24} className={
                      isCompleted ? 'text-green-700' : 'text-blue-700'
                    } />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{task.title}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Clock size={14} />
                      <span>{task.time_estimate} min</span>
                    </div>
                  </div>
                  {completionCount > 0 && (
                    <div className="bg-green-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                      ×{completionCount}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 capitalize">
                    {task.development_area}
                  </span>
                  <button
                    onClick={() => handleCompleteTask(task)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors ${
                      isCompleted
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                    {isCompleted ? 'Complete Again' : 'Complete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks available for this age and category</p>
          </div>
        )}
      </div>
    </div>
  );
}
