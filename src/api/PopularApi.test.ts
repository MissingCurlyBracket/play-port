import { expect } from 'chai';
import PopularApi, { type PopularTitle } from './PopularApi';

const makeFetchResponse = (body: unknown, ok = true, statusText = 'OK') =>
  ({
    ok,
    statusText,
    json: async () => body,
  }) as Response;

describe('PopularApi', () => {
  let fetchStub: ReturnType<typeof vi.fn>;
  let api: PopularApi;

  beforeEach(() => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.com');
    fetchStub = vi.fn();
    vi.stubGlobal('fetch', fetchStub);
    api = new PopularApi();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('builds URL without query params when region and providers are absent', async () => {
    fetchStub.mockResolvedValueOnce(makeFetchResponse([] as PopularTitle[]));
    await api.getPopular({ type: 'movie' });
    expect(fetchStub.mock.calls[0][0]).to.equal(
      'https://api.example.com/popular/movie',
    );
  });

  it('appends region and providers when given', async () => {
    fetchStub.mockResolvedValueOnce(makeFetchResponse([] as PopularTitle[]));
    await api.getPopular({ type: 'tv', region: 'US', providers: '8,337' });
    const called = fetchStub.mock.calls[0][0] as string;
    expect(called).to.include('/popular/tv');
    expect(called).to.include('region=US');
    expect(called).to.include('providers=8%2C337');
  });

  it('throws when response is not ok', async () => {
    fetchStub.mockResolvedValueOnce(
      makeFetchResponse(null, false, 'Server Error'),
    );
    let error: Error | null = null;
    try {
      await api.getPopular({ type: 'movie' });
    } catch (e) {
      error = e as Error;
    }
    expect(error).to.not.equal(null);
    expect(error?.message).to.include('Server Error');
  });

  it('returns the parsed JSON body on success', async () => {
    const payload: PopularTitle[] = [
      {
        id: 1,
        title: 'Foo',
        media_type: 'movie',
        poster_url: 'p',
        backdrop_url: 'b',
      },
    ];
    fetchStub.mockResolvedValueOnce(makeFetchResponse(payload));
    const result = await api.getPopular({ type: 'movie' });
    expect(result).to.deep.equal(payload);
  });
});
