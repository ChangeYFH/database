const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
var fs = require("fs");

const { endpoint, key, databaseId, containerId } = config;

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const client = new CosmosClient({ endpoint, key });

const database = client.database(databaseId);

const container = database.container(containerId);

async function create(client, databaseId, containerId) {
  const partitionKey = config.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}

// Make sure Tasks database is already setup. If not, create it.
async function main(){
  await create(client, databaseId, containerId);

  if (process.argv[2] === "create") {
    const newItem = {
      id: "1",
      category: "txt",
      name: "lob",
      data: fs.readFileSync('data/input.txt').toString(),
      isComplete: false
    };
  
    const { resource: createdItem } = await container.items.create(newItem);
  
    console.log(`\r\nCreated new item: ${createdItem.id} - ${createdItem.description}\r\n`);
  }

  if (process.argv[2] === "query") {
    console.log(`Querying container: Items`);

    const querySpec = {
      query: `SELECT * from c`
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    items.forEach(item => {
      console.log(`${item.id} - ${item.data}`);
    });
  }

  if (process.argv[2] === "clear") {
    console.log(`Clearing container: Items`);
    const querySpec = {
      query: `SELECT * from c`
    };

    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();

    items.forEach(async item => {
      const { resource: result } = await container.item(item.id, item.category).delete();
      console.log(`Deleted item with id: ${item.id}`);
    });
  }
}

main();