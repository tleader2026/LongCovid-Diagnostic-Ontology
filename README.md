# Human Regulatory State Engine

A local-first MVP for adaptive post-viral / neuroimmune recovery phenotyping.

This is not a disease ontology or diagnosis engine. It models symptoms as observable regulatory-state indicators and maps intake answers into explainable phenotype candidates, functional domains, candidate mechanism hypotheses, trigger signals, intervention-response signals, and suggested pathways.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite

## Setup

```bash
npm install
npm run setup
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Useful Commands

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run build
```

## What Is Seeded

- 6 top-level regulatory domains
- 28 adaptive intake questions
- 7 phenotype archetypes
- candidate cellular/system mechanism hypotheses
- trigger classes
- intervention-response signals
- care pathways
- outcome measures
- weighted score rules

## Product Flow

```text
Patient
-> Intake session
-> Symptoms
-> Triggers
-> Timing patterns
-> Intervention responses
-> Functional domains
-> Candidate mechanisms
-> Phenotype scores
-> Suggested pathways
-> Longitudinal outcomes
```

## App Areas

- `/intake`: patient intake questionnaire
- `/results/[sessionId]`: explainable scoring dashboard
- `/admin`: local ontology editor for domains, symptoms, triggers, questions, score rules, phenotypes, and pathways

## Epistemic Guardrail

Candidate mechanisms are hypothesis-layer signals only. They are not diagnostic findings, confirmed pathology, or proof of tissue damage.

Preferred language:

- candidate mechanism
- hypothesis layer
- regulatory-state signal
- phenotype candidate
- suggested next pathway

Avoid:

- confirmed diagnosis
- damaged organ
- proven pathology
- causal certainty

## Future Versions

- v2: richer patient dashboard and saved longitudinal trends
- v3: weekly outcome tracking and domain drift visualization
- v4: clinician/admin portal with audit trails
- v5: ML-assisted clustering over anonymized longitudinal data
