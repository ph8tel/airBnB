// delete require.cache[require('./server')] old way
const request = require('supertest')
require = require('really-need') //change require to allow easy cache busting
describe('loading express', () => {

    beforeEach(() => {
        const server = require('./index', { bustCache: true });
    })
    afterEach(done => {
        server.close(done)
    })
    it('responds to /', (done) => {
        request(server)
            .get('/')
            .expect(200, done)
    })
    it('404 everything else', (done) => {
        console.log('test 404')
        request(server)
            .get('/foo/bar')
            .expect(404, done)
    })
});

//mocha spec spec.js