const express = require("express");
const app = express();
const { createTodo, updateTodo } = require("./vTypes");
const { todo } = require("./Mango");
const cors = require("cors");
app.use(express.json());
app.use(cors(
    {
        origin: ["https://simple-todo-backend.vercel.app","http://localhost:5173"],
        methods : ["POST","GET","PUT"],
        credentials : true
    }
));
require('dotenv').config();
app.get("/", (req, res) => {
  res.json({
    msg: "server is live"
  });
});
const PORT = process.env.PORT || 4000;
app.get("/todos", async (req, res) => {
  const todos = await todo.find({});
  res.json({
    todos,
  });
});

app.post("/todo", async (req, res) => {
  const create = req.body;
  const pay = createTodo.safeParse(create);
  if (!pay.success) {
    res.status(411).json({
      msg: "wrong inputs",
    });
    return;
  }
  try {
    const newTodo = await todo.create({
      title: create.title,
      description: create.description,
      completed: false,
    });
    if (!newTodo) {
      res.status(404).json({
        msg: "Sorry cant create Todo",
      });
      return;
    }
    res.json({
      msg: "Todo created",
    });
  } catch (error) {
    console.log("Error creating Todo:", error);
  }
});

app.put("/delete", async (req, res) => {
  const update = req.body;
  const pay = updateTodo.safeParse(update);
  if (!pay.success) {
    res.status(411).json({
      msg: "wrong inputs",
    });
    return;
  }
  try {
    const uTodo = await todo.findByIdAndDelete({
      _id: req.body.id,
    });
    if (!uTodo) {
      res.status(404).json({
        msg: "Todo not Found",
      });
      return;
    }
    res.json({
      msg: " Todo marked as done",
    });
  } catch (error) {
    console.log("Error updating todo:", error);
  }
});
// app.delete("/delete",async (req,res)=>{
//     const update = req.body;
//     const pay = updateTodo.safeParse(update);
//     if(!pay.success){
//         res.status(411).json({
//             msg:"wrong inputs"
//         })
//         return;
//     }
//     try{
//     await todo.findByIdAndDelete({
//         _id : req.body.id
//     });
//     res.json({
//         msg:"A todo Deleted"
//     })
//     }
//     catch(error) {console.log("error deleting:",error)}
// })

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
