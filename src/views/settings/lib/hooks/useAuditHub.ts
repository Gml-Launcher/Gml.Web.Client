"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { toast } from "sonner";

import { getApiBaseUrl } from "@/shared/lib/utils";
import { getStorageAccessToken } from "@/shared/services";

const CONNECTION_URL = (token: string) => `${getApiBaseUrl()}/ws/audit?access_token=${token}`;

export interface AuditStageResultMessage {
  type: "default" | "success" | "warning" | "error";
  message: string;
}

export interface AuditStageResult {
  name: string;
  description: string;
  subStages: string[];
  messages: AuditStageResultMessage[];
}

export interface UseAuditHubState {
  connection: HubConnection | null;
  isConnected: boolean;
  isRunning: boolean;
  hasStarted: boolean;
  percent: number;
  results: AuditStageResult[];
  // Start audit. If address is not provided, getApiBaseUrl() will be used by default.
  start: (address?: string) => Promise<void>;
  stop: () => Promise<void>;
}

export const useAuditHub = (): UseAuditHubState => {
  const token = getStorageAccessToken();

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [percent, setPercent] = useState(0);
  const [results, setResults] = useState<AuditStageResult[]>([]);

  const startingRef = useRef(false);

  const ensureConnection = useCallback(async () => {
    if (!token) throw new Error("Нет access token для подключения к AuditHub");
    if (connection && isConnected) return connection;

    const conn = new HubConnectionBuilder()
      .withUrl(CONNECTION_URL(token), { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    setConnection(conn);

    // Register listeners before start
    // Primary event name from backend samples
    conn.on("AuditHubChangeProgress", (p: number) => {
      setPercent(Math.max(0, Math.min(100, Number(p) || 0)));
    });

    // Backward/alternative event names for compatibility
    conn.on("AuditChangeProgress", (p: number) => {
      setPercent(Math.max(0, Math.min(100, Number(p) || 0)));
    });

    conn.on("ChangeProgress", (p: number) => {
      setPercent(Math.max(0, Math.min(100, Number(p) || 0)));
    });

    conn.on("Message", (message: string) => {
      toast.info("Информация", { description: message });
      if (typeof message === "string" && message.toLowerCase().includes("завершен")) {
        setIsRunning(false);
        setPercent((v) => (v < 100 ? 100 : v));
      }
    });

    conn.on("AuditEnded", () => {
      setIsRunning(false);
      setPercent((v) => (v < 100 ? 100 : v));
      toast.success("Аудит завершен");
    });

    // Receive stage results
    // Signature now (backend): AuditResult(name: string, description: string, subStages: string[], resultJsonOrObj)
    // 4th arg may be either an object or a JSON string: { "Messages": [{ "Type": 1, "Message": "..." }] }
    conn.on(
      "AuditResult",
      (
        name: string,
        description: string,
        subStages: string[] = [],
        result: any = {},
      ) => {
        try {
          // If backend sends JSON string, parse it safely
          if (typeof result === "string") {
            try {
              result = JSON.parse(result);
            } catch (parseErr) {
              console.warn("Failed to parse AuditResult JSON string", parseErr);
              result = {};
            }
          }

          const rawMessages: any[] = Array.isArray(result?.Messages)
            ? result.Messages
            : Array.isArray(result?.messages)
              ? result.messages
              : [];

          const normalizeType = (t: any): AuditStageResultMessage["type"] => {
            if (typeof t === "string") {
              const s = t.toLowerCase();
              if (s.includes("error")) return "error";
              if (s.includes("warning")) return "warning";
              if (s.includes("success")) return "success";
              return "default";
            }
            if (typeof t === "number") {
              // Backend enum: 0 Default, 1 Success, 2 Warning, 3 Error
              if (t === 3) return "error";
              if (t === 2) return "warning";
              if (t === 1) return "success";
              return "default";
            }
            return "default";
          };

          const messages: AuditStageResultMessage[] = rawMessages.map((m) => ({
            type: normalizeType(m?.Type ?? m?.type),
            message: String(m?.Message ?? m?.message ?? ""),
          }));

          setResults((prev) => {
            const idx = prev.findIndex((x) => x.name === name);
            const nextStage: AuditStageResult = {
              name,
              description,
              subStages: Array.isArray(subStages) ? subStages : [],
              messages,
            };
            if (idx >= 0) {
              const copy = prev.slice();
              copy[idx] = nextStage;
              return copy;
            }
            return [...prev, nextStage];
          });
        } catch (e) {
          console.warn("Failed to parse AuditResult", e);
        }
      },
    );

    await conn.start();
    setIsConnected(true);
    return conn;
  }, [connection, isConnected, token]);

  const start = useCallback(async (address?: string) => {
    if (startingRef.current) return;
    startingRef.current = true;
    try {
      const conn = await ensureConnection();
      setHasStarted(true);
      setIsRunning(true);
      setPercent(0);
      setResults([]);
      const addr = (address && String(address).trim().length > 0)
        ? String(address).trim()
        : getApiBaseUrl();
      await conn.invoke("Start", addr);
    } catch (e) {
      console.error(e);
      toast.error("Не удалось запустить аудит", {
        description: e instanceof Error ? e.message : String(e),
      });
      setIsRunning(false);
    } finally {
      startingRef.current = false;
    }
  }, [ensureConnection]);

  const stop = useCallback(async () => {
    try {
      await connection?.stop();
    } catch (e) {
      // ignore
    } finally {
      setIsConnected(false);
    }
  }, [connection]);

  useEffect(() => {
    return () => {
      // cleanup
      if (connection) {
        connection.stop().catch(() => {});
      }
    };
  }, [connection]);

  return { connection, isConnected, isRunning, hasStarted, percent, results, start, stop };
};
