const express = require('express')
const cors= require('cors')
const bodyParser = require('body-parser')

const port=5000;
const password='sharif123456';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ecommerceUser:sharif123456@cluster0.taqt5.mongodb.net/ema-john-site-data?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.get('/', (req, res) =>{
    res.send('Hello Ema John')
})

//database connection.

client.connect(err => {
  const productCollection = client.db("ema-john-site-data").collection("products");
  const orderCollection = client.db("ema-john-site-data").collection("orders");
   app.post('/addProduct',(req, res) =>{
       const product=req.body;
       console.log(product)
        productCollection.insertOne(product)
       .then(result=>{
           console.log(result)
          res.send(result.insertedCount)
     })
   })

   app.post('/orders',(req, res) =>{
    const order=req.body;
    
    orderCollection.insertOne(order)
    .then(result=>{
        console.log(result)
       res.send(result.insertedCount>0)
  })
})

   app.get('/products', (req, res)=>{
     productCollection.find({})
     .toArray((err,documents)=>{
       res.send(documents)
     })
       
     })

     app.get('/product/:key', (req, res)=>{
      productCollection.find({key:req.params.key})
      .toArray((err,documents)=>{
        res.send(documents[0])
      })
        
      })

      app.post('/productByKey', (req, res)=>{
        const products=req.body
        productCollection.find({key:{$in:products}})
        .toArray((err,documents)=>{
          res.send(documents)
        })
          
        })
     
   })
   
 
 

app.listen(port)