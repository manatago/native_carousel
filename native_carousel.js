class NativeCarousel{
    constructor(id,height=300){
        var this_obj = this;
        //div要素を取得する
        this.carousel = document.getElementById(id);
        //ul要素を取得する
        this.ul = this.carousel.children[0];
        this.left_now=0;
        this.direction='';
        //ページ番号
        this.page=0;
        //次のページに移動するかどうか
        this.pageChange=false;
        //次のページに移動する際の割合
        this.pageChangeRatio=0.1;

        //li要素を取得する
        this.lis = this.ul.children;
        console.log(this.lis);

        //高さを取得
        this.height=height;
        this.setStyle();

        window.addEventListener('resize',function(){
            this_obj.setStyle();
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
            //this_obj.left_now = this_obj.left();
            if(this_obj.pageChange===true){
                if(this_obj.direction==='left'){
                    this_obj.page--;
                }else{
                    this_obj.page++;
                }
                if(this_obj.page<0){
                    this_obj.page=0;
                }else if(this_obj.page>=this_obj.lis.length-1){
                    this_obj.page=this_obj.lis.length-1;
                }
            }
            this_obj.ul.style.transition='left 0.5s';
            this_obj.ul.style.left = -(this_obj.page*this_obj.px2num(this_obj.carousel.width))+'px';
            setTimeout(function(){
                this_obj.ul.style.transition='left 0s';
            },500);
            this_obj.left_now = -(this_obj.page*this_obj.px2num(this_obj.carousel.width));
            this_obj.pageChange=false;
        })
    }


    left(){
        return Number(this.ul.style.left.replace('px',''))
    }

    slide(e){
        var new_left = this.left_now + (e.changedTouches[0].clientX-this.startX);
        if(new_left>0){
            new_left=0;
        }else if(new_left <  -(this.px2num(this.carousel.width)*(this.lis.length-1))){
            new_left=-(this.px2num(this.carousel.width)*(this.lis.length-1));
        }
        this.ul.style.left = new_left+'px';
        //方向の取得
        if(e.changedTouches[0].clientX-this.startX>0){
            this.direction='left';
        }else{
            this.direction='right';
        }
        //ページを変更するかどうか
        if(Math.abs(e.changedTouches[0].clientX-this.startX)>this.px2num(this.carousel.width)*this.pageChangeRatio){
            this.pageChange=true;
        }
    }



    px2num(str){
        return Number(str.replace('px',''))
    }

    setStyle(){
        this.carousel.width = this.carousel.parentNode.clientWidth +'px';
        this.carousel.style.overflow='hidden';
        this.ul.style.position='relative';
        this.ul.style.padding='0';
        this.ul.style.margin='0';
        this.ul.style.width = this.carousel.clientWidth*this.lis.length+'px';
        for(const li of this.lis){
            li.style.float='left';
            li.style.width=this.carousel.clientWidth+'px';
            li.style.listStyle='none';
            li.style.height=this.height+'px';
            li.style.backgroundRepeat='no-repeat';
            li.style.backgroundSize='cover';
            li.style.backgroundPosition='center';
        }
    }

    

}