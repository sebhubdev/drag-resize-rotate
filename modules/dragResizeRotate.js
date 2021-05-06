class GetCoords
{          
      constructor(elem)
      {
          this.l=elem.offsetLeft;
          this.t=elem.offsetTop;
          this.w=elem.offsetWidth;
          this.h=elem.offsetHeight;
          this.r=this.l+this.w;
          this.b=this.t+this.h; 
          this.cx=this.l+(this.w/2);
          this.cy=this.t+(this.h/2);       
          this.trns=getComputedStyle(elem).getPropertyValue('transform');
          this.crds=elem.getBoundingClientRect();
          this.rl=this.crds.left;
          this.rr=this.crds.right;
          this.rb=this.crds.bottom;
          this.rt=this.crds.top;
          this.rw=this.rr-this.rl;
          this.rh=this.rb-this.rt;
          this.rcx=this.rl+(this.rw/2);
          this.rcy=this.rt+(this.rh/2);
      }
}


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

class Drr
{
        constructor(selector='div',callback=(data)=>{},options=null)
        {
            this.selector=selector;
            this.callback=callback;
            this.wrapperMarkBorderColor='red';
            this.wrapperDrrBorderColor='yellow';
            this.diagonalColorButtons='orange';
            this.horizontalColorButtons='green';
            this.verticalColorButtons='purple';
            this.magnetRotateTolerance=2;
            this.degreesMagnetList=[0,45,90,135,180,225,270,315,360];
            if(options!=null)
            {
                for(let option in options)
                {
                    this[option]=options[option];
                }
            }
            this.activateDrr(this.selector);
        }
        activateDrr=(selector)=>
        {
            this.addStyles();
            let elems=document.querySelectorAll(selector);
            elems.forEach(elem=>{
                elem.addEventListener('mouseenter',()=>this.createWrapperMark(elem));
                elem.classList.add('drr-elem');
            });
        }
        addStyles=()=>
        {
            let styleTag=document.createElement('style');
            document.body.appendChild(styleTag);
            let styles=`
                        .wrapper-mark 
                        {
                            position:absolute; border:2px solid ${this.wrapperMarkBorderColor}; 
                            z-index:999990; box-sizing: border-box;
                        }
                        .wrapper-drr 
                        {
                            position:absolute; border:2px solid ${this.wrapperDrrBorderColor}; 
                            z-index:999999; box-sizing: border-box;
                        }
                        .drr-btn 
                        {
                            transition:background-color 0.5s ease,opacity 0.5s ease; border:none; box-shadow: 1px 1px 1px #000; 
                            box-sizing: border-box; position: absolute; z-index: 999999;
                        }
                        .drr-btn:hover {background-color:red;}
                        .drr-btn-hor {height:10px; width:4px; background-color: ${this.horizontalColorButtons};}
                        .drr-btn-hor-left {left:-4px;}
                        .drr-btn-hor-right {right:-4px;}
                        .drr-btn-vert {width:10px; height:4px; background-color: ${this.verticalColorButtons};}
                        .drr-btn-vert-top {top:-4px;}
                        .drr-btn-vert-bottom {bottom:-4px;}
                        .drr-btn-diag {height:10px; width:10px; border-radius: 10px; background-color: ${this.diagonalColorButtons};}
                        .drr-btn-diag-top-left {left:-7px; top:-7px}
                        .drr-btn-diag-top-right {right:-7px; top:-7px;}
                        .drr-btn-diag-bottom-left {bottom:-7px; left:-7px;}
                        .drr-btn-diag-bottom-right {bottom:-7px; right:-7px;}
                        .drr-btn-rot {height:30px; opacity:0; width:30px; border-radius: 100px; background-color: black;}
                        .drr-btn-rot:hover {opacity:0.3}
                        .drr-btn-rot-top-left {left:-30px; top:-30px}
                        .drr-btn-rot-top-right {right:-30px; top:-30px;}
                        .drr-btn-rot-bottom-left {bottom:-30px; left:-30px;}
                        .drr-btn-rot-bottom-right {bottom:-30px; right:-30px;}
                        `;
            styleTag.append(styles);
        }
        createWrapperMark=(elem)=>
        {
            let elemId=elem.id;            
            this.removeWrapperMark();
            let wrapper=document.createElement('span');
            wrapper.classList.add('wrapper-mark');
            wrapper.setAttribute('draggable','false');
            wrapper.dataset.wrapper=JSON.stringify({elemId:elemId});
            document.body.appendChild(wrapper);
            this.positionWrapper(elem,wrapper);
            wrapper.addEventListener('mouseout',this.removeWrapperMark);
            wrapper.addEventListener('mousedown',(evt)=>this.createWrapperDrr(evt));
        }
        removeWrapperMark=()=>
        {        
            let wrappers=Array.prototype.slice.call(document.querySelectorAll('.wrapper-mark'),0);
            wrappers.forEach(wrapper=>{
                wrapper.remove();
                wrapper.removeEventListener('mouseout',this.removeWrapperMark);
            });
        }
        createWrapperDrr=(evt)=>
        {
            this.removeWrapperDrr();
            let wrapperMark=document.querySelector('.wrapper-mark');
            let wrapperDrr=document.createElement('span');
            wrapperDrr.classList.add('wrapper-drr');
            wrapperDrr.setAttribute('draggable','false');
            wrapperDrr.dataset.wrapper=wrapperMark.dataset.wrapper;
            document.body.appendChild(wrapperDrr);
            this.positionWrapper(wrapperMark,wrapperDrr);            
            this.removeWrapperMark();
            this.moveElement(evt,wrapperDrr); 
            this.addBtns(wrapperDrr);
            wrapperDrr.addEventListener('mousedown',(evt)=>this.moveElement(evt,wrapperDrr));
        }
        removeWrapperDrr=()=>
        {        
            let wrappers=Array.prototype.slice.call(document.querySelectorAll('.wrapper-drr'),0);
            wrappers.forEach(wrapper=>{
                wrapper.remove();
                wrapper.removeEventListener('mouseout',this.removeWrapperMark);
            });
        }
        addBtns=(wrapper)=>
        {
                let classList=[
                    'drr-btn-res drr-btn-hor drr-btn-hor-left',
                    'drr-btn-res drr-btn-hor drr-btn-hor-right',
                    'drr-btn-res drr-btn-vert drr-btn-vert-top',
                    'drr-btn-res drr-btn-vert drr-btn-vert-bottom',
                    'drr-btn-res drr-btn-diag drr-btn-diag-top-left',
                    'drr-btn-res drr-btn-diag drr-btn-diag-top-right',
                    'drr-btn-res drr-btn-diag drr-btn-diag-bottom-left',
                    'drr-btn-res drr-btn-diag drr-btn-diag-bottom-right',
                    'drr-btn-rot drr-btn-rot-top-left',
                    'drr-btn-rot drr-btn-rot-top-right',
                    'drr-btn-rot drr-btn-rot-bottom-left',
                    'drr-btn-rot drr-btn-rot-bottom-right'
                ];
                classList.map(classBtn=>{
                    let btn=document.createElement('span');
                    btn.className='drr-btn '+classBtn;                    
                    btn.setAttribute('draggable','false');
                    wrapper.appendChild(btn);
                });
                this.positionBtns(wrapper);
                this.activateResize();
                this.activateRotation();
        }
        positionBtns=(wrapper)=>
        {
            let wrpC=new GetCoords(wrapper);
            let horBtns=document.querySelectorAll('.drr-btn-hor');
            horBtns.forEach(btn=>{
                let btnC=new GetCoords(btn);
                btn.style.top=(wrpC.h/2)-btnC.h/2-2;
            });
            let vertBtns=document.querySelectorAll('.drr-btn-vert');
            vertBtns.forEach(btn=>{
                let btnC=new GetCoords(btn);
                btn.style.left=(wrpC.w/2)-btnC.w/2-2;
            })
        }
        activateResize=()=>
        {
            let btns=document.querySelectorAll('.drr-btn-res');
            btns.forEach(btn=>{
                btn.addEventListener('mousedown',(evt)=>this.resizeElem(evt,btn));
            });
        }
        
