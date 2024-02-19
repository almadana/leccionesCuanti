import {studentt, normal} from 'jstat'

function Single(mean, stdev, min, max) {
  this.reset = function() {
    this.x = this.z*this.stdev+this.mean;
    this.v = (this.x-min)/(max-min);
  };

  this.rescale = function(mean, stdev) {
    this.mean = mean || this.mean;
    this.stdev = stdev || this.stdev;
    this.reset();
    if (this.x<min) {
      this.x = min;
      this.v = 0;
    }
    if (this.x>max) {
      this.x = max;
      this.v = 1;
    }
  };

  this.roll = function() {
    this.z = normal.sample(0,1);
  }

  this.mean = mean;
  this.stdev = stdev;
  this.selected = false;

  this.x = min - 1;
  while(this.x<min || this.x>max) {
    this.roll();
    this.reset();
  }

  this.happiness = this.x;
}

function populator(size, mean, stdev, min, max) {
  var slots = [...Array(size).keys()];
  var output = slots.map(()=>new Single(mean, stdev, min, max));
  return output;
}

function Population(size, mean, stdev, min, max) {
  this.reset = function() {
    var slots = [...Array(this.size).keys()];
    this.members = slots.map(()=>new Single(this.mean, this.stdev, min, max));
  }

  this.rescale = function(mean, stdev, size) {
    this.mean = mean || this.mean;
    this.stdev = stdev || this.stdev;
    this.variance = this.stdev**2;

    if (size) {
      this.size = size;
      this.reset()
    } else if (mean || stdev) {
      this.members.map(single=>single.rescale(mean, stdev));
    }
  };

  this.t_student = function(population) {
    var std = Math.sqrt((this.variance+population.variance)/2);
    var stderr = std/(Math.sqrt(this.members.length));
    var t = (this.mean - population.mean)/stderr
    return t
  }

  this.p_value = function(population) {
    return this.p_value_2_tail(population)
  };

  this.p_range = function(population) {
    var p = this.p_value(population);
    if (p<0.001) {
      return 3
    } else if (p<0.01) {
      return 2
    } else if (p<0.05) {
      return 1
    }
  };

  this.p_value_1_tail = function(population) {
    var t = this.t_student(population);
    var p = studentt.cdf(t, this.dof());
    if (t>0) {
      p = 1 - p
    }
    return p
  }

  this.p_value_2_tail = function(population) {
    var t = this.t_student(population);
    var p = 2*studentt.cdf(-Math.abs(t), this.dof());
    return p
  }

  this.dof = function() {
    return this.members.length-1
  }

  this.size = size;


  this.mean = mean;
  this.stdev = stdev;
  this.variance = this.stdev**2;

  this.rescale(mean, stdev, size);
}

export {populator, Population}
