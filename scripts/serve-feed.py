"""Serve the local awesome-librecourseuy feed with CORS, for /projects testing.

Usage: python3 web/scripts/serve-feed.py [port]
Then: PUBLIC_AWESOME_FEED_URL=http://localhost:8787/entries.json pnpm dev
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

FEED_DIR = Path(__file__).resolve().parent.parent.parent / "awesome-librecourseuy" / "public"
os.chdir(FEED_DIR)


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def log_message(self, *args):
        pass


ThreadingHTTPServer(("127.0.0.1", int(sys.argv[1]) if len(sys.argv) > 1 else 8787), Handler).serve_forever()
