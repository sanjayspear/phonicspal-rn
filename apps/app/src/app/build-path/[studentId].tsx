import { useLocalSearchParams } from 'expo-router';

import { BuildPathScreen } from '@/screens/build-path-screen';

// Reached by tapping one roster row — preloads that student's existing
// path and preselects just them to publish to, for a quick one-off edit.
// The class-wide builder (apps/app/src/app/build-path/index.tsx) is the
// same screen with no initialStudentId.
export default function BuildPathForStudentScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  return <BuildPathScreen initialStudentId={studentId} />;
}
