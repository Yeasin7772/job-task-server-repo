const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o2tazeo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const jobTaskCollection = client.db("jobtask").collection("job");
    const benefitCollection = client.db("jobtask").collection("benefit");



    // post method
    app.post("/job", async (req, res) => {
      const item = req.body;
      const result = await jobTaskCollection.insertOne(item);
      res.send(result);
    });


    //  get method
    app.get("/job", async (req, res) => {
      const result = await jobTaskCollection.find().toArray();
      res.send(result);
    });

    app.get("/benefit", async (req, res) => {
      const result = await benefitCollection.find().toArray();
      res.send(result);
    });

    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobTaskCollection.findOne(query);
      res.send(result);
    });
    

    // deleted method 

    app.delete("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobTaskCollection.deleteOne(query);
      res.send(result);
    });



    app.patch("/job/:id", async (req, res) => {
      const taskData = req.body;
      console.log(taskData);

      const taskId = req.params.id;
      

      const query = { _id: new ObjectId(taskId) };
      console.log(query);

      const editTask = {
          $set: {
              title: taskData.title,
              category: taskData.category,
              date: taskData.date,
              description: taskData.description,
              userEmail: taskData.userEmail,
          },
      };

      try {
          const result = await jobTaskCollection.updateOne(query, editTask);

          if (result.modifiedCount > 0) {
              res.json({ modifiedCount: result.modifiedCount });
          } else {
              res.status(404).json({ message: 'Task not found or no changes applied' });
          }
      } catch (error) {
          console.error('Error updating task:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  });



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Job Task Server Running");
});
app.listen(port, () => {
  console.log(`Job Task Server Running Port ${port}`);
});
