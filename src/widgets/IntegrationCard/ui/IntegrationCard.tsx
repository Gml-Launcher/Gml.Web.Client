import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PlugIcon, Settings2 } from "lucide-react";

interface IntegrationCardProps {
  title: string;
  description?: string;
  status?: "CONNECTED" | "UNCONNECTED";
  buttonText?: string;
  isDisabled?: boolean;
  action?: () => void;
}

export const IntegrationCard = (props: IntegrationCardProps) => {
  const { title, description, buttonText = "Подключить", status, isDisabled, action } = props;

  return (
    <Card className="flex flex-col justify-between gap-y-8 p-6">
      <div className="flex flex-col gap-y-1">
        <div className="flex justify-between">
          <h6 className="text-sm font-bold">{title}</h6>
        </div>
        {description && <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>}
      </div>
      <Button size="sm" variant="outline" className="w-fit" onClick={action} disabled={isDisabled}>
        {status === "CONNECTED" && <Settings2 className="mr-2" size={16} />}
        {status === "UNCONNECTED" && <PlugIcon className="mr-2" size={16} />}
        {buttonText}
      </Button>
    </Card>
  );
};
