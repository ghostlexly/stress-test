import http from 'k6/http';
import {check} from 'k6';

export const options = {
  scenarios: {
    constant_load: {
      executor: 'constant-arrival-rate',
      rate: 50,              // 50 req/s, indépendant des réponses
      timeUnit: '1s',
      duration: '2m',
      preAllocatedVUs: 100,  // marge si ça ralentit
      maxVUs: 500,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<300', 'p(99)<800', 'p(99.9)<2000'],
  },
};

export default function () {
  const res = http.get('https://restaurant-tonin.fr/api/custom-pages/recrutement');

  check(res, {
    'status 200': (r) => r.status === 200,
    'status 404': (r) => r.status === 404,
    'status 429 (rate limit)': (r) => r.status === 429,
    'status 5xx': (r) => r.status >= 500,
    'status 0 (timeout/conn error)': (r) => r.status === 0,
  });
}