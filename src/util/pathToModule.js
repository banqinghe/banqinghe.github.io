export default function pathToModule(pathname) {
  let startIndex;
  for (let i = pathname.length - 1; i >= 0; i--) {
    if (pathname[i] === '/') {
      startIndex = i + 1;
      break;
    }
  }
  const filename = pathname.substring(startIndex);
  const wordList = filename.split('-');
  return wordList
    .map(word => word[0].toUpperCase() + word.toLowerCase().substring(1))
    .join('');
}
