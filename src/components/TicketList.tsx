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
import { cn } from "@/lib/utils";

export interface Ticket {
    id: number;
    created_at: string;
    title: string;
    status: string;
    priority: string;
}

const statusRowColors: Record<string, string> = {
    'Abierto': 'bg-orange-200/80 hover:bg-orange-300 text-orange-900',
    'En Proceso': 'bg-blue-200/80 hover:bg-blue-300 text-blue-900',
    'Resuelto': 'bg-green-200/80 hover:bg-green-300 text-green-900',
    'Cerrado': 'bg-slate-200/80 hover:bg-slate-300 text-slate-800',
};

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
        <Card className="flex flex-col max-h-[600px]">
            <CardHeader className="shrink-0">
                <CardTitle>Mis Tickets</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Título</TableHead>
                            <TableHead>Prioridad</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Fecha</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.map((ticket) => (
                            <TableRow 
                                key={ticket.id}
                                className={cn(
                                    "transition-colors",
                                    statusRowColors[ticket.status] || ""
                                )}
                            >
                                <TableCell className="font-bold text-[#1D7AFC]">#{ticket.id}</TableCell>
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