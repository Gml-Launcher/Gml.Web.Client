import { DateRange } from 'react-day-picker';
import { Dispatch, SetStateAction } from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import { cn } from '@/shared/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
};

export const DatePickerWithRange = ({ className, date, setDate }: DatePickerWithRangeProps) => {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <span className="ml-2">
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </span>
              ) : (
                <span className="ml-2">{format(date.from, 'LLL dd, y')}</span>
              )
            ) : (
              <span className="ml-2">Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
