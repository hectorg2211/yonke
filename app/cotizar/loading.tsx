export default function CotizarLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 md:grid-cols-12 md:px-8 md:py-20">
      <div className="md:col-span-5">
        <p className="stamp text-[11px] text-rust">Cotización</p>
        <div className="mt-4 h-24 w-64 bg-asphalt" />
      </div>
      <div className="h-96 border border-line bg-asphalt md:col-span-7" />
    </div>
  );
}