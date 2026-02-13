//// NAVIGATION
function showSection(id){
document.querySelectorAll("section")
.forEach(s=>s.classList.remove("active"))
document.getElementById(id).classList.add("active")
}

//// THEME
function toggleTheme(){
document.body.classList.toggle("dark")
localStorage.setItem("theme",
document.body.classList.contains("dark"))
}

if(localStorage.getItem("theme")=="true")
document.body.classList.add("dark")

//// AUDIO PLAYER
const audio=document.getElementById("audio")
const audioProgress=document.getElementById("audioProgress")
const audioTime=document.getElementById("audioTime")
const playlist=document.getElementById("playlist")

playlist.onchange=()=>{
audio.src=playlist.value
songTitle.textContent=playlist.options[playlist.selectedIndex].text
audio.play()
}

function playPauseAudio(){audio.paused?audio.play():audio.pause()}
function stopAudio(){audio.pause();audio.currentTime=0}

audio.ontimeupdate=()=>{
audioProgress.style.width=(audio.currentTime/audio.duration)*100+"%"
audioTime.textContent=Math.floor(audio.currentTime)
}

function seekAudio(e){
audio.currentTime=(e.offsetX/e.target.offsetWidth)*audio.duration
}

//// VIDEO PLAYER
const videoPlayer=document.getElementById("videoPlayer")
const videoProgress=document.getElementById("videoProgress")

function playPauseVideo(){
videoPlayer.paused?videoPlayer.play():videoPlayer.pause()
}

videoPlayer.ontimeupdate=()=>{
videoProgress.style.width=
(videoPlayer.currentTime/videoPlayer.duration)*100+"%"
}

function seekVideo(e){
videoPlayer.currentTime=
(e.offsetX/e.target.offsetWidth)*videoPlayer.duration
}

function fullscreen(){
videoPlayer.requestFullscreen()
}

//// USER SYSTEM
function register(){
localStorage.setItem("user",
JSON.stringify({name:name.value,pass:pass.value}))
msg.textContent="Registered!"
}

function login(){
const u=JSON.parse(localStorage.getItem("user"))
if(u && u.name==lname.value && u.pass==lpass.value){
msg.textContent="Welcome "+u.name
welcome.textContent="Welcome "+u.name
}else msg.textContent="Invalid"
}

function logout(){
msg.textContent="Logged out"
welcome.textContent="Welcome"
}

//// GAME
const c=document.getElementById("gameCanvas")
const ctx=c.getContext("2d")

let y=150,ballX=300,ballY=200,dx=4,dy=4,score=0

document.addEventListener("keydown",e=>{
if(e.key=="w") y-=20
if(e.key=="s") y+=20
})

function restartGame(){
score=0
ballX=300
ballY=200
}

setInterval(()=>{
ctx.clearRect(0,0,600,400)

ctx.fillRect(0,y,10,80)

ballX+=dx; ballY+=dy
if(ballY<0||ballY>400) dy*=-1

if(ballX<10 && ballY>y && ballY<y+80){
dx*=-1
score++
document.getElementById("score").textContent="Score: "+score
}

if(ballX>600) restartGame()

ctx.beginPath()
ctx.arc(ballX,ballY,10,0,6.28)
ctx.fill()
},16)
