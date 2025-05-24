import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    staff_q1: "",
    staff_q2: "",
    staff_q3: "",
    staff_q4: "",
    staff_q5: "",
    staff_q6: "",
    staff_q7: "",
    staff_q8: "",
    staff_q9: "",
    staff_q10: "",
    staff_q11: "",
    staff_q12: "",
    staff_q13: "",
  });
  const [screenshot, setScreenshot] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("❌ Επιτρέπονται μόνο αρχεία εικόνας PNG ή JPG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Το αρχείο πρέπει να είναι μικρότερο από 5MB.");
      return;
    }

    setScreenshot(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const [key, value] of Object.entries(form)) {
      data.append(key, value);
    }

    if (screenshot) {
      data.append("screenshot", screenshot);
    }

    const res = await fetch("/api/public-submit", {
      method: "POST",
      body: data,
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert("❌ Παρουσιάστηκε σφάλμα κατά την αποστολή της αίτησης.");
    }
  };

  if (submitted) {
    return (
      <div className="p-10 text-center text-white">
        ✅ Η αίτησή σου στάλθηκε επιτυχώς!
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(13,27,42,0.7)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "750px",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            marginBottom: "28px",
            color: "#ffffff",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          🛡️ Αίτηση για Ομάδα Διαχείρισης.
        </h1>
        <div className="bg-[#0d1b2ad9] border border-blue-500 rounded-lg p-4 text-white mb-6 shadow-md backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-2 text-orange-400">
            🔒 Βασικοί Όροι & Προϋποθέσεις:
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>➤ 1)</strong> Απαιτείται πλήρης γνώση και συμμόρφωση με
              τους κανόνες της πόλης και του server.
            </li>
            <li>
              <strong>➤ 3)</strong> Ο χρόνος από το roleplay σας θα μειωθεί στο
              ελάχιστο ώστε να δοθεί έμφαση στο κομμάτι του staff.
            </li>
            <li>
              <strong>➤ 4)</strong> Αν η αίτησή σου γίνει αποδεκτή, θα ενταχθείς
              στο staff team με ρόλο <strong>helper/supporter</strong>, αναλόγως
              των απαντήσεών σου στο interview.
            </li>
            <li>
              📺 Κατά τη διάρκεια του interview θα ζητηθεί{" "}
              <strong>screen share</strong> για επιβεβαίωση των στοιχείων (π.χ.
              ώρες στο FiveM).
            </li>
            <li>
              <strong>➤ 5)</strong> Παρακαλείται η αίτηση να συμπληρωθεί στα
              ελληνικά.
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-4"
        >
          {Object.entries({
            staff_q1: "Ποιο είναι το Discord ID σου;",
            staff_q2: "Ποιο είναι το όνομα χρήστη σου στο Discord;",
            staff_q3: "Ποιο είναι το Steam όνομά σου;",
            staff_q4: "Ποια είναι η πραγματική σου ηλικία (OOC);",
            staff_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
            staff_q6:
              "Πόσες ώρες εμπειρίας έχεις συνολικά σε RP και έχεις εργαστεί ποτέ ως Staff σε άλλον server;",
            staff_q7: "Πόσες ώρες/ημέρα μπορείς να αφιερώσεις ως Staff;",
            staff_q8:
              "Είσαι πρόθυμος να υπακούς σε ανώτερες εντολές χωρίς αντίρρηση;",
            staff_q9: "Τι σημαίνει για σένα η έννοια της ιεραρχίας;",
            staff_q10: "Γιατί να επιλέξουμε εσένα για τη θέση του Staff;",
            staff_q11:
              "Ποια είναι τα δυνατά και αδύναμα σημεία του χαρακτήρα σου;",
            staff_q12: "Πώς δείχνεις σεβασμό προς τους παίκτες του server;",
            staff_q13: "Τι είδους RP ρόλους συνήθως παίζεις;",
          }).map(([key, label]) => (
            <div key={key} style={{ marginBottom: "16px" }}>
              <label
                htmlFor={key}
                style={{
                  display: "block",
                  color: "#fff",
                  fontWeight: "500",
                  marginBottom: "6px",
                }}
              >
                {label}
              </label>
              <textarea
                name={key}
                id={key}
                required
                rows={
                  key === "staff_q1" || key === "staff_q2" || key === "staff_q3"
                    ? 1
                    : 3
                }
                value={form[key]}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  backgroundColor: "#182c3c",
                  color: "#e0f1ff",
                  border: "1px solid #2a3c4f",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="screenshot"
              style={{
                display: "block",
                marginBottom: "6px",
                color: "#fff",
                fontWeight: "500",
              }}
            >
              Screenshot αρχείο
            </label>
            <input
              type="file"
              name="screenshot"
              id="screenshot"
              accept="image/*"
              required
              onChange={handleFileChange}
              style={{
                display: "block",
                width: "100%",
                padding: "8px",
                backgroundColor: "#223344",
                color: "#fff",
                borderRadius: "10px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #209cff, #68e0cf)",
              color: "#fff",
              padding: "12px",
              borderRadius: "999px",
              fontWeight: "bold",
              fontSize: "14px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              boxShadow: "0 4px 15px rgba(32, 156, 255, 0.4)",
              transition: "all 0.3s ease",
            }}
          >
            Υποβολή Αίτησης
          </button>
        </form>
      </div>
    </div>
  );
}
