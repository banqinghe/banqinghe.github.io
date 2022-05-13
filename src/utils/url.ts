import urls from '@/config/urls.json';

export function getPostUrlByFilename(filename: string) {
  return `${urls['post-prefix']}${filename}.md`;
}
