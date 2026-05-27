const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8080;
const root = path.resolve(__dirname);

function contentType(file) {
    const ext = path.extname(file).toLowerCase();
    const map = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain; charset=utf-8'
    };
    return map[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
    const safeSuffix = path.normalize(req.url.split('?')[0]).replace(/^\/+/, '');
    let filePath = path.join(root, safeSuffix);

    if (req.url === '/' || req.url === '') {
        filePath = path.join(root, 'index.html');
    }

    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found');
            return;
        }

        if (stats.isDirectory()) {
            const indexFile = path.join(filePath, 'index.html');
            fs.access(indexFile, fs.constants.R_OK, (err2) => {
                if (err2) {
                    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('403 Forbidden');
                } else {
                    fs.createReadStream(indexFile).pipe(res);
                }
            });
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
});

server.listen(port, () => {
    console.log(`Serving ${root} at http://localhost:${port}`);
});

// Graceful shutdown on Ctrl+C
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => process.exit(0));
});
