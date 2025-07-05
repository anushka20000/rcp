import { Contact, ContactMembers } from "../models/Contact";

export class ContactRepository {
  async list() {
    try {
      const res: Contact[] = await Contact.findAll({
        order: [["id", "DESC"]],
      });

      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }


  async store(input: ContactMembers) {
    try {
      await Contact.create(input);
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }
  async edit(id: bigint) {
    try {
      const res: Contact[] = await Contact.findAll({
        where: {
          id: id,
        },
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async update(input: ContactMembers) {
    try {
      const res = await Contact.findOne({ where: { id: input.id } });

      if (res) {
        await Contact.update(input, { where: { id: input.id } });
      }
    } catch (e: any) {
      return { error: e.errors[0].message };
    }
  }
  
  async delete(id: bigint) {
    const delData = await Contact.findAll({ where: { id: id } });
    const del = await Contact.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        await Contact.destroy({ where: { id: id } });
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
