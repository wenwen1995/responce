/*
	index.js
	by renwenji 
	2016/12/23
	功能：实现抽奖
 */
$(function(){
	var ui = {
 	  	$textarea: $('.textarea') //textarea文本框的内容
      , $btn: $('.btn') //提交反馈按钮
      , $ok: $('.ok') //成功的提示框
      , $bottom: $('.bottom') //dibu 


	};

var txt;
var can = true;
var oPageConfig = window.oPageConfig;

var oPage = {
	//init初始化程序
	init:function(){
      this.listen();
      this.upload();
	}
  , listen:function(){
        ui.$textarea.on('click',function(){
            $(this).css('border','1px solid #968a7b');;
        });
        ui.$btn.on('click',function(){
            txt =  ui.$textarea.val();

            if(txt ==''){
                flag = false;
                ui.$textarea.css('border','1px solid red');
            }else if(ui.$ok.is(':visible')){
                flag = false;
            }else{
                flag = true;
            }

            if(flag && can){
                can = false;
                $.ajax({
                    url:oPageConfig.oUrl.getInfo,
                    type:'post',
                    data:{},
                    dataType:'JSON'
                  }).done(function(msg){
                    if(msg.code == 0){
                        console.log(txt)
                        ui.$btn.addClass('scale');//按钮放大10%
                        ui.$ok.show();
                        ui.$bottom.find('p').append(txt)
                    }
                    can = true;
              });
            }
        });
    },
    upload:function(){

     // 初始化Web Uploader
        var $list = $('#fileList');
        var thumbnailWidth = $('.pic').width();
        var thumbnailHeight =  $('.pic').height();
        console.log(thumbnailWidth)
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            swf: '../i/Uploader.swf',

            // 文件接收服务端。
            server: 'https://github.com/fex-team/webuploader/blob/master/server/fileupload.php',

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            pick: '#imgPicker',
            fileNumLimit: 1, //只能上传一张
            // 只允许选择图片文件。
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            }
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function( file ) {
            var $li = $(
                    '<div id="' + file.id + '" class="file-item thumbnail">' +
                        '<img class="photo">'  +
                    '</div>'
                    ),
                $img = $li.find('img');
                $('.load').remove();


            // $list为容器jQuery实例
            $list.html( $li );

            // 创建缩略图
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }

                $img.attr( 'src', src );
            }, thumbnailWidth, thumbnailHeight );
        });

        // 文件上传过程中创建进度条实时显示。
        uploader.on( 'uploadProgress', function( file, percentage ) {
            var $li = $( '#'+file.id ),
                $percent = $li.find('.progress span');

            // 避免重复创建
            if ( !$percent.length ) {
                $percent = $('<p class="progress"><span></span></p>')
                        .appendTo( $li )
                        .find('span');
            }

            $percent.css( 'width', percentage * 100 + '%' );
        });

        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
        uploader.on( 'uploadSuccess', function( file ) {
            $( '#'+file.id ).addClass('upload-state-done');
        });

        // 文件上传失败，显示上传出错。
        uploader.on( 'uploadError', function( file ) {
            var $li = $( '#'+file.id ),
                $error = $li.find('div.error');

            // 避免重复创建
            if ( !$error.length ) {
                $error = $('<div class="error"></div>').appendTo( $li );
            }

            $error.text('上传失败');
        });

        // 完成上传完了，成功或者失败，先删除进度条。
        uploader.on( 'uploadComplete', function( file ) {
            $( '#'+file.id ).find('.progress').remove();
        });
    }
};
   oPage.init();
});

