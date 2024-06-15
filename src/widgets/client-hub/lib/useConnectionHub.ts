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
  const [FullProgressPercent, setFullProgressPercent] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const [logs, setIsLogs] = useState([""]);
  const [isPacked, setIsPacked] = useState(false);

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

        if (profile?.hasUpdate == false) setIsRestoring(true);

        connection.on("ChangeProgress", (profileName, percent) => {
          if (profileName == profile?.profileName) {
            setIsRestoring(true);
            setProgressPercent(percent);
          }
        });

        connection.on("FullProgress", (profileName, percent) => {
          if (profileName == profile?.profileName) {
            setIsRestoring(true);
            setIsPacked(true);
            setFullProgressPercent(percent);
          }
        });

        connection.on("OnException", (profileName, exception: string) => {
          if (profileName == profile?.profileName) setIsLogs(["", exception]);
        });

        connection.on("Log", (profileName, log: string) => {
          if (profileName == profile?.profileName) setIsLogs([...logs, log]);
        });

        connection.on("Message", (msg) => {
          toast({
            title: "Ошибка!",
            description: msg,
          });
        });

        connection.on("SuccessInstalled", (profileName) => {
          if (profileName == profile?.profileName) {
            setIsPacked(false);
            setIsRestoring(false);
            setProgressPercent(0);
            setFullProgressPercent(0);
            setIsLogs([""]);
          }
          toast({
            title: "Успешно",
            description: `Профиль ${profileName} успешно загружен`,
          });
        });

        connection.on("SuccessPacked", (profileName) => {
          if (profileName == profile?.profileName) {
            setIsRestoring(false);
            setProgressPercent(0);
          }
          toast({
            title: "Успешно",
            description: `Профиль ${profileName} успешно собран`,
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
    setIsPacked(true);
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
    setIsPacked(false);
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
    isPacked,
    progress: progressPercent,
    fullProgress: FullProgressPercent,
    logs,
  };
};
