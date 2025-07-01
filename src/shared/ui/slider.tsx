'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  );

  // State for the input value
  const [inputValue, setInputValue] = React.useState<string>(_values[0]?.toString() || '0');

  // Update input value when slider value changes
  React.useEffect(() => {
    if (value && Array.isArray(value) && value[0] !== undefined) {
      setInputValue(value[0].toString());
    }
  }, [value]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Round value to nearest step
  const roundToStep = (value: number): number => {
    const steps = Math.round((value - min) / step);
    return min + steps * step;
  };

  // Handle input blur - update slider value
  const handleInputBlur = () => {
    let newValue = Number(inputValue);
    if (!isNaN(newValue)) {
      // Clamp value to min/max range
      newValue = Math.max(min, Math.min(max, newValue));
      // Round to nearest step
      newValue = roundToStep(newValue);

      const newValues = [..._values];
      newValues[0] = newValue;
      onValueChange?.(newValues);
      // Update input to show rounded value
      setInputValue(newValue.toString());
    } else {
      // Reset to current value if invalid
      setInputValue(_values[0]?.toString() || '0');
    }
  };

  // Handle key down - update on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-end mb-1">
        <Input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
          className="w-32 text-center text-sm"
        />
      </div>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(newValue) => {
          onValueChange?.(newValue);
          if (newValue[0] !== undefined) {
            setInputValue(newValue[0].toString());
          }
        }}
        className={cn(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
