import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const failRate = new Rate('failed_requests');

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        failed_requests: ['rate<=0'],
        http_req_duration: ['p(95)<500']
    },
};

export default function() {
    const res = http.get('http://test-api.k6.io/');
    check(res, {
        'http response code is 200': res.status === 200,
    });

    failRate.add(res.status !== 200);
}