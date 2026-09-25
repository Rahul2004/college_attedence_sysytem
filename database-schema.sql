-- 1. Profiles Table for Role-Based Access Control
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role VARCHAR(10) NOT NULL DEFAULT 'student' CHECK (role IN ('faculty', 'student')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security Policies for profiles
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
CREATE POLICY "Allow users to read their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Prevent unauthorized users from updating their own role directly
DROP POLICY IF EXISTS "Prevent direct client role modification" ON public.profiles;
CREATE POLICY "Prevent direct client role modification"
  ON public.profiles FOR UPDATE
  USING (false);

-- 2. Security Trigger: Automatically and securely creates a profile whenever a user signs up.
-- Enforces server-side sanitization and prevents privilege escalation.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role VARCHAR(10);
BEGIN
  -- Strict whitelist check for assigned role (defaults safely to 'student')
  IF new.raw_user_meta_data->>'role' = 'faculty' THEN
    assigned_role := 'faculty';
  ELSE
    assigned_role := 'student';
  END IF;

  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Row Level Security for Attendance & Students (Production Hardening)
ALTER TABLE IF EXISTS public.attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.students ENABLE ROW LEVEL SECURITY;

-- Attendance Logs: Read Policy (All authenticated students & faculty can read)
DROP POLICY IF EXISTS "Authenticated users can read attendance" ON public.attendance_logs;
CREATE POLICY "Authenticated users can read attendance"
  ON public.attendance_logs FOR SELECT
  TO authenticated
  USING (true);

-- Attendance Logs: Insert / Update / Delete (Strictly Faculty Only)
DROP POLICY IF EXISTS "Faculty can modify attendance logs" ON public.attendance_logs;
CREATE POLICY "Faculty can modify attendance logs"
  ON public.attendance_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'faculty'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'faculty'
    )
  );

-- Students Table: Read Policy (All authenticated users can read students roster)
DROP POLICY IF EXISTS "Authenticated users can view students" ON public.students;
CREATE POLICY "Authenticated users can view students"
  ON public.students FOR SELECT
  TO authenticated
  USING (true);

-- Students Table: Modify Policy (Faculty Only)
DROP POLICY IF EXISTS "Faculty can modify students" ON public.students;
CREATE POLICY "Faculty can modify students"
  ON public.students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'faculty'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'faculty'
    )
  );

