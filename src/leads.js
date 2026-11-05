/* A chave abaixo é pública por definição: a tabela só aceita inserção, nunca leitura. */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ptfrfbnkkbvqyrrbuvpp.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_IIXdjoxZPrChq_GUg2va7Q_5rMvLRIV";

export async function saveLead(row) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads_mapa_vieses`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row),
      signal: controller.signal
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  } finally {
    clearTimeout(timer);
  }
}
