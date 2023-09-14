var info = {
    show:function(text, status = 'success') {
        alert(text);
    }
};
$(document).ready(function(){
    $(document).on("evocms-user-send-form-success", function(e, actionUser, actionId, element, msg){
        element.find("input[type='text']").val('');
        element.find("input[type='tel']").val('');
        element.find("input[type='file']").val('');
        element.find("input[type='checkbox']").prop('checked', false);
        let fileTextElement = element.find(".input__file-button-text");
        fileTextElement.html(fileTextElement.data("initText"));
        info.show('Форма успешно отправлена');
    })
})
