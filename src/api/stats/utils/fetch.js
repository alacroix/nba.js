import got from "got";

import { URL } from "./../constants";
import UserAgent from "user-agents";
import tunnel from "tunnel";

const randomUserAgent = new UserAgent({ deviceCategory: "desktop" });

const { HTTPS_PROXY_HOST, HTTPS_PROXY_PORT } = process.env;

/**
 * Make a request to the stats API and return an error-first callback with the
 * JSON response.
 *
 * @param {string} endpoint - Optional API endpoint
 * @param {Object|Function} opts - Optional object of request options
 * @return {Promise} HTTP request response or error
 */
export default function fetch(endpoint = "", opts) {
  opts = Object.assign(
    {
      ...(HTTPS_PROXY_HOST && {
        agent: tunnel.httpsOverHttp({
          proxy: {
            host: HTTPS_PROXY_HOST,
            port: HTTPS_PROXY_PORT || 80
          }
        })
      }),
      headers: {
        "accept-encoding": "Accepflate, sdch",
        "accept-language": "he-IL,he;q=0.8,en-US;q=0.6,en;q=0.4",
        "cache-control": "max-age=0",
        connection: "keep-alive",
        host: "stats.nba.com",
        referer: "http://stats.nba.com/",
        "user-agent": randomUserAgent.random().toString()
      },
      json: false,
      timeout: 5000,
      retry: 0
    },
    opts || {}
  );

  // eslint-disable-next-line no-useless-escape
  let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  let url = re.test(endpoint) ? endpoint : `${URL}${endpoint}`;

  // in the case that endpoint is a URL, use endpoint, else concatenate the endpoint to URL
  return got(url, opts);
}
