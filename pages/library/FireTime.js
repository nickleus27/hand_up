"use strict";
const timeAhead = 3600000;
class FireTime{
 
    //TODO:  NEED TO BETTER COMMENT CODE. ESPECIALLY hourStringToInt
  /*
    static get timeAhead(){
        return timeAhead;
    }
    */

    static timeFire(hourString, dayString){//DAYOFWEEK IS daysOpenArray or hashMap
        let afternoon = false;
        const data = FireTime.hourStringToInt(hourString);
        let startHour = data[0];
        let startMins = data[1];
        afternoon = data[2];
        let fireDate = new Date();
        const nowHour = fireDate.getHours();
        const nowMinutes = fireDate.getMinutes();
        let passedHour = false;
        let startTime;

        //add hours...check if in afternoon...
        if(afternoon){
            if(startHour<12){
                startHour += 12;//convert to 'military' time
            }
        }

        if(startHour-nowHour<0){//if negative number the hour has already passed
            startHour = 24+(startHour-nowHour);//add 24hours
            passedHour = true;
        }else{
            startHour = startHour-nowHour;
        }
           
        //add minutes
        startMins = startMins - nowMinutes;
        if(startHour === 0 && startMins<0){//if notif triggered a few minutes after start time
            startHour = 24;
        }

        //if notification doesnt go off everyday then we need to potentially add days to the time
        if(dayString !== "Everyday"){
            return FireTime.calc_min_time(startHour, startMins, passedHour, fireDate, dayString);
        }

        //if notification is everyday we dont need to worry about days, it will be within next 24 hours
        console.log("this is hours " + startHour);
        console.log("this is minutes " + startMins);
        console.log('this is the time ahead, (1hour) in miliseconds:', timeAhead);
        console.log('this is total time', (startHour*3600000) + (startMins*60000));
        console.log('this is time minus an hour', (startHour*3600000) + (startMins*60000) - timeAhead);

        startTime = (startHour*3600000) + (startMins*60000) - timeAhead;
        //if notification was set within an hour of when it is suppost to go off then add 24 hours to it
        if(startTime <= 0){
            startTime += 86400000; //milliseconds in 1 day; 24 hours
        }
        return startTime;//how many milliseconds until fire date
        
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
                let loopsEnd = end+1;
                if(loopsEnd >= dayArr.length){
                    loopsEnd = 0;
                }
                for(let i = start; i != loopsEnd; i++){
                    if(i>=dayArr.length){
                        i = 0;
                        dayArr[i] = true;
                        i -= 1;
                    }else{
                        dayArr[i] = true;
                    }
                }
            }
        }
        return dayArr;
    }

    /* if notification is not everyday we potentially have to add days to the start time.  Also, this function
    *works for when onNotification gets clicked to reschedule notification.  if the notiification is not clicked right away
    *this function will loop through all possible times and return the closest start time compared to current time.
    */
    static calc_min_time(startHour, startMins, hourHasPassed, fireDate, dayString){
        const daysOpenArr = FireTime.dayArrFunc(dayString);
        let min_time = 604800000;//miliseconds in a week
        for(let i = 0; i<7; i++){
            if(daysOpenArr[i]===false){
                continue;
            }

            const nowDay = fireDate.getDay();
            let startDay = i;

            if(nowDay === 0){ //convert sundays to 7
                nowDay = 7;
            }
            if(startDay === 0){//convert sundays to 7
                startDay = 7;
            }
            startDay = startDay - nowDay;
            if(startDay < 0){//if day is behind current day in the week add a week to the negative number
                startDay += 7;
            }
            if(startDay === 0){//if same day
                if(hourHasPassed){//hours have passed today
                    console.log("has already passed for today");
                    continue;
                }
                if(startHour === 24 && startMins < 0){//already has passed today minutes ago
                    console.log("has already passed for today");
                    continue;
                }
            }
            if(startDay === 1){//use values passed into function for startTime they are already correct. Dont need to add a day if only a day ahead.
                startDay = 0;
            }
            if(startDay >= 2){//if startTime is more than a day away subtract a day from total days since startHour and startMins passed into this function already calculated a day into future
                startDay -= 1
            }

            const startTime = (startHour*3600000)+(startMins*60000)+ (startDay*86400000) - timeAhead;
            console.log("this is starthour ", startHour);
            console.log("this is startmins ", startMins);
            console.log("this is startday ", startDay);
            console.log('this is the time ahead, (1hour) in miliseconds:', timeAhead);
            console.log("this is the total of all those times - hour ", startTime);
            
            //make sure that the time is in future aka above zero
            //if notification is set within hour of opening time than it would be less than zero
            //since we subtract an hour for our startime of an hour before opening
            if(startTime >= 0 && startTime < min_time){
                min_time = startTime;
            }
        }
        console.log("this is the min_time: " + min_time);
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