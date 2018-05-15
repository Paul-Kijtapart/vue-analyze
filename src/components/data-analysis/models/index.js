// libraries
const uuidv1 = require('uuid/v1');

export class PointError extends Error {
  constructor(params) {
    super(params);

    this.name = "PointError";

    Object.setPrototypeOf(this, PointError.prototype);
  }
}

/**
 * Represent a Point model
 * @constructor
 */
export class Point {
  constructor(info) {

    // unique for each point
    this.timestamp = info.timestamp;

    this.value = info.value;
  }
}

/**
 * Represent a time serie error
 * @constructor
 */
export class TimeSeriesError extends Error {
  constructor(params) {
    super(params);

    this.name = 'TimeSeriesError';

    Object.setPrototypeOf(this, TimeSeriesError.prototype);
  }
}

export class TimeSeriesPointNotExist extends TimeSeriesError {
  constructor(params) {
    super(params);

    this.name = "TimeSeriesPointNotExist";

    Object.setPrototypeOf(this, TimeSeriesPointNotExist.prototype);
  }
}

/**
 * Represent a time serie
 * @constructor
 */
export class TimeSeries {
  constructor({
                name = "",
                points = []
              } = {
    points: []
  }) {

    this.id = 'timeserie-' + uuidv1(); // client side unique id

    this.name = name; // expected to be unique for each time serie

    // group points by its timestamp
    this.timestampToPoint = {}; // { timestamp {number} : {Point} }
    this.points = [];

    // initialize with given info
    points.forEach(point => {

      this.add(point);

    });

  }

  /**
   * Return Echart options with data from this time serie
   * @returns {Object}
   */
  getEchartSerie() {
    return {
      type: 'line',
      data: this.points.map(point => point.value)
    };
  }

  /**
   * Return EchartAxis config
   * @returns {Object}
   */
  getEchartAxis() {
    return {
      name: this.name,
    };
  }

  /**
   * Return point with the given timestamp
   * @param {number} timestamp
   * @returns {Point}
   * @throws {TimeSeriesError} - if the given timestamp does not exist
   */
  getPoint(timestamp) {

    if (!this.hasTimestamp(timestamp)) {
      throw new TimeSeriesError('the given timestamp does not exist');
    }

    return this.timestampToPoint[timestamp];

  }

  /**
   * Return true if we have the given timestamp. Otherwise, false.
   * @param {number} timestamp
   * @returns {boolean}
   */
  hasTimestamp(timestamp) {
    return this.timestampToPoint.hasOwnProperty(timestamp);
  }

  /**
   * Return list of timestamp in the state
   * @returns {number[]}
   */
  getTimestamps() {
    return Object.keys(this.timestampToPoint).map(timestampStr => parseInt(timestampStr));
  }

  /**
   * Add the given point
   * @param {Point} point
   */
  add(point) {

    // update list
    this.timestampToPoint[point.timestamp] = point;
    this.points.push(point);
  }

  /**
   * Remove the given point
   * @param {Point} point
   * @throws {TimeSeriesPointNotExist} if the given point does not exist
   */
  remove(point) {

    let index = this.points.indexOf(point);

    if (index === -1) {
      throw new TimeSeriesPointNotExist("The given point does not exist in the serie");
    }

    this.points.splice(index, 1);
    delete this.timestampToPoint[point.timestamp];

  }

  /**
   * Remove all points with the given timestamp
   * @param {number} timestamp - epoch timestamp
   * @throws {TimeSeriesError} if the given timestamp does not exists
   */
  removePointWithTimestamp(timestamp) {

    if (this.timestampToPoint.hasOwnProperty(timestamp)) {

      let point = this.timestampToPoint[timestamp];

      this.remove(point);
    }
    else {
      throw new TimeSeriesError("The given timestamp does not exist");
    }
  }

  /**
   * Build a timeseries with data retrieved from the server
   * @param {Object} dto - data transfer object
   * @returns {TimeSeries}
   */
  static buildFromDTO(dto) {

    let points = dto.series.datetime.map((timestamp, index) => {
      return new Point({
        timestamp: timestamp,
        value: dto.series.val[index]
      });
    });

    return new TimeSeries({
      name: dto.name,

      points
    });
  }
}

