@echo off
cd dist

if exist .git goto :update_repo

git init
git remote add origin git@github.com:banqinghe/banqinghe.github.io.git
git checkout --orphan gh-pages

:update_repo
git add -A
git commit -m "deploy"
git push -f origin gh-pages

cd..
