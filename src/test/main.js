import css from './css/main.css';
import $ from 'jquery';
import 'hammerjs';
import 'animate.css';

window.addEventListener('hashchange', function(){
  console.log('location changed!');
  setPage();
})

$(()=>{
  setPage();
})

function setPage(){
  console.log(window.location.hash);
  if(window.location.hash == '#home'){
    showPage2();
  }else{
    $('#page2').css("display", "none");
    $('#page1').css("display", "block").click(()=>{
      showPage2();
    })
  }
}

function showPage2(){
  window.location.hash = 'home';
  $('#page2').css("display", "block");
  $('.mark').css("display", "block").on('click', (e)=>{
    let target = $(e.currentTarget);
    let id = target.attr('id');
    let index = id.split('-').pop();
    // let imageId = [134,133,141];
    // window.location.href = `https://c.nase.tech/home/vr-app/vr-viewer.html?id=${imageId[index-1]}&view=1&home=${encodeURIComponent(window.location.href)}`
    // window.location.href = `http://localhost:8080/vr-viewer.html?id=${imageId[index-1]}&view=1&home=${encodeURI(window.location.href)}`
    let imageId = [6,5,4];
    window.location.href = `http://47.114.151.4/member/preview/view/pano_id/${imageId[index-1]}&view=1&home=${encodeURI(window.location.href)}`;
  })
  $('#page1').css("display", "none");
  setCenter();
}

function setCenter(){
  console.log(window.innerWidth/2 + 500);
  // $('#map').css("height", window.innerHeight/2+ 'px');
  $('#map_cont').css("left", (window.innerWidth/2 -  $('#map').width()/2 )+ 'px');
}

let isDragging = false;
let map = $('#map_cont');
let clientX, clientY, startX, startY, lastX = 0, lastY =0;

function onPointerStart(event) {
  // event.preventDefault();

  startX = event.touches? event.touches[ 0 ].clientX : event.clientX;
  startY =  event.touches? event.touches[ 0 ].clientY : event.clientY;
  isDragging = true;
}

function onPointerMove(event) {
  // event.preventDefault();

  if(isDragging){
    console.log(map.position())
    console.log(event);
    clientX = event.touches? event.touches[ 0 ].clientX : event.clientX;
    clientY = event.touches? event.touches[ 0 ].clientY : event.clientY;
  
    let x = clientX - startX ;
    let y = clientY - startY ;
    startX = clientX;
    startY = clientY;
    console.log(`${x} -  ${y}`);
    let mapX = map.position().left + x * 0.9;
    let mapY = map.position().top + y * 0.9;
  
    // map.css('top', mapY + 'px');
    if(mapX > -600  &&  mapX < (window.innerWidth - 300) ){
      map.css('left', mapX + 'px');
    }
  }
}

function onPointerUp(event) {
  // event.preventDefault();
  
  isDragging = false;
}

document.addEventListener( 'mousedown', onPointerStart, false );
document.addEventListener( 'mousemove', onPointerMove, false );
document.addEventListener( 'mouseup', onPointerUp, false );
document.addEventListener( 'touchstart', onPointerStart, false );
document.addEventListener( 'touchmove', onPointerMove, false );
document.addEventListener( 'touchend', onPointerUp, false );
window.addEventListener( 'resize', setCenter, false );
document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

