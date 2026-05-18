"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

  const delegate = (prisma as any)[model];
  await delegate.update({ where: { id }, data: { [field]: value } });
  revalidatePath("/admin");
}
