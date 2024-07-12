import { useEffect, useState } from "react";

import { toast as sonner } from "sonner";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import { getApiBaseUrl } from "@/shared/lib/utils";
import { getStorageAccessToken } from "@/shared/services";

type NotificationsParams = {
  message: string;
  details: Nullable<string>;
};

const CONNECTION_URL = (token: string) =>
  `${getApiBaseUrl()}/ws/notifications?access_token=${token}`;

export const useConnectionHub = () => {
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

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

        connection.on("Notifications", ({ message, details }: NotificationsParams) => {
          sonner(message, {
            description: details && `${details?.substring(0, 50)}...`,
            action: {
              label: "Cкопировать",
              onClick: async () => {
                await navigator.clipboard.writeText(details ? details : message);
                sonner("Текст успешно скопирован", { duration: 500, onAutoClose: () => true });
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
