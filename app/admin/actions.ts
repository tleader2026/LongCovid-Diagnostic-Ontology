"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type EditableModel =
  | "functionalDomain"
  | "symptom"
  | "trigger"
  | "question"
  | "answerOption"
  | "phenotype"
  | "carePathway"
  | "scoreRule";

const editableFields: Record<EditableModel, string[]> = {
  functionalDomain: ["name", "description", "color"],
  symptom: ["name", "description"],
  trigger: ["name", "className", "description"],
  question: ["prompt", "category", "isActive"],
  answerOption: ["label", "value"],
  phenotype: ["name", "description"],
  carePathway: ["name", "description", "steps"],
  scoreRule: ["weight", "explanation"]
};

export async function updateOntologyItem(formData: FormData) {
  const model = String(formData.get("model")) as EditableModel;
  const id = String(formData.get("id"));
  const field = String(formData.get("field"));
  const rawValue = String(formData.get("value") ?? "");

  if (!editableFields[model]?.includes(field)) {
    throw new Error("Unsupported ontology edit");
  }

  let value: string | number | boolean | null = rawValue;
  if (field === "weight") value = Number(rawValue);
  if (field === "isActive") value = rawValue === "true";
  if (rawValue === "" && ["description"].includes(field)) value = null;

  const data: Record<string, string | number | boolean | null> = { [field]: value };

  switch (model) {
    case "functionalDomain":
      await prisma.functionalDomain.update({ where: { id }, data: data as Prisma.FunctionalDomainUpdateInput });
      break;
    case "symptom":
      await prisma.symptom.update({ where: { id }, data: data as Prisma.SymptomUpdateInput });
      break;
    case "trigger":
      await prisma.trigger.update({ where: { id }, data: data as Prisma.TriggerUpdateInput });
      break;
    case "question":
      await prisma.question.update({ where: { id }, data: data as Prisma.QuestionUpdateInput });
      break;
    case "answerOption":
      await prisma.answerOption.update({ where: { id }, data: data as Prisma.AnswerOptionUpdateInput });
      break;
    case "phenotype":
      await prisma.phenotype.update({ where: { id }, data: data as Prisma.PhenotypeUpdateInput });
      break;
    case "carePathway":
      await prisma.carePathway.update({ where: { id }, data: data as Prisma.CarePathwayUpdateInput });
      break;
    case "scoreRule":
      await prisma.scoreRule.update({ where: { id }, data: data as Prisma.ScoreRuleUpdateInput });
      break;
  }

  revalidatePath("/admin");
}
