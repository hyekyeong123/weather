$(document).ready(function(){
    var lat;    //경도
    var lon;    //위도
    $.ajax({
        url:"https://ipinfo.io/geo",
        dataType:"json",
        success:function(result){
            var loc = result.loc;
            loc = loc.split(",");
            lat = loc[0];
            lon = loc[1];
        }
    });
    // 
    function settime(tz){
        var now = new Date();
        var result;
        now = now.getUTCHours() +tz; //시간
                //그리니치 시간대


        if(now >= 0 && now<3){
            result = 5;
        }else if(now >= 3 && now <6){
            result = 6
        }else if(now >= 6 && now <9){
            result = 7
        }else if(now >= 9 && now <12){
            result = 0
        }else if(now >= 12 && now <15){
            result = 1
        }else if(now >= 15 && now <18){
            result = 2
        }else if(now >= 18 && now <21){
            result = 3
        }else if(now >= 21 && now <24){
            result = 4
        }
        return result;
    }
     
    function suc(result){
        console.log(result);
        var timezone = result.city.timezone / 3600;

        //예를들어 한국은 +9가 나옴
        var listindex = settime(timezone);

        $("#city").text(result.city.name);
        var icontxt = id2icon(result.list[listindex].weather[0].id);
        


        $("#icon").removeClass().addClass(icontxt);
        $("#info").text(result.list[listindex].weather[0].description);
        //------------
        var temp = result.list[listindex].main.temp;
        temp = temp.toFixed(1);
        $(".temp").text(temp);
        //------------
        var speed = result.list[listindex].wind.speed;
        speed = speed.toFixed(1)
        $("#speed").text(speed);
        //------------
        var deg = result.list[listindex].wind.deg;
        $("#dir").css("transform","rotate("+deg+"deg)")

        $("#hum").text(result.list[listindex].main.humidity);
        
        var max = result.list[listindex].main.temp_max;
        max = max.toFixed(1);
        $("#max").text(max);

        var min = result.list[listindex].main.temp_min;
        min = min.toFixed(1);
        $("#min").text(min);
        clen();//글자 수 세는 함수

        for(i=0;i<5;i++){
            var ftime = new Date(result.list[i*8].dt*1000);
            //1000을 곱해야 밀리초 단위가 됨
            var fmonth = ftime.getMonth()+1;
            var fdate = ftime.getDate();
            $(".fdate").eq(i).text(fmonth+"/"+fdate)
            var code = result.list[i*8].weather[0].id;
            var icon = id2icon(code);
            $(".fc").eq(i).children("svg").removeClass().addClass(icon);
            var ftemp = result.list[i*8].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".fc").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = result.city.sunset*1000;
        sunset = new Date(sunset);
        var now = new Date();
        if(now < sunset){
            //낮일때
                var url="";
                var id= result.list[0].weather[0].id;
                if(id>=200 && id<400){
                    url = "images/day_rain.jpg";
                }else if(id>=400 && id<600){
                    url = "images/day_cloud.jpg";
                }else if(id == 801 || id == 802){
                    url = "images/day_cloud.jpg";
                }else if(id == 803 || id == 804){
                    url = "images/day_cloud.jpg";
                }
                else{
                    url = "images/day_clear.jpg";
                }
            
            $("section").css("background-image","url("+url+")");
        }else{
            $("section").css("background-image","url(images/night_clear.jpg)")
        }
    }
//headerbar, section 높이 설정해주기---------------------------
    function secset(){
        var vh = $(window).outerHeight();
        var vw = $(window).outerWidth();
                            //패딩의 높이까지 재야함
        var hh = $("#hdbar").outerHeight();
        $("section").height(vh-hh);
        //header 높이
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        
        $("#top").height(vh-hh-mh-bh);

        if(vh < vw){
            //가로가 더 크다면(가로모드인 경우)
            $("#midbot").css("margin-top",vh-hh-220+"px");
                        //전체화면 - 헤더바 높이 빼기 -220
        }else{
            $("#midbot").css("margin-top","0px");
        }
    }
    secset();
    $(window).resize(function(){
        secset();
    });
    function clen(){
        var len = $("#city").text().length;
        if(len >= 14){
            $("#city").addClass("stext");
        }else{
            $("#city").removeClass("stext")
        }
    }
    clen();

//http://api.openwea0thermap.org/data/2.5/forecast-----------------
//q=London &
//mode=xml &
//units=metric &
//appid=e7c81124c283d50a0462493ef61be5a0
    var link = "http://api.openweathermap.org/data/2.5/forecast";
    var myid = "e7c81124c283d50a0462493ef61be5a0";
    
    function upd(subject){
                //this
        var city = $(subject).attr("data"); //도시정보를 가져와서 city에 저장
        
        if(city != "custom"){
            //도시명 검색
            $.ajax({
                url:link,
                method:"GET",
                data:{
                    "q":city,
                    "mode":"json",
                    "appid":myid,
                    "units":"metric"
                },
                dataType:"json",
                success:suc
            });
        }else{
            $.ajax({
                url:link,
                method:"GET",
                data:{
                    "mode":"json",
                    "appid":myid,
                    "units":"metric",
                    "lat":lat,
                    "lon":lon
                },
                dataType:"json",
                success:suc
            })

        }
    }
    
    upd($(".citybtn:nth-of-type(2)"));
    $(".citybtn").click(function(){
        upd(this);
        //도시
    });
    //------------------------------------------------------------
    function id2icon(id){
        var icon = "";
        if(id>=200 && id<300){
            icon ="fas fa-bolt";

        }else if(id>=300 && id<400){
            icon ="fas fa-cloud-rain";

        }else if(id>=400 && id<600){
            icon ="fas fa-cloud-showers-heavy";
        }else if(id>=600 && id<700){
            icon ="fas fa-smogflake";
        }else if(id>=700 && id<800){
            icon ="fas fa-smog";
        }else if(id == 800){
            icon ="fas fa-sun";
        }else if(id == 801 || id == 802){
            icon ="fas fa-cloud-sun";
        }else if(id == 803 || id == 804){
            icon ="fas fa-cloud";
        }
        return icon;
    }
//사용자 위치 정보
//---------------------------------------------------------
});