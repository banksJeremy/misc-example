(function() {
'use strict';

class StackExchange {
  constructor(defaultParameters) {
    this.API_ROOT = 'http://api.stackexchange.com/2.2/';
    this.defaultParameters = defaultParameters || {};
  }

  fetch_(path, parameters) {
    const allParameters =
        Object.assign({}, this.defaultParameters, parameters || {});
    const url = new URL(this.API_ROOT);
    url.pathname += path;
    url.search = Object.keys(allParameters).map(key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(allParameters[key])
    ).join('&');

    return fetch(url)
  }

  request(path, parameters) {
    return this.fetch_(path, parameters).then(response => {
      // TODO: implement throttling or ssomething in here
      return response.json();
    });
  }
}

const stack = new StackExchange({
    key: '6XCcTC6F0uxg2NYxjQSxSA((',
    site: 'stackoverflow',
    pagesize: 100
});

const main = async(function*() {
  const response = yield stack.request('questions', {
    sort: 'month',
    tagged: 'css'
  });

  let container = document.createElement('div');

  for (let question of response.items) {
    let item = document.createElement('a');
    item.textContent = question.title;
    item.setAttribute('href', question.link);

    container.appendChild(item);
  }

  document.body.appendChild(container);
});

async.waitForEvent(document, 'DOMContentLoaded').then(main);

}());
