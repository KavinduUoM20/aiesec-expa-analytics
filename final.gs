function fetchData(startDate, endDate, filterPattern) {
  // Modify URL to accept a range
  var url = 'https://analytics.api.aiesec.org/v2/applications/analyze.json?access_token=''&start_date=' + startDate + '&end_date=' + endDate + '&performance_v3%5Boffice_id%5D=1623';
  
  // Fetch JSON data
  var json = UrlFetchApp.fetch(url).getContentText();
  
  // Parse JSON
  var data = JSON.parse(json);
  
  // Extracting identifiers
  var identifiers = Object.keys(data);
  
  // Apply filters for All Identifiers to derive 
  var filteredIdentifiers = identifiers.filter(key => filterPattern.test(key));

  // List all objects of filtered data
  var filteredData = {};

  // Filter data based on filtered identifiers
  filteredIdentifiers.forEach(key => {
      filteredData[key] = data[key];
  });

  return filteredData;
}

function extractData(programme, type, stage, data) {
  const key = `${type}_${stage}_${programme}`;
  return {
    opens: data[`open_${programme}`]?.doc_count || 0,
    opportunities: data[`open_${programme}`]?.doc_count || 0,
    applied: data[`${type}_applied_${stage}`]?.applicants?.value || 0,
    accepted: data[`${type}_an_accepted_${stage}`]?.applicants?.value || 0,
    approved: data[`${type}_approved_${stage}`]?.applicants?.value || 0,
    realized: data[`${type}_realized_${stage}`]?.applicants?.value || 0,
    finished: data[`${type}_finished_${stage}`]?.applicants?.value || 0,
    completed: data[`${type}_completed_${stage}`]?.applicants?.value || 0,
  };
}

// Define filter patterns
var ogvPattern = /^o.*7(?<!_i_)$/;
var ogtaPattern = /^o.*8(?<!_i_)$/;
var ogtePattern = /^o.*9(?<!_i_)$/;
var igvPattern = /^i.*7(?<!_o_)$/;
var igtaPattern = /^i.*8(?<!_o_)$/;
var igtePattern = /^i.*9(?<!_o_)$/;
var totalPattern = /_ogx$|_total$/;

// Example usage
function myFunction() {
  var ogvData = fetchData('2024-01-30', '2024-02-05', ogvPattern);
  var ogtaData = fetchData('2024-01-30', '2024-02-05', ogtaPattern);
  var ogteData = fetchData('2024-01-30', '2024-02-05', ogtePattern);
  var igvData = fetchData('2024-01-30', '2024-02-05', igvPattern);
  var igtaData = fetchData('2024-01-30', '2024-02-05', igtaPattern);
  var igteData = fetchData('2024-01-30', '2024-02-05', igtePattern);
  var totalData = fetchData('2024-01-30', '2024-02-05', totalPattern);

  var igta = extractData('programme', 'i', '8', igteData);
  var igte = extractData('programme', 'i', '9', igteData);
  var igv = extractData('programme', 'i', '7', igvData);
  var ogv = extractData('programme', 'o', '7', ogvData);
  var ogta = extractData('programme', 'o', '8', ogvData);
  var ogte = extractData('programme', 'o', '9', ogvData);
  var total = {
    opens: totalData.open_ogx?.doc_count || 0,
    applied: totalData.applied_total?.applicants?.value || 0,
    accepted: totalData.an_accepted_total?.applicants?.value || 0,
    approved: totalData.approved_total?.applicants?.value || 0,
    realized: totalData.realized_total?.applicants?.value || 0,
    finished: totalData.finished_total?.applicants?.value || 0,
    completed: totalData.completed_total?.applicants?.value || 0,
  };

  console.log('ogte:', ogte);
  console.log('ogta:', ogta);
  console.log('ogv:', ogv);
  console.log('igte:', igte);
  console.log('igta:', igta);
  console.log('igv:', igv);
  console.log('total:', total);
}
