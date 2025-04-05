
/**
 * Formata uma data para exibição
 * @param date Data para ser formatada
 * @returns String formatada da data ou 'Nunca' se não houver data
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'Nunca';
  
  if (typeof date === 'string') {
    return date || 'Nunca';
  }
  
  try {
    return date.toLocaleDateString() || 'Nunca';
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Nunca';
  }
};
