"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculateSessionScores } from "@/lib/scoring";

export async function submitIntake(formData: FormData) {
  const name = String(formData.get("name") || "Anonymous patient");
  const email = String(formData.get("email") || "");

  const patient = await prisma.patient.create({ data: { name, email: email || null } });
  const session = await prisma.intakeSession.create({ data: { patientId: patient.id } });

  const questions = await prisma.question.findMany({ where: { isActive: true }, include: { answerOptions: true } });
  for (const question of questions) {
    const answerOptionId = String(formData.get(question.code) || "");
    if (!answerOptionId) continue;
    const option = question.answerOptions.find((candidate) => candidate.id === answerOptionId);
    if (!option) continue;
    await prisma.patientAnswer.create({
      data: {
        sessionId: session.id,
        questionId: question.id,
        answerOptionId
      }
    });
  }

  await calculateSessionScores(session.id);
  redirect(`/results/${session.id}`);
}
