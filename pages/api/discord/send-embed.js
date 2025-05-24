import supabase from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { title, description, color, channel_id } = req.body;

  if (
    !title?.trim() ||
    !description?.trim() ||
    !color?.trim() ||
    !channel_id?.trim()
  ) {
    return res
      .status(400)
      .json({ success: false, error: "Όλα τα πεδία είναι υποχρεωτικά." });
  }

  const { error } = await supabase.from("embed_queue").insert([
    {
      title: title.trim(),
      description: description.trim(),
      color: color.trim(),
      channel_id: channel_id.trim(),
      status: "pending",
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Σφάλμα σύνδεσης με βάση." });
  }

  return res.status(200).json({ success: true });
}
