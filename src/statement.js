function statement (invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;

  const data = gengrateStatementData(invoice, plays)
  
  for (let play of data.playsInfo) {
    result += ` ${play.playName}: ${format(play.amount / 100)} (${play.audience} seats)\n`;
  }
  
  result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
  result += `You earned ${data.volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
}

function gengrateStatementData(invoice, plays) {
  let totalAmount = calculateTotalAmount(invoice, plays);
  let volumeCredits = calculateAllPlayCredits(invoice, plays);
  let playsInfo = []
  let result = {totalAmount, volumeCredits, playsInfo}


  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let amount = calculatePlayAmount(play, perf)
    result.playsInfo.push({
      amount,
      playName: play.name,
      audience: perf.audience
    })
  }

  return result
}

function calculateTotalAmount(invoice, plays) {
  let totalAmount = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    thisAmount = calculatePlayAmount(play, perf);
    totalAmount += thisAmount;
  }
  return totalAmount;
}

function calculateAllPlayCredits(invoice, plays) {
  let volumeCredits = 0;
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    volumeCredits += calculateCreditsForOnePlay(perf, play);
  }
  return volumeCredits;
}

function calculateCreditsForOnePlay(perf, play) {
  let volumeCredits = 0;
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function calculatePlayAmount(play, perf) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

