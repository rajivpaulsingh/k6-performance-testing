import http from 'k6/http';
import { check } from 'k6';

export default function() {
    const res = http.get('http://test-api.k6.io/');
    check(res, {
        'http response code is 200': res.status === 200,
    });
}