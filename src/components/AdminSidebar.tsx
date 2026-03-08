import {
    LayoutDashboard,
    Ticket,
    Users,
    BookOpen,
    UserSquare2,
    Settings,
    LogOut,
    ChevronDown
} from 'lucide-react';
import { cn } from "@/lib/utils";

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Ticket, label: 'Tickets', href: '/admin', active: true },
    { icon: Users, label: 'Customers', href: '/admin/customers' },
    { icon: BookOpen, label: 'Knowledge Base', href: '/admin/kb' },
];

const systemItems = [
    { icon: UserSquare2, label: 'Technicians', href: '/admin/technicians' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar({ user }: { user: any }) {
    return (
        <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col pt-6">
            <div className="px-6 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1D7AFC] rounded-lg flex items-center justify-center text-white font-bold">
                    <Ticket className="h-5 w-5 rotate-[-45deg]" />
                </div>
                <div>
                    <h2 className="text-slate-900 font-bold leading-none">SupportOS</h2>
                    <span className="text-[10px] text-slate-500 font-medium">Admin Console</span>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-8">
                <div>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                    item.active
                                        ? "bg-[#EBF3FF] text-[#1D7AFC]"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", item.active ? "text-[#1D7AFC]" : "text-slate-400")} />
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="px-3 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">System</h3>
                    <div className="space-y-1">
                        {systemItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                <item.icon className="h-4 w-4 text-slate-400" />
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                        {/* Placeholder avatar or user image */}
                        <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xs uppercase">
                            {user?.email?.substring(0, 2) || 'AD'}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">Alex Rivera</p>
                        <p className="text-xs text-slate-500 truncate">Senior Lead</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
