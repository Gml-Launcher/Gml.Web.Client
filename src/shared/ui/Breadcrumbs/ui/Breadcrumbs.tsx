import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/ui/breadcrumb';

type BreadcrumbItemType = {
  value: string;
  path: string;
};

interface BreadcrumbsProps {
  breadcrumbs?: BreadcrumbItemType[];
  current: string;
}

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { breadcrumbs, current } = props;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs &&
          breadcrumbs.map(({ value, path }) => (
            <Fragment key={value}>
              <BreadcrumbItem>
                <BreadcrumbLink href={path}>{value}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
