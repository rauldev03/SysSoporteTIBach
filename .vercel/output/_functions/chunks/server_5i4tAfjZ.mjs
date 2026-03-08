import { createServerClient } from '@supabase/ssr';

const createSupabaseServerClient = (cookies) => {
  return createServerClient(
    "https://lxhvgdzqlzexeudszbzx.supabase.co",
    "sb_publishable_kQryhicy2fg3MzI75fS4qg_l4oWvB9e",
    {
      cookies: {
        get(key) {
          return cookies.get(key)?.value;
        },
        set(key, value, options) {
          cookies.set(key, value, options);
        },
        remove(key, options) {
          cookies.delete(key, options);
        }
      }
    }
  );
};

export { createSupabaseServerClient as c };
