import { assert } from 'chai';
import {
  toDegrees,
  toRadians,
  metersToDegrees,
  degreesToMeters,
  getDistance,
  trace,
  getDirectionAngle,
  getDirectionAngleInRadians
} from '../calculations';

describe('Tests for Math functions', () => {
  it('Test "toDegrees"', () => {
    let radians = 0;
    let degrees = toDegrees(radians);
    assert.equal(degrees, 0);

    radians = Math.PI / 2;
    degrees = toDegrees(radians);
    assert.equal(degrees, 90);

    radians = Math.PI;
    degrees = toDegrees(radians);
    assert.equal(degrees, 180);

    radians = 2 * Math.PI;
    degrees = toDegrees(radians);
    assert.equal(degrees, 360);
  });

  it('Test "toRadians"', () => {
    let degrees = 0;
    let radians = toRadians(degrees);
    assert.equal(radians, 0);

    degrees = 90;
    radians = toRadians(degrees);
    assert.equal(radians, Math.PI / 2);

    degrees = 180;
    radians = toRadians(degrees);
    assert.equal(radians, Math.PI);

    degrees = 360;
    radians = toRadians(degrees);
    assert.equal(radians, 2 * Math.PI);
  });

  it('Test "metersToDegrees"', () => {
    let meters = 111320;
    let degrees = metersToDegrees(meters);
    assert.equal(degrees, 1);

    degrees = metersToDegrees(meters, 45);
    assert.equal(degrees, 1.414213562373095);
  });

  it('Test "degreesToMeters"', () => {
    let degrees = 1;
    let meters = degreesToMeters(degrees);
    assert.equal(meters, 111320);

    meters = degreesToMeters(degrees, 45);
    assert.equal(meters, 78715.12688168648);
  });

  it('Test "getDistance"', () => {
    let p1 = [0, 0],
      p2 = [0, 100],
      distance = 100;
    assert.equal(getDistance(p1, p2), distance);

    p1 = [325763.7233, 450358.7089];
    p2 = [325758.0054, 450367.7143];
    distance = 10.667315012187876;
    assert.equal(getDistance(p1, p2), distance);

    p1 = [42.680026, 23.336611];
    p2 = [42.678803, 23.338928];
    distance = 0.002619965266941615;
    assert.equal(getDistance(p1, p2), distance);

    p1 = [42.680026, 23.336611];
    p2 = [42.678803, 23.338928];
    distance = 267.7929454170398;
    let calculatedDistance = getDistance(p1, p2);
    calculatedDistance = degreesToMeters(calculatedDistance, (p1[1] + p2[1]) / 2);
    assert.equal(calculatedDistance, distance);
  });

  it('Test "getDirectionAngleInRadians"', () => {
    /**
     * North
     * dx = 0
     * dy > 0
     */
    let p1 = [0, 0],
      p2 = [1, 0],
      angle = 0,
      calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * East
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, 1];
    angle = 90;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * South
     * dx = 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 0];
    angle = 180;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * West
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, -1];
    angle = 270;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * I quadrant
     * dx > 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, 1];
    angle = 45;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * II quadrant
     * dx > 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 1];
    angle = 135;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * III quadrant
     * dx < 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, -1];
    angle = 225;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);

    /**
     * IV quadrant
     * dx < 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, -1];
    angle = 315;
    calculated = getDirectionAngleInRadians(p1, p2);
    assert.equal(toDegrees(calculated), angle);
  });

  it('Test "getDirectionAngle"', () => {
    /**
     * North
     * dx = 0
     * dy > 0
     */
    let p1 = [0, 0],
      p2 = [1, 0],
      angle = 0,
      calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * East
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, 1];
    angle = 90;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * South
     * dx = 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 0];
    angle = 180;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * West
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, -1];
    angle = 270;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * I quadrant
     * dx > 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, 1];
    angle = 45;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * II quadrant
     * dx > 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 1];
    angle = 135;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * III quadrant
     * dx < 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, -1];
    angle = 225;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);

    /**
     * IV quadrant
     * dx < 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, -1];
    angle = 315;
    calculated = getDirectionAngle(p1, p2);
    assert.equal(calculated, angle);
  });

  it('Test "trace"', () => {
    /**
     * North
     * dx = 0
     * dy > 0
     */
    let p1 = [0, 0],
      p2 = [1, 0],
      info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, 1);
    assert.equal(info.dy, 0);
    assert.equal(info.distance, 1);
    assert.equal(info.direction, 0);

    /**
     * East
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, 1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, 0);
    assert.equal(info.dy, 1);
    assert.equal(info.distance, 1);
    assert.equal(info.direction, 90);

    /**
     * South
     * dx = 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 0];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, -1);
    assert.equal(info.dy, 0);
    assert.equal(info.distance, 1);
    assert.equal(info.direction, 180);

    /**
     * West
     * dx > 0
     * dy = 0
     */
    p1 = [0, 0];
    p2 = [0, -1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, 0);
    assert.equal(info.dy, -1);
    assert.equal(info.distance, 1);
    assert.equal(info.direction, 270);

    /**
     * I quadrant
     * dx > 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, 1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, 1);
    assert.equal(info.dy, 1);
    assert.equal(info.distance.toFixed(3), 1.414);
    assert.equal(info.direction, 45);

    /**
     * II quadrant
     * dx > 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, 1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, -1);
    assert.equal(info.dy, 1);
    assert.equal(info.distance.toFixed(3), 1.414);
    assert.equal(info.direction, 135);

    /**
     * III quadrant
     * dx < 0
     * dy < 0
     */
    p1 = [0, 0];
    p2 = [-1, -1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, -1);
    assert.equal(info.dy, -1);
    assert.equal(info.distance.toFixed(3), 1.414);
    assert.equal(info.direction, 225);

    /**
     * IV quadrant
     * dx < 0
     * dy > 0
     */
    p1 = [0, 0];
    p2 = [1, -1];
    info = trace(p1, p2);
    assert.isDefined(info);
    assert.equal(info.dx, 1);
    assert.equal(info.dy, -1);
    assert.equal(info.distance.toFixed(3), 1.414);
    assert.equal(info.direction, 315);
  });
});
