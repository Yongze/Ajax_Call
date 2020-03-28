import setText, { appendText } from "./results.mjs";

/*
1. inside the get function, after the keyword `await`, the rest of the code will be blocked until await function finish
2. this async/await doesn't stop the caller function
*/
export async function get() {
  const { data } = await axios.get("http://localhost:3000/orders/1");
  setText(JSON.stringify(data));
}

export async function getCatch() {
  try {
    const { data } = await axios.get("http://localhost:3000/orders/123");
    setText(JSON.stringify(data));
  } catch (error) {
    setText(error);
  }
}

//chain async/await
export async function chain() {
  const { data } = await axios.get("http://localhost:3000/orders/1");
  const { data: address } = await axios.get(
    `http://localhost:3000/addresses/${data.shippingAddress}`
  );

  setText(`City: ${JSON.stringify(address.city)}`);
}

//concurrent requests but not concurrently receive the responses
export async function concurrent() {
  const orderStatus = axios.get("http://localhost:3000/orderStatuses");
  const orders = axios.get("http://localhost:3000/orders");

  const { data: statuses } = await orderStatus;
  const { data: order } = await orders;

  setText("");
  appendText(JSON.stringify(statuses));
  appendText(JSON.stringify(order[0]));
}

/**
 * concurrent request and concurrent response
 */
export async function parallel() {
  setText("");

  await Promise.all([
    (async () => {
      const { data } = await axios.get("http://localhost:3000/orderStatuses");
      appendText(JSON.stringify(data));
    })(),
    (async () => {
      const { data } = await axios.get("http://localhost:3000/orders");
      appendText(JSON.stringify(data));
    })()
  ]);
}
