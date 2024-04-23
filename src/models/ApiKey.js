import log from '../log.js'
import {APIError404} from "../errors.js";
import {query} from '../database.js'

export default class ApiKey {
  id
  name
  code
  created_at

  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]))
  }

  static fromDBRow = (row) => {
    const api_key = new ApiKey({
      id: row.id,
      name: row.name,
      code: row.code,
      created_at: row.created_at // TODO parse date
    })

    return api_key
  }

  static get = async ({id, code}) => {
    log.info('Model::ApiKey::get', {id, code})

    const params = []

    let query_sql = `
        select *
        from api_keys
        where true
    `;

    if (id) {
      query_sql += ` and id = ?`;
      params.push(id);
    }

    if (code) {
      query_sql += ` and code = ?`;
      params.push(code);
    }

    const rows = await query(query_sql, params);

    if (rows.length !== 1) throw new APIError404('ApiKey not found.')

    const api_key = ApiKey.fromDBRow(rows[0])

    return api_key
  }
}