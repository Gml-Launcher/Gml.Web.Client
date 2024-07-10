export enum NotificationStatus {
  TRACE,
  DEBUG,
  INFORMATION,
  WARNING,
  ERROR,
  FATAL,
}

export enum NotificationTextOption {
  "OPTION_5" = "Фатальная ошибка", // Бардовый Fatal
  "OPTION_4" = "Ошибка", // Красный Error
  "OPTION_3" = "Предупреждение", // Оранжевый Warn
  "OPTION_2" = "Информация", // Синенький Info
  "OPTION_1" = "Дебаг", // Белый Debug
  "OPTION_0" = "Стактрейс", // серый Trace
}
