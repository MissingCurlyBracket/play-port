export default function convertType(input: string): string {
  switch (input) {
    case 'movie':
      return 'Movie';
    case 'tv':
      return 'TV Series';
    default:
      return 'Unknown media type';
  }
}
