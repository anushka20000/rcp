import {
  MagazineSubmissionMembers,
  MagazineSubmission,
} from "../models/MagazineSubmission";
import { User } from "../models/User";

export class BlogRepository {
  async list() {
    try {
      const res: MagazineSubmission[] = await MagazineSubmission.findAll({
        order: [["id", "DESC"]],
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }

  async store(post: MagazineSubmissionMembers) {
    const phoneno = /^\d{10}$/;

    if (
      !post.title ||
      !post.author_name ||
      !post.author_contact_number ||
      !post.description
    ) {
      throw new Error("empty field");
    }

    if (
      post.author_contact_number.length != 10 ||
      !post.author_contact_number.match(phoneno)
    ) {
      throw new Error("invalid phone number");
    } else {
      // let sampleFile;
      // let AnotherFile;
      // let uploadPath;
      // let uploadFilePath;
      // if (!files || Object.keys(files).length === 0) {
      //   throw new Error("No file or image were uploaded.");
      // }
      // AnotherFile = files.file;
      // sampleFile = files.image;

      // var file_name = new Date().getTime() + "_" + sampleFile.name;
      // var filesName = new Date().getTime() + "_" + AnotherFile.name;

      // uploadPath = __dirname + "/upload/" + file_name;
      // uploadFilePath = __dirname + "/upload/" + filesName;
      // const path = "/upload/" + file_name;
      // const filePath = "/upload/" + filesName;

      // sampleFile.mv(uploadPath, async function (err) {
      //   if (err) throw new Error(err);
      //   AnotherFile.mv(uploadFilePath, async function (err) {
      //     if (err) throw new Error(err);

          try {
            const fileData: any = {
              image: post.image,
              file: post.file,

              author_contact_number: post.author_contact_number,

              author_name: post.author_name,
              status: post.status,
              title: post.title,

              description: post.description,
            };

            const res = await MagazineSubmission.create(fileData);

            return { body: res, msg: "Documents Updated" };
          } catch (e: any) {
            return { error: e.errors[0].message };
          }
      //   });
      // });
      return { body: "Documents Updated" };
    }
  }
  async edit(id: bigint) {
    try {
      const res = await MagazineSubmission.findOne({
        where: {
          id: id
        }
      });
      return { res };
    } catch (e: any) {
      return { error: e };
    }
  }
  async update(post: any) {
    const phoneno = /^\d{10}$/;

    const val = await MagazineSubmission.findOne({ where: { id: post.id } });

    if (!val) {
      throw new Error("Id not found");
    }

    // if (
    //   !post.title ||
    //   !post.author_name ||
    //   !post.author_contact_number ||
    //   !post.status ||
    //   !post.description
    // ) {
    //   throw new Error("empty field");
    // }

    if (
      post.author_contact_number.length != 10 ||
      !post.author_contact_number.match(phoneno)
    ) {
      throw new Error("invalid phone number");
    } else {
      // let sampleFile;
      // let AnotherFile;
      // let uploadPath;
      // let uploadFilePath;
      // if (!files || Object.keys(files).length === 0) {
      //   throw new Error("No file or image were uploaded.");
      // }
      // AnotherFile = files.file;
      // sampleFile = files.image;

      // var file_name = new Date().getTime() + "_" + sampleFile.name;
      // var filesName = new Date().getTime() + "_" + AnotherFile.name;

      // uploadPath = __dirname + "/upload/" + file_name;
      // uploadFilePath = __dirname + "/upload/" + filesName;
      // const path = "/upload/" + file_name;
      // const filePath = "/upload/" + filesName;

      // sampleFile.mv(uploadPath, async function (err) {
      //   if (err) throw new Error(err);
      //   AnotherFile.mv(uploadFilePath, async function (err) {
      //     if (err) throw new Error(err);

          try {
            const fileData: any = {
              image: post.image,
              file: post.file,

              author_contact_number: post.author_contact_number,

              author_name: post.author_name,
              status: post.status,
              title: post.title,

              description: post.description,
            };

            const res = await MagazineSubmission.update(fileData, {
              where: { id: post.id },
            });

            return { body: res, msg: "Documents Updated" };
          } catch (e: any) {
            return { error: e.errors[0].message };
          }
      //   });
      // });

      return { body: "Documents Updated" };
    }
  }

  async delete(id: bigint) {
    const delData = await MagazineSubmission.findAll({ where: { id: id } });
    const del = await MagazineSubmission.findAll({
      where: { id: id },
      paranoid: false,
    });

    if (delData.length != 0) {
      try {
        const res = await MagazineSubmission.destroy({ where: { id: id } });
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
