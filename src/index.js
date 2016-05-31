import ImageCropper from 'img-cropper';
import JSZip from 'jszip';
import * as sizes from './sizes';

function download(items) {
  const zip = new JSZip;
  items.forEach(item => {
    zip.file(item.name, item.data, item.options);
  });
  zip.generateAsync({type: 'blob'})
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'images.zip';
      a.click();
      setTimeout(URL.revokeObjectURL, 0, url);
    });
}
function drawImage(target, source, size) {
  const ratio = source.width / source.height;
  const srcSize = ratio >= 1 ? {
    width: size,
    height: ~~ (size / ratio),
  } : {
    width: ~~ (size * ratio),
    height: size,
  };
  const ctx = target.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  const x = (size - srcSize.width) >> 1;
  const y = (size - srcSize.height) >> 1;
  ctx.drawImage(source, x, y, srcSize.width, srcSize.height);
}

const $ = selector => document.querySelector(selector);

const canvasPreview = $('#preview');
const PREVIEW_SIZE = 128;

canvasPreview.width = canvasPreview.height = PREVIEW_SIZE;

var canvasResult;

const cropper = ImageCropper.create({
  container: $('#cropper'),
  onCrop: canvas => {
    canvasResult = canvas;
    drawImage(canvasPreview, canvas, PREVIEW_SIZE);
  },
});

$('input[type=file]').addEventListener('change', e => {
  cropper.reset(e.target.files[0]);
}, false);

$('#btnAddSize').addEventListener('click', e => {
  const t = +prompt('New size:');
  t && sizes.add(t);
}, false);

$('#sizes').addEventListener('click', e => {
  const target = e.target;
  if (target.tagName.toLowerCase() === 'button') {
    const t = +target.parentNode.firstElementChild.textContent;
    t && sizes.remove(t);
  }
}, false);

$('#btnExport').addEventListener('click', e => {
  const sizeList = sizes.get();
  const canvas = document.createElement('canvas');
  var filenamePattern = $('#filename').value;
  if (!/\.png$/i.test(filenamePattern)) filenamePattern += '.png';
  sizeList.length && download(sizeList.map(size => {
    canvas.width = canvas.height = size;
    drawImage(canvas, canvasResult, size);
    const locals = {
      size,
    };
    return {
      name: filenamePattern.replace(/\[(\w+)\]/g, (match, key) => {
        return locals[key] || '';
      }),
      data: canvas.toDataURL().split(',')[1],
      options: {base64: true},
    };
  }));
}, false);
