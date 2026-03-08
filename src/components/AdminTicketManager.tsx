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
import { cn } from "@/lib/utils";
import { Filter } from 'lucide-react';

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

const statusColors: Record<string, string> = {
    'Abierto': 'bg-orange-50 text-orange-600 border-orange-100',
    'En Proceso': 'bg-blue-50 text-blue-600 border-blue-100',
    'Resuelto': 'bg-green-50 text-green-600 border-green-100',
    'Cerrado': 'bg-slate-50 text-slate-500 border-slate-100',
    'Open': 'bg-orange-50 text-orange-600 border-orange-100',
    'In Progress': 'bg-blue-50 text-blue-600 border-blue-100',
    'Resolved': 'bg-green-50 text-green-600 border-green-100',
};

const priorityColors: Record<string, string> = {
    'Alta': 'bg-red-50 text-red-600 border-red-100',
    'Media': 'bg-blue-50 text-blue-600 border-blue-100',
    'Baja': 'bg-slate-50 text-slate-500 border-slate-100',
    'Urgent': 'bg-red-50 text-red-600 border-red-100',
    'High': 'bg-orange-50 text-orange-600 border-orange-100',
    'Low': 'bg-slate-50 text-slate-500 border-slate-100',
    'Medium': 'bg-blue-50 text-blue-600 border-blue-100',
};

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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-6">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                        All Status <ChevronDown className="h-3 w-3" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                        All Priority <ChevronDown className="h-3 w-3" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50">
                        All Technicians <ChevronDown className="h-3 w-3" />
                    </div>
                </div>
                <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-50">
                    <Filter className="h-4 w-4" />
                </div>
            </div>

            <Table>
                <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[120px] font-bold text-slate-400 text-[10px] uppercase tracking-wider">Ticket ID</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Customer</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Issue Summary</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Priority</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Status</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Technician</TableHead>
                        <TableHead className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">Date Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="border-slate-100 hover:bg-slate-50/50">
                            <TableCell className="font-bold text-[#1D7AFC] text-sm">#{ticket.id}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                        {ticket.profiles?.[0]?.full_name?.substring(0, 2).toUpperCase() || 'CU'}
                                    </div>
                                    <span className="font-medium text-slate-900 text-sm">
                                        {ticket.profiles?.[0]?.full_name || ticket.profiles?.[0]?.email || 'N/A'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-slate-600 text-sm">{ticket.title}</TableCell>
                            <TableCell>
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                                    priorityColors[ticket.priority] || 'bg-slate-50 text-slate-600'
                                )}>
                                    {ticket.priority}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Select
                                    defaultValue={ticket.status}
                                    onValueChange={(newStatus) => handleStatusChange(ticket.id, newStatus)}
                                    disabled={updatingId === ticket.id}
                                >
                                    <SelectTrigger className={cn(
                                        "h-7 w-fit gap-2 border-none font-bold text-[10px] px-2 rounded-full",
                                        statusColors[ticket.status] || 'bg-slate-50 text-slate-600'
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full",
                                            ticket.status === 'Abierto' ? "bg-orange-500" :
                                                ticket.status === 'En Proceso' ? "bg-blue-500" :
                                                    ticket.status === 'Resuelto' ? "bg-green-500" : "bg-slate-400"
                                        )}></div>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Abierto">Open</SelectItem>
                                        <SelectItem value="En Proceso">In Progress</SelectItem>
                                        <SelectItem value="Resuelto">Resolved</SelectItem>
                                        <SelectItem value="Cerrado">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell className="text-slate-400 text-sm italic">Unassigned</TableCell>
                            <TableCell className="text-slate-500 text-sm font-medium">
                                {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500">
                <p>Showing 1 to {tickets.length} of {tickets.length} tickets</p>
                <div className="flex gap-1">
                    {/* Simplified pagination for design */}
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg opacity-50"><ChevronLeft className="h-4 w-4" /></div>
                    <div className="w-8 h-8 flex items-center justify-center bg-[#1D7AFC] text-white rounded-lg">1</div>
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">2</div>
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">3</div>
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg"><ChevronRight className="h-4 w-4" /></div>
                </div>
            </div>
        </div>
    );
}

function ChevronDown(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
}

function ChevronLeft(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
}

function ChevronRight(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
}