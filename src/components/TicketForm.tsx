// src/components/TicketForm.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function TicketForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Media');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        // Primero, obtenemos el usuario actual de la sesión
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setMessage('Error: Debes iniciar sesión para crear un ticket.');
            setIsSubmitting(false);
            return;
        }

        // Insertamos el nuevo ticket en la base de datos
        const { error } = await supabase.from('tickets').insert({
            title,
            description,
            priority,
            client_id: user.id, // Asociamos el ticket al usuario logueado
        });

        if (error) {
            setMessage(`Error al crear el ticket: ${error.message}`);
        } else {
            setMessage('¡Ticket creado exitosamente!');
            // Limpiar formulario y recargar la página para ver el nuevo ticket
            setTitle('');
            setDescription('');
            setPriority('Media');
            window.location.reload();
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Crear Nuevo Ticket de Soporte</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ej: El monitor no enciende"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe el problema con más detalle..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Prioridad</Label>
                        <Select onValueChange={setPriority} defaultValue="Media">
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Baja">Baja</SelectItem>
                                <SelectItem value="Media">Media</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
                    </Button>
                    {message && <p className="text-sm pt-2">{message}</p>}
                </form>
            </CardContent>
        </Card>
    );
}