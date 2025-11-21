const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7i9hgzt.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});



async function run() {
  try {
    await client.connect();

    const db = client.db('finease_db');
    const trancollections = db.collection('transactions');

    // get
    app.get('/transactions', verifyToken, async (req, res) => {
      const { email } = req.query;

      let filter = {};
      if (email) { filter.email = email; }

      const result = await trancollections.find(filter).sort({ date: -1 }).toArray();
      res.send(result);
    });

    // get
    app.get('/transactions/:id', async (req, res) => {
      const { id } = req.params;
      const result = await trancollections.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    // updateone
    app.put('/transaction/update/:id', verifyToken, async (req, res) => {
      const { id } = req.params;
      const data = req.body;

      const update = {
        $set: data
      };
      const result = await trancollections.updateOne({ _id: new ObjectId(id) }, update);

      res.send({
        success: true,
        result
      });
    });

    // add
    app.post('/transaction', verifyToken, async (req, res) => {
      const data = req.body;
      const result = await trancollections.insertOne(data);

      res.send({
        success: true,
        result
      });
    });

        // delete
    app.delete('/transactions/:id', async (req, res) => {
      const { id } = req.params;
      const result = await trancollections.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });


    // DB Connection check
    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
