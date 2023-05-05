const Rating = require('../models/Rating')

exports.index = async (req, res) => {
    try {
      //Code
      const { star, ratingBy, product  } = req.body
      const s =  Rating.find()
      if (star) {
        s.where({star})
      }
      if (ratingBy) {
        s.where({ratingBy})
      }
      if (product) {
        s.where({product})
      }
      s.populate(['product', 'user'])
      res.send(await s.exec());
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error !");
    }
  };

  exports.show = async (req, res) => {
    try {
      //Code
      const user = await User.find({}).exec();
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error !");
    }
  };


exports.create = async (req,res) => {
    try {
        const { star, ratingBy, product  } = req.body
        console.log(req.body)
        const rating = await new Rating({
            star, 
            ratingBy,
            product}).save()
        res.send(rating)
    } catch (err) {
        res.status(500).send('Server Error!!')        
    }
}


exports.update = async (req, res) => {
    try {
      //Code
      const user = await User.find({}).exec();
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error !");
    }
  };
exports.remove = async (req, res) => {
    try {
      //Code
      const user = await User.find({}).exec();
      res.send(user);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error !");
    }
  };