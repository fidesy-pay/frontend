export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        timeStyle: 'short',
        dateStyle: 'medium',
    }).format(date);
};

export const formatDateV2 = (inputDate: string) => {
    // Parse the input date string
    const date = new Date(inputDate);

    // Get the month abbreviation
    const monthAbbreviation = date.toLocaleString('default', { month: 'short' });

    // Get the day without leading zeroes
    const day = date.getDate();

    // Get the hour in 12-hour format without leading zeroes
    let hour = date.getHours() % 12;
    if (hour === 0) hour = 12;

    // Get the minutes with leading zeroes
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Get the AM/PM indicator
    const amPm = date.getHours() >= 12 ? 'PM' : 'AM';

    // Construct the formatted date string
    const formattedDate = `${monthAbbreviation} ${day} ${hour}:${minutes} ${amPm}`;

    return formattedDate;
}