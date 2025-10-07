const { Pool } = require('pg');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const data = JSON.parse(event.body);

  // Database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Insert data into the database
    const client = await pool.connect();
    const query = `
      INSERT INTO submissions (form_data) VALUES ($1);
    `;
    await client.query(query, [data]);
    client.release();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Form submitted and data saved successfully' }),
    };
  } catch (error) {
    console.error('Error processing submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error processing submission' }),
    };
  }
};