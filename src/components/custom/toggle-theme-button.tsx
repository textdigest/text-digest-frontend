'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ToggleThemeButton() {
    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Code referencing useTheme has to use this pattern...
        // https://stackoverflow.com/questions/77026759/using-next-themes-for-dark-mode-generates-hydration-failed-error
        setMounted(true);
    }, []);

    if (mounted) {
        return (
            <Button
                variant='secondary'
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
                {theme === 'light' ? <Moon /> : <Sun />}
            </Button>
        );
    }
}
