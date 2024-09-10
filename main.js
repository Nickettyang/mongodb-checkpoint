const { MongoClient } = require("mongodb");

async function run() {
  const uri = "mongodb://localhost:27017"; // Connection URI
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("contact");
    const collection = database.collection("contactlist");

    // 1. Insert documents
    await collection.insertMany([
      {
        last_name: "Ben",
        first_name: "Moris",
        email: "ben@gmail.com",
        age: 26,
      },
      {
        last_name: "Kefi",
        first_name: "Seif",
        email: "kefi@gmail.com",
        age: 15,
      },
      {
        last_name: "Emilie",
        first_name: "brouge",
        email: "emilie.b@gmail.com",
        age: 40,
      },
      { last_name: "Alex", first_name: "brown", age: 4 },
      { last_name: "Denzel", first_name: "Washington", age: 3 },
    ]);

    // 2. Display all contacts
    console.log("All contacts:");
    const allContacts = await collection.find().toArray();
    console.log(allContacts);

    // 3. Display all information about one person using their ID
    const person = await collection.findOne();
    const personId = person._id;
    console.log("Information about one person:");
    const personInfo = await collection.findOne({ _id: personId });
    console.log(personInfo);

    // 4. Display all contacts with age > 18
    console.log("Contacts with age > 18:");
    const contactsAgeOver18 = await collection
      .find({ age: { $gt: 18 } })
      .toArray();
    console.log(contactsAgeOver18);

    // 5. Display all contacts with age > 18 and name containing "ah"
    console.log("Contacts with age > 18 and name containing 'ah':");
    const contactsWithAh = await collection
      .find({
        age: { $gt: 18 },
        $or: [{ first_name: /ah/i }, { last_name: /ah/i }],
      })
      .toArray();
    console.log(contactsWithAh);

    // 6. Change the contact's first name from "Kefi Seif" to "Kefi Anis"
    await collection.updateOne(
      { first_name: "Seif", last_name: "Kefi" },
      { $set: { first_name: "Kefi Anis" } }
    );
    console.log("Updated contact:");
    const updatedContact = await collection
      .find({ first_name: "Kefi Anis" })
      .toArray();
    console.log(updatedContact);

    // 7. Delete contacts aged under 5
    await collection.deleteMany({ age: { $lt: 5 } });
    console.log("Contacts after deleting those under age 5:");
    const remainingContacts = await collection.find().toArray();
    console.log(remainingContacts);

    // 8. Display the final list of contacts
    console.log("Final contacts list:");
    const finalContactsList = await collection.find().toArray();
    console.log(finalContactsList);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
