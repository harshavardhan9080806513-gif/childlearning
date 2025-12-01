import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Child = {
  id: string;
  name: string;
  age: number;
  avatar_color: string;
  created_at: string;
};

export type LearningTask = {
  id: string;
  title: string;
  description: string;
  min_age: number;
  max_age: number;
  time_estimate: number;
  development_area: string;
  reward_message: string;
  icon: string;
  created_at: string;
};

export type ChildProgress = {
  id: string;
  child_id: string;
  task_id: string;
  completed_at: string;
  notes: string;
};
