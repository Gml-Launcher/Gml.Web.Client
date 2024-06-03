import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { getStorageAccessToken } from "@/shared/services";
import { useToast } from "@/shared/ui/use-toast";
import { ProfileExtendedBaseEntity } from "@/shared/api/contracts";

interface ConnectionHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

const CONNECTION_URL = (token: string) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/ws/profiles/restore?access_token=${token}`;

export const useConnectionHub = (props: ConnectionHubProps) => {
  const { profile, isLoading } = props;

  const { toast } = useToast();
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (isLoading || !accessToken) return;

    const onConnectedHub = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(CONNECTION_URL(accessToken), {
            headers: { "Access-Control-Allow-Credentials": "*" },
            withCredentials: false,
          })
          .withAutomaticReconnect()
          .build();
        setConnectionHub(connection);

        await connection.start();

        connection.on("BlockRestore", () => {
          setIsRestoring(true);
        });

        connection.on("ChangeProgress", (percent) => {
          setIsRestoring(true);
          setProgressPercent(percent);
        });

        connection.on("Message", (msg) => {
          toast({
            title: "Ошибка!",
            description: msg,
          });
        });

        connection.on("SuccessInstalled", () => {
          setIsRestoring(false);
          setProgressPercent(0);
          toast({
            title: "Успешно",
            description: "Клиент успешно загружен",
          });
        });

        connection.on("SuccessPacked", () => {
          setIsRestoring(false);
          setProgressPercent(0);
          toast({
            title: "Успешно",
            description: "Клиент успешно собран",
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    onConnectedHub().then().catch();

    return () => {
      connectionHub?.stop().then().catch();
    };
  }, []);

  const onDownloadDistributive = () => {
    setIsRestoring(true);
    connectionHub
      ?.invoke("Restore", profile?.profileName)
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Ошибка!",
          description: JSON.stringify(error),
        });
      })
      .finally(() => {
        setIsRestoring(false);
      });
  };

  const onBuildDistributive = () => {
    setIsRestoring(true);
    connectionHub
      ?.invoke("Build", profile?.profileName)
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Ошибка!",
          description: JSON.stringify(error),
        });
      })
      .finally(() => {
        setIsRestoring(false);
      });
  };

  return {
    onDownloadDistributive,
    onBuildDistributive,
    isDisable: isRestoring,
    progress: progressPercent,
  };
};
