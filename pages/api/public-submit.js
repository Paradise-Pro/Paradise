import { IncomingForm } from "formidable";
import path from "path";
import fs from "fs";
import createTimestampFooter from "@/functions/createTimestampFooter";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const questionLabels = {
  // === STAFF ===
  staff_q1: "Ποιο είναι το Discord ID σου;",
  staff_q2: "Ποιο είναι το όνομα χρήστη σου στο Discord;",
  staff_q3: "Ποιο είναι το Steam όνομά σου;",
  staff_q4: "Ποια είναι η πραγματική σου ηλικία (OOC);",
  staff_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
  staff_q6:
    "Πόσες ώρες εμπειρίας έχεις συνολικά σε RP και έχεις εργαστεί ποτέ ως Staff σε άλλον server;",
  staff_q7: "Πόσες ώρες/ημέρα μπορείς να αφιερώσεις ως Staff;",
  staff_q8: "Είσαι πρόθυμος να υπακούς σε ανώτερες εντολές χωρίς αντίρρηση;",
  staff_q9: "Τι σημαίνει για σένα η έννοια της ιεραρχίας;",
  staff_q10: "Γιατί να επιλέξουμε εσένα για τη θέση του Staff;",
  staff_q11: "Ποια είναι τα δυνατά και αδύναμα σημεία του χαρακτήρα σου;",
  staff_q12: "Πώς δείχνεις σεβασμό προς τους παίκτες του server;",
  staff_q13: "Τι είδους RP ρόλους συνήθως παίζεις;",

  // === POLICE ===
  police_q1: "Ποιο είναι το Discord ID σου;",
  police_q2: "Ποιο είναι το όνομα χρήστη σου στο Discord;",
  police_q3: "Ποιο είναι το Steam όνομά σου;",
  police_q4: "Ποια είναι η ηλικία σου στην πραγματική ζωή (OOC);",
  police_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
  police_q6: "Έχεις διαβάσει τους κανόνες της πόλης και της Αστυνομίας;",
  police_q7: "Γιατί θέλεις να μπεις στην Αστυνομία;",
  police_q8: "Ποιες ώρες μπορείς να είσαι σε υπηρεσία;",
  police_q9: "Αν κάποιος πολίτης σε προκαλέσει λεκτικά, πώς αντιδράς;",
  police_q10:
    "Έχεις δει ποτέ αστυνομικό να συμπεριφέρεται λανθασμένα; Τι θα έκανες;",
  police_q11: "Είσαι έτοιμος να ακολουθείς εντολές χωρίς αντίρρηση;",
  police_q12: "Πώς λειτουργείς σε ομαδικό περιβάλλον υπό πίεση;",
  police_q13:
    "Αν αντιληφθείς κατάχρηση εξουσίας μέσα στην υπηρεσία, πώς ενεργείς;",
  police_q14: "Τι RP ρόλο παίζεις, στον server Paradise;",
  police_q15: "Ώρες στο FiveM;",

  // === EMS ===
  ems_q1: "Ποιο είναι το Discord ID σου;",
  ems_q2: "Ποιο είναι το Discord όνομά σου;",
  ems_q3: "Ποιο είναι το Steam όνομά σου;",
  ems_q4: "Ποια είναι η ηλικία σου στην πραγματική ζωή (OOC);",
  ems_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
  ems_q6:
    "Πόσες ώρες εμπειρίας έχεις σε RP και έχεις ξαναπαίξει ως μέλος του EMS;",
  ems_q7: "Ποιες ώρες της ημέρας είσαι διαθέσιμος/η για υπηρεσία;",
  ems_q8: "Γιατί θέλεις να γίνεις μέλος του EMS;",
  ems_q9:
    "Πώς αντιμετωπίζεις ένα άτομο που βρίσκεται σε κρίσιμη κατάσταση στο RP;",
  ems_q10:
    "Ο πολίτης σου ζητά να τον σηκώσεις άμεσα, αλλά οι παλμοί του είναι πολύ χαμηλοί και το revive δεν επιτρέπεται ακόμα. Τι κάνεις σε αυτή την περίπτωση;",
  ems_q11:
    "Πώς αντιδράς όταν κάποιος δεν συνεργάζεται ή σου φέρεται άσχημα κατά τη διάρκεια ενός περιστατικού;",
  ems_q12: "Είσαι έτοιμος να ακολουθείς εντολές χωρίς αντίρρηση;",
  ems_q13: "Πώς λειτουργείς υπό πίεση σε κρίσιμες καταστάσεις;",
  ems_q14: "Τι RP ρόλο παίζεις, στον server Paradise;",
  ems_q15: "Ώρες στο FiveM;",
};

