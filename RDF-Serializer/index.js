//JS-Objekt for JSON file
var result;

//Array for all attributes of the dataset
var allkeys = [];

//Array for all attributes of the dataset without duplicates
var unique;

//variable for language tag
var langtag = "";

//variables for the captures in strings
var capture1 = "";
var capture2 = "";

//dataset value that should be inserted in turtle
var CurrentValue;

//variable for uploaded file
var upload = document.getElementById("fileInput");
var raw = "";

//if the user uploads a file
if (upload) {
  upload.addEventListener("change", function () {
    //sets everything to zero, if another file has been uploaded before
    document.getElementsByTagName("table")[1].innerHTML = "";
    allkeys = [];
    OntoProp_Array = [];
    NewProp_Array = [];
    Langtag_Array = [];
    Datatype_Array = [];
    SetAsID_Array = [];

    //get file type
    var extension = upload.files[0].type;

    if (extension == "text/csv") {
      var reader = new FileReader(); // File reader to read the file
      reader.readAsText(upload.files[0], "UTF-8"); // Read file as text

      reader.onload = function (evt) {
        //process csv file
        raw = evt.target.result;
        var arr = raw.split("\n");
        var jsonObj = [];
        var headers = arr[0].split(",");

        for (var i = 1; i < arr.length; i++) {
          //get data from csv
          var data = arr[i].split(",");
          var obj = {};
          for (var j = 0; j < data.length; j++) {
            if (data[j].trim() != "") {
              obj[headers[j].trim()] = data[j].trim();
            }
          }
          jsonObj.push(obj);
          //Push data from csv file into jsonObj
        }
        result = jsonObj;

        getKeyValues(jsonObj); //get keys and values from dictionary and safe it into different arrays
        CountAndSortKeys(allkeys); //count all attributes and sort by frequency, delete duplicates
      };
    } else {
      // Make sure a file was selected
      if (upload.files.length > 0) {
        var reader = new FileReader(); // File reader to read the file
        // This event listener will happen when the reader has read the file
        reader.addEventListener("load", function () {
          result = JSON.parse(reader.result); // Parse JSON into an object
          getKeyValues(result); //get keys and values from dictionary and safe it into different arrays
          CountAndSortKeys(allkeys); //count all attributes and sort by frequency, delete duplicates
        });
      }

      reader.readAsText(upload.files[0]); // Read the uploaded file
    }
  });
}

var clickedSite = "About";

//manage the menu
function makeVisible(site) {
  document
    .getElementById(clickedSite + "_link_bg")
    .setAttribute(
      "style",
      "height:2.5em; width: 11.5em; padding-top: 0.5em; padding-bottom: 0.5em;"
    );

  document.getElementById(clickedSite + "_link").setAttribute("style", "");
  document
    .getElementById(clickedSite)
    .setAttribute(
      "style",
      "visibility: hidden; position: absolute; z-index: 0;"
    );

  document
    .getElementById(site)
    .setAttribute(
      "style",
      " padding-left: 18em; padding-top: 7.4em; padding-right: 1.5em; margin: 0; visibility: visible; position: absolute; z-index: 1;  left:0; right:0; margin-left:auto; margin-right:auto"
    );

  document
    .getElementById(site + "_link_bg")
    .setAttribute(
      "style",
      "height:2.5em; width: 12em; background-color: #122341; padding-top: 0.5em; padding-bottom: 0.5em;"
    );
  document
    .getElementById(site + "_link")
    .setAttribute("style", "color:rgb(192, 202, 229);");

  clickedSite = site;
}

//if json file is not valid
window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (msg == "Script error.") {
    document.getElementById("fileaccept").innerHTML =
      "<p style='color:red;'>&#10005; File not accepted. please make sure that the file has the correct structure. </p>";
  }
  return false;
};

function getKeyValues(object) {
  var keys = Object.keys(object); //Saves the attribute names of first hierarchy order into the variable "keys"

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]; //saves the current attribute name into variable key
    var value = object[key]; //saves the current attribute value into variable value

    if (value == null) {
      //if the attribute has no value ignore it
    } else if (typeof value == "object") {
      //if the value is another object (nested structure) call the function again with the value to get into a deeper hierarchy level
      getKeyValues(value);
    } else {
      //Save all keys that have a value (no subobject) into the array allkeys
      allkeys.push(key);
    }
  }

  if (allkeys.length > 0) {
    //check if the uploaded file is valid
    document.getElementById("fileaccept").innerHTML =
      "<p>&#10003; File accepted. You can now <a href='#' onclick='makeVisible(`Prefixes`)'>add the prefixes.</a></p>";
  }
}

