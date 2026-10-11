import { PipelineStage } from "mongoose";
import { LoanApplication } from "../models/loanApplication.model";
import { ApplicationStatus, EmploymentMode, RejectionSource } from "../types/loan";
import { Pagination } from "./loanView.service";

export enum LeadStage {
  DRAFT_IN_PROGRESS = "DRAFT_IN_PROGRESS",
  BRE_REJECTED = "BRE_REJECTED",
}

export const ALL_LEAD_STAGES = Object.values(LeadStage);

export interface LeadView {
  borrowerId: string;
  name: string;
  email: string;
  registeredAt: Date;
  lastLoginAt: Date | null;
  stage: LeadStage;
  attempts: number;
  lastActivityAt: Date;
  latestDetails: {
    fullName: string;
    pan: string;
    monthlySalary: number;
    employmentMode: EmploymentMode;
  };
  breFailures: { rule: string; message: string }[];
}

interface LeadRow {
  _id: unknown;
  attempts: number;
  hasDraft: number;
  lastActivityAt: Date;
  latest: {
    personalDetails: LeadView["latestDetails"];
    breFailures?: { rule: string; message: string }[];
  };
  user: { name: string; email: string; createdAt: Date; lastLoginAt?: Date | null };
}

const SUBMITTED_STATUSES = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.SANCTIONED,
  ApplicationStatus.DISBURSED,
  ApplicationStatus.CLOSED,
];

// Lists leads: borrowers who started or were BRE-rejected but never submitted an application
export const listLeads = async (
  stage: LeadStage | undefined,
  page: number,
  limit: number
): Promise<{ items: LeadView[]; pagination: Pagination }> => {
  const pipeline: PipelineStage[] = [
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$borrower",
        attempts: { $sum: 1 },
        latest: { $first: "$$ROOT" },
        lastActivityAt: { $max: "$updatedAt" },
        hasDraft: { $max: { $cond: [{ $eq: ["$status", ApplicationStatus.DRAFT] }, 1, 0] } },
        submitted: {
          $max: {
            $cond: [
              {
                $or: [
                  { $in: ["$status", SUBMITTED_STATUSES] },
                  {
                    $and: [
                      { $eq: ["$status", ApplicationStatus.REJECTED] },
                      { $eq: ["$rejectionSource", RejectionSource.SANCTION] },
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    { $match: { submitted: 0, ...(stage && { hasDraft: stage === LeadStage.DRAFT_IN_PROGRESS ? 1 : 0 }) } },
    { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
    { $unwind: "$user" },
    { $match: { "user.isActive": true } },
    { $sort: { lastActivityAt: -1 } },
    {
      $facet: {
        rows: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ];

  const [result] = await LoanApplication.aggregate<{ rows: LeadRow[]; total: { count: number }[] }>(pipeline);
  const total = result?.total[0]?.count ?? 0;

  const items: LeadView[] = (result?.rows ?? []).map((row) => ({
    borrowerId: String(row._id),
    name: row.user.name,
    email: row.user.email,
    registeredAt: row.user.createdAt,
    lastLoginAt: row.user.lastLoginAt ?? null,
    stage: row.hasDraft ? LeadStage.DRAFT_IN_PROGRESS : LeadStage.BRE_REJECTED,
    attempts: row.attempts,
    lastActivityAt: row.lastActivityAt,
    latestDetails: {
      fullName: row.latest.personalDetails.fullName,
      pan: row.latest.personalDetails.pan,
      monthlySalary: row.latest.personalDetails.monthlySalary,
      employmentMode: row.latest.personalDetails.employmentMode,
    },
    breFailures: (row.latest.breFailures ?? []).map((f) => ({ rule: f.rule, message: f.message })),
  }));

  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};
