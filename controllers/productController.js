const Product = require("../models/Product");

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Obtener un solo producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

// Crear un producto
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
};

// Mostrar el catálogo de productos
const showCatalog = async (req, res) => {
  try {
    const products = await Product.find();
    let productCards = "";
    products.forEach((product) => {
      productCards += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}" style="max-width:200px;">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <p>Precio: ${product.price}€</p>
          <a href="/catalog/${product._id}">Ver detalle</a>
        </div>
      `;
    });
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Catálogo de Productos</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
          <header>
              <h1>Tienda de Ropa</h1>
              <nav>
                  <a href="/dashboard">Dashboard</a>
              </nav>
          </header>
          <main>
              ${productCards}
          </main>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error al mostrar el catálogo de productos");
  }
};

// Mostrar el detalle de un producto
const showProductDetail = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Producto no encontrado");
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Detalle del Producto</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
          <header>
              <h1>${product.name}</h1>
              <nav>
                  <a href="/catalog">Volver al Catálogo</a>
              </nav>
          </header>
          <main>
              <img src="${product.image}" alt="${product.name}" style="max-width:300px;">
              <p>${product.description}</p>
              <p>Precio: ${product.price}€</p>
              <p>Categoría: ${product.category}</p>
              <p>Talla: ${product.size}</p>
          </main>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error al mostrar el detalle del producto");
  }
};

// Dashboard del administrador (lista de productos con opciones)
const showDashboard = async (req, res) => {
  try {
    const products = await Product.find();
    let productList = "";
    products.forEach((product) => {
      productList += `
        <div class="dashboard-product">
          <h2>${product.name}</h2>
          <p>Precio: ${product.price}€</p>
          <a href="/dashboard/${product._id}/edit">Editar</a>
          <form action="/dashboard/${product._id}/delete" method="POST" style="display:inline;">
            <button type="submit">Eliminar</button>
          </form>
        </div>
      `;
    });
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Dashboard Admin</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
          <header>
              <h1>Dashboard del Administrador</h1>
              <nav>
                  <a href="/dashboard/new">Agregar Nuevo Producto</a>
                  <a href="/catalog">Ver Catálogo</a>
              </nav>
          </header>
          <main>
              ${productList}
          </main>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error al cargar el dashboard");
  }
};

//formulario para crear un nuevo producto
const showNewProductForm = (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Nuevo Producto</title>
        <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
        <h1>Agregar Nuevo Producto</h1>
        <form action="/dashboard" method="POST">
            <input type="text" name="name" placeholder="Nombre" required><br>
            <textarea name="description" placeholder="Descripción" required></textarea><br>
            <input type="text" name="image" placeholder="URL de imagen" required><br>
            <select name="category" required>
                <option value="Camisetas">Camisetas</option>
                <option value="Pantalones">Pantalones</option>
                <option value="Zapatos">Zapatos</option>
                <option value="Accesorios">Accesorios</option>
            </select><br>
            <select name="size" required>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select><br>
            <input type="number" name="price" placeholder="Precio" step="0.01" required><br>
            <button type="submit">Crear Producto</button>
        </form>
    </body>
    </html>
  `;
  res.send(html);
};

// Crear producto desde formulario del dashboard 
const createProductFromForm = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Error al crear el producto en el dashboard");
  }
};

// Mostrar formulario para editar un producto
const showEditProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Producto no encontrado");
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <title>Editar Producto</title>
          <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
          <h1>Editar Producto</h1>
          <form action="/dashboard/${product._id}/edit" method="POST">
              <input type="text" name="name" value="${product.name}" required><br>
              <textarea name="description" required>${product.description}</textarea><br>
              <input type="text" name="image" value="${product.image}" required><br>
              <select name="category" required>
                  <option value="Camisetas" ${product.category === "Camisetas" ? "selected" : ""}>Camisetas</option>
                  <option value="Pantalones" ${product.category === "Pantalones" ? "selected" : ""}>Pantalones</option>
                  <option value="Zapatos" ${product.category === "Zapatos" ? "selected" : ""}>Zapatos</option>
                  <option value="Accesorios" ${product.category === "Accesorios" ? "selected" : ""}>Accesorios</option>
              </select><br>
              <select name="size" required>
                  <option value="XS" ${product.size === "XS" ? "selected" : ""}>XS</option>
                  <option value="S" ${product.size === "S" ? "selected" : ""}>S</option>
                  <option value="M" ${product.size === "M" ? "selected" : ""}>M</option>
                  <option value="L" ${product.size === "L" ? "selected" : ""}>L</option>
                  <option value="XL" ${product.size === "XL" ? "selected" : ""}>XL</option>
              </select><br>
              <input type="number" name="price" value="${product.price}" step="0.01" required><br>
              <button type="submit">Actualizar Producto</button>
          </form>
      </body>
      </html>
    `;
    res.send(html);
  } catch (error) {
    res.status(500).send("Error al cargar el formulario de edición");
  }
};

// Actualizar producto desde formulario del dashboard (HTML)
const updateProductFromForm = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Error al actualizar el producto en el dashboard");
  }
};

// Eliminar producto desde el dashboard (HTML)
const deleteProductFromForm = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (error) {
    res.status(500).send("Error al eliminar el producto en el dashboard");
  }
};

module.exports = {
  // API endpoints (JSON)
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  // Vistas públicas (HTML)
  showCatalog,
  showProductDetail,
  // Dashboard (HTML)
  showDashboard,
  showNewProductForm,
  createProductFromForm,
  showEditProductForm,
  updateProductFromForm,
  deleteProductFromForm,
};