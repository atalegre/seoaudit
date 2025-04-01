
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -80% 0px',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Conteúdo</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1 text-sm">
          {headings.map((heading) => (
            <li key={heading.id}>
              <button
                onClick={() => scrollToSection(heading.id)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded hover:bg-secondary transition-colors",
                  heading.level === 3 && "pl-6",
                  activeId === heading.id && "bg-secondary font-medium",
                  activeId === heading.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TableOfContents;
