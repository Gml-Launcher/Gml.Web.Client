'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';
import { clsx } from 'clsx';

import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';
import { Input } from '@/shared/ui/input';
import { NewsIntegrationBaseEntity } from '@/shared/api/contracts';
import { NewsTypeEnum } from '@/shared/enums/news-type';

export interface SocialNetwork {
  name: string;
  logo: any;
  type: NewsTypeEnum;
  enabled: boolean;
  visible: boolean;
  token: string;
  description: string;
  descriptionToken: string;
  descriptionUrl?: string;
  tokenGenerateUrl?: string;
  instructionLink?: string;
}

export function SocialNetworkComponent({
  social,
  providers,
}: {
  social: SocialNetwork;
  providers: NewsIntegrationBaseEntity[];
}) {
  const [enabled, setEnabled] = useState(
    Array.isArray(providers) && providers.some((provider) => provider.type === social.type),
  );
  const onOpenChange = () => setEnabled((prev) => !prev);

  return (
    <div className="relative flex items-start justify-center" key={social.name}>
      {!social.visible && (
        <Card className="absolute z-50 items-center justify-center mt-7">
          <CardHeader className="font-bold text-xl">Недоступно</CardHeader>
        </Card>
      )}
      <Card
        key={social.name}
        className={clsx('', {
          'blur-sm': !social.visible,
        })}
      >
        <CardHeader className="flex flex-row items-center relative gap-5">
          <div className="flex items-center rounded-xl justify-center border min-h-12 min-w-12 h-12 w-12 p-3">
            <Image src={social.logo} className="w-full" alt={`${social.name} logo`} />
          </div>
          <div className="flex flex-col gap-2">
            <CardTitle>{social.name}</CardTitle>
            <CardDescription>{social.description}</CardDescription>
          </div>
          <Switch
            defaultChecked={enabled}
            onCheckedChange={onOpenChange}
            disabled={!social.visible}
            className="absolute top-2 right-3"
          />
        </CardHeader>
        {enabled && (
          <>
            <hr />
            <CardFooter>
              <div className="flex flex-col pt-6 w-full gap-3">
                <Input type="text" placeholder={social.descriptionToken} />
                {social.descriptionUrl && social.descriptionUrl.length > 0 && (
                  <Input type="text" placeholder={social.descriptionUrl} />
                )}
                <Button variant="secondary" className="w-full">
                  Сохранить
                </Button>
                <div className="flex justify-center mt-2">
                  {social.tokenGenerateUrl && (
                    <div className="flex duration-300 items-center text-muted-foreground hover:text-white">
                      <Link
                        href={social.tokenGenerateUrl}
                        target="_blank"
                        className="underline text-sm flex items-end"
                      >
                        Получить токен
                        <MoveUpRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
