import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold">Bring Your Event To Life</h1>
        <p className="text-lg text-gray-700">
          Weddings, corporate events, photo booths, and more — curated sound and unforgettable vibes.
        </p>
        <div className="flex gap-3">
          <Link href="/contact" className="btn">Get a Quote</Link>
          <a href="/qr.png" className="navlink">QR Code</a>
        </div>
      </div>
      <div className="card flex items-center justify-center">
        <Image src="/qr.png" alt="QR linking to homepage" width={240} height={240} />
      </div>
    </section>
  );
}