        activateRotation=()=>
        {
            let btns=document.querySelectorAll('.drr-btn-rot');
            btns.forEach(btn=>{
                btn.addEventListener('mousedown',(evt)=>this.rotateElem(evt,btn));
            });
        }
        moveElement=(evt,wrapper)=>
        {         
            evt.stopPropagation();
            evt.preventDefault();  
            let elemId=JSON.parse(wrapper.dataset.wrapper).elemId;
            let elem=document.getElementById(elemId);
            let top,left,difx,dify;
            difx=evt.clientX-elem.offsetLeft;
            dify=evt.clientY-elem.offsetTop;
            const handleMove=(evt)=>{ 
                top=evt.clientY-dify;
                left=evt.clientX-difx;
                elem.style.top=top;
                elem.style.left=left;
                this.positionWrapper(elem,wrapper);
                this.removeWrapperMark();                
                this.sendData(elem,'ondrag');  
            }
            const stopMove=()=>{
              document.removeEventListener('mousemove',handleMove,true);
              document.removeEventListener('mouseup',stopMove,true);              
              this.sendData(elem,'dropped');  
            }
            document.addEventListener('mousemove',handleMove,true);
            document.addEventListener('mouseup',stopMove,true);
        }
        positionWrapper=(target,wrapper)=>
        {
            let targetCoords=new GetCoords(target);
            wrapper.style.top=targetCoords.t;
            wrapper.style.left=targetCoords.l;
            wrapper.style.width=targetCoords.w;
            wrapper.style.height=targetCoords.h;
            wrapper.style.transform=targetCoords.trns;
        }
        resizeElem=(evt,btn)=>
        {
            evt.stopPropagation();
            evt.preventDefault();
            let wrapper=btn.parentNode;
            let elemId=JSON.parse(wrapper.dataset.wrapper).elemId;
            let elem=document.getElementById(elemId);
            let elemC=new GetCoords(elem);
            let btnC=new GetCoords(btn); 
            let angle=this.getAngleFromMatrix(elemC.trns);
            let leftDiff=elemC.l-elemC.rl;
            let topDiff=elemC.t-elemC.rt;            
            let clkXDiff=evt.clientX-btnC.rcx;
            let clkYDiff=evt.clientY-btnC.rcy; 
            let legX=(elemC.rcx-btnC.rcx)*2;
            let legY=(elemC.rcy-btnC.rcy)*2;
            let oppositX=btnC.rcx+legX;
            let oppositY=btnC.rcy+legY;            
            let diffX=oppositX-elemC.rl;
            let diffY=oppositY-elemC.rt;           
            let initHypo=Math.sqrt(Math.pow(legX,2)+Math.pow(legY,2));    
            const handleResize=(evt)=>
            { 
                let expectedX=evt.clientX-clkXDiff;
                let expectedY=evt.clientY-clkYDiff;
                legX=(oppositX-expectedX);
                legY=(oppositY-expectedY);
                let expectedHypo=Math.sqrt(Math.pow(legX,2)+Math.pow(legY,2));
                let proportion=initHypo/expectedHypo;   
                let width=elemC.w/proportion;
                let height=elemC.h/proportion;
                let left=elemC.rl-(diffX/proportion)+diffX+(leftDiff/proportion);   
                let top=elemC.rt+diffY-(diffY/proportion)+(topDiff/proportion);
                if(btn.classList.contains('drr-btn-hor') || btn.classList.contains('drr-btn-vert'))
                {              
                    if(btn.classList.contains('drr-btn-vert'))
                    {
                        width=elemC.w;
                        proportion=elemC.h/height;
                    }
                    if(btn.classList.contains('drr-btn-hor'))
                    {
                        height=elemC.h;                        
                        proportion=elemC.w/width;
                    }
                    (angle>90 && angle<180) ? angle=angle-180
                    : (angle<-90) ? angle+=180 : false;
                    let hypo=Math.sqrt((width**2)+(height**2));
                    let angleDiff=Math.acos(width/hypo)*(180/Math.PI)
                    let radns=Math.PI/180*(Math.abs(angle)-angleDiff);
                    let cateto=Math.abs(hypo*Math.cos(radns));                    
                    let radns2=Math.PI/180*(Math.abs(angle)+angleDiff);
                    let cateto2=Math.abs(hypo*Math.sin(radns2));
                    top=((cateto2-height)/2+elemC.rt)+(oppositY-btnC.rcy)-(oppositY-btnC.rcy)/proportion;
                    left=((cateto-width)/2+elemC.rl)+(oppositX-btnC.rcx)-(oppositX-btnC.rcx)/proportion;
                    if(oppositY<=btnC.rcy)top=(cateto2-height)/2+elemC.rt;
                    if(oppositX<=btnC.rcx)left=(cateto-width)/2+elemC.rl;
                }     
                elem.style.width=width;
                elem.style.height=height;                
                elem.style.top=top;
                elem.style.left=left;               
                this.positionWrapper(elem,wrapper);
                this.positionBtns(wrapper);
                this.removeWrapperMark();                
                this.sendData(elem,'onresize');  
            }
            const stopResize=()=>
            {
                document.removeEventListener('mousemove',handleResize,true);
                document.removeEventListener('mouseup',stopResize,true);
                this.sendData(elem,'resized');                
            }            
            document.addEventListener('mousemove',handleResize,true);
            document.addEventListener('mouseup',stopResize,true);
        }
        rotateElem=(evt,btn)=>
        {
            evt.stopPropagation();
            evt.preventDefault();
            let wrapper=btn.parentNode;
            let elemId=JSON.parse(wrapper.dataset.wrapper).elemId;
            let elem=document.getElementById(elemId);
            let elemC=new GetCoords(elem);
            let angleStart=this.getAngleFromMatrix(elemC.trns);
            let leg1=evt.clientX-elemC.cx;
            let leg2=evt.clientY-elemC.cy;            
            let angleDif=Math.round(Math.atan2(leg2, leg1) * (180/Math.PI));
            let to=this.magnetRotateTolerance;
            let degreesList=this.degreesMagnetList;
            const handleRotate=(evt)=>
            {
                leg1=evt.clientX-elemC.cx;
                leg2=evt.clientY-elemC.cy; 
                let currAngle=Math.atan2(leg2, leg1) * (180/Math.PI);
                let newAngle=currAngle-angleDif+angleStart;
                if(newAngle<0)newAngle+=360;
                degreesList.map(angle=>{if(newAngle>=angle-to && newAngle<=angle+to)newAngle=angle;});
                elem.style.transform='rotate('+newAngle+'deg)';
                this.positionWrapper(elem,wrapper);
                this.removeWrapperMark();
                this.sendData(elem,'onrotate');
            }
            const stopRotate=()=>
            {
                document.removeEventListener('mousemove',handleRotate,true);
                document.removeEventListener('mouseup',stopRotate,true);                
                this.sendData(elem,'rotated');
            }            
            document.addEventListener('mousemove',handleRotate,true);
            document.addEventListener('mouseup',stopRotate,true);
        }
        getAngleFromMatrix=(matrix)=>
        {
            if(typeof matrix === 'string' && matrix !== 'none')
            {
                let values = matrix.split('(')[1].split(')')[0].split(',');
                let angle = Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI));
                return angle;
            }
            let angle = 0;
            return angle;            
        }
        sendData=(elem,state)=>
        {            
            let v=new GetCoords(elem); 
            let angle=this.getAngleFromMatrix(v.trns)
            if(angle<0)angle+=360;               
                this.callback(
                    {
                        elemId:elem.id,
                        top:v.t.toFixed(2),
                        left:v.l.toFixed(2),
                        realTop:v.rt.toFixed(2),
                        realLeft:v.rl.toFixed(2),
                        width:v.w.toFixed(2),
                        height:v.h.toFixed(2),
                        realWidth:v.rw.toFixed(2),
                        realHeight:v.rh.toFixed(2),
                        angle:angle.toFixed(2),
                        matrix:v.trns,
                        state:state
                    }
                );
        }
}
export default Drr;
