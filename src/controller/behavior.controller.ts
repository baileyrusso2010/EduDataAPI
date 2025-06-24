import { Request, Response } from "express";
import { Op } from "sequelize";
import { BehaviorRecord } from "../models/behavior.model";

export const getBehaviorRecords = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { individualId, date, startDate, endDate } = req.query;

    if (individualId) {
      const records = await BehaviorRecord.findAll({
        where: { student_id: individualId },
      });
      res.status(200).json(records);
      return;
    }

    if (date) {
      const count = await BehaviorRecord.count({
        where: {
          incident_datetime: {
            [Op.eq]: new Date(date as string),
          },
        },
      });
      res.status(200).json({ count });
      return;
    }

    if (startDate && endDate) {
      const count = await BehaviorRecord.count({
        where: {
          incident_datetime: {
            [Op.between]: [
              new Date(startDate as string),
              new Date(endDate as string),
            ],
          },
        },
      });
      res.status(200).json({ count });
      return;
    }

    res.status(400).json({ message: "Invalid query parameters" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
