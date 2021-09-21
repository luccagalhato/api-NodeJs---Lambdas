import { Client } from "elasticsearch";

export default function Index(client: Client, index: string, type: string) {
  const params = { index, type, refresh: true };
  return async function(id: string, body: any) {
    try {
      return client.index({ ...params, id, body });
    } catch (error) {
      throw error;
    }
  };
}
