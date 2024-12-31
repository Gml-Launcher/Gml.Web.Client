import classes from './styles.module.css';

import { Skeleton } from '@/shared/ui/skeleton';

export const GamePlayersSkeleton = () => {
  return (
    <div className={classes.servers__content}>
      <Skeleton className="h-[600px]" />
    </div>
  );
};
