// src/components/AppointmentForm.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react'; // Iconos
import { format } from 'date-fns'; // Ayudante para formatear fechas
import { es } from 'date-fns/locale'; // Para formato de fecha en español

export default function AppointmentForm() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!date || !time) {
            setMessage('Por favor, selecciona una fecha y una hora.');
            return;
        }
        setIsSubmitting(true);
        setMessage('');

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMessage('Error: Debes iniciar sesión.');
            setIsSubmitting(false);
            return;
        }

        // Combinamos la fecha y la hora en un solo objeto de fecha ISO 8601
        const [hours, minutes] = time.split(':');
        const appointmentDate = new Date(date);
        appointmentDate.setHours(parseInt(hours), parseInt(minutes));

        const { error } = await supabase.from('appointments').insert({
            appointment_date: appointmentDate.toISOString(),
            notes,
            client_id: user.id,
        });

        if (error) {
            setMessage(`Error al solicitar la cita: ${error.message}`);
        } else {
            setMessage('¡Cita solicitada exitosamente! Nos pondremos en contacto para confirmar.');
            setDate(undefined);
            setTime('');
            setNotes('');
            // No recargamos para no perder el mensaje de éxito
        }
        setIsSubmitting(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Solicitar una Cita</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label>Fecha</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(day) => day < new Date(new Date().setDate(new Date().getDate() - 1))} // Deshabilita días pasados
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="time">Hora</Label>
                        <input
                            id="time"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notas Adicionales</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Describe brevemente el motivo de la cita (opcional)"
                        />
                    </div>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Solicitando...' : 'Solicitar Cita'}
                    </Button>
                    {message && <p className="text-sm pt-2">{message}</p>}
                </form>
            </CardContent>
        </Card>
    );
}