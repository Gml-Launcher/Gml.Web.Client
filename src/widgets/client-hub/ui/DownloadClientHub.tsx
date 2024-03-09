"use client";

import React, { useEffect, useState } from "react";

import { getStorageAccessToken } from "@/shared/services";

import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DownloadClientHubProps {
  profileName: string;
}

export function DownloadClientHub(props: DownloadClientHubProps) {
  const { profileName } = props;
  const accessToken = getStorageAccessToken();

  const [connectionHub, setConnectionHub] = useState<HubConnection | null>(null);

  const [message, setMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    const onConnectedHub = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(
            `${process.env.NEXT_PUBLIC_BASE_URL}/ws/profiles/restore?access_token=${accessToken}`,
            {
              headers: { "Access-Control-Allow-Credentials": "*" },
              withCredentials: false,
            },
          )
          .withAutomaticReconnect()
          .build();
        setConnectionHub(connection);

        await connection.start();

        connection.on("BlockRestore", (message) => {
          setIsRestoring(true);
          console.log("@BlockRestore", message);
        });

        connection.on("SuccessInstalled", () => {
          setIsRestoring(false);
          setMessage("Success");
        });

        connection.on("SuccessPacked", () => {
          setIsRestoring(false);
          setMessage("Success");
        });

        connection.on("Message", (message) => {
          setMessage(message);
        });

        connection.on("ChangeProgress", (percent) => {
          setProgressPercent(percent);
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

  const isDisableConnected = connectionHub?.state !== HubConnectionState.Connected || isRestoring;
  const onDownloadDistributive = () => {
    setIsRestoring(true);
    connectionHub?.invoke("Restore", profileName);
  };

  const onBuildDistributive = () => {
    setIsRestoring(true);
    connectionHub?.invoke("Build", profileName);
  };

  return (
    <>
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Загрузка клиента</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-6">
          <Button className="w-fit" onClick={onDownloadDistributive} disabled={isDisableConnected}>
            Загрузить
          </Button>

          <Button className="w-fit" onClick={onBuildDistributive} disabled={isDisableConnected}>
            Собрать профиль
          </Button>
          <Progress value={progressPercent} />
          <p>{message}</p>
          <p>{connectionHub?.state}</p>
        </CardContent>
      </Card>
    </>
  );
}
