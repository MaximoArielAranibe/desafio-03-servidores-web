import fs from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }

  writeNewFile = async () => {
    return await fs.promises.writeFile(this.path, "[]");
  };

  getNewID = (list) => {
    const count = list.length;
    return count > 0 ? list[count - 1].id + 1 : 1;
  };

  add = async (title, description, price, thumbnail, code, stock) => {
    const list = await this.get();
    const newID = this.getNewID(list);
    const exis = list.some((el) => el.code == code);
    if (!exis) {
      const newProduct = {
        id: newID,
        title: title ?? "",
        description: description ?? "",
        price: price ?? 0.0,
        thumbnail: thumbnail ?? [],
        code: code ?? "",
        stock: stock ?? 0,
      };
      list.push(newProduct);
      await this.write(list);
      //return newProduct;
    }
    return { error: `code: ${code} already exists` };
  };

  read = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises
        .readFile(this.path, this.format)
        .then((r) => JSON.parse(r));
    } else {
      return [];
    }
  };

  write = async (list) => {
    fs.promises.writeFile(this.path, JSON.stringify(list));
  };

  get = async () => {
    const list = await this.read();
    return list;
  };

  getbyId = async (id) => {
    const list = await this.get();
    return list.find((prod) => prod.id == id);
  };

  async updateProduct(id, newProps) {
    try {
      const products = await this.get();
      const index = products.findIndex((elem) => elem.id === id);
      if (index === -1) {
        return "Product to update not found";
      }
      products[index] = Object.assign(products[index], newProps);
      return await fs.promises.writeFile(this.path, JSON.stringify(products));
    } catch (e) {
      return { Error: e };
    }
  }

  delete = async (id) => {
    const list = await this.get();
    const idx = list.findIndex((e) => e.id == id);
    if (idx < 0) return;
    list.splice(idx, 1);
    await this.write(list);
    return list;
  };
}

const manager = new ProductManager("src/json/productos.json");
async function run() {
  manager.writeNewFile(); //Crea archivo con el path pasado en manager

  console.log(
    await manager.add(
      "Producto prueba",
      "Producto descripcion",
      200,
      "No tiene",
      "abc123",
      25
    )
  );

  console.log(
    await manager.add(
      "Producto prueba",
      "Producto descripcion",
      200,
      "No tiene",
      "abc12443",
      25
    )
  );
}

console.log(await manager.read());

export default ProductManager;
