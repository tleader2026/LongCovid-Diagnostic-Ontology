import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Metric = readonly [label: string, value: number];

export default async function Home() {
  const [domains, questions, phenotypes] = await Promise.all([
    prisma.functionalDomain.count(),
    prisma.question.count(),
    prisma.phenotype.count()
  ]);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="flex min-h-[70vh] flex-col justify-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-clinical">
          Dynamic regulatory-state ontology
        </p>
        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
          Adaptive phenotype stratification for post-viral recovery signals.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Collect symptom, trigger, timing, intervention-response, and outcome data, then map
          them into explainable regulatory-state hypotheses. This is not a diagnosis engine.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="focus-ring rounded-md bg-clinical px-5 py-3 font-medium text-white shadow-soft" href="/intake">
            Start intake
          </Link>
          <Link className="focus-ring rounded-md border border-line bg-white px-5 py-3 font-medium text-ink" href="/admin">
            Edit ontology
          </Link>
        </div>
      </section>
      <section className="grid content-center gap-4">
        {([
          ["Functional domains", domains],
          ["Adaptive questions", questions],
          ["Phenotype candidates", phenotypes]
        ] satisfies Metric[]).map(([label, value]: Metric) => (
          <div key={label} className="rounded-lg border border-line bg-white p-6 shadow-soft">
            <div className="text-3xl font-semibold text-ink">{value}</div>
            <div className="mt-1 text-sm text-muted">{label}</div>
          </div>
        ))}
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="font-semibold text-ink">Modeling rule</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Symptoms are state indicators. Cell populations and mechanisms are candidate
            hypothesis layers, never confirmed pathology.
          </p>
        </div>
      </section>
    </main>
  );
}
