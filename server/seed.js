import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGO_CONNECT);
await client.connect();

const mongo = client.db("vibe-marketplace");

await mongo.collection("components").deleteOne({ slug: "counter-card" });
await mongo.collection("components").insertOne({
  slug: "counter-card",
  html: `<component><script type="module">
  import component from 'https://vibe-marketplace.korte.kim/lib/vibe/component.js';
  component({ count: 0 });
</script>

  <h3>@[label]</h3>
  <p>Count: <span result>@[this.count]</span></p>
  <row>
    <button secondary onclick="this.count++">+</button>
    <button secondary onclick="this.count--">-</button>
    <button secondary onclick="this.count = 0">Reset</button>
  </row>
  <p><small>Each instance has isolated state</small></p>
</component>`,
  published: true,
  created_at: new Date(),
});

console.info("Seeded counter-card");
await client.close();
