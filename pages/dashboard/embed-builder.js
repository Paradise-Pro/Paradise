import { useState } from "react";
import { useSession } from "next-auth/react";

export default function EmbedBuilderPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#5865F2");
  const [imageUrl, setImageUrl] = useState("");
  const [footer, setFooter] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorIcon, setAuthorIcon] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookError, setWebhookError] = useState(false);
  const [status, setStatus] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWebhookError(false);

    if (!webhookUrl || !/^https:\/\/discord(app)?\.com\/api\/webhooks\//.test(webhookUrl)) {
      setWebhookError(true);
      addToast("❌ Enter a valid Discord Webhook URL", "error");
      return;
    }

    setStatus("Sending...");

    const payload = {
      embeds: [{
        title,
        description,
        color: parseInt(color.replace("#", ""), 16),
        image: imageUrl ? { url: imageUrl } : undefined,
        thumbnail: thumbnailUrl ? { url: thumbnailUrl } : undefined,
        footer: footer ? { text: footer } : undefined,
        author: authorName ? { name: authorName, icon_url: authorIcon } : undefined,
        fields
      }]
    };

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Webhook send failed");
      addToast("Embed sent!");
      setStatus("✅ Embed sent!");
    } catch (err) {
      addToast(`${err.message}`, "error");
      setStatus(`❌ ${err.message}`);
    }
  };

  const addField = () => {
    if (fieldName && fieldValue) {
      setFields([...fields, { name: fieldName, value: fieldValue }]);
      setFieldName("");
      setFieldValue("");
    }
  };

  return (
    <div className="relative min-h-screen font-sans overflow-auto" style={{ background: "linear-gradient(to bottom right, #3cd4ef, #3b8ef7)" }}>
      <div className="relative z-10 p-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          {session?.user && (
            <div className="flex items-center gap-3">
              <img src={session.user.image} className="w-10 h-10 rounded-full" alt="avatar" />
              <span className="font-medium text-white">{session.user.name}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-white text-center w-full -ml-10">Embed Builder</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-xl space-y-4 text-white">
            <div>
              <input
                type="text"
                placeholder="Webhook URL"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className={`w-full p-2 rounded-lg border ${webhookError ? "border-red-500 bg-red-100 text-black" : "border-white/30 bg-white/20 text-white"} placeholder-slate-200`}
              />
              {webhookError && <p className="text-red-300 text-sm mt-1">Please enter a valid Webhook URL</p>}
            </div>

            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" rows={3} />
            <input type="text" placeholder="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <input type="text" placeholder="Author Icon URL" value={authorIcon} onChange={(e) => setAuthorIcon(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <input type="text" placeholder="Thumbnail URL" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <div className="flex gap-2">
              <input type="text" placeholder="Field Name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
              <input type="text" placeholder="Field Value" value={fieldValue} onChange={(e) => setFieldValue(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
              <button type="button" onClick={addField} className="bg-gradient-to-br from-[#00c6ff] to-[#0072ff] text-white px-4 rounded-lg shadow-md hover:scale-105 transition-transform">+</button>
            </div>
            <input type="text" placeholder="Main Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <input type="text" placeholder="Footer Text" value={footer} onChange={(e) => setFooter(e.target.value)} className="w-full p-2 rounded-lg border border-white/30 bg-white/20 text-white placeholder-slate-200" />
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 rounded-lg" />

            <button type="submit" className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-[#00c6ff] to-[#0072ff] shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200">
              Send Embed
            </button>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setColor("#5865F2");
                  setImageUrl("");
                  setFooter("");
                  setAuthorName("");
                  setAuthorIcon("");
                  setThumbnailUrl("");
                  setFields([]);
                  setFieldName("");
                  setFieldValue("");
                  setWebhookUrl("");
                  setWebhookError(false);
                  setStatus("");
                }}
                className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
              >
                Reset
              </button>
            </div>

            <p className="text-sm text-center text-white/80">{status}</p>
          </form>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              {authorIcon && <img src={authorIcon} className="w-6 h-6 rounded-full" alt="author" />}
              <span className="text-sm text-gray-300">{authorName}</span>
            </div>
            <div className="border-l-4 pl-4" style={{ borderColor: color }}>
              {title && <h2 className="text-xl font-bold text-indigo-300 mb-1">{title}</h2>}
              {description && <p className="mb-3 whitespace-pre-line text-sm text-white/90">{description}</p>}
              {fields.length > 0 && (
                <div className="mb-3">
                  {fields.map((f, i) => (
                    <div key={i} className="flex justify-between bg-white/5 px-2 py-1 rounded text-sm">
                      <strong>{f.name}</strong>
                      <span>{f.value}</span>
                    </div>
                  ))}
                </div>
              )}
              {imageUrl && <img src={imageUrl} className="mt-3 rounded max-h-48 w-full object-contain" alt="embed" />}
              {footer && <p className="text-xs text-gray-400 mt-3">{footer} – Today at 12:00 PM</p>}
            </div>
          </div>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2 flex flex-col items-center">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`px-5 py-2 rounded-xl shadow-xl backdrop-blur-md text-white text-sm font-medium animate-iosToast ${toast.type === "success" ? "bg-green-500/80" : "bg-red-500/80"}`}
            >
              <span className="mr-2">{toast.type === "success" ? "✅" : "❌"}</span>
              {toast.msg}
            </div>
          ))}
        </div>

        <style jsx>{`
          .animate-iosToast {
            animation: iosToast 3s ease-in-out forwards;
          }
          @keyframes iosToast {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0px); }
            90% { opacity: 1; }
            100% { opacity: 0; transform: translateY(20px); }
          }
        `}</style>
      </div>
    </div>
  );
}