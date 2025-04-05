
/**
 * Formats a date for display
 * @param date Date to be formatted
 * @returns Formatted date string or 'Never' if no date
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'Never';
  
  try {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      // Check if parsing produced a valid date
      if (isNaN(parsedDate.getTime())) {
        return date || 'Never';
      }
      return parsedDate.toLocaleDateString();
    }
    
    // If it's already a Date object
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Never';
  }
};
