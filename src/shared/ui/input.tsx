import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { UploadCloud } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

interface InputFileProps extends InputProps {
  fileTypes?: string[];
}

export const InputFile = React.forwardRef<HTMLInputElement, InputFileProps>(
  ({ className, id, fileTypes, type = "file", ...props }, ref) => (
    <label
      htmlFor={id}
      className="text-base rounded w-full h-32 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 dark:border-gray-800 text-gray-700 dark:text-gray-300 border-dashed font-[sans-serif]"
    >
      <div className="flex justify-center items-center bg-gray-100 w-12 h-12 rounded-full mb-2 dark:bg-black">
        <UploadCloud size={24} />
      </div>
      <p className="text-xs text-center leading-6">
        <span className="underline">Нажмите, чтобы загрузить</span>, или перетащите изображение
      </p>
      <input type="file" id={id} className="hidden" ref={ref} {...props} />
      {fileTypes && (
        <>
          {fileTypes.length === 1 && (
            <p className="text-xs mt-2">Доступный формат: {fileTypes[0]}</p>
          )}
          {fileTypes.length > 1 && (
            <p className="text-xs mt-2">Доступные форматы: {fileTypes.join(", ")}</p>
          )}
        </>
      )}
    </label>
  ),
);
InputFile.displayName = "Input";
