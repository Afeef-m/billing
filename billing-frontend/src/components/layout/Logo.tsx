import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
    >
      <Image
        src="/logo.svg"
        alt="BillingFox Logo"
        width={40}
        height={40}
        priority
      />

      <span className="text-xl font-bold">
        BillEase
      </span>
    </Link>
  );
}