export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB').format(date); // 'en-GB' for dd/mm/yyyy format
};