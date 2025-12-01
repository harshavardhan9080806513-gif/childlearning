import { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { supabase, Child } from '../lib/supabase';

type ChildSelectorProps = {
  selectedChild: Child | null;
  onSelectChild: (child: Child) => void;
};

export default function ChildSelector({ selectedChild, onSelectChild }: ChildSelectorProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    const { data } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setChildren(data);
      if (data.length > 0 && !selectedChild) {
        onSelectChild(data[0]);
      }
    }
  }

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();

    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const { data } = await supabase
      .from('children')
      .insert([{
        name: newName,
        age: parseInt(newAge),
        avatar_color: randomColor
      }])
      .select()
      .single();

    if (data) {
      setChildren([data, ...children]);
      onSelectChild(data);
      setNewName('');
      setNewAge('');
      setShowAddForm(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Select Child</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => onSelectChild(child)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
              selectedChild?.id === child.id
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: child.avatar_color }}
            >
              {child.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="font-semibold">{child.name}</div>
              <div className="text-xs opacity-75">{child.age} years old</div>
            </div>
          </button>
        ))}

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          Add Child
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddChild} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Child's name"
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                required
                min="0"
                max="18"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Age"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
