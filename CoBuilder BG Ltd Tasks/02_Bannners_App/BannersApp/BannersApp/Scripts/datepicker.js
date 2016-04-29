$(document).ready(function () {
    $("#datepicker").datepicker({
        dateFormat: 'mm-dd-yy',
        onSelect: function(datetext){
        var d = new Date(); // for now
        datetext = datetext + " " + d.getHours() + ": "+d.getMinutes()+ ": " +d.getSeconds();
        $('#datepicker').val(datetext);
    },
    });
    $("#datepicker-end").datepicker({
        dateFormat: 'mm-dd-yy',
        onSelect: function (datetext) {
            var d = new Date();
            datetext = datetext + " " + d.getHours() + ": " + d.getMinutes() + ": " + d.getSeconds();
            $('#datepicker-end').val(datetext);
        },
    });
});