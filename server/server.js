const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
const port = 5000;

// Example parts used to seed the database, and served from memory
// whenever MongoDB is not running so the demo still works
const exampleParts = [
    { name: "Ryzen 7 9800X3D", category: "Processor", brand: "AMD", price: 479, stock: 15, specs: "8 Cores / 16 Threads, 96MB 3D V-Cache, up to 5.2 GHz" },
    { name: "Core i9-14900K", category: "Processor", brand: "Intel", price: 549, stock: 10, specs: "24 Cores (8P + 16E), up to 6.0 GHz" },
    { name: "RTX 5070 Ti Gaming OC", category: "Graphics Card", brand: "Gigabyte", price: 899, stock: 8, specs: "16GB GDDR7, PCIe 5.0, 256-bit" },
    { name: "Radeon RX 9070 XT", category: "Graphics Card", brand: "Sapphire", price: 699, stock: 12, specs: "16GB GDDR6, RDNA 4" },
    { name: "Trident Z5 RGB 32GB", category: "RAM", brand: "G.Skill", price: 129, stock: 40, specs: "2 x 16GB DDR5-6000, CL30" },
    { name: "990 PRO 2TB", category: "Storage", brand: "Samsung", price: 179, stock: 25, specs: "PCIe 4.0 NVMe SSD, 7450 MB/s read" },
    { name: "ROG Strix Z790-E", category: "Motherboard", brand: "Asus", price: 499, stock: 6, specs: "LGA1700, DDR5, WiFi 6E, PCIe 5.0" },
    { name: "RM1000x SHIFT", category: "Power Supply", brand: "Corsair", price: 199, stock: 18, specs: "1000W, 80+ Gold, Fully Modular" },
    { name: "H7 Flow", category: "Cabinet", brand: "NZXT", price: 109, stock: 22, specs: "Mid Tower, Mesh Front Panel, Tempered Glass" },
    { name: "Kraken 280 Elite", category: "Cooler", brand: "NZXT", price: 189, stock: 14, specs: "280mm AIO Liquid Cooler, LCD Display" }
];

// In-memory fallback store while MongoDB is not connected
let mongoConnected = false;
let memoryParts = exampleParts.map((part, index) => ({ _id: String(index + 1), ...part }));
let nextMemoryId = memoryParts.length + 1;
let memoryMessages = [];
let nextMessageId = 1;

async function connectToMongoDb() {

    try {

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        mongoConnected = true;
        console.log("Connection successfully done with mongodb");

    } catch (error) {

        mongoConnected = false;
        console.log("Connection failed to mongodb : " + error.message);
        console.log("Serving example parts from memory. Start MongoDB on localhost:27017 to store data permanently.");
    }

}

app.listen(port, () => {

    console.log("Server started at port : " + port);
    connectToMongoDb();

    // Keep retrying so the server switches to MongoDB as soon as it starts
    setInterval(async () => {

        if (!mongoConnected) {
            await connectToMongoDb();
        }

    }, 5000);
});

const myDb = client.db("flexiDB");
const parts = myDb.collection("parts");
const messages = myDb.collection("messages");

app.get("/", (req, res) => {

    res.send({ msg: "Welcome to FLEXI PC Parts API", mongo: mongoConnected });
});

// Seed the parts with example data (only inserts if the collection is empty)
app.get("/seed", async (req, res) => {

    if (!mongoConnected) {

        res.send({ msg: "MongoDB not running - example parts are already available from memory" });
        return;
    }

    const count = await parts.countDocuments();

    if (count > 0) {

        res.send({ msg: "Parts already seeded", count: count });
        return;
    }

    const response = await parts.insertMany(exampleParts);

    res.send(response);
});

app.get("/getall", async (req, res) => {

    if (!mongoConnected) {

        res.send([...memoryParts].sort((a, b) => b.price - a.price));
        return;
    }

    let data = await parts.find().sort({ price: -1 }).toArray();

    res.send(data);
});

app.get("/get/:id", async (req, res) => {

    const id = req.params.id;

    if (!mongoConnected) {

        res.send(memoryParts.find((part) => part._id === id) || null);
        return;
    }

    const part = await parts.findOne({ _id: new ObjectId(id) });

    res.send(part);
});

app.get("/category/:name", async (req, res) => {

    const name = req.params.name;

    if (!mongoConnected) {

        res.send(memoryParts.filter((part) => part.category === name));
        return;
    }

    let data = await parts.find({ category: name }).toArray();

    res.send(data);
});

app.post("/create", async (req, res) => {

    console.log(req.body);

    const { name, category, brand, price, stock, specs } = req.body;

    if (!name || !category || !brand || price == null) {

        res.status(422).send({ msg: "name, category, brand and price are required" });
        return;
    }

    const newPart = { name: name, category: category, brand: brand, price: Number(price), stock: Number(stock) || 0, specs: specs || "" };

    if (!mongoConnected) {

        newPart._id = String(nextMemoryId++);
        memoryParts.push(newPart);

        res.send({ acknowledged: true, insertedId: newPart._id, memory: true });
        return;
    }

    const response = await parts.insertOne(newPart);

    res.send(response);
});

app.put("/update/:id", async (req, res) => {

    const id = req.params.id;

    if (!mongoConnected) {

        const part = memoryParts.find((part) => part._id === id);

        if (part == null) {

            res.status(404).send({ msg: "Part Id Invalid" });
            return;
        }

        const { price, stock } = req.body;

        if (price != null) part.price = Number(price);
        if (stock != null) part.stock = Number(stock);

        res.send({ acknowledged: true, matchedCount: 1, memory: true });
        return;
    }

    const part = await parts.findOne({ _id: new ObjectId(id) });

    if (part != null) {

        const { price, stock } = req.body;

        const updateFields = {};

        if (price != null) updateFields.price = Number(price);
        if (stock != null) updateFields.stock = Number(stock);

        const response = await parts.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

        res.send(response);
    }
    else {

        res.status(404).send({ msg: "Part Id Invalid" });
    }

});

app.delete("/delete/:id", async (req, res) => {

    const id = req.params.id;

    if (!mongoConnected) {

        const before = memoryParts.length;
        memoryParts = memoryParts.filter((part) => part._id !== id);

        res.send({ acknowledged: true, deletedCount: before - memoryParts.length, memory: true });
        return;
    }

    const response = await parts.deleteOne({ _id: new ObjectId(id) });

    res.send(response);
});

// Contact form : saves enquiries into the messages collection
app.post("/contact", async (req, res) => {

    const { name, email, message } = req.body;

    if (!name || !email || !message) {

        res.status(422).send({ msg: "name, email and message are required" });
        return;
    }

    if (!mongoConnected) {

        memoryMessages.push({ _id: String(nextMessageId++), name: name, email: email, message: message, createdAt: new Date() });

        res.send({ acknowledged: true, insertedId: String(nextMessageId - 1), memory: true });
        return;
    }

    const response = await messages.insertOne({ name: name, email: email, message: message, createdAt: new Date() });

    res.send(response);
});

app.get("/messages", async (req, res) => {

    if (!mongoConnected) {

        res.send([...memoryMessages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        return;
    }

    let data = await messages.find().sort({ createdAt: -1 }).toArray();

    res.send(data);
});
