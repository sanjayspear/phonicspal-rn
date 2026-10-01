import { useAuth } from '@/hooks/use-auth';
import { ParentDashboard } from '@/screens/parent-dashboard';
import { SoloHome } from '@/screens/solo-home';
import { TeacherDashboard } from '@/screens/teacher-dashboard';

export default function HomeScreen() {
  const { session } = useAuth();

  switch (session?.role) {
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <SoloHome />;
  }
}
