import urls from '@/config/urls.json';

export function getPostUrlByFilename(filename: string) {
  return `${urls['post-prefix']}${filename}.md`;
}

export function getEssayByFilename(filename: string) {
  return `${urls['essay-prefix']}${filename}.md`;
}

export function isHttpLink(url: string) {
  return /^http(s)?:\/\//.test(url);
}
