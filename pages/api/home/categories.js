import CategoryModel from "~/models/category";
import settingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const category = await CategoryModel.find({}).select({
          _id: 0,
          categoryId: 1,
          name: 1,
          slug: 1,
          icon: 1,
          subCategories: 1,
        });
        const settings = await settingModel.findOne({});
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(200).json({ success: true, category, settings });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
