/* A DOM component that displays text and allows the user to edit it, turning into an input. */
export default class EditableText {
  constructor(id) {
    this.id = id;
    this.value = "";
    //TODO: Add instance variables, bind event handlers, etc.
    this.onChange = null;
    this._onEdit = this._onEdit.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._currDisplay = this._createDisplay();
  }

  /* Add the component (in display state) to the DOM under parent. When the value changes, onChange
     is called with a reference to this object. */
  addToDOM(parent, onChange) {
    parent.appendChild(this._currDisplay);
    this.onChange = onChange;
  }

  /* Set the value of the component and switch to display state if necessary. Does not call onChange */
  setValue(value) {
    this.value = value;
    let newDisplay = this._createDisplay();
    this._currDisplay.replaceWith(newDisplay);
    this._currDisplay = newDisplay;
  }

  _createDisplay() {
    let container = document.createElement("div");
    container.id = this.id;
    container.classList.add("editableText");

    let text = document.createElement("span");
    text.textContent = this.value;
    container.appendChild(text);

    let button = document.createElement("button");
    button.type = "button";
    button.textContent = "Edit";
    //TODO: Add event handler to edit button
    button.addEventListener("click", this._onEdit);
    container.appendChild(button);

    return container;
  }

  _onEdit(event){
    let input = this._createInput();
    this._currDisplay.replaceWith(input);
    input.focus();
    this._currDisplay = input;
    //input._input.addEventListener("blur", this._onBlur);
  }

  _onBlur(event){
    this.value = this._currDisplay.value;
    let newDisplay = this._createDisplay();
    this._currDisplay.replaceWith(newDisplay);
    this._currDisplay = newDisplay;
    this.onChange(this);
  }
  _createInput() {
    let input = document.createElement("input");
    input.classList.add("editableInput");
    input.type = "text";
    input.id = this.id;
    input.value = this.value;
    //TODO: Add event handler to input
    input.addEventListener("blur", this._onBlur)
    return input;
  }
}
