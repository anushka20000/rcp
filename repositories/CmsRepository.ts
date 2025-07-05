import { Cms, cms } from "../models/Cms";
import { CmsTranslate } from "../models/CmsTranslate";
import Slug from 'slug'

export class CmsRepository {
  async list() {
    try {
      let res
      // const result = await CmsTranslate.findAll({where: { cms_id: id}})

      // if(result.length != 0){

      res = await cms.findAll({
        attributes: ["id", "status", "type", "image","page", "meta_image", "meta_description", "meta_title", "meta_keywords"],
        order: [["id", "DESC"]],
        include: [
          {
            model: CmsTranslate,
            attributes: ["id", "cms_id", "title", "slug", "locale", "label", "description", "link", "createdAt"],
            order: [["id", "DESC"]],
          }
        ]
      });
      // }else{
      //   res = await cms.findAll({
      //     attributes: ["id", "status", "type", "image","meta_image", "meta_description", "meta_title"],
      //     order: [["id", "DESC"]],
      //   })
      // }
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async cmsListById(id) {
    try {
      let res;
      const result = await CmsTranslate.findAll({ where: { cms_id: id } })

      if (result.length != 0) {

        res = await cms.findOne({
          attributes: ["id", "status", "type", "image","page", "meta_image", "meta_description", "meta_title", "meta_keywords"],
          where: { id: id },
          include: [
            {
              model: CmsTranslate,
              attributes: ["id", "cms_id", "title", "slug", "locale","link", "label", "description", "link"],
              order: [["id", "DESC"]],
            }
          ]
        });
      } else {
        res = await cms.findOne({
          attributes: ["id", "status", "type", "page", "image", "meta_image", "meta_description", "meta_title"],
          where: { id: id },
        })
      }
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(input: any) {
    if (!input.status || !input.type) {
      throw new Error("empty field");
    } else {
      // if (!files || Object.keys(files).length === 0) {
      //   throw new Error("No file or image were uploaded.");
      // }
      // let sampleFile;
      // let uploadPath;

      // sampleFile = files.image;

      // var file_name = new Date().getTime() + "_" + sampleFile.name;
      // uploadPath = __dirname + "/upload/" + file_name;
      // const path = "/upload/" + file_name;
      // sampleFile.mv(uploadPath, async function (err) {
      //   if (err) throw new Error(err);




      try {
        const fileData: any = {
          image: input.image,
          status: input.status,
          type: input.type,
        };
        const res = await cms.create(fileData);
        // input.cmsTranslates.map(async (element) => {

        let slug_en = Slug(input.title_en + " " + "en");
        const findSlug = await CmsTranslate.findOne({
          where: { slug: slug_en },
        });

        if (findSlug) {
          let UniqueString = Math.random().toPrecision(3) + 1;
          slug_en = Slug(input.title_en + " " + UniqueString + " " + "en");
        }

        let slug_hi = Slug(input.title_en + " " + "hi");
        const findSlugHi = await CmsTranslate.findOne({
          where: { slug: slug_hi },
        });

        if (findSlugHi) {
          let UniqueString = Math.random().toPrecision(3) + 1;
          slug_hi = Slug(input.title_hi + " " + UniqueString + " " + "hi");
        }
        if (res) {

          await CmsTranslate.create({
            cms_id: res.dataValues.id,
            locale: 'en',
            title: input.title_en,
            slug: slug_en,
            label: input.label,
            description: input.description_en,
            link: input.link_en,
          });
          await CmsTranslate.create({
            cms_id: res.dataValues.id,
            locale: 'hi',
            title: input.title_hi,
            slug: slug_hi,
            label: input.label,
            description: input.description_hi,
            link: input.link_hi,
          });
        }
        // });

      } catch (e: any) {
        return { error: e };
      }
      // });
    }
  }

  //edit

  async edit(id: bigint) {
    try {
      let res;
      const result = await CmsTranslate.findAll({ where: { cms_id: id } })

      if (result.length != 0) {

        res = await cms.findOne({
          attributes: ["id", "status", "page", "type", "image", "meta_image", "meta_description", "meta_title", "meta_keywords"],
          where: {
            id: id
          },
          include: [
            {
              model: CmsTranslate,
              attributes: ["id", "cms_id", "title", "slug", "locale", "label", "description", "link"],
              order: [["id", "DESC"]],
              where: {
                cms_id: id
              }
            },
          ],

        });
      } else {
        res = await cms.findOne({
          attributes: ["id", "status", "page", "type", "image", "meta_image", "meta_description", "meta_title"],
          where: {
            id: id
          }
        })

      }
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async update(input: any) {
    // const noChange = await cms.findAll({
    //   where: { id: input.id, status: input.status, type: input.type },
    // });
    const val = await cms.findOne({ where: { id: input.id } });
    if (!val) {
      throw new Error("Id not found");
    }
    // if (!input.status || !input.type) {
    //   throw new Error("empty field");
    // }
    // if (noChange.length != 0) {
    //   throw new Error("no changes have been commited!");
    // }
    else {
      // if (!files || Object.keys(files).length === 0) {
      //   throw new Error("No file or image were uploaded.");
      // }
      // let sampleFile;
      // let uploadPath;

      // sampleFile = files.image;

      // var file_name = new Date().getTime() + "_" + sampleFile.name;
      // uploadPath = __dirname + "/upload/" + file_name;
      // const path = "/upload/" + file_name;
      // sampleFile.mv(uploadPath, async function (err) {
      //   if (err) throw new Error(err);
      try {
        const fileData: any = {
          image: input.image,
          status: input.status,
          type: input.type,
          meta_description: input.meta_description,
          meta_keywords: input.meta_keywords,
          meta_title: input.meta_title,
          meta_image: input.meta_image
        };
        const res = await cms.findOne({ where: { id: input.id } })

        // input.cmsTranslates.map(async (element) => {
        //   await CmsTranslate.update(
        //     element, { where: { cms_id: input.id, locale: element.locale } });
        //   });


        if (res) {
          let data = await cms.update(fileData, { where: { id: input.id } });
          // input.cmsTranslates.map(async (element) => {

          let slug_en = Slug(input.title_en + " " + "en");
          const findSlug = await CmsTranslate.findOne({
            where: { slug: slug_en },
          });

          if (findSlug) {
            let UniqueString = Math.random().toPrecision(3) + 1;
            slug_en = Slug(input.title_en + " " + UniqueString + " " + "en");
          }

          let slug_hi = Slug(input.title_en + " " + "hi");
          const findSlugHi = await CmsTranslate.findOne({
            where: { slug: slug_hi },
          });

          if (findSlugHi) {
            let UniqueString = Math.random().toPrecision(3) + 1;
            slug_hi = Slug(input.title_hi + " " + UniqueString + " " + "hi");
          }

          if (data) {

            let translateEn = CmsTranslate.update({
              title: input.title_en,
              label: input.label_en,
              link: input.link,
              description: input.description_en,

            }, { where: { cms_id: input.id, locale: 'en' } })

            let translateHi = CmsTranslate.update({
              title: input.title_hi,
              label: input.label_hi,
              link: input.link,
              description: input.description_hi,

            }, { where: { cms_id: input.id, locale: 'hi' } })


            //   if(!translateEn){
            //     await CmsTranslate.create({
            //       cms_id: res.dataValues.id,
            //       locale: 'en',
            //       title: input.title_en,
            //       slug: slug_en,
            //       label: input.label,
            //       description: input.description_en,
            //       link: input.link_en,
            //     });
            //   }
            //   if(!translateHi){

            //     await CmsTranslate.create({
            //       cms_id: res.dataValues.id,
            //       locale: 'hi',
            //       title: input.title_hi,
            //       slug: slug_hi,
            //       label: input.label,
            //       description: input.description_hi,
            //       link: input.link_hi,
            //     });
            // }
          }
          // });
        }


      } catch (e: any) {
        return { error: e };
      }
      // });
    }
  }

  async delete(id: bigint) {
    const delData = await cms.findAll({ where: { id: id } });
    const del = await cms.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await cms.destroy({ where: { id: id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    } else {
      if (del.length != 0) {
        throw new Error("details got deleted earlier");
      } else {
        throw new Error("details don't exist. please enter a valid id!");
      }
    }
  }

  async lists(slug: any, locale: any) {
    let datas;
    try {
      datas = await CmsTranslate.findAll({
        where: {
          slug: slug,
        },
        attributes: ["id", "cms_id", "slug"],
        include: [
          {
            model: cms,
            attributes: ["id", "status", "type"],
            include: [
              {
                model: CmsTranslate,
                where: {
                  locale: locale,
                },
                attributes: [
                  "id",
                  "cms_id",
                  "slug",
                  "title",
                  "label",
                  "locale",
                  "description",
                ],
              },
            ],
          },
        ],
      });
    } catch (error: any) {
      return error;
    }
    return { datas };
  }

  async seo(page) {
    let seo;
    try {
      seo = await cms.findOne({
        attributes: ["page", "meta_title", "meta_keywords", "meta_description", "meta_image", "page"],
        where: {
          page: page
        }
      });
    } catch (e: any) {
      return e;
    }
    return { seo }
  }


}
