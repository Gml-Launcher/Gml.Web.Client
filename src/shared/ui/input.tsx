import { forwardRef, InputHTMLAttributes } from 'react';
import { UploadCloud } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

interface InputFileProps extends InputProps {
  fileTypes?: string[];
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, id, fileTypes, type = 'file', ...props }, ref) => (
    <label
      htmlFor={id}
      className="relative group text-base rounded-lg w-full h-32 flex flex-col items-center justify-center cursor-pointer border border-dashed border-primary/30 hover:border-primary/50 text-foreground/80 transition-all duration-200 overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex justify-center items-center bg-background/80 w-12 h-12 rounded-full mb-3 shadow-sm border border-border/50 group-hover:scale-105 transition-transform duration-200">
          <UploadCloud
            size={20}
            className="text-primary/70 group-hover:text-primary transition-colors duration-200"
          />
        </div>
        <p className="text-xs text-center leading-6 font-medium">
          <span className="text-primary underline">Нажмите, чтобы загрузить</span>
        </p>
        <input type="file" id={id} className="hidden" ref={ref} {...props} />
        {fileTypes && (
          <>
            {fileTypes.length === 1 && (
              <p className="text-xs mt-2 text-muted-foreground">Доступный формат: {fileTypes[0]}</p>
            )}
            {fileTypes.length > 1 && (
              <p className="text-xs mt-2 text-muted-foreground">
                Доступные форматы: {fileTypes.join(', ')}
              </p>
            )}
          </>
        )}
      </div>
    </label>
  ),
);
InputFile.displayName = 'Input';
