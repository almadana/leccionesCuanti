function Question(params) {
  this.reset = function() {
    this.status = "";
    this.response = "";
    this.answered = false;
    if (this.options) {
      this.options.map(option=>option.selected=false);
    }
  }

  this.clicked = function() {
    this.answered = true;
  }

  this.check = function(option) {
    if (option) {
      option.selected = true;
    }
    this.validate(option);
  }

  this.text = params.text;
  this.type = params.type;
  this.feedback = params.feedback;
  this.options = params.options;
  this.validate = params.validate;
  this.status = params.status || "";
  this.answer = params.answer;

  this.answered = false;
}

export {Question}
