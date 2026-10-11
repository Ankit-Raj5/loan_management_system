import { Request, Response } from "express";
import * as salesService from "../services/sales.service";
import { MESSAGES } from "../utils/messages";
import { sendSuccess } from "../utils/response";
import { parseListQuery } from "../utils/validators";

// Lists leads: borrowers who started or were BRE-rejected but have not submitted an application (?stage= filters)
export const listLeads = async (req: Request, res: Response) => {
  const { page, limit, filter } = parseListQuery(req.query, "stage", salesService.ALL_LEAD_STAGES);
  const result = await salesService.listLeads(filter, page, limit);
  return sendSuccess(res, { leads: result.items, pagination: result.pagination }, MESSAGES.OPERATIONS.LEADS_FETCHED);
};
