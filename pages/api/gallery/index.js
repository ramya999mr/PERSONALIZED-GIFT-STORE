import CategoryModel from "../../../models/category";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const category = await CategoryModel.find({});
        const product_length = await ProductModel.estimatedDocumentCount();
        const productItemField = {
          name: 1,
          slug: 1,
          image: 1,
          unit: 1,
          unitValue: 1,
          price: 1,
          discount: 1,
          type: 1,
          variants: 1,
          quantity: 1,
        };
        if (req.query.category?.length && req.query.category !== "null") {
          const query = req.query.category;
          const product = await ProductModel.find({
            $or: [{ categories: query }, { subcategories: query }],
          }).select(productItemField);
          res.status(200).json({
            product: product,
            product_length: product.length,
            category,
          });
        } else {
          const product = await ProductModel.find({})
            .sort("-date")
            .limit(8)
            .select(productItemField)
            .exec();
          res.status(200).json({
            product: product,
            product_length: product_length,
            category,
          });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
