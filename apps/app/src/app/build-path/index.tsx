import { BuildPathScreen } from '@/screens/build-path-screen';

// Reached from the Teacher dashboard's "Build a Learning Path" button —
// no student picked first. Starts blank with every roster student
// selected under "Assign to", so publishing fans the same path out to the
// whole class in one go (docs/DESIGN.md §4.2) instead of requiring the
// teacher to repeat the per-student build-path/[studentId] screen once
// per child.
export default function BuildPathIndexScreen() {
  return <BuildPathScreen />;
}
