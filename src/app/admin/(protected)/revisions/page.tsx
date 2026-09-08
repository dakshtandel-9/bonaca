import RevisionList from "@/components/admin/RevisionList";
import { listRevisions } from "@/lib/cms/revisions";

export const dynamic = "force-dynamic";

/** The way back from an import that went wrong. */
export default async function RevisionsPage() {
  const revisions = await listRevisions();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Revisions</h1>
          <p>
            A copy of the whole site is saved before every AI import. Restoring one puts
            everything back — and snapshots what is there now first, so you can change your
            mind again.
          </p>
        </div>
      </div>

      <section className="admin-card">
        <div className="admin-card-head">
          <h2>The last {revisions.length || "few"} snapshots</h2>
        </div>
        <div className="admin-card-body">
          <RevisionList revisions={revisions} />
        </div>
      </section>
    </>
  );
}
