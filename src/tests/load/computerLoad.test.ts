import { check } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '1m', target: 50 }, // Ramp up to 50 users
    { duration: '3m', target: 50 }, // Stay at 50 users
    { duration: '1m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:3000';

export default function() {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.AUTH_TOKEN}`,
    },
  };

  // Get computers list
  const computersResponse = http.get(
    `${BASE_URL}/api/computers`,
    params
  );
  check(computersResponse, {
    'computers list status is 200': (r) => r.status === 200,
    'computers response time OK': (r) => r.timings.duration < 500,
  });

  // Create session
  const sessionResponse = http.post(
    `${BASE_URL}/api/computers/1/sessions`,
    JSON.stringify({ userId: 'test-user' }),
    params
  );
  check(sessionResponse, {
    'create session status is 201': (r) => r.status === 201,
    'session response time OK': (r) => r.timings.duration < 1000,
  });
} 