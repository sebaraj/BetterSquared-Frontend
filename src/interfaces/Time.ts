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
  