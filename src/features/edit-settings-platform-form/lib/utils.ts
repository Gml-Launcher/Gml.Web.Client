import { Protocol } from '@/shared/enums';

export const extractProtocol = (url?: string) => {
  if (!url) {
    return null;
  }

  const protocolMatch = url.match(/^(https?)(?=:)/)?.[0];

  return protocolMatch === 'https' ? Protocol.HTTPS : Protocol.HTTP;
};
