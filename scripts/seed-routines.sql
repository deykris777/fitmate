-- Seed exercise routines with default data
INSERT INTO exercise_routines (name, description, difficulty, duration_minutes, exercises) VALUES
(
  'Beginner Full Body',
  'Perfect for those starting their fitness journey',
  'beginner',
  45,
  '[
    {"name": "Warm-up Cardio", "reps": "5 minutes", "description": "Light jog or brisk walk"},
    {"name": "Bodyweight Squats", "reps": "3 x 15", "description": "Keep chest up, full range of motion"},
    {"name": "Push-ups", "reps": "3 x 8", "description": "Modify on knees if needed"},
    {"name": "Lunges", "reps": "3 x 10 each leg", "description": "Alternate legs, deep stretch"},
    {"name": "Plank", "reps": "3 x 30 seconds", "description": "Keep body straight"},
    {"name": "Cool-down Stretching", "reps": "10 minutes", "description": "Full body stretch"}
  ]'
),
(
  'Intermediate Strength',
  'Build muscle with compound movements',
  'intermediate',
  60,
  '[
    {"name": "Warm-up", "reps": "10 minutes", "description": "Cardio and dynamic stretching"},
    {"name": "Barbell Squats", "reps": "4 x 6-8", "description": "Progressive weight"},
    {"name": "Bench Press", "reps": "4 x 6-8", "description": "Control the descent"},
    {"name": "Barbell Rows", "reps": "4 x 6-8", "description": "Explosive pull"},
    {"name": "Deadlifts", "reps": "3 x 5", "description": "Perfect form priority"},
    {"name": "Cool-down", "reps": "5 minutes", "description": "Static stretching"}
  ]'
),
(
  'Advanced HIIT',
  'High intensity interval training for maximum results',
  'advanced',
  40,
  '[
    {"name": "Warm-up", "reps": "5 minutes", "description": "Light cardio"},
    {"name": "Burpees", "reps": "8 x 30 seconds on/30 off", "description": "Full power"},
    {"name": "Mountain Climbers", "reps": "8 x 30 seconds on/30 off", "description": "Fast pace"},
    {"name": "Jump Squats", "reps": "8 x 30 seconds on/30 off", "description": "Explosive"},
    {"name": "Push-up to T", "reps": "8 x 30 seconds on/30 off", "description": "Core rotation"},
    {"name": "Cool-down", "reps": "5 minutes", "description": "Walking and stretching"}
  ]'
),
(
  'Upper Body Focus',
  'Target chest, back, shoulders, and arms',
  'intermediate',
  50,
  '[
    {"name": "Warm-up", "reps": "10 minutes", "description": "Light cardio"},
    {"name": "Incline Bench Press", "reps": "4 x 8", "description": "30 degree angle"},
    {"name": "Lat Pulldowns", "reps": "4 x 8", "description": "Full range motion"},
    {"name": "Shoulder Press", "reps": "3 x 10", "description": "Control and pause"},
    {"name": "Barbell Curls", "reps": "3 x 8", "description": "Strict form"},
    {"name": "Tricep Dips", "reps": "3 x 10", "description": "Full depth"},
    {"name": "Cool-down", "reps": "5 minutes", "description": "Stretching"}
  ]'
),
(
  'Lower Body Specialist',
  'Build powerful legs and glutes',
  'intermediate',
  55,
  '[
    {"name": "Warm-up", "reps": "10 minutes", "description": "Foam roll and dynamic stretches"},
    {"name": "Front Squats", "reps": "4 x 8", "description": "Deep squat"},
    {"name": "Romanian Deadlifts", "reps": "3 x 10", "description": "Hamstring stretch"},
    {"name": "Bulgarian Split Squats", "reps": "3 x 10 each", "description": "Balance and power"},
    {"name": "Leg Curls", "reps": "3 x 12", "description": "Controlled tempo"},
    {"name": "Calf Raises", "reps": "3 x 15", "description": "Full range"},
    {"name": "Cool-down", "reps": "5 minutes", "description": "Static stretches"}
  ]'
),
(
  'CrossFit Inspired',
  'Functional fitness with varied movements',
  'advanced',
  75,
  '[
    {"name": "Warm-up", "reps": "15 minutes", "description": "Joint mobility work"},
    {"name": "Kettlebell Swings", "reps": "5 x 15", "description": "Explosive hip drive"},
    {"name": "Box Jumps", "reps": "5 x 5", "description": "Maximum height"},
    {"name": "Medicine Ball Slams", "reps": "4 x 10", "description": "Full power"},
    {"name": "Rope Climbs", "reps": "4 x 3", "description": "Legs assisted if needed"},
    {"name": "Tire Flips", "reps": "3 x 5", "description": "Proper technique"},
    {"name": "Cool-down", "reps": "5 minutes", "description": "Active recovery"}
  ]'
);
