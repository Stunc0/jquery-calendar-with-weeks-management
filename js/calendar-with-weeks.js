$(document).ready(function() {
  moment.locale('fr');
  $('#months').html('');
  var year = moment().format('YYYY');
  var months = moment.months();
  for(var k in months){
    var fromTmp = moment(new Date(year, k, 1)).format('YYYY-MM-DD');
    var to = moment(new Date(year, parseInt(k)+1, 0)).format('YYYY-MM-DD');
    $('#months').append('<button class="btnMonth waves-effect waves-light btn  col s1" from="' + fromTmp + '" to="' + to + '">' + months[k] + '</button>');
  };

  $(document).on('click', '.btnMonth, .btnWeek, .btnDay', function(){
    var $this = $(this);
    if($this.hasClass('btnMonth')){
      $('.btnMonth.active').removeClass('active orange');
      $this.addClass('active orange');

      var selectedMonth = $this.attr('from').substr(5, 2);
      var selectedYear = $this.attr('from').substr(0, 4);

      $('#weeks').html('');
      var weeks = getWeeksInMonth(selectedMonth-1, selectedYear);
      var percentCellWeek = 100/weeks.length;
      weeks.forEach(function(week){
        $('#weeks').append('<button class="btnWeek waves-effect waves-light btn  active orange" style="width:' + percentCellWeek + '%" from="' + moment(week.startDate).format('YYYY-MM-DD') + '" to="' +  moment(week.endDate).format('YYYY-MM-DD') + '">S  ' + week.info.number + '</button>');
      })

      $('#days').html('');
      var days = getDaysInMonth(selectedMonth-1, selectedYear);
      var percentCellDay = 100/days.length;
      days.forEach(function(day){
        var classIfWeekend = (day.dayDate.getDay() == 0 || day.dayDate.getDay() == 6) ? ' lighten-2 weekend' : '';
        $('#days').append('<button class="btnDay waves-effect waves-light btn  active orange' + classIfWeekend + '" style="padding:0; width:' + percentCellDay + '%" from="' + moment(day.dayDate).format('YYYY-MM-DD') + '" to="' +  moment(day.dayDate).format('YYYY-MM-DD') + '">' + day.number + '</button>');
      })

    }

    if($this.hasClass('btnWeek')){
      $('.btnWeek.active').removeClass('active orange');
      $this.addClass('active orange');

      $('.btnDay').each(function(){
        if($(this).attr('from') >= $this.attr('from') && $(this).attr('from') <= $this.attr('to')){
          $(this).addClass('active orange');
        } else {
          if($(this).hasClass('weekend')){
            $(this).addClass('blue');
          }
          $(this).removeClass('active orange');
        }
      });
    }

    if($this.hasClass('btnDay')){
      $('.btnWeek').each(function(){
        if($(this).attr('from') <= $this.attr('from') && $(this).attr('to') >= $this.attr('to')){
          $(this).addClass('active orange');
        } else {
          $(this).removeClass('active orange');
        }
      });

      $('.btnDay').each(function(){
        if($(this).hasClass('weekend')){
          $(this).addClass('blue');
        }
      });
      $('.btnDay.active').removeClass('active orange');

      $this.addClass('active orange');
    }
  });
});

function getWeeksInMonth(month, year){
   var weeks=[],
       firstDate=new Date(year, month, 1),
       lastDate=new Date(year, month+1, 0),
       numDays= lastDate.getDate();
   var start=1;
   //+1 pour mettre au format français avec un debut de semaine au lundi et non pas au dimanche
   var end = 7-firstDate.getDay() + 1;
   end = end === 8 ? start : end;

   while(start<=numDays){
       var weekStartDate = new Date(year, month, start);
       weeks.push({
         start:start,
         end:end,
         info:getWeekNumber(weekStartDate),
         startDate:getMonday(new Date(year, month, start)),
         endDate:getSunday(new Date(year, month, end))
       });
       start = end + 1;
       end = end + 7;
       end = start === 1 && end === 8 ? 1 : end;
       if(end>numDays)
           end=numDays;
   }
    return weeks;
}

function getDaysInMonth(month, year){
   var days=[],
       firstDate=new Date(year, month, 1),
       lastDate=new Date(year, month+1, 0),
       numDays= lastDate.getDate();
   var day=1;

   while(day<=numDays){
       days.push({
         number:day,
         dayDate:new Date(year, month, day)
       });
       day = day + 1;
   }
  return days;
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return {year:d.getFullYear(), number:weekNo};
}

function getMonday(d) {
  var day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

function getSunday(d) {
  var day = d.getDay(),
      diff = 7-d.getDay();
  if(day == 0){
    return d;
  } else return new Date(d.setDate(d.getDate() + diff));
}
