class dob {
  constructor(month,day,year) {
    this.month = month;
    this.day = day;
    this.year = year;
  }

  //returns array, use .month or .day or .year to access
  getDetails(){ 
    return {month:this.month, day:this.day, year:this.year}
  }
}

module.exports = dob;

