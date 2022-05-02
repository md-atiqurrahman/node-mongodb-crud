const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


//uses middleware
app.use(cors());
app.use(express.json());

// user: dbuser1
//password: RyGnATEyKduL18fv



const uri = "mongodb+srv://dbuser1:RyGnATEyKduL18fv@cluster0.crpj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();

      const userCollection = client.db("foodExpress").collection("user");

      app.get('/user', async (req, res) =>{
        const query = {};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
      })
      
      app.get('/user/:id', async(req , res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result)
      })
      
      app.post('/user', async (req , res) =>{
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        console.log(`new user added with id: ${result.insertedId}`)
        res.send(newUser);
      });
      
      app.delete('/user/:id', async (req, res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);
      })

      app.put('/user/:id', async(req , res) =>{
        const id = req.params.id;
        const updateUser = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };

        const updateDoc = {
          $set: {
            name: updateUser.name,
            email: updateUser.email,
          }
        }
        const result = await userCollection.updateOne(filter, updateDoc,options)
        res.send(result)
      })
    }
    finally{
      // await client.close();
    }
}

run().catch(console.dir);


app.get('/' ,(req , res) =>{
    res.send('My first Node Curd with MongoDB');
})

app.listen(port, () =>{
    console.log('Example for listening on port' , port)
})