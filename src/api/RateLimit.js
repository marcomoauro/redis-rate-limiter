import {DateTime} from "luxon";
import {APIError429} from "../errors.js";
import Cache from "../cache.js";

export default class RateLimit {
  #code
  #THRESHOLD_KEYS = {
    MINUTE: 'minute',
    HOUR: 'hour'
  }
  #THRESHOLDS = {
    [this.#THRESHOLD_KEYS.MINUTE]: 10,
    [this.#THRESHOLD_KEYS.HOUR]: 500
  }

  constructor({code}) {
    this.#code = code
  }

  validateWithinMinute = async () => {
    const minute = DateTime.local().toFormat('m')
    const key = `rate_limit/${this.#code}/m/${minute}`

    const threshold_key = this.#THRESHOLD_KEYS.MINUTE

    await this.#checkByThresholdAndIncrement({key, threshold_key, ttl: 60})
  }

  validateWithinHour = async () => {
    const hour = DateTime.local().toFormat('h')
    const key = `rate_limit/${this.#code}/h/${hour}`

    const threshold_key = this.#THRESHOLD_KEYS.HOUR

    await this.#checkByThresholdAndIncrement({key, threshold_key, ttl: 60 * 60})
  }

  #checkByThresholdAndIncrement = async ({key, threshold_key, ttl}) => {
    const cache_tx = Cache.getClient().pipeline();
    cache_tx.incr(key);
    cache_tx.expire(key, ttl);
    const [[, invocations]] = await cache_tx.exec();

    const threshold_value = this.#THRESHOLDS[threshold_key]
    if (invocations > threshold_value) {
      throw new APIError429(`Rate limit exceeded, max ${threshold_value} calls per ${threshold_key}.`)
    }
  }
}