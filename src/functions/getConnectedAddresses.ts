import { queryClient } from '../queryClient';

import { Provider, HubProvider, NeynarProvider } from '../providers';
import { ConnectedAddresses } from '../types';

export const getConnectedAddresses = (
  provider: Provider,
  fid: number,
  ethereum?: boolean,
  solana?: boolean
): ConnectedAddresses => {
  let addresses: ConnectedAddresses;

  if (provider instanceof HubProvider) {
    if (provider.psqlUrl)
      addresses = getConnectedAddressesFromReplicator(
        provider.psqlUrl,
        fid,
        ethereum,
        solana
      );
    else
      addresses = getConnectedAddressesFromHub(
        provider.hubUrl,
        fid,
        ethereum,
        solana
      );
  } else if (provider instanceof NeynarProvider) {
    addresses = getConnectedAddressesFromNeynar(
      provider,
      fid,
      ethereum,
      solana
    );
  } else {
    throw new Error('Provider not supported');
  }

  return addresses;
}

function getConnectedAddressesFromReplicator(
  psqlUrl: string,
  fid: number,
  ethereum?: boolean,
  solana?: boolean
): ConnectedAddresses {
  let addresses: ConnectedAddresses = {
    all: [],
    ethereum: [],
    solana: [],
  };
  // ...
  throw new Error('Not implemented');
}

/**
 * Get connected addresses for a given FID from a hub
 * @dev relevant farcaster hub http api docs: https://www.thehubble.xyz/docs/httpapi/verification.html
 * @param hubUrl the hubUrl to be queried
 * @param fid the fid for which the connected addresses are to be queried
 * @param ethereum is ignored as hubs return all addresses anyway
 * @param solana is ignored as hubs return all addresses anyway
 * @returns ConnectedAddresses for the qiven fid
 */
function getConnectedAddressesFromHub(
  hubUrl: string,
  fid: number,
  ethereum?: boolean,
  solana?: boolean
): ConnectedAddresses {
  let addresses: ConnectedAddresses = {
    all: [],
    ethereum: [],
    solana: [],
  };

  try {
    const fetchVerificationsByFid = async (fid: string): Promise<ConnectedAddresses> => {
      const response = await fetch(
        `${hubUrl}/v1/verificationsByFid?fid=${fid}`
      );
      console.log('log response', response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      console.log('response JSON', response.json());

      return { all: [], ethereum: [], solana: [] } as ConnectedAddresses;
    };

    const verificationResponse = queryClient.fetchQuery({
      queryKey: ['verificationsByFid', fid],
      queryFn: () => fetchVerificationsByFid(fid.toString()),
    });

    // if (verificationResponse.isOk() && verificationResponse.value) {
    //   verificationResponse.messages.forEach(verification: VerificationAddAddressBody => {
    //     if (verification.data?.verificationAddAddressBody?.protocol === 0) {
    //       // protocol === 0 guarantees only ETH addresses
    //       const addressBytes =
    //         verification.data?.verificationAddAddressBody.address;
    //       const address = `0x${Buffer.from(addressBytes).toString('hex')}`;
    //       addresses.all.push(address);
    //       addresses.ethereum.push(address);
    //     }

    //     if (verification.data?.verificationAddAddressBody?.protocol === 1) {
    //       // protocol === 1 guarantees only SOL addresses
    //       const addressBytes =
    //         verification.data?.verificationAddAddressBody.address;
    //       const address = `${Buffer.from(addressBytes).toString('hex')}`;
    //       addresses.all.push(address);
    //       addresses.solana.push(address);
    //     }
    //   });
    // }
  } catch (e) {
    console.error(e);
    throw new Error('Error getting verifications from hub');
  }
  return addresses;
}

function getConnectedAddressesFromNeynar(
  provider: NeynarProvider,
  fid: number,
  ethereum?: boolean,
  solana?: boolean
): ConnectedAddresses {
  let addresses: ConnectedAddresses = {
    all: [],
    ethereum: [],
    solana: [],
  };
  // ...

  throw new Error('Not implemented');
}
