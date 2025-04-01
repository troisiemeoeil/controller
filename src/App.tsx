
import { useState } from 'react';
import './App.css'
// import { CircularSlider } from './components/circular-slider'
// import { JoystickController } from './components/joystick-controller'
import { SwipeSlider } from './components/swiper-slider'
// import { VolumeSlider } from './components/volume-slider'
// import {Chip} from "@heroui/chip";
import { Badge } from "@/components/ui/badge"
import { SettingsIcon } from 'lucide-react';
import { VolumeSlider } from './components/volume-slider';
import { MultiSelect, type Option } from "./components/multi-select"
import { SwitchBtn } from './components/switchBtn'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './components/ui/button';
import { Minus, Plus } from "lucide-react"
import { JoystickController } from './components/joystick-controller';
import LiveStream from './components/feed';
function App() {
  const [showCamera, setShowCamera] = useState(false)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [goal, setGoal] = useState(0)
 
  function onClick(adjustment: number) {
    setGoal(Math.max(0, Math.min(100, goal + adjustment)))
  }
  const deviceOptions: Option[] = [
    { value: "projector1", label: "Projector one" },
    { value: "projector2", label: "Projector two" },
    { value: "laptop", label: "Laptop" },

  ]


  return (
    <div className="flex min-h-screen flex-col items-center justify-baseline bg-white">
      <div className="w-full max-w-6xl  ">
        <div className=" mx-auto  flex justify-center ">
          <img id="logo" src="./logo.png" width={20} height={20} alt="" className="w-[400px] h-[200px] object-contain" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3  h-[70vh] gap-8 items-center">
          <div className="flex flex-col h-[70vh] items-center space-y-2 ">
            {/* Camera Feed */}
            <div className="w-full h-[30vh] relative rounded-md">
              <Badge className='z-10 bg-primary flex justify-between  items-center text-white font-semibold py-1 absolute top-1 left-1 rounded-md' >
                <div className='w-3 h-3 bg-red-600 rounded-full'></div>
                Live
              </Badge>
              <LiveStream streamUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" />


              <div className='flex w-full  justify-between items-center absolute bottom-1 left-1 px-2'>
                <Badge className='z-10 bg-gray-400 flex justify-evenly items-center text-lg text-white font-semibold  ' >
                  <p>136B</p>
                </Badge>
                <Drawer >
                  <DrawerTrigger>
                    <SettingsIcon className='bg-gray-900 rounded-full h-9 w-9 p-2 text-gray-300' />
                  </DrawerTrigger>
                  <DrawerContent className="w-full bg-gray-900 border-0">
                  <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className='text-white'>Control Camera Position </DrawerTitle>
            <DrawerDescription>Move the joystick to change the camera's direction.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
     <div className="space-y-12">
     <JoystickController
          onChange={(x, y) => console.log(`Camera position: x=${x}, y=${y}`)}
          className=" mx-auto"
          />
            <DrawerTitle className='text-white'>Control Camera Zoom Level </DrawerTitle>
            <div className="flex items-center justify-center  space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(-10)}
                disabled={goal <= 0}
              >
                <Minus />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-4xl font-bold text-white tracking-tighter">
                  {goal} %
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => onClick(10)}
                disabled={goal >= 100}
              >
                <Plus />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
     </div>
      
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
                  </DrawerContent>
                </Drawer>


              </div>
            </div>
            {/* Camera Switch */}
            <div className="w-full h-full bg-gray-900 border-gray-300 border-2 relative rounded-md">
              <img src="./cam.png" alt="" className="blur-xs absolute top-0 right-0 w-[250px] h-[250px] rounded-md object-contain" />
              <div className="absolute top-0 left-0 w-full  h-full flex flex-col items-stretch p-4 justify-evenly">

                <div className='space-y-1 flex flex-col items-start'>
                  <h4 className="font-medium text-gray-400">Camera</h4>
                  <h1 className="text-4xl font-medium align-text-left text-gray-100"> Bardi Smart <br /> IP Camera</h1>
                </div>
                <div className=' flex justify-evenly items-center'>
                  <SwipeSlider onComplete={() => setShowCamera(!showCamera)} />
                  <button className={`w-12 h-12  bg-gray-400 flex justify-center  items-center text-white font-semibold rounded-full ${showCamera ? 'bg-green-400 text-white' : 'bg-red-600 text-white'}`} >
                    {showCamera ? 'ON' : 'OFF'}
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* second card */}
          <div className="flex flex-col h-[70vh] items-center ">


            {/* Camera Switch */}
            <div className="w-full relative  h-full bg-gray-900 border-gray-300 border-2  rounded-md">
              <img src="./mic.png" alt="" className="absolute top-0 right-0 w-[280px] h-[280px] rounded-md object-contain blur-xs" />
              <div className=" w-full  h-full flex flex-col items-stretch p-4 justify-evenly">

                <div className='space-y-1 flex flex-col items-start z-10'>
                  <h4 className="font-medium text-gray-400">Microphone</h4>
                  <h1 className="text-5xl text-start font-medium text-gray-100">Shure<br /> MXA920</h1>
                </div>
                <div className=' flex absolute bottom-3 right-5 justify-end items-center'>
                  <VolumeSlider onChange={(volume) => console.log(`Volume: ${volume}`)} className="z-10" />
                </div>
              </div>
            </div>
          </div>


          {/* third card */}
          <div className="flex flex-col h-[70vh] items-center space-y-2 ">


            {/* Camera Switch */}
            <div className="w-full h-full bg-gray-900 border-gray-300 border-2 relative rounded-md">
              <img src="./projector.png" alt="" className="absolute top-0 right-0 w-[250px] h-[250px] rounded-md object-contain blur-xs" />
              <div className="absolute top-0 left-0 w-full  h-full flex flex-col items-stretch p-4 justify-evenly">

                <div className='space-y-1 flex flex-col items-start'>
                  <h4 className="font-medium text-gray-400">Display</h4>
                  <h1 className="text-5xl text-start  font-medium text-gray-100"> Connect a<br />Projector</h1>
                </div>
                <div className=' flex flex-col justify-evenly items-center'>
                  <div className="w-full space-y-2">
                    <label className="text-sm font-medium text-gray-700">Select a source device </label>
                    <MultiSelect
                      options={deviceOptions}
                      selectedValues={selectedDevices}
                      onChange={setSelectedDevices}
                      placeholder="Select devices"
                    />

                  </div>
                  <SwitchBtn />

                </div>
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-medium text-white">Swipe to Unlock</h2>
          <SwipeSlider onComplete={() => console.log("Unlocked!")} className="mx-auto" />
          
          </div>
          
          <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-medium text-white">Camera Controller</h2>
          <JoystickController
          onChange={(x, y) => console.log(`Camera position: x=${x}, y=${y}`)}
          className="mx-auto"
          />
          
          </div>
          
          <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-medium text-white">Volume Control</h2>
          <VolumeSlider onChange={(volume) => console.log(`Volume: ${volume}`)} className="mx-auto" />
          </div>
          
          <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-medium text-white">Temperature</h2>
          <CircularSlider onChange={(temp) => console.log(`Temperature: ${temp}°C`)} className="mx-auto" />
          
          </div> */}
        </div>

      </div>
    </div>
  )
}

export default App
