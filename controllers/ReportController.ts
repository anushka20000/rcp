import Express, { Request, Response } from "express";
import { Order } from "../models/Order";
import { ReportRepository } from "../repositories/ReportRepository";
const date = require("date-and-time");
const repository = new ReportRepository()

const chartDetails = async (req: Request, res: Response) => {
  try {
    
    const datas = await repository.chartDetails();
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

const saleReport = async (req: Request, res: Response) => {
  try {
    
    const datas = await repository.saleReport();
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

const orderInfoInDashboard = async (req: Request, res: Response) => {
  try {
    
    const datas = await repository.orderInfoInDashboard();
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

const orderList = async (req: Request, res: Response) => {
  const type = req.params.type
  try {
    const datas = await repository.list(type) 
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

const userReport = async (req: Request, res: Response) => {
  // const type = req.params.type
  try {
    const datas = await repository.getUser() 
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};
const orderReport = async (req: Request, res: Response) => {
  // const type = req.params.type
  try {
    const datas = await repository.getOrder() 
    return res.status(200).json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }

};

export { orderInfoInDashboard, orderList, userReport, orderReport, chartDetails, saleReport}