function CountAndSortKeys(keys) {
  //create Array counts[] and saves all attributes and their quantity in it
  let counts = keys.reduce((counts, num) => {
    counts[num] = (counts[num] || 0) + 1;
    return counts;
  }, {});

  //Sort all attributes by their quantity
  keys.sort(function (p0, p1) {
    return counts[p1] - counts[p0];
  });
  //delete all duplicate attributes
  unique = [...new Set(keys)];

  //dictionary that contains unique attributes and their quantity
  var Props_Counts = {};
  for (var i = 0; i < unique.length; i++) {
    Props_Counts[unique[i]] = counts[unique[i]];
  }
  //calls function to generate table rows based on the unique attributes
  generate_table(Props_Counts);
}

//if user sets an attribute as id
function selectOnlyThis(id) {
  console.log("Attribute as ID selected.");
  var myCheckbox = document.getElementsByName("Checked[]");
  Array.prototype.forEach.call(myCheckbox, function (el) {
    el.checked = false;
  });
  id.checked = true;
}

function generate_table(attribute) {
  // get the reference for the body
  var table = document.getElementsByTagName("table")[1];

  // Create an empty <thead> element and add it to the table:
  var header = table.createTHead();

  // Create an empty <tr> element and add it to the first position of <thead>:
  var row = header.insertRow(0);

  // Insert a new cell (<td>) at the first position of the "new" <tr> element:
  var cell = row.insertCell(0);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>Dataset attribute <i>(quantity)</i></b>";

  var cell = row.insertCell(1);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>Ontology Property</b>";
  var cell = row.insertCell(2);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>New Property</b>";

  var cell = row.insertCell(3);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>Language</b>";
  var cell = row.insertCell(4);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>Datatype</b>";
  var cell = row.insertCell(5);
  // Add some bold text in the new cell:
  cell.innerHTML = "<b>Set as ID</b>";

  var tblBody = document.createElement("tbody");

  //Create one row for each dataset attribute
  for (var i = 0; i < Object.values(attribute).length; i++) {
    // creates a table row
    var row = document.createElement("tr");

    for (var j = 0; j < 6; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      var cell = document.createElement("td");

      if (j == 0) {
        cell.setAttribute("style", "max-width:1em; word-wrap:break-word;");

        var cellText = document.createTextNode(Object.keys(attribute)[i]);

        var NumOfKeys = document.createTextNode(
          " (" + Object.values(attribute)[i] + ")"
        );
        cell.appendChild(cellText);
        var italic = document.createElement("i");
        cell.appendChild(italic);
        italic.appendChild(NumOfKeys);
      } else if (j == 1) {
        cell.innerHTML = "<input type='text' id='fname' name='OntoProp[]' />";
      } else if (j == 2) {
        cell.innerHTML = "<input type='text' id='fname' name='NewProp[]' />";
      } else if (j == 3) {
        cell.innerHTML =
          "<label><select name='language[]' id='language'><option>EN</option><option>DE</option><option>-</option></select></label>";
      } else if (j == 4) {
        cell.innerHTML =
          "<label><select name='datatype[]' id='datatype'><option>String</option><option>Link</option><option>Number</option><option>Boolean</option></select></label>";
      } else if (j == 5) {
        cell.innerHTML =
          "<p style='text-align:center;'><input type='checkbox' id='setID' name='Checked[]' unchecked onclick='selectOnlyThis(this)'></p>";
      }
      row.appendChild(cell);
    }
    // add the row to the end of the table body
    tblBody.appendChild(row);
  }

  // put the <tbody> in the <table>
  table.appendChild(tblBody);

  // sets the border attribute of tbl to 2;
  table.setAttribute("border", "2");
  document.getElementById("");

  //add contents to other screens
  document.getElementById("Submit").innerHTML =
    "<h3 style='margin-bottom: 0.7em;'>Here you can download your turtle file</h3><p><b>Please note:</b> The turtle file will only contain dataset attributes for which a property has been defined.</p><input type='button' value='Download turtle file' onclick='GenerateTurtle()' />";
  document.getElementById("PropSection").innerHTML =
    '<h3 style="margin-bottom: 0.8em;">Define the properties for the dataset attributes</h3><div style="text-align:left; font-size:0.9em;"><p>If there already exists a term to decribe the dataset attribute, write it in the column Ontology property with the belonging prefix.</p>You can also create more complex nested structures by using the signal words PROP and TYPE.<p><i> e.g.: PROP schema:brand TYPE schema:Organization PROP schema:name</i> will create the following structure in your turtle file:</p><img src="turtle.png" width="500em" style="margin-bottom:1.3em;" /><p>If no published vocabulary exists for a dataset attribute, please specify the property in the field "New Property" as specifically as possible in one word. A new property will then be generated automatically based on schema.org additionalProperty when the Turtle file is created.<p>Select the language of the dataset attribute. This will generate the language tags in your turtle file. If there is no need for a language tag, set the language to "Undefined"</p><h4 style="margin-top:1.3em; margin-bottom:0.5em">Extracted dataset attributes:</h4></div>';
}

