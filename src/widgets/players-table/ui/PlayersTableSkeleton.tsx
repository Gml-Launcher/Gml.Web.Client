import { SearchIcon } from 'lucide-react';
import React from 'react';

import { emptyArray } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Button } from '@/shared/ui/button';

export function PlayersTableSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <form className="flex gap-4">
        <Skeleton className="w-full h-10" />
        <Button type="submit" variant="outline" className="gap-2">
          <SearchIcon size={16} />
          Найти
        </Button>
      </form>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            <TableRow>
              {emptyArray(5).map((item, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-[calc(100%-2rem)]" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {emptyArray(20).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {emptyArray(5).map((_, cellIndex) => (
                  <TableHead key={cellIndex}>
                    <Skeleton className="h-4 w-[calc(100%-1rem)]" />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
