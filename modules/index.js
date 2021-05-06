import Drr from './dragResizeRotate.js';

// Arguments -->
// container [string] Default body
// selector [string] Default div
// callback [function] Default empty
// options [JSON] -->

/*
Options:
elems class // required
callback // optional
wrapper mark border color -> red  // optional
wrapper drr border color -> yellow  // optional
diagonal color buttons -> orange  // optional
horizontal color buttons -> green  // optional
vertical color buttons -> purple  // optional
magnet rotate tolerance -> 2  // optional
degrees to tolerance list -> [0,45,90,135,180,225,270,315,360]  // optional

Sample : 

*/

new Drr('.drr',(data)=>{showValues(data)},{
    wrapperMarkBorderColor:'orange',
    wrapperDrrBorderColor:'black',
    diagonalColorButtons:'white',
    horizontalColorButtons:'white',
    verticalColorButtons:'white',
    magnetRotateTolerance:4
});
const showValues=(values)=>
{
        document.getElementById('show-id').innerHTML=values.elemId;
        document.getElementById('show-top').innerHTML=values.top;
        document.getElementById('show-left').innerHTML=values.left;
        document.getElementById('show-real-top').innerHTML=values.realTop;
        document.getElementById('show-real-left').innerHTML=values.realLeft;
        document.getElementById('show-width').innerHTML=values.width;
        document.getElementById('show-height').innerHTML=values.height;
        document.getElementById('show-real-width').innerHTML=values.realWidth;
        document.getElementById('show-real-height').innerHTML=values.realHeight;
        document.getElementById('show-angle').innerHTML=values.angle;
        // document.getElementById('show-matrix').innerHTML=values.matrix;
        document.getElementById('show-state').innerHTML=values.state;
};