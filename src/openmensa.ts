import { Canteen, CanteenSearchParams, Day, Meal } from "./types";
import fetchCache from "node-fetch-cache";

class OpenMensa {
  _baseUrl = "https://openmensa.org/api/v2";

  constructor(baseUrl?: string) {
    if (baseUrl) this._baseUrl = baseUrl;
  }

  _buildSearchParams = (searchParams: any = {}) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams))
      if (value) params.append(key, value.toString());

    console.log(params);
    return params;
  };

  async _fetch(endpoint: string, searchParams?: any) {
    try {
      let url = `${this._baseUrl}${endpoint}`;

      // append search params to url
      if (searchParams && Object.keys(searchParams).length > 0) {
        searchParams = new URLSearchParams(searchParams).toString();
        url = `${url}?${searchParams}`;
      }

      const response = await fetchCache(url);

      if (!response.ok) {
        console.error(response);
        return null;
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async _fetchWithPagination(
    endpoint: string,
    page: number = 1,
    limit: number = Infinity,
    pageLimit: number = 100,
    searchParams: any = {}
  ) {
    let data: any[] = [];

    if (pageLimit > limit) pageLimit = limit;
    searchParams.limit = pageLimit;
    searchParams.page = page;

    let pageData = await this._fetch(endpoint, searchParams);
    data.push(...pageData);

    while (pageData.length === pageLimit && data.length < limit) {
      searchParams.page++;
      pageData = await this._fetch(endpoint, searchParams);
      data.push(...pageData);
    }

    return data;
  }

  async getCanteens(
    searchParams?: CanteenSearchParams,
    page?: number,
    limit?: number,
    pageLimit?: number
  ) {
    const endpoint = "/canteens";
    const data: Canteen[] = await this._fetchWithPagination(
      endpoint,
      page,
      limit,
      pageLimit,
      searchParams
    );
    return data;
  }

  async getCanteen(id: number) {
    const endpoint = `/canteens/${id}`;
    const data: Canteen = await this._fetch(endpoint);
    return data;
  }

  async getDays(id: number) {
    const endpoint = `/canteens/${id}/days`;
    const data: Day[] = await this._fetch(endpoint);
    return data;
  }

  async getDay(id: number, date: string) {
    const endpoint = `/canteens/${id}/days/${date}`;
    const data: Day = await this._fetch(endpoint);
    return data;
  }

  async getMeals(id: number, date: string) {
    const endpoint = `/canteens/${id}/days/${date}/meals`;
    const data: Meal[] = await this._fetch(endpoint);
    return data;
  }
}

export default OpenMensa;
