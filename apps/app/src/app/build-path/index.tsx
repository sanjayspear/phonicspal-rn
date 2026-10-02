import { BuildPathScreen } from '@/screens/build-path-screen';

// Reached from the Teacher dashboard's "Build a Learning Path" button.
// There's no per-student route anymore (build-path/[studentId] was
// removed) — the broadcast model (docs/DESIGN.md's CR-3) means one path
// published here reaches every parent, with no roster step in between.
export default function BuildPathIndexScreen() {
  return <BuildPathScreen />;
}
