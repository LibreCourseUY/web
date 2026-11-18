const get = (u, h = {}) =>
  new Promise((res, rej) =>
    require('https')
      .get(u, { headers: { 'user-agent': 'verify', ...h } }, (r) => {
        let d = '';
        r.on('data', (c) => (d += c));
        r.on('end', () => res({ status: r.statusCode, headers: r.headers, body: d }));
      })
      .on('error', rej),
  );
