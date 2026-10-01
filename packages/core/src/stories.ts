// The 5 decodable stories ported verbatim from v1's js/topics.js STORIES
// array (title, icon, lines). v1 also has comprehension questions per
// story (`qs`) and a longer set of leveled PASSAGES — neither is ported
// yet; this is the "listen and follow along" slice only.

export interface Story {
  id: string;
  title: string;
  icon: string;
  lines: string[];
}

export const stories: Story[] = [
  {
    id: 'sam-the-cat',
    title: 'Sam the Cat',
    icon: '🐱',
    lines: ['Sam is a cat.', 'Sam has a red hat.', 'Sam sits on a mat.', 'The hat fell off!', 'Sam naps in the hat.'],
  },
  {
    id: 'the-big-pig',
    title: 'The Big Pig',
    icon: '🐷',
    lines: [
      'A pig digs in the mud.',
      'The pig is big and pink.',
      'A bug hops on the pig.',
      'The pig says oink!',
      'The bug runs off.',
    ],
  },
  {
    id: 'the-ship-trip',
    title: 'The Ship Trip',
    icon: '🚢',
    lines: [
      'Dad and Beth get on a ship.',
      'The ship rocks up and down.',
      'Beth can see a fish.',
      'Then a whale jumps!',
      '"Wow!" said Beth.',
    ],
  },
  {
    id: 'jake-and-the-kite',
    title: 'Jake and the Kite',
    icon: '🪁',
    lines: [
      'Jake has a kite.',
      'It is white and blue.',
      'Jake runs up the hill.',
      'The wind takes the kite up high.',
      'Jake smiles. What a fine day!',
    ],
  },
  {
    id: 'rain-in-the-park',
    title: 'Rain in the Park',
    icon: '🌧️',
    lines: [
      'It is a gray day.',
      'Rain falls on the park.',
      'Kay and Lee play in the rain.',
      'They jump in the wet mud.',
      'Then the sun comes out. Hooray!',
    ],
  },
];

export function getStory(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}
