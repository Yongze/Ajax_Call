import setText, { appendText } from "./results.mjs";

export function timeout() {
  const wait = new Promise(resolve => {
    setTimeout(() => {
      resolve("Timeout!");
    }, 1500);
  });

  wait.then(text => setText(text));
}

/**
 * wait.then will only wait under the first resolve get called,
 * the rest of the resolve calls will not bother wait.then
 */
export function interval() {
  let counter = 0;
  const wait = new Promise(resolve => {
    setInterval(() => {
      console.log("INTERVAL");
      resolve(`Timeout${counter++}`);
    }, 1500);
  });

  wait
    .then(text => setText(text))
    .finally(() => appendText(` -- Done  ${counter}`));
}

export function clearIntervalChain() {
  let counter = 0;
  let interval;
  const wait = new Promise(resolve => {
    interval = setInterval(() => {
      console.log("INTERVAL");
      resolve(`Timeout${counter++}`);
    }, 1500);
  });

  wait.then(text => setText(text)).finally(() => clearInterval(interval));
}
/*
    Promise has two function parameters: 1.resolve; 2.reject
*/
export function xhr() {
  let request = new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/users/7");
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.statusText);
      }
    };
    xhr.onerror = () => reject("Requested Failed");
    xhr.send();
  });

  request.then(result => setText(result)).catch(reason => setText(reason));
}

/*
Promise.all will stop under all the requests get responses or one the the request gets fail
*/
export function allPromises() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressTypes = axios.get("http://localhost:3000/addressTypes"); // with error

  Promise.all([categories, statuses, userTypes, addressTypes])
    .then(([cat, stat, type, address]) => {
      setText("");

      appendText(JSON.stringify(cat.data));
      appendText(JSON.stringify(stat.data));
      appendText(JSON.stringify(type.data));
      appendText(JSON.stringify(address.data));
    })
    .catch(reason => setText(reason)); // catch error and no need to wait for others
}
//do everything in order, so resolve or reject. will not be stopped by error call
//not all broswer support allsettled
export function allSettled() {
  let categories = axios.get("http://localhost:3000/itemCategories");
  let statuses = axios.get("http://localhost:3000/orderStatuses");
  let userTypes = axios.get("http://localhost:3000/userTypes");
  let addressTypes = axios.get("http://localhost:3000/addressTypes"); // with error

  Promise.allSettled([categories, statuses, userTypes, addressTypes])
    .then(values => {
      let results = values.map(v => {
        if (v.status === "fulfilled") {
          return `FULFILLED:  ${JSON.stringify(v.value.data[0])} `;
        }

        return `REJECTED: ${v.reason.message} `;
      });

      setText(results);
    })
    .catch(reason => setText(reason));
}

/**
 * same request and same response, only deal with the first return response
 */
export function race() {
  let users = axios.get("http://localhost:3000/users");
  let backup = axios.get("http://localhost:3001/users"); // need to run another npm run secondary

  Promise.race([users, backup])
    .then(user => setText(JSON.stringify(users.data)))
    .catch(reason => setText(reason));
}
