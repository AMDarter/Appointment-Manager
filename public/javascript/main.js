$(function() {
  $.getScript("/javascript/jquery.mask.js", function() {
    $(".date").mask("0000-00-00");
    $(".phone_us").mask("(000) 000-0000");
  });

  $("#calendar").fullCalendar({
    header: {
      center: "month,agendaFourDay" // buttons for switching between views
    },
    views: {
      agendaFourDay: {
        type: "agendaWeek",
        duration: { days: 1 },
        buttonText: "Availability"
      }
    },
    themeSystem: "bootstrap4",
    aspectRatio: 2,
    prev: "circle-triangle-w",
    next: "circle-triangle-e",
    prevYear: "seek-prev",
    nextYear: "seek-next",
    header: {
      left: "prev,next",
      center: "title",
      right: "basicDay,basicWeek,month,agendaFourDay"
    },
    allDay: false,
    allDaySlot: false,
    slotEventOverlap: false,
    slotDuration: "00:15:00",
    minTime: "04:00:00",
    maxTime: "20:00:00",
    businessHours: {
      dow: [1, 2, 3, 4, 5], // Monday - Friday
      start: "06:00",
      end: "18:00"
    },
    events: function events(start, end, timezone, callback) {
      $.ajax({
        type: "GET",
        url: "/appointments/data",
        dataType: "json",
        success: function success(appointmentData) {
          var appointments = appointmentData;
          callback(appointments);
        }
      });
    }
  });
  $("#myTable").tablesorter();
  $("#datepicker").datepicker({
    format: "yyyy-mm-dd",
    uiLibrary: "bootstrap4",
    icons: {
      rightIcon: '<i class="far fa-calendar-alt"></i>'
    }
  });
  $("#searchDatepicker").datepicker({
    format: "yyyy-mm-dd",
    uiLibrary: "bootstrap4",
    icons: {
      rightIcon: '<i class="far fa-calendar-alt"></i>'
    }
  });

  $("#myModal").on("show.bs.modal", function(e) {
    var appointmentId = $(e.relatedTarget).attr("data-id");
    $(this)
      .find(".appointmentId")
      .attr("action", "/appointments/" + appointmentId + "?_method=DELETE")
      .attr("method", "POST");
  });

  $("#myTable")
    .tablesorter()
    .tablesorterPager({
      container: $(".pager")
    });

  $("#submit").click(function(event) {
    var form = $("#appointment-form");
    if (form[0].checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      $(".alert").show();
      setTimeout(function() {
        $(".alert").hide();
      }, 5000);
      $(".select").css("border-color", "#dc3545");
      $(".select").change(function() {
        if ($(".select").val() !== "Time" || "") {
          $(".select").css("border-color", "#28a745");
        }
      });
    }
    form.addClass("was-validated");
  });

  $("#myselect1").change(function() {
    if ($(this).val() == "volvo") {
      // or this.value == 'volvo'
      $("#myselectVolvo option:lt(2)").remove();
    }
  });
});

function capitalize(inputField) {
  inputField.value = inputField.value.replace(/\b[a-z](?=[a-z]{2})/gi, function(
    letter
  ) {
    return letter.toUpperCase();
  });
}
