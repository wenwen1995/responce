# responce

此页面涉及的知识点在于使用插件webuploader.js实现文件/图片的上传，压缩，并且预览出来

最终效果图如下：
![](http://p1.bpimg.com/567571/01e68fd24a56f2b4.png)

其中截图反馈那边涉及到图片的上传，并显示，如果中间上传错误会报错，反之成功。

具体的插件下载和学习地址在这里：[http://fex.baidu.com/webuploader/?qq-pf-to=pcqq.c2c](http://fex.baidu.com/webuploader/?qq-pf-to=pcqq.c2c "webuploader学习地址")

官网是这么入门的(来自官网)

html:
要实现如上demo，首先需要准备一个按钮，和一个用来存放添加的文件信息列表的容器。
    <!--dom结构部分-->

    <div id="uploader-demo">
    <!--用来存放item-->
    <div id="fileList" class="uploader-list"></div>
    <div id="filePicker">选择图片</div>
    </div>

最后需要把选择的图片缩小，放在如下所示的红框内，所以要获得该div的宽度和高度
![](http://p1.bpimg.com/567571/be2faff9955f98d8.png)
 
代码为：
 
     var thumbnailWidth = $('.pic').width();
     var thumbnailHeight =  $('.pic').height();

最终的javascript为:
       // 初始化Web Uploader
        var $list = $('#fileList');
        //这里获得
        var thumbnailWidth = $('.pic').width();
        var thumbnailHeight =  $('.pic').height();
        console.log(thumbnailWidth)
        var uploader = WebUploader.create({

            // 选完文件后，是否自动上传。
            auto: true,

            // swf文件路径
            swf: '../i/Uploader.swf',

            // 文件接收服务端。
            server: '../fileupload.php',

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
                
                //这里移除最开始的图片标志
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

这里遇到问题，上传图片后虽然能显示，但是报错如下图：
![](http://p1.bpimg.com/567571/178060ac7b6956c2.png)

**即跨域报错！**
找了好久的错误，后来跟php后端人员讨论查找到问题所在，原来是本地没有配置php环境，不支持访问php文件，把相关的页面放在php人员的电脑上，就好了。

最后，这其中为了适应设计稿，自己删除了webuploader.css一些本来的基本样式，添加了些自定义的样式。