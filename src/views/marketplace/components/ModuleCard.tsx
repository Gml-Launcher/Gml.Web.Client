"use client";

import { TagIcon } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Module } from '../data';

interface ModuleCardProps {
  module: Module;
}

export const ModuleCard = ({ module }: ModuleCardProps) => {
  return (
    <Card key={module.id} className="overflow-hidden flex flex-col">
      <div className="h-[200px] bg-muted relative">
        <img 
          src={module.image} 
          alt={module.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{module.title}</CardTitle>
          <Badge variant="secondary">{module.price} ₽</Badge>
        </div>
        <CardDescription>{module.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {module.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              <TagIcon className="h-3 w-3" />
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex gap-2 w-full">
          <Button variant="outline" className="flex-1">Подробнее</Button>
          <Button className="flex-1">Купить</Button>
        </div>
      </CardFooter>
    </Card>
  );
};