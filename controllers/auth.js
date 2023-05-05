const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    // Check user
    const { username, password } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("User Already exists");
    }
    const salt = await bcrypt.genSalt(10);
    user = new User({
      username,
      password,
    });

    //Encrypt เข้ารหัส
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.send("register success !");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOneAndUpdate({ username }, { new: true });
    if (user && user.enabled) {
      // Check Password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send("Password is Invalid !!");
      }

      // Payload
      const payload = {
        user: {
          username: user.username,
          role: user.role,
          _id : user._id
        },
      };

      // Generate Token
      jwt.sign(payload, "jwtSecret", { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token, payload });
      });
    } else {
      return res.status(400).send("User Not Found!!!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.currentUser = async (req, res) => {
  try {
    // console.log('Controller', req.user)

    const user = await User.findOne({ username: req.user.username })
      .select("-password")
      .exec();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.listUser = async (req, res) => {
  try {
    res.send("list Get User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.editUser = async (req, res) => {
  try {
    res.send("Edit User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    res.send("Delete User");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error !");
  }
};
