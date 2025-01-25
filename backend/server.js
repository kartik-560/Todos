const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 

const todoSchema = new mongoose.Schema({
  sno: Number,
  title: String,
  desc: String
});

mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Todo = mongoose.model('Todo', todoSchema);


app.get('/', (req, res) => {
  res.send('API is running');
});


app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).send('Error fetching todos');
  }
});


app.post('/api/todos', async (req, res) => {
  const { sno, title, desc } = req.body;
  const newTodo = new Todo({ sno, title, desc });

  try {
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(500).send('Error saving todo');
  }
});


app.delete('/api/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (deletedTodo) {
      res.json(deletedTodo);
    } else {
      res.status(404).send('Todo not found');
    }
  } catch (error) {
    res.status(500).send('Error deleting todo');
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
