/**
 * Number of days in a particular month
 * @param month month between 0 and 11
 * @param year full year (1991, 2000)
 */
export function daysInMonth (month: number, year: number): number {
    return new Date(Date.UTC(year, month+1, 0)).getDate();
}

export  function isDateInMonth (month: number, year: number, date: Date): boolean {
    return date.getMonth() === month && date.getFullYear() === year;
}
