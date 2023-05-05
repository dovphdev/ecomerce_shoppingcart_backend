const bcrypt = require("bcryptjs");

//Models
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const jwt = require("jsonwebtoken");

exports.listUsers = async (req, res) => {
  try {
    //Code
    const user = await User.find({}).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.readUsers = async (req, res) => {
  try {
    //Code
    const id = req.params.id;
    const user = await User.findOne({ _id: id }).select("-password").exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.updateUsers = async (req, res) => {
  try {
    //Code
    let { id, password } = req.body.values;
    // 1 gen salt
    const salt = await bcrypt.genSalt(10);
    // 2 encrypt
    let enPassword = await bcrypt.hash(password, salt);

    const user = await User.findOneAndUpdate(
      { _id: id },
      { password: enPassword }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.removeUsers = async (req, res) => {
  try {
    //Code
    const id = req.params.id;
    const user = await User.findOneAndDelete({ _id: id });
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.changeStatus = async (req, res) => {
  try {
    //Code
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { enabled: req.body.enabled }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.changeRole = async (req, res) => {
  try {
    //Code
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { role: req.body.role }
    );
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;
    //check user
    let user = await User.findOne({ username: req.user.username }).exec();
    // สร้าง array [] จากนั้น loopเสร็จ จะได้ [{1}] รอบต่อไปก็จะเป็น [{1},{2}]
    let products = [];
    // Check ตระกร้าสินค้าอันเก่า
    let cartOld = await Cart.findOne({ orderedBy: user._id }).exec();
    if (cartOld) {
      await cartOld.deleteOne();
    }

    //แต่งสินค้า
    for (let i = 0; i < cart.length; i++) {
      let object = {};

      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.price = cart[i].price;

      // {1} push in products , {2} ....
      products.push(object);
    }

    // หาผลรวมของตะกร้า
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }

    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();

    console.log(newCart);
    // console.log(req.body)
    res.send("User Cart OK");
  } catch (err) {
    console.log(err);
    res.status(500).send("User Cart Sever Error!");
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();

    let cart = await Cart.findOne({ orderedBy: user._id })
      .populate("products.product", "_id title price")
      .exec();

    const { products, cartTotal } = cart;

    res.json({ products, cartTotal });
  } catch (err) {
    res.status(500).send("getUserCart Error !");
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();

    const empty = await Cart.findOneAndRemove({orderedBy: user._id}).exec()

    res.send(empty)
  } catch (err) {
    res.status(500).send("RemoveCart Error !");
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const userAdress = await User.findOneAndUpdate(
      { username: req.user.username },
      { address: req.body.address }
    ).exec();

    res.json({ ok: true });
  } catch (err) {
    res.status(500).send("Save Address Error !");
  }
};

exports.saveOrder = async (req, res) => {
  try {
    let user = await User.findOne({ username: req.user.username }).exec();

    let userCart = await Cart.findOne({orderedBy: user._id}).exec()

    let order = await new Order({
      products: userCart.products,
      orderedBy: user._id,
      cartTotal: userCart.cartTotal
    }).save()

    // + / - product
    let bulkOption = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id},
          update: { $inc: {quantity: -item.count, sold: +item.count}}
        }
      }
    })

    let updated = await Product.bulkWrite(bulkOption, {})

    res.send(updated);
  } catch (err) {
    res.status(500).send("Save Order Error !");
  }
};

exports.getOrder = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).exec();

    let order = await Order.find({ orderedBy: user._id })
      .populate("products.product")
      .exec();

    res.json(order);
  } catch (err) {
    res.status(500).send("get Orders Error !");
  }
};

exports.addToWishList = async (req, res) => {
  try {
    const { productId } = req.body
    let user = await User.findOneAndUpdate(
      {username: req.user.username}, //ค้นหาอะไร
      {$addToSet: {wishlist: productId}} //อัพเดทอะไร
    ).exec()

    res.send(user)

  } catch (err) {
    res.status(500).send('Add to wishlist Error !')
  }
}

exports.getWishList = async (req, res) => {
  try {
    let list = await User.findOne({username: req.user.username})
    .select('wishlist')
    .populate('wishlist')
    .exec()

    res.json(list)

    
  } catch (err) {
    res.status(500).send('Get wishlist Error !')
  }
}

exports.removeWishList = async (req, res) => {
  try {
    // https://localhost/user/wishlist/168165435 (id)
    const { productId } = req.params
    let user = await User.findOneAndUpdate(
      {username: req.user.username},
      {$pull: {wishlist: productId}}
    )

    res.send(user)
  } catch (err) {
    res.status(500).send('Remove wishlist Error !')
  }
}