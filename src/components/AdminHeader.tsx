import { Search, Bell, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminHeader({ totalTickets = 1284 }: { totalTickets?: number }) {
    return (
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold text-slate-900">Ticket Management</h1>
                <span className="px-2 py-0.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-full">
                    {totalTickets.toLocaleString()} Total
                </span>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by Ticket ID, Customer or Issue Summary..."
                        className="pl-10 bg-slate-50 border-none ring-offset-transparent focus-visible:ring-1 focus-visible:ring-slate-200 h-10 w-full"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 overflow-visible relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </Button>
                    <Button className="bg-[#1D7AFC] hover:bg-[#1565D8] text-white gap-2 px-4 shadow-sm h-10">
                        <Plus className="h-4 w-4" />
                        <span>Create New Ticket</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
