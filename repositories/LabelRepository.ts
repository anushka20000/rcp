import { LabelMembers, Label } from "../models/Label";

export class LabelRepository {
  async create() {
    try {
      const res: Label[] = await Label.findAll({
        order: [["id", "DESC"]]
      });
      return { body: res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: LabelMembers) {
    if (!post.key || !post.en || !post.module || !post.hi) {
      throw new Error("empty field");
    } else {
      try {
        const res = await Label.create(post);
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }


  async edit(id: bigint) {
    try {
      const data = await Label.findOne({
        where: {
          id: id
        }
      });
      return { data };
    } catch (e: any) {
      return { error: e };
    }
  }


  async update(post: LabelMembers) {
    // const noChange = await Label.findAll({
    //   where: {
    //     id: post.id,
    //     en: post.en,
    //     module: post.module,
    //     hi: post.hi,
    //     key: post.key,
    //   },
    // });
    const val = await Label.findOne({ where: { id: post.id } });
    if (!val) {
      throw new Error("Id not found");
    }
    if ( !post.en || !post.hi) {
      throw new Error("empty field");
    }
    // if (noChange.length != 0) {
    //   throw new Error("no changes have been commited!");
    // } 
    else {
      try {
        const res = await Label.update(post, { where: { id: post.id  } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  async delete(id: bigint) {
    const delData = await Label.findAll({ where: { id: id } });
    const del = await Label.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await Label.destroy({ where: { id: id } });
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

  async Labels(){
    let data:any = {};

     try{
      let res;
      res = await Label.findAll({
        attributes : ['key', 'en', 'hi'],
      //     where : module != null ? { 
      //       module:module 
      //     } : {}
      })

      if(res.length > 0) {
        res.forEach((element, key) => {
          data[element.key] = {
            'en' : element.en,
            'hi' : element.hi,
          };
        });
      }
      
    }catch(e:any){
        return e;

    }
    return data;
  }
}
