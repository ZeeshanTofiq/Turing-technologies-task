// export function convertHMS(value: any) {
//     const sec = parseInt(value, 10); // convert value to number if it's string
//     let hours: any = Math.floor(sec / 3600); // get hours
//     let minutes: any = Math.floor((sec - (hours * 3600)) / 60); // get minutes
//     let seconds: any = sec - (hours * 3600) - (minutes * 60); //  get seconds
//     // add 0 if value < 10; Example: 2 => 02
//     if (hours < 10) { hours = "0" + hours; }
//     if (minutes < 10) { minutes = "0" + minutes; }
//     if (seconds < 10) { seconds = "0" + seconds; }
//     return hours + ':' + minutes + ':' + seconds; // Return is HH : MM : SS
// }

// export function secondsToDhms(seconds: any) {
//     seconds = Number(seconds);
//     var d = Math.floor(seconds / (3600 * 24));
//     var h = Math.floor(seconds % (3600 * 24) / 3600);
//     var m = Math.floor(seconds % 3600 / 60);
//     var s = Math.floor(seconds % 60);

//     var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
//     var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//     var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//     var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//     return dDisplay + hDisplay + mDisplay + sDisplay;
// }

export function fmtMSS(s: any) {   // accepts seconds as Number or String. Returns m:ss
    return (s -         // take value s and subtract (will try to convert String to Number)
        (s %= 60) // the new value of s, now holding the remainder of s divided by 60 
        // (will also try to convert String to Number)
    ) / 60 + (    // and divide the resulting Number by 60 
            // (can never result in a fractional value = no need for rounding)
            // to which we concatenate a String (converts the Number to String)
            // who's reference is chosen by the conditional operator:
            9 < s       // if    seconds is larger than 9
                ? ' minutes '       // then  we don't need to prepend a zero
                : ' minutes 0'      // else  we do need to prepend a zero
        ) + s + " seconds";       // and we add Number s to the string (converting it to String as well)
}
