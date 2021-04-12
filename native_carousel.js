class NativeSlideStyle{
    constructor(id,args=new Object){
        let this_obj = this;
        //対象の要素を取得する
        this.carousel=document.getElementById(id);
        //ul要素を取得する
        this.ul = this.carousel.children[0];
        //li要素の一覧を取得する
        this.lis = this.ul.children;
        //現在のページを定義
        this.page = 0;
        //マウスをクリックしているかどうか
        this.mouseOn=false;

        
        //基本パラメーターを設定する
        this.basicParameter();
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
        if(leftNow-diff <= 0 && leftNow-diff >= (this.lis.length-1)*this.carouselWidth){
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
        this.ul.style.transition = 'left '+this.transitionTime+'s ease';
        setTimeout(function(){
            this_obj.ul.style.left = -(this_obj.carouselWidth * this_obj.page)+'px';
            setTimeout(function(){
            this_obj.ul.style.transition ='left 0s';
            },this.transitionTime*1000)
        },100);
    }    

    setStyle(){
        this.setCarouselStyle();
        this.setUlStyle();
        this.setLiStyle();
        this.setAspectRatio();
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
            //transition:'left '+this.transitionTime+'s ease'
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
    basicParameter(){
        let params ={
            //カルーセルの基本の高さ設定。ピクセル値を文字列で入力
            height:'300px',
            width:'100%',
            backgroundPosition:'center',
            backgroundSize:'cover',
            aspectRatio: null,
            direction:null,
            transitionTime:1
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


class NativeCarousel extends NativeSlideStyle{
    constructor(id,args=new Object){
        super(id,args);
    }
}