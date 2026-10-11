import "server-only";
import { notFound } from "next/navigation";
import { ApiError } from "../api-error";
import { PAGE_SIZE } from "../config";
import type { OpsModule } from "../modules";
import type { Application, ListResult, OpsLoan, Pagination } from "../types";
import { buildHref } from "../url";
import { backendFetch } from "./backend";

// Turns a backend 400/404 (bad or unknown id) into the Next.js not-found page; other errors keep bubbling up
const orNotFound = async <T>(promise: Promise<T>): Promise<T> => {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound();
    throw error;
  }
};

// Fetches one page of an operations module's list, optionally filtered by status/stage
export const getModuleList = async <T>(
  module: OpsModule,
  page: number,
  filter?: string,
  limit: number = PAGE_SIZE
): Promise<ListResult<T>> => {
  const data = await backendFetch<Record<string, unknown>>(
    buildHref(module.apiPath, { page, limit, [module.filterParam]: filter })
  );
  return { items: data[module.itemsKey] as T[], pagination: data.pagination as Pagination };
};

// Counts the items waiting in a module's default queue (used by the overview cards)
export const getModuleCount = async (module: OpsModule): Promise<number> =>
  (await getModuleList(module, 1, module.summary.filter, 1)).pagination.total;

// Fetches one loan from an operations module, with the full audit trail
export const getOpsLoan = async <T extends OpsLoan>(module: OpsModule, id: string): Promise<T> =>
  (await orNotFound(backendFetch<{ loan: T }>(`${module.apiPath}/${id}`))).loan;

// Lists all of the logged-in borrower's applications (newest first)
export const getMyApplications = async (): Promise<Application[]> =>
  (await backendFetch<{ applications: Application[] }>("/applications")).applications;

// Fetches one of the logged-in borrower's applications
export const getMyApplication = async (id: string): Promise<Application> =>
  (await orNotFound(backendFetch<{ application: Application }>(`/applications/${id}`))).application;
