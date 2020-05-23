import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/index.css';

class Game{
    constructor(){
        this.tiles=[];
        this.score=0;
        this.startMouseCoordinates={y:null,x:null};
        this.endMouseCoordinates={y:null,x:null};
        this.isMouseDown=false;
        this.isBlockedMove=false;
        this.delay=200;
        this.initialisation();
    }

    initialisation(){
        $("body").unbind('keydown').keydown((e)=>{
                this.keyDownHundler(e);
            }
        );

        $('#playfield').unbind('mousedown').mousedown((e)=>{
                this.mouseDownHundler(e);
            }
        );

        $('#playfield').unbind('mouseup').mouseup((e)=>{
                this.mouseUpHundler(e);
            }
        );

        $('#newPlay').unbind('click').click(()=>{
                this.start();
            }
        );

        this.start();
    }

    reset(){
        $('#playfield').empty();
        $('#score').text("0");
    }

    getRandomNumber(min=0,max=3){
        return Math.floor(
            Math.random() * (max - min + 1)
        ) + min;
    };



    /**
     * 
     * Генерируем число 2 или 4 с вероятностью 90% или 10% соответственно
     * 
     */

    generateNewNumber(){
        return (this.getRandomNumber(0,100)<=90) ? 2 : 4;
    }

    createFirstTile(){
        let y=this.getRandomNumber();
        let x=this.getRandomNumber();
        this.tiles[y][x]=2;
        $('#playfield').append(
            '<div class="thing t'+2+' y'+y+' x'+x+'"></div>'
        );
    }

    start(){
        this.reset();
        this.tiles=[
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
            [null,null,null,null],
        ];

        this.score=0;
        this.createFirstTile();
        this.createNewTile();
    }


    mouseDownHundler(e){
        this.startMouseCoordinates={y:e.clientY,x:e.clientX};
        this.isMouseDown=true;
    }

    mouseUpHundler(e){
        this.endMouseCoordinates={y:e.clientY,x:e.clientX};

        if(this.isMouseDown && this.isBlockedMove!=true) {
            let minDistance=50;

            let distanceY=null;
            let distanceX=null;
            let directionY,directionX;

            if(this.startMouseCoordinates.y>this.endMouseCoordinates.y){
                distanceY=this.startMouseCoordinates.y-this.endMouseCoordinates.y;
                directionY="top";

            }else{
                distanceY=this.endMouseCoordinates.y-this.startMouseCoordinates.y;
                directionY="bottom";
            }

            if(this.startMouseCoordinates.x>this.endMouseCoordinates.x){
                distanceX=this.startMouseCoordinates.x-this.endMouseCoordinates.x;
                directionX="left";

            }else{
                distanceX=this.endMouseCoordinates.x-this.startMouseCoordinates.x;
                directionX="right";
            }

            if(distanceY>minDistance && distanceX<minDistance){
                this.shiftTiles(directionY);

            } else if(distanceY<minDistance && distanceX>minDistance){
                this.shiftTiles(directionX);
            }
        }

        this.isMouseDown=false;
    }

    keyDownHundler(e){
        if(!this.isBlockedMove){
            switch(e.keyCode){
                case 38:
                    this.shiftTiles("top");
                break;
    
                case 40:
                    this.shiftTiles("bottom");
                break;
    
                case 37:
                    this.shiftTiles("left");
                break;
    
                case 39:
                    this.shiftTiles("right");
                break;
            }
        }
    }

    increaseScore(number){
        this.score+=number;
        $("#score").text(this.score);
    }

    getFreeCoordinates(){
        let freeCoordinates=[];

        for(let y=0; y<4; y++){
            for(let x=0; x<4; x++){
                if(!this.tiles[y][x]) freeCoordinates.push({y,x});
            }
        }

        return freeCoordinates;
    }

    createNewTile(){
        let freeCoordinates=this.getFreeCoordinates();

        if(freeCoordinates.length>0){
            let randomCoordinates=freeCoordinates[
                this.getRandomNumber(0,freeCoordinates.length-1)
            ];

            let newNumber=this.generateNewNumber();

            this.tiles[randomCoordinates.y][randomCoordinates.x]=newNumber;

            $('#playfield').append(
                '<div class="thing t'+newNumber+' y'+randomCoordinates.y+' x'+randomCoordinates.x+'"></div>'
            );
        }
    }

    /**
     * 
     * Вычисляем координаты ближайшей плитки на пути в заданном направлении от заданных координат
     * 
     */

    getCoordinatesClosestTile(coordinates={y:Number,x:Number},direction=String){
        switch(direction){
            case "top":
                coordinates.y--;
            break;

            case "bottom":
                coordinates.y++;
            break;

            case "left":
                coordinates.x--;
            break;

            case "right":
                coordinates.x++;
            break;
        }

        if(this.tiles[coordinates.y] && this.tiles[coordinates.x]){
            if(this.tiles[coordinates.y][coordinates.x]==null){
                return this.getCoordinatesClosestTile(Object.assign({},coordinates),direction);

            }else{
                return coordinates;
            }
        }

        return  false;
    };

    /**
     * 
     * Вычисляем последние свободные координаты на пути в заданном направлении от заданных координат
     * 
     */

