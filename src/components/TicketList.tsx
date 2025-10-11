// src/components/TicketList.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

// Definimos cómo se ve un objeto de ticket
export interface Ticket {
    id: number;
    created_at: string;
    title: string;
    status: string;
    priority: string;
}

interface TicketListProps {
    tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
    if (!tickets || tickets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Mis Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Aún no has creado ningún ticket.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mis Tickets</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Título</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell className="font-medium">{ticket.title}</TableCell>
                                <TableCell>{ticket.priority}</TableCell>
                                <TableCell>{ticket.status}</TableCell>
                                <TableCell>
                                    {new Date(ticket.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}