export class TimeSeriesManagerError extends Error {
  constructor(msg) {
    super(msg)
  }
}

export class EmptyTimeSeriesManagerError extends TimeSeriesManagerError {
  constructor(msg) {
    super(msg)
  }

}

/**
 * Manage multiple time serie
 */
export class TimeSeriesManager {
  constructor() {

    // initial states
    this.timeSeriesList = [];
    this.timeSeriesMap = {};

  }

  /**
   * Add the given timeserie
   * @param {TimeSeries} timeserie
   */
  add(timeserie) {

    this.timeSeriesList.push(timeserie);
    this.timeSeriesMap[timeserie.id] = timeserie;

  }

  /**
   * Remove the given timeserie from the state
   * @param timeserie
   * @throws {TimeSeriesManagerError} - if the given timeserie does not exist
   */
  remove(timeserie) {

    let index = this.timeSeriesList.indexOf(timeserie);

    // if the given timeserie does NOT exist
    if (index < 0) {
      throw new TimeSeriesManagerError('the given timeserie does not exist');
    }

    // if the given timeserie exists
    else {
      this.timeSeriesList.splice(index, 1);
      delete this.timeSeriesMap[timeserie.id];
    }

  }

  /**
   * Return true if this manager has no timeseries. Otherwise, false.
   * @returns {boolean}
   */
  isEmpty() {
    return this.timeSeriesList.length === 0;
  }

  /**
   * Return list of overlapped timestamps from all known timeseries
   * @returns {Array.<number>}
   * @throws {EmptyTimeSeriesManagerError} if there is no timeserie
   */
  getOverlappedTimestamp() {

    if (this.isEmpty()) {
      throw new EmptyTimeSeriesManagerError();
    }

    // initial overlapped timestamp with first timeserie
    let firstTimeserie = this.timeSeriesList[0].getTimestamps();

    let overlappedTimestamp = new Set(firstTimeserie);

    for (let i = 1; i < this.timeSeriesList.length; i++) {

      let updatedOverlappedTimestamp = new Set();

      let currentTimestamps = this.timeSeriesList[i].getTimestamps();

      currentTimestamps.forEach(timestamp => {
        if (overlappedTimestamp.has(timestamp)) {
          updatedOverlappedTimestamp.add(timestamp);
        }
      });

      overlappedTimestamp = updatedOverlappedTimestamp;

    }

    return [...overlappedTimestamp];
  }

  /**
   * Return list of scatter point
   * @returns {Array.<Array.<number>>}
   */
  getScatterPoints() {
    console.log('getScatterPoints');

    let timestamps;

    try {
      timestamps = this.getOverlappedTimestamp();
    }
    catch (err) {
      // if fails to get overlapped timestamps

      //log
      console.log("Failed to get overlapped timestamp");
      console.error("Reason : ", err);

      timestamps = [];
    }

    return timestamps.map(timestamp => {

      let point = [];

      // fill in the point
      this.timeSeriesList.forEach(timeserie => {

        let current = timeserie.getPoint(timestamp);

        point.push(current.value);

      });

      // fill the timestamp at the end
      point.push(timestamp);

      return point;

    });
  }

  /**
   * Remove the given point from time serie
   * @param {Point} point
   */
  removePoint(point) {

    try {
      this.timeSeriesList.forEach(timeserie => {

        timeserie.remove(point);

      });
    }
    catch (err) {

      // if the given point is not in the serie
      if (err instanceof TimeSeriesPointNotExist) {
        // do nothing
      }

      // or remove operation fails
      else {

        console.error("Failed to remove the given point ", point);
        console.error("Reason : ", err);

      }
    }
  }

  /**
   * Remove all points with the given timestamp
   * @param {number} timestamp - epoch timestamp
   */
  removePointWithTimestamp(timestamp) {

    this.timeSeriesList.forEach(timeserie => {

      try {

        timeserie.removePointWithTimestamp(timestamp);

      }
      catch (err) {

        console.error("Failed to remove point with timestamp ", timestamp);
        console.error("Reason : ", err.message);

      }

    });

  }
}

