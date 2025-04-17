import dayjs from 'dayjs'

export const disabledFutureDate = (current: dayjs.Dayjs ) => {
        // Disable dates after today
        return current && current > dayjs().endOf('day');
    };