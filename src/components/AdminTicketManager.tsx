// src/components/AdminTicketManager.tsx
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// 1. CORRECCIÓN: profiles ahora es un array de objetos.
export interface AdminTicket {
    id: number;
    created_at: string;
    title: string;
    status: string;
    priority: string;
    profiles: {
        full_name: string | null;
        email: string;
    }[];
}

interface AdminTicketManagerProps {
    initialTickets: AdminTicket[];
}

export default function AdminTicketManager({ initialTickets }: AdminTicketManagerProps) {
    const [tickets, setTickets] = useState(initialTickets);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    const handleStatusChange = async (ticketId: number, newStatus: string) => {
        setUpdatingId(ticketId);
        const { error } = await supabase
            .from('tickets')
            .update({ status: newStatus })
            .eq('id', ticketId);
        if (error) {
            console.error("Error al actualizar el estado:", error);
        } else {
            setTickets(currentTickets =>
                currentTickets.map(ticket =>
                    ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
                )
            );
        }
        setUpdatingId(null);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Prioridad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                            {/* 2. CORRECCIÓN: Accedemos al primer elemento del array: profiles[0] */}
                            {ticket.profiles?.[0]?.full_name || ticket.profiles?.[0]?.email || 'N/A'}
                        </TableCell>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>{ticket.priority}</TableCell>
                        <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Select
                                defaultValue={ticket.status}
                                onValueChange={(newStatus) => handleStatusChange(ticket.id, newStatus)}
                                disabled={updatingId === ticket.id}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Abierto">Abierto</SelectItem>
                                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                                    <SelectItem value="Resuelto">Resuelto</SelectItem>
                                    <SelectItem value="Cerrado">Cerrado</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}