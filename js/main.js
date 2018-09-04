console.clear();

const s = Splitting();
////////////////////////////////////////////////////
const flatten = (arr, result = []) => {
  for (let i = 0, length = arr.length; i < length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      flatten(value, result);
    } else {
      result.push(value);
    }
  }
  return result;
};

const canvas = document.querySelector( 'canvas' );
const ctx = canvas.getContext( '2d' );
ctx.strokeStyle= 'white';
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width=w;
canvas.height=h;

class Rect{
  constructor( x, y, w, h ){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = 95;
  }

  split( n, axis ) {
    if( n == 0 ) return this;

    let p = ( new Array( n ) ).fill( 0 ).map( d => Math.random() ).sort();

    let newRects = [];

    for( let i = 0; i < n; i ++ ) {
      let x, y, w, h;
      if( axis < 0.5 ) {
        x = this.x + ( i == 0 ? 0 : p[ i - 1 ] * this.w );
        y = this.y;
        w = this.w * ( p [ i ] - ( i == 0 ? 0 : p[ i - 1 ] ) );
        h = this.h;
      }
      else {
        x = this.x;
        y = this.y + ( i == 0 ? 0 : p[ i - 1 ] * this.h );
        w = this.w;
        h = this.h * ( p [ i ] - ( i == 0 ? 0 : p[ i - 1 ] ) );
      }

      newRects.push( new Rect( x, y, w, h ) );
    }

    {
      let x,y,w,h;
      if( axis < 0.5 ) {
        x = this.x + p[ p.length - 1 ] * this.w ;
        y = this.y;
        w = this.w * ( 1.0 - p[ p.length - 1 ] );
        h = this.h;
      }
      else {
        x = this.x;
        y = this.y + p[ p.length - 1 ] * this.h;
        w = this.w;
        h = this.h * ( 1.0 - p [ p.length - 1 ] );
      }

      newRects.push( new Rect( x, y, w, h ) );
    }
    return newRects;
  }

  display(){
      if( this.axis ){
          ctx.fillRect( this.x, this.y, this.w * this.s / 100, this.h );
          // ctx.rect( this.x, this.y, this.w * this.s / 100, this.h );
      }
      else{
          ctx.fillRect( this.x, this.y, this.w, this.h * this.s / 100 );
          // ctx.rect( this.x, this.y, this.w, this.h * this.s / 100 );
      }
      // ctx.stroke();
  }

  anim(){
      this.axis = Math.random() < 0.5;
      TweenMax.fromTo( this, .5, { s: 0 }, { s: 100, delay: Math.random() } )
  }
}

let rects = [];

function splitRects( n ){
  rects = rects.map( rect => rect.split( Math.random() * 4 | 0, Math.random() ) );
  rects = flatten( rects );

  if( --n ) splitRects( n );
}

let red = true;
const anim = () => {
  rects = [];
  rects.push( new Rect( 0, 0, w, h ) );
  splitRects( 1 + Math.random() * 12 | 0 );

  ctx.fillStyle = red ? 'red' : 'black';
  red = !red;
  rects.forEach( rect => rect.anim() );
};
anim();
setInterval( anim, 4000 );


( function display(){
  requestAnimationFrame( display );
  rects.forEach( rect => rect.display() );
} )();
