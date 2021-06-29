#!/usr/bin/env node

import { readFileSync, writeFile } from 'fs';
import readline from 'readline';
import { Command } from 'commander';
import { getFormatDateString } from './util/date.mjs';
import { logError } from './util/error.mjs';
import { info } from 'console';

const program = new Command();

program.version('v0.1.0');

program
  .option('-c, --columns [cols...]', 'columns to show in list table', 'title,date')
  .option('-l, --list', 'list all posts information')
  .option('-n, --new', 'create a new post');

program.parse(process.argv);

const options = program.opts();

const listPath = './src/config/post-list.json';
const adapterPath = './src/config/adapter.js';
const adapterMarkdownDirPath = '../markdown/';
const markdownDirPath = './src/markdown/';

const postList = JSON.parse(readFileSync(listPath, { encoding: 'utf-8'}));

const postInfo = {
  title: '',
  filename: '',
  date: getFormatDateString(),
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function dupFilename(filename) {
  for (let i = 0, len = postList.length; i < len; i++) {
    if (postList[i].filename === filename) {
      return true;
    }
  }
  return false;
}

function updateJsonData() {
  info('update post-list.json');
  writeFile(listPath, JSON.stringify(postList, null, 2), logError);
}

function updateAdapter(filename) {
  info('update adapter.js');
  const modulename = filename.split('-')
    .map(word => word[0].toUpperCase() + word.substring(1))
    .join('');
  const newline = `export { default as ${modulename} } from '${adapterMarkdownDirPath}${filename}.md';\n`;
  writeFile(adapterPath, newline, { flag: 'a' }, logError);
}

function createPostFile(filename, title) {
  const filepath = markdownDirPath + filename + '.md';
  info('create ' + filepath);
  writeFile(filepath, `# ${title}\n`, logError);
}

function readPostInfo(question, errorMsg) {
  return new Promise((resolve, reject) => {
    const required = !!errorMsg;
    rl.question(question, answer => {
      if (answer || !required) {
        resolve(answer)
      } else {
        reject(errorMsg);
      }
    });    
  })
}

function newPost() {
  readPostInfo('> blog title (required): ', 'blog title is required')
    .then(title => {
      postInfo.title = title;
      return readPostInfo('> filename (required, shaped like \'my-blog\'): ', 'file name is required');
    })
    .then(filename => {
      if (dupFilename(filename)) {
        return Promise.reject('this file name has been used');
      }
      if (!/^([a-z]|\d)+(-([a-z]|\d)+)*$/.test(filename)) {
        return Promise.reject('file name should be all lowercase words separated by dashes');
      }
      postInfo.filename = filename;
      postInfo.pathname = `/post/${filename}`;
      return readPostInfo('> tags (a tags list separated by space): ');
    })
    .then(tags => {
      if (tags) {
        postInfo.tags = tags.split(' ');
      }
      postList.splice(0, 0, postInfo);
      updateJsonData();
      updateAdapter(postInfo.filename);
      createPostFile(postInfo.filename, postInfo.title);
      info('success!');
    })
    .catch(logError)
    .finally(() => {
      rl.close();
    });
}

if (options.list) {
  console.table(postList, options.columns.split(','));
  rl.close();
}

if (options.new) {
  newPost();
}
