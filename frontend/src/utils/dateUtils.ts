// src/utils/dateUtils.ts
import dayjs from 'dayjs';

export const formatDate = (date: string | Date | null, format: string = 'MMMM D, YYYY') => {
    if (!date) return 'N/A';
    return dayjs(date).format(format);
};

export const formatDateWithTime = (date: string | Date | null, format: string = 'MMMM D, YYYY h:mm A') => {
    if (!date) return 'N/A';
    return dayjs(date).format(format);
};

export const formatTime = (date: string | Date | null, format: string = 'h:mm A') => {
    if (!date) return 'N/A';
    return dayjs(date).format(format);
};