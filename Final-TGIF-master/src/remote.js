 // ---------- [ Get Live Data Functions ]---------

/*
let getLiveData = () => {
    let cUrl = "https://api.propublica.org/congress/v1/115/house/members.json";
    let sUrl = "https://api.propublica.org/congress/v1/115/senate/members.json";
    let refURL = "https://api.propublica.org/congress/v1/113/CHAMBER/members.json";

    let proPublicaReq = new XMLHttpRequest();
    refURL.replace('CHAMBER', contentType.toLowerCase());
    proPublicaReq.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(JSON.parse(this.responseText));
            document.getElementById("chamber-data").innerHTML = JSON.stringify(JSON.parse(this.responseText), null, 2);
        }
    }
    proPublicaReq.open("GET", cUrl);
    proPublicaReq.setRequestHeader("X-API-Key", "JcGFxZvgCSZoxssQaykY0o6pktxjRiIegxN9Uh2V");
    proPublicaReq.send();
}
*/

async function getData(congress, chamber) {
  let refURL = "https://api.propublica.org/congress/v1/CONGRESS/CHAMBER/members.json";
  const myError = new Error;

  refURL = refURL.replace('CONGRESS', congress);
  refURL = refURL.replace('CHAMBER', chamber.toLowerCase());

  // console.log('REF URL: ', refURL);
  const reqHeader = new Headers({ "X-API-Key": "JcGFxZvgCSZoxssQaykY0o6pktxjRiIegxN9Uh2V" });
  //const reqHeader = new Headers({ "X-API-Key": "" });
  const myInit = {
      method: 'GET',
      headers: reqHeader,
      mode: 'cors',
      cache: 'default'
  };

  try {
      //await the response of the fetch call
      let response = await fetch(refURL, myInit);
      // console.log('TEST Response', response);
      try {
          // console.log('Get Data');
          //proceed once the first promise is resolved.
          let data = await response.json();
          return data;
      } catch (error) {
          myError.message = "No valid data available";
          throw myError;
      }
  } catch (error) {
      myError.message = "Fetch ProPublica data Failed";
      //console.log('ERROR!', response);
      throw myError;
  }
}