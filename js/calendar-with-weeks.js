$(document).ready(function() {

  //params
  moment.locale('fr');
  var showOtherMonthsDay = true // put false if you don't want to show days from others months (in case first week and last week are on two months);

  $('#months').html('');
  var year = moment().format('YYYY');
  var months = moment.months();
  var fromTmp = moment(new Date(year, 0, 1)).format('YYYY-MM-DD');
  var to = moment(new Date(year, 11, 31)).format('YYYY-MM-DD');
  $('#year').append('<button class="btnPreviousYear waves-effect waves-light btn  col s1" year="' + (parseInt(year) - parseInt(1)) + '" from="' +  moment(new Date(parseInt(year) - parseInt(1), 0, 1)).format('YYYY-MM-DD') + '" to="' + moment(new Date(parseInt(year) - parseInt(1), 11, 31)).format('YYYY-MM-DD') + '"> << </button>');
  $('#year').append('<button class="btnYear waves-effect waves-light btn  col s10" year="' + year + '" from="' + fromTmp + '" to="' + to + '">' + year + '</button>');
  $('#year').append('<button class="btnNextYear waves-effect waves-light btn  col s1" year="' + (parseInt(year) + parseInt(1)) + '" from="' +  moment(new Date(parseInt(year) + parseInt(1), 0, 1)).format('YYYY-MM-DD') + '" to="' + moment(new Date(parseInt(year) + parseInt(1), 11, 31)).format('YYYY-MM-DD') + '"> >> </button>');

  for(var k in months){
    var fromTmp = moment(new Date(year, k, 1)).format('YYYY-MM-DD');
    var to = moment(new Date(year, parseInt(k)+1, 0)).format('YYYY-MM-DD');
    $('#months').append('<button class="btnMonth waves-effect waves-light btn  col s1" from="' + fromTmp + '" to="' + to + '">' + months[k] + '</button>');
  };

  $(document).on('click', '.btnPreviousYear, .btnNextYear, .btnYear, .btnMonth, .btnWeek, .btnDay', function(){
    var $this = $(this);

      if($this.hasClass('btnYear') || $this.hasClass('btnPreviousYear') || $this.hasClass('btnNextYear')){

          //on met a jour la ligne dédiée au changement d'année
          var selectedYear = $this.attr('year');
          $('#year').html('<button class="btnPreviousYear waves-effect waves-light btn  col s1" year="' + (parseInt(selectedYear) - parseInt(1)) + '" from="' +  moment(new Date(parseInt(selectedYear) - parseInt(1), 0, 1)).format('YYYY-MM-DD') + '" to="' + moment(new Date(parseInt(selectedYear) - parseInt(1), 11, 31)).format('YYYY-MM-DD') + '"> << </button>');
          $('#year').append('<button class="btnYear waves-effect waves-light btn  col s10" year="' + selectedYear + '" from="' + moment(new Date(selectedYear, 0, 1)).format('YYYY-MM-DD') + '" to="' + moment(new Date(selectedYear, 11, 31)).format('YYYY-MM-DD') + '">' + selectedYear + '</button>');
          $('#year').append('<button class="btnNextYear waves-effect waves-light btn  col s1" year="' + (parseInt(selectedYear) + parseInt(1)) + '" from="' +  moment(new Date(parseInt(selectedYear) + parseInt(1), 0, 1)).format('YYYY-MM-DD') + '" to="' + moment(new Date(parseInt(selectedYear) + parseInt(1), 11, 31)).format('YYYY-MM-DD') + '"> >> </button>');

          //on met à jour la ligne des mois
          $('#months').html('');
          for(var k in months){
              var fromTmp = moment(new Date(selectedYear, k, 1)).format('YYYY-MM-DD');
              var to = moment(new Date(selectedYear, parseInt(k)+1, 0)).format('YYYY-MM-DD');
              $('#months').append('<button class="btnMonth waves-effect waves-light btn  col s1" from="' + fromTmp + '" to="' + to + '">' + months[k] + '</button>');
          };

          $('#weeks').html('');
          $('#days').html('');
          $('#periode').addClass('capitalize').html('Année ' + moment($this.attr('from')).format('YYYY'));
      }

      if($this.hasClass('btnMonth')){
          $('.btnMonth').removeClass('active orange grey lighten-1');
          $this.addClass('active orange');

          var selectedMonth = $this.attr('from').substr(5, 2);
          var selectedYear = $this.attr('from').substr(0, 4);

          $('#weeks').html('');
          var weeks = getWeeksInMonth(selectedMonth-1, selectedYear);
          var percentCellWeek = 100/weeks.length;
          weeks.forEach(function(week){
              $('#weeks').append('<button class="btnWeek waves-effect waves-light btn " style="width:' + percentCellWeek + '%" number="' + week.info.number + '" from="' + moment(week.startDate).format('YYYY-MM-DD') + '" to="' +  moment(week.endDate).format('YYYY-MM-DD') + '">S  ' + week.info.number + '</button>');
          })


          $('#days').html('');

          var days = getDaysInPerdiod(weeks[0].startDate, weeks[weeks.length - 1].endDate);
          var percentCellDay = 100/days.length;
          days.forEach(function(day){
              var classIfWeekend = (day.dayDate.getDay() == 0 || day.dayDate.getDay() == 6) ? ' lighten-2 weekend' : '';
              var classIfOtherMonth =  (moment(day.dayDate).format('MM') !=  selectedMonth) ? ' otherMonth ' : '';
              var classWeekNumber = ' ' + getWeekNumber(day.dayDate).number;
              $('#days').append('<button class="btnDay waves-effect waves-light btn ' + classIfWeekend + classIfOtherMonth + classWeekNumber + '" style="padding:0; width:' + percentCellDay + '%" from="' + moment(day.dayDate).format('YYYY-MM-DD') + '" to="' +  moment(day.dayDate).format('YYYY-MM-DD') + '">' + day.dayDate.getDate() + '</button>');
          })

          $('.btnDay').each(function(){
              if($(this).hasClass('weekend')){
                  $(this).addClass('blue');
              }
          });

          $('#periode').addClass('capitalize').html(moment($this.attr('from')).format('MMMM YYYY'));
      }


      if($this.hasClass('btnWeek')){
          $('.btnWeek').removeClass('active orange grey lighten-1');
          $this.addClass('active orange');

          $('.btnMonth').each(function(){
              if(moment($this.attr('from')).format('MM YYYY') == moment($(this).attr('from')).format('MM YYYY') || moment($this.attr('to')).format('MM YYYY') == moment($(this).attr('to')).format('MM YYYY')){
                  $(this).removeClass('active orange grey lighten-1').addClass('grey lighten-1');
              } else {
                  $(this).removeClass('active orange grey lighten-1');
              }
          });

          $('.btnDay').each(function(){
              if($(this).attr('from') >= $this.attr('from') && $(this).attr('from') <= $this.attr('to')){
                  $(this).removeClass('active').addClass('orange');
              } else {
                  if($(this).hasClass('weekend')){
                      $(this).addClass('blue');
                  }
                  $(this).removeClass('active orange');
              }
          });
          $('#periode').removeClass('capitalize').html('Semaine ' + moment($this.attr('from')).format('W') + ' (du ' + moment($this.attr('from')).format('DD') + ' au ' + moment($this.attr('to')).format('DD MMMM YYYY') + ')' );
      }

      if($this.hasClass('btnDay')){

          $('.btnMonth').each(function(){
              if($(this).attr('from') <= $this.attr('from') && $(this).attr('to') >= $this.attr('to')){
                  $(this).removeClass('active orange grey lighten-1').addClass('grey lighten-1');
              } else {
                  $(this).removeClass('active orange grey lighten-1');
              }
          });
          $('.btnWeek').each(function(){
              if($(this).attr('from') <= $this.attr('from') && $(this).attr('to') >= $this.attr('to')){
                  $(this).removeClass('active orange').addClass('grey lighten-1');
              } else {
                  $(this).removeClass('active orange grey lighten-1');
              }
          });

          $('.btnDay').each(function(){
              if($(this).hasClass('weekend')){
                  $(this).addClass('blue');
              }
          });
          $('.btnDay.orange').removeClass('active orange');

          $this.addClass('active orange');

          $('#periode').addClass('capitalize').html(moment($this.attr('from')).format('dddd DD MMMM YYYY'));
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

function getDaysInPerdiod(startDate, endDate){
    var days=[],
        firstDate=new Date(startDate.getTime()),
        lastDate=new Date(endDate.getTime());

    var day=new Date(firstDate.getTime());

    while(day<=lastDate){
        days.push({
            dayDate:new Date(day)
        });
        day.setDate(day.getDate() + 1);
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
