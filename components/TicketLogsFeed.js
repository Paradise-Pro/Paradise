import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function TicketLogsFeed() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return console.error("❌ Supabase error:", error);

      const enriched = await Promise.all(
        data.map(async (ticket) => {
          const { data: messages } = await supabase
            .from("ticket_messages")
            .select("*")
            .eq("channel_id", ticket.channel_id)
            .order("created_at", { ascending: true });

          return { ...ticket, messages: messages || [] };
        })
      );

      setTickets(enriched);
    };

    fetchTickets();
  }, []);

  if (!tickets.length) {
    return <p className="text-white text-center">📭 Δεν υπάρχουν tickets.</p>;
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Μετακινημένο εδώ */}
      <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-cyan-300 drop-shadow-md mb-6">
        🎫 Ticket Logs
      </h1>

      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="bg-gradient-to-br from-blue-100/80 to-cyan-100/80 w-full max-w-3xl p-6 rounded-2xl shadow-lg border border-blue-200"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-blue-700">
              📂 {ticket.category}
            </h2>
            <span
              className={`text-sm font-semibold ${
                ticket.status === "open" ? "text-green-600" : "text-red-500"
              }`}
            >
              {ticket.status === "open" ? "Ανοιχτό" : "Κλειστό"}
            </span>
          </div>

          <p className="text-sm text-gray-800">
            👤 Χρήστης: {ticket.created_by}
          </p>
          <p className="text-sm text-gray-800">
            🕒 Δημιουργήθηκε:{" "}
            {new Date(ticket.created_at).toLocaleString("el-GR")}
          </p>
          {ticket.closed_at && (
            <p className="text-sm text-gray-800">
              🕓 Έκλεισε: {new Date(ticket.closed_at).toLocaleString("el-GR")}
            </p>
          )}
          <p className="text-sm text-gray-800">
            🔐 Ορατότητα: {ticket.visibility?.join(", ") || "—"}
          </p>
          {ticket.description && (
            <p className="text-sm text-gray-800 mt-2">
              📝 Περιγραφή: <span className="italic">{ticket.description}</span>
            </p>
          )}

          {ticket.messages.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-2">
                💬 Όλα τα μηνύματα:
              </h3>
              <div className="space-y-2 bg-gradient-to-br from-blue-200/60 to-cyan-100/60 p-4 rounded-lg">
                {ticket.messages.map((msg) => (
                  <div key={msg.id} className="flex items-center gap-3">
                    <img
                      src={
                        msg.avatar ||
                        `https://cdn.discordapp.com/embed/avatars/0.png`
                      }
                      alt="avatar"
                      className="w-6 h-6 rounded-full border border-gray-300"
                    />
                    <span className="text-sm text-gray-900">
                      <strong>{msg.author_tag}</strong>{" "}
                      <span className="text-gray-500">
                        (🆔: {msg.author_id})
                      </span>
                      : {msg.content}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
