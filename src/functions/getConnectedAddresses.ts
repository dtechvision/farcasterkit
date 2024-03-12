import { queryClient } from '../queryClient';

import { Provider, HubProvider, NeynarProvider } from '../providers';
import { ConnectedAddresses } from '../types';
import { Message, Protocol } from '@farcaster/core';

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
      if(process.env.DEBUG) { console.log('fetching Verifications from hub:', hubUrl); }
      const response = await fetch(
        `${hubUrl}/v1/verificationsByFid?fid=${fid}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      data.messages.forEach((verification: Message) => {
        if(process.env.DEBUG)
        // debugs PROTOCOL strings needing to be hardcoded as Protocol.ETHEREUM and Protocol.SOLANA in @farcaster/core v0.14.7
        // are numbers while hubs store strings. For a full run down and issue report read: https://warpcast.com/samuellhuber/0xed8142ec
        {
          console.log(verification.data?.verificationAddAddressBody?.protocol, typeof(verification.data?.verificationAddAddressBody?.protocol));
          console.log(typeof(Protocol.ETHEREUM), typeof(Protocol.SOLANA));
        }
        if (verification.data?.verificationAddAddressBody?.protocol.toString() == 'PROTOCOL_ETHEREUM') {
          // protocol === Protcol.ETHEREUM guarantees only ETH addresses
          const addressBytes =
            verification.data?.verificationAddAddressBody.address;
          const address = `0x${Buffer.from(addressBytes).toString('hex')}`;
          addresses.all.push(address);
          addresses.ethereum.push(address);
        }

        if (verification.data?.verificationAddAddressBody?.protocol.toString() == 'PROTOCOL_SOLANA') {
          // protocol === Protocol.SOLANA guarantees only SOL addresses
          const addressBytes =
            verification.data?.verificationAddAddressBody.address;
          const address = `${Buffer.from(addressBytes).toString('hex')}`;
          addresses.all.push(address);
          addresses.solana.push(address);
        }
      });

      return addresses;
    };

    addresses = queryClient.fetchQuery({
      queryKey: ['verificationsByFid', fid],
      queryFn: () => fetchVerificationsByFid(fid.toString()),
    }).then( (res) => { return res; });

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
  
  try {
    const fetchVerificationsByFid = async (fid: string): Promise<ConnectedAddresses> => {
      let addresses: ConnectedAddresses = {
        all: [],
        ethereum: [],
        solana: [],
      };
      if(process.env.DEBUG) { console.log('fetching Verifications from neynar:', provider.endPoint); }
      const response = await fetch(
        `${provider.endPoint}/v2//farcaster/user/bulk?fids=${fid}`,
        {
          headers: {
            "accept": "application/json",
            "api_key": provider.apiKey,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      //hardcoding user 0 as we only query one
      addresses.all = data.users[0].verifications;
      addresses.ethereum = data.users[0].verified_addresses.eth_addresses;
      addresses.solana = data.users[0].verified_addresses.sol_addresses;

      return addresses;
    };

    addresses = queryClient.fetchQuery({
      queryKey: ['verificationsByFid', fid],
      queryFn: () => fetchVerificationsByFid(fid.toString()),
    }).then( (res) => { return res; });

  } catch (e) {
    console.error(e);
    throw new Error('Error getting verifications from hub');
  }

  return addresses;
}
