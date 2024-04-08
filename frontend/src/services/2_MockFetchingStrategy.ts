import mockData from '../mocks/mocks';
import { FetchingStrategyInterface } from './0_FetchingStrategy';
import { FetchingStrategy } from './3_FetchingStrategy';
class MockFetchingStrategy
  extends FetchingStrategy
  implements FetchingStrategyInterface
{
  async get(url: string): Promise<any> {
    console.log(`Mock GET request to ${url}`);
    return Promise.resolve(mockData.get[url]);
  }

  async post(url: string, data: any): Promise<any> {
    console.log(`Mock POST request to ${url} with data`, data);
    return Promise.resolve(mockData.post[url]);
  }

  async patch(url: string, data: any): Promise<any> {
    console.log(`Mock PATCH request to ${url} with data`, data);
    return Promise.resolve(mockData.patch[url]);
  }

  async delete(url: string): Promise<any> {
    console.log(`Mock DELETE request to ${url}`);
    return Promise.resolve(mockData.delete[url]);
  }

  async put(url: string, data: any): Promise<any> {
    console.log(`Mock PUT request to ${url} with data`, data);
    return Promise.resolve(mockData.put[url]);
  }
}

export default MockFetchingStrategy;
