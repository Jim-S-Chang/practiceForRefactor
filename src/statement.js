

function statement(invoice, plays) {
  return renderText(generateStatementData(invoice, plays))
}


function htmlStatement(invoice, plays) {
  return renderHtml(generateStatementData(invoice, plays))
}

function renderText(data) {
  const format = generateNumberFormat()
  let result = `Statement for ${data.customer}\n`;
 
  for (let play of data.playsInfo) {
    result += ` ${play.playName}: ${format(play.amount / 100)} (${play.audience} seats)\n`;
  }

  result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
  result += `You earned ${data.volumeCredits} credits \n`;
  return result;
}

function renderHtml(data) {
  const format = generateNumberFormat()
  let result = `<h1>Statement for ${data.customer}</h1>\n`
  result += `<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
 
  for (let play of data.playsInfo) {
    result += ` <tr><td>${play.playName}</td><td>${play.audience}</td><td>${format(play.amount / 100)}</td></tr>\n`;
  }

  result += `</table>\n<p>Amount owed is <em>${format(data.totalAmount / 100)}</em></p>\n`;
  result += `<p>You earned <em>${data.volumeCredits}</em> credits</p>\n`;
  return result;
}

module.exports = {
  statement,
  htmlStatement
}

function generateNumberFormat() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function generateStatementData(invoice, plays) {
  let totalAmount = calculateTotalAmount(invoice, plays);
  let volumeCredits = calculateAllPlayCredits(invoice, plays);
  let {customer} = invoice
  let playsInfo = generatePlaysInfo(invoice, plays);
  let result = { totalAmount, volumeCredits, playsInfo, customer }

  return result
}

function generatePlaysInfo(invoice, plays) {
  let playsInfo = []
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let amount = calculateOnePlayAmount(play, perf);
    playsInfo.push({
      amount,
      playName: play.name,
      audience: perf.audience
    });
  }
  return playsInfo
}

function calculateTotalAmount(invoice, plays) {
  let totalAmount = 0;
  invoice.performances.forEach(perf => totalAmount += calculateOnePlayAmount(plays[perf.playID], perf))
  return totalAmount;
}

function calculateAllPlayCredits(invoice, plays) {
  let volumeCredits = 0;
  invoice.performances.forEach(perf => volumeCredits += calculateCreditsForOnePlay(perf, plays[perf.playID]))
  return volumeCredits;
}

function calculateCreditsForOnePlay(perf, play) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function calculateOnePlayAmount(play, perf) {
  switch (play.type) {
    case 'tragedy':
      return calculateTragedyAmount(perf);
    case 'comedy':
      return calculateComedyAmount(perf);
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
}

function calculateTragedyAmount(perf) {
  let thisAmount = 40000;
  if (perf.audience > 30) {
    thisAmount += 1000 * (perf.audience - 30);
  }
  return thisAmount;
}

function calculateComedyAmount(perf) {
  let thisAmount = 30000;
  if (perf.audience > 20) {
    thisAmount += 10000 + 500 * (perf.audience - 20);
  }
  thisAmount += 300 * perf.audience;
  return thisAmount;
}

