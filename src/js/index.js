$(document).ready(function(){

  
    window.location.hash="spread";

    // 在App内部显示，否则不显示
   if(call_app_pure.isApp){
       $('.footer').hide();
   }

    // 查看更多事件
    $('.readmore a').click(function(){
        $(this).parent().hide();
        $(this).parent().siblings().show();
    })

    // 导航切换
    $('.nav').on('click','a',function(){
        var href=$(this).attr('href');
        if(!/^\#/.test(href))return;
        href=href.replace(/\#/,'').trim();
        var present=$(this).parent().attr('class');
        if(present.indexOf(href)>=0)return;
        $(this).parent().attr('class','nav '+href);
        
        // 标题切换
        $(this).parent().next().children().hide();
        $(this).parent().next().children('.'+href).show();
        
        // 内容切换
        $(this).parent().siblings('.list').hide();
        $(this).parent().siblings('#'+href).show();
    });

    $('.footer').click(function(){
        call_app_pure.callappdownload({
            maskId: 'nocomment',
            from: 'toplist'
        });
    })
})