import data from '../config/post-list.json';

function getTitle(pathname) {
  for (let i = 0, len = data.length; i < len; i++) {
    if (data[i].pathname === pathname) {
      return data[i].title;
    }
  }
  return '';
}

export default getTitle;
