import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PlugIcon } from "lucide-react";

interface IntegrationCardProps {
  title: string;
  description: string;
  buttonText?: string;
  isDisabled?: boolean;
  action?: () => void;
}

export const IntegrationCard = (props: IntegrationCardProps) => {
  const { title, description, buttonText = "Подключить", isDisabled, action } = props;

  return (
    <Card className="flex flex-col justify-between gap-y-8 p-6">
      <div className="flex flex-col gap-y-1">
        <h6 className="text-sm font-bold">{title}</h6>
        <p className="text-sm text-gray-700">{description}</p>
      </div>
      <Button size="sm" variant="outline" className="w-fit" onClick={action} disabled={isDisabled}>
        <PlugIcon className="mr-2" size={16} />
        {buttonText}
      </Button>
    </Card>
  );
};