export default async function handler(req, res) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      uploadDir,
      maxFileSize: MAX_IMAGE_SIZE,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Form parsing failed:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      const content = Object.entries(fields)
        .map(([key, value]) => `**${questionLabels[key] || key}**:\n${value}`)
        .join("\n\n")
        .trim();

      let screenshotUrl = null;
      let screenshotLine = null;
      const isStaff = Object.keys(fields).some((k) => k.startsWith("staff_"));

      if (files?.screenshot) {
        if (!isStaff) {
          console.warn(
            "⚠️ Screenshot submitted for non-staff application. Ignored."
          );
        } else {
          const file = Array.isArray(files.screenshot)
            ? files.screenshot[0]
            : files.screenshot;

          if (!file?.filepath) {
            console.error("❌ Screenshot filepath missing:", file);
            return res.status(500).json({ error: "Invalid screenshot file" });
          }

          if (file.size > MAX_IMAGE_SIZE) {
            console.error("❌ Screenshot too large:", file.size);
            return res
              .status(400)
              .json({ error: "Το screenshot ξεπερνά το όριο των 5MB." });
          }

          const originalName = (
            file.originalFilename || "screenshot.png"
          ).replace(/[^a-zA-Z0-9._-]/g, "_");
          const newFileName = `${Date.now()}_${originalName}`;
          screenshotLine = `📎 Όνομα αρχείου screenshot:\n${newFileName}`;
          const tempPath = file.filepath;
          const targetPath = path.join(uploadDir, newFileName);

          fs.renameSync(tempPath, targetPath);
          screenshotUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/${newFileName}`;
        }
      }

      const lines = [
        content && content !== "" ? content : "*Δεν δόθηκαν απαντήσεις.*",
        screenshotLine,
      ].filter(Boolean);

      const description = lines.join("\n\n").trim();

      let webhookUrl = null;
      if (isStaff) {
        webhookUrl = process.env.DISCORD_STAFF_WEBHOOK_URL;
      } else if (Object.keys(fields).some((k) => k.startsWith("police_"))) {
        webhookUrl = process.env.DISCORD_POLICE_WEBHOOK_URL;
      } else if (Object.keys(fields).some((k) => k.startsWith("ems_"))) {
        webhookUrl = process.env.DISCORD_EMS_WEBHOOK_URL;
      }

      if (!webhookUrl) {
        console.warn("⚠️ No matching webhook URL");
        return res.status(400).json({ error: "Invalid application type" });
      }

      const embed = {
        title: "📥 Νέα Αίτηση Υποβλήθηκε",
        description,
        color: 0x00c0ff,
        footer: {
          text: createTimestampFooter(),
        },
      };

      if (screenshotUrl) {
        embed.image = { url: screenshotUrl };
      }

      const payload = {
        embeds: [embed],
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Discord webhook failed:", errorText);
        return res.status(500).json({ error: "Failed to deliver to Discord" });
      }

      return res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/*import { IncomingForm } from "formidable";
import path from "path";
import fs from "fs";
import createTimestampFooter from "@/functions/createTimestampFooter";

export const config = {
  api: {
    bodyParser: false,
  },
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const questionLabels = {
  staff_q1: "Ποιο είναι το Discord ID σου;",
  staff_q2: "Ποιο είναι το όνομα χρήστη σου στο Discord;",
  staff_q3: "Ποιο είναι το Steam όνομά σου;",
  staff_q4: "Ποια είναι η πραγματική σου ηλικία (OOC);",
  staff_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
  staff_q6:
    "Πόσες ώρες εμπειρίας έχεις συνολικά σε RP και έχεις εργαστεί ποτέ ως Staff σε άλλον server;",
  staff_q7: "Πόσες ώρες/ημέρα μπορείς να αφιερώσεις ως Staff;",
  staff_q8: "Είσαι πρόθυμος να υπακούς σε ανώτερες εντολές χωρίς αντίρρηση;",
  staff_q9: "Τι σημαίνει για σένα η έννοια της ιεραρχίας;",
  staff_q10: "Γιατί να επιλέξουμε εσένα για τη θέση του Staff;",
  staff_q11: "Ποια είναι τα δυνατά και αδύναμα σημεία του χαρακτήρα σου;",
  staff_q12: "Πώς δείχνεις σεβασμό προς τους παίκτες του server;",
  staff_q13: "Τι είδους RP ρόλους συνήθως παίζεις;",
};

export default async function handler(req, res) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
      uploadDir,
      maxFileSize: MAX_IMAGE_SIZE,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Form parsing failed:", err);
        return res.status(500).json({ error: "Form parsing error" });
      }

      console.log("📦 Fields:", fields);
      console.log("🖼️ Files:", files);

      const content = Object.entries(fields)
        .filter(([key]) => key.startsWith("staff_"))
        .map(([key, value]) => `**${questionLabels[key] || key}**:\n${value}`)
        .join("\n\n")
        .trim();

      const description =
        content && content !== "" ? content : "*Δεν δόθηκαν απαντήσεις.*";

      let webhookUrl = null;

      if (Object.keys(fields).some((k) => k.startsWith("staff_"))) {
        webhookUrl = process.env.DISCORD_STAFF_WEBHOOK_URL;
      } else if (Object.keys(fields).some((k) => k.startsWith("police_"))) {
        webhookUrl = process.env.DISCORD_POLICE_WEBHOOK_URL;
      } else if (Object.keys(fields).some((k) => k.startsWith("ems_"))) {
        webhookUrl = process.env.DISCORD_EMS_WEBHOOK_URL;
      }

      if (!webhookUrl) {
        console.warn("⚠️ No matching webhook URL");
        return res.status(400).json({ error: "Invalid application type" });
      }

      let screenshotUrl = null;

      if (files?.screenshot) {
        const file = Array.isArray(files.screenshot)
          ? files.screenshot[0]
          : files.screenshot;

        if (!file?.filepath) {
          console.error("❌ Screenshot filepath missing:", file);
          return res.status(500).json({ error: "Invalid screenshot file" });
        }

        if (file.size > MAX_IMAGE_SIZE) {
          console.error("❌ Screenshot too large:", file.size);
          return res
            .status(400)
            .json({ error: "Το screenshot ξεπερνά το όριο των 5MB." });
        }

        const originalName = (
          file.originalFilename || "screenshot.png"
        ).replace(/[^a-zA-Z0-9._-]/g, "_");
        const newFileName = `${Date.now()}_${originalName}`;
        const tempPath = file.filepath;
        const targetPath = path.join(uploadDir, newFileName);

        fs.renameSync(tempPath, targetPath);
        screenshotUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/uploads/${newFileName}`;
      }

      const embed = {
        title: "📥 Νέα Αίτηση Υποβλήθηκε",
        description,
        color: 0x00c0ff,
        footer: {
          text: createTimestampFooter(),
        },
      };

      if (screenshotUrl) {
        embed.image = { url: screenshotUrl };
      }

      const payload = {
        embeds: [embed],
      };

      console.log(
        "📤 Sending payload to Discord:",
        JSON.stringify(payload, null, 2)
      );

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Discord webhook failed:", errorText);
        return res.status(500).json({ error: "Failed to deliver to Discord" });
      }

      return res.status(200).json({ success: true });
    });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

*/
