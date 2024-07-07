import { Group } from '../interfaces/Group';

export const GetLocalTimeString = (dateString: string): string => {
    const date = new Date(dateString);
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset);
    return localISOTime.toLocaleString();
  };

export const GetLocalDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset);
    const year = localISOTime.getFullYear();
    const month = (`0${localISOTime.getMonth() + 1}`).slice(-2);
    const day = (`0${localISOTime.getDate()}`).slice(-2);
    const hours = (`0${localISOTime.getHours()}`).slice(-2);
    const minutes = (`0${localISOTime.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

export const getStatusColor = (group: Group) => {
  const now = new Date();
  const startDate = new Date(group.start_date);
  const endDate = new Date(group.end_date);

  if (group.is_active) {
    return 'text-green-400';
  } else if (startDate > now) {
    return 'text-orange-400';
  } else if (endDate < now) {
    return 'text-red-600';
  } else {
    return 'text-orange-400';
  }
};

export const getDateLabel = (date: Date, isStart: boolean) => {
  const now = new Date();
  const label = isStart ? (date > now ? 'Starts' : 'Started') : (date > now ? 'Ends' : 'Ended');
  return `${label}: ${GetLocalTimeString(date.toLocaleString())}`;
};
  