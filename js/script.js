//===> nav bar button functionnality

const homeBtn = document.querySelector("#Home-btn");
const historyBtn = document.querySelector("#History-btn");
const showHistory = document.querySelector(".history");
const showHome = document.querySelector(".Home");

historyBtn.addEventListener("click", () => {
  showHistory.style.display = "block";
  showHome.style.display = "none";
});

homeBtn.addEventListener("click", () => {
  showHome.style.display = "block";
  showHistory.style.display = "none";
});

// done nav bar button functionnality <===\\

// * ==> shortUrlGeneratorbtn functionnality with MyAPI
const apiURL = "https://low.up.railway.app/url";

const errorMessage = document.querySelector(".message");
const outputDiv = document.querySelector("#outputDiv");
const shortUrlGeneratorbtn = document.querySelector("#short-Url-Generator-btn");

let myArray = [];
function showData(data) {
  let inputUrl = document.querySelector("#urlInput");
  if (data.message) {
    errorMessage.innerHTML = data.message;
    errorMessage.style.color = "green";
    inputUrl.style.borderColor = "green";

    // show data here..
    outputDiv.innerHTML = ` 
    <p>Short URL:- <a href="${apiURL}/${data.shortID}" target="_blank">${apiURL}/${data.shortID}</a></p>
    <button id="ShareButton">Share</button>`;

    /// push in myArray to save localStorege
    myArray.push(data.shortID);
    localStorage.setItem("myArray", JSON.stringify(myArray));
  } else if (data.error) {
    errorMessage.innerHTML = data.error;
    inputUrl.style.borderColor = "red";
    errorMessage.style.color = "red";
  }
}

shortUrlGeneratorbtn.addEventListener("click", () => {
  let inputValue = document.querySelector("#urlInput").value;

  fetch(`${apiURL}`, {
    method: "POST",
    body: JSON.stringify({
      url: `${inputValue}`,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((Response) => Response.json())
    .then((data) => showData(data));
});



//============ historyBtn functionnality with MyAPI ============//
let showTableData = document.getElementById("Show-table-data");

// clearTable function for clear table pre render
function clearTable() {
  while (showTableData.firstChild) {
    showTableData.removeChild(showTableData.firstChild);
  }
}

// errorTableRowFunction
function errorTableRowFunction() {
  let erroTableRow = document.createElement("tr");
  erroTableRow.innerHTML = `<td colspan="11" id="if-No-Data">No history found</td>`;
  showTableData.appendChild(erroTableRow);
}

function showTableDatafn(data) {
  const myArray = Object.values({ data }); // Get values of the data object as an array

  if (myArray.length > 0) {
    myArray.forEach((data) => {
      let tableRow = document.createElement("tr");

      tableRow.innerHTML = ` 
      <td class="longURL" colspan="4">
           <a href="${data.LongURL}" target="_blank">${data.LongURL} </a>
      </td>
      <td class="shortURl" colspan="5">
          <a href="${apiURL}/${data.shortID}" target="_blank">${apiURL}/${data.shortID}</a>
      </td>
      <td colspan="2">${data.totalChicks}</td>`;
      showTableData.appendChild(tableRow);

      // ShareButtonFn(data);
    });
  } else {
    errorTableRowFunction();
  }
}

historyBtn.addEventListener("click", () => {
  clearTable();

  const oldShortID = JSON.parse(localStorage.getItem("myArray"));

  if (oldShortID) {
    oldShortID.forEach((element) => {
      fetch(`${apiURL}/analytics/${element}`, {
        method: "GET",
      })
        .then((Response) => Response.json())
        .then((data) => showTableDatafn(data));
    });
  } else {
    errorTableRowFunction();
  }
});
