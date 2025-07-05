import Express, { Request, Response } from "express";
import { Label } from "../models/Label";
import { LabelRepository } from "../repositories/LabelRepository";

const repository = new LabelRepository()


/**
 * @swagger
 *  components:
 *   schemas:
 *    Label:
 *        properties:
 *          id:
 *            type: integer
 *            description: The auto-generated id
 *          key :
 *            type: string
 *            description: key.
 *          module :
 *            type: string
 *            description: module.
 *          value :
 *            type: Text
 *            description: value.
 *          locale :
 *            type: string
 *            description: locale.
 *          createdAt:
 *            type: string
 *            format: date
 *            description: The date of the record creation.
 *          updatedAt:
 *            type: string
 *            format: date
 *            description: The date of the record updation.
 *          deletedAt:
 *            type: string
 *            format: date
 *            description: The date of the record deletion.
 */

/**
 * @swagger
 * tags:
 *   name: label
 *   description: The label managing API
 */



const saveLabel = async (req: Request, res: Response) => {
  try {
    const created = await repository.store({ ...req.body })
    return res.status(201).json({ data: created })
  } catch (e: any) {
    res.status(422).json({ error: ['could not create data', e.message] })
  }
}


const readLabel = async (req: Request, res: Response) => {
  try {
    const datas = await repository.create()
    return res.status(200).json({ data: datas })
  } catch (e: any) {
    res.status(404).json({ error: ['could not read data', e.message] })
  }

};
const labelEdit = async (req: Request, res: Response) => {
  const id: any = req.params.id
  try {
    const datas = await repository.edit(id)
    return res.json({ success: true, data: datas })
  } catch (e: any) {
    res.status(404).json({ success: false, error: e.message })
  }
};

const updateLabel = async (req: Request, res: Response) => {
  // const id: any = req.params.id;
  try {
    await repository.update(req.body)
    // const updatedastro: Label | null = await Label.findByPk(id);
    return res.status(200).json({success: true})
  } catch (e: any) {
    res.status(422).json({success: false, error: ['could not update data', e.message] })
  }

};



const destroyLabel = async (req: Request, res: Response) => {
  const id: any = req.params.id;

  try {
    const deletes: Label | null = await Label.findByPk(id);
    await repository.delete(id)
    return res.status(200).json({ data: deletes })
  } catch (e: any) {
    res.status(422).json({ error: ['could not delete data', e.message] })
  }

};
/**
 * @swagger
 * /v1/labels:
 *   get:
 *     summary: Returns the list of all labels
 *     tags: [label]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               success : true
 *               data : {ASTROLOGY: {en: "ASTROLOGY", hi: "ज्योतिष"}}
 *               error:
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               success : false
 *               data : {}
 *               error:
 */


      const label = async (req: Request, res: Response) => {
        // const module = req.params.module != '' ? req.params.module : null
        try{
            const datas= await repository.Labels()
            return res.status(200).json({ success: true, data: datas, error:null })
        }catch(e:any){
          res.status(400).json({success:false,data:{}, msg: ['could not read data',e.message]})
        }
      }

export { saveLabel, readLabel, updateLabel, destroyLabel, label, labelEdit }