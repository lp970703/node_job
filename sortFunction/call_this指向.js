function myfunc1(){
    this.name = 'Lee';
    this.myTxt = function(txt) {
        console.log( 'i am',txt );
    }
}

function myfunc2(){
    myfunc1.call(this);
}

var myfunc3 = new myfunc2();
myfunc3.myTxt('Geing'); // i am Geing
console.log (myfunc3.name);	// Lee