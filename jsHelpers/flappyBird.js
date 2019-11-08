class Flappy{
    constructor(){
        this._drawOnLaunch();
    }
   
    _drawOnLaunch = async ()=>{
        // get images private fcn
        const _getImages = ()=>{
            let birdImg = new Image(),
                  bgImg = new Image(),
                  fgImg = new Image(),
                  pipeNorthImg = new Image(),
                  pipeSouthImg = new Image();
            birdImg.src = "images/bird.png";
            bgImg.src = "images/bg.png";
            fgImg.src = "images/fg.png";
            pipeNorthImg.src = "images/pipeNorth.png";
            pipeSouthImg.src = "images/pipeSouth.png";
            let imgObj = {
                bird : birdImg,
                bg : bgImg,
                fg : fgImg,
                pipeNorth : pipeNorthImg,
                pipeSouth : pipeSouthImg
            };
            return new Promise((resolve,reject)=>{
                let imgLoaded = 0,
                    imgLength = Object.keys(imgObj).length;
                for(const key in imgObj){
                    imgObj[key].onload = ()=>{
                        imgLoaded++;
                        if(imgLoaded === imgLength) resolve(imgObj);
                        
                    }
                }
            })
        }


        let cvs = document.getElementById('canvas'),
            ctx = cvs.getContext('2d'),
            bX = 10,
            score = 0,
            gravity = 1,
            bY = 150;
    
        const images = await _getImages(),
              constant = images.pipeNorth.height + 85;
        const pipe= [{
                x : cvs.clientWidth,
                y : Math.floor(Math.random()*images.pipeNorth.height) - images.pipeNorth.height
            }];
        const _draw = ()=>{
            ctx.drawImage(images.bg, 0, 0);
            for (let i = 0; i < pipe.length; i++){
                ctx.drawImage(images.pipeNorth, pipe[i].x, pipe[i].y);
                ctx.drawImage(images.pipeSouth, pipe[i].x, pipe[i].y + constant);
                pipe[i].x--;
                if (pipe[i].x === 125){
                    pipe.push({
                        x : cvs.clientWidth,
                        y : Math.floor(Math.random()*images.pipeNorth.height) - images.pipeNorth.height
                    });
                }
                if (bX + images.bird.width >= pipe[i].x && bX <= pipe[i].x + images.pipeNorth.width && (bY <= pipe[i].y + images.pipeNorth.height || bY + images.bird.height >= pipe[i].y + constant) || bY + images.bird.height >= cvs.height - images.fg.height){
                    this._drawOnLaunch();
                    return ;
                }

                if (pipe[i].x + images.pipeNorth.width == bX) score++;
            }
           
            ctx.drawImage(images.fg, 0, cvs.height - images.fg.height);
            drawBird(calcDegrees(gravity));
            bY += gravity;
            gravity += 0.1;
            
            ctx.fillStyle = '#000';
            ctx.font = "20px Verdana";
            ctx.fillText(`Score : ${score}`, 5, cvs.height - 20);
            requestAnimationFrame(_draw);
        };

        const drawBird = (degrees = -60)=>{
            ctx.save();
            ctx.translate(bX + images.bird.width / 2, bY + images.bird.height / 2);
            ctx.rotate(degrees * Math.PI / 180);
            ctx.drawImage(images.bird, (-images.bird.width / 2),  (-images.bird.height / 2));
            ctx.restore();
        }

        const calcDegrees = (grav)=>{
            return grav < 2 ? grav * 30 : 60
        }

        const _moveUp = (ev)=>{
            console.log(ev.key);
            if (ev.key !== 'ArrowUp') return;
            bY -= 10;
            gravity = -2;
        }
        console.log('everyThing is not Private');
        _draw();
        document.addEventListener('keydown', _moveUp);
    }
}

const game = new Flappy();

