import React, { useRef, useState } from 'react';
import { InfoIcon } from 'lucide-react';
import { FileIcon } from '@radix-ui/react-icons';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { Dependency, ModInfoEntity } from '@/shared/api/contracts/mods/schemas';
import { modService } from '@/shared/services';
import { Badge } from '@/shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { ModType } from '@/shared/enums';

interface ModsDependencyDialog {
  profile?: ProfileExtendedBaseEntity;
  dependencies?: Dependency[];
  modType?: ModType;
}

export function ModsDependencyTooltip({ profile, dependencies, modType }: ModsDependencyDialog) {
  const [dependencyInfo, setDependencyInfo] = useState<ModInfoEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null); // Храним текущий AbortController
  const fetchDependencies = async () => {
    setIsLoading(true);

    if (dependencies === undefined) return;

    // Отменяем предыдущий запрос, если существует
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаём новый AbortController
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const fetchedData = await Promise.all(
        dependencies.map(async (dependency): Promise<ModInfoEntity | undefined> => {
          const response = await modService.getModInfo({
            modId: dependency.projectId,
            modType: modType ?? ModType.MODRINTH,
            profileName: profile?.profileName ?? '',
            signal: abortController.signal,
          });

          return response.data.data;
        }),
      );

      setDependencyInfo(
        fetchedData.filter((info): info is ModInfoEntity => info !== undefined) ?? [],
      );
    } catch (error) {
      console.error('Ошибка загрузки информации о зависимостях:', error);
      setDependencyInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (dependencies === undefined) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge
          className="gap-1 cursor-pointer text-sm bg-white bg-opacity-10 text-white text-opacity-90 hover:bg-opacity-100 hover:bg-white hover:text-black"
          onMouseEnter={() => fetchDependencies()}
        >
          <InfoIcon className="text-muted-foreground" size={18} />
          {dependencies.length} зависимости(ей)
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        {isLoading ? (
          <p>Загрузка зависимостей...</p>
        ) : dependencyInfo.length > 0 ? (
          <div className="flex flex-col gap-2">
            {dependencyInfo.map((info, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Avatar className="w-8 h-8" key={info.id}>
                  <AvatarImage src={info?.iconUrl} alt="Icon" />
                  <AvatarFallback>
                    <FileIcon />
                  </AvatarFallback>
                </Avatar>
                {info?.name}
              </div>
            ))}
          </div>
        ) : (
          <p>Нет зависимостей</p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
