import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import ChildSelector from './components/ChildSelector';
import TaskList from './components/TaskList';
import { Child } from './lib/supabase';

function App() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Learning Adventures</h1>
          </div>
          <p className="text-gray-600">Fun tasks to help children learn and grow</p>
        </header>

        <ChildSelector
          selectedChild={selectedChild}
          onSelectChild={setSelectedChild}
        />

        <TaskList selectedChild={selectedChild} />
      </div>
    </div>
  );
}

export default App;
