const admin = require('../config/firebase');

const showLogin = (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Login</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <h1>Iniciar Sesión</h1>
      <form action="/login" method="POST">
        <input type="email" name="email" placeholder="Email" required /><br>
        <input type="password" name="password" placeholder="Password" required /><br>
        <button type="submit">Login</button>
      </form>
    </body>
    </html>
  `;
  res.send(html);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'password') {
    req.session.user = { email };
    return res.redirect('/dashboard');
  }
  res.status(401).send('Credenciales inválidas');
};
const logout = (req, res) => {
  req.session = null;
  res.redirect('/login');
};

module.exports = {
  showLogin,
  login,
  logout,
};