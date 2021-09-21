import { Client, SearchParams } from "elasticsearch";

export default function Search(client: Client, index: string, type: string) {
  return async function(params: SearchParams) {
    try {
      const results = await client.search({
        index,
        type,
        ...params,
      });
      return results.hits.hits.map(({ _source }) => _source);
    } catch (error) {
      throw error;
    }
  };
}
