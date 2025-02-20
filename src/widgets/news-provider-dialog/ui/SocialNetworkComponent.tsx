'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MoveUpRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Switch } from '@/shared/ui/switch';
import { Input } from '@/shared/ui/input';

export interface SocialNetwork {
  name: string;
  logo: any;
  enabled: boolean;
  token: string;
  description: string;
  descriptionToken: string;
  tokenGenerateUrl?: string;
  instructionLink?: string;
}

export function SocialNetworkComponent({ social }: { social: SocialNetwork }) {
  const [enabled, setEnabled] = useState(social.enabled);
  const onOpenChange = () => setEnabled((prev) => !prev);

  return (
    <Card key={social.name}>
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
          className="absolute top-2 right-3"
        />
      </CardHeader>
      {enabled && (
        <>
          <hr />
          <CardFooter>
            <div className="flex flex-col pt-6 w-full gap-1">
              <Input type="text" placeholder={social.descriptionToken} />
              <Button variant="secondary" className="w-full mt-2">
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
  );
}
