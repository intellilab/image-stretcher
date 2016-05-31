rm -rf dist
mkdir dist
npm run build
cd dist
git init
git add -A
git commit -m 'Auto deploy to GitHub pages'
git push -f git@github.com:intellilab/image-stretcher.git master:gh-pages
