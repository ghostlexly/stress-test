import http from 'k6/http';
import {check} from 'k6';

export let options = {
  thresholds: {
    // Assert that 99% of requests finish within 3000ms.
    http_req_duration: ["p(90) < 300", "p(95) < 600", "p(99) < 3000"],
  },
  vus: 20,
  duration: "2s"
};

export default function () {
  const res = http.get('https://restaurant-tonin.fr/api/custom-pages/recrutement');

  check(res, {
    'status 200': (r) => r.status === 200,
  });
}