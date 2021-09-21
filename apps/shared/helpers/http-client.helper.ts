import { Injectable } from "@nestjs/common";
import axios from "axios";

@Injectable()
export class HttpClientHelper {

    get(url) {
      return axios.get(url).then(this.extractResponseBody);
    }

    private extractResponseBody(response) {
        if (response.data) {
            return response.data;
        }
        return response;
    }
}
