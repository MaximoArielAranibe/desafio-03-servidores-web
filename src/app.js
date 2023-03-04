import express from "express";
import ProductManager from "./productManager.js";

const manager = new ProductManager("src/json/productos.json");

const app = express();

express.urlencoded({ extended: true });

app.get('/products', async (req, res) => {


	const { limit } = req.query

  const products = await manager.read();

	const productLimit = products.slice(0,limit);


	if (!limit) {
		res.send({products})
	} else {
		res.send({productLimit})
	}
});

app.get('/products/:pid', async (req,res) => {
	const pid = req.params.pid;
	const products = await manager.read();
	const productFind = products.find(e => e.id == pid);
	
	if(!productFind){
		return res
		.status(404)
		.send({error: `No existe el usuario con ID ${req.params.pid}`})
	}else{
		res.json({productFind})
	}
})

/* app.get("/productos", async (req, res) => {
  const limit = req.query;
  const products = await manager.read();

  if (!limit == 0 || "") {
    res.send({ products });
  } else {
    const productLimit = products.filter(e=>e.id == limit);
		res.send({productLimit})
  }
});

app.get("/productos/:pid",async (req,res) => {
	const id = req.params.pid;
	const products = await manager.read();

	
}) */

app.listen(8080, () => {
  console.log("Listening server on port 8080");
});
