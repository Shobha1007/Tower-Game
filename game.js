const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
canvas.width=900;
canvas.height=600;

const cellsize=100;
const cellgap=3;
const gamegrid=[];
const defenders=[];
const enemies=[];
const enemyvertpos=[];
let nofresources=300;
let frame=0;
let enemyinterval=600;
let gameover=false;
const controlbar = {
    width:canvas.width,
    height:cellsize
}
const canvasposition=canvas.getBoundingClientRect();
const mouse={
    x:10,
    y:10,
    width:0.1,
    height:0.1,
}
canvas.addEventListener('mousemove',function(e){
    mouse.x=e.x-canvasposition.left;
    mouse.y=e.y-canvasposition.top;
})
canvas.addEventListener('mouseleave',function(){
    mouse.x=undefined;
    mouse.y=undefined;
})
canvas.addEventListener('click',function(){
    let gridposX=mouse.x-mouse.x%cellsize;
    let gridposY=mouse.y - mouse.y % cellsize;
    if(gridposY<cellsize)return;
    for (let i=0;i<defenders.length;i++){
        if(defenders[i].x===gridposX && defenders[i].y===gridposY)return;
    }
    let defendercost=100;
    if(nofresources>=defendercost){
        defenders.push(new Defenders(gridposX,gridposY));
        nofresources-=defendercost;
    }

})
class Cell {
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=cellsize;
        this.height=cellsize;
    }
    draw(){
        if(mouse.x && mouse.y && collisiondetect(this,mouse)){
            ctx.strokeStyle='black';
            ctx.strokeRect(this.x,this.y,this.width,this.height);
        }
        
    }
}
class Defenders {
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.width=cellsize;
        this.height=cellsize;
        this.shooting=false;
        this.projectiles=[];
        this.timer=0;
        this.health=100;
    }
    draw(){
        ctx.fillStyle='blue';
        ctx.fillRect(this.x,this.y,this.width,this.height);
        ctx.fillStyle='gold';
        ctx.font='30px Arial';
        ctx.fillText(this.health,this.x+25,this.y+50);
    }
}
function creategrid(){
    for (let y=cellsize;y<canvas.height;y+=cellsize){
        for(let x=0 ; x<canvas.width ; x+=cellsize){
            gamegrid.push(new Cell(x,y));
        }
    }
}
creategrid();
function handlegrid(){
    for (let i=0 ;i<gamegrid.length;i++){
        gamegrid[i].draw();
    }
}
function handledefenders(){
    for (let i=0;i<defenders.length;i++){
        defenders[i].draw();
    }
}
function handlegamestatus(){
    ctx.fillStyle='gold';
    ctx.font='40px Arial';
    ctx.fillText('Resources: '+nofresources,0,30);
    if(gameover){
        ctx.fillStyle='black';
        ctx.font='40px Arial';
        ctx.fillText('GAME OVER',150,235);
    }
}
function collisiondetect(first,second){
    if (
        !(first.x>second.x + second.width ||
            first.x + first.width < second.x ||
            first.y + first.height< second.y||
            first.y> second.y + second.height)
    ){
        return true;
    }
}
class Enemies{
    constructor(vertpos){
        this.x=canvas.width;
        this.y=vertpos;
        this.width=cellsize;
        this.height=cellsize;
        this.health=100;
        this.maxhealth=this.health;
        this.speed=Math.floor(Math.random()*0.2)+4;
        this.movement=this.speed;
        
    }
    update(){
        this.x-=this.movement;
    }
    draw(){
        ctx.fillStyle='red';
        ctx.fillRect(this.x,this.y,this.width,this.height );
        ctx.fillStyle='gold';
        ctx.font='30px Arial';
        ctx.fillText(this.health,this.x+25,this.y+50);
    }
}
function handleenemies(){
    for(let i=0;i<enemies.length;i++){
        enemies[i].update();
        enemies[i].draw();
        if(enemies[i].x<0){
            gameover=true;
        }
    }
    if(frame%enemyinterval===0){
        let vertpos=Math.floor(Math.random()*5+1) * cellsize;
        enemies.push(new Enemies(vertpos));
        enemyvertpos.push(vertpos);
        if(enemyinterval>120)enemyinterval-=50;
    }
}
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='blue';
    ctx.fillRect(0,0,controlbar.width,controlbar.height);
    handlegrid();
    handledefenders();
    handleenemies();
    handlegamestatus();
    frame++;
    if(!gameover){requestAnimationFrame(animate)};
}
animate();