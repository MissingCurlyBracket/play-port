import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Declare process for TS if types are missing in this context
// eslint-disable-next-line no-var
declare var process: {
  env: {
    WATCHMODE_API_KEY: string;
    [key: string]: string | undefined;
  };
};

const headers = {
  'Access-Control-Allow-Origin': '*', // Adjust as needed for production
  'Access-Control-Allow-Credentials': true,
  'Content-Type': 'application/json',
};

const getApiKey = () => process.env.WATCHMODE_API_KEY;

export const searchByName = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getApiKey();
  const name = event.queryStringParameters?.name;

  if (!name) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing name parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/search/?apiKey=${apiKey}&search_field=name&search_value=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const autocomplete = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getApiKey();
  const name = event.queryStringParameters?.name;
  const type = event.queryStringParameters?.type;

  if (!name || !type) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing name or type parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/autocomplete-search/?apiKey=${apiKey}&search_value=${encodeURIComponent(name)}&search_type=${type}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

export const getStreamingSources = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const apiKey = getApiKey();
  const titleId = event.pathParameters?.id;

  if (!titleId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing titleId parameter' }),
    };
  }

  try {
    const response = await fetch(
      `https://api.watchmode.com/v1/title/${titleId}/sources/?apiKey=${apiKey}`,
    );

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: await response.text() }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