//add another row to prefix table
function AddRow(table) {
  var tableRef = document.getElementById(table);
  var newRow = tableRef.insertRow(-1);

  var newCell = newRow.insertCell(0);
  var newElem = document.createElement("input");
  newElem.setAttribute("name", "Prefix[]");
  newElem.setAttribute("style", "border: none; width:10em");

  newCell.appendChild(newElem);

  newCell = newRow.insertCell(1);
  newElem = document.createElement("input");
  newElem.setAttribute("name", "Namespace[]");
  newElem.setAttribute("style", "width:30em; border: none");

  newCell.appendChild(newElem);

  newCell = newRow.insertCell(2);
  newCell.setAttribute("style", "border: none; width:2em;");
  newElem = document.createElement("input");
  newElem.setAttribute("type", "button");
  newElem.setAttribute("class", "btn");
  newElem.setAttribute("value", "x");
  newElem.setAttribute("onclick", "DeleteRow(this)");

  newCell.appendChild(newElem);
}

window.DeleteRow = function DeleteRow(o) {
  var p = o.parentNode.parentNode;
  p.parentNode.removeChild(p);
};

function GenerateTurtle() {
  //get user inputs
  var OntoProp = document.getElementsByName("OntoProp[]");
  var NewProp = document.getElementsByName("NewProp[]");
  var Langtag = document.getElementsByName("language[]");
  var Datatype = document.getElementsByName("datatype[]");
  var SetAsID = document.getElementsByName("Checked[]");

  var k;
  //save user inputs of column "Ontology Property" in array
  for (var i = 0; i < OntoProp.length; i++) {
    k = OntoProp[i].value;
    OntoProp_Array.push(k);
    console.log(k);
  }

  //save user inputs of column "New Property" in array
  for (var i = 0; i < NewProp.length; i++) {
    k = NewProp[i].value;
    NewProp_Array.push(k);
  }

  //save user inputs of column "Language" in array
  for (var i = 0; i < Langtag.length; i++) {
    k = Langtag[i].value;
    Langtag_Array.push(k);
  }

  //save user inputs of column "Datatype" in array
  for (var i = 0; i < Datatype.length; i++) {
    k = Datatype[i].value;
    Datatype_Array.push(k);
  }

  //save user inputs of column "ID" in array
  for (var i = 0; i < SetAsID.length; i++) {
    k = SetAsID[i].checked;
    SetAsID_Array.push(k);
  }

  //call function to build the turtle file
  ReplaceProps(
    result,
    unique,
    OntoProp_Array,
    NewProp_Array,
    Langtag_Array,
    Datatype_Array,
    SetAsID_Array
  );
}

