import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { toast } from 'sonner';

import { getStorageAccessToken } from '@/shared/services';
import { JavaVersionBaseEntity, ProfileExtendedBaseEntity } from '@/shared/api/contracts';
import { getApiBaseUrl } from '@/shared/lib/utils';
import { useProfileCardStore } from '@/entities/ProfileCard/lib/store';
import { EntityState } from '@/shared/enums';

interface ConnectionHubProps {
  profile?: ProfileExtendedBaseEntity;
  isLoading?: boolean;
}

const CONNECTION_URL = (token: string) =>
  `${getApiBaseUrl()}/ws/profiles/restore?access_token=${token}`;

export const useConnectionHub = (props: ConnectionHubProps) => {
  const { profile, isLoading } = props;

  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [percentStage, setPercentStage] = useState(0);
  const [percentAllStages, setPercentAllStages] = useState(0);

  const [isRestoring, setIsRestoring] = useState(false);

  const [logs, setLogs] = useState<string[] | null>(null);

  const [isPacked, setIsPacked] = useState(false);

  const { setState: setProfileCardState } = useProfileCardStore();

  useEffect(() => {
    if (isLoading || !accessToken) return;

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

        if (connection.state == 'Connected') setIsConnected(true);

        if (profile?.hasUpdate == false) setIsRestoring(true);

        connection.on('ChangeProgress', (profileName, percent) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setIsPacked(true);
            setIsRestoring(true);
            setPercentStage(percent);
          }
        });

        connection.on('FullProgress', (profileName, percent) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setIsRestoring(true);
            setIsPacked(true);
            setPercentAllStages(percent);
          }
        });

        connection.on('OnException', (profileName, exception: string) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setLogs((prev) => (prev ? [...prev, exception] : [exception]));
          }
        });

        connection.on('Log', (profileName, log: string) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setLogs((prev) => (prev ? [...prev, log] : [log]));
          }
        });

        connection.on('Message', (msg) => {
          setIsConnected(true);
          toast.error('Ошибка', {
            description: msg,
          });
        });

        connection.on('SuccessInstalled', (profileName) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setProfileCardState(EntityState.ENTITY_STATE_ACTIVE);
            setIsPacked(false);
            setIsRestoring(false);
            setPercentStage(0);
            setPercentAllStages(0);
            setLogs(null);
            toast.success('Успешно', {
              description: `Профиль ${profileName} успешно загружен`,
            });
          }
        });

        connection.on('SuccessPacked', (profileName) => {
          setIsConnected(true);
          if (profileName == profile?.profileName) {
            setProfileCardState(EntityState.ENTITY_STATE_ACTIVE);
            setIsRestoring(false);
            setPercentStage(0);
            setLogs(null);
          }

          toast.success('Успешно', {
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
    setProfileCardState(EntityState.ENTITY_STATE_LOADING);
    connectionHub
      ?.invoke('Restore', profile?.profileName)
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        toast.error('Ошибка', {
          description: JSON.stringify(error),
        });

        if (profile) {
          setProfileCardState(profile.state);
        }
      })
      .finally(() => {
        setIsRestoring(false);
        setProfileCardState(EntityState.ENTITY_STATE_NEED_COMPILE);
      });
  };

  const onDownloadJavaDistributive = (javaVersion: JavaVersionBaseEntity) => {
    setIsPacked(true);
    setIsRestoring(true);
    setProfileCardState(EntityState.ENTITY_STATE_LOADING);
    connectionHub
      ?.invoke('RestoreAndChangeBootstrapVersion', profile?.profileName, javaVersion)
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        toast.error('Ошибка', {
          description: JSON.stringify(error),
        });

        if (profile) {
          setProfileCardState(profile.state);
        }
      })
      .finally(() => {
        setIsRestoring(false);
        setProfileCardState(EntityState.ENTITY_STATE_LOADING);
      });
  };

  const onBuildDistributive = () => {
    setIsPacked(false);
    setIsRestoring(true);
    setProfileCardState(EntityState.ENTITY_STATE_PACKING);
    connectionHub
      ?.invoke('Build', profile?.profileName)
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        toast.error('Ошибка', {
          description: JSON.stringify(error),
        });

        if (profile) {
          setProfileCardState(profile.state);
          setProfileCardState(EntityState.ENTITY_STATE_LOADING);
        }
      })
      .finally(() => {
        setProfileCardState(EntityState.ENTITY_STATE_ACTIVE);
        setIsRestoring(false);
      });
  };

  return {
    onDownloadDistributive,
    onDownloadJavaDistributive,
    onBuildDistributive,
    isDisable: isRestoring,
    isConnected,
    isPacked,
    percentStage,
    percentAllStages,
    logs,
  };
};
