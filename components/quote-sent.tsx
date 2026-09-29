import { site } from "@/lib/site";

export function QuoteSent({
  name,
  phone,
  onAgain,
}: {
  name: string;
  phone: string;
  onAgain: () => void;
}) {
  const who = name.trim();
  return (
    <div className="grid gap-6">
      <p className="stamp text-[11px] text-rust">Enviado</p>
      <h2 className="display text-3xl text-cream md:text-4xl">
        Listo
      </h2>
      <p className="text-sm leading-6 text-steel">
        {who ? `${who}, te` : "Te"} escribimos por WhatsApp al {phone.trim()}.
      </p>
      <p className="text-sm leading-6 text-steel">
        Si tarda, mándanos mensaje al {site.whatsapp}.
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="stamp h-12 w-fit border border-line px-5 text-[12px] text-cream hover:border-rust hover:text-rust"
      >
        Cotizar otra
      </button>
    </div>
  );
}
