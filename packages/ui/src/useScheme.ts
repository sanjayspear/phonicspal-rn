import { useColorScheme } from 'react-native';

// react-native's ColorSchemeName includes 'unspecified'/null; this project
// only ships light/dark tokens, so fold anything else down to 'light'.
export function useScheme(): 'light' | 'dark' {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}
