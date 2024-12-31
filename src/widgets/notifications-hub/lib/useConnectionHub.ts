import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { getApiBaseUrl } from '@/shared/lib/utils';
import { getStorageAccessToken } from '@/shared/services';
import { useNotificationsState } from '@/views/notification/lib/store';
import { NotificationBaseEntity } from '@/shared/api/contracts';
import { useNotifications } from '@/shared/hooks';

const CONNECTION_URL = (token: string) =>
  `${getApiBaseUrl()}/ws/notifications?access_token=${token}`;

export const useConnectionHub = () => {
  const { addNotification, addCount, setNotifications, setCount } = useNotificationsState();

  const { data, isLoading } = useNotifications();

  useEffect(() => {
    if (data) {
      setCount(data.amount);
      setNotifications(data.notifications);
    }
  }, [data]);

  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

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

        connection.on('Notifications', (notification: NotificationBaseEntity) => {
          const { details, message } = notification;
          addCount();
          addNotification(notification);
          toast.error(message, {
            description: details && `${details?.substring(0, 50)}...`,
            action: {
              label: 'Копировать',
              onClick: async () => {
                await navigator.clipboard.writeText(details ? details : message);
                toast('Текст успешно скопирован', { duration: 500, onAutoClose: () => true });
              },
            },
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
};
