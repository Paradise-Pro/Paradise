import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({
    ems_q1: "",
    ems_q2: "",
    ems_q3: "",
    ems_q4: "",
    ems_q5: "",
    ems_q6: "",
    ems_q7: "",
    ems_q8: "",
    ems_q9: "",
    ems_q10: "",
    ems_q11: "",
    ems_q12: "",
    ems_q13: "",
    ems_q14: "",
    ems_q15: "",
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
          🏥 Αίτηση για το Νοσοκομείο (EMS).
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
              <strong>➔ 3)</strong> Αν η αίτηση εγκριθεί, θα ενταχθείτε στο
              νοσοκομείο ξεκινώντας από χαμηλή θέση και θα ανεβαίνετε ιεραρχικά.
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
                  key === "ems_q1" || key === "ems_q2" || key === "ems_q3"
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
