import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    police_q1: "",
    police_q2: "",
    police_q3: "",
    police_q4: "",
    police_q5: "",
    police_q6: "",
    police_q7: "",
    police_q8: "",
    police_q9: "",
    police_q10: "",
    police_q11: "",
    police_q12: "",
    police_q13: "",
    police_q14: "",
    police_q15: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

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
          👮 Αίτηση για την Αστυνομία.
        </h1>

        <div className="bg-[#0d1b2ad9] border border-blue-500 rounded-lg p-4 text-white mb-6 shadow-md backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-2 text-orange-400">
            🔒 Βασικοί Όροι & Προϋποθέσεις:
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>➔ 1)</strong> Να γνωρίζετε και να υπακούετε στους κανόνες
              της πόλης.
            </li>
            <li>
              <strong>➔ 2)</strong> Καθαρό ποινικό μητρώο.
            </li>
            <li>
              <strong>➔ 3)</strong> Αν η αίτηση εγκριθεί, θα ενταχθείτε στην
              αστυνομία ξεκινώντας από χαμηλή θέση και θα ανεβαίνετε ιεραρχικά.
              Απαγορεύεται αυστηρά η συμμετοχή σε Criminal RP.
            </li>
            <li>
              <strong>➤ 4)</strong> Παρακαλείται η αίτηση να συμπληρωθεί στα
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
            police_q1: "Ποιο είναι το Discord ID σου;",
            police_q2: "Ποιο είναι το όνομα χρήστη σου στο Discord;",
            police_q3: "Ποιο είναι το Steam όνομά σου;",
            police_q4: "Ποια είναι η ηλικία σου στην πραγματική ζωή (OOC);",
            police_q5: "Ποιο είναι το πραγματικό σου όνομα (OOC);",
            police_q6:
              "Έχεις διαβάσει τους κανόνες της πόλης και της Αστυνομίας;",
            police_q7: "Γιατί θέλεις να μπεις στην Αστυνομία;",
            police_q8: "Ποιες ώρες μπορείς να είσαι σε υπηρεσία;",
            police_q9:
              "Αν κάποιος πολίτης σε προκαλέσει λεκτικά, πώς αντιδράς;",
            police_q10:
              "Έχεις δει ποτέ αστυνομικό να συμπεριφέρεται λανθασμένα; Τι θα έκανες;",
            police_q11: "Είσαι έτοιμος να ακολουθείς εντολές χωρίς αντίρρηση;",
            police_q12: "Πώς λειτουργείς σε ομαδικό περιβάλλον υπό πίεση;",
            police_q13:
              "Αν αντιληφθείς κατάχρηση εξουσίας μέσα στην υπηρεσία, πώς ενεργείς;",
            police_q14: "Τι RP ρόλο παίζεις, στον server Paradise;",
            police_q15: "Ώρες στο FiveM;",
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
                  key === "police_q1" ||
                  key === "police_q2" ||
                  key === "police_q3"
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
