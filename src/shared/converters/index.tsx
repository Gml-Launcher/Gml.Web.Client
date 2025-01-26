import React, { ReactElement } from 'react';
import Image from 'next/image';

import { GameLoaderOption, GameLoaderType } from '@/shared/api/contracts';
import vanilla from '@/assets/logos/minecraft.png';
import forge from '@/assets/logos/forge.png';
import fabric from '@/assets/logos/fabric.png';
import liteLoader from '@/assets/logos/liteloader.png';
import neoForge from '@/assets/logos/neoforge.png';
import quilt from '@/assets/logos/quilt.png';

export const convertGameLoaderImage = (loader: GameLoaderOption) => {
  const converter: Record<GameLoaderOption, ReactElement> = {
    [GameLoaderOption.VANILLA]: <Image src={vanilla} alt="Minecraft" width={24} height={24} />,
    [GameLoaderOption.FORGE]: <Image src={forge} alt="Forge" width={24} height={24} />,
    [GameLoaderOption.FABRIC]: <Image src={fabric} alt="Fabric" width={24} height={24} />,
    [GameLoaderOption.NEOFORGE]: <Image src={neoForge} alt="NeoForge" width={18} height={18} />,
    [GameLoaderOption.QUILT]: <Image src={quilt} alt="Quilt" width={18} height={18} />,
    [GameLoaderOption.LITELOADER]: (
      <Image src={liteLoader} alt="Liteloader" width={24} height={24} />
    ),
  };

  return converter[loader];
};

export const convertApiGameLoaderImage = (loader: GameLoaderType) => {
  const converter: Record<GameLoaderType, ReactElement> = {
    [GameLoaderType.VANILLA]: (
      <Image src={vanilla} alt="Minecraft" className="min-w-4" width={24} height={24} />
    ),
    [GameLoaderType.FORGE]: (
      <Image src={forge} alt="Forge" className="min-w-6" width={24} height={24} />
    ),
    [GameLoaderType.FABRIC]: (
      <Image src={fabric} alt="Fabric" className="min-w-4" width={24} height={24} />
    ),
    [GameLoaderType.NEOFORGE]: (
      <Image src={neoForge} alt="NeoForge" className="min-w-4" width={18} height={18} />
    ),
    [GameLoaderType.QUILT]: (
      <Image src={quilt} alt="Quilt" className="min-w-4" width={18} height={18} />
    ),
    [GameLoaderType.LITELOADER]: (
      <Image src={liteLoader} alt="Liteloader" className="min-w-4" width={24} height={24} />
    ),
  };

  return converter[loader];
};
