import { Client } from "elasticsearch";

export default function Delete(client: Client, index: string, type: string) {
  const params = { index, type, refresh: true };
  return async function(id: string) {
    try {
      return client.delete({ ...params, id });
    } catch (error) {
      throw error;
    }
  };
}
