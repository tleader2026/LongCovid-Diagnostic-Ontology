import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const domains = [
  { name: "Neurologic / Cognitive", slug: "neurologic-cognitive", color: "#2563eb", description: "Cognitive, sensory, neurovascular, and head-pressure regulatory-state signals." },
  { name: "Autonomic / POTS-like", slug: "autonomic-pots", color: "#0f766e", description: "Heart-rate, temperature, fluid-balance, postural, and stress-response instability signals." },
  { name: "Histamine / Mast-cell", slug: "histamine-mast-cell", color: "#b45309", description: "Food, pollen, skin, vascular, H1/H2, and mast-cell threshold signals." },
  { name: "Immune / Inflammatory", slug: "immune-inflammatory", color: "#7c3aed", description: "Post-viral persistence, inflammatory flare, cytokine, and surveillance signals." },
  { name: "Sleep / Circadian", slug: "sleep-circadian", color: "#334155", description: "Sleep timing, nighttime activation, glymphatic, and circadian drift signals." },
  { name: "Metabolic / Mitochondrial", slug: "metabolic-mitochondrial", color: "#be123c", description: "ATP, redox, exertion tolerance, nutrition, and recovery-capacity signals." }
];

const pathways = [
  { name: "Histamine stabilization pathway", description: "Track food/environment thresholds and H1/H2 response signals while reducing avoidable amplification.", steps: "Food and pollen log; clinician review of antihistamine response; sleep and gut-state tracking; re-challenge only with appropriate supervision." },
  { name: "Neuroimmune calming pathway", description: "Reduce amplification load while tracking cognition, head pressure, sleep dependency, and anti-inflammatory response.", steps: "Daily head-pressure/cognition ratings; sleep consistency; trigger audit; clinician-guided review of anti-inflammatory or antiviral response signals." },
  { name: "Autonomic conditioning pathway", description: "Stabilize fluid, thermal, postural, and exertion-state signals with gradual conditioning.", steps: "Hydration/electrolyte trial tracking; compression and heat-avoidance notes; recumbent conditioning progression; HR response log." },
  { name: "Sleep restoration pathway", description: "Treat sleep as a control-layer input and track downstream regulatory-state effects.", steps: "Fixed wake time; light/dark exposure; nighttime symptom log; clinician-guided review of sleep-supporting interventions." },
  { name: "Energy envelope pathway", description: "Map exertion response and recovery timing before increasing load.", steps: "Activity envelope; post-exertional symptom timing; nutrition and sunlight notes; gradual adaptation only when recovery is stable." },
  { name: "Mixed-system stabilization pathway", description: "Prioritize identifying the strongest destabilizers before layering interventions.", steps: "Rank triggers; change one variable at a time; weekly domain score review; focus on sleep, hydration, and pacing baselines." }
];

const phenotypes = [
  ["Histamine-dominant regulatory phenotype", "Prominent food, pollen, H1/H2, flushing, GI, or Pepcid-response signals.", "Histamine stabilization pathway"],
  ["Neuroimmune / head-pressure phenotype", "Head pressure, sensory gain, cognitive flattening, and neurovascular/neuroimmune signals.", "Neuroimmune calming pathway"],
  ["Autonomic instability phenotype", "Heart-rate, heat, postural, hydration, post-meal, and stress-crash signals.", "Autonomic conditioning pathway"],
  ["Sleep-collapse phenotype", "Insomnia, nighttime activation, circadian drift, and sleep-restoration dependency signals.", "Sleep restoration pathway"],
  ["Viral-reactivation-suspected phenotype", "Post-viral persistence with antiviral-response or immune-surveillance signals.", "Neuroimmune calming pathway"],
  ["Metabolic fatigue phenotype", "Exercise intolerance, ATP/redox stress, and post-exertional depletion signals.", "Energy envelope pathway"],
  ["Mixed-system unstable phenotype", "Broad multi-domain volatility with no single dominant regulatory layer yet.", "Mixed-system stabilization pathway"]
];

