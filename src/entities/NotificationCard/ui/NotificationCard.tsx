import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { getFormatDate } from '@/shared/lib/utils';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { NotificationBaseEntity } from '@/shared/api/contracts';

interface ProfileCardParams {
  card: NotificationBaseEntity;
}

export const NotificationCard = ({ card }: ProfileCardParams) => {
  return (
    <Card className={'flex flex-col justify-between gap-y-2 p-3'}>
      <div className="flex justify-between items-center gap-x-2">
        <span className="text-base font-semibold">{card.message}</span>
        <span className="text-sm text-muted-foreground">{getFormatDate(card.date)}</span>
      </div>
      {card.details && (
        <div className="max-h-20 overflow-hidden">
          <span className="text-sm text-muted-foreground ">{card.details}</span>
        </div>
      )}
      <Button
        variant="secondary"
        className="w-fit"
        onClick={async () => {
          await navigator.clipboard.writeText(card.details ? card.details : card.message);
          toast.success('Текст успешно скопирован');
        }}
      >
        <Copy className="h-3 w-3 mr-1" />
        Копировать
      </Button>
    </Card>
  );
};
