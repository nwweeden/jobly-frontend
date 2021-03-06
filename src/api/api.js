import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  /** Get companies. Companies can be filtered by a search term. */

  static async getCompanies(searchTerm) {

    let params = searchTerm === '' ? {} : { 'name': searchTerm }

    let res = await this.request(`companies`, params);
    return res.companies;
  }

  /** Get jobs. Jobs can be filtered by title. */
  static async getJobs(searchTerm) {

    let params = searchTerm === '' ? {} : { 'title': searchTerm }

    let res = await this.request(`jobs`, params);
    return res.jobs;
  }

  /**Handle Login */
  static async login(username, password) {

    let res = await this.request('auth/token', { username, password }, 'post')
    return res.token
  }

  /** Handle register */
  static async register(userData) {

    let res = await this.request('auth/register', userData, 'post');
    return res.token
  }

  /** Get user */
  static async getUser(username) {

    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Update the user's profile. */
  static async editUser(userData) {
    const { username, firstName, lastName, email, password } = userData;
    let res = await this.request(`users/${username}`, {firstName, password, lastName, email}, 'patch');
    return res.user;
  }

  /** Apply to Job */
  static async applyToJob(username, jobId) {
    await this.request(`users/${username}/jobs/${jobId}`, {}, "post")
  }

}

export default JoblyApi;