import packageJson from '../../../package.json';

export const BRAND_NAME = 'Gml';
export const PLATFORM_SHORT_APP_NAME = 'Frontend';
export const PLATFORM_APP_NAME = `${BRAND_NAME} ${PLATFORM_SHORT_APP_NAME}`;

export const PLATFORM_VERSION = `${packageJson.version}`;

type Config = {
  version: string;
  name: string;
};

export const config: Config = {
  version: PLATFORM_VERSION,
  name: PLATFORM_APP_NAME,
};
