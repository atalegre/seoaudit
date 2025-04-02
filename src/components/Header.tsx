
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';

const AuthButtons = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Check if user is logged in
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard/client')}
        >
          Dashboard
        </Button>
        <Button variant="ghost" onClick={handleSignOut}>Sair</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link to="/signin">Entrar</Link>
      </Button>
      <Button variant="default" asChild>
        <Link to="/signup">Registar</Link>
      </Button>
    </div>
  );
};

const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <img 
            src="/lovable-uploads/4b0e451b-bcd1-4279-8dce-f9da22670979.png" 
            alt="SEOAudit Logo" 
            className="h-8" 
          />
        </Link>
        
        <NavigationMenu className="hidden md:flex mr-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className={navigationMenuTriggerStyle()}>
                Home
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Recursos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-900">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/20 to-primary/5 p-6 no-underline outline-none focus:shadow-md"
                        to="/guias/seo-aio-checklist"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                          SEO AIO Checklist
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Lista completa para otimizar o seu site para SEO e AI.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/guias" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                        <div className="text-sm font-medium leading-none">Guias</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Tutoriais e guias detalhados sobre SEO.</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/blog" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                        <div className="text-sm font-medium leading-none">Blog</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Artigos e novidades sobre SEO e AI.</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/glossario" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                        <div className="text-sm font-medium leading-none">Glossário</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Termos e conceitos de SEO e IA explicados.</p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/como-funciona" className={navigationMenuTriggerStyle()}>
                Como Funciona
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/faq" className={navigationMenuTriggerStyle()}>
                FAQ
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/contacto" className={navigationMenuTriggerStyle()}>
                Contacto
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="ml-auto">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;
