import { prisma } from "@/lib/prisma";
import { submitIntake } from "./actions";

export default async function IntakePage() {
  const questions = await prisma.question.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: { answerOptions: { orderBy: { sortOrder: "asc" } } }
  });

  const sections = [
    ["Identity", questions.filter((q) => ["onset"].includes(q.code))],
    ["Neurocognitive", questions.filter((q) => ["head_pressure", "cognitive_flattening", "sensory_gain", "emotional_blunting"].includes(q.code))],
    ["Autonomic", questions.filter((q) => ["heat_instability", "hr_instability", "electrolyte_response", "post_meal"].includes(q.code))],
    ["Histamine", questions.filter((q) => ["tomato_food", "pollen", "flushing_itching", "famotidine", "hydroxyzine"].includes(q.code))],
    ["Immune", questions.filter((q) => ["viral_persistence", "antiviral_response", "steroid_response"].includes(q.code))],
    ["Sleep", questions.filter((q) => ["sleep_collapse", "night_vibrations", "sleep_restoration", "circadian_drift"].includes(q.code))],
    ["Energy", questions.filter((q) => ["fatigue", "exercise_intolerance", "coq10", "stress_crash", "fluctuation", "functional_limit", "multi_domain"].includes(q.code))]
  ] as const;

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-clinical">Adaptive intake</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Map observable regulatory-state signals</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Answer based on current patterns. Results are phenotype candidates and hypothesis layers,
          not diagnoses or confirmed pathology.
        </p>
      </div>

      <form action={submitIntake} className="space-y-6">
        <section className="grid gap-4 rounded-lg border border-line bg-white p-5 shadow-soft md:grid-cols-2">
          <label className="text-sm font-medium text-ink">
            Name
            <input name="name" required className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2" placeholder="Patient name" />
          </label>
          <label className="text-sm font-medium text-ink">
            Email optional
            <input name="email" type="email" className="focus-ring mt-2 w-full rounded-md border border-line px-3 py-2" placeholder="patient@example.com" />
          </label>
        </section>

        {sections.map(([sectionName, items]) => (
          <section key={sectionName} className="rounded-lg border border-line bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-semibold text-ink">{sectionName}</h2>
              <span className="text-xs text-muted">{items.length} questions</span>
            </div>
            <div className="grid gap-5">
              {items.map((question) => (
                <fieldset key={question.id}>
                  <legend className="text-sm font-medium text-ink">{question.prompt}</legend>
                  <div className="mt-3 grid gap-2 md:grid-cols-2">
                    {question.answerOptions.map((option) => (
                      <label key={option.id} className="focus-within:ring-3 rounded-md border border-line bg-paper px-3 py-2 text-sm text-ink focus-within:ring-blue-200">
                        <input className="mr-2" type="radio" name={question.code} value={option.id} required />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </section>
        ))}

        <div className="sticky bottom-0 border-t border-line bg-paper/95 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <p className="text-xs text-muted">Scoring is transparent and editable in Admin.</p>
            <button className="focus-ring rounded-md bg-clinical px-5 py-3 font-medium text-white shadow-soft">
              Calculate phenotype candidates
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
