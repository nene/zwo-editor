import moment from 'moment'
import 'moment-duration-format'
import { ZoneColor, Zones } from './Zones'
import { Interval } from '../types/Interval'

const helpers = {
  getIntervalDuration(interval: Interval): number {
    switch (interval.type) {
      case 'free': return interval.duration;
      case 'steady': return interval.duration;
      case 'ramp': return interval.duration;
      case 'repetition': return interval.repeat * (interval.onDuration + interval.offDuration);
    }
  },

  // calculate total time
  getWorkoutDuration: function (intervals: Interval[]): number {
    var duration = 0

    intervals.forEach((interval) => {
      duration += this.getIntervalDuration(interval)
    })

    return duration
  },

  getStressScore: function (intervals: Interval[], ftp: number): string {

    // TSS = [(sec x NP x IF)/(FTP x 3600)] x 100
    var tss = 0

    intervals.map((interval) => {
      if (interval.type === 'steady' && interval.power) {
        const np = interval.power * ftp
        const iff = interval.power

        tss += (interval.duration * np * iff)
      }
      if (interval.type === 'ramp' && interval.startPower && interval.endPower) {
        const np = (interval.startPower + interval.endPower) / 2 * ftp
        const iff = (interval.startPower + interval.endPower) / 2

        tss += (interval.duration * np * iff)
      }
      if (interval.type === 'repetition' && interval.onPower && interval.offPower && interval.repeat && interval.onDuration && interval.offDuration) {
        const npOn = (interval.onPower * ftp)
        const iffOn = interval.onPower

        tss += (interval.onDuration * interval.repeat * npOn * iffOn)

        const npOff = (interval.offPower * ftp)
        const iffOff = interval.offPower

        tss += (interval.offDuration * interval.repeat * npOff * iffOff)
      }
      return false;
    })
    return ((tss / (ftp * 3600)) * 100).toFixed(0);
  },


  getTimeinSeconds: function (time: string): number {
    //convert time 01:00:00 to seconds 3600
    return moment.duration(time).asSeconds()
  },

  formatDuration: function (seconds: number): string {
    // 1 pixel equals 5 seconds 
    return moment.duration(seconds, "seconds").format("mm:ss", { trim: false })
  },
  floor: function (x: number, roundTo: number): number {
    return Math.floor(x / roundTo) * roundTo
  },
}

export default helpers;
