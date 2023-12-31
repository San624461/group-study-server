const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uvivufz.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();


        const AssignmentsCollection = client.db('assignmentsDb').collection('assignment')
const submittedCollections = client.db('submittedAssignments').collection('submitted')

const fakeDataCollection = client.db('fakeData').collection('Featured')
        // created assignmentd by users
        app.post('/createdAssignments', async (req, res) => {
            const newAssignment = req.body
            console.log(newAssignment);
            const result = await AssignmentsCollection.insertOne(newAssignment)
            res.send(result)
        })

        // getting all assignments
        app.get('/createdAssignments', async (req, res) => {
            const cursor = await AssignmentsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })


        // delete one assignment based on one's email from all assignment
        app.delete('/createdAssignments/:id', async (req, res) => {
            const id = req.params.id

            const query = { _id: new ObjectId(id) }
            const result = await AssignmentsCollection.deleteOne(query)
            res.send(result)
        })
        // getting the all assignment  users created

        app.get('/createdAssignments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await AssignmentsCollection.findOne(query)
            res.send(result)
        })

        // users can update on hitting this api

        app.put('/createdAssignments/:id',async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedAssignment = req.body
            const assignment = {
                $set: {
                    title: updatedAssignment.title,
                    description: updatedAssignment.description,
                    thumbnail: updatedAssignment.thumbnail,
                    fullMarks: updatedAssignment.fullMarks,
                    level: updatedAssignment.level,
                    date: updatedAssignment.date
                }
            }

            const result = await AssignmentsCollection.updateOne(filter, assignment, options)
            res.send(result)
        })

        // submission posting 
        app.post('/submittedAssignments', async (req, res) => {
            const submittedAssignment = req.body

            const result = await submittedCollections.insertOne(submittedAssignment)
            res.send(result)
        })

        //getting the submitted assignments
        app.get('/submittedAssignments', async(req,res)=>{
            const cursor = await submittedCollections.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // individual submitted assignment page 
        app.get('/submittedAssignments/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await submittedCollections.findOne(query)
            res.send(result)
        })

        //updating marks and feedback

        app.put('/submittedAssignments/:id',async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedAssignment = req.body
            const assignment = {
                $set: {
                
                    status : updatedAssignment.status,
                    marks: updatedAssignment.marks,
                    marks: updatedAssignment.marks,
                    feedback: updatedAssignment.feedback
                }
            }

            const result = await submittedCollections.updateOne(filter, assignment, options)
            res.send(result)
        })

        app.get('/featured', async(req,res)=>{
            const cursor =  fakeDataCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('group study is running')
})

app.listen(port, () => {
    console.log(`Group study is running on port ${port}`);
})