import http from 'k6/http';
import { check, group } from 'k6';

const baseUrl = 'http://jsonplaceholder.typicode.com'

export const options = {
    vus: 50,
    stages: [
        { duration: '30s', target: 10 },
        { duration: '1m', target: 40 },
        { duration: '30s', target: 0 },
    ],
};

export default function () {
    group('JSON placeholder performance testing', function() {
        group('posts endpoint', function() {
            const res = http.get(`${baseUrl}/posts`);
            check(res, {
                'http response code is 200': res.status === 200,
            });
        });

        group('todos endpoint', function() {
            const res = http.get(`${baseUrl}/todos`);
            check(res, {
                'http response code is 200': res.status === 200,
            });
        });
    })
}