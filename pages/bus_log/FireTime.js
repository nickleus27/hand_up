
class FireTime{
 
    //TODO: change class to return number of milliseconds to add to new Date()
    
        static timeFire(string){
            let afternoon = false;
            afternoon = FireTime.isAfternoon(string);
            console.log(afternoon);
            let startHour = FireTime.hourStringToInt(string)[0];
            let startMins = FireTime.hourStringToInt(string)[1];
            console.log('hour is ' + startHour + ' min is ' + startMins);
            let fireDate = new Date();
    
            //add days num of days...need to acount for if passed day of week already
            //if()
            const nowday = fireDate.getDay();
            //add hours...check if in afternoon...
            const nowHour = fireDate.getHours();
            console.log(nowHour + 'is now hour');
            if(afternoon){
                if(startHour<12){
                    startHour += 12;//convert to 'military' time
                }
            }
            console.log('military is ' + startHour);
            if(startHour-nowHour<0){//if negative number the hour has already passed
                startHour = 24+(startHour-nowHour);
            }else{
                startHour = startHour-nowHour
            }
            console.log('after else' + startHour);
            //add minutes
            const nowMinutes = fireDate.getMinutes();




            
            //TODO: NEED TO ADD CODE THAT HANDLES NOTIFICATION MADE ONLY A FEW MINUTES AFTER FIRE TIME
            startMins = startMins - nowMinutes;
            /*
            if(startMins != 0){
                startHour -= 1;
            }
            */
            //fireDate.setHours(fireDate.getHours() +startHour);
            //fireDate.setMinutes(fireDate.getMinutes() + startMins);
            console.log(startHour);
            console.log(startMins);
            return((startHour*3600000)+(startMins*60000));//how many milliseconds until fire date
        
        //https://stackoverflow.com/questions/3572561/set-date-10-days-in-the-future-and-format-to-dd-mm-yyyy-e-g-21-08-2010
        //convert days, hours, minutes....to seconds? or milliseconds?
        //new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 10)
    
        };
    
    
        //TODO: need to return minutes too!!
        static hourStringToInt = (string) =>{
            //TODO: still need to check bounds and corner cases
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
                    if(tempMin === ''){
                        timearr.push(parseInt(tempHour, 10));
                        timearr.push(0);
                        return timearr;
                    }else{
                        timearr.push(parseInt(tempHour, 10));
                        timearr.push(parseInt(tempMin, 10));
                        return timearr;
                    }
                }
                index++;
            }
            return parseInt(tempHour, 10);
        };
        static isAfternoon(string){
            //TODO: still need to check for bounds and corner cases....example null?...no am or pm???
            let afternoon = false;
            const length = string.length
            if (string[length-2] === 'p' || string[length-2] === 'P'){
                afternoon = true;
            }
            return afternoon;
        };
    }