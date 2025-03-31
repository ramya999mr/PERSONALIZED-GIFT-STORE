import CategoryModel from "~/models/category";
import ProductModel from "~/models/product";
import settingModel from "~/models/setting";
import PageModel from "~/models/webpages";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const category = await CategoryModel.find({ topCategory: true }).select(
          {
            name: 1,
            slug: 1,
            icon: 1,
          },
        );
        const productItemField = {
          name: 1,
          slug: 1,
          image: 1,
          unit: 1,
          unitValue: 1,
          price: 1,
          discount: 1,
          quantity:1,
        };
        const trending = await ProductModel.find({ trending: true }).select(
          productItemField,
        );
        const newProduct = await ProductModel.find({ new: true }).select(
          productItemField,
        );
        const bestSelling = await ProductModel.find({
          bestSelling: true,
        }).select(productItemField);
        const page = await PageModel.findOne({}).select("homePage");
        const settings = await settingModel.findOne({});
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(200).json({
          success: true,
          category: category,
          additional: page,
          trending,
          newProduct,
          bestSelling,
          settings,
        });
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
