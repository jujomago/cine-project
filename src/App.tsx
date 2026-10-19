import { AppRouting } from '@/routing/app-routing';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './auth/providers/local-auth-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';


const { BASE_URL } = import.meta.env;

export function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeProvider>
          <HelmetProvider>
            <TooltipsProvider>
              <LoadingBarContainer>
                <BrowserRouter basename={BASE_URL}>
                  <Toaster />

                  <AppRouting />
                </BrowserRouter>
              </LoadingBarContainer>
            </TooltipsProvider>
          </HelmetProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
