import imgUrl from '../assets/404.gif';

function NoContent() {
  return (
    <div className="flex-1 flex justify-center items-start h-80">
      <div className="text-center mt-14">
        <div>
          <img src={imgUrl} alt="404 No Content Image" className="inline w-40" />
        </div>
        <p className="my-4 text-2xl font-bold">404 Not Found</p>
        <p className="my-2 text-sm">这里目前还没有被开发</p>
      </div>
    </div>
  )
}

export default NoContent;
