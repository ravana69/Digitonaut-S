function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.add = function() {

    if (arguments.length === 1 && typeof arguments[0] === "object") {
      // should do something for Array.isArray
      this.x += arguments[0].x;
      this.y += arguments[0].y;
    } else if (arguments.length === 2) {
      this.x += arguments[0];
      this.y += arguments[1];
    }
    return this;
  }

  this.sub = function() {
    if (arguments.length === 1 && typeof arguments[0] === "object") {
      this.x -= arguments[0].x;
      this.y -= arguments[0].y;
    } else if (arguments.length === 2) {
      this.x -= arguments[0];
      this.y -= arguments[1];
    }
    return this;
  }

  this.mult = function(n) { // scale   
    this.x *= n || 0;
    this.y *= n || 0;
    return this;
  }

  this.div = function(n) { // scale
    if(n != 0){
    this.x /= n;
    this.y /= n;
    }
    return this;
  }

  this.set = function() {
    if (arguments.length === 2) {
      this.x = arguments[0];
      this.y = arguments[1];
    }
  }
  
  this.magSq = function() {
    return (this.x * this.x + this.y * this.y)
  } 
  
  this.mag = function() {
    return Math.sqrt(this.magSq());
  }
  
  this.limit = function(n) {
   
  var mSq = this.magSq();
  if(mSq > n*n) {
    this.div(Math.sqrt(mSq)); //normalize it
    this.mult(n);
  }
  return this;
  }
  
  this.setMag = function(n){
    /*
    this.normalize();
    this.mult(n);
    */
    return this.normalize().mult(n);
  }

  this.dot = function(vector) {
    //Calculates the dot product of two vectors
    //https://www.mathsisfun.com/algebra/vectors-dot-product.html
    return (this.x * vector.x + this.y * vector.y)
  }

  this.dist = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;  
  }

  this.normalize = function() {
      /*
      var theta = Math.atan2(this.y, this.x); 
      this.x = Math.cos(theta);
      this.y = Math.sin(theta);
      */
    return this.div(this.mag());
  }
  
  this.copy = function() {
  return new Vector(this.x,this.y);
} 
  
}


/////////////////////////////////


Vector.prototype.angleBetween = function(vector) {
  return (Math.acos(this.dot(vector) / (this.mag() * vector.mag())));
}

Vector.randomNormalizedVector = function(){//static method
  var theta = Math.random() *360 *rad;
  var x = Math.cos(theta);
  var y = Math.sin(theta);
  return new Vector(x,y)
}