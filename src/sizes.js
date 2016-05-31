function renderItem(size) {
  return `
  <li>
  <span>${size}</span>
  <button class="pull-right">Remove</button>
  </li>
  `;
}

const ulSizes = document.getElementById('sizes');

const sizeList = [
  128,
  38,
  19,
  16,
];

function find(size) {
  return sizeList.indexOf(size);
  // var i = 0;
  // var j = sizeList.length - 1;
  // while (i < j) {
  //   const k = (i + j) >> 1;
  //   if (sizeList[k] < size) {
  //     j = k;
  //   } else {
  //     i = k;
  //   }
  // }
  // return size === sizeList[k] ? k : -1;
}

function render() {
  ulSizes.innerHTML = sizeList.map(renderItem).join('');
}

export function add(size) {
  if (Array.isArray(size)) {
    const results = size.map(add);
    return results.some(r => r);
  }
  const i = find(size);
  if (!~i) {
    sizeList.push(size);
    sizeList.sort((a, b) => b - a);
    render();
    return true;
  }
};

export function remove(size) {
  const i = find(size);
  if (~i) {
    sizeList.splice(i, 1);
    render();
    return true;
  }
};

export function get() {
  return sizeList.slice();
};

render();
