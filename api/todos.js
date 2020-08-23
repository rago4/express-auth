const express = require("express");
const Todo = require("../schemas/Todo");

const app = express();

app.get("/todos", async (req, res) => {
  const user = req.user.sub;
  const data = await Todo.find({ user });

  res.json({ data, message: "Todos fetched successfully" });
});

app.post("/todos", async (req, res) => {
  try {
    const user = req.user.sub;
    const { title = "" } = req.body;

    if (!title.length) {
      return res.status(400).json({
        message: "Todo's title can not be empty",
      });
    }

    const newTodo = new Todo({ user, title });
    await newTodo.save();

    res.status(201).json({
      data: newTodo,
      message: "New todo item created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = app;
