import { Provider, HubProvider, NeynarProvider } from '../providers';

export const getFollowerCount = async (
  provider: Provider,
  fid: number
): Promise<number> => {
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
};
type Bio = {
  text: string;
};

type Profile = {
  bio: Bio;
};

type VerifiedAddresses = {
  eth_addresses: string[];
  sol_addresses: string[];
};

type User = {
  object: string;
  fid: number;
  custody_address: string;
  username: string;
  display_name: string;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: VerifiedAddresses;
  active_status: string;
};

type Follow = {
  object: string;
  user: User;
};

type UserDehydrated = {
  object: string;
  fid: number;
};

type FollowDehydrated = {
  object: string;
  user: UserDehydrated;
};

type ApiResponse = {
  top_relevant_followers_hydrated: Follow[];
  all_relevant_followers_dehydrated: FollowDehydrated[];
};

async function getFollowerCountFromHub(
  provider: NeynarProvider,
  targetFid: number,
  viewerFid: number
): Promise<User[]> {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      api_key: provider.apiKey,
    },
  };

  const response = await fetch(
    `${provider.endPoint}/v2/farcaster/followers/relevant?target_fid=${targetFid}&viewer_fid=${viewerFid}`,
    options
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: ApiResponse = await response.json();

  // Extract the User objects from the response
  const users: User[] = data.top_relevant_followers_hydrated.map(
    follow => follow.user
  );

  return users;
}
