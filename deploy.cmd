@echo off
npm run build
cd dist
git init
git remote add origin git@github.com:banqinghe/banqinghe.github.io.git
git checkout --orphan gh-pages
git add -A
git commit -m "deploy"
git push -f origin gh-pages
