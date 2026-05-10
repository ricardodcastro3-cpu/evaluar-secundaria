import { create } from "zustand";
import supabase from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  isDocente: boolean;
  tema: "light" | "dark";
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
  toggleTema: () => void;
}

function userLooksLikeDocente(user: User | null) {
  if (!user) {
    return false;
  }

  const role = user.user_metadata?.role ?? user.app_metadata?.role;
  return role === "docente" || role === "teacher";
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isDocente: false,
  tema: "light",
  signInWithGoogle: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      set({ loading: false });
      throw error;
    }
  },
  signOut: async () => {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, isDocente: false, loading: false });
  },
  checkSession: async () => {
    set({ loading: true });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const sessionUser = session?.user ?? null;
    let isDocente = userLooksLikeDocente(sessionUser);

    if (sessionUser?.email) {
      const { data } = await supabase
        .from("docentes")
        .select("id")
        .eq("email", sessionUser.email)
        .maybeSingle();

      isDocente = Boolean(data) || isDocente;
    }

    set({
      user: sessionUser,
      isDocente,
      loading: false,
    });
  },
  toggleTema: () =>
    set((state) => ({
      tema: state.tema === "light" ? "dark" : "light",
    })),
}));
