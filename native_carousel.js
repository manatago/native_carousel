class NativeSlideStyleById{
    constructor(id,args=new Object){
        let this_obj = this;
        //対象の要素を取得する
        if(typeof(id)==='string'){
            this.carousel=document.getElementById(id);
        }else if(typeof(id)==='object'){
            this.carousel=id;
        }
        //ul要素を取得する
        this.ul = this.carousel.children[0];
        //li要素の一覧を取得する
        this.lis = this.ul.children;
        //現在のページを定義
        this.page = 0;
        //マウスをクリックしているかどうか
        this.mouseOn=false;

        
        //基本パラメーターを設定する
        this.setBasicParameter();
        //受け取ったパラメーターがあれば設定する
        this.setObjectParams(args);

        //スタートイベント
        this.carousel.addEventListener('touchstart',function(e){
            this_obj.startEvent(e);
        })
        this.carousel.addEventListener('mousedown',function(e){
            this_obj.startEvent(e);
            this.mouseOn=true;
        })

        //終了イベント
        this.carousel.addEventListener('touchend',function(e){
            this_obj.endEvent(e);
        })
        this.carousel.addEventListener('mouseup',function(e){
            this_obj.endEvent(e);
            this.mouseOn=false;
        })
        
        //移動イベント
        this.carousel.addEventListener('touchmove',function(e){
            this_obj.moveEvent(e);
        })
        this.carousel.addEventListener('mousemove',function(e){
            if(this.mouseOn===true){
                this_obj.moveEvent(e);
            }
        })


        //スタイルを設定する
        this.setStyle();
        window.addEventListener('resize',function(){
            this_obj.setStyle();
            this_obj.slide();
        })
        this.slide();
    }

    moveEvent(e){
        //現在のleft値を取得する
        let leftNow = -(this.carouselWidth * this.page);
        let diff = 0;
        if(e.type==='touchmove'){
            diff = this.startX - e.changedTouches[0].pageX;
        }else if(e.type==='mousemove'){
            diff = this.startX - e.clientX;
        }
        if(leftNow-diff <= 0 && leftNow-diff >= -(this.lis.length-1)*this.carouselWidth){
            this.ul.style.left = leftNow - diff+'px';
        }
    }

  

    endEvent(e){
        e.preventDefault();
        let diff=0;
        if(e.type==='touchend'){
            diff = this.startX - e.changedTouches[0].pageX;
            if(diff > 10){
                this.page++;
            }else if(diff<-10){
                this.page--
            }
        }else if(e.type==='mouseup'){
            diff = this.startX - e.clientX;
            if(diff > 10){
                this.page++;
            }else if(diff<-10){
                this.page--
            }
        }
        //現在のページにスライドする
        this.slide();
    }

    startEvent(e){
        e.preventDefault();
        if(e.type==='touchstart'){
            this.startX=e.touches[0].pageX;
        }else if(e.type==='mousedown'){
            this.startX =e.clientX;
        }
    }


    slide(){
        let this_obj = this;
        if(this.page<0){
            this.page = 0;
        }else if (this.page>= this.lis.length){
            this.page = this.lis.length-1;
        }
        this.ul.style.transition = 'left '+this.transitionTime+'s';
        setTimeout(function(){
            this_obj.ul.style.left = -(this_obj.carouselWidth * this_obj.page)+'px';
            this_obj.setBlackCircle();
            setTimeout(function(){
                this_obj.ul.style.transition ='left 0s';
                //文字のスライドイン
                if(this_obj.textFall!==undefined){
                    this_obj.textFall();
                }
            },this.transitionTime*1000)
        },50);
    }    

    setStyle(){
        this.setCarouselStyle();
        this.setUlStyle();
        this.setLiStyle();
        this.setAspectRatio();
        this.setPointer();
    }

    setBlackCircle(){
        let pointers = this.carousel.getElementsByTagName('div')[0];
        let spans = pointers.getElementsByTagName('span');
        for(var i=0;i<this.lis.length;i++){
            if(i===this.page){
                spans[i].innerHTML='&#9679;';
            }else{
                spans[i].innerHTML='&#9675;';
            }
        }
    }

    setPointer(){
        if(this.carousel.getElementsByTagName('div')[0]){
            this.carousel.getElementsByTagName('div')[0].remove();
        }
        let pointers = document.createElement('div');
        for(let i = 0; i<this.lis.length;i++){
            let span = document.createElement('span');
            span.innerHTML='&#9675;';
            span.style.display='inline-block';
            span.style.width= 100/this.lis.length + '%';
            pointers.appendChild(span);
        }
        pointers.style.width='30%';
        pointers.style.fontSize='15px';
        pointers.style.fontWeight='bold';
        pointers.style.color=this.pointerColor;
        pointers.style.height='20px';
        pointers.style.position='absolute';
        pointers.style.left ='35%';
        pointers.style.bottom='20px';
        pointers.style.textAlign='center';
        pointers.style.zIndex='10';
        this.carousel.appendChild(pointers);
        this.setBlackCircle();
    }

    //アスペクト比を設定した場合の高さの再調整
    setAspectRatio(){
        if (this.aspectRatio !== null){
            this.carousel.style.height = this.carouselWidth * this.aspectRatio+10+'px';
            for(let li of this.lis){
                li.style.height = this.carouselWidth * this.aspectRatio+'px';
            }
        }
    }

    //カルーセルのスタイルを指定する
    setCarouselStyle(){
        Object.assign(this.carousel.style,{
            position: 'relative',
            width: this.width,
            height: this.height,
            overflow: 'hidden',
            margin: '0 auto'
        })
    }

    //ulのスタイルを指定する
    setUlStyle(){
        //親要素の幅をピクセルで取得する
        this.carouselWidth = this.carousel.clientWidth;
        Object.assign(this.ul.style,{
            paddingLeft:0,
            height: this.height,
            margin: 0,
            width: this.lis.length * this.carouselWidth +'px',
            position:'relative',
            left:'0px'
        })
    }
    //liのスタイルを指定する
    setLiStyle(){
        for(let li of this.lis){
            Object.assign(li.style,{
                listStyle:'none',
                width: this.carouselWidth + 'px',
                height: this.height,
                float:'left',
                backgroundRepeat: 'no-repeat',
                backgroundSize:this.backgroundSize,
                backgroundPosition: this.backgroundPosition
            })
        }
    }
    //基本的なパラメータを定義して代入する
    setBasicParameter(){
        let params ={
            //カルーセルの基本の高さ設定。ピクセル値を文字列で入力
            height:'300px',
            width:'100%',
            backgroundPosition:'center',
            backgroundSize:'cover',
            aspectRatio: null,
            direction:null,
            transitionTime:0.5,
            pointerColor:'white'
        }
        this.setObjectParams(params);
    }


    setObjectParams(params){
        let this_obj = this
        Object.keys(params).forEach(function(key){
            //文字列の場合とそうでない場合でevalを分ける
            if (typeof(params[key]) === 'string'){
                //文字列型だとしても、数字の場合は強制的に型変換する
                if(isNaN(params[key])===true){
                    eval('this_obj.' + key + '=\'' + params[key]+'\'');
                }else{
                    eval('this_obj.' + key + '=' + params[key]);
                }
            }else{
                eval('this_obj.' + key + '=' + params[key]);
            }
        }) 
    }

}


