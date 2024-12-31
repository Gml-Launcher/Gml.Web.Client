import React from 'react';

interface SectionProps extends React.PropsWithChildren, React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
}

export const Section = (props: SectionProps) => {
  const { title, subtitle, children, ...rest } = props;

  return (
    <section className="flex flex-col gap-y-4 mb-8" {...rest}>
      <div className="flex flex-col gap-y-1">
        {title && <h5 className="text-xl font-bold">{title}</h5>}
        {subtitle && <p className="text-sm text-gray-700 dark:text-gray-300">{subtitle}</p>}
      </div>
      <hr />
      {children}
    </section>
  );
};
