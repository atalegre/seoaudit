
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { searchUnsplashImages } from './unsplashService';
import { UnsplashImage } from './types';

interface UnsplashImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  blogTitle: { pt: string; en: string };
}

const UnsplashImagePicker: React.FC<UnsplashImagePickerProps> = ({ 
  isOpen, 
  onClose, 
  onSelectImage,
  blogTitle
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  
  // Use title from current language or default to Portuguese
  const title = language === 'en' ? blogTitle.en : blogTitle.pt;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const query = searchQuery || title;
      if (!query) {
        setError('Please enter a search term');
        setLoading(false);
        return;
      }
      
      const results = await searchUnsplashImages(query);
      setImages(results);
    } catch (err) {
      console.error('Error searching Unsplash:', err);
      setError('Failed to search images. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Search Unsplash Images</DialogTitle>
          <DialogDescription>
            Find and select royalty-free images for your blog post
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex gap-2 my-4">
          <Input
            placeholder={`Search images (defaults to blog title: ${title})`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </form>
        
        {error && <p className="text-destructive text-sm my-2">{error}</p>}
        
        {loading ? (
          <div className="flex justify-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className="relative aspect-video overflow-hidden rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelectImage(image.urls.regular)}
              >
                <img 
                  src={image.urls.small} 
                  alt={image.alt_description || 'Unsplash image'} 
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                  by <a 
                    href={`https://unsplash.com/@${image.user.username}?utm_source=seo_ai_checker&utm_medium=referral`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="underline"
                  >
                    {image.user.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && images.length === 0 && (
          <p className="text-center text-muted-foreground my-8">
            No images found. Try a different search term.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnsplashImagePicker;
