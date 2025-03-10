import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hexToHsl, hslToHex } from '@/utils/colorUtils'; // Necesitarás estas utilidades

type Theme = 'light' | 'dark' | 'system';

const defaultColors = {
  primary: '0, 0%, 9%',
  accent: '0, 0%, 96.1%',
  background: '0, 0%, 100%',
  foreground: '0, 0%, 3.9%',
}

interface ConfigState {
  company: {
    name: string;
    logo?: string;
  };
  theme: Theme;
  colors: {
    primary: string; // Almacenar en HSL
    accent: string;  // Almacenar en HSL
    background: string; // Almacenar en HSL
    foreground: string;
  };
  
  setCompany: (company: Partial<ConfigState['company']>) => void;
  setTheme: (theme: Theme) => void;
  setColors: (colors: Partial<ConfigState['colors']>) => void;
  resetColors: () => void; // Añadir función para restablecer colores

}

export const useConfigStore = create(
  persist<ConfigState>(
    (set) => ({
      company: {
        name: 'Mi Empresa',
        logo: '',
      },
      theme: 'light',
      colors: { ...defaultColors },
      setCompany: (company) => set((state) => ({ 
        company: { ...state.company, ...company } 
      })),
      setTheme: (theme) => set({ theme }),
      setColors: (colors) => set((state) => ({
        colors: {
          ...state.colors,
          ...Object.entries(colors).reduce((acc, [key, value]) => {
            acc[key] = hexToHsl(value); // Convertir HEX a HSL
            return acc;
          }, {} as Record<string, string>)
        }
      })),
      resetColors: () => set({ colors: defaultColors }), // Implementar función para restablecer colores
    }),
    {
      name: 'config-storage',
    }
  )
);