var finalResult;
var finalResultArray;
var headerArray;
var filterArrayValues = [];
var transactionArray = [];
var j = 1;
var z = 1;
var itemsArray = [];
var itemArray = {};
var inputData = {};

function readFile(input) {
  let readFile = input.files[0];
  let reader = new FileReader();
  reader.readAsBinaryString(readFile);
  reader.onload = function () {
    finalResult = reader.result;
    console.log("The String output from file: " + reader.result);

    // convert obtained string to an array
    if (finalResult != null) {
      finalResultArray = finalResult.split("\n");
      headerArray = finalResultArray[0].split(",");
    }
    for (let i = 1; i < finalResultArray.length; i++) {
      filterArrayValues[j] = finalResultArray[i].split(",");
      j++;
    }
    for (let i = 1; i < filterArrayValues.length; i++) {
      if (filterArrayValues[i][0] == "T") {
        transactionArray[z] = filterArrayValues[i];
        itemArray = {
          name: transactionArray[z][5]
            .concat(" ")
            .concat(transactionArray[z][6]),
          quantity: transactionArray[z][16],
          unit_cost: transactionArray[z][22],
        };
        itemsArray.push(itemArray);

        z++;
      }
    }

    inputData = {
      from: "Sample",
      to: "Customer",
      number: headerArray[2],
      items: itemsArray,
    };

    // api call to generate pdf

    fetch("https://invoice-generator.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
      responseType: "blob",
      //mode: "no-cors",
    })
      .then((response) => response.blob())
      .then((data) => {
        console.log("data: " + data);
        var url = window.URL.createObjectURL(data);
        var link = document.createElement("a");
        link.href = url;
        link.download = "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  reader.onerror = function () {
    finalResult = reader.error;
    console.log(reader.error);
  };
}
