import { testData } from "testdata"

export async function get() {
  let data = await testData()
  return {
    json: {
      data
    }
  }
}
