const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
require('dotenv').config()
const app = express();


const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbvqn67.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   

    const carftCollection = client.db('carftDB').collection('carft')
    const categoryCollection = client.db('carftDB').collection('craftCategory')



    // read data 
    app.get('/carft',async(req,res)=>{
        const cursor = carftCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    // update craft id
    app.get('/carft/:id',async(req,res)=>{
        const id = req.params.id
        const query = {_id: new ObjectId (id)}
        const result =  await carftCollection.findOne(query)
        res.send(result)
    })

    
    // user add carft 
    app.get('/craftlist/:email',async(req,res)=>{
      console.log(req.params.email)
      const result = await carftCollection.find({ email: req.params.email}).toArray()
      res.send(result)
    })
  



     // carft category_name 

    
    app.get('/craftlist/:subcategory_Name',async(req,res)=>{
      console.log(req.params.subcategory_Name)
      const result = await categoryCollection.find({ subcategory_Name: req.params.subcategory_Name}).toArray()
      res.send(result)
    })

 
    



    app.post('/carft', async(req,res)=>{
        const newCarft = req.body;
        console.log(newCarft)

        const result = await carftCollection.insertOne(newCarft);
        res.send(result)
    })



    // delete craft item api
    app.delete('/carft/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId  (id)}
      const result = await carftCollection.deleteOne(query)
      res.send(result)

    })


    // update craft item api
    app.put('/carft/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId  (id)}
      const options = {upsert: true}
      const updateCraft = req.body;
      const craftItem = {
        $set:{
          image:updateCraft.image , item:updateCraft.item , subcategory:updateCraft.subcategory , description:updateCraft.description , price:updateCraft.price , rating:updateCraft.rating , customization:updateCraft.customization , stockStatus:updateCraft.stockStatus , processing:updateCraft.processing ,
        }
      }
      const result = await carftCollection.updateOne(filter,craftItem,options)
      res.send(result)
     
    })






    // Send a ping to confirm a successful connection
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('art server is running')
})

app.listen(port,()=>{
    console.log(`server is running this port: ${port}`)
})