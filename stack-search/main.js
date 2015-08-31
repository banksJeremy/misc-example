(function() {
'use strict';

const main = async(function*() {
  for (let page = 1; page < 5; page++) {
    const url = `https://api.stackexchange.com/2.2/questions?site=stackoverflow&page=${page}`;

    console.log(`Loading page ${page}...`);
    const response = yield fetch(url);
    const data = yield response.json();

    console.log(`Page ${page}:`);
    for (let item of data.items) {
      console.log(`[${item.score}] ${item.title} by ${item.owner.display_name}`);
      yield async.waitForDuration(150);
    }

    console.log("Click on the page to load more...");
    yield async.waitForEvent(document, 'click');
  }

  console.log("Done!");
});

main();


}());