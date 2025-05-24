import supabase from "@/lib/supabase";
import { checkUserActiveStatus } from "@/lib/checkUserActiveStatus";

export default async function handler(req, res) {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, access_token");

  if (error) {
    console.error("Failed to fetch users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }

  let updated = 0;
  for (const user of users) {
    if (user.access_token) {
      const stillActive = await checkUserActiveStatus(
        user.id,
        user.access_token
      );
      if (!stillActive) updated++;
    }
  }

  res
    .status(200)
    .json({ message: "User check completed", deactivated: updated });
}