const regions: Record<string, string[]> = {
  "Neurologic / Cognitive": ["Frontal cortex", "Insula", "Thalamus", "Brainstem", "Hippocampus"],
  "Autonomic / POTS-like": ["Hypothalamus", "Brainstem", "Vagus pathways", "Sympathetic ganglia"],
  "Histamine / Mast-cell": ["Gut", "Skin", "Sinuses", "CNS-adjacent mast cells", "Vascular beds"],
  "Immune / Inflammatory": ["Innate immunity", "Adaptive immunity", "Neuroimmune interface"],
  "Sleep / Circadian": ["Suprachiasmatic nucleus", "Pineal axis", "Glymphatic system"],
  "Metabolic / Mitochondrial": ["ATP generation", "Lipid metabolism", "Redox balance"]
};

const mechanisms: Array<[string, string, string, string]> = [
  ["Microglia", "Neurologic / Cognitive", "Microglia", "Inflammatory amplification, synaptic pruning dysregulation, cytokine propagation."],
  ["Astrocytes", "Neurologic / Cognitive", "Astrocytes", "Glutamate recycling dysfunction, glymphatic impairment, neurovascular support instability."],
  ["Oligodendrocytes", "Neurologic / Cognitive", "Oligodendrocytes", "Myelin maintenance instability and conduction fatigue."],
  ["NG2 glia / OPCs", "Neurologic / Cognitive", "NG2 glia / OPCs", "Repair suppression and remyelination slowdown."],
  ["Pericytes", "Neurologic / Cognitive", "Pericytes", "BBB gating instability and capillary tone dysregulation."],
  ["Endothelial cells", "Neurologic / Cognitive", "Endothelial cells", "Nitric oxide imbalance and vascular coupling dysfunction."],
  ["Magnocellular neurosecretory cells", "Autonomic / POTS-like", "Magnocellular neurosecretory cells", "Vasopressin regulation and fluid-balance signals."],
  ["Parvocellular neurosecretory cells", "Autonomic / POTS-like", "Parvocellular neurosecretory cells", "HPA modulation and stress amplification."],
  ["Osmoreceptor neurons", "Autonomic / POTS-like", "Osmoreceptor neurons", "Electrolyte sensing instability."],
  ["Glucosensing neurons", "Autonomic / POTS-like", "Glucosensing neurons", "Postprandial dysfunction signals."],
  ["Thermosensitive neurons", "Autonomic / POTS-like", "Thermosensitive neurons", "Heat dissipation mismatch and exertional overheating."],
  ["Mast cells", "Histamine / Mast-cell", "Mast cells", "Histamine release and cytokine cascades."],
  ["Basophils", "Histamine / Mast-cell", "Basophils", "Systemic inflammatory amplification."],
  ["ECL cells", "Histamine / Mast-cell", "ECL cells", "H2 signaling instability."],
  ["H1 receptor axis", "Histamine / Mast-cell", "H1 receptor axis", "Itching, anxiety, wakefulness, and flushing signals."],
  ["H2 receptor axis", "Histamine / Mast-cell", "H2 receptor axis", "Vascular fullness, fatigue, head pressure, and GI tone signals."],
  ["CD4 T cells", "Immune / Inflammatory", "CD4 T cells", "Chronic activation signaling."],
  ["CD8 T cells", "Immune / Inflammatory", "CD8 T cells", "Exhaustion vs suppression signals."],
  ["CD19 B cells", "Immune / Inflammatory", "CD19 B cells", "Antigen persistence signaling."],
  ["Monocytes", "Immune / Inflammatory", "Monocytes", "Cytokine propagation."],
  ["NK cells", "Immune / Inflammatory", "NK cells", "Viral surveillance failure signal."],
  ["SCN pacemaker neurons", "Sleep / Circadian", "SCN pacemaker neurons", "Circadian drift."],
  ["Orexin neurons", "Sleep / Circadian", "Orexin neurons", "Wakefulness instability."],
  ["Pineal / melatonin axis", "Sleep / Circadian", "Pineal / melatonin axis", "Light/dark and melatonin timing signals."],
  ["Glymphatic astrocytic networks", "Sleep / Circadian", "Glymphatic astrocytic networks", "Metabolic waste-clearance signals."],
  ["Mitochondria", "Metabolic / Mitochondrial", "Mitochondria", "ATP instability and ROS overload."],
  ["CoQ10 / electron transport", "Metabolic / Mitochondrial", "CoQ10 / electron transport", "Electron-transport support signal."],
  ["NAD+ / redox systems", "Metabolic / Mitochondrial", "NAD+ / redox systems", "Energetic collapse and redox balance signals."],
  ["Lipid metabolism networks", "Metabolic / Mitochondrial", "Lipid metabolism networks", "Membrane signaling dysfunction."]
];

