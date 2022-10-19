import axios from "axios";
import jsPDF from "jspdf";


export const downloadPDF = async () => {
  const pdf = new jsPDF();
  const htmlObject = document.getElementsByTagName('trix-editor')[0];
  if (htmlObject.childElementCount == 0) {
    return false;
  }

  const dnameObj = document.getElementById("dname");
  let filename = '';
  if (dnameObj && dnameObj.value) {
    filename = dnameObj.value + '.pdf';
  } else {
    return false;
  }

  const rootDiv = htmlObject.children[0];
  rootDiv.style.fontSize = "6px";
  rootDiv.style.width = "200px";

  await pdf.html(rootDiv, {margin: [20, 10, 10, 10]})
    .then((res) => {
      pdf.save(filename);
    })
    .catch((err) => {
      return false;
    });
  
  return true;
}

export const downloadPDFByDoc = async (doc) => {
  const pdf = new jsPDF();
  
  const rootDiv = document.createElement("div");
  rootDiv.style.fontSize = "6px";
  rootDiv.style.width = "200px";
  rootDiv.innerHTML = doc.html;
  
  await pdf.html(rootDiv, {margin: [20, 10, 10, 10]})
    .then((res) => {
      pdf.save(doc.name + '.pdf');
    })
    .catch((err) => {
      return false;
    });
  return true;
}

export const downloadPDFByCode = async (name, code) => {
  if (!name || !code) {
    return false;
  }

  const pdf = new jsPDF();
  
  const rootDiv = document.createElement("div");
  rootDiv.style.fontSize = "6px";
  rootDiv.style.width = "200px";
  rootDiv.innerHTML = code.replace(/(?:\r\n|\r|\n)/g, '<br>');
    
  await pdf.html(rootDiv, {margin: [20, 10, 10, 10]})
    .then((res) => {
      pdf.save(name + '.pdf');
    })
    .catch((err) => {
      return false;
    });
  return true;
}

export const runCode = async (code)  => {
  try {
    const result = await axios.post("https://execjs.emilfolino.se/code", {
      code: btoa(code)
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    return {data: atob(result.data.data), isError: false, error: {}};
  } catch (err) {
    return {data: null, isError: true, error: err};
  }
}
