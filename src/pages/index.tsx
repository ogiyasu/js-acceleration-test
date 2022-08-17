import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [accelerationX, setAccelerationX] = useState(0)

  // canvas関連
  const [canvasState, setCanvasState] = useState()
  const [canvasContext, setCanvasContext] = useState()
  const [distanceX, setDistanceX] = useState(0)
  const [velocityX, setVeloxityX] = useState()

  let canvas: HTMLCanvasElement

  const handleDeviceMotion = (event: any) => {
    setAccelerationX(event.acceleration.x)
  }

  // Draw
  useEffect(() => {
    if (canvasState && canvasContext) {
      const centerX = canvasState.width / 2
      const centerY = canvasState.height / 2
      const ballRad = 50
      const ballColor = 'rgb(0, 0, 255)'
      const g = 9.80665
      const d = centerX / g
      canvasContext?.clearRect(0, 0, canvasState.width, canvasState.height) // canvasの内容を消す clearRect(x, y, w, h)
      canvasContext?.beginPath() // 描画開始
      canvasContext?.arc(
        // 円を描く arc(x, y, 半径, 開始角度, 終了角度)
        centerX - d * accelerationX,
        centerY,
        ballRad,
        0,
        2 * Math.PI
      ) // 角度の単位はラジアン（2π = 360度）で指定
      canvasContext.fillStyle = ballColor // 塗りつぶす色の設定
      canvasContext?.fill()
    }
  }, [accelerationX, canvasContext, canvasState])

  useEffect(() => {
    // SetUpCaanvas
    canvas = document.getElementById('canvas') as HTMLCanvasElement
    setCanvasState(canvas)
    const context = canvas.getContext('2d')
    setCanvasContext(context)
  }, [])

  const handleStartMotion = () => {
    if (window.DeviceOrientationEvent) {
      // ★iOS13向け: ユーザーにアクセスの許可を求める関数があるか？
      if (DeviceOrientationEvent.requestPermission) {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            // リクエストが許可されたら
            if (response === 'granted') {
              window.addEventListener('devicemotion', handleDeviceMotion)
            }
          })
          .catch(e => {
            console.log(e)
          })
        // iOS13以外
      } else {
        // 何もしない
      }
    }
  }

  const setUpCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode: { exact: 'environment' },
      },
    })
    const video = document.getElementById('video')
    video.srcObject = stream
    return new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.width = video.videoWidth / 3
        video.height = video.videoHeight / 3
        resolve()
      }
    })
  }

  const handleStart = async () => {
    handleStartMotion()
    await setUpCamera()
    const deviceInfos = await navigator.mediaDevices.enumerateDevices()
    deviceInfos.forEach(deviceInfo => {
      console.log(deviceInfo.kind, deviceInfo.label, deviceInfo.deviceId)
    })
    const constraints = await navigator.mediaDevices.getSupportedConstraints()
    for (const [key, value] of Object.entries(constraints)) {
      console.log(`${key}: ${value}`)
    }
    navigator.mediaDevices.ondevicechange = function (event) {
      console.log('ondevicechange', event)
    }
  }

  // Video関連
  useEffect(() => {
    const camresetup = async () => {
      await setUpCamera()
      navigator.mediaDevices.enumerateDevices()
      deviceInfos.forEach(deviceInfo => {
        console.log(deviceInfo.kind, deviceInfo.label, deviceInfo.deviceId)
      })
      const constraints = await navigator.mediaDevices.getSupportedConstraints()
      for (const [key, value] of Object.entries(constraints)) {
        console.log(`${key}: ${value}`)
      }
      navigator.mediaDevices.ondevicechange = function (event) {
        console.log('ondevicechange', event)
      }
    }
  }, [])

  return (
    <div className='page'>
      <style jsx>{`
        canvas {
          border: 1px solid #ccc;
        }
      `}</style>
      <button type='button' onClick={handleStart}>
        Allow Access
      </button>
      <div className='inner'>
        <p>X: {accelerationX}</p>
      </div>
      <canvas id='canvas' width='300' height='200' />
      <canvas id='videoCanvas' width='300' height='200' />
      <video id='video' width='300' height='200' autoPlay muted playsInline />
    </div>
  )
}

export default Home
