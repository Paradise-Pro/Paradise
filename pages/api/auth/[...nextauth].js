import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { parse } from "cookie";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account, profile, req }) {
      if (account.provider === "discord" && profile) {
        try {
          await supabase.from("users").upsert({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar: profile.avatar,
            locale: profile.locale,
            verified: profile.verified,
            access_token: account.access_token,
            active: true,
          });
        } catch (error) {
          console.error("Supabase insert user error:", error);
        }

        try {
          const guildsRes = await fetch(
            "https://discord.com/api/users/@me/guilds",
            {
              headers: {
                Authorization: `Bearer ${account.access_token}`,
              },
            }
          );

          if (!guildsRes.ok) {
            throw new Error("Unauthorized or expired token.");
          }

          const guilds = await guildsRes.json();

          if (Array.isArray(guilds)) {
            for (const guild of guilds) {
              const permissions = parseInt(guild.permissions || "0");

              await supabase.from("user_guilds").upsert({
                user_id: profile.id,
                guild_id: guild.id,
                guild_name: guild.name,
                is_owner: guild.owner || false,
                is_admin: guild.owner || permissions & 0x8 ? true : false,
                is_manager: permissions & 0x20 ? true : false,
                raw_permissions: permissions,
                joined_at: new Date(),
              });
            }
          }
        } catch (err) {
          console.error("Guilds fetch failed. Marking user inactive.", err);
          await supabase
            .from("users")
            .update({ active: false })
            .eq("id", profile.id);
        }
      }

      return true;
    },

    async jwt({ token, account, req }) {
      if (account) {
        token.accessToken = account.access_token;

        const cookies = req?.headers?.cookie ? parse(req.headers.cookie) : {};

        if (cookies.rememberDiscord === "1") {
          token.remember = true;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.remember = token.remember || false;
      session.user.id = token.sub;
      return session;
    },
  },
});