class NativeCarouselbyId extends NativeSlideStyleById{
    constructor(id,args=new Object){
        super(id,args);
        this.setSpanParameter();
        //受け取ったパラメーターがあれば設定する
        this.setObjectParams(args);
        this.setSpanStyle();
        if(this.autoSlide===true){
            this.allSlide();
        }
    }
    allSlide(){
        let this_obj=this;
        let interval_id;
        interval_id = setInterval(function(){
            this_obj.page++;
            this_obj.slide();
            if(this_obj.page === this_obj.lis.length-1){
                clearInterval(interval_id);
            }
            console.log('test');
        },3000)
    }
    textFall(){
        this.spanOut();
        let spans = this.lis[this.page].getElementsByTagName('span');
        for(let span of spans){
            span.style.top='100px';
        }
    }
    spanOut(){
        for(let li of this.lis){
            let spans = li.getElementsByTagName('span');
            for(let span of spans){
                span.style.top='-100px';
            }
        }
    }
    setSpanStyle(){
        for(let li of this.lis){
            let spans = li.getElementsByTagName('span');
            for(let span of spans){
                Object.assign(span.style,{
                    position:'relative',
                    top:'-'+this.height,
                    marginLeft:'10%',
                    display:'block',
                    color: this.fontColor,
                    fontSize: this.fontSize,
                    transition:'top 1s ease',
                    transform: 'rotate('+this.rotate+')',
                    textShadow : "\
                        2px  2px 1px "+this.textShadowColor+",\
                        -2px  2px 1px "+this.textShadowColor+",\
                        2px -2px 1px "+this.textShadowColor+",\
                        -2px -2px 1px "+this.textShadowColor+",\
                        2px  0px 1px "+this.textShadowColor+",\
                        0px  2px 1px "+this.textShadowColor+",\
                        -2px  0px 1px "+this.textShadowColor+",\
                        0px -2px 1px "+this.textShadowColor+"\
                    "
                });
            }
        }
    }
    //基本的なパラメータを定義して代入する
    setSpanParameter(){
        let params ={
            fontSize: '40px',
            textFallTransitionTime:0.5,
            textShadowColor: 'white',
            fontColor: 'green',
            rotate:'-7deg',
            autoSlide:true
        }
        this.setObjectParams(params);
    }
}


//文字がフォールダウンしてくるカルーセル
class NativeCarousel{
    constructor(id,args){
        var objs = document.querySelectorAll(id);
        for(let obj of objs){
            new NativeCarouselbyId(obj,args);
        }
    }
}

//単なる４コマ漫画
class NativeManga{
    constructor(id,args){
        var objs = document.querySelectorAll(id);
        for(let obj of objs){
            new NativeSlideStyleById(obj,args);
        }
    }
}
