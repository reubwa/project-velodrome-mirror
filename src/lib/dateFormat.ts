/**
 * Formats a given date to only return the time in a visually appealing format
 * @param {Date} value - the date to format
 * @return {string} - the formatted time
 * */
export function dateformat(value: Date): string {
	if (value.toDateString() == new Date(Date.now()).toDateString()) return value.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});
	return `${value.toDateString()}, ${value.toLocaleTimeString()}`;
}