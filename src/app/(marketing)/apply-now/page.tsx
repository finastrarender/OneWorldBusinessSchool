import ApplyNowCard from "@/components/apply/ApplyNowCard";
import { defaultApplyNowModal } from "@/data/site-defaults";

export default function ApplyNowPage() {
  return (
    <section className="apply-now-page">
      <div className="section-shell">
        <ApplyNowCard content={defaultApplyNowModal} />
      </div>
    </section>
  );
}
