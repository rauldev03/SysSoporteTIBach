// src/components/LogoutButton.tsx
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        } else {
            // Redirigir al usuario a la página de login después de cerrar sesión
            window.location.href = '/login';
        }
    };

    return (
        <Button variant="destructive" onClick={handleLogout}>
            Cerrar Sesión
        </Button>
    );
}