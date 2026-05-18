import Link from "next/link";
import { notFound } from "next/navigation";
import { ScoreBar } from "@/components/ScoreBar";
import { prisma } from "@/lib/prisma";
import { calculateSessionScores } from "@/lib/scoring";
import type { RankedScore } from "@/lib/types";
import type { FunctionalDomain } from "@prisma/client";

export default async function ResultsPage({ params }: { params: { sessionId: string } }) {
  const session = await prisma.intakeSession.findUnique({
    where: { id: params.sessionId },
    include: { patient: true }
  });
  if (!session) notFound();

  const result = await calculateSessionScores(session.id);
  const domainColors = await prisma.functionalDomain.findMany();
  const colorByName = new Map(domainColors.map((domain: FunctionalDomain) => [domain.name, domain.color]));
  const topPhenotype = result.phenotypes[0];
  const phenotype = topPhenotype
    ? await prisma.phenotype.findUnique({ where: { name: topPhenotype.label }, include: { pathway: true } })
    : null;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-clinical">Results</p>
          <h1 className="mt-2 text-3xl font-semibold text-ink">{session.patient.name}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            These are regulatory-state phenotype candidates. They are not diagnoses and do not confirm cellular pathology.
          </p>
        </div>
        <Link href="/intake" className="rounded-md border border-line bg-white px-4 py-2 text-sm font-medium text-ink">New intake</Link>
      </div>

      <section className="mb-6 rounded-lg border border-line bg-white p-5 shadow-soft">
        <h2 className="font-semibold text-ink">Suggested next pathway</h2>
        <p className="mt-2 text-lg font-medium text-clinical">{phenotype?.pathway?.name ?? "Mixed-system review pathway"}</p>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-muted">{phenotype?.pathway?.description ?? "Review strongest domains and repeat intake after changing one stabilizing variable."}</p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">{phenotype?.pathway?.steps}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section>
          <h2 className="mb-3 font-semibold text-ink">Top functional domains</h2>
          <div className="grid gap-3">
            {result.domains.slice(0, 6).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color={colorByName.get(score.label)} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Phenotype candidates</h2>
          <div className="grid gap-3">
            {result.phenotypes.slice(0, 7).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#0f766e" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Candidate mechanism hypothesis layer</h2>
          <div className="grid gap-3">
            {result.mechanisms.slice(0, 8).map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#7c3aed" />
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-3 font-semibold text-ink">Trigger and intervention signals</h2>
          <div className="grid gap-3">
            {[...result.triggers.slice(0, 4), ...result.interventions.slice(0, 4)].map((score: RankedScore) => (
              <ScoreBar key={score.label} {...score} color="#b45309" />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-line bg-white p-5">
        <h2 className="font-semibold text-ink">Clinical language guardrail</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Candidate mechanisms are shown because they make the scoring explainable. They are not diagnostic findings,
          and they should be interpreted as hypothesis-layer signals for discussion with a qualified clinician.
        </p>
      </section>
    </main>
  );
}
