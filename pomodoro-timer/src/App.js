import React from "react";
import ReactDOM from "react";

//Main component
const App = () => {
  //State   
  const [breakTimer, setBreakTimer] = React.useState(5);
  const [sessionTimer, setSessionTimer] = React.useState(25);
  const [timeLeft, setTimeLeft] = React.useState(1500);
  const [currentSession, setCurrentSession] = React.useState("SESSION");
  const [play, setPlay] = React.useState(false);
 
  const timeout = setTimeout(() => {
    if(timeLeft && play){
      setTimeLeft(timeLeft - 1)
    }
  }, 1000)
  
  const decreaseBreak = () => {
    if(breakTimer > 1 && !play){
      setBreakTimer(breakTimer - 1);
      if(currentSession === "BREAK" && (timeLeft - 60 > 0)){
        setTimeLeft(timeLeft - 60);
      }
    }
  }
  
  const increaseBreak = () => {
    if(breakTimer < 60 && !play){
      setBreakTimer(breakTimer + 1);
      if(currentSession === "BREAK"){
        setTimeLeft(timeLeft + 60);
      }
    }
  }
  
  const decreaseSession = () => {
    if(sessionTimer > 1 && !play){
      setSessionTimer(sessionTimer - 1);
      if(currentSession === "SESSION" && (timeLeft - 60 > 0)){
        setTimeLeft(timeLeft - 60);
      }
    }
  }
  
  const increaseSession = () => {
    if(sessionTimer < 60 && !play){
      setSessionTimer(sessionTimer + 1);
      if(currentSession === "SESSION"){
        setTimeLeft(timeLeft + 60);
      }
    }
  }
  
  const handlePlayPause = () => {
    clearTimeout(timeout);
    setPlay(!play);
  }
  
  const handleReset = () => {
    clearTimeout(timeout);
    setPlay(false);
    setBreakTimer(5);
    setSessionTimer(25);
    setTimeLeft(1500);
    setCurrentSession("SESSION");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  }
  
  const resetTimer = () => {
    const audio = document.getElementById("beep");
    if(!timeLeft && currentSession === "SESSION"){
      setTimeLeft(breakTimer * 60);
      setCurrentSession("BREAK");
      audio.play();
    }
    if(!timeLeft && currentSession === "BREAK"){
      setTimeLeft(sessionTimer * 60);
      setCurrentSession("SESSION");
      audio.play();
      audio.currentTime = 0;
    }
  }

  const clock = () => {
    if(play){
      //timeout
      resetTimer();
    } else {
      clearTimeout(timeout);
    }
  }
  
  React.useEffect(() => {
    clock() 
  }, [play, timeLeft, timeout])
  
  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds}`;
  }
 
  const title = currentSession === "SESSION" ? "Session" : "Break";
  const btns = document.getElementsByClassName("increment-decrement");
  console.log(btns + " here are the buttons");
 
  return (
    <div className="wrapper">
      <div className="title">Pomodoro Timer</div>
        <div className="selectors">
          <BreakSelector breakTimer={breakTimer} decreaseBreak={decreaseBreak} increaseBreak={increaseBreak} />
          <SessionSelector sessionTimer={sessionTimer} decreaseSession={decreaseSession} increaseSession={increaseSession} />
        </div>
      <Timer handlePlayPause={handlePlayPause} handleReset={handleReset} timeFormatter={timeFormatter} title={title} />
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
    </div>
  ); 
}

const BreakSelector = ({ breakTimer, decreaseBreak, increaseBreak }) => {
  return (
    <div className="break-selector">
      <div id="break-label">Break Length</div>
      <button className="increment-decrement" onClick={decreaseBreak} id="break-decrement" type="button">-1</button>
      <strong id="break-length">{breakTimer}</strong>
      <button className="increment-decrement" onClick={increaseBreak} id="break-increment">+1</button>
    </div>
  )
}

const SessionSelector = ({ sessionTimer, decreaseSession, increaseSession }) => {
  return (
    <div className="session-selector">
      <div id="session-label">Session Length</div>
      <button className="increment-decrement" onClick={decreaseSession} id="session-decrement" type="button">-1</button>
      <strong id="session-length">{sessionTimer}</strong>
      <button className="increment-decrement" onClick={increaseSession} id="session-increment">+1</button>
    </div>
  )
}

const Timer = ({ handlePlayPause, handleReset, timeFormatter, title}) => {
  return (
    <div className="timer">
      <div id="timer-label">{title}</div>
      <div id="time-left">{timeFormatter()}</div>
      <button onClick={handlePlayPause} id="start_stop" type="button">Play/Pause</button>
      <button onClick={handleReset} id="reset" type="button">Reset</button>
    </div>
  )
}
 
export default App;