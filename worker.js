// main.js
const worker = new Worker('worker.js');

worker.onmessage = (event) => {
  console.log('Calculated variations:', event.data);
};

worker.postMessage({ data: [1, 2, 3, 4] }); // Example input data

// worker.js
self.onmessage = (event) => {
  const variations = calculateVariations(event.data.data);
  self.postMessage(variations);
};

function calculateVariations(data) {
  // Your variation calculation logic here
  // ...
  return variations;
}
