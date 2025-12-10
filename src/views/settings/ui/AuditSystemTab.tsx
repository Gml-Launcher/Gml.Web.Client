"use client";

import React, { ReactNode, useMemo } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Button } from "@/shared/ui/button";
import { useAuditHub } from "@/views/settings/lib/hooks/useAuditHub";

type AuditStatus = "success" | "error" | "warning" | "info";

export interface AuditCheck {
  key: string;
  title: string;
  description?: string;
  status: AuditStatus;
  progress: number; // 0..100
  details?: ReactNode; // customizable popup content
  counts?: {
    error: number;
    warning: number;
    success: number;
    info: number; // default/neutral
  };
}

export interface AuditSystemTabProps {
  progress?: number; // overall progress, optional; if not provided, derived from checks
  checks?: AuditCheck[]; // optional external list; typically use live results from hub
}

// Severity ordering helpers
const statusSeverity: Record<AuditStatus, number> = {
  error: 3,
  warning: 2,
  success: 1,
  info: 0,
};

const messageSeverity: Record<"default" | "success" | "warning" | "error", number> = {
  error: 3,
  warning: 2,
  success: 1,
  default: 0,
};

const compareStatusDesc = (a: AuditStatus, b: AuditStatus) => statusSeverity[b] - statusSeverity[a];
const compareMessageDesc = (
  a: "default" | "success" | "warning" | "error",
  b: "default" | "success" | "warning" | "error",
) => messageSeverity[b] - messageSeverity[a];

const statusIcon = (status: AuditStatus) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "error":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case "info":
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />;
  }
};

const messageIcon = (type: "default" | "success" | "warning" | "error") => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "error":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "default":
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

export const AuditSystemTab: React.FC<AuditSystemTabProps> = ({ progress, checks }) => {
  const items = checks ?? [];
  const { percent: hubPercent, start, hasStarted, isRunning, results } = useAuditHub();

  const liveItems: AuditCheck[] = useMemo(() => {
    if (!results?.length) return [];
    return results.map((stage) => {
      const sortedMessages = [...(stage.messages ?? [])].sort((m1, m2) =>
        compareMessageDesc(m1.type, m2.type),
      );
      const hasError = stage.messages?.some((m) => m.type === "error");
      const hasWarning = stage.messages?.some((m) => m.type === "warning");
      const hasSuccess = stage.messages?.some((m) => m.type === "success");
      const status: AuditStatus = hasError ? "error" : hasWarning ? "warning" : hasSuccess ? "success" : "info";

      const counts = {
        error: sortedMessages.filter((m) => m.type === "error").length ?? 0,
        warning: sortedMessages.filter((m) => m.type === "warning").length ?? 0,
        success: sortedMessages.filter((m) => m.type === "success").length ?? 0,
        info: sortedMessages.filter((m) => m.type === "default").length ?? 0,
      };

      const details = (
        <div className="space-y-3">
          {sortedMessages.length ? (
            <div>
              <div className="mb-1 text-xs uppercase text-muted-foreground">Результаты этапа</div>
              <ul className="space-y-1">
                {sortedMessages.map((m, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5">{messageIcon(m.type)}</span>
                    <span className="text-sm leading-relaxed">{m.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Нет сообщений по результатам.</div>
          )}

          <div className="pt-2 border-t">
            <div className="mb-1 text-xs uppercase text-muted-foreground">Что проверялось</div>
            {stage.subStages?.length ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {stage.subStages.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-muted-foreground">Нет данных по подпунктам.</div>
            )}
          </div>
        </div>
      );

      return {
        key: stage.name,
        title: stage.name,
        description: stage.description,
        status,
        progress: 100,
        details,
        counts,
      } as AuditCheck;
    });
  }, [results]);

  const derivedProgress = useMemo(() => {
    if (typeof progress === "number") return Math.max(0, Math.min(100, progress));
    if (!items.length) return 0;
    const sum = items.reduce((acc, x) => acc + (x.progress ?? 0), 0);
    return Math.round(sum / items.length);
  }, [items, progress]);

  const overallProgress = hasStarted ? hubPercent : derivedProgress;
  const itemsToShow = hasStarted ? (liveItems.length ? liveItems : []) : items;
  const itemsSortedToShow = useMemo(() => {
    const src = itemsToShow;
    if (!src?.length) return [] as AuditCheck[];
    return [...src].sort((a, b) => compareStatusDesc(a.status, b.status));
  }, [itemsToShow]);

  return (
    <Card>
      {hasStarted ? (
        <>
          <CardHeader className="gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Аудит системы</CardTitle>
                <CardDescription>
                  Прогресс аудита: <span className="font-medium text-foreground">{overallProgress}%</span>
                </CardDescription>
              </div>
              <Button onClick={() => start()} disabled={isRunning} variant="secondary">
                {isRunning ? "Повторный запуск..." : "Запустить повторно"}
              </Button>
            </div>
            <Progress value={overallProgress} />
          </CardHeader>
          <CardContent className="space-y-2">
            {hasStarted && liveItems.length === 0 && (
              <div className="text-sm text-muted-foreground">Ожидаем результаты аудита...</div>
            )}
            {itemsSortedToShow.map((item) => (
              <Popover key={item.key}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left"
                    aria-label={`Подробнее: ${item.title}`}
                  >
                    <div className="flex items-start gap-3 rounded-md p-3 hover:bg-muted transition-colors">
                      <div className="mt-0.5 shrink-0">{statusIcon(item.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="truncate">
                            <div className="font-medium truncate">{item.title}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {item.description}
                              </div>
                            )}
                          </div>
                          {/* Right side: counts instead of percent */}
                          {item.counts && (
                            <div className="shrink-0 flex items-center gap-3 text-sm tabular-nums">
                              {item.counts.error > 0 && (
                                <span className="flex items-center gap-1 text-red-500">
                                  <XCircle className="h-4 w-4" />
                                  <span className="text-foreground">{item.counts.error}</span>
                                </span>
                              )}
                              {item.counts.warning > 0 && (
                                <span className="flex items-center gap-1 text-orange-500">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-foreground">{item.counts.warning}</span>
                                </span>
                              )}
                              {item.counts.success > 0 && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="text-foreground">{item.counts.success}</span>
                                </span>
                              )}
                              {item.counts.info > 0 && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Info className="h-4 w-4" />
                                  <span className="text-foreground">{item.counts.info}</span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        {/* Remove per-item progress bar; counts are displayed instead */}
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[720px] max-w-[90vw]">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{statusIcon(item.status)}</div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm leading-relaxed">{item.details ?? "Нет дополнительных данных."}</div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </CardContent>
        </>
      ) : (
        <CardHeader className="gap-4">
          <div>
            <CardTitle>Аудит системы</CardTitle>
            <CardDescription>
              Нажмите кнопку ниже, чтобы запустить аудит. Прогресс и детали появятся автоматически.
            </CardDescription>
          </div>
          <div>
            <Button onClick={() => start()} disabled={isRunning}>
              {isRunning ? "Запуск..." : "Запустить аудит системы"}
            </Button>
          </div>
        </CardHeader>
      )}
    </Card>
  );
};

export default AuditSystemTab;
