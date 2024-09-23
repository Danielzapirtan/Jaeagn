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
