export enum EntityState {
  ENTITY_STATE_CREATED = 0, // Профиль создан
  ENTITY_STATE_LOADING = 1, // Профиль загружается
  ENTITY_STATE_ACTIVE = 2, // Профиль активен
  ENTITY_STATE_INITIALIZE = 3, // Подготовка профиля
  ENTITY_STATE_ERROR = 4, // Ошибка при работе с профилем
  ENTITY_STATE_NEED_COMPILE = 5, // Необходима сборка профиля
  ENTITY_STATE_PACKING = 6, // Необходима сборка профиля

  ENTITY_STATE_DISABLED = 99999, // Профиль выключен
}

export enum EntityStateOption {
  'OPTION_0' = 'Создан', // Профиль создан
  'OPTION_1' = 'Загружается', // Профиль загружается
  'OPTION_2' = 'Активен', // Профиль активен
  'OPTION_3' = 'Подготовка', // Подготовка профиля
  'OPTION_4' = 'Ошибка', // Ошибка при работе с профилем
  'OPTION_5' = 'Необходима сборка', // Необходима сборка профиля
  'OPTION_6' = 'Сборка', // Сборка профиля
  'OPTION_99999' = 'Недоступен', // Профиль выключен
}
