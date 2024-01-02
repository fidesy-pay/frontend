export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        timeStyle: 'short',
        dateStyle: 'medium',
    }).format(date);
};