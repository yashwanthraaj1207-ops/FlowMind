import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';

function flowmindTelemetryPlugin(): Plugin {
  // In-memory state for local privacy-first bridge
  const sseClients: Set<ServerResponse> = new Set();
  let eventsCapturedCount = 0;
  let lastEvent: any = null;
  let isTrackingPaused = false;
  let appState = {
    activeFlowModeId: 'study',
    activeFlowModeName: 'Study Mode',
    activeGoalTitle: 'Complete Java Assignment',
    isSessionActive: false,
    updatedAt: Date.now(),
  };

  const setCorsHeaders = (res: ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  };

  const readBody = (req: IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        if (!body) return resolve({});
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve({});
        }
      });
      req.on('error', reject);
    });
  };

  return {
    name: 'flowmind-telemetry-bridge',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Only intercept /api/telemetry routes
        if (!url.startsWith('/api/telemetry')) {
          return next();
        }

        setCorsHeaders(res);

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // 1. Ingest telemetry from Chrome Extension (POST /api/telemetry)
        if (req.method === 'POST' && (url === '/api/telemetry' || url === '/api/telemetry/')) {
          try {
            const data = await readBody(req);
            eventsCapturedCount++;
            lastEvent = {
              ...data,
              receivedAt: Date.now(),
            };

            // If payload specifies isTrackingPaused update
            if (typeof data.isTrackingPaused === 'boolean') {
              isTrackingPaused = data.isTrackingPaused;
            }

            // Broadcast to connected FlowMind SSE clients
            const ssePayload = `data: ${JSON.stringify(lastEvent)}\n\n`;
            for (const client of sseClients) {
              try {
                client.write(ssePayload);
              } catch {
                sseClients.delete(client);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                eventsCapturedCount,
                receivedTimestamp: Date.now(),
              })
            );
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to process telemetry' }));
          }
          return;
        }

        // 2. Real-time Server-Sent Events stream for FlowMind UI (GET /api/telemetry/stream)
        if (req.method === 'GET' && url.startsWith('/api/telemetry/stream')) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });

          // Send initial connection packet
          res.write(
            `data: ${JSON.stringify({
              type: 'stream_connected',
              timestamp: Date.now(),
              eventsCapturedCount,
              isTrackingPaused,
              appState,
            })}\n\n`
          );

          sseClients.add(res);

          req.on('close', () => {
            sseClients.delete(res);
          });
          return;
        }

        // 3. Status and health check (GET /api/telemetry/status)
        if (req.method === 'GET' && url.startsWith('/api/telemetry/status')) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              status: 'online',
              source: 'vite_dev_middleware',
              eventsCapturedCount,
              isTrackingPaused,
              lastEvent,
              connectedClients: sseClients.size,
              appState,
            })
          );
          return;
        }

        // 4. FlowMind frontend synchronizes active mode / session to bridge (POST /api/telemetry/app-state)
        if (req.method === 'POST' && url.startsWith('/api/telemetry/app-state')) {
          try {
            const data = await readBody(req);
            appState = {
              ...appState,
              ...data,
              updatedAt: Date.now(),
            };
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, appState }));
          } catch {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to update app state' }));
          }
          return;
        }

        // 5. Chrome extension popup reads FlowMind app state (GET /api/telemetry/app-state)
        if (req.method === 'GET' && url.startsWith('/api/telemetry/app-state')) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              appState,
              eventsCapturedCount,
              isTrackingPaused,
              lastEvent,
            })
          );
          return;
        }

        // 6. Reset telemetry events count (POST /api/telemetry/reset)
        if (req.method === 'POST' && url.startsWith('/api/telemetry/reset')) {
          eventsCapturedCount = 0;
          lastEvent = null;
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ success: true, reset: true }));
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), flowmindTelemetryPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

