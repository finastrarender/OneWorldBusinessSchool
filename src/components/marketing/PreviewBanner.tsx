import Link from "next/link";

export default function PreviewBanner() {
  return (
    <div className="preview-banner" role="status">
      <span>Draft preview — content may differ from the published site.</span>
      <Link href="/admin" className="preview-banner__button">
        Go to admin dashboard
      </Link>
    </div>
  );
}
