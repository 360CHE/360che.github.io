//  分享
window.truckhome_share_config = {
    "viewPosition": "share",
    "viewList": ['weibo', 'qzone', 'wechat'],
    "icon": "https://s.kcimg.cn/wap/images/detail/default.png",
    "link": "http://www.360che.com"
};

$(function() {
    let [$W, $D, $goTopButton] = [$(window), $(document), $('#go_top')];

    // 统计
    var pvTrack = new PvTrack();
    pvTrack.channel = 11;
    pvTrack.channelpage = 83;
    pvTrack.vt = 1;
    pvTrack.track();

    // 回顶部
    $W.on('scroll', () => {
        $goTopButton[$D.scrollTop() > $W.height() ? 'show' : 'hide']();
    })

    $goTopButton.on('click', () => {
        $('html,body').animate({
            scrollTop: 0
        }, 500)
    });

    // Tab切换
    function tabChange(target) {
        target.addClass('current').siblings().removeClass('current')
        $(`#${target.data('rel')}`).addClass('visible').siblings().removeClass('visible')
    }


    // 产品库入口
    let [$proTabs, $choiceView, $miniMap] = [$('#products_tabs'), $('#choice_view_content'), $('#figure_links_mini_map')]

    // 切换
    $proTabs.children().on('mouseenter', function() {
        tabChange($(this))
    });

    // 预览大图
    let viewProductHDPicture = {
        clear (){   // 清除已存在的hover ClassName
            if(viewProductHDPicture.lastTaret)
            viewProductHDPicture.lastTaret.removeClass('hover')
        },
        enter (link, imgurl){   // 移入
            viewProductHDPicture.clear();
            viewProductHDPicture.cancel();
            viewProductHDPicture.replace(link,imgurl);
            viewProductHDPicture.visible();
        },
        leave (){       // 离开
            viewProductHDPicture.lastTaret = viewProductHDPicture.currentTarget
            viewProductHDPicture.timer = setTimeout( ()=> {
                viewProductHDPicture.hidden();    
            }, 500)    
        },
        position (){    // 为大图弹出层修定位置
            let x = viewProductHDPicture.currentTarget.position().left - 20;
            $choiceView.css({
                left: x
            })
        },
        visible (){     // 显示
            viewProductHDPicture.position();
            viewProductHDPicture.currentTarget.addClass('hover');
            $choiceView.fadeIn(300);
        },
        hidden (){      // 隐藏
            viewProductHDPicture.currentTarget.removeClass('hover');
            $choiceView.hide();        
        },
        replace (link,imgurl){  // 替换大图的链接和url
            $choiceView.href = link;
            $choiceView.find('img').src = imgurl;
        },
        cancel (){              // 清除定时器
            viewProductHDPicture.timer && clearTimeout(viewProductHDPicture.timer)
        }
    };

    $miniMap.on('mouseover', 'li', function (){
        let $me = $(this);
        let [imgurl, link] = [$me.find('a').data('imgurl'), $me.find('a').prop('href')];
        if(!imgurl) return;
        viewProductHDPicture.currentTarget = $me;
        viewProductHDPicture.enter(imgurl, link) 
    });
    $miniMap.on('mouseleave', 'li', viewProductHDPicture.leave);
    $choiceView.on('mouseenter', viewProductHDPicture.cancel);
    $choiceView.on('mouseleave', viewProductHDPicture.hidden);

    // 首屏焦点图
    let [$focusPrev, $focusNext] = [$('#focus .prev'), $('#focus .next')];
    let focusSwiper = new Swiper('#focus',{
        loop: true,
        autoplay: 3E3,
        pagination: '#focus .pagination',
    });
    $focusPrev.on('click', () =>{
        focusSwiper.stopAutoplay();
        focusSwiper.swipePrev();  
        focusSwiper.startAutoplay();  
    });
    $focusNext.on('click', () =>{
        focusSwiper.stopAutoplay();
        focusSwiper.swipeNext(); 
        focusSwiper.startAutoplay();     
    })

    // 品牌区切换
    $('#brands_tabs').children().on('mouseenter', function() {
        tabChange($(this))
    })


    // 卡车视频
    let [$videoPrev, $videoNext] = [$('#video_swiper_prev'), $('#video_swiper_next')];
    let videoSwiper = new Swiper('#video_swiper',{
        loop: true,
        slidesPerView: 4,
        loopedSlides: 4
    });
    $videoPrev.on('click', () =>{;
        videoSwiper.swipePrev();  
    });
    $videoNext.on('click', () =>{
        videoSwiper.swipeNext();     
    })

    // 行情导购
    let [$PGchangeButton, $PGregions, $PGlist] = [$('#price_guide_change_region'), $('#price_guide_regions'), $('#price_guide_list')]
    let PriceGuide = {
        toggle (){  // 选择
            $PGchangeButton.hasClass('down') ? PriceGuide.hide() : PriceGuide.show()
        },
        hide (){    // 隐藏
            PriceGuide.timer && clearTimeout(PriceGuide.timer);
            $PGchangeButton.removeClass('down');
            $PGregions.hide();
        },
        show (){    // 显示
            PriceGuide.timer = setTimeout(PriceGuide.hide,5E3);
            $PGchangeButton.addClass('down');
            $PGregions.show(); 
        },
        change (){  // 切换
            let $me = $(this);
            if($me.hasClass('selected')) return;
            $me.addClass('selected').siblings().removeClass('selected');
            $PGchangeButton.html($me.text() + '<i></i>');
            PriceGuide.fetch($me.data('id'));
        },
        fetch (pid){    // 请求
            $.ajax({
                url: $PGregions.data('ajaxurl'),
                data: {
                    pro: pid,
                    Type: 1
                },
                dataType: 'json',
                success(res) {
                    PriceGuide.render(res);
                },
                error() {
                    alert('系统繁忙，请稍后重试！')
                }
            })
        },
        render (data){      // 渲染
            let s = '';
            $.each(data,(index,item) => {
                s += `<li><span class="date">${item.date}</span><a href="${item.link}">${item.text}</a></li>`
            })
            $PGlist.html(s);   
            PriceGuide.hide();  
        }
    }
    $PGchangeButton.on('click',PriceGuide.toggle);
    $PGregions.on('click','span',PriceGuide.change);


    // 轻卡&皮卡
    let [$bbsTabs, $newsTabs, $rankTabs] = [$('#truck_bbs_tabs'), $('#truck_news_tabs'),$('#truck_rank_tabs')]
    $bbsTabs.children().on('mouseenter', function() {
        tabChange($(this))
    });
    $newsTabs.children().on('mouseenter', function() {
        tabChange($(this))
    });
    $rankTabs.children().on('mouseenter', function() {
        tabChange($(this))
    });

    // 市场行情
    let $dealerNav = $('#dealer_nav')
    $dealerNav.children().on('mouseenter', function() {
        tabChange($(this))
    });
    

    // 市场行情-轮播图
    let [$quotationPrev, $quotationNext] = [$('#quotation_swiper_prev'), $('#quotation_swiper_next')];
    let quotationSwiper = new Swiper('#quotation_swiper',{
        loop: true,
        slidesPerView: 3,
        loopedSlides: 3,
        roundLengths: true
    });
    $quotationPrev.on('click', () =>{;
        quotationSwiper.swipePrev();  
    });
    $quotationNext.on('click', () =>{
        quotationSwiper.swipeNext();     
    })


    // 底部排行榜
    let [$hotArticleRank, $hotPostersRank, $friendLinks] = [$('#hot_article_rank'), $('#hot_posters_rank'), $('#friend_links_tabs')];
    $hotArticleRank.children().on('mouseenter', function() {
        tabChange($(this))
    });
    $hotPostersRank.children().on('mouseenter', function() {
        tabChange($(this))
    });
    
    // 友情链接&热门推荐
    $friendLinks.children().on('mouseenter', function() {
        tabChange($(this))
    });

})

// 大数据统计
if(window.addEventListener){
    Truckhome_pv();
    Truckhome_duration()
}