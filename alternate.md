### Connection using MySQL Package:

Following code is way to establish connection with mysql using `mysql` package.

```sql
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'codechit_db',
});

connection.connect((err) => {
  if (err) {
    console.warn(err);
  } else {
    console.log('connected');
    createTable();
  }
});

function createTable() {
  const createTableSql = `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  connection.query(createTableSql, (err, result) => {
    if (err) {
      console.warn('Error creating table:', err);
    } else {
      console.log('Table created successfully');
    }
    connection.end(); // Close the connection when you're done
  });
}
```

### Using creatPool

If you're using `createConnection` method in that case you have to establish and end connection each and every time when you do any sort of operation... to overcome this we've something called pooling which you can implement using `createPool`:

```sql
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '12345678',
  database: 'codechit_db',
  connectionLimit: 10,
});

function createTable() {
  const createTableSql = `
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    );
  `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.warn('Error getting connection:', err);
      return;
    }

    connection.query(createTableSql, (err, result) => {
      connection.release(); // Release the connection back to the pool
      if (err) {
        console.warn('Error creating table:', err);
      } else {
        console.log('Table created successfully');
      }
    });
  });
}

createTable();
```

Here just export the pool and then you can ask for connection using `getConnetion` function 
whenever you need it...

### Difference between Single connection and Pooling sort of connection:

1. **Normal (single) connections**: When you use mysql.createConnection(), you create a single connection to the MySQL server. This connection must be manually managed, and you need to close it using connection.end() when you're done with it. If you have multiple concurrent tasks that require database access, you may need to create multiple connections, which can lead to connection overhead and performance issues.

2. **Connection pooling**: When you use mysql.createPool(), you create a pool of connections to the MySQL server. The pool manages multiple connections internally and automatically handles connection reuse, so you don't have to manually manage connections. When you need a connection, you use pool.getConnection() to get a connection from the pool. When you're done with the connection, you release it back to the pool using connection.release(). Connection pooling can improve performance and simplify connection management, especially in applications with many concurrent tasks that require database access.

- Normal connections use mysql.createConnection() and require manual management (opening and closing the connection). Connection pooling uses mysql.createPool() and manages connections internally, simplifying connection management.
- Normal connections can lead to connection overhead and performance issues in applications with many concurrent tasks that require database access. Connection pooling can improve performance and resource usage by reusing connections efficiently.
- With normal connections, you might need to create multiple connections to handle concurrent tasks, while with connection pooling, the pool automatically manages multiple connections for you.


### Using Sequalize

`Sequlize` is kind of a ORM and most used package to manage SQL related operations.

#### Establish connection:

```js
// sequelizeConfig.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('codechit_db', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
```

```js
// models/user.js

// User.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('./sequelizeConfig');

class User extends Model {}

User.init({
  // ...
}, {
  sequelize,
  modelName: 'User',
});

module.exports = User;
```

And then finally inside `app.js` you have to import and sync this once before you start using models:

```js
// app.js
sequelize.sync()
  .then(() => {
    console.log('Tables synchronized successfully');
    // Start your application, e.g., start a web server, run other controllers, etc.
  })
  .catch((err) => {
    console.warn('Error synchronizing tables:', err);
  });
```

