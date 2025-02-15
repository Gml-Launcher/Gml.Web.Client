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

export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} секунд назад`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} минут назад`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} час${hours > 1 && hours < 5 ? 'а' : hours === 1 ? '' : 'ов'} назад`;
  }

  const days = Math.floor(hours / 24);
  if (days === 1) {
    return 'вчера';
  }
  if (days === 2) {
    return 'позавчера';
  }
  if (days < 30) {
    return `${days} дней назад`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} месяц${months > 1 && months < 5 ? 'а' : months === 1 ? '' : 'ев'} назад`;
  }

  const years = Math.floor(months / 12);
  return `${years} год${years > 1 && years < 5 ? 'а' : years === 1 ? '' : 'ов'} назад`;
};
