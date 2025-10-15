// Response helpers
export const json = (data, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const missing = (message = 'Not found') => {
  return new Response(JSON.stringify({ error: message }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const error = (status, message) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};