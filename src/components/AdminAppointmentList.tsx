// src/components/AdminAppointmentList.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// 1. CORRECCIÓN: profiles ahora es un array de objetos.
export interface Appointment {
    id: number;
    appointment_date: string;
    notes: string | null;
    status: string;
    profiles: {
        full_name: string | null;
        email: string;
    }[];
}

interface AdminAppointmentListProps {
    initialAppointments: Appointment[];
}

export default function AdminAppointmentList({ initialAppointments }: AdminAppointmentListProps) {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleStatusChange = async (apptId: number, newStatus: string, apptDetails: Appointment) => {
        setUpdatingId(apptId);
        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', apptId);
        if (error) {
            console.error("Error al actualizar la cita:", error);
        } else {
            setAppointments(current => current.map(appt => appt.id === apptId ? { ...appt, status: newStatus } : appt));
            await supabase.functions.invoke('notify-appointment', {
                body: { type: 'email', appointment: { ...apptDetails, status: newStatus } },
            });
        }
        setUpdatingId(null);
    };

    return (
        <Card>
            <CardHeader><CardTitle>Citas Solicitadas</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha y Hora</TableHead>
                            <TableHead>Notas</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {appointments.map((appt) => (
                            <TableRow key={appt.id}>
                                <TableCell className="font-medium">
                                    {/* 2. CORRECCIÓN: Accedemos al primer elemento del array: profiles[0] */}
                                    {appt.profiles?.[0]?.full_name || appt.profiles?.[0]?.email || 'N/A'}
                                </TableCell>
                                <TableCell>{format(new Date(appt.appointment_date), "Pp", { locale: es })}</TableCell>
                                <TableCell>{appt.notes || 'Sin notas'}</TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={appt.status}
                                        onValueChange={(newStatus) => handleStatusChange(appt.id, newStatus, appt)}
                                        disabled={updatingId === appt.id}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Solicitada">Solicitada</SelectItem>
                                            <SelectItem value="Confirmada">Confirmada</SelectItem>
                                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                                            <SelectItem value="Reprogramar">Reprogramar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}