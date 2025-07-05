import { or } from "sequelize";
import { Cms,cms } from "../models/Cms";
import { CmsTranslate } from "../models/CmsTranslate";
import { Location } from "../models/Location";
import { LocationTranslate } from "../models/LocationTranslate";
import { Puja } from "../models/Puja";
import { PujaTranslate } from "../models/PujaTranslate";

export class HomeRepository{
    async lists(locale){
        let location;
        let puja;
        let list;

        try{
            location = await Location.findAll({
                where: {
                    status: 1
                },
                attributes: ["id", "status"],
                include: [
                    {
                        model: LocationTranslate,
                        where: {
                            locale: locale
                        },
                        attributes: ["id", "location_id", "title", "locale"]
                    }
                ]
            })

            puja = await Puja.findAll({
                where : {
                    status : 1
                },
                attributes: ["id", "status"],
                include: [
                    {
                        model: PujaTranslate,
                        where: {
                            locale: locale
                        },
                        attributes: ["id", "puja_id", "title", "locale", "slug"]
                    }
                ]
            })
            
            list = await cms.findAll({
                where:{
                    type: 2,
                    status: 1
                },
                attributes: ["id", "type", "status", "image"],
                include: [
                    {
                        model: CmsTranslate,
                        where: {
                            locale: locale
                        },
                        attributes: ["id", "cms_id", "title", "slug", "label", "locale", "description", "link"]
                    }
                ]
            })
        }catch(e:any){
            return e;
        }
        return {location, puja, list}
    }
}