"use client";

import { useEffect, useState } from "react";

import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import { getStorageAccessToken } from "@/shared/services";
import { useToast } from "@/shared/ui/use-toast";
import { getApiBaseUrl } from "@/shared/lib/utils";

const CONNECTION_URL = (token: string) =>
  `${getApiBaseUrl()}/ws/launcher/build?access_token=${token}`;

export const useConnectionHub = () => {
  const { toast } = useToast();
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

  const [logsBuilding, setLogsBuilding] = useState<string[] | null>(null);

  const [percentDownload, setPercentDownload] = useState(0);

  const [isDownload, setIsDownload] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const handleDownloadEnded = () => {
    setIsDownload(false);
  };

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
          setPercentDownload(percent);
        });

        connection.on("Message", (message) => {
          toast({
            description: message,
          });
        });

        connection.on("LauncherDownloadEnded", handleDownloadEnded);
        connection.on("LauncherBuildEnded", handleDownloadEnded);
        connection.on("LauncherPublishEnded", handleDownloadEnded);

        connection.on("Log", (log: string) => {
          setLogsBuilding((prev) => (prev ? [...prev, log] : [log]));
        });
      } catch (error) {
        console.log(error);
      }
    };

    onConnectedHub().then(() => {
      console.log("Success starting connectionHub");
    });

    return () => {
      connectionHub?.stop().then(() => {
        console.log("Success stopping connectionHub");
      });
    };
  }, []);

  return {
    connectionHub,
    download: {
      isDownload,
      setIsDownload,
      percent: percentDownload,
      setPercent: setPercentDownload,
    },
    build: {
      isBuilding,
      setIsBuilding,
      logs: logsBuilding,
      setLogs: setLogsBuilding,
    },
  };
};
