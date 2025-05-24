export default function GuildList({ guilds }) {
  if (!guilds?.length) return <p>No servers available.</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Servers you belong to:</h2>
      <ul>
        {guilds.map((g) => (
          <li key={g.guild_id}>
            <strong>{g.guild_name}</strong> {g.is_owner && "(Owner)"}{" "}
            {g.is_admin && !g.is_owner && "(Admin)"}{" "}
            {g.is_manager && !g.is_admin && "(Manager)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
