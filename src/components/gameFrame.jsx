/* eslint-disable no-loop-func */
import React from 'react'

const GameFrame = () => {

  function createBoxes(){
    var boxes = "";
    var no = 100, inc = -1;
    for(let i = 0; i<10; i++){
      for(let j = 0; j<10; j++){
        let y = i*60;
        let x = j*60;
        boxes+=`<div id="b_${no}" class='box w-[60px] h-[60px]  absolute ' style="margin: ${y}px ${x}px"></div>`;
        no = no + inc;
      }
      if(i%2 === 0){
        no = no - 9;
      }
      else{
        no = no - 11;
      }
      inc = -inc;
    }
    document.querySelector(".board").innerHTML = boxes;
  }

  function setBox(id){
    document.getElementById(id).innerHTML = `<div class='circle w-full h-full bg-blue-800 border-4 border-white scale-[0.6] rounded-full'></div>`
  }

  function removeBox(id){
    document.getElementById(id).innerHTML = "";
  }

  createBoxes();
  // setBox("b_1");

  var pos = 0;

  function playerMover(move){
    if(move>0){
      setTimeout(()=>{
        if(pos>=1){
          removeBox("b_"+pos);
        }
        pos++;
        setBox("b_"+pos);
        move--;
        playerMover(move);
        if(move===0){
          checkLadder();
          checkSnake();
        }
      }, 500)
    }
  }

  var ladders = [[5, 26], [10, 31], [12, 33], [23, 42], [34, 57], [49, 71], [53, 86], [60, 79], [73, 92], [77, 96]];
  var snakes = [[97, 42], [95, 47], [91, 69], [82, 57], [65, 33], [48, 29], [43, 36], [39, 20], [25, 3], [27, 13]];

  function rotateDice(){
    let dv = parseInt(Math.random()*6)+1;
    console.log(dv);
    let LIST = [[0, 0, 0], [-90, 0, 0], [0, 90, 0], [0, -90, 0], [90, 0, 0], [180, 0, 0]]
    let x = LIST[dv-1][0];
    let y = LIST[dv-1][1];
    let z = LIST[dv-1][2];
    document.querySelector(".dice").classList.add('anm');
    setTimeout(()=>{
      document.querySelector(".dice").style.transform=`rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`;
      document.querySelector(".dice").classList.remove('anm');
      playerMover(dv)
    }, 2000);
  }

  function checkLadder(){
    for(let i = 0; i<10; i++){
      if(ladders[i][0]===pos){
        setTimeout(()=>{
          console.log("matched", pos);
          if(pos>=1){
            removeBox("b_"+pos);
          }
          pos = ladders[i][1];
          setBox("b_"+pos);
        }, 1000)
      }
    }
  }

  function checkSnake(){
    for(let i = 0; i<10; i++){
      if(snakes[i][0]===pos){
        setTimeout(()=>{
          console.log('matched', pos);
          if(pos>=1){
            removeBox("b_"+pos);
          }
          pos = snakes[i][1];
          setBox("b_"+pos);
        }, 1000)
      }
    }
  }

  return (
    <div className='p-10 shadow-lg bg-white flex flex-col space-y-4 justify-center items-center'>
      <div className='board w-[600px] h-[600px] shadow-md'>
        
      </div>
      <div className='dicef flex flex-col justify-center items-center pt-4 space-y-4'>
        <div className="dice w-[60px] h-[60px]">
          <div className="top w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="bottom w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="left w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div> 
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="right w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="front w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
          <div className="back w-full h-full absolute rounded-md">
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
            <div className="dot m-[3%] w-[10px] h-[10px] bg-white rounded-full"></div>
          </div>
        </div>
        <div className='flex justify-center items-center'>
        <button onClick={rotateDice} className='bg-indigo-950 text-white font-semibold rounded-md px-2 py-1'>Rotate Dice</button>
        </div>
      </div>
    </div>
  )
}

export default GameFrame
