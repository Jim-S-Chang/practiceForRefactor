const test = require('ava')
import { statement, htmlStatement } from '../src/statement';

test('test one comedy with 20 audience', t => {
    const plays = {
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
          }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 20,
              }
        ]
    }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\n As You Like It: $360.00 (20 seats)\nAmount owed is $360.00\nYou earned 4 credits \n');
})

test('test one comedy with 21 audience', t => {
    const plays = {
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
          }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 21,
              }
        ]
    }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\n As You Like It: $468.00 (21 seats)\nAmount owed is $468.00\nYou earned 4 credits \n');
})

test('test one tragedy with 30 audience', t => {
    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': [
          {
            'playID': 'hamlet',
            'audience': 30,
          }
        ]
    }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\n Hamlet: $400.00 (30 seats)\nAmount owed is $400.00\nYou earned 0 credits \n');
})

test('test one tragedy with 31 audience', t => {
    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': [
          {
            'playID': 'hamlet',
            'audience': 31,
          }
        ]
    }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\n Hamlet: $410.00 (31 seats)\nAmount owed is $410.00\nYou earned 1 credits \n');
})

test('test fail with error play type', t => {
    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy1',
        }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': [
          {
            'playID': 'hamlet',
            'audience': 30,
          }
        ]
    }

    try {
        const result = statement(invoice, plays)
        t.fail();
    } catch (error) {
        t.is(error.message, 'unknown type: tragedy1');
    }
})

test('test no performance', t => {
    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        }
    }
    const invoice = {
        'customer': 'BigCo',
        'performances': []
    }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n');
})

test('test three plays', t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
          {
            'playID': 'hamlet',
            'audience': 55,
          },
          {
            'playID': 'as-like',
            'audience': 35,
          },
          {
            'playID': 'othello',
            'audience': 40,
          },
        ],
      }
      
      
      const plays = {
        'hamlet': {
          'name': 'Hamlet',
          'type': 'tragedy',
        },
        'as-like': {
          'name': 'As You Like It',
          'type': 'comedy',
        },
        'othello': {
          'name': 'Othello',
          'type': 'tragedy',
        },
      }

    const result = statement(invoice, plays)
    t.is(result, 'Statement for BigCo\n' +
    ' Hamlet: $650.00 (55 seats)\n' +
    ' As You Like It: $580.00 (35 seats)\n' +
    ' Othello: $500.00 (40 seats)\n' +
    'Amount owed is $1,730.00\n' +
    'You earned 47 credits \n');
})

test('test HTML three plays', t => {
  const invoice = {
      'customer': 'BigCo',
      'performances': [
        {
          'playID': 'hamlet',
          'audience': 55,
        },
        {
          'playID': 'as-like',
          'audience': 35,
        },
        {
          'playID': 'othello',
          'audience': 40,
        },
      ],
    }
    
    
    const plays = {
      'hamlet': {
        'name': 'Hamlet',
        'type': 'tragedy',
      },
      'as-like': {
        'name': 'As You Like It',
        'type': 'comedy',
      },
      'othello': {
        'name': 'Othello',
        'type': 'tragedy',
      },
    }

  const result = htmlStatement(invoice, plays)
  t.is(result, '<h1>Statement for BigCo</h1>\n' +
  '<table>\n' +
  '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
  ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
  ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
  ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
  '</table>\n' +
  '<p>Amount owed is <em>$1,730.00</em></p>\n' +
  '<p>You earned <em>47</em> credits</p>\n');

})
