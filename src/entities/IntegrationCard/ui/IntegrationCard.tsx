import { ReactNode } from 'react';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';

interface IntegrationCardProps {
  title: string;
  description?: string;
  testid?: string;
  dialog?: ReactNode;
}

export const IntegrationCard = (props: IntegrationCardProps) => {
  const { title, description, dialog } = props;

  return (
    <Card className="flex flex-col justify-between gap-y-4 p-6" data-testid={props.testid}>
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between">
          <h6 className="text-sm font-bold">{title}</h6>
        </div>
        {description && <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>}
      </div>
      {dialog ? (
        dialog
      ) : (
        <Button size="sm" variant="outline" className="w-fit" disabled>
          Отключено
        </Button>
      )}
    </Card>
  );
};
