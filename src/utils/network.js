
import { networkInterfaces } from 'os';

export const getNetworkAddresses = () => {
  const nets = networkInterfaces();
  return Object.keys(nets).map(name => nets[name].filter(({ family }) => (family === 'IPv4')).map(({ address }) => address)).flat();
};
