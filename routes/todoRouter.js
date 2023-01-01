const express = require("express");
const router = express.Router();
const TodoList = require("../model/todo");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.PRIVATE_KEY || "1234noormohammed@encoded";

//! Below middleware is to check the user is authenticated user or not

const tokenAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).json({
      status: "Failed",
      message: "Token missing",
    });
  }
  try {
    const response = jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: "Failed",
          message: "Not a valid token",
        });
      }
      req.loggedIn_email = decoded.data;
      next();
    });
  } catch (err) {
    return res.status(401).json({
      status: "Failed",
      message: "Interval server Error" + err.message,
    });
  }
};

//! Method to get the data this route
router.get("/", tokenAuth, async (req, res) => {
  try {
    const todos = await TodoList.find({ email: req.loggedIn_email });
    res.status(200).json({
      status: "Success",
      todos,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
      todos: [],
    });
  }
});

//!Method to post the data
router.post("/", tokenAuth, async (req, res) => {
  try {
    req.body.email = req.loggedIn_email;
    const todos = await TodoList.create(req.body);
    res.json({
      status: "Success",
      todos,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

//!Method to update the data
router.put("/:todo_id", tokenAuth, async (req, res) => {
  try {
    const data = await TodoList.findOne({ orderId: req.params.order_id });
    //* checking the user email is entered same or not.
    if (data.email !== req.loggedIn_email) {
      return res.status(401).json({
        status: "Failed",
        message: "Not Authorized",
      });
    }
    const todos = await TodoList.updateOne(
      { todoId: req.params.todo_id },
      updateData
    );
    res.json({
      status: "Success",
      todos,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

//!Method to delete the data
router.delete("/", tokenAuth, async (req, res) => {
  try {
    const data = await Order.findOne({ id: req.params.id });
    //* checking the user email is entered same or not.
    if (data.email !== req.loggedIn_email) {
      return res.status(401).json({
        status: "Failed",
        message: "Not Authorized",
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

router.use("*", (req, res) => {
  res.status(500).send("Invalid Url");
});

module.exports = router;
