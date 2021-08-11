import './index.css';

const prefixCls = 'not-found';

export default function NotFound() {
  document.title = '404 Not Found';
  return (
    <div className={`${prefixCls}-page`}>
      <h1 className={`${prefixCls}-title`}>404</h1>
      <p className={`${prefixCls}-description`}>前面的区域，以后再来探索吧</p>
    </div>
  )
}
