export const prerender = false;

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return new Response(JSON.stringify({ error: "Faltan datos requeridos (userId o role)." }), { status: 400 });
        }

        // Actualizar el perfil en la base de datos pública
        const { error } = await supabaseAdmin
            .from("profiles")
            .update({ role: role })
            .eq("id", userId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
