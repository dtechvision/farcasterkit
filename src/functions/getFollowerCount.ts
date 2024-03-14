import { Provider, HubProvider, NeynarProvider } from '../providers';

export const getFollowerCount = async (provider: Provider, fid: number): Promise<number> => {
  let url: string;

  if (provider instanceof HubProvider) {
    url = `${provider.hubUrl}/v1/followerCount?fid=${fid}`;
  } else if (provider instanceof NeynarProvider) {
    url = `${provider.endPoint}/v2/followerCount?fid=${fid}`;
  } else {
    throw new Error('Provider not supported');
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();

  return data.followerCount;
}