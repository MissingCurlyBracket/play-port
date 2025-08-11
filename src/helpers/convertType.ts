export default function convertType(input: string): string {
  switch (input) {
    case 'movie':
      return 'Movie';
    case 'tv_series':
      return 'TV Series';
    case 'tv_movie':
      return 'TV Movie';
    default:
      return 'Unknown media type';
  }
}
