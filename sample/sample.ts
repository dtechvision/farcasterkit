import { getConnectedAddresses } from '../src/functions';
import { PublicProvider } from '../src/providers';

const provider =  new PublicProvider("pinata");

const fid = 16085; // @samuellhuber
const addresses = getConnectedAddresses(provider, 16085)

console.log(`Here are all connected addresses for FID ${fid}\n`, addresses.all);