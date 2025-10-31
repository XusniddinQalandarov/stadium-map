exports.handler = async function(event, context) {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { username, password } = body;

    const expectedUser = process.env.NETLIFY_AUTH_USERNAME || '';
    const expectedPass = process.env.NETLIFY_AUTH_PASSWORD || '';

    // Basic validation
    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing credentials' })
      };
    }

    if (username === expectedUser && password === expectedPass) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: true })
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false })
    };
  } catch (err) {
    console.error('Auth function error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
