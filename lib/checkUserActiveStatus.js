import supabase from "@/lib/supabase"; // χρησιμοποιεί τον έτοιμο client σου

export async function checkUserActiveStatus(userId, accessToken) {
  try {
    const res = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      await supabase
        .from("users")
        .update({ active: false })
        .eq("id", userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to check Discord user status:", error);
    return false;
  }
}