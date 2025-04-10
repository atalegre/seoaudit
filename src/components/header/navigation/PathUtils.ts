
export const getLocalizedPath = (
  ptPath: string, 
  enPath: string, 
  language: string
): string => {
  return language === 'pt' ? ptPath : enPath;
};
