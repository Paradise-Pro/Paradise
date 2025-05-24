import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const OWNER_ID = process.env.NEXT_PUBLIC_DISCORD_OWNER_ID || "";

export default function LogsFeed() {
  const [logs, setLogs] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(20);
      if (!error) setLogs(data);
    };

    fetchLogs();

    const channel = supabase
      .channel("logs_feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "logs" },
        (payload) => {
          setLogs((prev) => [payload.new, ...prev.slice(0, 19)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleParticipants = async (giveawayId) => {
    if (selectedParticipants?.id === giveawayId) {
      setSelectedParticipants(null);
      return;
    }
    const { data, error } = await supabase
      .from("giveaways")
      .select("participants")
      .eq("id", giveawayId)
      .single();

    if (!error) {
      setSelectedParticipants({
        id: giveawayId,
        users: data.participants || [],
      });
    }
  };

  const ownerLogs = logs.filter((log) => log.data?.creator_id === OWNER_ID);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">🎁 Giveaway Logs</h2>
      <div className="space-y-3">
        {ownerLogs.map((log, idx) => (
          <div
            key={log.id || idx}
            className="relative bg-[#1e3a8a]/60 backdrop-blur-xl text-white rounded-2xl p-4 shadow-lg border border-white/10"
          >
            {log.data?.creator_id && (
              <img
                src={
                  log.data?.creator_avatar
                    ? `https://cdn.discordapp.com/avatars/${log.data.creator_id}/${log.data.creator_avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${
                        parseInt(log.data.creator_id) % 5
                      }.png`
                }
                alt="creator avatar"
                title={
                  log.data?.creator_avatar ? "Custom Avatar" : "Default Avatar"
                }
                className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white shadow"
              />
            )}

            {log.type === "giveaway_start" && (
              <div className="absolute top-4 right-[5.5rem] bg-yellow-500/10 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                ⏳ Ο διαγωνισμός είναι ενεργός…
              </div>
            )}

            {log.type === "giveaway_end" && log.data?.winner && (
              <div className="absolute top-4 right-[5.5rem] bg-green-500/80 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                🏆 Νικητής: {log.data.winner.tag}
              </div>
            )}

            {log.type === "giveaway_end" &&
              !log.data?.winner &&
              log.data?.reason === "no_participants" && (
                <div className="absolute top-4 right-[5.5rem] bg-red-600/80 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                  😕 Κανείς δεν συμμετείχε
                </div>
              )}

            {log.type === "giveaway_end" &&
              !log.data?.winner &&
              !log.data?.reason &&
              log.data?.ended_by && (
                <div className="absolute top-4 right-[5.5rem] bg-orange-500/90 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                  🔒 Τερματίστηκε από τον owner
                </div>
              )}

            {log.type === "giveaway_end" && log.data?.winner && (
              <div className="absolute top-4 right-[5.5rem] bg-green-500/80 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                🏆 Νικητής: {log.data.winner.tag}
              </div>
            )}

            {log.type === "giveaway_reroll" && log.data?.rerolled_by && (
              <div className="absolute top-4 right-[13rem] bg-blue-600/70 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                👤 Reroll από {log.data.rerolled_by}
              </div>
            )}

            {log.type === "giveaway_end" && log.data?.prize_name && (
              <p className="mt-2 text-sm text-white/90">
                🎁 <span className="font-semibold">Έπαθλο:</span>{" "}
                {log.data.prize_name}
              </p>
            )}

            {log.type === "giveaway_cancel" && (
              <div className="absolute top-4 right-[5.5rem] bg-red-700/80 text-white text-xs font-medium px-3 py-1 rounded-lg shadow-lg">
                🚫 Το giveaway ακυρώθηκε
              </div>
            )}

            <h3 className="text-lg font-semibold tracking-wide mb-2">
              📋 {log.type.replace(/_/g, " ").toUpperCase()}
            </h3>

            {log.type === "giveaway_start" && (
              <div className="text-sm space-y-1">
                <p>
                  🎁 <span className="font-semibold">Prize:</span>{" "}
                  {log.data?.prize}
                </p>

                <div className="space-y-1">
                  <p>
                    🧾{" "}
                    <span className="font-semibold">Εμφανιζόμενο Όνομα:</span>{" "}
                    {log.data?.creator_display_name}
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          log.data?.creator_display_name
                        )
                      }
                      className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition"
                    >
                      📋
                    </button>
                  </p>
                  <p>
                    🏷️ <span className="font-semibold">Tag:</span>{" "}
                    {log.data?.creator}
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(log.data?.creator)
                      }
                      className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition"
                    >
                      📋
                    </button>
                  </p>
                  <p>
                    🔖 <span className="font-semibold">Mention:</span> @
                    {log.data?.creator?.split("#")[0]}
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `@${log.data?.creator?.split("#")[0]}`
                        )
                      }
                      className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition"
                    >
                      📋
                    </button>
                  </p>
                  <p>
                    🆔 <strong>{log.data?.creator_id}</strong>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(log.data?.creator_id)
                      }
                      className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded hover:bg-white/20 transition"
                    >
                      📋
                    </button>
                  </p>
                </div>

                <p>
                  📝 <span className="font-semibold">Description:</span>{" "}
                  {log.data?.description || "—"}
                </p>

                <div className="text-xs text-gray-300">
                  🕒 {new Date(log.timestamp).toLocaleString("el-GR")}
                </div>

                <button
                  className="mt-2 px-3 py-1 text-sm font-medium bg-white/10 hover:bg-white/20 rounded transition"
                  onClick={() => toggleParticipants(log.data?.giveaway_id)}
                >
                  👥 Προβολή Συμμετεχόντων
                </button>

                {selectedParticipants?.id === log.data?.giveaway_id && (
                  <div className="mt-2 text-xs bg-white/10 p-2 rounded">
                    {selectedParticipants.users.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {selectedParticipants.users.map((user, i) => (
                          <div
                            key={i}
                            className="bg-white/5 p-3 rounded-lg text-sm flex gap-3 items-center"
                          >
                            <img
                              src={
                                user.avatar
                                  ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                                  : `https://cdn.discordapp.com/embed/avatars/${
                                      parseInt(user.id) % 5
                                    }.png`
                              }
                              alt="avatar"
                              title={
                                user.avatar ? "Custom Avatar" : "Default Avatar"
                              }
                              className="w-8 h-8 rounded-full border border-white"
                            />
                            <div>
                              <p>
                                <strong>🧾 Εμφανιζόμενο Όνομα:</strong>{" "}
                                {user.display_name || "—"}
                              </p>
                              <p>
                                <strong>👤 Username:</strong> {user.tag}
                              </p>
                              <p>
                                <strong>🔖 Mention:</strong> @
                                {user.tag?.split("#")[0]}
                              </p>
                              <p>
                                <strong>🆔</strong> {user.id}
                              </p>
                              <p>
                                <strong>🖼️ Banner:</strong>{" "}
                                {user.banner ? (
                                  <a
                                    href={`https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=512`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 underline"
                                  >
                                    Ναι (δείτε)
                                  </a>
                                ) : (
                                  "Όχι"
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-300">
                        Κανείς δεν συμμετείχε ακόμη.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {log.type === "giveaway_end" && log.data?.winner && (
              <div className="mt-4 p-3 rounded-xl bg-white/10 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      log.data.winner.avatar
                        ? `https://cdn.discordapp.com/avatars/${log.data.winner.id}/${log.data.winner.avatar}.png`
                        : `https://cdn.discordapp.com/embed/avatars/${
                            parseInt(log.data.winner.id) % 5
                          }.png`
                    }
                    alt="Winner Avatar"
                    className="w-10 h-10 rounded-full border border-white"
                  />
                  <div>
                    <p>
                      <strong>🏆 Νικητής:</strong> {log.data.winner.tag}
                    </p>
                    <p>
                      <strong>🔖 Mention:</strong> @
                      {log.data.winner.tag?.split("#")[0]}
                    </p>
                    <p>
                      <strong>🆔:</strong> {log.data.winner.id}
                    </p>
                    <p>
                      <strong>🖼️ Banner:</strong>{" "}
                      {log.data.winner.banner ? (
                        <a
                          href={`https://cdn.discordapp.com/banners/${log.data.winner.id}/${log.data.winner.banner}.png`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 underline"
                        >
                          Ναι (δείτε)
                        </a>
                      ) : (
                        "Όχι"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {log.type === "giveaway_cancel" && (
              <div className="text-sm space-y-1">
                <p>
                  🛑 <span className="font-semibold">Cancelled by:</span>{" "}
                  {log.data?.cancelled_by}
                </p>
                <p>
                  🎁 <span className="font-semibold">Prize:</span>{" "}
                  {log.data?.prize || "—"}
                </p>
              </div>
            )}

            {log.type === "giveaway_reroll" && log.data?.winner_id && (
              <div className="mt-4 p-3 rounded-xl bg-white/10 text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      log.data.winner_avatar
                        ? `https://cdn.discordapp.com/avatars/${log.data.winner_id}/${log.data.winner_avatar}.png`
                        : `https://cdn.discordapp.com/embed/avatars/${
                            parseInt(log.data.winner_id) % 5
                          }.png`
                    }
                    alt="Winner Avatar"
                    className="w-10 h-10 rounded-full border border-white"
                  />
                  <div>
                    <p>
                      <strong>🏆 Νέος Νικητής:</strong> {log.data.winner_tag}
                    </p>
                    <p>
                      <strong>🔖 Mention:</strong> @
                      {log.data.winner_tag?.split("#")[0]}
                    </p>
                    <p>
                      <strong>🆔:</strong> {log.data.winner_id}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
