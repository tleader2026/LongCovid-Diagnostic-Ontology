export type ScoreTarget = "domain" | "phenotype" | "mechanism" | "trigger" | "intervention";

export type RankedScore = {
  id?: string;
  label: string;
  score: number;
  confidence: number;
  explanation: string;
};
