'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ToggleThemeButton() {
    const { theme, setTheme } = useTheme();

    return (
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? <Moon /> : <Sun />}
        </Button>
    );
}
