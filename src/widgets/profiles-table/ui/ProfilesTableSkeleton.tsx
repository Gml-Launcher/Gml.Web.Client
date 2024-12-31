import { emptyArray } from '@/shared/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/shared/ui/table';

export function ProfilesTableSkeleton() {
  return (
    <div className="rounded-md border w-full mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            {emptyArray(7).map((item, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-[calc(100%-2rem)]" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {emptyArray(10).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {emptyArray(7).map((_, cellIndex) => (
                <TableHead key={cellIndex}>
                  <Skeleton className="h-4 w-[calc(100%-1rem)]" />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
