import Link from "next/link";

export function PublicBackHomeButton() {
  return (
    <Link href="/" className="button-secondary">
      Quay lại trang chủ công khai
    </Link>
  );
}