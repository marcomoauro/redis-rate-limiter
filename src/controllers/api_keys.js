import log from "../log.js";
import ApiKey from "../models/ApiKey.js";

export const getApiKey = async ({ code }) => {
  log.info('Controller::apiKeys::getApiKey')

  const api_key = await ApiKey.get({code})

  return {
    api_key
  }
}