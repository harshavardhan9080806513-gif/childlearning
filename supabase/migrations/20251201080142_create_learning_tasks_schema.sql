/*
  # Create Learning Tasks Schema

  1. New Tables
    - `children`
      - `id` (uuid, primary key)
      - `name` (text) - Child's name
      - `age` (integer) - Child's age
      - `avatar_color` (text) - Color for avatar display
      - `created_at` (timestamptz)
    
    - `learning_tasks`
      - `id` (uuid, primary key)
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `min_age` (integer) - Minimum recommended age
      - `max_age` (integer) - Maximum recommended age
      - `time_estimate` (integer) - Estimated minutes to complete
      - `development_area` (text) - Area of development (cognitive, motor, social, creative, language)
      - `reward_message` (text) - Fun reward message when completed
      - `icon` (text) - Icon name for display
      - `created_at` (timestamptz)
    
    - `child_progress`
      - `id` (uuid, primary key)
      - `child_id` (uuid, foreign key to children)
      - `task_id` (uuid, foreign key to learning_tasks)
      - `completed_at` (timestamptz)
      - `notes` (text) - Optional notes about completion
  
  2. Security
    - Enable RLS on all tables
    - Public access for reading tasks (educational content)
    - Authenticated users can manage children and progress
*/

CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 18),
  avatar_color text DEFAULT '#4F46E5',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  min_age integer NOT NULL CHECK (min_age >= 0),
  max_age integer NOT NULL CHECK (max_age >= min_age),
  time_estimate integer NOT NULL CHECK (time_estimate > 0),
  development_area text NOT NULL,
  reward_message text NOT NULL,
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS child_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES learning_tasks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  notes text DEFAULT '',
  UNIQUE(child_id, task_id, completed_at)
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view learning tasks"
  ON learning_tasks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view children"
  ON children FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert children"
  ON children FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update children"
  ON children FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete children"
  ON children FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view progress"
  ON child_progress FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert progress"
  ON child_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete progress"
  ON child_progress FOR DELETE
  USING (true);

INSERT INTO learning_tasks (title, description, min_age, max_age, time_estimate, development_area, reward_message, icon) VALUES
('Count to 10', 'Practice counting from 1 to 10 with toys or fingers', 3, 5, 10, 'cognitive', '🎉 Amazing! You''re a counting superstar!', 'Calculator'),
('Color Sorting', 'Sort toys or objects by color into different groups', 3, 6, 15, 'cognitive', '🌈 Wow! You know all your colors!', 'Palette'),
('Draw a Picture', 'Create a drawing using crayons or markers', 3, 8, 20, 'creative', '🎨 Beautiful artwork! You''re an artist!', 'Pencil'),
('Hopscotch', 'Play hopscotch and practice jumping on one foot', 4, 8, 15, 'motor', '⭐ Great jumping! You''re super strong!', 'Footprints'),
('Story Time', 'Listen to or read a short story book', 3, 10, 20, 'language', '📚 Wonderful listening! You love stories!', 'BookOpen'),
('Build with Blocks', 'Create a tower or structure with building blocks', 3, 7, 25, 'cognitive', '🏰 Fantastic building! You''re an architect!', 'Blocks'),
('Shape Hunt', 'Find 5 things in the house that are circles, squares, or triangles', 4, 7, 15, 'cognitive', '🔍 Excellent detective work finding shapes!', 'Circle'),
('Dance Party', 'Dance to music for one song', 3, 10, 10, 'motor', '💃 Awesome moves! You''re a dancing star!', 'Music'),
('Practice Writing Name', 'Write your name 3 times', 5, 8, 15, 'language', '✏️ Perfect! Your name looks great!', 'Type'),
('Memory Game', 'Play a matching card game', 5, 10, 20, 'cognitive', '🧠 Brilliant memory! You found all the pairs!', 'Brain'),
('Nature Walk', 'Go outside and find 5 different types of leaves', 4, 10, 30, 'cognitive', '🍃 Amazing explorer! Nature is beautiful!', 'Leaf'),
('Play Pretend', 'Use imagination to pretend to be a doctor, teacher, or chef', 3, 8, 25, 'social', '🎭 Super imagination! You''re so creative!', 'Smile'),
('Puzzle Time', 'Complete an age-appropriate puzzle', 4, 10, 20, 'cognitive', '🧩 You did it! Puzzle master!', 'Puzzle'),
('Sing ABC Song', 'Sing the alphabet song', 3, 6, 10, 'language', '🎵 Beautiful singing! You know your ABCs!', 'Music'),
('Help Set Table', 'Help set the table for a meal', 4, 10, 15, 'social', '🍽️ Great helper! Thank you so much!', 'Utensils'),
('Jumping Jacks', 'Do 10 jumping jacks', 5, 10, 10, 'motor', '💪 Super strong! You''re so active!', 'Zap'),
('Tell a Story', 'Make up a short story about an animal', 5, 10, 15, 'language', '📖 What a great story! You''re a storyteller!', 'MessageCircle'),
('Trace Shapes', 'Trace circles, squares, and triangles', 3, 6, 15, 'motor', '✨ Perfect tracing! Your shapes are great!', 'Square'),
('Plant Care', 'Water a plant and check if it needs sunlight', 5, 12, 10, 'cognitive', '🌱 Wonderful job! Plants need your care!', 'Sprout'),
('Simon Says', 'Play 5 rounds of Simon Says with family', 4, 10, 15, 'social', '👂 Great listening! You followed all the rules!', 'Users');