function ReplaceProps(
  data,
  attributes,
  inputs1,
  inputs2,
  langs,
  datatype,
  asID
) {
  //these dicts contain the mappings between dataset attributes and user inputs
  var Onto_Prop_dict = {};
  var New_Prop_dict = {};
  var Lang_dict = {};
  var Datatype_dict = {};
  var ID_dict = {};

  //build dictionaries with attributes and user inputs
  for (var i = 0; i < attributes.length; i++) {
    Onto_Prop_dict[attributes[i]] = inputs1[i];
    New_Prop_dict[attributes[i]] = inputs2[i];
    Lang_dict[attributes[i]] = langs[i];
    Datatype_dict[attributes[i]] = datatype[i];
    ID_dict[attributes[i]] = asID[i];
  }

  var replace = "";
  var AdditionalProp =
    'schema:additionalProperty [\n\t\ta schema:PropertyValue ;\n\t\tschema:name "';
  ID = [];
  ID2 = 0;

  //add prefix section to turtle string
  var Turtle =
    "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . \n@prefix schema: <https://schema.org/> . \n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n";

  //save user inputs of prefix table in variables
  var Prefixes = document.getElementsByName("Prefix[]");
  var Namespaces = document.getElementsByName("Namespace[]");

  //add prefixes of the users to turtle string
  for (var z = 0; z < Prefixes.length; z++) {
    Turtle =
      Turtle +
      "@prefix " +
      Prefixes[z].value +
      " <" +
      Namespaces[z].value +
      "> .\n";
  }

  //set number of properies to zero
  var PropValuesCounter = 0;

  //for all products in dataset
  for (var z = 0; z < data.length; z++) {
    ID.push(z); //update id

    var newID;

    //check if user has set attribute as ID
    if (asID.includes(true)) {
      Object.prototype.getKeyByValue = function (value) {
        for (var prop in this) {
          if (this.hasOwnProperty(prop)) {
            if (this[prop] === value) return prop;
          }
        }
      };

      var IDattr = ID_dict.getKeyByValue(true); //gets attribute that is selected to be the ID
      newID = data[z][IDattr]; //get attribute value and set as ID
    } else {
      ID2 = ID2 + 1;
      newID = "ID" + ID2;
    }

    //add ID to turtle string and add type schema:Product
    Turtle = Turtle + "\n<" + newID + ">" + "\n\ta schema:Product ;";

    var counter = 0;
    var newcounter = 1;

    //for all keys of dataset
    for (var i = 0; i < unique.length; i++) {
      replace = unique[i];

      //check if there is a user input and update the counter to get the number of properies
      if (Onto_Prop_dict[replace] == "" && New_Prop_dict[replace] == "") {
      } else {
        GetValue(data[z], replace);
      }

      if (Onto_Prop_dict[replace] == "" && New_Prop_dict[replace] == "") {
        if (data[z][replace] != undefined) {
        }
      } else if (
        Onto_Prop_dict[replace] == "" &&
        New_Prop_dict[replace] != ""
      ) {
        if (CurrentValue != "") {
          counter = counter + 1;
        }
      } else if (
        Onto_Prop_dict[replace] == undefined &&
        New_Prop_dict[replace] == undefined
      ) {
      } else {
        if (CurrentValue != "") {
          if (Onto_Prop_dict[replace].includes("TYPE")) {
            counter = counter + 1;
          } else {
            counter = counter + 1;
          }
        }
      }
    }

    //counts the total number of properties in dataset for which an user input has been made
    PropValuesCounter = PropValuesCounter + counter;

    for (var i = 0; i < unique.length; i++) {
      var ending = "";
      replace = unique[i];
      //check the user input for each attribute and add the attribute value in the needed structure to the turtle string
      if (Onto_Prop_dict[replace] == "" && New_Prop_dict[replace] == "") {
      } else {
        GetValue(data[z], replace);
      }

      if (newcounter == counter) {
        ending = " .\n";
      } else if (newcounter < counter) {
        ending = " ;";
      }

      if (Onto_Prop_dict[replace] == "" && New_Prop_dict[replace] == "") {
        if (data[z][replace] != undefined) {
          //console.log("delete: " + data[z][replace]);
          delete data[z][replace];
        }
      } else if (
        Onto_Prop_dict[replace] == "" &&
        New_Prop_dict[replace] != ""
      ) {
        if (CurrentValue != "") {
          newcounter = newcounter + 1;

          //replaces all words in the json object

          CheckLangAndCapture(
            Lang_dict[replace],
            Datatype_dict[replace],
            data[z][replace]
          );

          Turtle =
            Turtle +
            "\n\t" +
            AdditionalProp +
            New_Prop_dict[replace] +
            '"' +
            langtag +
            " ; " +
            "\n\t\t" +
            "schema:value" +
            capture1 +
            CurrentValue +
            capture2 +
            langtag +
            " ]" +
            ending;

          delete data[z][replace];
        }
      } else if (
        Onto_Prop_dict[replace] == undefined &&
        New_Prop_dict[replace] == undefined
      ) {
        delete data[z][replace];
      } else {
        if (CurrentValue != "") {
          if (Onto_Prop_dict[replace].includes("TYPE")) {
            CheckLangAndCapture(
              Lang_dict[replace],
              Datatype_dict[replace],
              data[z][replace]
            );

            newcounter = newcounter + 1;

            var userinput = Onto_Prop_dict[replace];
            var emptynodes = userinput.match(/(TYPE)/g).length;
            var regex_alltypes = /TYPE\s*(.*?)\s*(PROP)/g;
            var regex_allprops = /PROP\s*(.*?)\s*(TYPE)/g;
            var lastprop = userinput.substring(
              userinput.lastIndexOf("PROP") + 5
            );
            //speichert alle Typen in Array alltypes
            var alltypes = [];
            while ((m = regex_alltypes.exec(userinput))) {
              alltypes.push(m[1]);
            }

            var allprops = [];
            while ((m = regex_allprops.exec(userinput))) {
              allprops.push(m[1]);
            }

            var blancnodestruct = "";

            for (var x = 0; x < emptynodes + 1; x++) {
              if (x < emptynodes) {
                blancnodestruct =
                  blancnodestruct +
                  "\n" +
                  "\t".repeat(x + 1) +
                  allprops[x] +
                  " [" +
                  "\n" +
                  "\t".repeat(x + 2) +
                  "a " +
                  alltypes[x] +
                  " ;";
              }

              if (x == emptynodes) {
                blancnodestruct =
                  blancnodestruct + "\n" + "\t".repeat(x + 1) + lastprop;
                Turtle =
                  Turtle +
                  blancnodestruct +
                  capture1 +
                  CurrentValue +
                  capture2 +
                  langtag +
                  " ] ;".repeat(emptynodes - 1) +
                  " ]" +
                  ending;
              }
            }
          } else {
            CheckLangAndCapture(
              Lang_dict[replace],
              Datatype_dict[replace],
              data[z][replace]
            );

            newcounter = newcounter + 1;

            Turtle =
              Turtle +
              "\n\t" +
              Onto_Prop_dict[replace] +
              capture1 +
              CurrentValue +
              capture2 +
              langtag +
              ending;
          }
        }
        delete data[z][replace];
      }
    }
  }

  for (var z = 0; z < data.length; z++) {
    for (var n = 0; n < Object.keys(data[z]).length; n++) {}
  }

  var countProps = 0;
  for (var i = 0; i < attributes.length; i++) {
    if (Onto_Prop_dict[attributes[i]] != "") {
      countProps = countProps + 1;
    }
    if (New_Prop_dict[attributes[i]] != "") {
      countProps = countProps + 1;
    }
  }

  var userinfo =
    "<p style='margin-top:1em'><b>Finished! </b><p style='margin-bottom:1em'>You defined <b>" +
    countProps +
    "</b> kinds of properties for your ontology. Your ontology contains <b>" +
    data.length +
    "</b> products and <b>" +
    PropValuesCounter +
    "</b> property values</p>";

  document
    .getElementById("downloadStarted")
    .setAttribute("style", "margin-top: 1.5em; border: #132e43 solid;");

  document.getElementById("downloadStarted").innerHTML = userinfo;

  
  var blob = new Blob([Turtle], {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, "productontology.ttl");
  //start download
  }

function CheckLangAndCapture(lang, datatype, value) {
  //function to check the language tag and datatype to add the correct formatting
  if (lang == "DE") {
    langtag = "@de";
  }
  if (lang == "EN") {
    langtag = "@en";
  }
  if (lang == "-") {
    langtag = "";
  }

  if (datatype == "String") {
    if (lang == "-") {
      capture1 = ' "';
      capture2 = '"^^xsd:string';
      langtag = "";
    } else {
      capture1 = ' "';
      capture2 = '"';
    }
  }
  if (datatype == "Link") {
    capture1 = " <";
    capture2 = ">";
    langtag = "";
  }
  if (datatype == "Number") {
    if (isNaN(value) == false) {
      if (Number.isInteger(Number(value)) == true) {
        console.log("integer found");
        capture1 = ' "';
        capture2 = '"^^xsd:integer';
        langtag = "";
      } else {
        console.log(value + " is not an int");
        capture1 = ' "';
        capture2 = '"^^xsd:decimal';
        langtag = "";
      }
    } else {
      capture1 = ' "';
      capture2 = '"';
      langtag = "";
    }
  }
  if (datatype == "Boolean") {
    capture1 = ' "';
    capture2 = '"^^xsd:boolean';
    langtag = "";
  }
}

function GetValue(data, currentkey) {
  //function to get the current attribute value of a key
  CurrentValue = "";

  var val = "";
  var keys = Object.keys(data);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]; //Stores current key in variable key
    val = data[key]; //stores the value of the current attribute in variable val

    if (key == currentkey) {
      //If the key is equal to the key given to the function, store the attribute value and stop
      CurrentValue = val;
      break;
    } else if (typeof val == "object") {
      //if the value is another object call the function again to get the value in nested structure
      GetValue(val, currentkey);
    }
  }
}
