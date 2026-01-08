-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create user_schedules table for workout schedule preferences
CREATE TABLE public.user_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('3-day', '4-day', '5-day')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_schedules ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_schedules
CREATE POLICY "Users can view own schedule" ON public.user_schedules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule" ON public.user_schedules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule" ON public.user_schedules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule" ON public.user_schedules
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_schedules_updated_at
  BEFORE UPDATE ON public.user_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();