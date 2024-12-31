'use client';

import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { toast } from 'sonner';

import { getStorageAccessToken } from '@/shared/services';
import { getApiBaseUrl } from '@/shared/lib/utils';

const CONNECTION_URL = (token: string) =>
  `${getApiBaseUrl()}/ws/launcher/build?access_token=${token}`;

export const useConnectionHub = () => {
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

  const [logsBuilding, setLogsBuilding] = useState<string[] | null>(null);

  const [percentDownload, setPercentDownload] = useState(0);

  const [isDownload, setIsDownload] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  const handleDownloadEnded = () => {
    setIsDownload(false);
  };

  const handleBuildingEnded = () => {
    setIsBuilding(false);
  };

  useEffect(() => {
    if (!accessToken) return;

    const onConnectedHub = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(CONNECTION_URL(accessToken), {
            headers: { 'Access-Control-Allow-Credentials': '*' },
            withCredentials: false,
          })
          .withAutomaticReconnect()
          .build();
        setConnectionHub(connection);

        await connection.start();

        connection.on('GitHubLauncherHubChangeProgress', (percent) => {
          setPercentDownload(percent);
        });

        connection.on('Message', (message) => {
          toast.info('Информация', {
            description: message,
          });
        });

        connection.on('LauncherDownloadEnded', handleDownloadEnded);
        connection.on('LauncherBuildEnded', handleBuildingEnded);
        connection.on('LauncherPublishEnded', handleDownloadEnded);

        connection.on('Log', (log: string) => {
          setLogsBuilding((prev) => (prev ? [...prev, log] : [log]));
        });
      } catch (error) {
        console.log(error);
      }
    };

    onConnectedHub().then(() => {
      console.log('Success starting connectionHub');
    });

    return () => {
      connectionHub?.stop().then(() => {
        console.log('Success stopping connectionHub');
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
