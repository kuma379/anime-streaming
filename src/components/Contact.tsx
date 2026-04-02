import { MessageCircle, Phone } from "lucide-react";

const WA_NUMBER = "087711086764";
const WA_LINK = `https://wa.me/62${WA_NUMBER.replace(/^0/, "")}`;

export function Contact() {
  return (
    <section className="bg-gradient-to-br from-purple-900/30 to-[hsl(222,47%,8%)] rounded-2xl p-6 border border-purple-800/30">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">
            Pasang Iklan di AniStream
          </h3>
          <p className="text-gray-400 text-sm">
            Jangkau ribuan penggemar anime setiap hari. Hubungi kami untuk info pemasangan iklan
            dan penawaran harga terbaik.
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat WhatsApp
          </a>
          <div className="flex items-center gap-2 text-gray-400 text-sm pl-1">
            <Phone className="w-3.5 h-3.5" />
            <span>{WA_NUMBER}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
