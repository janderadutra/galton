const path = require('path');
const request = require('supertest');
const geojsonhint = require('@mapbox/geojsonhint');
const galton = require('../src');

const osrmPath = path.join(__dirname, './data/monaco.osrm');

const options = {
  osrmPath,
  radius: 2,
  cellSize: 0.1,
  concavity: 2,
  intervals: [5, 10, 15],
  lengthThreshold: 0,
  units: 'kilometers'
};

const app = galton(options);

const points = [[7.41337, 43.72956], [7.41546, 43.73077], [7.41862, 43.73216]];
points.forEach(point =>
  test('test isochrone', () => {
    request(app)
      .get(`/?lng=${point[0]}&lat=${point[1]}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((error, response) => {
        expect(error).toBeFalsy();
        const errors = geojsonhint.hint(response.text);
        expect(errors).toHaveLength(0);
      });
  }));
