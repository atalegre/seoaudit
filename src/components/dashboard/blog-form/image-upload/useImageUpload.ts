
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { uploadBlogImage } from '@/utils/supabaseBlogClient';
import { UnsplashImage } from './types';

export interface UseImageUploadOptions {
  initialImageUrl?: string;
}

export interface UseImageUploadResult {
  imageUrl: string;
  imageFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  unsplashDialogOpen: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: () => void;
  handleDelete: () => void;
  openUnsplashDialog: () => void;
  closeUnsplashDialog: () => void;
  handleUnsplashSelect: (url: string) => void;
  searchUnsplashForTitle: (title: { pt: string; en: string }) => Promise<UnsplashImage[]>;
  isDragging: boolean;
}

export const useImageUpload = (options: UseImageUploadOptions = {}): UseImageUploadResult => {
  const { initialImageUrl = '' } = options;
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [unsplashDialogOpen, setUnsplashDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  // Process file upload (from input or drop)
  const processFile = useCallback((file: File) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: language === 'pt' ? 'Arquivo inválido' : 'Invalid file',
        description: language === 'pt' 
          ? 'Por favor, selecione uma imagem (JPG, PNG, etc.)' 
          : 'Please select an image file (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: language === 'pt' ? 'Arquivo muito grande' : 'File too large',
        description: language === 'pt'
          ? 'A imagem deve ter menos de 5MB'
          : 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    setImageFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, [toast, language]);

  // Handle image selection from input
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  // Handle drag over event
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag leave event
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle image drop
  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  // Handle image deletion
  const handleDelete = useCallback(() => {
    setImageFile(null);
    setPreviewUrl(null);
    setImageUrl('');
  }, []);

  // Search Unsplash for a title
  const searchUnsplashForTitle = async (title: { pt: string; en: string }) => {
    try {
      // Choose title based on current language
      const searchTitle = language === 'en' ? title.en : title.pt;
      
      // This function should be implemented in your unsplashService.ts
      // Import searchUnsplashImages from './unsplashService';
      // const results = await searchUnsplashImages(searchTitle);
      // return results;
      
      // For now, return empty array as placeholder
      return [];
    } catch (error) {
      console.error('Error searching Unsplash:', error);
      return [];
    }
  };

  // Unsplash dialog handlers
  const openUnsplashDialog = () => setUnsplashDialogOpen(true);
  const closeUnsplashDialog = () => setUnsplashDialogOpen(false);
  
  // Handle Unsplash image selection
  const handleUnsplashSelect = (url: string) => {
    setPreviewUrl(url);
    setImageUrl(url);
    setImageFile(null);
    closeUnsplashDialog();
  };

  return {
    imageUrl,
    imageFile,
    previewUrl,
    isUploading,
    unsplashDialogOpen,
    handleImageChange,
    handleImageDrop,
    handleDragOver,
    handleDragLeave,
    handleDelete,
    openUnsplashDialog,
    closeUnsplashDialog,
    handleUnsplashSelect,
    searchUnsplashForTitle,
    isDragging
  };
};

export default useImageUpload;