const symptoms = ["head pressure", "cognitive flattening", "emotional blunting", "memory fragmentation", "sensory amplification", "overheating", "HR instability", "stress crashes", "post-meal dysfunction", "circadian instability", "food-triggered neuropathy", "tomato sensitivity", "pollen sensitivity", "flushing", "fatigue", "post-viral persistence", "fluctuating inflammation", "insomnia", "nighttime brain vibrations", "exercise intolerance", "post-exertional depletion"];
const triggers = [["Tomato / high-histamine foods", "food"], ["Pollen / environmental exposure", "environment"], ["Heat", "thermal"], ["Exertion", "exertion"], ["Stress", "stress"], ["Meals / glucose shifts", "metabolic"], ["Poor sleep", "circadian"], ["Viral-like flare", "immune"]];
const timings = ["immediate", "delayed 2-8 hours", "next-day crash", "nighttime", "morning", "post-meal", "post-exertional", "cyclical"];
const interventions = [["Famotidine", "H2"], ["Hydroxyzine", "H1"], ["Acyclovir", "antiviral"], ["CoQ10", "mitochondrial"], ["Electrolytes", "autonomic"], ["Hydration", "autonomic"], ["Compression", "autonomic"], ["Sleep restoration", "circadian"], ["Exercise conditioning", "conditioning"], ["Steroids", "anti-inflammatory"], ["Red light", "circadian"], ["Cyclobenzaprine", "sleep"]];
const outcomes = [["Daily function", "0-10"], ["Head pressure", "0-10"], ["Cognitive clarity", "0-10"], ["Sleep quality", "0-10"], ["Exertion recovery", "hours"], ["Food tolerance", "0-10"]];

