const PROVIDER_URLS: Record<number, string> = {
  2: 'https://tv.apple.com',
  3: 'https://play.google.com/store/movies',
  8: 'https://www.netflix.com',
  9: 'https://www.primevideo.com',
  10: 'https://www.amazon.com/Amazon-Video',
  11: 'https://mubi.com',
  15: 'https://www.hulu.com',
  35: 'https://rakuten.tv',
  68: 'https://www.microsoft.com/movies-and-tv',
  119: 'https://www.primevideo.com',
  192: 'https://www.youtube.com',
  283: 'https://www.crunchyroll.com',
  337: 'https://www.disneyplus.com',
  350: 'https://tv.apple.com',
  384: 'https://www.max.com',
  386: 'https://www.peacocktv.com',
  387: 'https://www.peacocktv.com',
  531: 'https://www.paramountplus.com',
  1773: 'https://www.skyshowtime.com',
  1899: 'https://www.max.com',
};

export default function getProviderUrl(providerId: number): string | undefined {
  return PROVIDER_URLS[providerId];
}
