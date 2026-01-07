-- Add UPDATE policy for exercise_logs
CREATE POLICY "Users can update own exercise logs" ON public.exercise_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs wl 
      WHERE wl.id = exercise_logs.workout_log_id 
      AND wl.user_id = auth.uid()
    )
  );

-- Add DELETE policy for exercise_logs
CREATE POLICY "Users can delete own exercise logs" ON public.exercise_logs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs wl 
      WHERE wl.id = exercise_logs.workout_log_id 
      AND wl.user_id = auth.uid()
    )
  );