    getLatestFreeCoordinates(coordinates={y:Number,x:Number},direction=String,latestFreeCoordinates=false){
        switch(direction){
            case "top":
                coordinates.y--;
            break;

            case "bottom":
                coordinates.y++;
            break;

            case "left":
                coordinates.x--;
            break;

            case "right":
                coordinates.x++;
            break;
        }

        if(this.tiles[coordinates.y] && this.tiles[coordinates.x]){
            if(this.tiles[coordinates.y][coordinates.x]==null){
                return this.getLatestFreeCoordinates(coordinates,direction,Object.assign({},coordinates));
            }
        }

        return latestFreeCoordinates;
    }

    moveTile(startCoordinates,endCoordinates){
        if(startCoordinates && endCoordinates){
            let number=this.tiles[startCoordinates.y][startCoordinates.x];
            this.tiles[endCoordinates.y][endCoordinates.x]=number;
            this.tiles[startCoordinates.y][startCoordinates.x]=null;
            $('#playfield').children(
                "div.thing.y"+startCoordinates.y+".x"+startCoordinates.x).attr("class","thing y"+endCoordinates.y+" x"+endCoordinates.x+" t"+number
            );
        }
    }

    mergeTiles(firstTile,secondTile){
        let lastNumber=this.tiles[firstTile.y][firstTile.x];
        let newNumber=lastNumber*2;
        this.tiles[firstTile.y][firstTile.x]=newNumber;
        this.tiles[secondTile.y][secondTile.x]=null;
        this.increaseScore(newNumber);

        setTimeout(
            ()=>{
                $('#playfield').children(
                    "div.thing.y"+firstTile.y+".x"+firstTile.x+".t"+lastNumber
                ).remove();
            },
            this.delay
        )
        $('#playfield').children(
            "div.thing.y"+secondTile.y+".x"+secondTile.x
        ).attr("class","thing y"+firstTile.y+" x"+firstTile.x+" t"+newNumber);
    }


    /**
     * 
     * Сдвигаем плитку в заданном направлении. Если на пути оказывается плитка с
     * равным номиналом, то обьединяем плитки, иначе двигаем искомую плитку до 
     * последнего свободного поля в случае его наличия
     * 
     */

    shiftTile(y,x,direction){
        if(this.tiles[y][x]){
            let coordinatesClosestTile=this.getCoordinatesClosestTile({y:y,x:x},direction);
            let latestFreeCoordinates=this.getLatestFreeCoordinates({y:y,x:x},direction);

            if(coordinatesClosestTile){
                if(this.tiles[coordinatesClosestTile.y][coordinatesClosestTile.x]==this.tiles[y][x]){
                    this.mergeTiles(coordinatesClosestTile,{y:y, x:x});

                }else{
                    if(latestFreeCoordinates) {
                        this.moveTile({y:y,x:x},latestFreeCoordinates);
                    }
                }

            }else{
                if(latestFreeCoordinates) {
                    this.moveTile({y:y,x:x},latestFreeCoordinates);
                }
            }
        }
    }

    /**
     * 
     * Сдвигаем плитки в заданном направлении
     * 
     */

    shiftTiles(direction){
        this.isBlockedMove=true;

        let prevStateTiles=JSON.stringify(this.tiles);

        switch(direction){
            case "top":
                for(let y=0; y<4; y++){
                    for(let x=0; x<4; x++){
                        this.shiftTile(y,x,direction);
                    }
                }
            break;
            
            case "bottom":
                for(let y=3; y>-1; y--){
                    for(let x=0; x<4; x++){
                        this.shiftTile(y,x,direction);
                    }
                }
            break;

            case "left":
                for(let y=0; y<4; y++){
                    for(let x=0; x<4; x++){
                        this.shiftTile(y,x,direction);
                    }
                }
            break;

            case "right":
                for(let y=0; y<4; y++){
                    for(let x=3; x>-1; x--){
                        this.shiftTile(y,x,direction);
                    }
                }
            break;
        }

        let currentStateTiles=JSON.stringify(this.tiles);

        if(prevStateTiles!=currentStateTiles){
            setTimeout(()=>{this.createNewTile();},this.delay);

        }else{
            if(this.checkGamerOver()) this.showGameOver();
        }

        setTimeout(()=>{this.isBlockedMove=false},this.delay);
    }

    checkGamerOver(){
        let isGamerOver=true;

        ["top","bottom","left","right"].map((direction)=>{
            for(let y=0; y<4; y++){
                for(let x=0; x<4; x++){
                    if(this.tiles[y][x]){
                        let coordinatesClosestTile=this.getCoordinatesClosestTile({y:y,x:x},direction);
                        let latestFreeCoordinates=this.getLatestFreeCoordinates({y:y,x:x},direction);
            
                        if(coordinatesClosestTile){
                            if(this.tiles[coordinatesClosestTile.y][coordinatesClosestTile.x]==this.tiles[y][x]){
                                isGamerOver=false;
            
                            }else{
                                if(latestFreeCoordinates) {
                                    isGamerOver=false;
                                }
                            }
            
                        }else{
                            if(latestFreeCoordinates) {
                                isGamerOver=false;
                            }
                        }
                    }
                }
            }
        });

        return isGamerOver;
    }

    showGameOver(){
        alert("Игра окончена.");
    }
};

$(document).ready(function () {
    new Game();
});