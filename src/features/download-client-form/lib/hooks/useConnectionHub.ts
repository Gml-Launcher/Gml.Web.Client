import { useEffect, useState } from "react";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import { getStorageAccessToken } from "@/shared/services";
import { useToast } from "@/shared/ui/use-toast";

const CONNECTION_URL = (token: string) =>
  `${process.env.NEXT_PUBLIC_BASE_URL}/ws/launcher/build?access_token=${token}`;

export const useConnectionHub = () => {
  const { toast } = useToast();
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

  const [progressPercent, setProgressPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const onIsProcessingToggle = () => setIsProcessing((prev) => !prev);

  useEffect(() => {
    if (!accessToken) return;

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

        connection.on("GitHubLauncherHubChangeProgress", (percent) => {
          setProgressPercent(percent);
        });

        connection.on("Message", (message) => {
          toast({
            description: message,
          });
        });
      } catch (error) {
        console.log(error);
      }
    };

    onConnectedHub().then(() => {});

    return () => {
      connectionHub?.stop().then(() => {});
    };
  }, []);

  return {
    connectionHub,
    process: {
      isProcessing,
      onIsProcessingToggle,
    },
    percent: {
      progressPercent,
      setProgressPercent,
    },
  };
};
