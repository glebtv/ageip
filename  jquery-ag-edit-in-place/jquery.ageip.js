/*!
 * jQuery plugin: ag-edit-in-place
 * Examples and documentation at: [no url yet]
 * version 0.4 (5-DEC-2009)
 * Some ideas from SilverIPE by Jean-Nicolas Jolivet (http://www.silverscripting.com)
 * Released under the MIT License
 * http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
    
    $.fn.ageip = function(url, opts) {
        return this.each(function() {
            var el = $(this);
            var that = {
                rebind : function () {
                    el.hover(function(){
                        el.css({'background-color':options.highlightColor});
                    },function(){
                        el.css({'background-color':options.originalBg});
                    });
                    el.bind('click', function () {
                        that.startedit();
                    });
                },
                startedit : function(){
                    that.origContent = el.text();
                    if (that.origContent==options.ignoreText) that.origContent='';
                    var editor,bl;
                    if (options.type == 'textarea'){
                        editor = $('<textarea class="ipe" cols="'+options.textWidth+'" rows="'+options.textHeight+'"></textarea>');
                        bl = '<div></div>';
                    }else{
                        editor = $('<input class="ipe" size="'+options.textWidth+'" />')
                        bl = '<span></span>';
                    }
                    editor.css({border: '1px dashed '+options.borderColor});
                    editor.val(that.origContent);
                    var save = that.getButton(options.saveButtonLabel, 'save').click(function(){
                        that.save();
                    });
                    var cancel = that.getButton(options.cancelButtonLabel, 'save').click(function(){
                        that.stopedit();
                    });
                    var b = $(bl).append(save).append(cancel);
                    var i = $(bl).append(editor).append(b);
                    that.editor = editor;
                    that.ipe = i;
                    el.hide().after(i);
                    editor[0].focus();
                    editor.keypress(function (e) {
                        if (e.which == 13 && (options.type == 'input' || e.ctrlKey ) ) {
                            that.save();
                            return false;
                        }
                        if (e.which == 0){
                            that.stopedit();
                            return false;
                        }
                    });
                    
                    if (options.onBlur == 'save'){
                        editor.blur(function(){
                            that.save();
                        });
                    }
                    if (options.onBlur == 'cancel'){
                        editor.blur(function(){
                            that.stopedit();
                        });
                    }
                },
                stopedit : function(){
                    el.show().css({'background-color':options.originalBg});
                    $(that.ipe).remove();
                    options.oncancel(el);
                },
                getButton : function(txt, cls){
                    var b = '<a href="#" style="font: 11px/14px arial, sans-serif; margin: 0 4px" class="ipe '+cls+'">'+txt+'</a>';
                    return $(b);
                },
                highlight : function (hl) {
                    setTimeout(function () {
                        el.css({'background-color':hl});
                    }, 75);
                    setTimeout(function () {
                        el.css({'background-color':options.originalBg});
                    }, 150);
                    setTimeout(function () {
                        el.css({'background-color':hl});
                    }, 225);
                    setTimeout(function () {
                        el.css({'background-color':options.originalBg});
                    }, 300);
                },
                save : function () {
                    var value = that.editor.val();
                    if (value !== that.origContent)
                    {
                        el.html(options.savingText);
                        that.stopedit();
                        
                        options.additionalParameters[options.parameterName] = value;
                        if (url != ''){
                            $.ajax({
                                url    : url,
                                type   : options.method,
                                data   : options.additionalParameters,
                                success : function(data){
                                    el.text(data);
                                    that.highlight(options.highlightColor);
                                },
                                error  : function (xhr){
                                    el.html('Error <b>' + xhr.status + ": " + xhr.statusText+'</b>');
                                    that.highlight('#FF8282');
                                }
                            });
                        }
                    }
                    else {
                        this.stopedit();
                    }
                    options.onsave(el);
                }
            } 
            var options = {
                parameterName: 'value',
                method: 'POST',
                highlightColor: '#FFFFBF',
                borderColor: '#000',
                savingText: 'saving...',
                saveButtonLabel: 'save',
                cancelButtonLabel: 'cancel',
                ignoreText: 'click to edit',
                textWidth: 30,
                textHeight: 5,
                onBlur: 'save',
                onsave: function(el){
                },
                oncancel: function(el){
                },
                additionalParameters: {}
            }
            
            options = $.extend(options, opts || {});
            options.originalBg = el.css('background-color');
            options.display = options.display || el.css('display');
            options.type = options.display=='block' ? 'textarea' : 'input';
            options.method = options.method.toUpperCase();
            that.rebind();
        });
    }
})(jQuery);