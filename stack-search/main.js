(function() {
'use strict';

const main = async(function*() {
  for (let page = 1; page < 5; page++) {
    const url = `https://api.stackexchange.com/2.2/questions?site=stackoverflow&page=${page}`;

    document.body.innerHTML += `<i>Loading page ${page}...</i>\n`;

    const data = yield (yield fetch(url)).json();

    for (let item of data.items) {
      document.body.innerHTML +=
          `[${item.score}] ${item.title} by ${item.owner.display_name}\n`;
      yield async.waitForDuration(150);
    }

    document.body.innerHTML += `<b>Click to continue...</b> \n`;

    yield async.waitForEvent(document, 'click');
  }

  console.log("Done!");
});

setTimeout(main);


}());