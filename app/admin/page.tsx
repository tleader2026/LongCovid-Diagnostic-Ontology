import { AdminEditable } from "@/components/AdminEditable";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [domains, symptoms, triggers, questions, phenotypes, pathways, scoreRules] = await Promise.all([
    prisma.functionalDomain.findMany({ orderBy: { name: "asc" }, include: { mechanisms: true, regions: true } }),
    prisma.symptom.findMany({ orderBy: { name: "asc" } }),
    prisma.trigger.findMany({ orderBy: { name: "asc" } }),
    prisma.question.findMany({ orderBy: { sortOrder: "asc" }, include: { answerOptions: { orderBy: { sortOrder: "asc" } } } }),
    prisma.phenotype.findMany({ orderBy: { name: "asc" }, include: { pathway: true } }),
    prisma.carePathway.findMany({ orderBy: { name: "asc" } }),
    prisma.scoreRule.findMany({
      take: 80,
      orderBy: { id: "asc" },
      include: {
        answerOption: { include: { question: true } },
        functionalDomain: true,
        phenotype: true,
        mechanismHypothesis: true,
        trigger: true,
        intervention: true
      }
    })
  ]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-clinical">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Ontology editor</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Edit domains, symptoms, triggers, questions, answer options, scoring rules, phenotypes, and pathways.
          Mechanisms remain hypothesis-layer language throughout the product.
        </p>
      </div>

      <div className="grid gap-6">
        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-semibold text-ink">Functional domains</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {domains.map((domain) => (
              <article key={domain.id} className="rounded-md border border-line p-4">
                <AdminEditable model="functionalDomain" id={domain.id} field="name" value={domain.name} />
                <div className="mt-2">
                  <AdminEditable model="functionalDomain" id={domain.id} field="description" value={domain.description} multiline />
                </div>
                <p className="mt-3 text-xs text-muted">{domain.regions.length} regions/systems · {domain.mechanisms.length} candidate mechanisms</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-semibold text-ink">Questions and answer options</h2>
          <div className="grid gap-4">
            {questions.map((question) => (
              <article key={question.id} className="rounded-md border border-line p-4">
                <div className="grid gap-2 md:grid-cols-[1fr_180px]">
                  <AdminEditable model="question" id={question.id} field="prompt" value={question.prompt} />
                  <AdminEditable model="question" id={question.id} field="category" value={question.category} />
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {question.answerOptions.map((option) => (
                    <AdminEditable key={option.id} model="answerOption" id={option.id} field="label" value={option.label} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-semibold text-ink">Phenotypes</h2>
            <div className="grid gap-4">
              {phenotypes.map((phenotype) => (
                <article key={phenotype.id} className="rounded-md border border-line p-4">
                  <AdminEditable model="phenotype" id={phenotype.id} field="name" value={phenotype.name} />
                  <div className="mt-2">
                    <AdminEditable model="phenotype" id={phenotype.id} field="description" value={phenotype.description} multiline />
                  </div>
                  <p className="mt-2 text-xs text-muted">Pathway: {phenotype.pathway?.name ?? "Unassigned"}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-semibold text-ink">Care pathways</h2>
            <div className="grid gap-4">
              {pathways.map((pathway) => (
                <article key={pathway.id} className="rounded-md border border-line p-4">
                  <AdminEditable model="carePathway" id={pathway.id} field="name" value={pathway.name} />
                  <div className="mt-2">
                    <AdminEditable model="carePathway" id={pathway.id} field="steps" value={pathway.steps} multiline />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-semibold text-ink">Symptoms</h2>
            <div className="grid gap-2">
              {symptoms.map((symptom) => (
                <AdminEditable key={symptom.id} model="symptom" id={symptom.id} field="name" value={symptom.name} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <h2 className="mb-4 font-semibold text-ink">Triggers</h2>
            <div className="grid gap-2">
              {triggers.map((trigger) => (
                <div key={trigger.id} className="grid gap-2 md:grid-cols-[1fr_160px]">
                  <AdminEditable model="trigger" id={trigger.id} field="name" value={trigger.name} />
                  <AdminEditable model="trigger" id={trigger.id} field="className" value={trigger.className} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-soft">
          <h2 className="mb-4 font-semibold text-ink">Scoring rules</h2>
          <div className="grid gap-3">
            {scoreRules.map((rule) => {
              const target = rule.functionalDomain?.name || rule.phenotype?.name || rule.mechanismHypothesis?.name || rule.trigger?.name || rule.intervention?.name || "Unlabeled target";
              return (
                <article key={rule.id} className="grid gap-2 rounded-md border border-line p-3 lg:grid-cols-[1fr_110px_1.2fr]">
                  <p className="text-sm text-muted">
                    <span className="font-medium text-ink">{rule.answerOption.question.code}</span> · {rule.answerOption.label} → {target}
                  </p>
                  <AdminEditable model="scoreRule" id={rule.id} field="weight" value={rule.weight} />
                  <AdminEditable model="scoreRule" id={rule.id} field="explanation" value={rule.explanation} />
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
