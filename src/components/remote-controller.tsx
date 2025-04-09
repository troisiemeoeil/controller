import { SwitchBtn } from "./switchBtn"

const RemoteController = () => {
  return (
    <div className="list w-full h-[242px] flex justify-center items-center ">
  
  
    <div className="center-btns relative w-[250px] h-[250px]  rounded-full">
      <button id='camera-up' className="btn btn-up absolute w-16 h-16 flex justify-center items-center top-2 left-1/2 -translate-x-1/2 bg-white/5 rounded-full">
        <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-up.svg" alt="arrow" className="max-w-1/2" />
      </button>
      <button id='camera-down' className="btn btn-down absolute w-16 h-16 flex justify-center items-center bottom-2 left-1/2 -translate-x-1/2 bg-white/5 rounded-full">
        <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-down.svg" alt="arrow" className="max-w-1/2" />
      </button>
      <button id='camera-left' className="btn btn-left absolute w-16 h-16 flex justify-center items-center top-1/2 left-2 -translate-y-1/2 bg-white/5 rounded-full">
        <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-left.svg" alt="arrow" className="max-w-1/2" />
      </button>
      <button id='camera-right' className="btn btn-right absolute w-16 h-16 flex justify-center items-center top-1/2 right-2 -translate-y-1/2 bg-white/5 rounded-full">
        <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-right.svg" alt="arrow" className="max-w-1/2" />
      </button>
      <button id='camera-switch' className="btn btn-ok absolute w-17 h-17 flex justify-center items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full">
                         <SwitchBtn />
       
      </button>
      <div className="absolute w-[18px] h-[18px] bg-[#33300] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  
    {/* <div className="side-btns p-1.5 w-[58px] h-[142px] text-xs bg-[#222] rounded-full shadow-inner">
      <div className="inner flex flex-col justify-between items-center h-full py-1.5 bg-[#222] rounded-full shadow-md">
        <button className="btn w-8 h-8 flex justify-center items-center bg-[#222] rounded-full">
          <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-up.svg" alt="arrow" className="max-w-1/2" />
        </button>
        <div>ch</div>
        <button className="btn w-8 h-8 flex justify-center items-center bg-[#222] rounded-full">
          <img src="https://www.yudiz.com/codepen/smart-remote-control/arrow-down.svg" alt="arrow" className="max-w-1/2" />
        </button>
      </div>
    </div> */}
  </div>
  
  )
}

export default RemoteController