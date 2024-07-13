export const BRAND_NAME = "GML";
export const PLATFORM_SHORT_APP_NAME = "Frontend";
export const PLATFORM_APP_NAME = `${BRAND_NAME} ${PLATFORM_SHORT_APP_NAME}`;

type Config = {
  name: string;
};

export const config: Config = {
  name: PLATFORM_APP_NAME,
};
