import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { checkUserRole } from '@/utils/auth/authService';
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

export type UserContextType = {
  user: any;
  role: string;
  loading: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  role: '',
  loading: true
});

export const useUser = () => useContext(UserContext);

const AuthButtons = () => {
  const navigate = useNavigate();
  const { user, role } = useUser();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => {
            if (role === 'admin') {
              navigate('/dashboard'); // Admin goes to main dashboard
            } else {
              navigate('/dashboard/client'); // Regular users go to client dashboard
            }
          }}
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
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in
    async function checkAuth() {
      setLoading(true);
      
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
        
        if (data.user) {
          // Get user role
          const userRole = await checkUserRole(data.user.id);
          setRole(userRole);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const userRole = await checkUserRole(session.user.id);
          setRole(userRole);
        } else {
          setRole('');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, role, loading }}>
      <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="container flex h-14 items-center">
          <Link to="/" className="mr-6 flex items-center">
            <img 
              src="/lovable-uploads/d5a32965-2a6a-49a6-8474-6efb96afd0f7.png" 
              alt="SEOAudit Logo" 
              className="h-16" 
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
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-white dark:bg-gray-900 shadow-lg">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-br from-seo to-aio p-6 no-underline outline-none focus:shadow-md text-white"
                          to="/guias/seo-aio-checklist"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            SEO AIO Checklist
                          </div>
                          <p className="text-sm leading-tight text-white/80">
                            Lista completa para otimizar o seu site para SEO e AI.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/guias" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                          <div className="text-sm font-medium leading-none">Guias</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Tutoriais e guias detalhados sobre SEO.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/blog" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-seo/10 hover:text-seo focus:bg-seo/10 focus:text-seo")}>
                          <div className="text-sm font-medium leading-none">Blog</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Artigos e novidades sobre SEO e AI.</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/glossario" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-aio/10 hover:text-aio focus:bg-aio/10 focus:text-aio")}>
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
    </UserContext.Provider>
  );
};

export default Header;
