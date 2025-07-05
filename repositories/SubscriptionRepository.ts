import { SubscriptionMembers, Subscription } from "../models/Subscription";

export class SubscriptionRepository {
  async list() {
    try {
      const res: Subscription[] = await Subscription.findAll({
        order: [["id", "DESC"]],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: SubscriptionMembers) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const findMail = await Subscription.findAll({where:{email:post.email, status:1}})
   

    if (!post.email ) {
      throw new Error("empty field");
    }
if(findMail.length != 0){
  throw new Error("you are already subscriber");
}

    if (!post.email.match(mailformat)) {
      throw new Error("invalid email");
    } else {
      try {
        let res;
        const subscriber = await Subscription.findOne({where:{email:post.email, status:0}})
        if(subscriber){
          res = await Subscription.update({status: 1},{where:{id: subscriber.dataValues.id}})
        }else{

           res = await Subscription.create(post);
        }
        return {res};
      } catch (e: any) {
        return { error: e };
      }
    }
  }
  async edit(id: bigint) {
    try {
      const res = await Subscription.findOne({
        where: {
          id: id
        }
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async update(post: SubscriptionMembers) {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const noChange = await Subscription.findAll({
      where: {
        id: post.id,

        email: post.email,
        status: post.status,
      },
    });

    const val = await Subscription.findOne({ where: { id: post.id } });
    if (!val) {
      throw new Error("Id not found");
    }
    if (!post.email || !post.status) {
      throw new Error("empty field");
    }

    if (!post.email.match(mailformat)) {
      throw new Error("invalid email");
    }

    if (noChange.length != 0) {
      throw new Error("no changes have been commited!");
    } else {
      try {
        const res = await Subscription.update(post, { where: { id: post.id } });
        return { body: res };
      } catch (e: any) {
        return { error: e };
      }
    }
  }

  async delete(id: bigint) {
    const delData = await Subscription.findAll({ where: { id: id } });
    const del = await Subscription.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await Subscription.destroy({ where: { id: id } });
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
}
