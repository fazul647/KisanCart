// controllers/productController.js
exports.getRecommendations = async (req, res) => {
    const { cropName, location, price, productId } = req.query;
  
    const recommendations = await Product.find({
      _id: { $ne: productId },          // exclude main product
      cropName: cropName,               // same crop
      location: location,               // same location
      price: { $gte: price - 10, $lte: price + 10 } // similar price
    }).limit(6);
  
    res.json(recommendations);
  };
  