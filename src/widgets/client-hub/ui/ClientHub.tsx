"use client";

import { useEffect, useState } from "react";

import { HubConnectionBuilder } from "@microsoft/signalr";

export const ClientHub = () => {
  const [connectionCount, setConnectionCount] = useState(0);
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(`${process.env.BASE_URL}/ws/profiles/restore`, {
        headers: { "Access-Control-Allow-Credentials": "*" },
        withCredentials: false,
      })
      .build();

    connection.on("FileChanged", (onConnection) => {
      setConnectionCount(onConnection);
    });

    connection.start().then(() => {
      connection.send("Pack", "Hitech").then((data) => console.log(data));
    });

    return () => {
      connection.stop().then(() => {
        console.log("Connection finished");
      });
    };
  }, []);

  return connectionCount;
};
