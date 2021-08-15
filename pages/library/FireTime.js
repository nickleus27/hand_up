"use strict";
class FireTime{
 
    //TODO:  NEED TO BETTER COMMENT CODE. ESPECIALLY hourStringToInt
    //TODO: HOW TO PASS DAYS OPEN TO THIS FUNCTION
    //TODO: NEED TO PROCESS DAYS OPEN STRING FROM DATABASE TO CREATE A MAPPING
    //use an array of 7 bool elements and if index is true the day is open

    static timeFire(hourString, dayString){//DAYOFWEEK IS daysOpenArray or hashMap
        let afternoon = false;
        //afternoon = FireTime.isAfternoon(string);
        const data = FireTime.hourStringToInt(hourString);
        let startHour = data[0];
        let startMins = data[1];
        afternoon = data[2];
        console.log("afternoon is " + afternoon);
        let fireDate = new Date();
    
        //add days num of days...need to acount for if passed day of week already
        //if()
        //const nowday = fireDate.getDay();
        if(dayString !== "Everyday"){
            return FireTime.calc_min_time(startHour, startMins, afternoon, fireDate, dayString);
        }
        //add hours...check if in afternoon...
        const nowHour = fireDate.getHours();
        if(afternoon){
            if(startHour<12){
                startHour += 12;//convert to 'military' time
            }
        }

        if(startHour-nowHour<0){//if negative number the hour has already passed
            startHour = 24+(startHour-nowHour);
        }else{
            startHour = startHour-nowHour;
        }
           
        //add minutes
        const nowMinutes = fireDate.getMinutes();

        startMins = startMins - nowMinutes;
        if(startHour === 0 && startMins<0){//if notif triggered a few minutes after start time
            startHour = 24;
        }
        //fireDate.setHours(fireDate.getHours() +startHour);
        //fireDate.setMinutes(fireDate.getMinutes() + startMins);
        console.log("this is hours " + startHour);
        console.log("this is minutes " + startMins);
        return((startHour*3600000)+(startMins*60000));//how many milliseconds until fire date
        
        //https://stackoverflow.com/questions/3572561/set-date-10-days-in-the-future-and-format-to-dd-mm-yyyy-e-g-21-08-2010
        //convert days, hours, minutes....to seconds? or milliseconds?
        //new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10)
    
    };


    //NEED TO CHECK FOR CORNER CASES AND BOUNDS CHECKING
    //NEED TO ADD CODE FOR SINGLE DAYS, ETC
    static dayArrFunc(dayString){
        const dayStrArr = dayString.split(" ");
        const dayArr = [false, false, false, false, false, false, false];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const dayMap = new Map();
        for(let i = 0; i<days.length; i++){
            dayMap.set(days[i], i);
        }
        if(dayStrArr.length === 3){//checking if sting has day - day syntax
            if(dayStrArr[1] === '-'){

                const start = dayMap.get(dayStrArr[0]);
                const end = dayMap.get(dayStrArr[2]);
                for(let i = start; i != end+1; i++){
                    console.log("here");
                    if(i>=dayArr.length){
                        i = 0;
                    }
                    dayArr[i] = true;
                }
            }
        }
        return dayArr;
    }

    static calc_min_time(startHour, startMins, afternoon, fireDate, dayString){
        console.log(dayString);
        const daysOpenArr = FireTime.dayArrFunc(dayString);
        console.log(daysOpenArr);
        let min_time = 604800000;//miliseconds in a week
        for(let i = 0; i<7; i++){
            if(daysOpenArr[i]===false){
                continue;
            }
            const nowDay = fireDate.getDay();
            let startDay = i - nowDay;
            if(startDay<0){//if day is behind nowDay add a weeks amount time to make up for negative difference
                startDay = 7 + startDay;//miliseconds in a week
            }
            
            //add hours...check if in afternoon...
            const nowHour = fireDate.getHours();
            if(afternoon){
                if(startHour<12){
                    startHour += 12;//convert to 'military' time
                }
            }else if(startHour === 12){
                startHour = 0;
            }
            
    
            startHour = startHour-nowHour;
      
            //add minutes
            const nowMinutes = fireDate.getMinutes();
    
            startMins = startMins - nowMinutes;
 
            //fireDate.setHours(fireDate.getHours() +startHour);
            //fireDate.setMinutes(fireDate.getMinutes() + startMins);
            console.log("this is hours " + startHour);
            console.log("this is mins " + startMins);
            console.log("this is days " + startDay);
            const startTime = (startHour*3600000)+(startMins*60000)+ (startDay*86400000);
            console.log("this is the total of all those times " + startTime);
            //return((startHour*3600000)+(startMins*60000));//how many milliseconds until fire date
            if(startTime < min_time){//NEED TO ALSO CHECK IF DAY IS IN daysOpenArr passed to this function
                min_time = startTime;
            }
        }
        return min_time;
    }
    
    static hourStringToInt(string){
        //TODO: still need to check bounds and corner cases
        let isAfternoon = false;
        //let foundMorning = false;
        let tempHour = '';
        let tempMin = ''
        let isHour = true;
        let index = 0;
        let timearr = [];
        while(index < string.length){
            if(string[index] >= '0' && string[index] <= '9' && isHour){
                tempHour += string[index];
            }else if(string[index] === ':' && isHour){
                isHour = false;
            }else if(string[index] >= '0' && string[index] <= '9' && !isHour){
                tempMin += string[index];
            }else{
                while(index < string.length){
                    console.log(string[index]);
                    if(string[index]==='p' || string[index]==='P'){
                        isAfternoon = true;
                        break;
                    }else if(string[index] ==='a' || string[index]==='A'){
                        break;
                    }
                    index++;
                }
                if(tempMin === ''){//if there is no minnutes
                    timearr.push(parseInt(tempHour, 10));
                    timearr.push(0);
                    timearr.push(isAfternoon);
                    return timearr;
                }else{
                    timearr.push(parseInt(tempHour, 10));
                    timearr.push(parseInt(tempMin, 10));
                    timearr.push(isAfternoon);
                    return timearr;
                }
            }
            index++;
        }
        return parseInt(tempHour, 10);
    };
    static isEveryday(dayString){
        return(dayString === 'Everyday')
    }
}

export default FireTime;