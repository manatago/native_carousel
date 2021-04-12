class NativeSlide{
    //div要素を取得する
    constructor(id){
        this.carousel = document.getElementById(id);
        //ul要素を取得する
        this.ul = this.carousel.children[0];
        //現在の左位置
        this.left_now=0;
        //スワイプの方向
        this.direction='';
        //マウスを押した状態かどうか
        this.mouseOn=false;
        //ページ番号
        this.page=0;
        //次のページに移動するかどうか
        this.pageChange=false;
        //次のページに移動する際の割合
        this.pageChangeRatio=0.1;
        //li要素を取得する
        this.lis = this.ul.children;
    }

    setStyle(){
        //全体の幅
        this.carousel.width = this.carousel.parentNode.clientWidth +'px';
        this.carousel.style.overflow='hidden';
        //UL要素のスタイル
        this.ul.style.position='relative';
        this.ul.style.padding='0';
        this.ul.style.margin='0';
        this.ul.style.width = this.carousel.clientWidth*this.lis.length+'px';
        this.ul.style.left = -(this.page * this.carousel.clientWidth) + 'px';
        //li要素のスタイル
        for(const li of this.lis){
            li.style.float='left';
            li.style.width=this.carousel.clientWidth+'px';
            li.style.listStyle='none';
            li.style.height=this.height+'px';
            li.style.backgroundRepeat='no-repeat';
            li.style.backgroundSize='cover';
            if(li.getAttribute('bg_position')!==null){
                li.style.backgroundPosition=li.getAttribute('bg_position');
            }else{
                li.style.backgroundPosition='center 0px';
            }
        }

    }
}


class NativeCarousel extends NativeSlide{
    constructor(id,height=300){
        super(id);
        var this_obj = this;

        //高さを取得
        this.height=height;
        //スタイルをセット
        this.setStyle();
        this.span_out();
        this.textFall();

        window.addEventListener('resize',function(){
            this_obj.setStyle();
        })

        //クリックイベント
        this.carousel.addEventListener('mousedown',function(e){
            e.preventDefault();
            this_obj.startX =e.clientX;
            this_obj.mouseOn=true;
        })

        this.carousel.addEventListener('mousemove',function(e){
            e.preventDefault();
            if(this_obj.mouseOn===true){
                this_obj.slide(e,true);
            }
        })

        this.carousel.addEventListener('mouseup',function(){
            this_obj.mouseOn=false;
            this_obj.getNextPage();
            this_obj.changePage();
        })

        //タッチイベント
        this.carousel.addEventListener('touchstart',function(e){
            e.preventDefault();
            this_obj.startX=e.touches[0].pageX;
        })
        this.carousel.addEventListener('touchmove',function(e){
            e.preventDefault();
            this_obj.slide(e);
        },false);
        this.carousel.addEventListener('touchend',function(e){
            e.preventDefault();
            this_obj.getNextPage();
            this_obj.changePage();
        })
    }

    changePage(){
        var this_obj = this
        this.ul.style.transition='left 0.5s';
        this.ul.style.left = -(this.page*this.px2num(this.carousel.width))+'px';
        setTimeout(function(){
            this_obj.ul.style.transition='left 0s';
        },500);
        this.left_now = -(this.page*this.px2num(this.carousel.width));
        this.pageChange=false;
        this.textFall();
    }

    textFall(){
        var this_obj=this;
        this.span_out();
        var spans = this.lis[this.page].getElementsByTagName('span');
        for(const span of spans){
            span.style.transition='top 1s ease';
            setTimeout(function(){
                span.style.top= this_obj.height/2+'px';
            },100);
            
            setTimeout(function(){
                span.style.transition='top 0s';
            },1100)
        }
        
    }

    getNextPage(){
        if(this.pageChange===true){
            if(this.direction==='left'){
                this.page--;
            }else{
                this.page++;
            }
            if(this.page<0){
                this.page=0;
            }else if(this.page>=this.lis.length-1){
                this.page=this.lis.length-1;
            }
        } 
    }


    left(){
        return Number(this.ul.style.left.replace('px',''))
    }

    slide(e,mouse=false){
        if(mouse===false){
            var pointerX = e.changedTouches[0].clientX;
        }else{
            var pointerX = e.clientX;
        }
        var new_left = this.left_now + (pointerX-this.startX);
        if(new_left>0){
            new_left=0;
        }else if(new_left <  -(this.px2num(this.carousel.width)*(this.lis.length-1))){
            new_left=-(this.px2num(this.carousel.width)*(this.lis.length-1));
        }
        this.ul.style.left = new_left+'px';
        //方向の取得
        if(pointerX-this.startX>0){
            this.direction='left';
        }else{
            this.direction='right';
        }
        //ページを変更するかどうか
        if(Math.abs(pointerX-this.startX)>this.px2num(this.carousel.width)*this.pageChangeRatio){
            this.pageChange=true;
        }
    }



    px2num(str){
        return Number(str.replace('px',''))
    }

    span_out(){
        for(const li of this.lis){
            var spans =li.getElementsByTagName('span')
            for(const span of spans){
                Object.assign(span.style,{
                    display: 'block',
                    position: 'relative',
                    top:'-150px',
                    fontSize:'30px',
                    color:'black'
                })
                if(span.getAttribute('color')){
                    span.style.color=span.getAttribute('color');
                }
                if(span.getAttribute('font_size')){
                    span.style.fontSize=span.getAttribute('font_size')+'px';
                }
                span.style.transform='rotate(-5deg)';
                span.style.marginLeft='20px';
                span.style.fontFamily='serif';
                //span.style.backgroundColor='pink';
                span.style.letterSpacing='4px';
                span.style.textShadow='2px  2px 1px ';
            }
        }
    }
}