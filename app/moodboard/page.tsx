import { Moodboard } from '@/components/Moodboard';
import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Moodboard — ProAthletica Redesign',
  noindex: true,
});

export default function MoodboardPage() {
  return <Moodboard />;
}