const questions = [
  ["onset", "When did this regulatory-state pattern begin?", "onset", [["After a viral illness", "viral"], ["Gradually without a clear trigger", "gradual"], ["After a major stressor", "stress"], ["I am not sure", "unknown"]]],
  ["head_pressure", "How prominent is head pressure or cranial fullness?", "symptom", [["Not present", "none"], ["Mild or occasional", "mild"], ["Moderate and recurring", "moderate"], ["Severe or state-defining", "severe"]]],
  ["cognitive_flattening", "Do you experience cognitive flattening, reduced mental range, or memory fragmentation?", "symptom", [["No", "none"], ["Sometimes", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["sensory_gain", "Are light, sound, smell, touch, or internal sensations amplified?", "symptom", [["No", "none"], ["Mildly", "mild"], ["Clearly", "moderate"], ["Strongly", "severe"]]],
  ["emotional_blunting", "Is emotional reward, motivation, or affective range blunted?", "symptom", [["No", "none"], ["Slightly", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["heat_instability", "How much does heat or exertional overheating destabilize you?", "trigger", [["Not much", "none"], ["Somewhat", "mild"], ["Frequently", "moderate"], ["Strongly", "severe"]]],
  ["hr_instability", "Do you notice heart-rate instability, pounding, or postural intolerance?", "symptom", [["No", "none"], ["Mild", "mild"], ["Moderate", "moderate"], ["Severe", "severe"]]],
  ["electrolyte_response", "Do electrolytes, salt, hydration, or compression improve your state?", "response", [["No clear response", "none"], ["Small improvement", "mild"], ["Meaningful improvement", "moderate"], ["Large stabilizing effect", "severe"]]],
  ["post_meal", "Do meals trigger fatigue, head pressure, neuropathy, HR shifts, or brain fog?", "trigger", [["No", "none"], ["Occasionally", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["tomato_food", "Do tomatoes or high-histamine foods trigger neuropathy, fullness, flushing, or head pressure?", "trigger", [["No", "none"], ["Unclear or mild", "mild"], ["Yes, reliably", "moderate"], ["Yes, strongly", "severe"]]],
  ["pollen", "Do pollen, sinus, seasonal, or environmental exposures worsen symptoms?", "trigger", [["No", "none"], ["Slightly", "mild"], ["Clearly", "moderate"], ["Strongly", "severe"]]],
  ["flushing_itching", "Do flushing, itching, wakefulness, or anxiety spikes occur with triggers?", "symptom", [["No", "none"], ["Mildly", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["famotidine", "How do H2 blockers such as famotidine/Pepcid affect your state?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Major stabilizing effect", "severe"]]],
  ["hydroxyzine", "How do H1 blockers such as hydroxyzine affect sleep, itching, anxiety, or flares?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Major stabilizing effect", "severe"]]],
  ["viral_persistence", "Do symptoms feel like a post-viral persistence pattern with recurring immune-like flares?", "immune", [["No", "none"], ["Maybe", "mild"], ["Often", "moderate"], ["Very strongly", "severe"]]],
  ["antiviral_response", "Have antivirals such as acyclovir produced a meaningful state shift?", "response", [["Not tried or no effect", "none"], ["Small shift", "mild"], ["Clear shift", "moderate"], ["Large shift", "severe"]]],
  ["steroid_response", "Have steroids or anti-inflammatory agents produced a meaningful temporary improvement?", "response", [["Not tried or no effect", "none"], ["Small shift", "mild"], ["Clear shift", "moderate"], ["Large shift", "severe"]]],
  ["sleep_collapse", "How disrupted is sleep initiation, continuity, or depth?", "sleep", [["Stable", "none"], ["Mild disruption", "mild"], ["Frequent disruption", "moderate"], ["Collapsed or highly unstable", "severe"]]],
  ["night_vibrations", "Do nighttime brain vibrations, internal buzzing, or nocturnal activation occur?", "sleep", [["No", "none"], ["Rarely", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["sleep_restoration", "When sleep improves, how much do other domains improve?", "response", [["No clear link", "none"], ["Some link", "mild"], ["Strong link", "moderate"], ["Sleep is the main stabilizer", "severe"]]],
  ["circadian_drift", "Is your symptom pattern tied to circadian drift, late nights, light exposure, or morning instability?", "sleep", [["No", "none"], ["Mildly", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["fatigue", "How prominent is fatigue or energetic collapse?", "metabolic", [["Not prominent", "none"], ["Mild", "mild"], ["Moderate", "moderate"], ["Severe", "severe"]]],
  ["exercise_intolerance", "How does exertion affect symptoms within the next 24-48 hours?", "metabolic", [["Usually improves me", "improves"], ["Neutral or mixed", "none"], ["Delayed symptom increase", "moderate"], ["Clear post-exertional depletion", "severe"]]],
  ["coq10", "Does CoQ10, nutrition, sunlight, or metabolic support improve stamina or clarity?", "response", [["Not tried or no effect", "none"], ["Small improvement", "mild"], ["Clear improvement", "moderate"], ["Large improvement", "severe"]]],
  ["stress_crash", "Do emotional, cognitive, or physical stressors cause disproportionate crashes?", "trigger", [["No", "none"], ["Sometimes", "mild"], ["Often", "moderate"], ["Strongly", "severe"]]],
  ["fluctuation", "How quickly can your state change after a trigger or stabilizer?", "timing", [["Slowly over weeks", "slow"], ["Within days", "days"], ["Within hours", "hours"], ["Within minutes", "minutes"]]],
  ["functional_limit", "Current functional limitation compared with baseline?", "outcome", [["Minimal", "mild"], ["Moderate", "moderate"], ["Severe", "severe"], ["Variable by state", "variable"]]],
  ["multi_domain", "Do several systems destabilize together rather than one isolated symptom cluster?", "summary", [["No", "none"], ["Somewhat", "mild"], ["Often", "moderate"], ["Yes, strongly", "severe"]]]
] as const;

const ruleMap: Record<string, Array<[string, string, number, string]>> = {
  viral: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Post-viral onset supports immune persistence hypothesis."], ["phenotype:Neuroimmune / head-pressure phenotype", "mechanism:Microglia", 1.5, "Post-viral onset can couple to neuroimmune state shifts."]],
  stress: [["domain:Autonomic / POTS-like", "mechanism:Parvocellular neurosecretory cells", 2, "Stress-linked onset supports HPA/autonomic amplification."], ["phenotype:Mixed-system unstable phenotype", "domain:Sleep / Circadian", 1.2, "Stress onset can destabilize multiple control layers."]],
  severe: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 0.7, "High severity contributes to mixed-system instability."]],
  moderate: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 0.4, "Moderate recurring signal contributes to cross-domain load."]],
  hours: [["phenotype:Mixed-system unstable phenotype", "domain:Histamine / Mast-cell", 1.5, "Rapid state changes suggest threshold or mediator-driven regulation."], ["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 1, "Hour-scale shifts can reflect autonomic state changes."]],
  minutes: [["phenotype:Histamine-dominant regulatory phenotype", "domain:Histamine / Mast-cell", 2, "Minute-scale shifts suggest threshold-mediated trigger sensitivity."], ["phenotype:Autonomic instability phenotype", "domain:Autonomic / POTS-like", 1.5, "Very rapid shifts also support autonomic coupling."]],
  variable: [["phenotype:Mixed-system unstable phenotype", "domain:Sleep / Circadian", 2, "Variable limitation suggests state-dependent regulation rather than fixed capacity alone."]]
};

const questionRules: Record<string, Array<[string, string, number, string]>> = {
  head_pressure: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 3, "Head pressure is a core neuroimmune/neurovascular state signal."], ["mechanism:Pericytes", "mechanism:Endothelial cells", 1.2, "Cranial fullness can map to vascular coupling hypotheses."], ["mechanism:H2 receptor axis", "domain:Histamine / Mast-cell", 0.8, "Head pressure can also appear in H2/histamine patterns."]],
  cognitive_flattening: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 2.4, "Cognitive flattening supports neurologic/cognitive domain load."], ["mechanism:Astrocytes", "mechanism:Microglia", 1.4, "Cognitive compression maps to neuroimmune/glial hypothesis layers."]],
  sensory_gain: [["domain:Neurologic / Cognitive", "phenotype:Neuroimmune / head-pressure phenotype", 2, "Sensory amplification indicates altered gain control."], ["mechanism:Microglia", "domain:Histamine / Mast-cell", 1, "Sensory gain can couple neuroimmune and histamine mediator states."]],
  emotional_blunting: [["domain:Neurologic / Cognitive", "mechanism:Astrocytes", 1.8, "Emotional blunting is treated as a cognitive/reward state signal."], ["phenotype:Neuroimmune / head-pressure phenotype", "domain:Metabolic / Mitochondrial", 1, "Reduced reward can track neuroimmune or energy-state compression."]],
  heat_instability: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 3, "Heat destabilization supports thermoregulatory/autonomic instability."], ["mechanism:Thermosensitive neurons", "trigger:Heat", 2, "Heat sensitivity maps to thermosensitive neuron hypothesis layer."]],
  hr_instability: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 3, "Heart-rate instability is a core autonomic signal."], ["mechanism:Magnocellular neurosecretory cells", "mechanism:Osmoreceptor neurons", 1.4, "HR instability can couple fluid-balance and electrolyte sensing hypotheses."]],
  electrolyte_response: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 2.4, "Electrolyte/hydration response supports autonomic fluid-balance signaling."], ["intervention:Electrolytes", "intervention:Hydration", 2, "Reported response strengthens electrolyte/hydration intervention-response signal."]],
  post_meal: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 1.8, "Post-meal dysfunction supports autonomic/metabolic coupling."], ["mechanism:Glucosensing neurons", "trigger:Meals / glucose shifts", 2, "Meal-linked shifts map to glucosensing and postprandial hypotheses."]],
  tomato_food: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 3, "Food-triggered neuropathy/fullness strongly supports histamine threshold instability."], ["mechanism:Mast cells", "trigger:Tomato / high-histamine foods", 2, "Tomato/high-histamine sensitivity maps to mast-cell mediator hypotheses."]],
  pollen: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.4, "Pollen sensitivity supports histamine/environment threshold instability."], ["mechanism:H1 receptor axis", "trigger:Pollen / environmental exposure", 1.8, "Environmental sensitivity maps to H1-type mediator signals."]],
  flushing_itching: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.5, "Flushing/itching/wakefulness are H1/histamine-axis signals."], ["mechanism:H1 receptor axis", "mechanism:Mast cells", 1.8, "This answer strengthens mast-cell/H1 candidate mechanisms."]],
  famotidine: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 3, "Famotidine response is a strong H2-axis regulatory signal."], ["mechanism:H2 receptor axis", "intervention:Famotidine", 2.5, "H2 blocker response strengthens the H2 receptor hypothesis layer."]],
  hydroxyzine: [["domain:Histamine / Mast-cell", "phenotype:Histamine-dominant regulatory phenotype", 2.5, "H1 blocker response supports H1/histamine involvement."], ["mechanism:H1 receptor axis", "intervention:Hydroxyzine", 2, "Hydroxyzine response strengthens H1 intervention-response signal."]],
  viral_persistence: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Persistent post-viral flares support immune-surveillance/persistence hypothesis."], ["mechanism:NK cells", "mechanism:CD8 T cells", 1.5, "This maps to viral surveillance and T-cell exhaustion/suppression hypotheses."]],
  antiviral_response: [["domain:Immune / Inflammatory", "phenotype:Viral-reactivation-suspected phenotype", 3, "Antiviral response is a signal, not proof, for viral-reactivation-suspected phenotype."], ["intervention:Acyclovir", "mechanism:NK cells", 2, "Acyclovir response strengthens antiviral-response signal."]],
  steroid_response: [["domain:Immune / Inflammatory", "phenotype:Neuroimmune / head-pressure phenotype", 2.2, "Steroid responsiveness supports inflammatory amplification signal."], ["intervention:Steroids", "mechanism:Monocytes", 2, "Temporary anti-inflammatory response maps to monocyte/cytokine propagation hypotheses."]],
  sleep_collapse: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 3, "Sleep disruption is a core circadian control-layer signal."], ["mechanism:Orexin neurons", "mechanism:SCN pacemaker neurons", 1.5, "Sleep collapse maps to wakefulness and circadian pacemaker hypotheses."]],
  night_vibrations: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.4, "Nocturnal activation strengthens sleep/circadian instability."], ["mechanism:Orexin neurons", "domain:Neurologic / Cognitive", 1.2, "Nighttime buzzing can couple wakefulness and neurologic state signals."]],
  sleep_restoration: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.5, "Broad improvement after sleep supports sleep as a control-layer input."], ["intervention:Sleep restoration", "mechanism:Glymphatic astrocytic networks", 2, "Sleep restoration response strengthens glymphatic/circadian hypothesis layer."]],
  circadian_drift: [["domain:Sleep / Circadian", "phenotype:Sleep-collapse phenotype", 2.2, "Light/timing-linked symptoms support circadian drift."], ["mechanism:SCN pacemaker neurons", "intervention:Red light", 1.4, "Light sensitivity maps to SCN/light-exposure intervention signals."]],
  fatigue: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 2.5, "Fatigue is a core metabolic/energy-state signal."], ["mechanism:Mitochondria", "mechanism:NAD+ / redox systems", 1.8, "Energetic collapse maps to mitochondrial and redox hypotheses."]],
  exercise_intolerance: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 3, "Post-exertional depletion supports metabolic recovery-capacity instability."], ["trigger:Exertion", "mechanism:Mitochondria", 2, "Exertion sensitivity maps to ATP/recovery hypotheses."]],
  coq10: [["domain:Metabolic / Mitochondrial", "phenotype:Metabolic fatigue phenotype", 2.2, "Metabolic support response strengthens energy-state hypothesis."], ["intervention:CoQ10", "mechanism:CoQ10 / electron transport", 2, "CoQ10 response maps to electron transport support signal."]],
  stress_crash: [["domain:Autonomic / POTS-like", "phenotype:Autonomic instability phenotype", 2.2, "Stress crashes support autonomic/HPA amplification."], ["trigger:Stress", "mechanism:Parvocellular neurosecretory cells", 1.8, "Stress sensitivity maps to HPA modulation hypotheses."]],
  multi_domain: [["phenotype:Mixed-system unstable phenotype", "domain:Immune / Inflammatory", 2.5, "Multi-domain destabilization supports mixed-system instability."], ["domain:Autonomic / POTS-like", "domain:Sleep / Circadian", 1.2, "Multiple coupled systems suggest synchronization failure across domains."]]
};

