import { check, group } from 'k6';
import { Rate } from 'k6/metrics';
import { getFrontPage, listCrocs, performLogin } from './actions.js';

const failRate = new Rate('failed requests');

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        failed_requests: ['rate<=0'],
        http_req_duration: ['p(95)<900']
    },
};

/*
    - User enters the frontpage
    - User logs in by submitting the login form
    - User lists their crocodile collection
*/

export default function() {
    group('user logs in and lists their crocodile colletion', () => {
        let token;
        group('user visits the frontpage', () => {
            const res = getFrontPage();
            check(res, {
                'http response code is 200': res.status === 200,
            });

            failRate.add(res.status !== 200);
        });

        group('user submits the login form', () => {
            const res = performLogin('simme@k6.io', 'superCroc2019')
            token = res.token
            check(res, {
                'http response code is 200': res.status === 200,
                'response contains a token': !! token,
            });

            failRate.add(res.status !== 200);
        });

        group('user lists their crocodile collection', () => {
            const res = listCrocs(token);
            const crocs = JSON.parse(res.body);
            check(res, {
                'http response code is 200': res.status === 200,
                'retursn 3 crocs': crocs.length === 3,
            });

            failRate.add(res.status !== 200);
        });        
    })
    
}