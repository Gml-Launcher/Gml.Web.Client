export const getFormatDate = (
  dateRaw: string,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
) => {
  const date = new Date(dateRaw);

  return new Intl.DateTimeFormat('ru-RU', options).format(date);
};
