import { getConnectedAddresses } from '../src/functions';
import { PublicProvider } from '../src/providers';

const provider =  new PublicProvider();

const fid = 16085; // @samuellhuber
let addresses = await getConnectedAddresses(provider, fid);
console.log(`Here are all connected addresses for FID ${fid}\n`, addresses.all);
console.log(`Here are all ETHEREUM addresses for FID ${fid}\n`, addresses.ethereum);

addresses = await getConnectedAddresses(provider, 269694); // 269694 has solana verifications
console.log(`Here are all SOLANA addresses for FID ${fid}\n`, addresses.solana);