function multiplier(value: string) {
  if (value === "severe") return 1.35;
  if (value === "moderate") return 1;
  if (value === "mild") return 0.45;
  if (value === "improves") return 0.8;
  return 0;
}

async function main() {
  await prisma.patientAnswer.deleteMany();
  await prisma.sessionScore.deleteMany();
  await prisma.scoreRule.deleteMany();
  await prisma.answerOption.deleteMany();
  await prisma.question.deleteMany();
  await prisma.intakeSession.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.phenotype.deleteMany();
  await prisma.carePathway.deleteMany();
  await prisma.mechanismHypothesis.deleteMany();
  await prisma.cellPopulation.deleteMany();
  await prisma.regionOrSystem.deleteMany();
  await prisma.functionalDomain.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.timingPattern.deleteMany();
  await prisma.interventionResponse.deleteMany();
  await prisma.intervention.deleteMany();
  await prisma.outcomeMeasure.deleteMany();

  const domainByName = new Map<string, { id: string }>();
  for (const domain of domains) {
    const created = await prisma.functionalDomain.create({ data: domain });
    domainByName.set(created.name, created);
  }

  for (const [domainName, names] of Object.entries(regions)) {
    for (const name of names) {
      await prisma.regionOrSystem.create({ data: { name, type: domainName.includes("/") ? "region" : "system", functionalDomainId: domainByName.get(domainName)!.id } });
    }
  }

  const pathwayByName = new Map<string, { id: string }>();
  for (const pathway of pathways) {
    const created = await prisma.carePathway.create({ data: pathway });
    pathwayByName.set(created.name, created);
  }

  const phenotypeByName = new Map<string, { id: string }>();
  for (const [name, description, pathwayName] of phenotypes) {
    const created = await prisma.phenotype.create({ data: { name, description, pathwayId: pathwayByName.get(pathwayName)!.id } });
    phenotypeByName.set(name, created);
  }

  const cellByName = new Map<string, { id: string }>();
  const mechanismByName = new Map<string, { id: string }>();
  for (const [cellName, domainName, mechanismName, description] of mechanisms) {
    const cell = await prisma.cellPopulation.upsert({
      where: { name: cellName },
      update: {},
      create: { name: cellName, description }
    });
    cellByName.set(cellName, cell);
    const mechanism = await prisma.mechanismHypothesis.create({
      data: { name: mechanismName, description, functionalDomainId: domainByName.get(domainName)!.id, cellPopulationId: cell.id }
    });
    mechanismByName.set(mechanismName, mechanism);
  }

  const triggerByName = new Map<string, { id: string }>();
  for (const [name, className] of triggers) {
    const trigger = await prisma.trigger.create({ data: { name, className, description: `${className} trigger class` } });
    triggerByName.set(name, trigger);
  }

  for (const name of symptoms) await prisma.symptom.create({ data: { name } });
  for (const name of timings) await prisma.timingPattern.create({ data: { name } });

  const interventionByName = new Map<string, { id: string }>();
  for (const [name, category] of interventions) {
    const intervention = await prisma.intervention.create({ data: { name, category } });
    interventionByName.set(name, intervention);
    await prisma.interventionResponse.create({ data: { interventionId: intervention.id, responseLabel: "Reported improvement", interpretation: `${name} response is tracked as an intervention-response signal, not proof of mechanism.` } });
  }
  for (const [name, scale] of outcomes) await prisma.outcomeMeasure.create({ data: { name, scale } });

  async function createRule(answerOptionId: string, targetA: string, targetB: string, weight: number, explanation: string) {
    const data: any = { answerOptionId, weight, explanation };
    for (const target of [targetA, targetB]) {
      const [kind, label] = target.split(":");
      if (kind === "domain") data.functionalDomainId = domainByName.get(label)!.id;
      if (kind === "phenotype") data.phenotypeId = phenotypeByName.get(label)!.id;
      if (kind === "mechanism") data.mechanismHypothesisId = mechanismByName.get(label)!.id;
      if (kind === "trigger") data.triggerId = triggerByName.get(label)!.id;
      if (kind === "intervention") data.interventionId = interventionByName.get(label)!.id;
    }
    await prisma.scoreRule.create({ data });
  }

  for (const [index, [code, prompt, category, options]] of questions.entries()) {
    const question = await prisma.question.create({ data: { code, prompt, category, sortOrder: index + 1 } });
    for (const [optionIndex, [label, value]] of options.entries()) {
      const option = await prisma.answerOption.create({ data: { questionId: question.id, label, value, sortOrder: optionIndex + 1 } });
      const mult = multiplier(value);
      const rules = [...(questionRules[code] ?? []), ...(ruleMap[value] ?? [])];
      for (const [targetA, targetB, weight, explanation] of rules) {
        const finalWeight = value === "none" || value === "unknown" || value === "slow" || value === "days" ? 0 : weight * (mult || 1);
        if (finalWeight > 0) await createRule(option.id, targetA, targetB, finalWeight, explanation);
      }
    }
  }

  await prisma.patient.create({ data: { name: "Demo Patient", email: "demo@example.local" } });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
