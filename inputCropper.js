/**
 * Plugin para mostrar cropper al seleccionar un archivo de imagen en un input file
 * 
 * Dependencias: jQuery
 * Date: 2017-01-24
 *  
 * @author Diego Malagón <diegomalagonh@gmail.com>
 * @param {Funtion} $ jQuery
 * @returns {undefined}
 */
(function($){
    var name = "inputCropper";
    
    var Func = function(){
        /**
         * Elementos html
         * 
         * @type Object
         */
        var el = {};
        
        /**
         * Opciones
         * 
         * @type Object
         */
        var options;
        
        /**
         * Función de inicio para obtener los elementos de la GUI
         * 
         * @returns {undefined}
         */
        var init = function(){
            el.form = el.inputFile.parents("form");
            el.submit = el.form.find(":submit"); 
            el.input_x = el.form.find(options.input_x); 
            el.input_y = el.form.find(options.input_y); 
            el.input_w = el.form.find(options.input_w); 
            el.input_h = el.form.find(options.input_h); 
            el.image_preview = el.form.find(options.image_preview);
            el.thb_preview = el.form.find(options.thb_preview);
            el.loading = el.form.find(options.loading);
            el.image_wrapper = el.form.find(options.image_wrapper);
            
            initEventListeners();
        };        
        
        /**
         * Función para asignar los eventos a la GUI
         * 
         * @returns {undefined}
         */
        var initEventListeners = function(){            
            // onChange input file
            el.inputFile.on("change", function(){
                var val = $(this).val();
                
                // Validar tamaño de archivo si existe un límite
                if(options.maxSize !== null && val.length > 0){
                    if(this.files[0].size > options.maxSize){
                        this.value = "";  
                        destroyCropper();
                        Channeldir.displayNotice("warning", {detail: Translator.trans("archivo.excede.tamano")});                        
                        return false;
                    }
                }
                
                readURL(this).done(function(src){
                    if(val.length > 0){
                        el.submit.attr("disabled", false);                        
                    }
                    setCropper(src);
                });
                
                if(val.length <= 0){
                    el.submit.attr("disabled", true);
                }
            });
        };
        
        /**
         * Funcion para previsualizar la imagen seleccionada
         * 
         * @param {Object} input
         * @returns {Object} promesa con la url de la imagen
         */
        var readURL = function(input) {
            var $img = el.image_preview;
            var $img_wrapper = el.image_wrapper;
            var $loading = el.loading;

            var dfd = $.Deferred();

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                $loading.removeClass("hide");

                reader.onload = function (e) {
                    var src = e.target.result;
                    $img.attr('src', src);
                    $img_wrapper.removeClass("hide");
                    $loading.addClass("hide");

                    dfd.resolve(src);
                };

                reader.readAsDataURL(input.files[0]);
            }
            else{
                $img.attr("src", "#");
                $img_wrapper.addClass("hide");
                destroyCropper();
            }

            return dfd.promise();
        };
        
        /**
         * Función que asigna el comportamiento del cropper
         * 
         * @param {String} src ruta de la imagen seleccionada
         * @returns {undefined}
         */
        var setCropper = function(src){
            var $img = el.image_wrapper.find("img");
            var $preview = el.thb_preview;

            $img.cropper($.extend({}, options, {
                build: function (e) {
                    var $clone = $(this).clone();

                    $clone.css({
                        display: 'block',
                        width: '100%',
                        minWidth: 0,
                        minHeight: 0,
                        maxWidth: 'none',
                        maxHeight: 'none'
                    });

                    $preview.css({
                        width: '100%',
                        overflow: 'hidden'
                    }).html($clone);
                },
                crop: function(e) {
                    var imageData = $(this).cropper('getImageData');
                    var previewAspectRatio = e.width / e.height;

                    var previewWidth = $preview.width();
                    var previewHeight = previewWidth / previewAspectRatio;
                    var imageScaledRatio = e.width / previewWidth;

                    $preview.height(previewHeight).find('img').css({
                        width: imageData.naturalWidth / imageScaledRatio,
                        height: imageData.naturalHeight / imageScaledRatio,
                        marginLeft: -e.x / imageScaledRatio,
                        marginTop: -e.y / imageScaledRatio
                    }).removeClass("cropper-hidden");

                    $(el.input_x).val(e.x);
                    $(el.input_y).val(e.y);
                    $(el.input_w).val(e.width);
                    $(el.input_h).val(e.height);
                }
            }));

            $img.cropper('replace', src);
        };
        
        /**
         * Función para destruir y ocultar cropper
         * 
         * @returns {undefined}
         */
        var destroyCropper = function(){
            el.image_preview.cropper('destroy');
            el.image_wrapper.addClass("hide");
            el.thb_preview.html("");
            el.thb_preview.css({
                height: 0
            });
        };
        
        return {
            init: function(element, opts){
                el.inputFile = $(element);
                options = opts;
                init();
            }
        };
    };
    
    $.fn[name]= function(options, args){      
        var element = this;
        var Plugin = new Func();
        
        if(Plugin[options]){
            Plugin.init(element);            
            return Plugin[options](args);
        }
        else if(typeof(options) === "object" || !options){
            options = $.extend({}, $.fn[name].defaults, options);
            return Plugin.init(element, options);
        }
    };
    
    $.fn[name].defaults = {
        aspectRatio:                1 / 1,
        zoomable:                   false,
        rotatable:                  false,
        scalable:                   false,
        movable:                    false,
        toggleDragModeOnDblclick:   false,
        minCropBoxWidth:            100,
        minCropBoxHeight:           100,
        build:                      function(){},
        crop:                       function(){},
        maxSize:                   null,
        image_preview:              "#image-preview",
        thb_preview:                "#thb-preview",
        loading:                    ".cropper-loading",
        image_wrapper:              "#image-wrapper",
        input_x:                    ".input-x",
        input_y:                    ".input-y",
        input_w:                    ".input-w",
        input_h:                    ".input-h"
    };
    
})(jQuery);