function transToCamelCase(words: string) {
  return words.split('-').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join('');
}

export default transToCamelCase;
